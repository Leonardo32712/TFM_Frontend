import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userProfile: userProfile = {} as userProfile
  editedUserProfile: userProfile = {} as userProfile
  uploadedFile: File | null = null;
  readMode: boolean = true;

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(){
    this.auth.getUserProfile()
    .then((user) => {
      this.userProfile = user;
      this.editedUserProfile = user;
    }).catch(() => {
      this.router.navigate(['/home'])
    })
  }
  
  changeMode(){
    this.editedUserProfile = {...this.userProfile}
    this.uploadedFile = null;
    this.readMode = !this.readMode
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
    }
  }

  updateProfile(){
    
  }

  requestVerification(){

  }

  deleteAccount() {
    Swal.fire({
      title: 'Advertencia',
      text: 'Al eliminar su cuenta se borrarán sus datos y las reseñas que haya publicado. ¿Está seguro de que quiere eliminarla?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando cuenta...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.auth.deleteAccount().then((message) => {
          Swal.fire({
            title: 'Cuenta eliminada',
            text: message,
            icon: 'success',
            showCloseButton: true
          }).then(() => {
            window.location.reload();
          })
        }).catch((error: string) => {
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error'
          });
        });
      }
    });
  }
  

  logOut(){
    this.auth.logOut()
    window.location.reload()
  }
}
