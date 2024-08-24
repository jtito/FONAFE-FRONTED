import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { HeaderGrafService } from './headergraf2.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginService } from '../../pages/authentication/auth-login/auth-login.service';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';


@Component({
  selector: 'app-headergraf2',
  templateUrl: './headergraf2.component.html',
  styleUrls: ['./headergraf2.component.scss']
})

export class HeaderGraf2Component implements OnInit {

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
  idPerfil:number;
  payload: DataLogin;
  //listaEmpresas: Empresa[];
  
  constructor(private authLoginService: AuthLoginService,private headerService: HeaderGrafService , private router: Router, private formBuilder: FormBuilder) {

    //this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
    this.solvePermissions();

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

  solvePermissions(){
    this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    this.idPerfil = this.payload.data.idPerfil;
    if(this.idPerfil==TipoPerfil.admin){
        
        this.idEmpresa=0;
        this.obtenerListaEmpresa();
        this.obtenerListaTipoMatriz();
        this.crearFormulario();
        this.obtenerListaEstadoParametros();
        
    }
    else{
        this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
        this.obtenerListaEmpresa();
        this.obtenerListaPeriodos();
        this.obtenerListaTipoMatriz();
        this.crearFormulario();
        this.obtenerListaEstadoParametros();
    }
  }

  obtenerListaEmpresa() {
    return this.headerService.obtenerListaEmpresas().subscribe(resp => {
        this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
          empresa.indicadorBaja == this.indicadorBaja    
      );
      console.log("LISTAR EMPRESA "+JSON.stringify(this.listaEmpresa[0]));
    });
}

obtenerListaPeriodos() {
  const anio = 0;
  return this.headerService.obtenerListaPeriodo(this.idEmpresa, anio).subscribe(resp => {
      this.listaPeriodo = resp.listaPeriodos.filter(periodo =>
          periodo.inBaja == this.indicadorBaja    
      );
  });
}



onChangeEmpresa(input): void {
  this.idEmpresa = input.target.value;
  if(this.idEmpresa!=0){
    console.log("EMIT2");
    this.empresaChange.emit(this.idEmpresa);
   
  }
  this.obtenerListaPeriodos();
 
}

onChangePeriodo(input) {
  this.idPeriodo = input.target.value; 
  if(this.idPeriodo!=0 && this.idEmpresa){
    this.periodoChange.emit(this.idPeriodo);
  }  
}


obtenerListaTipoMatriz() {

  this.headerService.obtenerListaTipoMatriz().subscribe(
      resp => {
         
          this.listaTiposMatrizRiesgo = resp.listaParametros;
          this.formularioHeadergraf.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[0].idParametro);
          console.log('lista de Tipo MatrizR1 : ' + JSON.stringify(this.listaTiposMatrizRiesgo[0]));
          // this.obtenerProcesosMatriz(this.listaTiposMatrizRiesgo[0].idParametro);
        //  this.formularioMatrizRiesgo.get('idMatrizNivel').disable();

      }
  );

}  

/*onChangeTipoMatriz(input) {

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

}*/

get idTipoMatrizNoValido(): boolean {
  return this.formularioHeadergraf.get('idTipoMatriz').invalid && this.formularioHeadergraf.get('idTipoMatriz').touched;
}

obtenerListaEstadoParametros() {

  this.headerService.obtenerListaEstadoParametros().subscribe(
      resp => {
          console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
          this.listaTiposMatriz = resp.listaParametros;


      }
  );

}

}