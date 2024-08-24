import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CustomerService } from '../../../../../fakedata/customerservice';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ButtonModule } from 'primeng/button';



import { SkeletonModule } from 'primeng/skeleton';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from "primeng/toast";
import { InputTextModule } from "primeng/inputtext";
;
import { MatrizOportunidadRoutingModule } from './matriz-oportunidad-routing-module';
import { MatrizOportunidadComponent } from './matriz-oportunidad.component';
import { FormMatrizOportunidadComponent } from './form-matriz-oportunidad.component';
import {DialogModule} from "primeng/dialog";
import {MessageService} from "primeng/api";
import {RiesgoInherenteComponent} from './riesgo-inherente/riesgo-inherente.component';
import {RiesgoResidualComponent} from './riesgo-residual/riesgo-residual.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ComponentsModule} from "../../../../components/components.module";
import { ZingchartAngularModule } from 'zingchart-angular';
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    imports: [
        MatrizOportunidadRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        ProgressBarModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ScrollingModule,
        DynamicDialogModule,
        ZingchartAngularModule,
        ButtonModule,
        SkeletonModule,
        KeyFilterModule,
        DialogModule,
        ToastModule,
        InputTextModule, FormsModule, ReactiveFormsModule,
        InputTextareaModule,
        ComponentsModule,
        TooltipModule
    ],
    declarations: [MatrizOportunidadComponent, FormMatrizOportunidadComponent,RiesgoInherenteComponent,RiesgoResidualComponent],
    providers: [MessageService]
})

export class MatrizOportunidadModule {
}
