import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BACKEND_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(
    private http: HttpClient,
    private auth: Auth
  ){}

  public requestVerification(requestText: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('User not logged in.')
      }
      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken,
          'Content-Type': 'application/json '
        });

        const body = {text: requestText}
        this.http.post<{message: string}>(BACKEND_URL + '/users/verification', body, { headers , observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.status == 201) {
              resolve('Request verification saved.')
            } else {
              reject('Unexpected error saving request.')
            }
          }, error: (_error) => {
            reject('Error saving request.')
          }
        })
      }).catch((_error) => {
        reject('User not logged in')
      })
    })
  }
}
