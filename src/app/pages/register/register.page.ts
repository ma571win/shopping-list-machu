import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { FirebaseError } from 'firebase';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    formGroup: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private userService: UserService,
        private toastService: ToastService,
        private navController: NavController
    ) {
        this.formGroup = this.formBuilder.group({
            userName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            reenteredPassword: [
                '',
                [Validators.required, Validators.minLength(6)],
            ],
        });
    }

    ngOnInit() {}

    getUserName() {
        return this.formGroup.controls.userName.value;
    }

    getEmail() {
        return this.formGroup.controls.email.value;
    }

    getPassword() {
        return this.formGroup.controls.password.value;
    }

    getReenteredPassword() {
        return this.formGroup.controls.reenteredPassword.value;
    }

    registerUser() {
        this.authService
            .registerUser(this.getEmail(), this.getPassword())
            .then(async (user) => {
                await this.userService.createUser({
                    userName: this.getUserName(),
                    userEmail: this.getEmail(),
                    isAdmin: false,
                    userId: user.user.uid,
                    listIds: [],
                });
                await this.toastService.displayToast(
                    `Welcome to Machu ${this.getUserName()}!`
                );
                await this.navController.navigateForward('shopping-lists');
            })
            .catch(async (error: FirebaseError) => {
                await this.toastService.displayToast(
                    error.message,
                    3000,
                    'danger'
                );
                this.formGroup.controls.email.setValue('');
                console.error(error);
            });
    }

    onGoToLogin() {
        this.navController.navigateBack('login');
    }
}
