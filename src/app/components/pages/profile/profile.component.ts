import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userProfile } from 'src/app/models/user/userProfile';
import { userUpdate } from 'src/app/models/user/userUpdate';
import { UserService } from 'src/app/services/user.service';
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

  constructor(private userService: UserService, private router: Router, private http: HttpClient){}

  ngOnInit(){
    this.userService.getUserProfile()
    .then((user) => {
      this.userProfile = user;
      this.editedUserProfile = {...user,
        photo: null,
        password: null
      };
    }).catch(() => {
      this.router.navigate(['/home'])
    })
  }
  
  changeMode(){
    this.editedUserProfile = {...this.userProfile, photo: null, password: null}
    this.uploadedFile = null;
    this.readMode = !this.readMode
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
    }
  }

  private thereAreChanges(): boolean {
    return this.userProfile.displayName != this.editedUserProfile.displayName ||
    this.userProfile.email != this.editedUserProfile.email ||
    this.uploadedFile != null
  }

  updateProfile() {
    if(!this.thereAreChanges()) {
      Swal.fire({
        title: 'Nada nuevo',
        text: 'No ha realizado ningún cambio en su perfil',
        icon: 'info',
        showCloseButton: true
      })
    } else {
      Swal.fire({
        title: 'Confirmar actualización',
        html: `
          <p><strong>¡Importante!</strong> Si cambias el correo se cerrará la sesión</p>
          <p><strong>Email anterior:</strong> ${this.userProfile.email} <br>
          <strong>Email nuevo:</strong> ${this.editedUserProfile.email}</p>
          <p><strong>Nombre anterior:</strong> ${this.userProfile.displayName} <br>
          <strong>Nombre nuevo:</strong> ${this.editedUserProfile.displayName}</p>
          <p><strong>Foto anterior:</strong> ${this.userProfile.photoURL}<br>
          <strong>Foto nueva:</strong> ${this.uploadedFile ? this.uploadedFile.name : 'Ningún archivo subido'}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.uploadedFile) {
            this.editedUserProfile.photo = this.uploadedFile;
          }
          this.userService.updateUserData(this.editedUserProfile).then((response) => {
            Swal.fire({
              title: 'Perfil actualizado',
              text: response,
              icon: 'success',
              showCloseButton: true
            }).then(() => {
              window.location.reload()
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
  }

  requestVerification(){
    this.http.get('assets/requestVerificationInfo.html', { responseType: 'text' })
      .subscribe((html) => {
        Swal.fire({
          icon: 'info',
          html,
          input: 'textarea',
          preConfirm: (text: string) => {
            if (!text) {
              Swal.showValidationMessage('La reseña no puede estar vacía.');
              return false;
            } else {
              return text;
            }
          }
        }).then((text) => {
          this.userService.requestVerification(text.value)
          .then((message) => {
            Swal.fire({
              icon: 'success',
              title:  'Solicitud almacenada correctamente',
              text: message
            })
          }).catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error almacenando su solicitud',
              text: error
            })
          })
        })
      })
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
        this.userService.deleteAccount().then((message) => {
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
    this.userService.logOut()
    window.location.reload()
  }
}
