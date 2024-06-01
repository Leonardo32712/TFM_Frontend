import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FB_IMAGE_URL_DEFAULT } from 'src/environments/environment';
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
    if(localStorage.getItem('idToken'))
      this.router.navigate(['/home'])
  }

  public loginEmailAndPassword() {
    this.auth.logInEmailAndPassword(this.email, this.password)
      .then((cred) => {
        localStorage.setItem('idToken', cred.idToken)
        localStorage.setItem('displayName', cred.displayName || this.email)
        localStorage.setItem('photoURL', cred.photoURL || FB_IMAGE_URL_DEFAULT)
        Swal.fire({
          title: 'Sesión iniciada',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload()
        })
      })
      .catch((error) => {
        Swal.fire({
          title: 'Sesión no iniciada',
          text: error,
          icon: 'error',
          showConfirmButton: false
        })
      });
  }
}
