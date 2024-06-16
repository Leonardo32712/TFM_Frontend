import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SearchComponent } from './components/pages/search/search.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { UserService } from './services/user.service';

import { environment } from '../environments/environment';
import { MovieComponent } from './components/pages/movie/movie.component';
import { ActorComponent } from './components/pages/actor/actor.component';
import { MovieDetailsComponent } from './components/pages/movie/movie-details/movie-details.component';
import { MovieReviewsComponent } from './components/pages/movie/movie-reviews/movie-reviews.component';
import { MovieCastingComponent } from './components/pages/movie/movie-casting/movie-casting.component';
import { VerificationRequestsComponent } from './components/pages/verification-requests/verification-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    SearchComponent,
    LoginComponent,
    SignupComponent,
    MovieComponent,
    ActorComponent,
    MovieDetailsComponent,
    MovieReviewsComponent,
    MovieCastingComponent,
    VerificationRequestsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    UserService,
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth())
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
