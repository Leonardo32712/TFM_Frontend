import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userProfile } from 'src/app/models/user/userProfile';
import { userUpdate } from 'src/app/models/user/userUpdate';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userProfile: userProfile = {} as userProfile
  editedUserProfile: userUpdate = {} as userUpdate
  uploadedFile: File | null = null;
  readMode: boolean = true;

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(){
    this.auth.getUserProfile()
    .then((user) => {
      this.userProfile = user;
      this.editedUserProfile = {...user,
        photoURL: null
      };
    }).catch(() => {
      this.router.navigate(['/home'])
    })
  }
  
  changeMode(){
    this.editedUserProfile = {...this.userProfile, photoURL: null}
    this.uploadedFile = null;
    this.readMode = !this.readMode
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
    }
  }

  updateProfile() {
    Swal.fire({
      title: 'Confirmar actualización',
      html: `
        <p><strong>Email anterior:</strong> ${this.userProfile.email}</p>
        <p><strong>Email nuevo:</strong> ${this.editedUserProfile.email}</p>
        <p><strong>Nombre anterior:</strong> ${this.userProfile.displayName}</p>
        <p><strong>Nombre nuevo:</strong> ${this.editedUserProfile.displayName}</p>
        <p><strong>Foto anterior:</strong> ${this.userProfile.photoURL}</p>
        <p><strong>Foto nueva:</strong> ${this.uploadedFile ? this.uploadedFile.name : 'No cambiada'}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.uploadedFile) {
          this.editedUserProfile.photoURL = this.uploadedFile;
        }
        this.auth.updateUserData(this.editedUserProfile).then((response) => {
          Swal.fire({
            title: 'Perfil actualizado',
            text: response,
            icon: 'success',
            showCloseButton: true
          }).then(() => {
            this.readMode = true;
            this.ngOnInit()
          });
        }).catch((error: string) => {
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            showCloseButton: true
          });
        });
      }
    });
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
          text: 'Por favor espere.',
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
            icon: 'error',
            showCloseButton: true
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
