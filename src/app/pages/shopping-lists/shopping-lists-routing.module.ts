import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListsPage } from './shopping-lists.page';

const routes: Routes = [
    {
        path: '',
        component: ShoppingListsPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShoppingListsPageRoutingModule {}
