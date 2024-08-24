import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {MatrizEventoRoutingModule} from './matriz-evento-routing-module';
import {MatrizEventoComponent} from './matriz-evento.component';
import {FormMatrizEventoComponent} from './form-matriz-evento.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {MessageService} from "primeng/api";
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {  NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {ComponentsModule} from "../../../../components/components.module";
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    imports: [
        MatrizEventoRoutingModule,
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
        NgxExtendedPdfViewerModule,
        CalendarModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        ComponentsModule,
        TooltipModule
    ],
    declarations: [MatrizEventoComponent, FormMatrizEventoComponent],
    providers: [MessageService]
})

export class MatrizEventoModule {
}
