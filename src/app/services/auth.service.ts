import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { basicUser } from '../models/basicUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

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
}
