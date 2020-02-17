import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirebaseAuth } from '@angular/fire';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authState: Observable<any>;
    authObject: any;

    constructor(
        private firebase: AngularFireAuth,
        private userService: UserService,
        private navController: NavController
    ) {
        this.authState = this.firebase.authState;
        this.authState.subscribe(async (state) => {
            console.log(state);
            if (state) {
                this.authObject = JSON.parse(JSON.stringify(state));
                await this.userService.initializeLoggedInUser(
                    this.authObject.uid
                );
                this.navController.navigateRoot('shopping-lists');
            }
        });
    }

    isLoggedIn() {
        this.authState.subscribe((user) => {
            return user ? true : false;
        });
    }

    registerUser(email: string, password: string) {
        return this.firebase.auth.createUserWithEmailAndPassword(
            email,
            password
        );
    }

    loginUser(email: string, password: string) {
        return this.firebase.auth.signInWithEmailAndPassword(email, password);
    }

    logoutUser() {
        return this.firebase.auth.signOut();
    }
}
