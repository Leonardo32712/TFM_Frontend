import { HttpClient, HttpParams } from "@angular/common/http";
import { BACKEND_URL } from "src/environments/environment";
import { Review } from "../models/review";

export const getReviewsController = ((http: HttpClient, movieId: string) => {
    const params = new HttpParams().set('movie_id', movieId)
    return http.get<Record<string, Review>>(BACKEND_URL + '/reviews', { params })
})