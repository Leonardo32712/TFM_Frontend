import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, idToken, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { basicUser } from '../models/basicUser';
import { HttpClient} from '@angular/common/http';
import { userProfile } from '../models/userProfile';
import { logInWithEmailAndPasswordController, singUpController } from '../controllers/auth.controller';
import { signUpUser } from '../models/signUpUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private afAuth: Auth) { }

  public logInEmailAndPassword(email: string, password: string): Promise<string> {
    return logInWithEmailAndPasswordController(this.afAuth, email, password)
  }

  async signUp(user: signUpUser): Promise<string> {
    return singUpController(this.http, user)
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
