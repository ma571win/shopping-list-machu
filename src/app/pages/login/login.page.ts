import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../model/user-interface';
import { FirebaseError } from 'firebase';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
})
export class LoginPage {
    formGroup: FormGroup;

    constructor(
        private navController: NavController,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private toastService: ToastService,
        private userService: UserService
    ) {
        this.formGroup = this.formBuilder.group({
            userName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    async onGoToRegisterPage() {
        await this.navController.navigateForward('register');
    }

    getUserName() {
        return this.formGroup.controls.userName.value;
    }

    getPassword() {
        return this.formGroup.controls.password.value;
    }

    async onLoginUser() {
        const user: IUser = await this.userService.getUserByUserName(
            this.getUserName()
        );
        console.log(user);
        if (user) {
            this.authService
                .loginUser(user.userEmail, this.getPassword())
                .then(async (data) => {
                    await this.userService.createUser(
                        JSON.parse(JSON.stringify(data.user))
                    );
                    await this.toastService.displayToast(
                        `Welcome ${user.userName}!`
                    );
                    await this.navController.navigateForward('shopping-lists');
                })
                .catch(async (error: FirebaseError) => {
                    console.log(error);
                    // await this.toastService.displayToast(
                    //     error.message,
                    //     3000,
                    //     'danger'
                    // );
                });
        } else {
            await this.toastService.displayToast(
                `Either your username or your password were incorrect. Please try again.`
            );
        }
    }
}
