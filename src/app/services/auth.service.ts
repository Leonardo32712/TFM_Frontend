import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { basicUser } from '../models/basicUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  public logInEmailAndPassword(email: string, password: string): Promise<basicUser> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(async (val) => {
        if (val.user) {
          const idToken = await val.user.getIdToken();
          return {
            displayName: val.user.displayName,
            photoURL: val.user.photoURL,
            idToken: idToken
          } as basicUser;
        } else {
          throw new Error('User not found');
        }
      });
  }
}
