import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/pages/search/search.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { MovieComponent } from './components/pages/movie/movie.component';
import { ActorComponent } from './components/pages/actor/actor.component';
import { VerificationRequestsComponent } from './components/pages/verification-requests/verification-requests.component';

const routes: Routes = [
  { path: '**', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'movie', component: MovieComponent},
  { path: 'actor', component: ActorComponent },  
  { path: 'verification-requests', component: VerificationRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
