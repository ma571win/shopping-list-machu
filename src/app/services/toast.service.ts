import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastController: ToastController) {}

    async displayToast(
        message: string,
        duration: number = 3000,
        color:
            | 'light'
            | 'medium'
            | 'dark'
            | 'success'
            | 'warning'
            | 'danger'
            | 'primary'
            | 'secondary'
            | 'tertiary' = 'primary'
    ) {
        const toast = await this.toastController.create({
            color,
            message,
            duration,
        });

        await toast.present();
    }
}
