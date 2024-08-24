import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {NotificacionCorreoComponent} from "./notificacionCorreo.component";

const routes: Routes = [
    {
        path: '',
        component: NotificacionCorreoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NotificacionCorreoRoutingModule{}
