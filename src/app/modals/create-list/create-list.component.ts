import { Component, OnInit } from '@angular/core';
import { IList } from '../../model/list-interface';
import { ListService } from '../../services/list.service';
import { ToastService } from '../../services/toast.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IItem } from '../../model/item-interface';
import { UserService } from '../../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-create-list',
    templateUrl: './create-list.component.html',
    styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
    formGroup: FormGroup;
    items: IItem[] = [
        {
            brand: 'gucci',
            itemId: 'gucciID',
            itemName: 'Gucci Pulli',
            price: 999,
            priority: 1,
            isDone: false,
        },
        {
            brand: 'gucci',
            itemId: 'gucciID',
            itemName: '2. Gucci Pulli',
            price: 6666,
            priority: 2,
            isDone: false,
        },
    ];
    itemsFormGroups: FormGroup[] = [];

    constructor(
        private listService: ListService,
        private toastService: ToastService,
        private modalController: ModalController,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private firestore: AngularFirestore
    ) {}

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            listName: ['', [Validators.required]],
            editable: [true, [Validators.required]],
        });
        this.createNewItem();
    }
    // export interface IItem {
    // itemName: string;
    // brand: string;
    // price?: number;
    // picture?: any;
    // itemId: string;
    // priority: number;

    getListName(): string {
        return this.formGroup.controls.listName.value;
    }

    getEditable(): boolean {
        return this.formGroup.controls.editable.value;
    }

    onAddList() {
        const objectToAdd: IList = {
            listId: '',
            listName: this.getListName(),
            ownerUserId: this.userService.getLoggedInUser().userId,
            isEditable: this.getEditable(),
            items: [...this.getItemList()],
        };
        this.listService.addList(objectToAdd).then(() => {
            this.toastService.displayToast('Erstellen der Liste erfolgreich!');
            this.modalController.dismiss(objectToAdd);
        });
    }

    onCloseCreateList() {
        this.modalController.dismiss();
    }

    createNewItem() {
        this.itemsFormGroups.push(
            this.formBuilder.group({
                itemName: ['', [Validators.required]],
                brand: [],
                price: [],
                itemId: [this.firestore.createId(), [Validators.required]],
                priority: [this.itemsFormGroups.length, [Validators.required]],
                description: [],
            })
        );
    }

    deleteItem(index: number) {
        this.itemsFormGroups.splice(index, 1);
        this.itemsFormGroups.forEach((item, i) => {
            if (index > i) {
                this.setPriority(i, this.getPriority(i) + 1);
            }
        });
    }

    swapItemPriority(isPriorityRised: boolean, index) {
        if (
            isPriorityRised &&
            index !== 0 &&
            !isPriorityRised &&
            index !== this.itemsFormGroups.length - 1
        ) {
            if (isPriorityRised) {
                const upperPriority = this.getPriority(index - 1);
                const lowerPriority = this.getPriority(index);
                this.setPriority(index, upperPriority);
                this.setPriority(index - 1, lowerPriority);
                [
                    this.itemsFormGroups[index],
                    this.itemsFormGroups[index - 1],
                ] = [
                    this.itemsFormGroups[index - 1],
                    this.itemsFormGroups[index],
                ];
            } else {
                const upperPriority = this.getPriority(index);
                const lowerPriority = this.getPriority(index + 1);
                this.setPriority(index + 1, upperPriority);
                this.setPriority(index, lowerPriority);
                [
                    this.itemsFormGroups[index],
                    this.itemsFormGroups[index + 1],
                ] = [
                    this.itemsFormGroups[index + 1],
                    this.itemsFormGroups[index],
                ];
            }
        }
    }

    getItemName(index: number) {
        return this.itemsFormGroups[index].controls.itemName.value;
    }
    getDescription(index: number) {
        return this.itemsFormGroups[index].controls.description.value;
    }
    getPriority(index: number) {
        return this.itemsFormGroups[index].controls.priority.value;
    }
    getBrand(index: number) {
        return this.itemsFormGroups[index].controls.brand.value;
    }
    getPrice(index: number) {
        return this.itemsFormGroups[index].controls.price.value;
    }
    getItemId(index: number) {
        return this.itemsFormGroups[index].controls.itemId.value;
    }
    setPriority(index: number, priority: number) {
        this.itemsFormGroups[index].controls.priority.setValue(priority);
    }

    getItemList() {
        const items: IItem[] = [];
        this.itemsFormGroups.forEach((item, index) => {
            if (this.getItemName(index)) {
                items.push({
                    isDone: false,
                    description: this.getDescription(index),
                    price: this.getPrice(index),
                    priority: this.getPriority(index),
                    brand: this.getBrand(index),
                    itemName: this.getItemName(index),
                    itemId: this.getItemId(index),
                });
            }
        });
        return items;
    }
}
