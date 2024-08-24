import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MatrizFraudeComponent} from './matriz-fraude.component';
import {FormMatrizFraudeComponent} from './form-matriz-fraude.component';

const routes: Routes = [
    {
        path: '',
        component: MatrizFraudeComponent
    },
    {
        path: 'registrar',
        component: FormMatrizFraudeComponent
    },
    {
        path: 'editar/:idMatrizRiesgo',
        component: FormMatrizFraudeComponent
    },
    {
        path: 'ver/:idMatrizRiesgo',
        component: FormMatrizFraudeComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizRiesgoRoutingModule {}
