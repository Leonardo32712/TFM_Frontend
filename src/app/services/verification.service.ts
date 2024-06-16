import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BACKEND_URL } from 'src/environments/environment';
import { VerificationRequest } from '../models/verificationRequest';

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
          'Content-Type': 'application/json'
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
          }, error: (error) => {
            reject(error)
          }
        })
      }).catch((_error) => {
        reject('User not logged in')
      })
    })
  }

  public getRequests(): Promise<VerificationRequest[]> {
    return new Promise<VerificationRequest[]>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('Admin not logged in.')
      }
      
      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken
        });

      this.http.get<VerificationRequest[]>(BACKEND_URL + '/verification', { headers , observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.body && response.status == 200) {
              resolve(response.body)
            } else {
              reject('Unexpected error getting requests.')
            }
          }, error: (error) => {
            reject(error)
          }
        })
      }).catch((error) => {
        reject(error)
      })
    })
  }

  public updateRequestStatus(requestID: string, newStatus: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('Admin not logged in.')
      }

      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken,
          'Content-Type': 'application/json'
        });
        
        const body = {requestID, newStatus}
        this.http.patch<{message: string}>(BACKEND_URL + '/verification', body, { headers, observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.body) {
              resolve(response.body.message)
            } else {
              reject('Unexpected error updating requests.')
            }
          }, error: (error) => {
            reject(error)
          }
        })
      }).catch((_error) => {
        reject('Admin not logged in')
      })
    })
  }
}
