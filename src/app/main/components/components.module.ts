import {NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from "primeng/tooltip";
import {CommonModule} from "@angular/common";
import {ImgUploadComponent} from "./file-upload/img-upload.component";
import {ProgressComponent} from "./progress/progress.component";
import { HeaderGrafComponent } from "./headergraf/headergraf.component";
import { BarComponent } from "./bar/bar.component";
import { PieGrafComponent } from "./piegraf/piegraf.component";
import { ZingchartAngularModule } from 'zingchart-angular';
import { GaugeGrafComponent } from "./gaugegraf/gaugegraf.component";
import { HeaderGraf2Component } from "./headergraf2/headergraf2.component";
import { BarGrafComponent } from "./bargraf/bargraf.component";
import { BarGraf2Component } from "./bargraf2/bargraf2.component";
import { BarGrafEventoComponent } from "./bargrafevento/bargrafevento.component";
import { SearchComponent } from "./search/search.component";
import { PieGrafOportunidadComponent } from "./piegrafoportunidad/piegrafoportunidad.component";
import { PieGrafContinuidadComponent } from "./piegrafcontinuidad/piegrafcontinuidad.component";
import { PieGrafAnticorrupcionComponent } from "./piegrafanticorrupcion/piegrafanticorrupcion.component";
import { PieGrafEventoComponent } from "./piegrafevento/piegrafevento.component";
import { PieGrafFraudeComponent } from "./piegraffraude/piegraffraude.component";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
@NgModule({
    imports: [
        TooltipModule,
        CommonModule,
        ZingchartAngularModule,  
     
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        ImgUploadComponent,
        ProgressComponent,
        HeaderGrafComponent,
        PieGrafComponent,       
        GaugeGrafComponent,
        BarComponent,       
        HeaderGraf2Component,
        SearchComponent,
        BarGrafComponent,
        BarGraf2Component,
        BarGrafEventoComponent,
        FormsModule,
        ReactiveFormsModule,
        PieGrafOportunidadComponent,
        PieGrafContinuidadComponent,
        PieGrafAnticorrupcionComponent,
        PieGrafEventoComponent,
        ForgotPasswordComponent,
        PieGrafFraudeComponent,
        RecoverPasswordComponent,
        ChangePasswordComponent
    ],
    declarations: [
        ImgUploadComponent,
        ProgressComponent,
        HeaderGrafComponent,
        PieGrafComponent,      
        BarComponent,
        GaugeGrafComponent,        
        HeaderGraf2Component,
        SearchComponent,
        BarGrafComponent,
        BarGraf2Component,
        BarGrafEventoComponent,
        PieGrafOportunidadComponent,
        PieGrafContinuidadComponent,
        PieGrafAnticorrupcionComponent,
        PieGrafEventoComponent,
        ForgotPasswordComponent,
        PieGrafFraudeComponent,
        RecoverPasswordComponent,
        ChangePasswordComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
})

export class ComponentsModule {
}
