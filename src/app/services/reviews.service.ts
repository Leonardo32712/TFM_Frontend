import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getReviewsController } from '../controllers/reviews.controller';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient){}

  public getReviews(movieId: string) {
    return getReviewsController(this.http, movieId)
  }
}
