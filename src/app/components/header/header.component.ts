import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { basicUser } from 'src/app/models/basicUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user: basicUser = {} as basicUser
  query: string = ''
  userLogged: boolean = false
  showButtons: boolean = true

  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  ngOnInit(){
    this.auth.getBasicUserData()
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
      this.router.navigate(['search']);
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search()
    }
  }
}
