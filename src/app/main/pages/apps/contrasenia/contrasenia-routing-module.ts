import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ContraseniaComponent} from "./contrasenia.component";

const routes: Routes = [
    {
        path: '',
        component: ContraseniaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ContraseniaRoutingModule{}
