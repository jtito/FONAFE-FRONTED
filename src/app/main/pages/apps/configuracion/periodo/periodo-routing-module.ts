import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PeriodoComponent} from './periodo.component';
import {FormPeriodoComponent} from './form-periodo.component';

const routes: Routes = [
    {
        path: '',
        component: PeriodoComponent
    },
    {
        path: 'registrar',
        component: FormPeriodoComponent
    },
    {
        path: 'editar/:idPeriodo',
        component: FormPeriodoComponent
    },
    {
        path: 'ver/:idPeriodo',
        component: FormPeriodoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PeriodoRoutingModule {}
