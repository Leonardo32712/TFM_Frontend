import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent {
  public movieId: string = ''

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    const currentUrl = this.router.url;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const movieId = urlParams.get('id');

    if (movieId) {
      this.movieId = movieId;
    } else {
      Swal.fire({
        title: 'Invalid URL',
        text: 'No movie id found on URL.'
      }).then(() => {
        this.router.navigate(['/home'])
      })
    }
  }
}
