import {RouterModule, Routes} from "@angular/router";
import {IndicadorComponent} from "./indicador.component";
import {NgModule} from "@angular/core";
import {FormIndicadorComponent} from "./form-indicador.component";

const routes: Routes = [
    {
        path: '',
        component: IndicadorComponent
    },
    {
        path: 'registrar',
        component: FormIndicadorComponent
    },
    {
        path: 'editar/:idIndicador',
        component: FormIndicadorComponent
    },
    {
        path: 'ver/:idIndicador',
        component: FormIndicadorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class IndicadorRoutingModule {
}
