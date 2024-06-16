import { Component, Input } from '@angular/core';
import { Movie } from 'src/app/models/movie/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {
  @Input() movieId: string = '';
  public movie: Movie = {} as Movie;

  constructor(
    private movieService: MovieService
  ){}

  ngOnInit(){
    this.movieService.getMovie(this.movieId).then((movie) => {
      this.movie = movie
    }).catch((error) => {
      console.log(error)
    })
  }
}
