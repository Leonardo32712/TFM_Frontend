import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Actor } from 'src/app/models/actor/actor';
import { ActorService } from 'src/app/services/actor.service';

@Component({
  selector: 'app-movie-casting',
  templateUrl: './movie-casting.component.html',
  styleUrls: ['./movie-casting.component.css']
})
export class MovieCastingComponent {
  @Input() movieId: string = '';
  public casting: Actor[] = [];

  constructor(
    private actorService: ActorService,
    private router: Router
  ){}

  ngOnInit(){
    this.actorService.getCasting(this.movieId).then((casting) => {
      this.casting = casting
    }).catch((error) => {
      console.log(error)
    })
  }

  navigateActor(actorId: number){
      this.router.navigate(['/actor'], { queryParams: { id: actorId } })
  }
}
