import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MatrizRiesgoComponent} from './matriz-riesgo.component';
import {FormMatrizRiesgoComponent} from './form-matriz-riesgo.component';

const routes: Routes = [
    {
        path: '',
        component: MatrizRiesgoComponent
    },
    {
        path: 'registrar',
        component: FormMatrizRiesgoComponent
    },
    {
        path: 'editar/:idMatrizRiesgo',
        component: FormMatrizRiesgoComponent
    },
    {
        path: 'ver/:idMatrizRiesgo',
        component: FormMatrizRiesgoComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizRiesgoRoutingModule {}
