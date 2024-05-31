import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  query: string = ''
  displayName: string = ''
  photoURL: string = ''
  userLogged: boolean = false

  constructor(
    private router: Router
  ){}

  ngOnInit(){
    this.displayName = localStorage.getItem('displayName') || ''
    this.photoURL = localStorage.getItem('photoURL') || ''
    this.userLogged = localStorage.getItem('idToken') != null
  }

  search() {
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
