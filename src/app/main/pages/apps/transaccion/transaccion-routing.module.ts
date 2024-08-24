import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: 'matrizRiesgo',
        loadChildren: () => import('../transaccion/matrizRiesgo/matriz-riesgo.module').then(m => m.MatrizRiesgoModule)
    },
    {
        path: 'matrizContinuidad',
        loadChildren: () => import('../transaccion/matrizContinuidad/matriz-continuidad.module').then(m => m.MatrizContinuidadModule)
    },
    {
        path: 'matrizFraude',
        loadChildren: () => import('../transaccion/matrizFraude/matriz-fraude.module').then(m => m.MatrizFraudeModule)
    },
    {
        path: 'matrizOportunidad',
        loadChildren: () => import('../transaccion/matrizOportunidad/matriz-oportunidad.module').then(m => m.MatrizOportunidadModule)
    }
    ,
    {
        path: 'matrizAnticorrupcion',
        loadChildren: () => import('../transaccion/matrizAnticorrupcion/matriz-anticorrupcion.module').then(m => m.MatrizAnticorrupcionModule)
    }

    ,
    {
        path: 'matrizEvento',
        loadChildren: () => import('../transaccion/matrizEvento/matriz-evento.module').then(m => m.MatrizEventoModule)
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TransaccionRoutingModule { }
