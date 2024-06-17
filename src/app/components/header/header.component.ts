import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user/userProfile';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user: UserProfile = {} as UserProfile
  query: string = ''
  userLogged: boolean = false
  showButtons: boolean = true

  constructor(
    private userService: UserService,
    private router: Router
  ){}

  ngOnInit(){
    this.userService.currentUser.subscribe({
      next: (user) => {
        if(user.uid != '') {
          this.user = user
          this.userLogged = true
        } else {
          this.userLogged = false
        }
      }, error: (error) => {
        console.log(error)
      }
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        if(currentRoute == '/login' || currentRoute == '/signup')
          this.showButtons = false
        else {
          this.showButtons = true
        }
      }
    });
  }

  search() {
    this.showButtons = true
    const q = this.query.replace(/[^0-9 a-z]/gi, '')
    this.router.navigate(['/search'], { queryParams: { q } });
    // if (this.router.url === '/search') {
    //   this.ngOnInit()
    // } else {
    // }
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
