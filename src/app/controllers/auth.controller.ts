import { Auth, signInWithEmailAndPassword, user } from "@angular/fire/auth"
import { deleteAccountErrorHandler, logInControllerErrorHandler, signUpControllerErrorHandler } from "./auth.error.controller"
import { signUpUser } from "../models/signUpUser"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { userProfile } from "../models/userProfile"
import { basicUser } from "../models/basicUser"
import { BACKEND_URL } from "src/environments/environment"

export const logInWithEmailAndPasswordController = ((auth: Auth, email: string, password: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                userCredentials.user.getIdToken().then((idtoken) => {
                    localStorage.setItem('idtoken', idtoken)
                })
                resolve('Sesión iniciada correctamente.')
            }).catch((error: any) => {
                reject(logInControllerErrorHandler(error))
            })
    })
})

export const singUpController = ((http: HttpClient, user: signUpUser): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const formData: FormData = new FormData();
        formData.append('displayName', user.username);
        formData.append('email', user.email);
        formData.append('password', user.password);
        if (user.profilePic) {
            formData.append('photo', user.profilePic, user.profilePic.name);
        }

        http.post(BACKEND_URL + '/users/signup', formData, {
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
})

export const getUserProfileController = ((auth: Auth): Promise<userProfile> => {
    return new Promise<userProfile>((resolve, reject) => {
        user(auth).subscribe((loggedUser) => {
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
})

export const getBasicUserDataController = (auth: Auth): Promise<basicUser> => {
    return new Promise<basicUser>((resolve, reject) => {
        user(auth).subscribe((loggedUser) => {
            if (loggedUser) {
                const displayName = loggedUser.displayName;
                const photoURL = loggedUser.photoURL;
                resolve({
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

export const deleteAccountController = (http: HttpClient, auth: Auth): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        if (auth.currentUser != null) {
            auth.currentUser.getIdToken()
            .then((idToken) => {
                const headers = new HttpHeaders({
                    'Authorization': idToken
                });
    
                http.delete<string>(BACKEND_URL + '/users', {
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