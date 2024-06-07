import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CarouselMovie } from '../models/carouselMovie';
import { MoviePoster } from '../models/moviePoster';
import { BACKEND_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient){}

  public getCarousel() {
    return this.http.get<CarouselMovie[]>(BACKEND_URL + '/movies/carousel')
  }

  public getHomeList() {
    return this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/home-list')
  }

  public searchMovie(query: string, page: number) {
    return this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/search?q=' + query + '&p=' + page)
  }
}
