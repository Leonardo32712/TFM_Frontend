import { Component } from '@angular/core';
import { carouselMovie } from 'src/app/models/carouselMovie';
import { moviePoster } from 'src/app/models/moviePoster';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  carousel: carouselMovie[] = []
  list: moviePoster[] = []

  constructor(private movieService: MovieService){}

  ngOnInit(){
    this.movieService.getCarousel().subscribe((value) => {
      this.carousel = value
    })

    this.movieService.getHomeList().subscribe((value) => {
      this.list = value
    })
  }
}
