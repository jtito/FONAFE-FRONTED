import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputSwitchModule} from 'primeng/inputswitch';
import {PanelModule} from "primeng/panel";
import {DialogModule} from 'primeng/dialog';

import {ParametroRoutingModule} from './parametro-routing-module';
import {ParametroComponent} from './parametro.component';
import { FormParametroComponent } from './form-parametro.component';
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    imports: [
        ParametroRoutingModule,
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
    declarations: [ParametroComponent, FormParametroComponent],
    providers: [CustomerService]
})

export class ParametroModule{

}