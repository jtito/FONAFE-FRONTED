import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ButtonModule} from 'primeng/button';
import { DimensionMetodologiaRoutingModule } from './dimension-metologia-routing-module';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import { DimensionMetodologiaComponent } from './dimension-metodologia.component';
import {CalendarModule} from 'primeng/calendar';
import { FormDimensionMetodologiaComponent } from './form-dimension-metodologia.component';
import {TooltipModule} from "primeng/tooltip";


@NgModule({
    imports: [
        DimensionMetodologiaRoutingModule,
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
    declarations: [DimensionMetodologiaComponent,FormDimensionMetodologiaComponent],
    providers: [CustomerService]
})

export class DimensionMetodologiaModule {
}