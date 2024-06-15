import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND_URL } from 'src/environments/environment';
import { Actor } from '../models/actor/actor';
import { ActorProfile } from '../models/actor/actorProfile';
import { MoviePoster } from '../models/movie/moviePoster';
import { CarouselMovie } from "../models/movie/carouselMovie"
import { Movie } from "../models/movie/movie"

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
    const params = new HttpParams().set('q', query).set('p', page)
    return this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/search', { params })
  }

  public getMovie(movieId: string){
    const params = new HttpParams().set('movie_id', movieId)
    return this.http.get<Movie>(BACKEND_URL + '/movies', { params })
  }

  public getCasting(movieId: string) {
    const params = new HttpParams().set('movie_id', movieId)
    return this.http.get<Actor[]>(BACKEND_URL + '/movies/credits', { params })
  }

  public getActor(actorId: string) {
    const params = new HttpParams().set('actor_id', actorId)
    return this.http.get<ActorProfile>(BACKEND_URL + '/movies/actor', { params })
  }

  public getMoviesByActor(actorId: string) {
    const params = new HttpParams().set('actor_id', actorId)
    return this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/by-actor', { params })
  }
}
