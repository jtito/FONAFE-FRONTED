import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MatrizEventoComponent} from './matriz-evento.component';
import {FormMatrizEventoComponent} from './form-matriz-evento.component';

const routes: Routes = [
    {
        path: '',
        component: MatrizEventoComponent
    },
    {
        path: 'registrar',
        component: FormMatrizEventoComponent
    },
    {
        path: 'editar/:idMatrizRiesgo',
        component: FormMatrizEventoComponent
    },
    {
        path: 'ver/:idMatrizRiesgo',
        component: FormMatrizEventoComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizEventoRoutingModule {}
