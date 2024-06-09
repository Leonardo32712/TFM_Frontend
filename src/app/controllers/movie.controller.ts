import { HttpClient, HttpParams } from "@angular/common/http"
import { CarouselMovie } from "../models/carouselMovie"
import { BACKEND_URL } from "src/environments/environment"
import { MoviePoster } from "../models/moviePoster"
import { Movie } from "../models/movie"

export const getCarouselController = (http: HttpClient) => {
    return http.get<CarouselMovie[]>(BACKEND_URL + '/movies/carousel')
}

export const getHomeListController = (http: HttpClient) => {
    return http.get<MoviePoster[]>(BACKEND_URL + '/movies/home-list')
}

export const searchMovieController = (http: HttpClient, query: string, page: number) => {
    const params = new HttpParams().set('q', query).set('p', page)
    return http.get<MoviePoster[]>(BACKEND_URL + '/movies/search', { params })
}

export const getMovieController = (http: HttpClient, movieId: string) => {
    const params = new HttpParams().set('movie_id', movieId)
    return http.get<Movie>(BACKEND_URL + '/movies', { params })
}