import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userProfile: userProfile = {} as userProfile

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(){
    this.auth.getUserData()
    .then((user) => {
      this.userProfile = user;
    }).catch(() => {
      this.router.navigate(['/home'])
    })
  }

  logOut(){
    this.auth.logOut()
    window.location.reload()
  }
}
