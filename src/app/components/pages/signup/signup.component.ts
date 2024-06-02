import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  username: string = ''
  email: string = ''
  password: string = ''
  confirmPassword: string = ''
  profilePic: File | null = null;

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(){
    if(localStorage.getItem('idToken'))
      this.router.navigate(['/home'])
  }

  signUp(){
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire({
        title: 'Error', 
        text: 'Todos los campos son obligatorios', 
        icon: 'error'});
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        title: 'Error', 
        text: 'Las contraseñas no coinciden', 
        icon: 'error'});
      return;
    }

    this.auth.signUp(this.username, this.email, this.password, this.profilePic)
      .then(() => {
        Swal.fire({
          title: 'Registro completado', 
          text: 'Su cuenta ha sido creada', 
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error', 
          text: error, 
          icon: 'error'});
      });
  }
}
