import { Component, Input, OnInit, ViewChild, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import FileSaver from 'file-saver';

//import { HeaderGrafService } from 'src/app/main/components/headergraf/headergraf.service';
import { DashboardService } from '../dashboard.service';

import {MatrizRiesgo} from '../../../../../shared/models/matrizRiesgo';
import {BandejaMatrizRiesgo} from "../../../../../shared/models/bandejaMatrizRiesgo";
import { MatrizEvento } from 'src/app/shared/models/matrizEvento';

import { ZingchartAngularModule } from 'zingchart-angular';
import { R3TargetBinder } from '@angular/compiler';
import { convertCompilerOptionsFromJson } from 'typescript';
import { MATRIZ_EVENTO } from 'src/app/shared/Constantes';
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';

@Component({
    selector : 'app-dash-matrizEventoPerdida',
    templateUrl : './matriz-evento-perdida.component.html',
    styleUrls: ['./matriz-evento-perdida.component.css']
})

export class MatrizEventoPerdidaComponent implements OnInit, OnChanges {
  
  ///@ViewChild('chart6', {static: false}) chart6: any;

  idEmpresa: number;
  idPeriodo: number;  
  idMatriz : number=MATRIZ_EVENTO;
  estado: string;

  @Input() porcentaje: any;   

  ocultarTitulo : boolean = false;
  ocultarCumplimiento : boolean = false; 
  ocultarVolicimetro : boolean = false;
  payload: DataLogin;
  idPerfil:number;
  isoperacional : boolean = false;
  
  constructor(private authLoginService: AuthLoginService,private dashboardService: DashboardService , private router: Router) {

    //this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
   
    //this.obtenerPorcentajeCumplimiento(); 
    this.solvePermissions();      
  }
  
  ngOnInit() {  
   
  }


  ngOnChanges(changes) {    
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
    this.ocultarCumplimiento = false; 
    /*this.ocultarVolicimetro = false;
    this.ocultarTitulo = false;
    this.ocultarCumplimiento = false;*/
    
    if(this.idEmpresa > 0  && this.idPeriodo == 0) {
    
     //this.ocultarCumplimiento = true; 
   
    }    
  }
  
  periodoChange(idPeriodo:number){
  
    this.idPeriodo= idPeriodo; 
    this.ocultarCumplimiento = false;  
  
    if(this.idEmpresa > 0  && this.idPeriodo > 0) {   
   
    this.obtenerPorcentajeCumplimiento(); 
    //this.ocultarCumplimiento = false;    
    }   
  }  
 
  obtenerPorcentajeCumplimiento(){  
    return this.dashboardService.obtenerGraphEvento(this.idEmpresa,this.idPeriodo).subscribe(resp => {       
        //this.porcentaje = resp.porcentajeCumplimiento;

        //Cantidad de Eventos
        if (resp.listaGraficoEvento.length>0){            
         
            this.ocultarTitulo = true; 
          
        }else{
          this.ocultarTitulo = false; 
        } 

        //Cumplimiento
        if (resp.listaGraficoCump.length>0){            
         
          this.ocultarCumplimiento = true; 
          
        }else{
          this.ocultarCumplimiento = false; 
        } 

        //Volicimetro
       if (resp.nuPerdida > 0){           
         
          this.ocultarVolicimetro = true;        
        }
        else{
          this.ocultarVolicimetro = false;        
        }   

          //Porcentaje
       if (resp.porcentajeCumplimiento !=  ""){
            
          this.porcentaje = resp.porcentajeCumplimiento;         
          
        }else{
         
          this.porcentaje = null; 
        }     
     
      })    
  }
   
  /*eventoBtnInputOutput(){
    return this.dashboardService.obtenerGraphInhe(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {
  
         this.ocultarTitulo = true;  
   });
  
   }*/

   /*obtenerGraphKri(){

    //console.log("KRI");
    return this.dashboardService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {
      
      if (resp.listaDetalleGrafico.length > 0){
          
          this.ocultarCumplimiento = true;
      
      }else{
          this.ocultarCumplimiento = false;
      }  
    
    }) */   
      
  }


  