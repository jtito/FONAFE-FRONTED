import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '../../shared/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'main/menu'
            },
            {
                path: 'auth',
                loadChildren: () => import ('./authentication/authentication.module').then(m => m.AuthenticationModule)
            },
            {
                path: 'main',
                canLoad: [AuthGuard],
                loadChildren: () => import ('./apps/apps.module').then(m => m.AppsModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
