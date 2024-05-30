import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarouselMovie } from '../models/carouselMovie';
import { MoviePoster } from '../models/moviePoster';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient){}

  public getCarousel() {
    return this.http.get<CarouselMovie[]>('http://localhost:3000/movies/carousel')
  }

  public getHomeList() {
    return this.http.get<MoviePoster[]>('http://localhost:3000/movies/home-list')
  }

  public searchMovie(query: string, page: number) {
    return this.http.get<MoviePoster[]>('http://localhost:3000/movies/search?q=' + query + '&p=' + page)
  }
}
