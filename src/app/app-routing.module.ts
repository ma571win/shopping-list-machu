import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthCanActivateGuardGuard } from './guards/auth-can-activate-guard.guard';

const routes: Routes = [
    {
        path: 'shopping-lists',
        loadChildren: () =>
            import('./pages/shopping-lists/shopping-lists.module').then(
                (m) => m.ShoppingListsPageModule
            ),
        canActivate: [AuthCanActivateGuardGuard],
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'register',
        loadChildren: () =>
            import('./pages/register/register.module').then(
                (m) => m.RegisterPageModule
            ),
    },
    {
        path: '',
        redirectTo: 'shopping-lists',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
