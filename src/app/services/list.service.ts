import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IList } from '../model/list-interface';
import { UserService } from './user.service';
import { IUser } from '../model/user-interface';

@Injectable({
    providedIn: 'root',
})
export class ListService {
    constructor(
        private firestore: AngularFirestore,
        private userService: UserService
    ) {}

    addList(list: IList) {
        list.listId = this.firestore.createId();
        const promises = [];
        promises.push(
            this.firestore
                .collection('lists')
                .doc(list.listId)
                .set(list)
        );
        promises.push(
            this.userService.addListToUser(list.ownerUserId, list.listId)
        );
        return Promise.all(promises);
    }

    getListById(listId: string) {
        return new Promise<IList>(async (resolve, reject) => {
            this.firestore
                .collection('lists')
                .doc(listId)
                .get()
                .toPromise()
                .then((result) => {
                    const toReturn: IList = {
                        isEditable: result.data().isEditable,
                        items: result.data().items,
                        listId: result.data().listId,
                        ownerUserId: result.data().ownerUserId,
                        listName: result.data().listName,
                        picture: result.data().picture,
                    };
                    resolve(toReturn);
                });
        });
    }

    async getListsFromUser(userId): Promise<IList[]> {
        const user: IUser = await this.userService.getUserById(userId);
        if (user.listIds) {
            const promises = [];
            for (const listId of user.listIds) {
                promises.push(this.getListById(listId));
            }
            return await Promise.all(promises);
        } else {
            return [];
        }
    }
}
