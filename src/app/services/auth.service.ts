import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, idToken, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { basicUser } from '../models/basicUser';
import { HttpClient} from '@angular/common/http';
import { userProfile } from '../models/userProfile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  afAuth = inject(Auth)
  constructor(private http: HttpClient) { }

  public async logInEmailAndPassword(email: string, password: string): Promise<basicUser> {
    try {
      const userCredentials = await signInWithEmailAndPassword(this.afAuth, email, password);
      if (userCredentials.user != null) {
        const displayName = userCredentials.user.displayName;
        const photoURL = userCredentials.user.photoURL;
        const idToken = await userCredentials.user.getIdToken(true);
        return {
          displayName: displayName,
          photoURL: photoURL,
          idToken: idToken
        };
      } else {
        return Promise.reject('Usuario no encontrado');
      }
    } catch (error) {
      const errorCode = (error as any).code;
      switch (errorCode) {
          case 'auth/invalid-credential':
            return Promise.reject('Las credenciales ingresadas son incorrectas.')
          case 'auth/invalid-email':
            return Promise.reject('El correo electrónico ingresado no es válido.')
          case 'auth/missing-password':
            return Promise.reject('La contraseña no ha sido introducida')
          default:
            return Promise.reject('Ha ocurrido un error al intentar iniciar sesión. Por favor, intentalo de nuevo más tarde.')
        }
    }
  }

  async signUp(username: string, email: string, password: string, profilePic: File | null): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('displayName', username);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePic) {
        formData.append('photoURL', profilePic, profilePic.name);
    }

    return new Promise<string>((resolve, reject) => {
      this.http.post('http://localhost:3000/users/signup', formData, { observe: 'response' })
          .subscribe({
              next: (response) => {
                resolve(response.statusText || 'Registro exitoso.');
              },
              error: (error) => {
                  const errorCode = (error as any).error.code;
                  switch (errorCode) {
                      case 'backend/invalid-email':
                        reject('El correo introducido no tiene un formato válido.');
                        break;
                      case 'auth/invalid-password':
                        reject('La contraseña debe tener al menos 6 caracteres.');
                        break;
                      case 'auth/email-already-exists':
                        reject('El correo introducido pertenece a una cuenta existente.');
                        break;
                      default:
                        reject('Ha ocurrido un error al intentar registrar su usuario. Por favor, inténtelo de nuevo más tarde.');
                        break;
                  }
              }
          });
    });
  }

  getUserData(): Promise<userProfile>{
    return new Promise<userProfile>((resolve, reject) => {
      user(this.afAuth).subscribe(async (loggedUser) => {
        if(loggedUser){
          const email = loggedUser.email
          const emailVerified = loggedUser.emailVerified
          const displayName = loggedUser.displayName;
          const photoURL = loggedUser.photoURL;
          const idToken = await loggedUser.getIdToken(true);
          resolve ({
            email: email,
            emailVerified: emailVerified,
            displayName: displayName,
            photoURL: photoURL,
            idToken: idToken
          });
        } else {
          reject('User not logged in')
        }
      })
    })
  }

 getBasicUserData(): Promise<basicUser>{
    return new Promise<basicUser>((resolve, reject) => {
      user(this.afAuth).subscribe(async (loggedUser) => {
        if(loggedUser){
          const displayName = loggedUser.displayName;
          const photoURL = loggedUser.photoURL;
          const idToken = await loggedUser.getIdToken(true);
          resolve ({
            displayName: displayName,
            photoURL: photoURL,
            idToken: idToken
          });
        } else {
          reject('User not logged in')
        }
      })
    })
  }

  logOut(){
    this.afAuth.signOut()
  }
}
