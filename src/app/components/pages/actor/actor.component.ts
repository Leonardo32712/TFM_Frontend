import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActorProfile } from 'src/app/models/actor/actorProfile';
import { MoviePoster } from 'src/app/models/movie/moviePoster';
import { ActorService } from 'src/app/services/actor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent {

  profile: ActorProfile = {} as ActorProfile
  movies: MoviePoster[] = []

  constructor(
    private router: Router, 
    private actorService: ActorService
  ) {}

  ngOnInit() {
    const currentUrl = this.router.url;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const actorId = urlParams.get('id');

    if(actorId){
      this.actorService.getActor(actorId).then((profile) => {
        this.profile = profile
      }).catch((error) => {
        console.log(error)
      })

      this.actorService.getMoviesByActor(actorId).then((movies) => {
        this.movies = movies
      }).catch((error) => {
        console.log(error)
      })
    } else {
      Swal.fire({
        title: 'Invalid URL',
        text: 'No actor id found on URL.'
      }).then(() => {
        this.router.navigate(['/home'])
      })
    }
  }
}
