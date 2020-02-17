import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from '../model/user-interface';
import { IList } from '../model/list-interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private loggedInUser: IUser;

    constructor(private firestore: AngularFirestore) {}

    async initializeLoggedInUser(userId: string) {
        this.loggedInUser = await this.getUserById(userId);
        console.log(this.getLoggedInUser());
    }

    getLoggedInUser(): IUser {
        return this.loggedInUser;
    }

    createUser(user: IUser) {
        return this.firestore
            .collection('users')
            .doc(user.userId)
            .set(user);
    }

    userAlreadyExists(userName: string) {
        return new Promise<boolean>((resolve) => {
            this.firestore
                .collection('users', (ref) =>
                    ref.where('userName', '==', userName)
                )
                .get()
                .toPromise()
                .then((result) => {
                    resolve(result.empty ? false : true);
                });
        });
    }

    getUserByUserName(userNameId: string): Promise<IUser> {
        return new Promise<IUser>((resolve) => {
            const referencePath = this.firestore.collection('users', (ref) =>
                ref.where('userName', '==', userNameId)
            );
            referencePath
                .get()
                .toPromise()
                .then((user) => {
                    if (!user.empty) {
                        const {
                            userEmail,
                            userName,
                            isAdmin,
                            picture,
                            listIds,
                        } = user.docs[0].data();
                        const userObject: IUser = {
                            userEmail,
                            userName,
                            isAdmin,
                            picture,
                            userId: user.docs[0].data().id,
                            listIds,
                        };
                        return resolve(userObject);
                    } else {
                        resolve();
                    }
                });
        });
    }

    getUserById(userId: string): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            return this.firestore
                .collection('users', (ref) => ref.where('userId', '==', userId))
                .get()
                .toPromise()
                .then((user) => {
                    const userData = user.docs[0].data();
                    const userObject: IUser = {
                        userId: userData.userId,
                        userName: userData.userName,
                        userEmail: userData.userEmail,
                        picture: userData.picture,
                        isAdmin: userData.isAdmin,
                        listIds: userData.listIds,
                    };
                    resolve(userObject);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    updateUserLists(userId: string, listIds: string[]) {
        return this.firestore
            .collection('users')
            .doc(userId)
            .update({
                listIds,
            });
    }

    async addListToUser(userId: string, listId: string) {
        const user: IUser =
            userId === this.loggedInUser.userId
                ? this.loggedInUser
                : await this.getUserById(userId);
        if (!user.listIds) {
            user.listIds = [listId];
            await this.updateUserLists(userId, user.listIds);
        } else if (!user.listIds.includes(listId)) {
            user.listIds.push(listId);
            await this.updateUserLists(userId, user.listIds);
        }
    }

    async removeListFromUser(userId: string, listId: string) {
        const user: IUser =
            userId === this.loggedInUser.userId
                ? this.loggedInUser
                : await this.getUserById(userId);
        if (user.listIds.includes(listId)) {
            user.listIds.splice(user.listIds.indexOf(listId), 1);
            await this.updateUserLists(userId, user.listIds);
        }
    }
}
