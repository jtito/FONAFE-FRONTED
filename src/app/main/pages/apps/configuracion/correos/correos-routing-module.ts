import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { CorreosComponent } from './correos.component';
import { FormCorreosComponent } from './form-correos.component';

const routes: Routes = [
    {
        path: '',
        component: CorreosComponent
    },
    {
        path: 'registrar',
        component: FormCorreosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CorreosRoutingModule {}
