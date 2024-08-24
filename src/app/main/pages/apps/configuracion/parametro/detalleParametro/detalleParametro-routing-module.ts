import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { DetalleParametroComponent } from './detalleParametro.component';
import { FormDetalleParametroComponent } from './form-detalleParametro.component';

const routes: Routes = [
    {
        path: '',
        component: DetalleParametroComponent
    },
    {
        path: 'registrar/:idParametro',
        component: FormDetalleParametroComponent
    },
    {
        path: 'editar/:idDetaParametro/:idParametro',
        component: FormDetalleParametroComponent
    },
    {
        path: 'ver/:idDetaParametro/:idParametro',
        component: FormDetalleParametroComponent
    }    

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DetalleParametroRoutingModule {}