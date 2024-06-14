import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BasicActor } from 'src/app/models/actor/basicActor';
import { basicUser } from 'src/app/models/user/basicUser';
import { Movie } from 'src/app/models/movie/movie';
import { Review, ReviewWithMovieID } from 'src/app/models/review/review';
import { UserService } from 'src/app/services/user.service';
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
  public casting: BasicActor[] = []
  public criticsReviews: Record<string, Review> = {} as Record<string, Review>
  public spectatorReviews: Record<string, Review> = {} as Record<string, Review>
  public user: basicUser = {} as basicUser

  constructor(
    private router: Router,
    private movieService: MovieService,
    private reviewsService: ReviewsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const currentUrl = this.router.url;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const movieId = urlParams.get('id');

    if (movieId) {
      this.movieService.getMovie(movieId).subscribe({
        next: (response) => {
          this.movie = response
        }, error: (error) => {
          console.log(error)
        }
      })

      this.movieService.getCasting(movieId).subscribe({
        next: (response) => {
          this.casting = response;
        },
        error: (error) => {
          console.log(error)
        }
      })

      this.reviewsService.getReviews(movieId).subscribe({
        next: (response) => {
          this.userService.getBasicUserData()
            .then((user) => {
              if (user) {
                this.user = user
                this.criticsReviews = this.sortReviews(response.critics, user.uid)
                this.spectatorReviews = this.sortReviews(response.spectators, user.uid)
              } else {
                this.criticsReviews = response.critics;
                this.spectatorReviews = response.spectators;
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

  getSpectatorReviewIds(): string[] {
    return Object.keys(this.spectatorReviews);
  }

  getCriticReviewIds(): string[] {
    return Object.keys(this.criticsReviews);
  }

  calculateAverageRating(reviews: Record<string, Review>): number {
    const reviewIds = Object.keys(reviews);
    if (reviewIds.length === 0) {
      return 0;
    }

    const totalScore = reviewIds.reduce((acc, curr) => acc + reviews[curr].score, 0);
    const averageRating = totalScore / reviewIds.length;

    return Math.round(averageRating * 10) / 10;
  }

  openReviewEditor() {
    if (!this.user.uid) {
      Swal.fire({
        title: '¿Quién eres?',
        text: 'Para publicar una reseña debes iniciar sesión primero.',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
        footer: '¿No tienes una cuenta? Prueba a <a href="/register">Registrarse</a>'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login'])
        }
      });
    } else {
      Swal.fire({
        title: 'Por favor, introduce tu puntuación y reseña:',
        html: `
        <head>
          <style>
            .rating {
              display: flex;
              justify-content: center;
              direction: rtl;
            }
            .rating input {
              display: none;
            }
            .rating label {
              font-size: 2em;
              color: gray;
              cursor: pointer;
            }
            .rating label:hover,
            .rating label:hover ~ label,
            .rating input:checked ~ label {
              color: gold;
            }
          </style>
        </head>
          <div>
            <label>Puntuación:</label><br>
            <div class="d-flex justify-content-center">
              <div class="text-center">
                <div class="rating">
                  <input type="radio" name="score" value="5" id="star5" /><label for="star5">☆</label>
                  <input type="radio" name="score" value="4" id="star4" /><label for="star4">☆</label>
                  <input type="radio" name="score" value="3" id="star3" /><label for="star3">☆</label>
                  <input type="radio" name="score" value="2" id="star2" /><label for="star2">☆</label>
                  <input type="radio" name="score" value="1" id="star1" /><label for="star1">☆</label>
                </div>
              </div>
            </div>
            <label for="reviewTextArea">Reseña:</label><br>
            <textarea id="reviewTextArea" rows="4" cols="50"></textarea>
          </div>
        `,
        showCancelButton: true,
        preConfirm: () => {
          const scoreElement = document.querySelector('input[name="score"]:checked') as HTMLInputElement;;
          const reviewElement = document.getElementById('reviewTextArea') as HTMLTextAreaElement;;
          const score = scoreElement ? parseInt(scoreElement.value) : null;
          const text = reviewElement ? reviewElement.value : null;
          if (!score) {
            Swal.showValidationMessage('La puntuación debe estar entre 1 y 5.');
            return false;
          }
          if (!text) {
            Swal.showValidationMessage('La reseña no puede estar vacía.');
            return false;
          }
          return { score, text };
        }
      }).then((reviewResult) => {
        if (reviewResult.isConfirmed) {
          const { score, text } = reviewResult.value;
          Swal.fire({
            title: 'Publicando reseña...',
            text: 'Por favor espere.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          this.postReview(score, text);
        }
      });
    }
  }

  postReview(score: number, reviewText: string) {
    const newReview: ReviewWithMovieID = {
      movieId: this.movie.id,
      uid: this.user.uid,
      username: this.user.displayName || '',
      photoURL: this.user.photoURL || '',
      score,
      text: reviewText
    };

    this.reviewsService.postReview(newReview).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Reseña publicada',
          text: 'Tu reseña ha sido publicada con éxito.',
          icon: 'success',
          showCloseButton: true
        }).then(() => {
          if (this.user.emailVerified) {
            this.criticsReviews = {
              [response.reviewId]: newReview as Review,
              ...this.criticsReviews
            };
          } else {
            this.spectatorReviews = {
              [response.reviewId]: newReview as Review,
              ...this.spectatorReviews
            };
          }
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewsService.deleteReview(reviewId, this.movie.id).subscribe({
          next: (_response) => {
            Swal.fire({
              title: 'Reseña eliminada',
              text: 'Tu reseña ha sido eliminada con éxito.',
              icon: 'success',
              showCloseButton: true
            }).then(() => {
              if (this.user.emailVerified) {
                delete this.criticsReviews[reviewId];
              } else {
                delete this.spectatorReviews[reviewId];
              }
            });
          },
          error: (error) => {
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar tu reseña. Por favor, intenta de nuevo.',
              icon: 'error',
              showCloseButton: true
            });
          }
        });
      }
    });
  }
}
