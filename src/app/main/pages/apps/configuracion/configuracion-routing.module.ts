import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: 'periodo',
        loadChildren: () => import('./periodo/periodo.module').then(m => m.PeriodoModule)
    },
    {
        path: 'empresa',
        loadChildren: () => import('./empresa/empresa.module').then(m => m.EmpresaModule)
    },
    {
        path: 'responsable',
        loadChildren: () => import('./responsable/responsable.module').then(m => m.ResponsableModule)
    },
    {
        path: 'dimensionMetodologia',
        loadChildren: () => import('./dimensionMetodologia/dimension-metodologia.module').then(m => m.DimensionMetodologiaModule)
    },
    {
        path: 'matrizNivel',
        loadChildren: () => import('./matrizNivel/matriz-nivel.module').then(m => m.MatrizNivelModule)
    },
    {
        path: 'riesgoControl',
        loadChildren: () => import('./riesgoControl/riesgo-control.module').then(m => m.RiesgoControlModule)
    },
    {
        path: 'encuesta',
        loadChildren: () => import('./encuesta/encuesta.module').then(m => m.EncuestaModule)
    },
    {
        path: 'indicador',
        loadChildren: () => import('./indicador/indicador.module').then(m => m.IndicadorModule)
    },
    {
        path: 'correos',
        loadChildren: () => import('./correos/correos.module').then(m => m.CorreosModule)
    },
    {
        path: 'parametro',
        loadChildren: () => import('./parametro/parametro.module').then(m => m.ParametroModule)
    },
    {
        path: 'notificacionCorreo',
        loadChildren: () => import('./notificacionCorreo/notificacionCorreo.module').then(m => m.notificacionCorreoModule)
    },
    {
        path: 'configuracionMatriz',
        loadChildren: () => import('./RegistroConfiguracionMatriz/configuracionMatriz.module').then(m => m.ConfiguracionMatrizModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ConfiguracionRoutingModule {
}
