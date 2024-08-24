import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { SearchService } from './search.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';
import {AuthLoginService} from "../../pages/authentication/auth-login/auth-login.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  formularioHeadergraf: FormGroup;
  idEmpresa: number;
  idPeriodo: number;  
  estado: string;
  indicadorBaja: number = 1;
 
  @Input() btnObjSistema: any;
  @Input() idPeriodoss: any;
  @Input() idEmpresass: any;
  listaPeriodo: any;
  listaEmpresa: any;
  @Output() empresaChange = new EventEmitter<number>();
  @Output() periodoChange = new EventEmitter<number>();

  listaTiposMatriz = [];
  listaTiposMatrizRiesgo = [];

  idTipoMatriz: number;
  idTipoMatrizSelect: number=0;
  payload: DataLogin;
  idPerfil: number;
  tipoPerfilAuditor: TipoPerfil;
  
  //listaEmpresas: Empresa[];
  
  constructor(public authLoginService:AuthLoginService,private searchService: SearchService , private router: Router, private formBuilder: FormBuilder) {

    //this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
    this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    this.idPerfil = this.payload.data.idPerfil;
    this.tipoPerfilAuditor=this.idPerfil;
    if(this.tipoPerfilAuditor==TipoPerfil.admin){
        this.obtenerListaEmpresa();
    }
    else{
        this.idEmpresa=this.payload.data.datosEmpresa.idEmpresa;
        this.obtenerListaPeriodos();
    }
    
    this.obtenerListaTipoMatriz();
    this.crearFormulario();
    this.obtenerListaEstadoParametros();

  }


  private crearFormulario(): void {
    console.log('Se construyo el form');
    this.formularioHeadergraf = this.formBuilder.group({
        empresa: ['', Validators.required],
        sede: ['', Validators.required],
        cartera: ['', Validators.required],
        periodo: ['', Validators.required],
        idTipoMatriz: ['', Validators.required],
        idMatrizRiesgo: ['', ],
       // idMatrizNivel: ['', Validators.required],
        descripcionGerencia: [''],
        idEstado:'0'
    });
}


    ngOnInit(): void {
       
        //this.btnObjSistema;
    }

    ngOnChanges(changes: any) {

      //.btnObjSistema;
  }

  obtenerListaEmpresa() {
    return this.searchService.obtenerListaEmpresas().subscribe(resp => {
        this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
          empresa.indicadorBaja == this.indicadorBaja    
      );
      console.log("LISTAR EMPRESA "+JSON.stringify(this.listaEmpresa[0]));
    });
}

obtenerListaPeriodos() {
  const anio = 0;
  return this.searchService.obtenerListaPeriodo(this.idEmpresa, anio).subscribe(resp => {
      this.listaPeriodo = resp.listaPeriodos.filter(periodo =>
          periodo.inBaja == this.indicadorBaja    
      );
  });
}



onChangeEmpresa(input): void {
  this.idEmpresa = input.target.value;
  /*if(this.idEmpresa!=0 && this.idPeriodo){
    this.empresaChange.emit(this.idEmpresa);
    
  }*/

  if(this.idEmpresa!=0){
    this.empresaChange.emit(this.idEmpresa);
    this.obtenerListaPeriodos();
    
  }else{
    this.empresaChange.emit(this.idEmpresa);
    this.idPeriodo=0;
    this.listaPeriodo = [];
  }

 
}

onChangePeriodo(input) {
  this.idPeriodo = input.target.value;
  /*if(this.idPeriodo!=0 && this.idEmpresa){
    this.periodoChange.emit(this.idPeriodo);
  } */

  this.periodoChange.emit(this.idPeriodo);  

}

/*
get idTipoMatrizNoValido(): boolean {
  return this.formularioHeaderGraf.get('idTipoMatriz').invalid && this.formularioHeaderGraf.get('idTipoMatriz').touched;
}*/

obtenerListaTipoMatriz() {

  this.searchService.obtenerListaTipoMatriz().subscribe(
      resp => {
         
          this.listaTiposMatrizRiesgo = resp.listaParametros;
          //this.formularioHeadergraf.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[0].idParametro);
          console.log('lista de Tipo MatrizR1 : ' + JSON.stringify(this.listaTiposMatrizRiesgo[0]));
          // this.obtenerProcesosMatriz(this.listaTiposMatrizRiesgo[0].idParametro);
        //  this.formularioMatrizRiesgo.get('idMatrizNivel').disable();

      }
  );

}  

onChangeTipoMatriz(input) {

  const idTipoMatriz = input.target.value;
  this.idTipoMatriz = idTipoMatriz;
  var tipomatriz = "";
  this.idTipoMatrizSelect =  input.target.value;

  for (var j = 0; j < this.listaTiposMatriz.length; j++) {


      if (this.idTipoMatriz == this.listaTiposMatriz[j].nombreParametro) {

          tipomatriz = this.listaTiposMatriz[j].deValor1;
          console.log(this.idTipoMatrizSelect);

      }

  }

  /*if (tipomatriz == "Entidad") {

      this.showColumnasEntidad();
  } else {

      this.showColumnasProcesos();
  }*/


  // this.obtenerListaMatriz();

}

get idTipoMatrizNoValido(): boolean {
  return this.formularioHeadergraf.get('idTipoMatriz').invalid && this.formularioHeadergraf.get('idTipoMatriz').touched;
}

obtenerListaEstadoParametros() {

  this.searchService.obtenerListaEstadoParametros().subscribe(
      resp => {
          console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
          this.listaTiposMatriz = resp.listaParametros;


      }
  );

}

}