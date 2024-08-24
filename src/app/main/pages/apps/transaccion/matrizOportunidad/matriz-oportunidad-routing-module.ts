import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormMatrizOportunidadComponent } from './form-matriz-oportunidad.component';
import { MatrizOportunidadComponent } from './matriz-oportunidad.component';


const routes: Routes = [
    {
        path: '',
        component: MatrizOportunidadComponent
    },
    {
        path: 'registrar',
        component: FormMatrizOportunidadComponent
    },
    {
        path: 'editar/:idMatrizRiesgo',
        component: FormMatrizOportunidadComponent
    },
    {
        path: 'ver/:idMatrizRiesgo',
        component: FormMatrizOportunidadComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizOportunidadRoutingModule { }
