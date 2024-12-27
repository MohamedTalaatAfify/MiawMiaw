import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import * as fromAuthSelectors from '../store/auth/auth.selectors';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-signin',
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.css',
})
export class SigninComponent implements OnDestroy {
    signinForm: FormGroup;
    signinError$: Observable<string | null>;
    isLoading$: Observable<boolean>;
    private subscriptions: Subscription = new Subscription();
    signinRequestErrorObj: any = {
        errorFlag: false,
        status: 500
    }

    constructor(
        private formBuilder: FormBuilder,
        private store: Store
    ) {
        this.signinForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });

        this.signinError$ = this.store.pipe(select(fromAuthSelectors.selectAuthError));
        this.isLoading$ = this.store.pipe(select(fromAuthSelectors.selectAuthLoading));
    }

    signin() {
        if (this.signinForm.valid) {
            const userData = this.signinForm.value;
            this.store.dispatch(AuthActions.signinRequest({ email: userData.email, password: userData.password }));
            const errorSubscription = this.signinError$.subscribe((error) => {
                if (error) {
                    this.signinRequestErrorObj.errorFlag = true;
                    this.signinRequestErrorObj.status = JSON.stringify(error).includes('401') ? 401 : 500;
                }
            });
            this.subscriptions.add(errorSubscription);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
