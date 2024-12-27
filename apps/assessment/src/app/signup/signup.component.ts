import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import * as fromAuthSelectors from '../store/auth/auth.selectors';

@Component({
    selector: 'app-signup',
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
})
export class SignupComponent {

    signupForm: FormGroup;
    signupError$: Observable<string | null>;
    isLoading$: Observable<boolean>;
    private subscriptions: Subscription = new Subscription();
    signupRequestErrorObj: any = {
        errorFlag: false,
        status: 500
    }
    readonly backendRootUrl = environment.backendUrl;

    constructor(private formBuilder: FormBuilder, private store: Store) {
        this.signupForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.maxLength(20)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
            phoneNumber: ['+', [this.phoneNumberValidator, Validators.maxLength(20)]],
            password: ['', [Validators.required, this.passwordStrengthValidator]],
            confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]]
        });

        this.signupError$ = this.store.pipe(select(fromAuthSelectors.selectAuthError));
        this.isLoading$ = this.store.pipe(select(fromAuthSelectors.selectAuthLoading));
    }

    phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
        const phoneNumber = control.value;
        const regex = /^[+]?[0-9]*$/;
        if (phoneNumber && !regex.test(phoneNumber)) {
            return { invalidPhoneNumber: true };
        }
        return null;
    }

    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.value;
        const lengthValid = password && password.length >= 8 && password.length <= 16;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/;
        if (password && (!lengthValid || !regex.test(password))) {
            return { weakPassword: true };
        }
        return null;
    }
    
    confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.parent?.get('password')?.value;
        const confirmPassword = control.value;
        if (password !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }

    onPasswordChange() {
        this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    }

    signup() {
        if (this.signupForm.valid) {
            const userData = this.signupForm.value;
            if (userData.phoneNumber == '+') userData.phoneNumber = '';
            this.store.dispatch(AuthActions.signupRequest({ firstName: userData.firstName, lastName: userData.lastName, email: userData.email, phoneNumber: userData.phoneNumber, password: userData.password }));
            const errorSubscription = this.signupError$.subscribe((error) => {
                if (error) {
                    this.signupRequestErrorObj.errorFlag = true;
                    this.signupRequestErrorObj.status = JSON.stringify(error).includes('409') ? 409 : 500;
                }
            });
            this.subscriptions.add(errorSubscription);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
