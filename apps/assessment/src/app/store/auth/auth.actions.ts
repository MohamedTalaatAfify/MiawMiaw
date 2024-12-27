import { createAction, props } from '@ngrx/store';
export const signupRequest = createAction('[Auth] Sign up Request', props<{ firstName: string; lastName: string; email:string; phoneNumber: string, password: string; }>());
export const signupSuccess = createAction('[Auth] Sign up Success', props<{ email: string; token: string }>());
export const signupFailure = createAction('[Auth] Sign up Failure', props<{ error: any }>());

export const signinRequest = createAction('[Auth] Sign in Request', props<{ email: string; password: string }>());
export const signinSuccess = createAction('[Auth] Sign in Success', props<{ token: string }>());
export const signinFailure = createAction('[Auth] Sign in Failure', props<{ error: any }>());

export const signout = createAction('[Auth] Sign out');