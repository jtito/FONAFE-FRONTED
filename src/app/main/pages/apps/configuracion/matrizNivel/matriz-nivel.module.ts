import {NgModule} from "@angular/core";
import {MatrizNivelComponent} from "./matriz-nivel.component";
import {MatrizNivelRoutingModule} from "./matriz-nivel-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {DropdownModule} from "primeng/dropdown";
import {SkeletonModule} from "primeng/skeleton";
import {DialogModule} from "primeng/dialog";
import {FormMatrizNivelComponent} from "./form-matriz-nivel.component";
import {InputSwitchModule} from 'primeng/inputswitch';
import {TooltipModule} from "primeng/tooltip";
import {MessageService} from "primeng/api";

@NgModule({
    imports: [
        MatrizNivelRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        DialogModule,
        SkeletonModule,
        InputSwitchModule,
        TooltipModule,
        ToastModule
    ],
    declarations: [MatrizNivelComponent, FormMatrizNivelComponent],
    providers: [MessageService]
})
export class MatrizNivelModule {}
