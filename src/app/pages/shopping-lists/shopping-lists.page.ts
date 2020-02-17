import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalController, NavController } from '@ionic/angular';
import { CreateListComponent } from '../../modals/create-list/create-list.component';
import { ListService } from '../../services/list.service';
import { UserService } from '../../services/user.service';
import { IList } from '../../model/list-interface';

@Component({
    selector: 'app-shopping-lists',
    templateUrl: './shopping-lists.page.html',
    styleUrls: ['./shopping-lists.page.scss'],
})
export class ShoppingListsPage implements OnInit {
    lists: IList[] = [];
    loading = true;

    constructor(
        private authService: AuthService,
        private navController: NavController,
        private modalController: ModalController,
        private listService: ListService,
        private userService: UserService
    ) {}

    async ngOnInit() {
        this.authService.authState.subscribe(async (state) => {
            if (state) {
                const authObject = JSON.parse(JSON.stringify(state));
                await this.userService.initializeLoggedInUser(authObject.uid);
                const returnedLists = await this.listService.getListsFromUser(
                    this.userService.getLoggedInUser().userId
                );
                this.lists = [...returnedLists];
                this.loading = false;
            }
        });
    }

    logoutUser() {
        this.authService
            .logoutUser()
            .then((data) => {
                this.navController.navigateBack('login');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async onCreateNewList() {
        const modalElement = await this.modalController.create({
            component: CreateListComponent,
        });
        modalElement.present();

        const { data } = await modalElement.onDidDismiss();
        if (data) {
            this.lists.push(data);
        }
    }

    getColorClassByIndex(index: number) {
        const colorList = [
            'orange-color',
            'red-color',
            'blue-color',
            'yellow-color',
            'gray-color',
            'white-color',
            'rosa-color',
            'lila-color',
            'light-blue-color',
            'red-color',
        ];
    }
}
