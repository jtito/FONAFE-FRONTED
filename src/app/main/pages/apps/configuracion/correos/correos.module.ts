import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ButtonModule} from 'primeng/button';
import { CorreosRoutingModule } from './correos-routing-module';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import { CorreosComponent } from './correos.component';
import {CalendarModule} from 'primeng/calendar';
import { FormCorreosComponent } from './form-correos.component';


@NgModule({
    imports: [
        CorreosRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        ProgressBarModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        SkeletonModule,
        KeyFilterModule,
        CalendarModule
    ],
    declarations: [CorreosComponent,FormCorreosComponent],
    providers: [CustomerService]
})

export class CorreosModule {
}