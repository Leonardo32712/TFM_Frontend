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
            this.editedUserProfile.photoURL = this.uploadedFile;
          }
          this.auth.updateUserData(this.editedUserProfile).then((response) => {
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
    Swal.fire({
      icon: 'info',
      html: ` 
        <div>
          <p>Redacte un texto explicativo solicitando la verificación. A continuación, se detalla la información que debe incluir en su texto:</p>
          <ul class="text-start">
            <li><strong>Nombre Completo:</strong> Su nombre real para la verificación de identidad.</li>
            <li><strong>Correo Electrónico:</strong> Asegúrese de usar el correo electrónico asociado a su cuenta.</li>
            <li><strong>Justificación:</strong> Explique por qué solicita la verificación y proporcione cualquier detalle relevante que respalde su solicitud.</li>
            <li><strong>Enlaces de Referencia:</strong> Incluya enlaces a cualquier perfil público, página web o artículo que demuestre su trabajo o identidad.</li>
            <li><strong>Adjuntos:</strong> Si es necesario, mencione cualquier documento que pueda haber enviado por otros medios que respalde su solicitud (por ejemplo, identificación oficial, cartas de referencia, etc.).</li>
          </ul>
        </div>
      `,
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
      this.auth.requestVerification(text.value).subscribe({
        next: (response) => {
          if(response.status == 201){
            Swal.fire({
              icon: 'success',
              title:  'Solicitud almacenada correctamente',
              text: response.body?.message
            })
          }
        }, error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error almacenando su solicitud',
            text: JSON.stringify(error)
          })
        }
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
