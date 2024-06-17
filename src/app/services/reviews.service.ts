import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Review } from '../models/review/review';
import { AllReviews } from '../models/review/allReviews';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient, private auth: Auth) { }

  public getReviews(movieId: string): Promise<AllReviews> {
    const params = new HttpParams().set('movie_id', movieId)
    return new Promise<AllReviews>((resolve, reject) => {
      this.http.get<AllReviews>(environment.backendURL + '/reviews', { params, observe: 'response' })
      .subscribe({
        next: (response) => {
          if(response.body){
            resolve(response.body)
          } else {
            reject('Unexpected error getting reviews.')
          }
        }, error: (error) => {
          reject(error)
        }
      })
    })
  }

  public postReview(newReview: Review): Promise<{message: string, reviewId: string}> {
    return new Promise<{message: string, reviewId: string}>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('User not logged in.')
      }

      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        if (!newReview.movieId) {
          return reject('Bad request. Movie ID not provided.')
        }
        const params: HttpParams = new HttpParams().set('movie_id', newReview.movieId);

        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        });

        let body: HttpParams = new HttpParams()
        const fields: (keyof Review)[] = ['photoURL', 'score', 'text', 'uid', 'username'];
        fields.forEach(field => {
          const value = newReview[field];
          if (value) {
            body = body.set(field, value);
          }
        });

        this.http.post<{message: string, reviewId: string}>
        (environment.backendURL + '/reviews', body, { params, headers, observe: 'response' })
        .subscribe({
          next: (response) => {
            if (response.status == 201 && response.body) {
              return resolve(response.body)
            } else {
              return reject('Unexpecting error updating review.')
            }
          }, error: (error: any) => {
            return reject(JSON.stringify(error))
          }
        })
      })
    })
  }

  public deleteReview(reviewId: string, movieId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.auth.currentUser) {
        return reject('User not logged in.')
      }

      this.auth.currentUser.getIdToken()
      .then((idToken) => {
        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + idToken
        });
  
        const params: HttpParams = new HttpParams()
          .set('movie_id', movieId)
          .set('review_id', reviewId)
  
        this.http.delete<{ message: string }>
        (environment.backendURL + '/reviews', { headers, params, observe: 'response' })
        .subscribe({
          next: (response) => {
            if(response.body && response.status == 200){
              resolve(response.body.message)
            } else {
              reject('Unexpected error deleting review')
            }
          }, error: (error) => {
            reject(error)
          }
        })
      })
    })
  }
}
