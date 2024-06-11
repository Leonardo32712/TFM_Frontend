import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorComponent } from './actor.component';

describe('ActorComponent', () => {
  let component: ActorComponent;
  let fixture: ComponentFixture<ActorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActorComponent]
    });
    fixture = TestBed.createComponent(ActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
