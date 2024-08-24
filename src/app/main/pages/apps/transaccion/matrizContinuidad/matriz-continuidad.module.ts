import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {MatrizContinuidadRoutingModule} from './matriz-continuidad-routing-module';
import {MatrizContinuidadComponent} from './matriz-continuidad.component';
import {FormMatrizContinuidadComponent} from './form-matriz-continuidad.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
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
        MatrizContinuidadRoutingModule,
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
        DialogModule,
        DynamicDialogModule,
        ZingchartAngularModule,
        ToastModule,
        InputTextModule,
        InputTextareaModule,
        ComponentsModule,
        TooltipModule
    ],
    declarations: [MatrizContinuidadComponent, FormMatrizContinuidadComponent, RiesgoInherenteComponent, RiesgoResidualComponent],
    providers: [MessageService]
})

export class MatrizContinuidadModule {
}
