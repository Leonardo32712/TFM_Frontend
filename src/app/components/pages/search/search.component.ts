import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviePoster } from 'src/app/models/movie/moviePoster';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  query: string = ''
  movies: MoviePoster[] = []

  constructor(
    private movieService: MovieService,
    private router: Router,
    route: ActivatedRoute
  ){
    route.queryParams.subscribe(q => {
      this.query = q['q']
      this.searchMovie()
    });
  }

  searchMovie(){
    this.movieService.searchMovie(this.query, 1).then((movies) => {
      this.movies = movies
    }).catch((error) => {
      console.log(error)
    })
  }

  public navigateMovie(movieId: number) {
    this.router.navigate(['/movie'], { queryParams: { id: movieId.toString() } });
  }
}
