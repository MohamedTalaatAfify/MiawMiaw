import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private backendRootUrl = environment.backendUrl;
    private authUrl = `${this.backendRootUrl}/auth`;
    private customerUrl = `${this.backendRootUrl}/customer`;
    private logoutTimer: any;

    constructor(
        private http: HttpClient, 
        private router: Router,
    ) {}

    signup(firstName: string, lastName: string, email: string, phoneNumber: string, password: string): Observable<any> {
        return this.http.post(`${this.customerUrl}/signup`, { firstName, lastName, email, phoneNumber, password }).pipe(
            map((res: any) => {
                this.handleAuthentication(res.token, res.expirationTime);
                return res;
            }),
            catchError(this.handleError)
        );
    }

    signin(email: string, password: string): Observable<any> {
        return this.http.post(`${this.authUrl}/signin`, { email, password }).pipe(
            map((res: any) => {
                this.handleAuthentication(res.token, res.expirationTime);
                return res;
            }),
            catchError(this.handleError)
        );
    }

    signout() {
        this.http.post(`${this.authUrl}/signout`, {}).pipe(
            map((res: any) => {
                localStorage.removeItem('token');
                localStorage.removeItem('expirationTime');
                if (this.logoutTimer) {
                    clearTimeout(this.logoutTimer);
                }
                this.router.navigateByUrl('/signin');
            }),
            catchError(this.handleError)
        ).subscribe();
    }

    private handleAuthentication(token: string, expirationTime: number) {
        const expirationDate = new Date(new Date().getTime() + expirationTime * 1000);
        this.setAuthData(token, expirationDate);
        this.setLogoutTimer(expirationTime);
    }

    private setAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationDate.toISOString());
    }

    private setLogoutTimer(expiresIn: number) {
        this.logoutTimer = setTimeout(() => {
            this.signout();
        }, expiresIn * 1000);
    }

    private handleError(error: any) {
        let errorObject = {
            name: 'Error',
            message: 'An unknown error occurred!',
            status: 0
        };
        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            errorObject.message = `Error: ${error.error.message}`;
        } else {
            errorObject.message = `Error: ${error.error ? error.error.message : error.message}`;
            errorObject.status = error.status;
        }
        return throwError(() => new customError(errorObject.name, errorObject.message, errorObject.status));
    }
    
}

class customError implements Error { 
    name: string;
    message: string;
    status: number;
    constructor(name: string, message: string, status: number) {
        this.name = name;
        this.message = message;
        this.status = status;
    }
} 