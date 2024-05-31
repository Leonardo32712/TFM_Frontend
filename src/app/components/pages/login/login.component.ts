import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FB_IMAGE_URL_DEFAULT } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = ''
  password: string = ''

  constructor(private auth: AuthService){}

  public loginEmailAndPassword() {
    this.auth.logInEmailAndPassword(this.email, this.password)
      .then((cred) => {
        localStorage.setItem('idToken', cred.idToken)
        localStorage.setItem('displayName', cred.displayName || this.email)
        localStorage.setItem('photoURL', cred.photoURL || FB_IMAGE_URL_DEFAULT)        
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  }
}
