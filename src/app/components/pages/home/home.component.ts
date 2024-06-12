import { Component } from '@angular/core';
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
    private movieService: MovieService
  ){}

  ngOnInit(){
    this.movieService.getCarousel().subscribe((value) => {
      this.carousel = value
    })

    this.movieService.getHomeList().subscribe((value) => {
      this.list = value
    })
  }
}
