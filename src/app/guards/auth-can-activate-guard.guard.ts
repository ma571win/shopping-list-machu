import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class AuthCanActivateGuardGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private navController: NavController
    ) {}
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return new Promise<boolean>((resolve, reject) => {
            this.authService.authState.subscribe((user) => {
                if (user) {
                    resolve(true);
                } else {
                    this.navController.navigateBack('login');
                    resolve(false);
                }
            });
        });
    }
}
