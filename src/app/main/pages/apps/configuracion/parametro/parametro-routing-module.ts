import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { ParametroComponent } from './parametro.component';
import { FormParametroComponent } from './form-parametro.component';

const routes: Routes = [
    {
        path: '',
        component: ParametroComponent
    },
    {
        path: 'registrar',
        component: FormParametroComponent
    },
    {
        path: 'editar/:idParametro',
        component: FormParametroComponent
    },
    {
        path: 'ver/:idParametro',
        component: FormParametroComponent
    },
    {
        path: 'detalle/:idParametro',
        loadChildren: () => import('./detalleParametro/detalleParametro.module').then(m => m.DetalleParametroModule)
    }   

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ParametroRoutingModule {}