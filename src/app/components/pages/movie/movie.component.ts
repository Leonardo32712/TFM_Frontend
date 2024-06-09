import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie';
import { Review } from 'src/app/models/review';
import { MovieService } from 'src/app/services/movie.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent {
  movie: Movie = {} as Movie
  reviews: Record<string, Review>= {} as Record<string, Review>

  constructor(private router:Router, private movieService: MovieService, private reviewsService: ReviewsService) {
    
  }

  ngOnInit() {
    const currentUrl = this.router.url;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const movieId = urlParams.get('id');
    console.log(movieId)

    if(movieId){
      this.movieService.getMovie(movieId).subscribe({
        next: (response) => {
          this.movie = response
        }, error: (error) => {
          console.log(error)
        }
      })
      this.reviewsService.getReviews(movieId).subscribe({
        next: (response) => {
          this.reviews = response;
        }
      })
    } else {
      this.router.navigate(['/home'])
    }
  }

  getReviewIds(): string[] {
    return Object.keys(this.reviews);
  }  
}
