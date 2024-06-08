import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = ''
  password: string = ''

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(){
    this.auth.getBasicUserData().then((user) => {
      if(user){
        this.router.navigate(['/home'])
      }
    })
  }

  public loginEmailAndPassword() {
    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Por favor espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.auth.logInEmailAndPassword(this.email, this.password)
      .then((message) => {
        Swal.fire({
          title: 'Sesión iniciada',
          icon: 'success',
          text: message,
          showCloseButton: true
        }).then(() => {
          window.location.reload()
        })
      }).catch((error) => {
        Swal.fire({
          title: 'Sesión no iniciada',
          text: error,
          icon: 'error',
          showCloseButton: true
        })
      });
  }
}
