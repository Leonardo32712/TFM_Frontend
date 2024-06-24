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
  private loadingAlertVisible: boolean = false;
  private alertTimeout: any;

  constructor(
    private movieService: MovieService,
    private router: Router
  ){}

  ngOnInit() {
    this.alertTimeout = setTimeout(() => {
      if (!Swal.isVisible()) {
        this.loadingAlertVisible = true;
        Swal.fire({
          title: 'Loading data from server...',
          text: 'If the application has not been used, this may take one minute. After the waiting, everything will work fluently. Sorry for the inconvenience.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }
    }, 1000);

    Promise.all([
      this.movieService.getCarousel(),
      this.movieService.getHomeList()
    ])
    .then(([carousel, list]) => {
      this.carousel = carousel;
      this.list = list;
    })
    .catch((error) => {
      clearTimeout(this.alertTimeout);
      Swal.fire({
        title: 'Error',
        text: error.name
      })
      console.log(error);
    })
    .finally(() => {
      if (this.loadingAlertVisible) {
        Swal.close();
        this.loadingAlertVisible = false;
      } else {
        clearTimeout(this.alertTimeout);
      }
    });
  }

  public navigateMovie(movieId: number) {
    this.router.navigate(['/movie'], { queryParams: { id: movieId.toString() } });
  }

}
