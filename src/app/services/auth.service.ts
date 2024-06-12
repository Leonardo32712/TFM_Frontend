import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { deleteAccountErrorHandler, logInControllerErrorHandler, signUpControllerErrorHandler } from "../controllers/auth.controller.error"
import { basicUser } from '../models/user/basicUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { userProfile } from '../models/user/userProfile';
import { signUpUser } from '../models/user/signUpUser';
import { BACKEND_URL } from "src/environments/environment"
import { userUpdate } from '../models/user/userUpdate';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private auth: Auth) { }

  public logInEmailAndPassword(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredentials) => {
          userCredentials.user.getIdToken().then((idtoken) => {
            localStorage.setItem('idtoken', idtoken) ///////////////////////////
          })
          resolve('Sesión iniciada correctamente.')
        }).catch((error: any) => {
          reject(logInControllerErrorHandler(error))
        })
    })
  }

  public signUp(user: signUpUser): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const formData: FormData = new FormData();
      formData.append('displayName', user.username);
      formData.append('email', user.email);
      formData.append('password', user.password);
      if (user.profilePic) {
        formData.append('photo', user.profilePic, user.profilePic.name);
      }

      this.http.post(BACKEND_URL + '/users/signup', formData, {
        observe: 'response'
      })
        .subscribe({
          next: (response) => {
            if (response.status == 201) {
              resolve('Usuario registrado correctamente')
            } else {
              reject('Error inesperado en el registro de usuario')
            }
          }, error: (error: any) => {
            reject(signUpControllerErrorHandler(error))
          }
        })
    });
  }

  public getUserProfile(): Promise<userProfile> {
    return new Promise<userProfile>((resolve, reject) => {
      user(this.auth).subscribe((loggedUser) => {
        if (loggedUser) {
          const user: userProfile = {
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
      if (this.auth.currentUser != null) {
        this.auth.currentUser.getIdToken()
        .then((idToken) => {
          const formData: FormData = new FormData();
          const fields: (keyof userUpdate)[] = ['displayName', 'email', 'photoURL'];

          fields.forEach(field => {
            const value = newUserData[field];
            if (value) {
              if (field === 'photoURL' && value instanceof File) {
                formData.append('photo', value, value.name);
              } else if (typeof value === 'string') {
                formData.append(field, value);
              }
            }
          });
          
          const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + idToken
          });
          this.http.put(BACKEND_URL + '/users/updateData', formData, { headers , observe: 'response' })
          .subscribe({
            next: (response) => {
              if (response.status == 201) {
                resolve('Usuario actualizado correctamente')
              } else {
                reject('Error inesperado en la actualización de usuario')
              }
            }, error: (error) => {
              reject(error)
            }
          })
        }).catch((_error) => {
          reject('Usuario no autenticado')
        })
      } else {
        reject('Usuario no autenticado')
      }   
    })
  }

  public getBasicUserData(): Promise<basicUser | undefined> {
    return new Promise<basicUser | undefined>((resolve, _reject) => {
      user(this.auth).subscribe((loggedUser) => {
        if (loggedUser) {
          const user: basicUser = {
            uid: loggedUser.uid,
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

  public logOut() {
    this.auth.signOut();
  }

  public deleteAccount() {
    return new Promise<string>((resolve, reject) => {
      if (this.auth.currentUser != null) {
        this.auth.currentUser.getIdToken()
          .then((idToken) => {
            const headers = new HttpHeaders({
              'Authorization': 'Bearer ' + idToken
            });

            this.http.delete<string>(BACKEND_URL + '/users', {
              headers: headers,
              observe: 'response'
            }).subscribe({
              next: (response) => {
                if (response.status == 200) {
                  resolve('Su cuenta ha sido eliminada exitosamente.')
                } else {
                  reject('Error inesperado en la eliminación de su cuenta')
                }
              }, error: (error) => {
                reject(deleteAccountErrorHandler(error))
              }
            })
          }).catch((_error) => {
            reject('Usuario no autenticado')
          })
      } else {
        reject('Usuario no autenticado')
      }
    })
  }
}
