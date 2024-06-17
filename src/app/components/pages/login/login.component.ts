import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = ''
  password: string = ''

  constructor(private userService: UserService, private router: Router){}

  ngOnInit(){
    this.userService.currentUser.subscribe({
      next: (user) => {
        if(user.uid != '') {
          this.router.navigate(['/home'])
        }
      }, error: (error) => {
        console.log(error)
      }
    })
  }

  public loginEmailAndPassword() {
    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.userService.logInEmailAndPassword(this.email, this.password)
      .then((message) => {
        Swal.fire({
          title: 'Logged in!',
          icon: 'success',
          text: message,
          showCloseButton: true
        })
      }).catch((error) => {
        Swal.fire({
          title: 'Not logged in.',
          text: error,
          icon: 'error',
          showCloseButton: true
        })
      });
  }
}
