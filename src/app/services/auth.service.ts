import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { basicUser } from '../models/basicUser';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) { }

  public async logInEmailAndPassword(email: string, password: string): Promise<basicUser> {
    try {
      const userCredentials = await this.afAuth.signInWithEmailAndPassword(email, password);
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
            return Promise.reject('Las credenciales ingresadas son incorrectas. Verifique su correo electrónico y contraseña')
          case 'auth/invalid-email':
            return Promise.reject('El correo electrónico ingresado no es válido. Por favor, verifica y vuelve a intentarlo.')
          case 'auth/missing-password':
            return Promise.reject('Por favor, ingrese su contraseña.')
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
                            reject('El correo introducido no tiene un formato válido. Por favor, pruebe a escribirlo de nuevo.');
                            break;
                        case 'auth/invalid-password':
                            reject('La contraseña debe tener al menos 6 caracteres.');
                            break;
                        default:
                            reject('Ha ocurrido un error al intentar registrar su usuario. Por favor, inténtelo de nuevo más tarde.');
                            break;
                    }
                }
            });
    });
}

}
