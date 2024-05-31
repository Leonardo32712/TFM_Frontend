import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SearchComponent } from './components/pages/search/search.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    SearchComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
