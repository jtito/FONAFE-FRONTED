import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MatrizRiesgoOperacionalComponent } from './matriz-riesgo-operacional/matriz-riesgo-operacional.component';
import { MatrizRiesgoFraudeComponent } from './matriz-riesgo-fraude/matriz-riesgo-fraude.component';
import { MatrizEventoPerdidaComponent } from './matriz-evento-perdida/matriz-evento-perdida.component';
import { MatrizOportunidadComponent } from './matriz-oportunidad/matriz-oportunidad.component';
import { MatrizContinuidadComponent } from './matriz-continuidad/matriz-continuidad.component';
import { MatrizAnticorrupcionComponent } from './matriz-anticorrupcion/matriz-anticorrupcion.component';

const routes: Routes = [
    /*{
        path: '',
       component: MatrizRiesgoOperacionalComponent
    },*/
    {
        path: 'matriz-riesgo-operacional',
       component: MatrizRiesgoOperacionalComponent
    }, 
    {
        path: 'matriz-riesgo-fraude',
       component: MatrizRiesgoFraudeComponent
    },   
     
    {
        path: 'matriz-evento-perdida',
       component: MatrizEventoPerdidaComponent
    },    
    {
        path: 'matriz-oportunidad',
       component: MatrizOportunidadComponent
    },    
    {
        path: 'matriz-continuidad',
       component: MatrizContinuidadComponent
    },    
    {
        path: 'matriz-anticorrupcion',
       component: MatrizAnticorrupcionComponent
    }
   
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DashboardRoutingModule {
}
