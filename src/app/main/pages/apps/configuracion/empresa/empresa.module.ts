import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {EmpresaRoutingModule} from './empresa-routing-module';
import {EmpresaComponent} from './empresa.component';
import {FormEmpresaComponent} from './form-empresa.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputSwitchModule} from 'primeng/inputswitch';
import {PanelModule} from "primeng/panel";
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    imports: [
        EmpresaRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        ProgressBarModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ScrollingModule,
        ButtonModule,
        SkeletonModule,
        KeyFilterModule,
        InputSwitchModule,
        PanelModule,
        DialogModule,
        TooltipModule
    ],
    declarations: [EmpresaComponent, FormEmpresaComponent],
    providers: [CustomerService]
})

export class EmpresaModule {
}
