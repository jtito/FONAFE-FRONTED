import {NgModule} from "@angular/core";
import {EncuestaComponent} from "./encuesta.component";
import {EncuestaRoutingModule} from "./encuesta-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {SkeletonModule} from "primeng/skeleton";
import {DialogModule} from "primeng/dialog";
import {PanelModule} from "primeng/panel";
import {KeyFilterModule} from "primeng/keyfilter";
import {FormEncuestaComponent} from "./form-encuesta.component";
import {CalendarModule} from "primeng/calendar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputSwitchModule} from 'primeng/inputswitch';
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    imports: [
        EncuestaRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        SkeletonModule,
        DialogModule,
        PanelModule,
        KeyFilterModule,
        CalendarModule,
        InputTextareaModule,
        InputSwitchModule,
        RippleModule,
        TooltipModule,
    ],
    declarations: [EncuestaComponent, FormEncuestaComponent]
})
export class EncuestaModule {
}
