import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {MatrizRiesgoRoutingModule} from './matriz-riesgo-routing-module';
import {MatrizRiesgoComponent} from './matriz-riesgo.component';
import {FormMatrizRiesgoComponent} from './form-matriz-riesgo.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {MessageService} from "primeng/api";
import {CalendarModule} from 'primeng/calendar';
import {RiesgoInherenteComponent} from './riesgo-inherente/riesgo-inherente.component';
import {RiesgoResidualComponent} from './riesgo-residual/riesgo-residual.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ComponentsModule} from "../../../../components/components.module";
import { ZingchartAngularModule } from 'zingchart-angular';
import {TooltipModule} from "primeng/tooltip";
import { CreateRiesgoComponent } from './create-riesgo/create-riesgo.component';

@NgModule({
    imports: [
        MatrizRiesgoRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        ProgressBarModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ScrollingModule,
        ButtonModule,
        DynamicDialogModule,
        ZingchartAngularModule,
        SkeletonModule,
        KeyFilterModule,
        DialogModule,
        ToastModule,
        CalendarModule,
        InputTextModule,
        InputTextareaModule,
        ComponentsModule,
        TooltipModule
    ],
    declarations: [MatrizRiesgoComponent, FormMatrizRiesgoComponent,RiesgoInherenteComponent,RiesgoResidualComponent, CreateRiesgoComponent],
    providers: [MessageService]
})

export class MatrizRiesgoModule {
}
