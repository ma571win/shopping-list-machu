import { IItem } from './item-interface';

export interface IList {
    listName: string;
    items: IItem[];
    picture?: string;
    ownerUserId: string;
    listId: string;
    isEditable: boolean;
}
