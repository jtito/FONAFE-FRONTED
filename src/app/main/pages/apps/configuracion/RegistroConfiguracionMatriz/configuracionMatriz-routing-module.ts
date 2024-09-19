import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ConfigMatrizComponent} from './configuracionMatriz.component';
import {FormConfiguracionMatrizComponent} from './form-configuracionMatriz.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigMatrizComponent
    },
    {
        path: 'registrar',
        component: FormConfiguracionMatrizComponent
    },
    {
        path: 'editar/:idConfigMatriz',
        component: FormConfiguracionMatrizComponent
    },
    {
        path: 'ver/:idConfigMatriz',
        component: FormConfiguracionMatrizComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ConfigMatrizRoutingModule {}
