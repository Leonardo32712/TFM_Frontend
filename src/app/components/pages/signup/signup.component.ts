import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signUpUser } from 'src/app/models/signUpUser';
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
    this.auth.getBasicUserData().then((user) => {
      if(user){
        this.router.navigate(['/home'])
      }
    })
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

    const userRegister: signUpUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      profilePic: this.profilePic
    }

    this.auth.signUp(userRegister)
      .then((message) => {
        Swal.fire({
          title: 'Registro completado', 
          text: message, 
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
