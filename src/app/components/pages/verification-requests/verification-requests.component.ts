import { Component } from '@angular/core';
import { VerificationRequest } from 'src/app/models/verificationRequest';
import { VerificationService } from 'src/app/services/verification.service';

@Component({
  selector: 'app-verification-requests',
  templateUrl: './verification-requests.component.html',
  styleUrls: ['./verification-requests.component.css']
})
export class VerificationRequestsComponent {
  public requests: VerificationRequest[] = []
  public response: string = 'Wating for responses...'

  constructor(
    private verificationService: VerificationService
  ){}

  updateRequest(requestID: string, status: string){
    this.verificationService.updateRequest(requestID, status).then((message) => {
      this.response = message
    }).catch((error) => {
      this.response = error
    })
  }

  getRequests(){
    this.verificationService.getRequests().then((requests) => {
      this.requests = requests
    }).catch((error) => {
      this.response = error
    })
  }
}
