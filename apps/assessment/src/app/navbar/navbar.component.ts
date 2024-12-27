import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, MatButtonModule, MatToolbarModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {

    readonly backendRootUrl = environment.backendUrl;

    constructor(private store: Store) {}

    signout() {
        this.store.dispatch(AuthActions.signout());
    }

}