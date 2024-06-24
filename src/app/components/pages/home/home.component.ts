import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselMovie } from 'src/app/models/movie/carouselMovie';
import { MoviePoster } from 'src/app/models/movie/moviePoster';
import { MovieService } from 'src/app/services/movie.service';
import Swal from 'sweetalert2';

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

  ngOnInit() {
    Swal.fire({
      title: 'Loading data from server...',
      text: 'If the aplication haven not been used, this may take one minute. After the wating everything will work fluently. Sorry for the inconvenience.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    Promise.all([
      this.movieService.getCarousel(),
      this.movieService.getHomeList()
    ])
    .then(([carousel, list]) => {
      this.carousel = carousel;
      this.list = list;
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error',
        text: error.name
      })
      console.log(error);
    })
    .finally(() => {
      Swal.close();
    });
  }

  public navigateMovie(movieId: number) {
    this.router.navigate(['/movie'], { queryParams: { id: movieId.toString() } });
  }

}
