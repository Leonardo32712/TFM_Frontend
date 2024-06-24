import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfile } from '../models/user/userProfile';
import { UserUpdate } from '../models/user/userUpdate';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject } from 'rxjs';
import { CustomError } from '../models/customError';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSource = new BehaviorSubject<UserProfile>(this.getCurrentUser())
  public currentUser = this.userSource.asObservable()

  constructor(private http: HttpClient, private auth: Auth) { }

  private getCurrentUser(): UserProfile{
    const user = this.auth.currentUser
    return {
      uid: user?.uid || '',
      email: user?.email || '',
      emailVerified: user?.emailVerified == true,
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || ''
    }
  }

  public logInEmailAndPassword(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((_userCredentials) => {
          this.userSource.next(this.getCurrentUser())
          resolve('User logged in successfuly.')
        }).catch((error) => {
          reject(error)
        })
    })
  }

  public signUp(newUser: UserUpdate): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const formData: FormData = new FormData();
      if(newUser.displayName == null || newUser.email == null || newUser.password == null){
        reject('Bad request. There are empty fields.')
      }

      const fields: (keyof UserUpdate)[] = ['displayName', 'email', 'password', 'photo'];

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

      this.http.post<{message: string}>(environment.backendURL + '/users', formData, { observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.body && response.status == 201) {
              resolve(response.body.message)
            } else {
              reject('Unexpected error signing up user.')
            }
          }, error: (error: CustomError) => {
            console.log(error.originalError || error.name)
            reject(error.name)
          }
        })
    });
  }

  public updateUserData(newUserData: UserUpdate): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('User not logged in.')
      }
      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const formData: FormData = new FormData();
        const fields: (keyof UserUpdate)[] = ['displayName', 'email', 'photo'];

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
        this.http.put<{message: string}>(environment.backendURL + '/users', formData, { headers , observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.status == 200 && response.body) {
              resolve(response.body.message)
            } else {
              reject('Unexpected error updating user.')
            }
          }, error: (error: CustomError) => {
            console.log(error.originalError || error.name)
            reject(error.name)
          }
        })
      }).catch((_error) => {
        reject('User not logged in.')
      })
    })
  }

  public async logOut(): Promise<void> {
    await this.auth.signOut();
    this.userSource.next(this.getCurrentUser())
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
          }, error: (error: CustomError) => {
            console.log(error.originalError || error.name)
            reject(error.name)
          }
        })
      }).catch((_error) => {
        reject('User not logged in.')
      })
    })
  }
}
