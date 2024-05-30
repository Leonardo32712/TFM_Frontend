import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { carouselMovie } from '../models/carouselMovie';
import { moviePoster } from '../models/moviePoster';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient){}

  public getCarousel() {
    return this.http.get<carouselMovie[]>('http://localhost:3000/movies/carousel')
  }

  public getHomeList() {
    return this.http.get<moviePoster[]>('http://localhost:3000/movies/home-list')
  }
}
