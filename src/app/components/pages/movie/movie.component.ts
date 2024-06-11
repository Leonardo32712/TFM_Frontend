import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { basicUser } from 'src/app/models/basicUser';
import { Movie } from 'src/app/models/movie';
import { Review, ReviewWithMovieID } from 'src/app/models/review';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent {
  public movie: Movie = {} as Movie
  public reviews: Record<string, Review>= {} as Record<string, Review>
  public user: basicUser = {} as basicUser

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
              this.user = user
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

  calculateAverageRating(): number {
    const reviewIds = Object.keys(this.reviews);
    if (reviewIds.length === 0) {
      return 0;
    }

    const totalScore = reviewIds.reduce((acc, curr) => acc + this.reviews[curr].score, 0);
    const averageRating = totalScore / reviewIds.length;
    
    return Math.round(averageRating * 10) / 10;
  }

  openReviewEditor() {
    Swal.fire({
      title: 'Introduce la puntuación (1-5):',
      input: 'number',
      inputAttributes: {
        min: '1',
        max: '5',
        step: '1'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        const score = Number(value);
        if (isNaN(score) || score < 1 || score > 5) {
          return 'La puntuación debe estar entre 1 y 5.';
        } else {
          return undefined;
        }
      }
    }).then((scoreResult) => {
      if (scoreResult.isConfirmed) {
        const score = Number(scoreResult.value);
        Swal.fire({
          title: 'Introduce tu reseña:',
          input: 'textarea',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'La reseña no puede estar vacía.';
            } else {
              return undefined;
            }
          }
        }).then((reviewResult) => {
          if (reviewResult.isConfirmed) {
            Swal.fire({
              title: 'Publicando reseña...',
              text: 'Por favor espere.',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });
            const reviewText = reviewResult.value;
            this.postReview(score, reviewText);
          }
        });
      }
    });
  }

  postReview(score: number, reviewText: string) {
    const newReview: ReviewWithMovieID = {
      movieId: this.movie.id,
      uid: this.user.uid,
      username: this.user.displayName || '',
      photoURL: this.user.photoURL || '',
      score,
      review: reviewText
    };

    this.reviewsService.postReview(newReview).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Reseña publicada',
          text: 'Tu reseña ha sido publicada con éxito.',
          icon: 'success',
          showCloseButton: true
        }).then(() => {
          this.reviews = {
            [response.reviewId]: newReview as Review, 
            ...this.reviews
          };
        });
      }, 
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al publicar tu reseña. Por favor, intenta de nuevo.',
          icon: 'error',
          showCloseButton: true
        });
      }
    });
  }

  deleteReview(reviewId: string) {
    this.reviewsService.deleteReview(reviewId, this.movie.id).subscribe({
      next: (_response) => {
        Swal.fire({
          title: 'Reseña eliminada',
          text: 'Tu reseña ha sido eliminada con éxito.',
          icon: 'success',
          showCloseButton: true
        }).then(() => {
          delete this.reviews[reviewId];
        });
      }, 
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar tu reseña. Por favor, intenta de nuevo.',
          icon: 'error',
          showCloseButton: true
        });
      }
    })
  }
}
