import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { userProfile } from '../models/user/userProfile';
import { userUpdate } from '../models/user/userUpdate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private auth: Auth) { }

  public logInEmailAndPassword(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((_userCredentials) => {
          resolve('Sesión iniciada correctamente.')
        }).catch((error) => {
          reject(error)
        })
    })
  }

  public signUp(newUser: userUpdate): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const formData: FormData = new FormData();
      if(newUser.displayName == null || newUser.email == null || newUser.password == null){
        reject('Bad request. There are empty fields.')
      }

      const fields: (keyof userUpdate)[] = ['displayName', 'email', 'password', 'photo'];

      fields.forEach(field => {
        const value = newUser[field];
        if (value) {
          if (value instanceof File) {
            formData.append(field, value, value.name);
          } else if (typeof value === 'string') {
            formData.append(field, value);
          }
        }
      });

      this.http.post<{message: string}>(environment.backendURL + '/users/signup', formData, { observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.body && response.status == 201) {
              resolve(response.body.message)
            } else {
              reject('Unexpected error signing up user.')
            }
          }, error: (error) => {
            reject(error)
          }
        })
    });
  }

  public getUserProfile(): Promise<userProfile> {
    return new Promise<userProfile>((resolve, reject) => {
      user(this.auth).subscribe((loggedUser) => {
        if (loggedUser) {
          const user: userProfile = {
            uid: loggedUser.uid,
            email: loggedUser.email,
            emailVerified: loggedUser.emailVerified,
            displayName: loggedUser.displayName,
            photoURL: loggedUser.photoURL
          }
          resolve(user);
        } else {
          reject('User not logged in')
        }
      })
    })
  }

  public updateUserData(newUserData: userUpdate): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('User not logged in.')
      }
      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const formData: FormData = new FormData();
        const fields: (keyof userUpdate)[] = ['displayName', 'email', 'photo'];

        fields.forEach(field => {
          const value = newUserData[field];
          if (value) {
            if (value instanceof File) {
              formData.append(field, value, value.name);
            } else if (typeof value === 'string') {
              formData.append(field, value);
            }
          }
        });
        
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken
        });
        this.http.put<{message: string}>(environment.backendURL + '/users/updateData', formData, { headers , observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.status == 201 && response.body) {
              resolve(response.body.message)
            } else {
              reject('Unexpected error updating user.')
            }
          }, error: (error) => {
            reject(error)
          }
        })
      }).catch((_error) => {
        reject('User not logged in.')
      })
    })
  }

  public getBasicUserData(): Promise<userProfile | undefined> {
    return new Promise<userProfile | undefined>((resolve, _reject) => {
      user(this.auth).subscribe((loggedUser) => {
        if (loggedUser) {
          const user: userProfile = {
            uid: loggedUser.uid,
            email: loggedUser.email,
            emailVerified: loggedUser.emailVerified,
            displayName: loggedUser.displayName,
            photoURL: loggedUser.photoURL
          }
          resolve(user);
        } else {
          resolve(undefined)
        }
      })
    })
  }

  public logOut(): void {
    this.auth.signOut();
  }

  public deleteAccount(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('User not logged in.')
      }
      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken
        });

        this.http.delete<{message: string}>(environment.backendURL + '/users', {
          headers: headers,
          observe: 'response'
        }).subscribe({
          next: (response) => {
            if (response.status == 200 && response.body) {
              resolve(response.body.message)
            } else {
              reject('Unexpected error deleting your account.')
            }
          }, error: (error) => {
            reject(error)
          }
        })
      }).catch((_error) => {
        reject('User not logged in.')
      })
    })
  }
}
