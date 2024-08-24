import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputSwitchModule} from 'primeng/inputswitch';
import {PanelModule} from "primeng/panel";
import {DialogModule} from 'primeng/dialog';
import { PasswordModule } from "primeng/password";

import {ContraseniaRoutingModule} from "./contrasenia-routing-module";
import {ContraseniaComponent} from "./contrasenia.component";
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
    imports: [
        ContraseniaRoutingModule,
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
        PasswordModule,
        TooltipModule
    ],
    declarations: [ContraseniaComponent],
    providers: [CustomerService]
})

export class ContraseniaModule{

}
