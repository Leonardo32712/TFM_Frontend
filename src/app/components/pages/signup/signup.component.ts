import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userUpdate } from 'src/app/models/user/userUpdate';
import { UserService } from 'src/app/services/user.service';
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

  constructor(private userService: UserService, private router: Router){}

  ngOnInit(){
    this.userService.getBasicUserData().then((user) => {
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
        text: 'Except profile picture, all fields must be fulfilled.', 
        icon: 'error',
        showCloseButton: true
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        title: 'Error', 
        text: 'Paswords do not match.', 
        icon: 'error',
        showCloseButton: true
      });
      return;
    }

    const userRegister: userUpdate = {
      displayName: this.username,
      email: this.email,
      password: this.password,
      photo: this.profilePic
    }

    Swal.fire({
      title: 'Registering account...',
      text: 'Please wait.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.userService.signUp(userRegister)
      .then((message) => {
        Swal.fire({
          title: 'Signed up!', 
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
