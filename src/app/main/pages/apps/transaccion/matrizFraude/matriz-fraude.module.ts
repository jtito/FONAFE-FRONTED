import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {MatrizRiesgoRoutingModule} from './matriz-fraude-routing-module';
import {MatrizFraudeComponent} from './matriz-fraude.component';
import {FormMatrizFraudeComponent} from './form-matriz-fraude.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {MessageService} from "primeng/api";
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';
import {RiesgoInherenteComponent} from './riesgo-inherente/riesgo-inherente.component';
import {RiesgoResidualComponent} from './riesgo-residual/riesgo-residual.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RippleModule} from "primeng/ripple";
import {ComponentsModule} from "../../../../components/components.module";
import { ZingchartAngularModule } from 'zingchart-angular';
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
        SkeletonModule,
        KeyFilterModule,
        DialogModule,
        ToastModule,
        CalendarModule,
        InputTextModule,
        TooltipModule,
        DynamicDialogModule,
        ComponentsModule,
        ZingchartAngularModule,
        RippleModule,
        InputTextareaModule
    ],
    declarations: [MatrizFraudeComponent, FormMatrizFraudeComponent, RiesgoInherenteComponent, RiesgoResidualComponent],
    providers: [MessageService]
})

export class MatrizFraudeModule {
}
