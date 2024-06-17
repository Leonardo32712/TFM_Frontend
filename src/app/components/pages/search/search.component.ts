import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ){}

  ngOnInit(){
    this.query = localStorage.getItem('q') || ''
    if(this.query == '')
      this.router.navigate(['/home'])

    this.movieService.searchMovie(this.query,1).then((movies) => {
      this.movies = movies
    }).catch((error) => {
      console.log(error)
    })
  }

}
