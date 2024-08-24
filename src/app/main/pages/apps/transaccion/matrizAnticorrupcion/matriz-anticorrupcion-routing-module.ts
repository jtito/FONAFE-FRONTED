import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MatrizAnticorrupcionComponent} from './matriz-anticorrupcion.component';
import {FormMatrizAnticorrupcionComponent} from './form-matriz-anticorrupcion.component';

const routes: Routes = [
    {
        path: '',
        component: MatrizAnticorrupcionComponent
    },
    {
        path: 'registrar',
        component: FormMatrizAnticorrupcionComponent
    },
    {
        path: 'editar/:idMatrizRiesgo',
        component: FormMatrizAnticorrupcionComponent
    },
    {
        path: 'ver/:idMatrizRiesgo',
        component: FormMatrizAnticorrupcionComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizAnticorrupcionRoutingModule {}
