import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EmpresaComponent} from './empresa.component';
import {FormEmpresaComponent} from './form-empresa.component';

const routes: Routes = [
    {
        path: '',
        component: EmpresaComponent
    },
    {
        path: 'registrar',
        component: FormEmpresaComponent
    },
    {
        path: 'editar/:idEmpresa',
        component: FormEmpresaComponent
    },
    {
        path: 'ver/:idEmpresa',
        component: FormEmpresaComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmpresaRoutingModule {}
