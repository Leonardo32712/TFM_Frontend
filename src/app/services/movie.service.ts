import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getCarouselController, getHomeListController, getMovieController, searchMovieController } from '../controllers/movie.controller';
import { BACKEND_URL } from 'src/environments/environment';
import { BasicActor } from '../models/basicActor';
import { Actor } from '../models/actor';
import { MoviePoster } from '../models/moviePoster';

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

  public getCasting(movieId: string) {
    const params = new HttpParams().set('movie_id', movieId)
    return this.http.get<BasicActor[]>(BACKEND_URL + '/movies/credits', { params })
  }

  public getActor(actorId: string) {
    const params = new HttpParams().set('actor_id', actorId)
    return this.http.get<Actor>(BACKEND_URL + '/movies/actor', { params })
  }

  public getMoviesByActor(actorId: string) {
    const params = new HttpParams().set('actor_id', actorId)
    return this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/by-actor', { params })
  }
}
