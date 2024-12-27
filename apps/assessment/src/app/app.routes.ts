import { Route } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthRedirectGuard } from './guards/authRedirect.guard';

export const appRoutes: Route[] = [
    { path: 'signup', component: SignupComponent, canActivate: [AuthRedirectGuard] },
    { path: 'signin', component: SigninComponent, canActivate: [AuthRedirectGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
