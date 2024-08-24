import {RouterModule, Routes} from "@angular/router";
import {EncuestaComponent} from "./encuesta.component";
import {NgModule} from "@angular/core";
import {FormEncuestaComponent} from "./form-encuesta.component";

const routes: Routes = [
    {
        path: '',
        component: EncuestaComponent
    },
    {
        path: 'registrar',
        component: FormEncuestaComponent
    },
    {
        path: 'editar/:idEncuesta',
        component: FormEncuestaComponent
    },
    {
        path: 'ver/:idEncuesta',
        component: FormEncuestaComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EncuestaRoutingModule {}
