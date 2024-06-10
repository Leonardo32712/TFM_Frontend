import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie';
import { Review } from 'src/app/models/review';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent {
  public movie: Movie = {} as Movie
  public reviews: Record<string, Review>= {} as Record<string, Review>

  constructor(
    private router: Router, 
    private movieService: MovieService, 
    private reviewsService: ReviewsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUrl = this.router.url;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const movieId = urlParams.get('id');

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
          this.authService.getBasicUserData()
          .then((user) => {
            if(user){
              this.reviews = this.sortReviews(response, user.uid)
            } else {
              this.reviews = response;
            }
          })
        }, error: (error) => {
          console.log(error)
        }
      })
    } else {
      this.router.navigate(['/home'])
    }
  }

  private sortReviews(reviews: Record<string, Review>, targetUid: string): Record<string, Review> {
    const sortedReviews = Object.entries(reviews)
      .sort(([_keyA, reviewA], [_keyB, reviewB]) => {
        if (reviewA.uid === targetUid && reviewB.uid !== targetUid) {
          return -1;
        }
        if (reviewA.uid !== targetUid && reviewB.uid === targetUid) {
          return 1;
        }
        return 0;
      });

    return Object.fromEntries(sortedReviews);
  }

  getReviewIds(): string[] {
    return Object.keys(this.reviews);
  }  
}
