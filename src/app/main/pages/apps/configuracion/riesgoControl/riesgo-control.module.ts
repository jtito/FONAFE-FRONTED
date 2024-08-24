import {NgModule} from "@angular/core";
import {RiesgoControlComponent} from "./riesgo-control.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {SkeletonModule} from "primeng/skeleton";
import {RiesgoControlRoutingModule} from "./riesgo-control-routing.module";
import {FormRiesgoControlComponent} from "./form-riesgo-control.component";
import {DialogModule} from "primeng/dialog";
import {PanelModule} from "primeng/panel";
import {KeyFilterModule} from "primeng/keyfilter";

@NgModule({
    imports: [
        RiesgoControlRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        SkeletonModule,
        DialogModule,
        PanelModule,
        KeyFilterModule
    ],
    declarations: [RiesgoControlComponent, FormRiesgoControlComponent]
})
export class RiesgoControlModule {
}
