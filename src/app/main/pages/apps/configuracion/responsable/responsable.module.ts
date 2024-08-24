import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {CustomerService} from '../../../../../fakedata/customerservice';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {ResponsableRoutingModule} from './responsable-routing-module';
import {ResponsableComponent} from './responsable.component';
import {SkeletonModule} from 'primeng/skeleton';
import {KeyFilterModule} from 'primeng/keyfilter';
import {FormResponsableComponent} from "./form-responsable.component";
import {ComponentsModule} from "../../../../components/components.module";
import { MultiSelectModule } from 'primeng/multiselect';

import {TooltipModule} from 'primeng/tooltip';

@NgModule({
    imports: [
        ResponsableRoutingModule,
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
        ComponentsModule,
        TooltipModule,
        MultiSelectModule
    ],
    declarations: [ResponsableComponent, FormResponsableComponent],
    providers: [CustomerService]
})

export class ResponsableModule {
}
