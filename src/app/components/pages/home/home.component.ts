import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselMovie } from 'src/app/models/carouselMovie';
import { MoviePoster } from 'src/app/models/moviePoster';
import { MovieService } from 'src/app/services/movie.service';
import { SearchComponent } from '../search/search.component';

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
    this.movieService.getCarousel().subscribe((value) => {
      this.carousel = value
    })

    this.movieService.getHomeList().subscribe((value) => {
      this.list = value
    })
  }
}
