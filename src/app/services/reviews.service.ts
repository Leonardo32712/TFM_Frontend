import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ReviewWithMovieID } from '../models/review/review';
import { from, switchMap } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";
import { AllReviews } from '../models/review/allReviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient, private auth: Auth) { }

  public getReviews(movieId: string) {
    const params = new HttpParams().set('movie_id', movieId)
    return this.http.get<AllReviews>(BACKEND_URL + '/reviews', { params })
  }

  public postReview(review: ReviewWithMovieID) {
    return from(this.auth.currentUser?.getIdToken() ?? Promise.resolve('')).pipe(
      switchMap((resultToken) => {
        if (!resultToken) {
          throw new Error('Failed to get ID token');
        }

        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + resultToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        });

        const params: HttpParams = new HttpParams().set('movie_id', review.movieId);

        const body: HttpParams = new HttpParams()
          .set('uid', review.uid)
          .set('username', review.username)
          .set('photoURL', review.photoURL)
          .set('score', review.score)
          .set('text', review.text);

        return this.http.post<{ message: string, reviewId: string }>(BACKEND_URL + '/reviews', body, { headers, params });
      })
    );
  }

  public deleteReview(reviewId: string, movieId: number) {
    return from(this.auth.currentUser?.getIdToken() ?? Promise.resolve('')).pipe(
      switchMap((resultToken) => {
        if (!resultToken) {
          throw new Error('Failed to get ID token');
        }

        const headers: HttpHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + resultToken
        });

        const params: HttpParams = new HttpParams()
          .set('movie_id', movieId)
          .set('review_id', reviewId)

        return this.http.delete<{ message: string, reviewId: string }>(BACKEND_URL + '/reviews', { headers, params });
      })
    );
  }
}
