import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    error: string | null;
    isLoading: boolean;

}

export const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    error: null,
    isLoading: false

};

export const authReducer = createReducer(
    initialState,
    // sign in 
    on(AuthActions.signinRequest, (state) => ({ ...state, isLoading: true })),
    on(AuthActions.signinSuccess, (state, { token }) => ({ ...state, isAuthenticated: true, token, error: null, isLoading: false })),
    on(AuthActions.signinFailure, (state, { error }) => ({ ...state, isAuthenticated: false, token: null, error })),
    // sign up
    on(AuthActions.signupRequest, (state) => ({ ...state, error: null, isLoading: true })), 
    on(AuthActions.signupSuccess, (state, {email, token }) => ({ ...state, error: null, isLoading: false, email, token, isAuthenticated: true })),
    on(AuthActions.signupFailure, (state, { error }) => ({ ...state, isAuthenticated: false, token: null, error })),
);