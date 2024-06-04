import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { basicUser } from '../models/basicUser';
import { HttpClient} from '@angular/common/http';
import { userProfile } from '../models/userProfile';
import { getBasicUserDataController, getUserProfileController, logInWithEmailAndPasswordController, logOutController, singUpController } from '../controllers/auth.controller';
import { signUpUser } from '../models/signUpUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private afAuth: Auth) { }

  public logInEmailAndPassword(email: string, password: string): Promise<string> {
    return logInWithEmailAndPasswordController(this.afAuth, email, password)
  }

  public signUp(user: signUpUser): Promise<string> {
    return singUpController(this.http, user)
  }

  public getUserProfile(): Promise<userProfile>{
    return getUserProfileController(this.afAuth)
  }

  public getBasicUserData(): Promise<basicUser>{
    return getBasicUserDataController(this.afAuth)
  }

  logOut(){
    return logOutController(this.afAuth)
  }
}
