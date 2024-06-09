import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getCarouselController, getHomeListController, getMovieController, searchMovieController } from '../controllers/movie.controller';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient){}

  public getCarousel() {
    return getCarouselController(this.http)
  }

  public getHomeList() {
    return getHomeListController(this.http)
  }

  public searchMovie(query: string, page: number) {
    return searchMovieController(this.http, query, page)
  }

  public getMovie(movieId: string){
    return getMovieController(this.http, movieId)
  }
}
