import {NgModule} from "@angular/core";
import {IndicadorComponent} from "./indicador.component";
import {IndicadorRoutingModule} from "./indicador-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {SkeletonModule} from "primeng/skeleton";
import {FormIndicadorComponent} from "./form-indicador.component";

@NgModule({
    imports: [
        IndicadorRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        SkeletonModule
    ],
    declarations: [IndicadorComponent, FormIndicadorComponent]
})
export class IndicadorModule {}
