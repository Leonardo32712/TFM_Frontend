import { Auth, signInWithEmailAndPassword, user } from "@angular/fire/auth"
import { logInControllerErrorHandler, signUpControllerErrorHandler } from "./auth.error.controller"
import { signUpUser } from "../models/signUpUser"
import { HttpClient } from "@angular/common/http"
import { userProfile } from "../models/userProfile"
import { basicUser } from "../models/basicUser"

export const logInWithEmailAndPasswordController = ((auth: Auth, email: string, password: string): Promise<string> => {
    return new Promise<string>((resolve,reject) => {
        signInWithEmailAndPassword(auth,email,password)
        .then((_userCredentials) => {
            resolve('Sesión iniciada correctamente. Redirigiendo a la página principal...')
        }).catch((error: any) => {
            reject(logInControllerErrorHandler(error))
        })
    })
})

export const singUpController = ((http: HttpClient, user: signUpUser): Promise<string> => {
    return new Promise<string>((resolve,reject) => {
        const formData: FormData = new FormData();
        formData.append('displayName', user.username);
        formData.append('email', user.email);
        formData.append('password', user.password);
        if (user.profilePic) {
            formData.append('photoURL', user.profilePic);
        }

        http.post('http://localhost:3000/users/signup', formData, { observe: 'response' })
        .subscribe({
            next: (response) => {
                if(response.status == 201) {
                    resolve('Usuario registrado correctamente')
                } else {
                    reject('Error inesperado en el registro de usuario')
                }
            }, error: (error: any) => {
                reject(signUpControllerErrorHandler(error))
            }
        })
    });
})

export const getUserProfileController = ((auth: Auth): Promise<userProfile> => {
    return new Promise<userProfile>((resolve, reject) => {
        user(auth).subscribe((loggedUser) => {
          if(loggedUser){
            const user: userProfile = {
              email: loggedUser.email,
              emailVerified: loggedUser.emailVerified,
              displayName: loggedUser.displayName,
              photoURL: loggedUser.photoURL,
            }
            resolve (user);
          } else {
            reject('User not logged in')
          }
        })
    })
})

export const getBasicUserDataController = (auth: Auth): Promise<basicUser> => {
    return new Promise<basicUser>((resolve, reject) => {
        user(auth).subscribe((loggedUser) => {
          if(loggedUser){
            const displayName = loggedUser.displayName;
            const photoURL = loggedUser.photoURL;
            resolve ({
              displayName: displayName,
              photoURL: photoURL
            });
          } else {
            reject('User not logged in')
          }
        })
    })
}

export const logOutController = (auth: Auth): void => {
    auth.signOut();
}