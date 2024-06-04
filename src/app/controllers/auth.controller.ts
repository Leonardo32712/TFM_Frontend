import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth"
import { logInControllerErrorHandler, signUpControllerErrorHandler } from "./auth.error.controller"
import { signUpUser } from "../models/signUpUser"
import { HttpClient } from "@angular/common/http"

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