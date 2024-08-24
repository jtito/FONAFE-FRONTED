import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BoardComponent} from '../../../theme/main-board/board.component';
import {SubAuthGuard} from '../../../shared/guards/subauth.guard';

const routes: Routes = [
    {
        path: '',
        component: BoardComponent,
        children: [
            {
                path: 'menu',
                
                loadChildren: () => import('./main-board/main-board.module').then(m => m.MainBoardModule)
            },
            {
                path: 'configuracion',
                canLoad: [SubAuthGuard],
                loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
            },
            {
                path: 'transaccion',
                canLoad: [SubAuthGuard],
                loadChildren: () => import('./transaccion/transaccion.module').then(m => m.TransaccionModule)
            },
            {
                path: 'dashboard',
                canLoad: [SubAuthGuard],
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'contrasenia',
                loadChildren: () => import('./contrasenia/contrasenia.module').then(m => m.ContraseniaModule)
            }
            

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppsRoutingModule {
}
