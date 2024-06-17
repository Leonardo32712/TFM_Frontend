import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user/userProfile';
import { UserUpdate } from 'src/app/models/user/userUpdate';
import { UserService } from 'src/app/services/user.service';
import { VerificationService } from 'src/app/services/verification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userProfile: UserProfile = {} as UserProfile
  editedUserProfile: UserUpdate = {} as UserUpdate
  uploadedFile: File | null = null;
  readMode: boolean = true;

  constructor(
    private userService: UserService, 
    private verificationService: VerificationService,
    private router: Router, 
    private http: HttpClient
  ){}

  ngOnInit(){
    this.userService.currentUser.subscribe({
      next: (user) => {
        if(user.uid != '') {
          this.userProfile = user
          this.editedUserProfile = {...user,
            photo: null,
            password: null
          };
        } else {
          this.router.navigate(['/home'])
        }
      }, error: (error) => {
        console.log(error)
      }
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
        title: 'Nothing new',
        text: 'There are no changes in user profile.',
        icon: 'info',
        showCloseButton: true
      })
    } else {
      Swal.fire({
        title: 'Confirm changes',
        html: `
          <p><strong>Important!</strong> Any changes made will log you out.</p>
          <p><strong>Previous email:</strong> ${this.userProfile.email} <br>
          <strong>New email:</strong> ${this.editedUserProfile.email}</p>
          <p><strong>Previous username:</strong> ${this.userProfile.displayName} <br>
          <strong>New username:</strong> ${this.editedUserProfile.displayName}</p>
          <p><strong>Previous photo URL:</strong> ${this.userProfile.photoURL}<br>
          <strong>New photo file name:</strong> ${this.uploadedFile ? this.uploadedFile.name : 'No file uploaded'}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, confirm changes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.uploadedFile) {
            this.editedUserProfile.photo = this.uploadedFile;
          }
          this.userService.updateUserData(this.editedUserProfile).then((response) => {
            Swal.fire({
              title: 'Profile updated',
              text: response,
              icon: 'success',
              showCloseButton: true
            }).then(() => {
              this.userService.logOut()
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
              Swal.showValidationMessage('Request must not be empty.');
              return false;
            } else {
              return text;
            }
          }
        }).then((text) => {
          this.verificationService.requestVerification(text.value)
          .then((message) => {
            Swal.fire({
              icon: 'success',
              title:  'Request saved!',
              text: message
            })
          }).catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error saving your request',
              text: error
            })
          })
        })
      })
  }

  deleteAccount() {
    Swal.fire({
      title: 'Warning',
      text: 'Deleting your account will erase your data and any reviews you have posted. Are you sure you want to delete it?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deoleting account...',
          text: 'please wait.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.deleteAccount().then((message) => {
          Swal.fire({
            title: 'Account deleted',
            text: message,
            icon: 'success',
            showCloseButton: true
          }).then(() => {
            this.userService.logOut();
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
    Swal.fire({
      icon: 'success',
      title: 'User logged out'
    })
  }
}
