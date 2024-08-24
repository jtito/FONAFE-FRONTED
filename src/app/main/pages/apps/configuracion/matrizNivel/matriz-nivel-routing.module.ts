import {RouterModule, Routes} from "@angular/router";
import {MatrizNivelComponent} from "./matriz-nivel.component";
import {NgModule} from "@angular/core";
import {FormMatrizNivelComponent} from "./form-matriz-nivel.component";

const routes: Routes = [
    {
        path: '',
        component: MatrizNivelComponent
    },
    {
        path: 'registrar',
        component: FormMatrizNivelComponent
    }
    ,
    {
        path: 'editar/:idProcesoMatriz',
        component: FormMatrizNivelComponent
    }
    ,
    {
        path: 'ver/:idProcesoMatriz',
        component: FormMatrizNivelComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MatrizNivelRoutingModule {
}
