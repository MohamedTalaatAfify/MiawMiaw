import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Feature Selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectors
export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
);

export const selectAuthToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.token
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state: AuthState) => state.error
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state: AuthState) => state.isLoading
);
