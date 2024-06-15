import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND_URL } from 'src/environments/environment';
import { MoviePoster } from '../models/movie/moviePoster';
import { CarouselMovie } from "../models/movie/carouselMovie"
import { Movie } from "../models/movie/movie"

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient){}

  public getCarousel(): Promise<CarouselMovie[]> {
    return new Promise<CarouselMovie[]>((resolve, reject) => {
      this.http.get<CarouselMovie[]>(BACKEND_URL + '/movies/carousel', { observe: 'response' })
      .subscribe({
        next: (response) => {
          if(response.body && response.status == 200){
            resolve(response.body)
          } else {
            reject('Unexpected error getting movie carousel.')
          }
        }, error: (error) => {
          reject(error)
        }
      })
    })
  }

  public getHomeList(): Promise<MoviePoster[]> {
    return new Promise<MoviePoster[]>((resolve, reject) => {
      this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/home-list', { observe: 'response' }).subscribe({
        next: (response) => {
          if(response.body && response.status == 200){
            resolve(response.body)
          } else {
            reject('Unexpected error getting movie home list.')
          }
        }, error: (error) => {
          reject(error)
        }
      })
    })
  }

  public searchMovie(query: string, page: number): Promise<MoviePoster[]> {
    return new Promise<MoviePoster[]>((resolve, reject) => {
      const params = new HttpParams().set('q', query).set('p', page)
      this.http.get<MoviePoster[]>(BACKEND_URL + '/movies/search', { params, observe: 'response' }).subscribe({
        next: (response) => {
          if(response.body && response.status == 200){
            resolve(response.body)
          } else {
            reject('Unexpected error getting movie query.')
          }
        }, error: (error) => {
          reject(error)
        }
      })
    })
  }

  public getMovie(movieId: string): Promise<Movie>{
    return new Promise<Movie>((resolve, reject) => {
    const params = new HttpParams().set('movie_id', movieId)
    return this.http.get<Movie>(BACKEND_URL + '/movies', { params, observe: 'response' }).subscribe({
      next: (response) => {
        if(response.body && response.status == 200){
          resolve(response.body)
        } else {
          reject('Unexpected error getting movie data.')
        }
      }, error: (error) => {
        reject(error)
      }
    })
  })
  }
}
