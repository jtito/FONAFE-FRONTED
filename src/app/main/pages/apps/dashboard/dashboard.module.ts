import {NgModule} from '@angular/core';
import {DashboardRoutingModule} from './dashboard-routing.module';

import { ZingchartAngularModule } from 'zingchart-angular';
import { MatrizRiesgoOperacionalComponent } from './matriz-riesgo-operacional/matriz-riesgo-operacional.component';


import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {MessageService} from "primeng/api";
import {CalendarModule} from 'primeng/calendar';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {ComponentsModule} from "../../../../main/components/components.module";
import { MatrizRiesgoFraudeComponent } from './matriz-riesgo-fraude/matriz-riesgo-fraude.component';
import { MatrizAnticorrupcionComponent } from './matriz-anticorrupcion/matriz-anticorrupcion.component';
import { MatrizContinuidadComponent } from './matriz-continuidad/matriz-continuidad.component';
import { MatrizOportunidadComponent } from './matriz-oportunidad/matriz-oportunidad.component';
import { MatrizEventoPerdidaComponent } from './matriz-evento-perdida/matriz-evento-perdida.component';


@NgModule({
  imports: [
    DashboardRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    ProgressBarModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ScrollingModule,
    ButtonModule,
    DynamicDialogModule,
    ZingchartAngularModule,    
    KeyFilterModule,
    ComponentsModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    InputTextModule,
    ComponentsModule
  ],
  declarations: [
    MatrizRiesgoOperacionalComponent,
    MatrizRiesgoFraudeComponent,
    MatrizAnticorrupcionComponent,
    MatrizContinuidadComponent,
    MatrizOportunidadComponent,
    MatrizEventoPerdidaComponent
    ],
    bootstrap: [MatrizRiesgoOperacionalComponent, MatrizRiesgoFraudeComponent,MatrizAnticorrupcionComponent,
      MatrizContinuidadComponent,
      MatrizOportunidadComponent,
      MatrizEventoPerdidaComponent]
})

export class DashboardModule{}
