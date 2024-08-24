import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { DimensionMetodologiaComponent } from './dimension-metodologia.component';
import { FormDimensionMetodologiaComponent } from './form-dimension-metodologia.component';

const routes: Routes = [
    {
        path: '',
        component: DimensionMetodologiaComponent
    },
    {
        path: 'registrar',
        component: FormDimensionMetodologiaComponent
    },
    {
        path: 'editar/:idDimRiesgo',
        component: FormDimensionMetodologiaComponent
    },
    {
        path: 'ver/:idDimRiesgo',
        component: FormDimensionMetodologiaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DimensionMetodologiaRoutingModule {}
