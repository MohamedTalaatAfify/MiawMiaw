import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, tap } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {

    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);
    
    signup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signupRequest),
            mergeMap((action) =>
                this.authService.signup(action.firstName, action.lastName, action.email, action.phoneNumber, action.password).pipe(
                    map((response: any) => AuthActions.signupSuccess({ email: response.email, token: response.token })),
                    catchError((error) => of(AuthActions.signupFailure({ error })))
                )
            )
        )
    );

    signin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signinRequest),
            switchMap((action) =>
                this.authService.signin(action.email, action.password).pipe(
                    map((response: any) => AuthActions.signinSuccess({ token: response.token })),
                    catchError((error) => of(AuthActions.signinFailure({ error })))
                )
            )
        )
    );

    signinSuccess$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.signinSuccess),
            map((action) => {
                console.log('Signed in successfully.');
                this.router.navigateByUrl('/home');
            })
        ), { dispatch: false }
    );

    signupSuccess$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.signupSuccess),
            map((action) => {
                console.log('Signed up successfully.');
                this.router.navigateByUrl('/home');
            })
        ), { dispatch: false }
    );

    signinFailure$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signinFailure),
            map(({ error }) => {
                console.error('Sign in failed:', error);
            })
        ), { dispatch: false }
    );

    signupFailure$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signupFailure),
            map(({ error }) => {
                console.error('Sign up failed:', error);
            })
        ), { dispatch: false }
    );

    signout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signout),
            tap(() => {
                this.authService.signout();
            })
        ), { dispatch: false }
    );

}
