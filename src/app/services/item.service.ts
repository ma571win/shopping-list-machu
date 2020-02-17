import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IItem } from '../model/item-interface';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor(private firestore: AngularFirestore) {}

    addItem(item: IItem) {
        return this.firestore.collection('items').add(item);
    }
}
