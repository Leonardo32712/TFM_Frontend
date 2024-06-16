import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCastingComponent } from './movie-casting.component';

describe('MovieCastingComponent', () => {
  let component: MovieCastingComponent;
  let fixture: ComponentFixture<MovieCastingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieCastingComponent]
    });
    fixture = TestBed.createComponent(MovieCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
