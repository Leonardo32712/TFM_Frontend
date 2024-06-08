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

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePic = input.files[0];
    }
  }

  signUp(){
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire({
        title: 'Error', 
        text: 'Todos los campos son obligatorios', 
        icon: 'error',
        showCloseButton: true
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        title: 'Error', 
        text: 'Las contraseñas no coinciden', 
        icon: 'error',
        showCloseButton: true
      });
      return;
    }

    const userRegister: signUpUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      profilePic: this.profilePic
    }

    Swal.fire({
      title: 'Registrando cuenta...',
      text: 'Por favor espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.auth.signUp(userRegister)
      .then((message) => {
        Swal.fire({
          title: 'Registro completado', 
          text: message, 
          icon: 'success',
          showCloseButton: true
        }).then(() => {
          this.router.navigate(['/login']);
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error', 
          text: error, 
          icon: 'error',
          showCloseButton: true
        });
      });
  }
}
