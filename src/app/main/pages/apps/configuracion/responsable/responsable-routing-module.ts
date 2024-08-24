import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ResponsableComponent} from './responsable.component';
import {FormResponsableComponent} from "./form-responsable.component";

const routes: Routes = [
    {
        path: '',
        component: ResponsableComponent
    },
    {
        path: 'registrar',
        component: FormResponsableComponent
    },
    {
        path: 'editar/:idUsuario',
        component: FormResponsableComponent
    },
    {
        path: 'ver/:idUsuario',
        component: FormResponsableComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ResponsableRoutingModule {}
