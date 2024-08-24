

import { Component, Input, OnInit, ViewChild,Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import FileSaver from 'file-saver';
import { PrimeNGConfig } from 'primeng/api';
import { DimensionMetodologia } from 'src/app/shared/models/dimensionMetodologia';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
//import { PieGrafComponent } from 'src/app/main/components/piegraf/piegraf.component';
import { HeaderGrafService } from 'src/app/main/components/headergraf/headergraf.service';
import { DashboardService } from '../dashboard.service';


import {MatrizRiesgo} from '../../../../../shared/models/matrizRiesgo';
import {BandejaMatrizRiesgo} from "../../../../../shared/models/bandejaMatrizRiesgo";
import { MatrizEvento } from 'src/app/shared/models/matrizEvento';

import { ZingchartAngularModule } from 'zingchart-angular';
import { R3TargetBinder } from '@angular/compiler';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { MATRIZ_OPERACIONAL } from 'src/app/shared/Constantes'
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';

@Component({
    selector : 'app-dash-matrizRiesgoOperacional',
    templateUrl : './matriz-riesgo-operacional.component.html',
    styleUrls: ['./matriz-riesgo-operacional.component.css']
})

export class MatrizRiesgoOperacionalComponent implements OnInit {

  listaEmpresa: Empresa[];
  empresa: Empresa; 
  idEmpresaSel: number;

  idEmpresa: number;
  idPeriodo: number;  
  idMatriz : number=MATRIZ_OPERACIONAL;
  idTipoMatriz : number;
  estado: string;
  @Input() btnObjSistema: any;
  @Input() idPeriodoss: any;s
  @Input() idEmpresass: any; 
  @Input() porcentaje: any;   
  payload: DataLogin;
  idPerfil:number;
 ocultarTitulo : boolean = false;   
 ocultarCumplimiento : boolean = false;
 isoperacional : boolean = true;
  
  constructor(private authLoginService: AuthLoginService,private dashboardService: DashboardService , private router: Router) {

    this.generateDataset();
    this.solvePermissions();  
    //this.ocultarTitulo;
     
  }
 
    ngOnInit(): void {
      
    }

    ngOnChanges(changes: any) {
   
  }

  solvePermissions(){
    this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    this.idPerfil = this.payload.data.idPerfil;
    if(this.idPerfil==TipoPerfil.admin){
        this.idEmpresa=0;
    }
    else{
        this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
    }
  }

generateDataset() {  

  function generateValues(num) {
    const max = 30;
    const min = 0;
    const dataset = [];
    for(let j = 0; j < 4; j++) {
      const values = [];  
      for(let i = 0; i < num; i++){
        //values.push( parseInt((Math.random() * max - min) + min) );
      }
      dataset.push(values);
    }
    return dataset;
  } 
}

empresaChange(idEmpresa:number){
  this.idPeriodo = null;
  this.idTipoMatriz = null;
 this.idEmpresa= idEmpresa; 
 this.ocultarTitulo = false;
 this.ocultarCumplimiento = false;

 if(this.idEmpresa > 0  && this.idPeriodo == 0) {
  
    this.ocultarCumplimiento = true;
  
 }
 
}

periodoChange(idPeriodo:number){
  //this.idTipoMatriz = null;
  this.idPeriodo= idPeriodo;

  if(this.idPeriodo > 0  && this.idEmpresa > 0 && this.idTipoMatriz >= 0) {
    this.ocultarCumplimiento = false;
    this.ocultarTitulo = false;
    this.eventoBtnInputOutput();
    this.obtenerGraphKri();
    this.obtenerPorcentajeCumplimiento();
 }   
}

tipomatrizChange(idTipoMatriz:number){

  this.idTipoMatriz= idTipoMatriz; 
  console.log("3012 CHANGE TIPO MAT ");

  if(this.idTipoMatriz >= 0 && this.idEmpresa > 0  && this.idPeriodo > 0) {

    console.log("3012 CHANGE TIPO MAT1");
    this.eventoBtnInputOutput();
    this.obtenerGraphKri();
    this.obtenerPorcentajeCumplimiento();
    //this.obtenerBarGraf2();
    this.ocultarCumplimiento = false;
  } 
}

obtenerPorcentajeCumplimiento(){

  console.log("KRI");
  return this.dashboardService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,this.idTipoMatriz,this.idMatriz).subscribe(resp => {
   

      if (resp.porcentajeCumplimiento.length > 0){
            
        this.porcentaje = resp.porcentajeCumplimiento;
      
      }else{
      this.porcentaje = null;
      }
 
  });
}

 
//CANTIDAD DE RIESGOS
eventoBtnInputOutput(){
  return this.dashboardService.obtenerGraphInhe(this.idEmpresa, this.idPeriodo,this.idTipoMatriz,this.idMatriz).subscribe(resp => {            

       if (resp.listaDetalleGrafico.length > 0){          
         
          this.ocultarTitulo = true;
        
      }else{
        this.ocultarTitulo = false;
      }
 })
 }


//CUMPLIMIENTO
 obtenerGraphKri(){

  //console.log("KRI");
  return this.dashboardService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,this.idTipoMatriz,this.idMatriz).subscribe(resp => {

      if (resp.listaDetalleGrafico.length > 0){          
       
          this.ocultarCumplimiento = true;
        
      }else{
          this.ocultarCumplimiento = false;
      }

    })  
  }

}

