import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BACKEND_URL } from "src/environments/environment";
import { Review, ReviewWithMovieID } from "../models/review";
import { Auth } from "@angular/fire/auth";
import { Observable, from, switchMap } from "rxjs";

export const getReviewsController = ((http: HttpClient, movieId: string) => {
    const params = new HttpParams().set('movie_id', movieId)
    return http.get<Record<string, Review>>(BACKEND_URL + '/reviews', { params })
})

export const postReviewController = (http: HttpClient, auth: Auth, review: ReviewWithMovieID): Observable<{ message: string, reviewId: string }> => {
    return from(auth.currentUser?.getIdToken() ?? Promise.resolve('')).pipe(
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
            .set('score', review.score.toString())
            .set('review', review.review);
        
        return http.post<{ message: string, reviewId: string }>(BACKEND_URL + '/reviews', body.toString(), { headers, params });
      })
    );
  }