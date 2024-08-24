import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MatrizContinuidadComponent} from './matriz-continuidad.component';
import {FormMatrizContinuidadComponent} from './form-matriz-continuidad.component';

const routes: Routes = [
    {
        path: '',
        component: MatrizContinuidadComponent
    },
    {
        path: 'registrar',
        component: FormMatrizContinuidadComponent
    },
    {
        path: 'editar/:idMatrizRiesgo',
        component: FormMatrizContinuidadComponent
    },
    {
        path: 'ver/:idMatrizRiesgo',
        component: FormMatrizContinuidadComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizContinuidadRoutingModule {}
