
import { FilesService } from 'src/app/core/service/files.service';
import { Archivo } from 'src/app/core/schema/archivo';
import {TipoEvidencia} from "../../../../../shared/models/tipoEvidencia";
import * as XLSX from 'xlsx';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Router } from '@angular/router';
import { MATRIZ_FRAUDE } from 'src/app/shared/Constantes'
import { DashboardService } from '../dashboard.service';
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';

@Component({
    selector : 'app-dash-matrizRiesgoFraude',
    templateUrl : './matriz-riesgo-fraude.component.html',
    styleUrls: ['./matriz-riesgo-fraude.component.css']
})

export class MatrizRiesgoFraudeComponent implements OnInit {

  idEmpresa: number;
  idPeriodo: number;  
  idMatriz : number=MATRIZ_FRAUDE;
  estado: string;
  payload: DataLogin;
  idPerfil:number;
  @Input() porcentaje: any;   

 ocultarTitulo : boolean = false; 
 ocultarCumplimiento : boolean = false;
 isoperacional : boolean = false;

constructor(private authLoginService: AuthLoginService,private dashboardService: DashboardService,private router: Router) {

  //this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;     
  this.solvePermissions();
}

ngOnInit(): void {
       
  //this.btnObjSistema;
  
}

ngOnChanges(changes: any) {

//.btnObjSistema;
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


empresaChange(idEmpresa:number){
  this.idPeriodo = null;
   this.idEmpresa= idEmpresa;
   this.ocultarTitulo = false;
   this.ocultarCumplimiento = false;
    
   if(this.idEmpresa > 0  && this.idPeriodo == 0) {
   
    this.eventoBtnInputOutput();
    this.obtenerGraphKri();
    this.obtenerPorcentajeCumplimiento(); 
    }    
  }
  
  periodoChange(idPeriodo:number){
  
    this.idPeriodo= idPeriodo;   
  
    if(this.idEmpresa > 0  && this.idPeriodo > 0) {
      this.ocultarCumplimiento = false;
      this.eventoBtnInputOutput();
      this.obtenerGraphKri();
      this.obtenerPorcentajeCumplimiento();
      
    }  
   
  }
  
  /*obtenerPorcentajeCumplimiento(idEmpresa,idPeriodo){  
    return this.dashboardService.obtenerGraphEvento(idEmpresa,idPeriodo).subscribe(resp => {       
        this.porcentaje = resp.porcentajeCumplimiento;
    });
  }*/

  obtenerPorcentajeCumplimiento(){

    console.log("KRI");
    return this.dashboardService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {
     
  
        if (resp.porcentajeCumplimiento.length > 0){
              
          this.porcentaje = resp.porcentajeCumplimiento;
        
        }else{
        this.porcentaje = null;
        }
   
    });
  }

   
  //Cantidad de Riesgos
  eventoBtnInputOutput(){
    return this.dashboardService.obtenerGraphInhe(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {  
       
         if (resp.listaDetalleGrafico.length > 0){          
         
          this.ocultarTitulo = true;
        
        }else{
          this.ocultarTitulo = false;
        }
   });  
   }


   obtenerGraphKri(){

    console.log("KRI");
    return this.dashboardService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {
           
      if (resp.listaDetalleGrafico.length > 0){          
       
        this.ocultarCumplimiento = true;
      
        }else{
          this.ocultarCumplimiento = false;
        }
   
    });
    
  } 

  
  }