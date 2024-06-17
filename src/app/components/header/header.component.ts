import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { userProfile } from 'src/app/models/user/userProfile';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user: userProfile = {} as userProfile
  query: string = ''
  userLogged: boolean = false
  showButtons: boolean = true

  constructor(
    private userService: UserService,
    private router: Router
  ){}

  ngOnInit(){
    this.userService.getBasicUserData()
    .then((userData) => {
      if(userData){
        this.user = userData
        this.userLogged = true
      }
    }).catch(() => this.userLogged = false)

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        if(currentRoute == '/login' || currentRoute == '/signup')
          this.showButtons = false
      }
    });
  }

  search() {
    this.showButtons = true
    localStorage.setItem('q', this.query)
    if (this.router.url === '/search') {
      window.location.reload();
    } else {
      this.router.navigate(['/search']);
    }
  }

  navigateLogIn(){
    this.showButtons = false;
    this.router.navigate(['/login'])
  }

  navigateHome(){
    this.showButtons = true
    this.router.navigate(['/home'])
  }

  navigateSignUp(){
    this.showButtons = false
    this.router.navigate(['/signup'])
  }

  navigateProfile(){
    this.router.navigate(['/profile'])
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search()
    }
  }
}
