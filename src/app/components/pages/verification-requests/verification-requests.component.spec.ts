import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationRequestsComponent } from './verification-requests.component';

describe('VerificationRequestsComponent', () => {
  let component: VerificationRequestsComponent;
  let fixture: ComponentFixture<VerificationRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationRequestsComponent]
    });
    fixture = TestBed.createComponent(VerificationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
