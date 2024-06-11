import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { deleteReviewController, getReviewsController, postReviewController } from '../controllers/reviews.controller';
import { ReviewWithMovieID } from '../models/review';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient, private auth: Auth){}

  public getReviews(movieId: string) {
    return getReviewsController(this.http, movieId)
  }

  public postReview(review: ReviewWithMovieID) {
    return postReviewController(this.http, this.auth, review)
  }

  public deleteReview(reviewId: string, movieId: number){
    return deleteReviewController(this.auth, this.http, reviewId, movieId)
  }
}
