import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {RiesgoControlComponent} from "./riesgo-control.component";
import {FormRiesgoControlComponent} from "./form-riesgo-control.component";

const routes: Routes = [
    {
        path: '',
        component: RiesgoControlComponent
    },
    {
        path: 'registrar',
        component: FormRiesgoControlComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RiesgoControlRoutingModule {
}
