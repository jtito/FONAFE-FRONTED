import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ButtonModule} from 'primeng/button';
import {PeriodoRoutingModule} from './periodo-routing-module';
import {PeriodoComponent} from './periodo.component';
import {FormPeriodoComponent} from './form-periodo.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from 'primeng/calendar';


@NgModule({
    imports: [
        PeriodoRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        ProgressBarModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        SkeletonModule,
        KeyFilterModule,
        CalendarModule,
        TooltipModule
    ],
    declarations: [PeriodoComponent, FormPeriodoComponent],
    providers: [CustomerService]
})

export class PeriodoModule {
}
