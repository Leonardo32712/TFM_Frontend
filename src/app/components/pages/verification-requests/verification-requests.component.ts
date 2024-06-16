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
    const request = this.requests.find(req => req.requestID === requestID);
    if (request) {
        request.status = status;
        this.requests = this.sortRequestsByStatus(this.requests)
    }

    this.verificationService.updateRequest(requestID, status).then((message) => {
      this.response = message
    }).catch((error) => {
      this.response = error
    })
  }

  getRequests(){
    this.verificationService.getRequests().then((requests) => {
      this.requests = this.sortRequestsByStatus(requests)
    }).catch((error) => {
      this.response = error
    })
  }

  sortRequestsByStatus(requests: VerificationRequest[]): VerificationRequest[] {
    requests.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') {
            return -1;
        } else if (a.status !== 'Pending' && b.status === 'Pending') {
            return 1;
        } else {
            return 0;
        }
    });

    return requests;
}
}
