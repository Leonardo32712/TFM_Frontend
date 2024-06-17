import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselMovie } from 'src/app/models/movie/carouselMovie';
import { MoviePoster } from 'src/app/models/movie/moviePoster';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  carousel: CarouselMovie[] = []
  list: MoviePoster[] = []

  constructor(
    private movieService: MovieService,
    private router: Router
  ){}

  ngOnInit(){
    this.movieService.getCarousel().then((carousel) => {
      this.carousel = carousel
    }).catch((error) => {
      console.log(error)
    })

    this.movieService.getHomeList().then((list) => {
      this.list = list
    }).catch((error) => {
      console.log(error)
    })
  }

  public navigateMovie(movieId: number) {
    this.router.navigate(['/movie'], { queryParams: { id: movieId.toString() } });
  }

}
