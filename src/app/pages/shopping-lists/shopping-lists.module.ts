import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListsPageRoutingModule } from './shopping-lists-routing.module';

import { ShoppingListsPage } from './shopping-lists.page';
import { CreateListComponent } from '../../modals/create-list/create-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ShoppingListsPageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [ShoppingListsPage, CreateListComponent],
    entryComponents: [CreateListComponent],
})
export class ShoppingListsPageModule {}
