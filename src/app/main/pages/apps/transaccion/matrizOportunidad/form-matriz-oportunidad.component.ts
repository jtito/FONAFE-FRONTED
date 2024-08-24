import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatrizRiesgo } from '../../../../../shared/models/matrizRiesgo';
import { Parametro } from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { MessageService } from "primeng/api";
import { Empresa } from "../../../../../shared/models/empresa";
import { Sede } from "../../../../../shared/models/sede";
import { Periodo } from "../../../../../shared/models/periodo";
import { MatrizNivel } from "../../../../../shared/models/matrizNivel";
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { Gerencia } from "../../../../../shared/models/gerencia";
import { Proceso } from "../../../../../shared/models/proceso";
import { SubProceso } from "../../../../../shared/models/subproceso";
import { of } from 'rxjs';
import { MatrizOportunidadService } from './matriz-oportunidad.service';
import { MatrizOportunidad } from 'src/app/shared/models/matrizOportunidad';
import { MatrizOportunidadDetalle } from 'src/app/shared/models/matrizOportunidadDetalle';
import { MATRIZ_OPORTUNIDAD } from 'src/app/shared/Constantes';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {RiesgoInherenteComponent} from "../matrizOportunidad/riesgo-inherente/riesgo-inherente.component";
import { RiesgoResidualComponent } from '../matrizOportunidad/riesgo-residual/riesgo-residual.component';
import { cartesianPoint } from 'src/app/shared/models/cartesianPoint';
import {TipoMatrizRiesgo} from "../../../../../shared/models/tipoMatrizRiesgo";
import FileSaver from 'file-saver';
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";

@Component({
  selector: 'app-conf-registrar-matriz-oportunidad',
  templateUrl: 'form-matriz-oportunidad.component.html',
  providers: [DialogService],

  styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})

export class FormMatrizOportunidadComponent implements OnInit {

  formularioMatrizOportunidad: FormGroup;
  matrizRiesgo: MatrizRiesgo;
  matrizOportunidad: MatrizOportunidad;
  matrizOportunidadDetalle: MatrizOportunidadDetalle[] = [];
  matrizOportEliminado: MatrizOportunidadDetalle[] = [];
  loading: boolean;
  listaEstados: Parametro[];
  listaEmpresas: Empresa[];
  listaCarteras: Parametro[];
  listaTiposMatriz = [];
  listaTiposMatrizRiesgo = [];
  listaSedes: Sede[];
  listaPeriodos: Periodo[];
  listaMatrizNivel: Parametro[];
  listaOrigenRiesgo: Parametro[];
  listaFrecuenciaRiesgo: Parametro[];
  listaTipoRiesgo: Parametro[];
  listaAreaResponsable: Parametro[];
  listaResponsableControl: Parametro[];
  listaFrecuenciaControl: Parametro[];
  listaOportunidadControl: Parametro[];
  listaAutomatizacionControl: Parametro[];
  listaProcesosGestion: any;
  listEstrategiaPlan: Parametro[];
  listobtenerIndicadorSeleccionSINO: Parametro[];
  listobtenerobtenerEstadoPlanAccion: Parametro[];
  listaobtenerPlanAccionEficaz: Parametro[];
  listaTipoDeBeneficio: Parametro[];
  listaTipos: Parametro[];
  editar: boolean;

  idEstado: string;
  idEmpresa: number;
  idCartera: number;
  idTipoMatriz: number;
  idSede:number;
  idTipoMatrizSelect: number = 0;
  idTipoMatrizNivel: number = 0;
  indicadorBaja: number = 1;

  cols: any[];
  fijoCols: any[];
  matricesRiesgo: MatrizRiesgo[];
  matricesOportunidadDetalle: MatrizOportunidadDetalle[];
  matrizRiesgoEditar: MatrizRiesgo;
  matrizRiesgoTemporal: { [s: string]: MatrizRiesgo; } = {};
  payload: DataLogin;

  /*lista detalle matriz*/
  listaGerencias: Gerencia[];
  listaProcesos: Proceso[];
  listaSubProcesos: SubProceso[];

  listaProcesosSelected: Proceso[];
  listaSubProcesosSelected: SubProceso[];


  SelectedCant = "";
  DisplayControl: boolean = false;
  matrizRiesgoTemp: MatrizRiesgo;
  ri: number = 0; //indice

  ref: DynamicDialogRef;

  idMatrizContinuidad: number = 45;

  probImpInherente: number[] = [];
  impInherente: number[] = [];
  probImpResidual: number[] = [];
  ImpResidual: number[] = [];

  idPerfil: number;
  tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
  notadmin:boolean;
  tipoPerfilUsuario: TipoPerfil = TipoPerfil.user;
  ver:boolean=false;

  dataIp: string = "";

  constructor(public dialogService: DialogService,private authLoginService: AuthLoginService, private formBuilder: FormBuilder, private router: Router,
    private matrizRiesgoService: MatrizOportunidadService, private activatedRoute: ActivatedRoute,
    private messageService: MessageService) {

    this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    this.idPerfil = this.payload.data.idPerfil;
    this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
    this.idSede = this.payload.data.datosSede.idSede;
    this.obtenerListaEmpresas();
    this.obtenerListaCarteras();
    this.obtenerTipoMatriz();
    this.obtenerListaMatrizNivel();
    this.obtenerListaTipoMatriz();
    this.crearFormulario();
    this.obtenerListaEstadoParametros();
    this.obtenerListaEstados();
    this.solvePermissions();
    this.obtenerListaOrigenRiesgo();
    this.obtenerListaFrecuenciaRiesgo();
    this.obtenerListaTipoRiesgo();

    this.obtenerListaAreaResponsable();
    this.obtenerListaResponsableControl();
    this.obtenerListaFrecuenciaControl();
    this.obtenerListaOportunidadControl();
    this.obtenerListaAutomatizacionControl();
    this.listaGerencias = [{ idGerencia: 0, descripcionGerencia: 'Seleccione' }];
    this.listaProcesos = [{ idProceso: 0, deProceso: 'Seleccione' }];
   // this.obtenerProceso();
    this.obtenerEstrategiaPlanAccion();
    this.obtenerIndicadorSeleccionSINO();
    this.obtenerEstadoPlanAccion();
    this.obtenerPlanAccionEficaz();
    this.obtenerTipoBeneficio();

    this.obtenermetodoIP();

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.idMatrizRiesgo) {
        this.loading = true;
      }
      if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
        this.editar = true;
        this.ver    = false;
        this.formularioMatrizOportunidad.disable();
      }else if(this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
        //  this.formularioMatrizRiesgo.disable();
          this.cargarListas();
          this.ver = false;
          this.editar = false;
          this.formularioMatrizOportunidad.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
          this.formularioMatrizOportunidad.get('sede').setValue(this.payload.data.datosSede.idSede);
          this.formularioMatrizOportunidad.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
          this.obtenerProcesosMatriz(MATRIZ_OPORTUNIDAD);

      }else if(this.activatedRoute.snapshot.url[0].toString() === 'ver') {
                this.formularioMatrizOportunidad.disable();
                this.ver = true;
                this.editar = false;
      } else {
        this.formularioMatrizOportunidad.disable();
        this.ver = false;
        this.editar = false;
      }
    });
    this.formularioMatrizOportunidad.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
    this.formularioMatrizOportunidad.get('sede').setValue(this.payload.data.datosSede.idSede);
    this.formularioMatrizOportunidad.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
    this.cargarMatrizRiesgo();

    this.fijoCols = [
      {
        field: 'idMatrizRiesgo',
        header: 'COD',
        class: 'text-center',
        ordenadmiento: 'idMatrizRiesgo',
        headerClass: ''
      }
    ];

    this.cols = [

      {
        field: 'deOrigen',
        header: 'Origen',
        class: 'text-center tdsmall',
        ordenadmiento: 'deOrigen',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'deGrupoInteres',
        header: 'Grupos de Interés',
        class: 'text-center tdzlarge',
        ordenadmiento: 'deGrupoInteres',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      },
      {
        field: 'idGerencia',
        header: 'Gerencia Responsable',
        class: 'text-center tdxlarge',
        ordenadmiento: 'idGerencia',
        headerClass: 'text-center tdxlarge',
        colspan:"4"
      },
      {
        field: 'deObjetivo',
        header: 'Objetivos (Estratégico o Específico)',
        class: 'text-center tdzlarge',
        ordenadmiento: 'deObjetivo',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      },

      {
        field: 'idProceso',
        header: 'Proceso / Sistema De Gestión',
        class: 'text-center tdzlarge',
        ordenadmiento: 'idProceso',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      },

      {
        field: 'codOpor',
        header: 'Código',
        class: 'text-center static-sticky-col tdlarge',
        ordenadmiento: 'codOpor',
        headerClass: 'text-center static-sticky-col tdlarge',
        colspan:"2"
      },
      {
        field: 'deOportunidad',
        header: 'Oportunidad',
        class: 'text-center static-sticky-col1 tdzlarge',
        ordenadmiento: 'deOportunidad',
        headerClass: 'text-center static-sticky-col1 tdzlarge',
        colspan:"3"
      },
      {
        field: 'nivelComplejidad',
        header: 'Nivel de Complejidad',
        class: 'text-center tdsmall',
        ordenadmiento: 'nivelComplejidad',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'nivelCosto',
        header: 'Nivel de Costo',
        class: 'text-center tdsmall',
        ordenadmiento: 'nivelCosto',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },

      {
        field: 'nuViabilidad',
        header: 'Viabilidad (V)',
        class: 'text-center tdsmall',
        ordenadmiento: 'nuViabilidad',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'idTipoBeneficio',
        header: 'Tipo de Beneficio',
        class: 'text-center tdlarge',
        ordenadmiento: 'idTipoBeneficio',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'nuBeneficio',
        header: 'Beneficio (B)',
        class: 'text-center tdsmall',
        ordenadmiento: 'nuBeneficio',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'nuNivelPriori',
        header: 'NP = B x V',
        class: 'text-center tdsmall',
        ordenadmiento: 'nuNivelPriori',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'deNivelPriori',
        header: 'Nivel de Priorización',
        class: 'text-center tdsmall',
        ordenadmiento: 'deNivelPriori',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'idEstrategiaPlan',
        header: 'Estrategia',
        class: 'text-center tdlarge',
        ordenadmiento: 'idEstrategiaPlan',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'codSam',
        header: 'Código SAM / Iniciativa PMO / Otros',
        class: 'text-center tdlarge',
        ordenadmiento: 'codSam',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'codPlanAccion',
        header: 'Código del plan de acción',
        class: 'text-center tdlarge',
        ordenadmiento: 'codPlanAccion',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'dePlanAccion',
        header: 'Plan de acción',
        class: 'text-center tdzlarge',
        ordenadmiento: 'dePlanAccion',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      },
      {
        field: 'idRespPlanAccion',
        header: 'Responsable',
        class: 'text-center tdlarge',
        ordenadmiento: 'idRespPlanAccion',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },

      {
        field: 'recursoFina',
        header: 'Recursos Financiero (S/.)',
        class: 'text-center tdsmall',
        ordenadmiento: 'recursoFina',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'recursoOper',
        header: 'Recursos Operacionales',
        class: 'text-center tdsmall',
        ordenadmiento: 'recursoOper',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'recursoTecno',
        header: 'Recursos Tecnológicos',
        class: 'text-center tdsmall',
        ordenadmiento: 'recursoTecno',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'recursoHuma',
        header: 'Recursos Humanos',
        class: 'text-center tdsmall',
        ordenadmiento: 'recursoHuma',
        headerClass: 'text-center tdsmalp',
        colspan:"1"
      },
      {
        field: 'reqNego',
        header: 'Requisitos de Negocio',
        class: 'text-center tdsmall',
        ordenadmiento: 'reqNego',
        headerClass: 'text-center tdsmall',
        colspan:"1"
      },
      {
        field: 'feIniPlanAccion',
        header: 'Fecha de Inicio',
        class: 'text-center tdlarge',
        ordenadmiento: 'feIniPlanAccion',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'feFinPlanAccion',
        header: 'Fecha Fin',
        class: 'text-center tdlarge',
        ordenadmiento: 'feFinPlanAccion',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'deEntregable',
        header: 'Entregable',
        class: 'text-center tdzlarge',
        ordenadmiento: 'deEntregable',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      },
      {
        field: 'idEstadoPlanAccion',
        header: 'Estado',
        class: 'text-center tdlarge',
        ordenadmiento: 'idEstadoPlanAccion',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'fePrevista',
        header: 'Fecha prevista',
        class: 'text-center tdlarge',
        ordenadmiento: 'fePrevista',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'inEficaz',
        header: '¿El plan de acción fue eficaz?',
        class: 'text-center tdlarge',
        ordenadmiento: 'inEficaz',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'feVerificacion',
        header: 'Fecha de verificación',
        class: 'text-center tdlarge',
        ordenadmiento: 'feVerificacion',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      },
      {
        field: 'idVerificador',
        header: 'Verificado por',
        class: 'text-center tdlarge',
        ordenadmiento: 'idVerificador',
        headerClass: 'text-center tdlarge',
        colspan:"2"
      }, {
        field: 'deEvidencia',
        header: 'Evidencia',
        class: 'text-center tdzlarge',
        ordenadmiento: 'deEvidencia',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      },
      {
        field: 'deComentario',
        header: 'Comentario',
        class: 'text-center tdzlarge',
        ordenadmiento: 'deComentario',
        headerClass: 'text-center tdzlarge',
        colspan:"3"
      }
    ];
    this.matricesRiesgo = [];
    console.log(this.loading);
  }

  cargarListas(){

    this.obtenerListaSedes();
    this.obtenerListaPeriodos();
    this.obtenerListaGerencia();
  }

  solvePermissions(){
    this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    this.idPerfil = this.payload.data.idPerfil;
    if(this.idPerfil==TipoPerfil.admin){
        this.notadmin=false;
    }
    else{
        this.notadmin=true;
        this.formularioMatrizOportunidad.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
    }
  }


  public cargarMatrizRiesgo(): void {

    this.activatedRoute.params.subscribe(params => {
      const idMatrizRiesgo = params.idMatrizRiesgo;
      const idUsuario = this.payload.data.idUsuario;
      if (idMatrizRiesgo) {
        this.matrizRiesgoService.obtenerMatrizOportunidad(idMatrizRiesgo, idUsuario).subscribe(
          resp => {
            // console.log("MATRIZ RIESGO " + JSON.stringify(resp));
            this.matrizOportunidad = resp.MatrizOportunidad;

            this.formularioMatrizOportunidad.get('empresa').setValue(this.matrizOportunidad.idEmpresa);
            this.formularioMatrizOportunidad.get('sede').setValue(this.matrizOportunidad.idSede);
            //this.formularioMatrizOportunidad.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);

            this.obtenerEmpresa(this.matrizOportunidad.idEmpresa);

            this.formularioMatrizOportunidad.get('periodo').setValue(this.matrizOportunidad.idPeriodo);
            this.formularioMatrizOportunidad.get('idMatrizNivel').setValue(this.matrizOportunidad.idTipoMatriz);
            this.formularioMatrizOportunidad.get('idTipoMatriz').setValue(this.matrizOportunidad.idMatrizNivel);
            this.formularioMatrizOportunidad.get('idEstado').setValue(this.matrizOportunidad.indicadorBaja);
            this.formularioMatrizOportunidad.get('periodo').disable();
            this.formularioMatrizOportunidad.get('idTipoMatriz').disable();
            this.formularioMatrizOportunidad.get('idMatrizNivel').disable();
            this.idEmpresa = this.matrizOportunidad.idEmpresa;
            this.idTipoMatriz = this.matrizOportunidad.idTipoMatriz;
            this.idTipoMatrizSelect = this.matrizOportunidad.idMatrizNivel;

            for (var j = 0; j < this.matrizOportunidad.listaDetalleMatrizOportunidad.length; j++) {

              var orden = this.matrizOportunidad.listaDetalleMatrizOportunidad.length;

              var NP = (this.matrizOportunidad.listaDetalleMatrizOportunidad[j].nuViabilidad * this.matrizOportunidad.listaDetalleMatrizOportunidad[j].nuBeneficio);
              this.matrizOportunidad.listaDetalleMatrizOportunidad[j].nuNivelPriori = NP;
              //  this.matrizOportunidad.listaDetalleMatrizOportunidad[j].ordenTabla = orden;
              this.matrizOportunidadDetalle.push(this.matrizOportunidad.listaDetalleMatrizOportunidad[j]);

            }

            // this.obtenerListaMatriz();

            this.idEmpresa= this.matrizOportunidad.idEmpresa;
            this.idSede = this.matrizOportunidad.idSede;
            this.obtenerListaSedes();
            this.obtenerListaPeriodos();
            this.obtenerListaGerencia();
            this.formularioMatrizOportunidad.get('empresa').setValue(this.matrizOportunidad.idEmpresa);
            this.formularioMatrizOportunidad.get('sede').setValue(this.matrizOportunidad.idSede);
            this.formularioMatrizOportunidad.get('cartera').setValue(this.matrizOportunidad.idCartera);
            this.obtenerProcesosMatriz(MATRIZ_OPORTUNIDAD);
            this.loading = false;

          }
        );
      }
    });


  }

  obtenerEmpresa(idEmpresa:number){

    this.matrizRiesgoService.obtenerEmpresa(idEmpresa).subscribe(
        resp => {

            this.formularioMatrizOportunidad.get('cartera').setValue(resp.Empresa.idCartera);


        }
    );

}


  private crearFormulario(): void {
    //console.log('Se construyo el form');
    this.formularioMatrizOportunidad = this.formBuilder.group({
      empresa: ['', Validators.required],
      sede: ['', Validators.required],
      cartera: ['', Validators.required],
      periodo: ['', Validators.required],
      idTipoMatriz: ['', Validators.required],
      idMatrizRiesgo: [''],
      idMatrizNivel: ['', Validators.required],
      descripcionGerencia: [''],
      idEstado: '0'
    });
  }

  obtenerListaEmpresas() {
    return this.matrizRiesgoService.obtenerListaEmpresas().subscribe(resp => {
      this.listaEmpresas = resp.listaEmpresas.filter(empresa =>
        empresa.indicadorBaja == this.indicadorBaja
    );
    });
  }

  obtenerListaCarteras(): void {
    this.matrizRiesgoService.obtenerListaCarteras().subscribe(
      resp => {
        this.listaCarteras = resp.listaParametros;

      }
    );
  }

  obtenerListaSedes(): void {
    this.matrizRiesgoService.obtenerListaSedes(this.idEmpresa).subscribe(
      resp => {
        this.listaSedes = resp.listaSedes.filter(sede =>
          sede.indicadorBaja == this.indicadorBaja
        );
      }
    );
  }

  obtenerListaPeriodos() {
    const anio = 0;
    return this.matrizRiesgoService.obtenerListaPeriodo(this.idEmpresa, anio).subscribe(resp => {
      this.listaPeriodos = resp.listaPeriodos.filter(periodo =>
        periodo.inBaja == this.indicadorBaja
    );
    });
  }


  obtenerTipoMatriz() {

  }

  obtenerListaMatrizNivel() {
    return this.matrizRiesgoService.obtenerListaMatrizNivel().subscribe(resp => {
      //       this.listaMatrizNivel = resp.listaParametros;
    });
  }

  obtenerListaProcesos() {
    return this.matrizRiesgoService.obtenerListaMatrizNivel().subscribe(resp => {
      //         this.listaMatrizNivel = resp.listaParametros;
    });
  }

  obtenerListaOrigenRiesgo() {
    return this.matrizRiesgoService.obtenerListaOrigenRiesgo().subscribe(resp => {

      console.log("LISTA ORIGEN R " + JSON.stringify(resp));
      this.listaOrigenRiesgo = resp.listaParametros;
    });
  }

  obtenerListaFrecuenciaRiesgo() {
    return this.matrizRiesgoService.obtenerListaFrecuenciaRiesgo().subscribe(resp => {
      this.listaFrecuenciaRiesgo = resp.listaParametros;
    });
  }

  obtenerListaTipoRiesgo() {
    return this.matrizRiesgoService.obtenerListaTiposRiesgo().subscribe(resp => {
      this.listaTipoRiesgo = resp.listaParametros;
    });
  }

  obtenerListaAreaResponsable() {
    return this.matrizRiesgoService.obtenerListaAreaResponsable().subscribe(resp => {
      this.listaAreaResponsable = resp.listaParametros;
    });
  }

  obtenerListaResponsableControl() {
    return this.matrizRiesgoService.obtenerListaResponsableControl().subscribe(resp => {
      this.listaResponsableControl = resp.listaParametros;
    });
  }

  obtenerListaFrecuenciaControl() {
    return this.matrizRiesgoService.obtenerListaFrecuenciaControl().subscribe(resp => {
      this.listaFrecuenciaControl = resp.listaParametros;
    });
  }

  obtenerListaOportunidadControl() {
    return this.matrizRiesgoService.obtenerListaOportunidadControl().subscribe(resp => {
      this.listaOportunidadControl = resp.listaParametros;
    });
  }

  obtenerListaAutomatizacionControl() {
    return this.matrizRiesgoService.obtenerListaAutomatizacionControl().subscribe(resp => {
      this.listaAutomatizacionControl = resp.listaParametros;
    });
  }

  onChangeEstado(deviceValue): void {
    this.idEstado = deviceValue.target.value;
  }

  onChangeArea(deviceValue): void {
    // this.idEstado = deviceValue.target.value;
  }

  onChangeResponsable(deviceValue): void {
    // this.idEstado = deviceValue.target.value;
  }

  onChangeEmpresa(deviceValue): void {
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if (this.listaEmpresas[i].idEmpresa == deviceValue.target.value) {
        this.idCartera = this.listaEmpresas[i].idCartera;
      }
    }
    this.formularioMatrizOportunidad.get('cartera').setValue(this.idCartera)
    this.idEmpresa = deviceValue.target.value;
    this.obtenerListaPeriodos();
    this.obtenerListaSedes();
  }

  onChangeCartera(input) {

  }

  onChangeSede(input) {


  }

  onChangePeriodo(input) {

  }

  onChangeTipoMatriz(input) {

    const idTipoMatriz = input.target.value;
    this.idTipoMatriz = idTipoMatriz;
    var tipomatriz = "";
    this.idTipoMatrizSelect = input.target.value;

    for (var j = 0; j < this.listaTiposMatriz.length; j++) {


      if (this.idTipoMatriz == this.listaTiposMatriz[j].nombreParametro) {

        tipomatriz = this.listaTiposMatriz[j].deValor1;
        console.log(this.idTipoMatrizSelect);

      }

    }

    // this.obtenerListaMatriz();

  }


  onChangeProceso(event, indice) {

    const idproceso = event.target.value;
    const idSede = this.payload.data.datosSede.idSede;
    const idEmpresa = this.idEmpresa;
    // this.matricesRiesgo[indice].idMatrizNivel = this.matricesRiesgo[indice].listaProcesos[0].idMatrizNivel;

    return this.matrizRiesgoService.obtenerSubProcesos(idproceso).subscribe(
      resp => {
        // @ts-ignore
        console.log("ProcesosSel " + JSON.stringify(resp));
        console.log("Indice " + indice);
        this.listaSubProcesosSelected = resp.listaSubProcesos;
        this.matricesRiesgo[indice].listaSubProcesos = [];
        this.matricesRiesgo[indice].listaSubProcesos = resp.listaSubProcesos;
        console.log("Gerencia1 " + JSON.stringify(this.matricesRiesgo[indice]));

        //    this.listaGerencias =resp.listaGerencias;

      });


  }

  onChangeSubProceso(event) {

    const idsubproceso = event.target.value;


  }

  onChangeMatrizNivel(input) {

    const idTipoMatriz = input.target.value;
    const idSede = this.payload.data.datosSede.idSede;
    const idEmpresa = this.idEmpresa;

    return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, idTipoMatriz).subscribe(
      resp => {
        this.listaProcesosSelected = resp.listaProceso;
        //  console.log("Gerencia1 "+JSON.stringify(resp));

        //    this.listaGerencias =resp.listaGerencias;
        console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
      });

  }

  obtenerProcesosMatriz(idTipoMatriz) {


    const idSede = this.payload.data.datosSede.idSede;
    const idEmpresa = this.idEmpresa;

    return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, idTipoMatriz).subscribe(
      resp => {
        this.listaProcesosSelected = resp.listaProceso.filter(proceso =>
          proceso.indicadorBaja == this.indicadorBaja
        );

      });

  }
  /*
    cargarProcesos(idMatriz, idProceso) {

      const idEmpresa = this.idEmpresa;
      const idSede = this.payload.data.datosSede.idSede;

      return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, idSede, 1, idMatriz).subscribe(
        resp => {
          // @ts-ignore
          this.this.listaProcesosSelected = resp.listaProceso;

          for (var j = 0; j < this.matricesRiesgo.length; j++) {

            this.matricesRiesgo[j].listaProcesos = this.listaProcesosSelected;

          }

          this.cargarSubProcesos(idProceso);
          //  console.log("Gerencia1 "+JSON.stringify(resp));

          //    this.listaGerencias =resp.listaGerencias;
          console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
        });

    }*/

  cargarSubProcesos(idProceso) {

    const idEmpresa = this.idEmpresa;
    const idSede = this.payload.data.datosSede.idSede;

    return this.matrizRiesgoService.obtenerSubProcesos(idProceso).subscribe(
      resp => {
        // @ts-ignore

        this.listaSubProcesosSelected = resp.listaSubProcesos;
        for (var j = 0; j < this.matricesRiesgo.length; j++) {

          this.matricesRiesgo[j].listaSubProcesos = this.listaSubProcesosSelected;

        }

        //    this.listaGerencias =resp.listaGerencias;

      });


  }


  agregarMatrizRiesgo(): void {

    if (this.formularioMatrizOportunidad.invalid) {
      return Object.values(this.formularioMatrizOportunidad.controls).forEach(control => {
          control.markAsTouched();
      });
  }

    const idEmpresa = this.formularioMatrizOportunidad.get('empresa').value;
    const idCartera = this.formularioMatrizOportunidad.get('cartera').value;
    const idSede = this.formularioMatrizOportunidad.get('sede').value;
    const idPeriodo = this.formularioMatrizOportunidad.get('periodo').value;
    const idTipoMatriz = this.formularioMatrizOportunidad.get('idMatrizNivel').value;
    const idMatrizNivel = this.formularioMatrizOportunidad.get('idTipoMatriz').value;
    const idControl = this.matricesRiesgo.length;
    const orden = this.matricesRiesgo.length;
    const idMatrizRiesgo = this.getIdMatrizNextVal();
    const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    const usuarioCreacion = datosToken.data.username;
    const ipCreacion = this.dataIp; //"127.0.0.1";

    this.formularioMatrizOportunidad.disable();

    var matrizRiesgo: MatrizOportunidad = {
      idMatrizRiesgo: idMatrizRiesgo,
      idEmpresa: idEmpresa,
      idCartera: idCartera,
      idSede: idSede,
      idPeriodo: idPeriodo,
      idTipoMatriz: idTipoMatriz,
      idGerencia: 0,
      usuarioCreacion: usuarioCreacion,
      ipCreacion: ipCreacion,
      deCartera: "",
      idMatrizNivel: idMatrizNivel,
      listaDetalleMatrizOportunidad: []

    };

    var control: MatrizOportunidadDetalle = new MatrizOportunidadDetalle();
    // control.ordenTabla = 0;
    control.idMatrizRiesgo = idMatrizRiesgo;

    control.idPeriodo = matrizRiesgo.idPeriodo;
    control.idEmpresa = matrizRiesgo.idEmpresa;
    control.idMatrizNivel = idMatrizNivel;

    control.usuarioCreacion = usuarioCreacion;
    control.ipCreacion = ipCreacion;

    this.matrizOportunidadDetalle.push(control);

  }

  getCorrelativoRiesgo(idRiesgo: number): string {

    var inicial: string = "R";
    var correlativo: string = idRiesgo.toString() + inicial + "0";

    return correlativo;

  }

  getCorrelativoControl(idRiesgo: number, idControl: number): string {

    var inicial: string = "C";
    var correlativo: string = idRiesgo.toString() + inicial + idControl;

    return correlativo;

  }

  getIdMatrizNextVal(): number {

    var nextid: number = 0;

    for (var j = 0; j < this.matricesRiesgo.length; j++) {


      nextid = this.matricesRiesgo[j].idMatrizRiesgo;
      console.log("NEXTID " + nextid);

    }
    nextid = nextid + 1;


    return nextid;
  }

  getIdControlNextVal(idMatriz: number): number {

    var nextid: number = 0;

    for (var j = 0; j < this.matricesRiesgo.length; j++) {


      console.log("GET ID MATRIZ " + this.matricesRiesgo[j].idMatrizRiesgo + " idma " + idMatriz);
      if (this.matricesRiesgo[j].idMatrizRiesgo == idMatriz) {
        nextid = this.matricesRiesgo[j].idCodigoControl;
      }



    }
    nextid = nextid + 1;
    console.log("GET ID MATRIZ N " + nextid);


    return nextid;
  }


  obtenerListaGerencia() {

    //   console.log("Sede "+JSON.stringify(this.payload.data));
    return this.matrizRiesgoService.obtenerListaGerencia(this.idEmpresa, this.idSede).subscribe(
      resp => {
        // @ts-ignore
        this.listaGerencias = resp.listaGerencias.filter(gerencia =>
          gerencia.indicadorBaja == this.indicadorBaja
        );
      });
  }

  obtenerListaMatriz() {


    const idSede = this.payload.data.datosSede.idSede;
    //     console.log("Sede "+JSON.stringify(this.payload.data));
    return this.matrizRiesgoService.obtenerListaMatriz(this.idEmpresa, idSede, this.idTipoMatriz).subscribe(
      resp => {
        // @ts-ignore
        this.listaMatrizNivel = resp.listaMatriz;
        //  console.log("Gerencia1 "+JSON.stringify(resp));

        //    this.listaGerencias =resp.listaGerencias;
        console.log("Matriz 1 " + JSON.stringify(this.listaMatrizNivel));
      });
  }

  replicarMatrices(matrizRiesgoTemp: MatrizRiesgo, ri: number) {
    this.showControl();
    this.matrizRiesgoTemp = matrizRiesgoTemp;
    this.ri = ri;

    //this.matricesRiesgo.push(matrizRiesgoTemp);
  }

  showControl(): void {
    this.DisplayControl = true;
  }

  hideControl(): void {
    this.DisplayControl = false;
  }

  AgregarControl(): void {

    const idEmpresa = this.formularioMatrizOportunidad.get('empresa').value;
    const idCartera = this.formularioMatrizOportunidad.get('cartera').value;
    const idSede = this.formularioMatrizOportunidad.get('sede').value;
    const idPeriodo = this.formularioMatrizOportunidad.get('periodo').value;
    const idTipoMatriz = this.formularioMatrizOportunidad.get('idMatrizNivel').value;
    const cantidad: number = Number(this.SelectedCant);
    const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    const idMatrizNivel = this.formularioMatrizOportunidad.get('idTipoMatriz').value;

    const usuarioCreacion = datosToken.data.username;
    const ipCreacion = this.dataIp; //"127.0.0.1";
    console.log("La cantidad " + cantidad);

    if (cantidad > 0) {

      var cant = cantidad;
      var orden = this.matricesRiesgo.length;

      console.log("El orden " + orden + " cant " + cant);
      for (var j = 0; j < orden; j++) {

        console.log("run MATRIZ ");
        if (this.matricesRiesgo[j].idCodigoControl != undefined) {

          if (this.matricesRiesgo[j].idMatrizRiesgo == this.matrizRiesgoTemp.idMatrizRiesgo) {

            if (this.matricesRiesgo[j].modified) {

            } else {

              var control: MatrizRiesgo = new MatrizRiesgo();
              control.ordenTabla = j + 1;
              control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;

              control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
              control.idProceso = this.matrizRiesgoTemp.idProceso;
              control.idSubProceso = this.matrizRiesgoTemp.idSubProceso;
              control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
              control.idFrecuenciaControl = this.matrizRiesgoTemp.idFrecuenciaControl;

              control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
              control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
              control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;
              control.idCodigoControl = j;
              control.idMatrizNivel = idMatrizNivel;
              control.idSede = this.matrizRiesgoTemp.idSede;
              control.deCartera = "";
              control.idGerencia = this.matrizRiesgoTemp.idGerencia;
              control.usuarioCreacion = usuarioCreacion;
              control.ipCreacion = ipCreacion;
              control.idOrigenRiesgo = this.matrizRiesgoTemp.idOrigenRiesgo;
              control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
              control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;
              control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
              control.nuImpactoInherente = this.matrizRiesgoTemp.nuImpactoInherente;
              control.deControl = this.matrizRiesgoTemp.deControl;
              control.idOportunidadControl = this.matrizRiesgoTemp.idOportunidadControl;
              control.idAutomatizacionControl = this.matrizRiesgoTemp.idAutomatizacionControl;
              control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
              control.nuImpactoResidual = this.matrizRiesgoTemp.nuImpactoResidual;
              control.deEvidenciaControl = this.matrizRiesgoTemp.deEvidenciaControl;
              control.listaDetalleMatriz = [];
              control.deFoda = this.matrizRiesgoTemp.deFoda;
              control.deGrupoInteres = this.matrizRiesgoTemp.deGrupoInteres;
              const codRiesgo = this.getCorrelativoRiesgo(this.matrizRiesgoTemp.idMatrizRiesgo);
              const nextidControl = this.getIdControlNextVal(this.matrizRiesgoTemp.idMatrizRiesgo);
              const codControl = this.getCorrelativoControl(this.matrizRiesgoTemp.idMatrizRiesgo, nextidControl);
              control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
              control.codControl = codControl;
              control.idAreaControl = this.matrizRiesgoTemp.idAreaControl;
              control.idResponsableControl = this.matrizRiesgoTemp.idResponsableControl;

              const sev_riesgo = this.getProbabilidad(control.nuProbabilidadInherente, control.nuImpactoInherente);
              const sev_control = this.getProbabilidad(control.nuProbabilidadResidual, control.nuImpactoResidual);

              control.nuPuntajeInherente = sev_riesgo;
              control.nuPuntajeResidual = sev_control;
              control.deSeveridadInherente = this.obtener_severidad(control.nuProbabilidadInherente, control.nuImpactoInherente);
              control.deSeveridadResidual = this.obtener_severidad(control.nuProbabilidadResidual, control.nuImpactoResidual);


              //    this.matricesRiesgo[j] = control;
              this.matricesRiesgo.push(control);
              if (this.matricesRiesgo[this.ri].listaDetalleMatriz != undefined) {
                this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
              } else {
                this.matricesRiesgo[this.ri].listaDetalleMatriz = [];
                this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
              }


              console.log("ADD MATRIZ " + this.ri);
            }

            cant--;

          }


        }
        else {
          //    this.matricesRiesgo[j].idCodigoControl = j;
          //    this.matricesRiesgo.push(control);
          //    cant--;
        }

      }

      for (var i = 0; i < cant; i++) {

        var control: MatrizRiesgo = new MatrizRiesgo();
        orden++;
        control.ordenTabla = orden;
        control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;

        control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
        control.idProceso = this.matrizRiesgoTemp.idProceso;
        control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
        control.idSubProceso = this.matrizRiesgoTemp.idSubProceso;
        control.idFrecuenciaControl = this.matrizRiesgoTemp.idFrecuenciaControl;
        control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
        control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
        control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
        control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;

        control.idSede = this.matrizRiesgoTemp.idSede
        control.deCartera = "";
        control.idMatrizNivel = idMatrizNivel;
        control.idCodigoControl = j;
        control.usuarioCreacion = usuarioCreacion;
        control.ipCreacion = ipCreacion;
        control.idGerencia = this.matrizRiesgoTemp.idGerencia;
        control.idOrigenRiesgo = this.matrizRiesgoTemp.idOrigenRiesgo;
        control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
        control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;
        control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
        control.nuImpactoInherente = this.matrizRiesgoTemp.nuImpactoInherente;
        control.deControl = this.matrizRiesgoTemp.deControl;
        control.idOportunidadControl = this.matrizRiesgoTemp.idOportunidadControl;
        control.idAutomatizacionControl = this.matrizRiesgoTemp.idAutomatizacionControl;
        control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
        control.nuImpactoResidual = this.matrizRiesgoTemp.nuImpactoResidual;
        control.deEvidenciaControl = this.matrizRiesgoTemp.deEvidenciaControl;
        control.listaDetalleMatriz = [];
        control.deFoda = this.matrizRiesgoTemp.deFoda;
        control.deGrupoInteres = this.matrizRiesgoTemp.deGrupoInteres;
        const codRiesgo = this.getCorrelativoRiesgo(this.matrizRiesgoTemp.idMatrizRiesgo);

        const nextidControl = this.getIdControlNextVal(this.matrizRiesgoTemp.idMatrizRiesgo);
        const codControl = this.getCorrelativoControl(this.matrizRiesgoTemp.idMatrizRiesgo, nextidControl);
        control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
        control.codControl = codControl;
        control.idAreaControl = this.matrizRiesgoTemp.idAreaControl;
        control.idResponsableControl = this.matrizRiesgoTemp.idResponsableControl;

        const sev_riesgo = this.getProbabilidad(control.nuProbabilidadInherente, control.nuImpactoInherente);
        const sev_control = this.getProbabilidad(control.nuProbabilidadResidual, control.nuImpactoResidual);

        control.nuPuntajeInherente = sev_riesgo;
        control.nuPuntajeResidual = sev_control;
        control.deSeveridadInherente = this.obtener_severidad(control.nuProbabilidadInherente, control.nuImpactoInherente);
        control.deSeveridadResidual = this.obtener_severidad(control.nuProbabilidadResidual, control.nuImpactoResidual);



        this.matricesRiesgo.push(control);

        if (this.matricesRiesgo[this.ri].listaDetalleMatriz != undefined) {
          this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
        } else {
          this.matricesRiesgo[this.ri].listaDetalleMatriz = [];
          this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
        }

        console.log("Matriz " + this.ri);
      }
      this.DisplayControl = false;

    } else {
      this.DisplayControl = false;
    }

    console.log("LONG " + this.matricesRiesgo[1].listaDetalleMatriz.length);


  }


  editarRegistro(matrizRiesgoTemp: MatrizRiesgo, idMatriz: number) {


    //   this.matrizRiesgoTemp=matrizRiesgoTemp;
    //   if (matrizRiesgoTemp.idMatrizRiesgo == idMatriz) {
    this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo] = { ...matrizRiesgoTemp };
    console.log("Matriz Edit " + JSON.stringify(matrizRiesgoTemp));
    //  }
  }

  registrarMatrizRiesgo() {


    console.log("REG MATRIZ " + JSON.stringify(this.matrizOportunidadDetalle[0]));

    const idEmpresa = this.formularioMatrizOportunidad.get('empresa').value;
    const idCartera = this.formularioMatrizOportunidad.get('cartera').value;
    const idSede = this.formularioMatrizOportunidad.get('sede').value;
    const idPeriodo = this.formularioMatrizOportunidad.get('periodo').value;
    const idTipoMatriz = this.formularioMatrizOportunidad.get('idMatrizNivel').value;
    // const idMatrizNivel = this.matricesRiesgo[0].idMatrizNivel;
    const idMatrizNivel = this.formularioMatrizOportunidad.get('idTipoMatriz').value;
    const orden = this.matricesRiesgo.length;
    const idMatrizRiesgo = this.getIdMatrizNextVal();
    const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

    const usuarioCreacion = datosToken.data.username;
    const ipCreacion = this.dataIp; //"127.0.0.1";

    var matrizOportunidad: MatrizOportunidad = {
      idMatrizRiesgo: idMatrizRiesgo,
      idEmpresa: idEmpresa,
      idCartera: idCartera,
      idSede: idSede,
      idPeriodo: idPeriodo,
      idTipoMatriz: idTipoMatriz,
      //listaProcesos: [],
      //listaSubProcesos: [],
      idGerencia: 0,
      usuarioCreacion: usuarioCreacion,
      ipCreacion: ipCreacion,
      deCartera: "",
      idMatrizNivel: idMatrizNivel,
      listaDetalleMatrizOportunidad: []

    };

    for (var j = 0; j < this.matrizOportunidadDetalle.length; j++) {

      matrizOportunidad.listaDetalleMatrizOportunidad.push(this.matrizOportunidadDetalle[j]);

    }

    if (matrizOportunidad.listaDetalleMatrizOportunidad.length == 0){
      Swal.fire("Debe de ingresar el detalle de la Matriz de Oportunidades");

    } else{

      Swal.fire({
        title: '¿Está seguro de crear la Matriz de Oportunidades?',
        showCancelButton: true,
        confirmButtonText: `Crear`,
        cancelButtonText: `Cancelar`,
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Espere por favor',
            html: 'Estamos creando la Matriz de Oportunidades',
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
          });
          Swal.showLoading();
          this.matrizRiesgoService.registrarMatrizOportunidad(matrizOportunidad).subscribe(
            resp => {
              //console.log(resp);
              if (resp.idMatrizRiesgo !== 0) {
                if (Swal.isLoading()) {
                  Swal.close();
                }
                //console.log("REG: MATRIZ " + JSON.stringify(resp));
                Swal.fire('¡Creación exitosa!', "La Matriz de Oportunidades se creó con éxito", 'success');
                this.router.navigate(['/pages', 'main', 'transaccion', 'matrizOportunidad']);

              }else {
                if (Swal.isLoading()) {
                    Swal.close();
                    Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                }
              }


            });

        }
      });
    }

  }


  actualizarMatrizRiesgo() {

    //console.log("REG MATRIZ " + JSON.stringify(this.matricesRiesgo[0]));

    const idEmpresa = this.formularioMatrizOportunidad.get('empresa').value;
    const idCartera = this.formularioMatrizOportunidad.get('cartera').value;
    const idSede = this.formularioMatrizOportunidad.get('sede').value;
    const idPeriodo = this.formularioMatrizOportunidad.get('periodo').value;
    const idTipoMatriz = this.formularioMatrizOportunidad.get('idMatrizNivel').value;
    const idMatrizNivel = this.formularioMatrizOportunidad.get('idTipoMatriz').value;
    const indicadorBaja = this.formularioMatrizOportunidad.get('idEstado').value;
    const orden = this.matricesRiesgo.length;
    const idMatrizRiesgo = this.matrizOportunidad.idMatrizRiesgo;
    const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

    const usuarioCreacion = datosToken.data.username;
    const ipCreacion = this.dataIp;  //"127.0.0.1";

    var matrizOportunidad: MatrizOportunidad = {
      idMatrizRiesgo: idMatrizRiesgo,
      idEmpresa: idEmpresa,
      idCartera: idCartera,
      idSede: idSede,
      idPeriodo: idPeriodo,
      idTipoMatriz: idTipoMatriz,
      //matrizNivel: matrizNivel,
      //listaProcesos: [],
      //listaSubProcesos: [],
      idGerencia: 0,
      usuarioCreacion: usuarioCreacion,
      ipCreacion: ipCreacion,
      deCartera: "",
      idMatrizNivel: idMatrizNivel,
      indicadorBaja: indicadorBaja,
      listaDetalleMatrizOportunidad: []

    };


    for (var j = 0; j < this.matrizOportunidadDetalle.length; j++) {

       matrizOportunidad.listaDetalleMatrizOportunidad.push(this.matrizOportunidadDetalle[j]);

    }

    for (var j = 0; j < this.matrizOportEliminado.length; j++) {

      matrizOportunidad.listaDetalleMatrizOportunidad.push(this.matrizOportEliminado[j]);

  }

    //console.log("EL JSON ACT " + JSON.stringify(matrizRiesgo));

    Swal.fire({
      title: '¿Está seguro de actualizar la Matriz de Oportunidades?',
      showCancelButton: true,
      confirmButtonText: `Actualizar`,
      cancelButtonText: `Cancelar`,
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Espere por favor',
          html: 'Estamos actualizando la Matriz de Oportunidades',
          allowOutsideClick: () => !Swal.isLoading(),
          allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();
        this.matrizRiesgoService.actualizarMatrizOportunidad(matrizOportunidad).subscribe(
          resp => {
            console.log(resp);
            if (resp.idMatrizRiesgo !== 0) {
              if (Swal.isLoading()) {
                Swal.close();
              }
              console.log("REG: MATRIZ " + JSON.stringify(resp));
              Swal.fire('¡Actualización exitosa!', "La Matriz de Oportunidades se actualizó con éxito", 'success');
              this.router.navigate(['/pages', 'main', 'transaccion', 'matrizOportunidad']);

            }else {
              if (Swal.isLoading()) {
                  Swal.close();
                  Swal.fire('Ocurrió un error', resp.mensaje, 'error');
              }
            }

          });
      }
    });


  }


  guardarRegistroEditado(matrizRiesgoTemp: MatrizRiesgo) {


    matrizRiesgoTemp.modified = true;
    console.log("LA MAT " + JSON.stringify(matrizRiesgoTemp));
    console.log("LA MAT1 " + JSON.stringify(this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo]));
    //      if (matrizRiesgoTemp.idMatrizRiesgo > 0) {
    delete this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo];
    //this.matrizRiesgoService.registrarEdicionRegistroMatrizRiesgo(matrizRiesgoTemp, {severity: 'success', summary: 'Success', detail: 'Product is updated'});
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registro actualizado' });
    //      } else {
    //        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Proceso inválido'});
    //     }
  }

  obtenerListaTipoMatriz() {

    this.matrizRiesgoService.obtenerListaTipoMatriz().subscribe(
      resp => {
        console.log('lista de Tipo MatrizR1 : ' + JSON.stringify(resp.listaParametros));
        this.listaTiposMatrizRiesgo = resp.listaParametros;
        this.formularioMatrizOportunidad.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[2].idParametro);
        this.formularioMatrizOportunidad.get('idTipoMatriz').setValue(this.idTipoMatrizNivel);
        //this.obtenerProcesosMatriz(MATRIZ_OPORTUNIDAD);
        //  this.formularioMatrizOportunidad.get('idMatrizNivel').disable();

      }
    );

  }

  obtenerListaEstadoParametros() {

    this.matrizRiesgoService.obtenerListaEstadoParametros().subscribe(
      resp => {

        //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
        this.listaTiposMatriz = resp.listaParametros;


      }
    );

  }

  obtenerListaEstados() {

    this.matrizRiesgoService.obtenerListaEstados().subscribe(
      resp => {
        //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
        this.listaEstados = resp.listaParametros;


      }
    );

  }

  cancelarEdicion(matrizRiesgoTemp: MatrizRiesgo, index: number) {


    console.log();
    this.matricesRiesgo[index] = this.matrizRiesgoTemp;
    //   delete this.products2[product.id];
  }

  borrarRegistro(matrizRiesgoTemp: MatrizOportunidadDetalle, index: number) {

    if (matrizRiesgoTemp.idDetalleMOportunidad > 0 ){

      matrizRiesgoTemp.inBaja = 0;

      this.matrizOportEliminado.push(matrizRiesgoTemp);

      this.matrizOportunidadDetalle.splice(index, 1);

      this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

    }else {
      this.matrizOportunidadDetalle.splice(index, 1);

      this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

    }


  }

  calculoSeveridadProbabilidad(indice, event): void {

    console.log("Cal Sev");
    const probabilidadRiesgo: number = event.target.value;
    const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherente;
    var calculo: number = probabilidadRiesgo * impactoRiesgo;
    if (calculo > 0) {

      this.matricesRiesgo[indice].nuPuntajeInherente = probabilidadRiesgo * impactoRiesgo;

    }

  }

  calculoSeveridadImpacto(indice, event): void {


    console.log("Cal Sev");
    const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuProbabilidadInherente;
    const impactoRiesgo: number = event.target.value;

    var calculo: number = probabilidadRiesgo * impactoRiesgo;
    if (calculo > 0) {

      this.matricesRiesgo[indice].nuPuntajeInherente = probabilidadRiesgo * impactoRiesgo;
      var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
      this.matricesRiesgo[indice].deSeveridadInherente = severidad;
    }


  }


  calculoSeveridadProbabilidadControl(indice, event): void {

    console.log("Cal Sev C");
    const probabilidadControl: number = event.target.value;
    const impactoControl: number = this.matricesRiesgo[indice].nuImpactoResidual;
    var calculo: number = probabilidadControl * impactoControl;
    if (calculo > 0) {

      this.matricesRiesgo[indice].nuPuntajeResidual = probabilidadControl * impactoControl;
      var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
      this.matricesRiesgo[indice].deSeveridadResidual = severidad;


    }

  }

  calculoSeveridadImpactoControl(indice, event): void {


    console.log("Cal Sev C");
    const probabilidadControl: number = this.matricesRiesgo[indice].nuProbabilidadResidual;
    const impactoControl: number = event.target.value;

    var calculo: number = probabilidadControl * impactoControl;
    if (calculo > 0) {

      this.matricesRiesgo[indice].nuPuntajeResidual = probabilidadControl * impactoControl;

    }


  }

  openDiagramRiesgoInherente() {


    this.probImpInherente[0]=this.matrizOportunidadDetalle[0].nuBeneficio;
    this.impInherente[0]=this.matrizOportunidadDetalle[0].nuViabilidad;
    let cartesianPoints:cartesianPoint[] = [];
    this.matrizOportunidadDetalle.forEach((matriz) => {

        let cartesianPoint:cartesianPoint=new Object();
        cartesianPoint.label = matriz.codOpor;
        cartesianPoint.x = matriz.nuBeneficio;
        cartesianPoint.y = matriz.nuViabilidad;
        cartesianPoints.push(cartesianPoint);
    });


    this.ref = this.dialogService.open(RiesgoInherenteComponent, {
        data: {
            x1: this.probImpInherente[0],
            x2: this.probImpInherente[1],
            y1: this.impInherente[0],
            y2: this.impInherente[1],
            cartesianPoints:cartesianPoints,
            label: 'Viabilidad',
            labelx: 'Beneficio',
            labely: 'Viabilidad'
        },
        header: 'Mapa de Calor de Oportunidades',
        //width: '67%',
        width: '50%',
        contentStyle: {"max-height": "700px", "max-width": "100%", "overflow": "auto"},
        baseZIndex: 10000
    });

    this.ref.onClose.subscribe((object: any) => {
        if (object) {
            this.messageService.add({severity: 'info', summary: 'Product Selected', detail: object});
        }
    });
}

openDiagramRiesgoResidual() {

    this.probImpResidual[0]=this.matricesRiesgo[0].nuProbabilidadResidual;
    this.ImpResidual[0]=this.matricesRiesgo[0].nuImpactoResidual;
    let cartesianPoints:cartesianPoint[] = [];
    this.matricesRiesgo.forEach((matriz) => {

        let cartesianPoint:cartesianPoint=new Object();
        cartesianPoint.label = matriz.codRiesgo;
        cartesianPoint.x = matriz.nuProbabilidadResidual;
        cartesianPoint.y = matriz.nuImpactoResidual;
        cartesianPoints.push(cartesianPoint);
    });



    this.ref = this.dialogService.open(RiesgoResidualComponent, {
        data: {
            x1: this.probImpResidual[0],
            x2: this.probImpResidual[1],
            y1: this.ImpResidual[0],
            y2: this.ImpResidual[1],
            cartesianPoints:cartesianPoints,
            label: 'Riesgo Residual',
            labelx: 'Beneficio',
            labely: 'Viabilidad'
        },
        header: 'Riesgo Residual',
        width: '700px',
        contentStyle: {"max-height": "700px", "max-width": "700px", "overflow": "auto"},
        baseZIndex: 10000
    });

    this.ref.onClose.subscribe((object: any) => {
        if (object) {
            this.messageService.add({severity: 'info', summary: 'Product Selected', detail: object});
        }
    });
}

  limit_number_prob_riesgo(limitfield, indice) {

    const valor: number = limitfield.target.value;
    console.log("LIMIT " + valor);
    if (valor > 4) {
      limitfield.target.value = 4;
      this.matricesRiesgo[indice].nuProbabilidadInherente = 4;

      const probabilidadRiesgo: number = 4;
      const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherente;
      var calculo: number = probabilidadRiesgo * impactoRiesgo;

      var calculo_limited: string = calculo.toFixed(2);
      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);
        this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;

      }


    }
    else {

      const probabilidadRiesgo: number = valor;
      const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherente;
      var calculo: number = probabilidadRiesgo * impactoRiesgo;
      var calculo_limited: string = calculo.toFixed(2);
      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);
        this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;

      }

    }




  }

  limit_number_impa_riesgo(limitfield, indice) {

    const valor: number = limitfield.target.value;
    console.log("LIMIT " + valor);
    if (valor > 4) {
      limitfield.target.value = 4;
      this.matricesRiesgo[indice].nuImpactoInherente = 4;

      const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuProbabilidadInherente;
      const impactoRiesgo: number = 4;

      var calculo: number = probabilidadRiesgo * impactoRiesgo;
      var calculo_limited: string = calculo.toFixed(2);

      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);

        this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
        var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
        this.matricesRiesgo[indice].deSeveridadInherente = severidad;
      }
    }
    else {


      const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuProbabilidadInherente;
      const impactoRiesgo: number = valor;

      var calculo: number = probabilidadRiesgo * impactoRiesgo;
      var calculo_limited: string = calculo.toFixed(2);

      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);

        this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
        var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
        this.matricesRiesgo[indice].deSeveridadInherente = severidad;
      }


    }



  }


  limit_number_prob_control(limitfield, indice) {

    const valor: number = limitfield.target.value;
    console.log("LIMIT " + valor);
    if (valor > 4) {

      limitfield.target.value = 4;
      this.matricesRiesgo[indice].nuProbabilidadResidual = 4;

      const probabilidadControl: number = 4;
      const impactoControl: number = this.matricesRiesgo[indice].nuImpactoResidual;

      var calculo: number = probabilidadControl * impactoControl;
      var calculo_limited: string = calculo.toFixed(2);

      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);

        this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
        var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
        this.matricesRiesgo[indice].deSeveridadResidual = severidad;
      }

    }
    else {

      const probabilidadControl: number = valor;
      const impactoControl: number = this.matricesRiesgo[indice].nuImpactoResidual;

      var calculo: number = probabilidadControl * impactoControl;
      var calculo_limited: string = calculo.toFixed(2);

      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);

        this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
        var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
        this.matricesRiesgo[indice].deSeveridadResidual = severidad;
      }

    }

  }

  limit_number_impa_control(limitfield, indice) {

    const valor: number = limitfield.target.value;
    console.log("LIMIT " + valor);
    if (valor > 4) {
      limitfield.target.value = 4;
      this.matricesRiesgo[indice].nuImpactoResidual = 4;

      const probabilidadControl: number = this.matricesRiesgo[indice].nuProbabilidadResidual;
      const impactoControl: number = 4;

      var calculo: number = probabilidadControl * impactoControl;
      var calculo_limited: string = calculo.toFixed(2);

      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);

        this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
        var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
        this.matricesRiesgo[indice].deSeveridadResidual = severidad;
      }
    }
    else {

      const probabilidadControl: number = this.matricesRiesgo[indice].nuProbabilidadResidual;
      const impactoControl: number = valor;

      var calculo: number = probabilidadControl * impactoControl;
      var calculo_limited: string = calculo.toFixed(2);

      if (calculo > 0) {
        var calculo_result: number = Number(calculo_limited);

        this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
        var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
        this.matricesRiesgo[indice].deSeveridadResidual = severidad;
      }
    }

  }

  getProbabilidad(probabilidad, impacto): number {

    var calculo: number = probabilidad * impacto;
    var calculo_limited: string = calculo.toFixed(2);
    var calculo_result: number = 0;

    if (calculo > 0) {
      calculo_result = Number(calculo_limited);

    }
    else {
      calculo_result = 0;

    }

    return calculo_result;

  }

  obtener_severidad(proba: number, impa: number): string {
    let severidad: string;

    if (proba < 2.5 && impa < 2.5){

      severidad = 'Bajo';

    }else if (proba >= 2.5 && impa < 2.5){

      if (proba >= 3.25 && impa >= 1.75){
          severidad = 'Moderado';
      }else{
          severidad = 'Bajo';
      }

    }else if (proba < 2.5 && impa >= 2.5) {

      if (proba >= 1.75 && impa >= 3.25){
          severidad = 'Moderado';
      }else{
          severidad = 'Bajo';
      }

    }else if (proba >= 2.5 && impa >= 2.5) {

      if (proba < 3.25 && impa < 3.25){
          severidad = 'Moderado';

      }else if (proba < 3.25 && impa >= 3.25) {
          severidad = 'Alto';

      }else if (proba >= 3.25 && impa < 3.25) {
          severidad = 'Alto';

      }else {
          severidad = 'Extremo';
      }

    }

    return severidad;
  }


  obtenerProceso() {


    const idSede = this.payload.data.datosSede.idSede;
    let idTipoMatriz = this.formularioMatrizOportunidad.get('idMatrizNivel').value;
    return this.matrizRiesgoService.obtenerProcesos(this.idEmpresa, idSede, idTipoMatriz).subscribe(
      resp => {
        this.listaProcesosGestion = resp.listaProceso;
        console.log("ID Poceso 1 " + JSON.stringify(this.listaProcesosGestion));
      });
  }

  obtenerEstrategiaPlanAccion() {
    return this.matrizRiesgoService.obtenerEstrategiaPlanAccion().subscribe(resp => {
      this.listEstrategiaPlan = resp.listaParametros;
      console.log(this.listEstrategiaPlan)
    });
  }


  obtenerIndicadorSeleccionSINO() {
    return this.matrizRiesgoService.obtenerIndicadorSeleccionSINO().subscribe(resp => {
      this.listobtenerIndicadorSeleccionSINO = resp.listaParametros;
      console.log(this.listobtenerIndicadorSeleccionSINO)
    });
  }
  obtenerEstadoPlanAccion() {
    return this.matrizRiesgoService.obtenerEstadoPlanAccion().subscribe(resp => {
      this.listobtenerobtenerEstadoPlanAccion = resp.listaParametros;
      console.log(this.listobtenerIndicadorSeleccionSINO)
    });
  }

  obtenerPlanAccionEficaz() {
    return this.matrizRiesgoService.obtenerPlanAccionEficaz().subscribe(resp => {
      this.listaobtenerPlanAccionEficaz = resp.listaParametros;
      console.log(this.listobtenerIndicadorSeleccionSINO)
    });
  }



  obtenerTipoBeneficio() {
    return this.matrizRiesgoService.obtenerTipoBeneficio().subscribe(resp => {
      this.listaTipoDeBeneficio = resp.listaParametros;

    });
  }



  Calculo_number_viabilidad_c(limitfield, indice) {

    const valor: number = limitfield.target.value;
    let nuViabilidad: number = 0;
    let nivelCosto: number = 0;
    let nivelComplejidad: number = 0;

    if (valor > 4) {
      limitfield.target.value = 4;
      this.matrizOportunidadDetalle[indice].nivelComplejidad = 4;

    }

    console.log("LIMIT " + valor);
    if (this.matrizOportunidadDetalle[indice].nivelComplejidad) {
      if (this.matrizOportunidadDetalle[indice].nivelCosto) {
        nivelComplejidad = this.matrizOportunidadDetalle[indice].nivelComplejidad;
        nivelCosto = this.matrizOportunidadDetalle[indice].nivelCosto;
        nuViabilidad = (5 - ((nivelComplejidad + nivelCosto) / 2));
        this.matrizOportunidadDetalle[indice].nuViabilidad = nuViabilidad;
        // Number(nuViabilidad).toFixed(2);
      }
    }

  }

  Calculo_number_viabilidad_costo(limitfield, indice) {

    const valor: number = limitfield.target.value;
    let nuViabilidad: number = 0;
    let nivelCosto: number = 0;
    let nivelComplejidad: number = 0;

    if (valor > 4) {
      limitfield.target.value = 4;
      this.matrizOportunidadDetalle[indice].nivelCosto = 4;

    }

    console.log("LIMIT " + valor);
    if (this.matrizOportunidadDetalle[indice].nivelComplejidad) {
      if (this.matrizOportunidadDetalle[indice].nivelCosto) {
        nivelComplejidad = this.matrizOportunidadDetalle[indice].nivelComplejidad;
        nivelCosto = this.matrizOportunidadDetalle[indice].nivelCosto;
        nuViabilidad = (5 - ((nivelComplejidad + nivelCosto) / 2));
        this.matrizOportunidadDetalle[indice].nuViabilidad = nuViabilidad;
        // Number(nuViabilidad).toFixed(2);
      }
    }

  }

  Calculo_number_NP_B_V(limitfield, indice) {

    const valor: number = limitfield.target.value;
    let NP: number = 0;
    let nuBeneficio: number = 0;
    let nuViabilidad: number = 0;

    if (valor > 4) {
      limitfield.target.value = 4;
      this.matrizOportunidadDetalle[indice].nuBeneficio = 4;

    }

    console.log("LIMIT " + valor);
    if (this.matrizOportunidadDetalle[indice].nuViabilidad) {
      if (this.matrizOportunidadDetalle[indice].nuBeneficio) {
        nuViabilidad = this.matrizOportunidadDetalle[indice].nuViabilidad;
        nuBeneficio = this.matrizOportunidadDetalle[indice].nuBeneficio;
        NP = (nuViabilidad * nuBeneficio);
        this.matrizOportunidadDetalle[indice].nuNivelPriori = NP;
        let severidad = this.obtener_severidad(nuViabilidad, nuBeneficio);
        this.matrizOportunidadDetalle[indice].deNivelPriori = severidad;
        // Number(nuViabilidad).toFixed(2);
      }
    }
  }

    exportExcel(): void {
      console.log("matrizOportunidadDetalle");
      console.log(this.matrizOportunidadDetalle);
        import('xlsx').then(xlsx => {
            var lista = [];
            if(this.idTipoMatrizSelect== TipoMatrizRiesgo.entidad){
                for (var detalle of this.matrizOportunidadDetalle){
                    var obj = new Object();
                    obj['Origen'] = detalle.deOrigen
                    obj['Grupos de Interés'] = detalle.deGrupoInteres;
                    obj['Gerencia Responsable'] = this.obtenerDescIdGerencia(detalle.idGerencia);
                    obj['Objetivos (Estratégico o Específico)'] = detalle.deObjetivo;
                    obj['Proceso / Sistema De Gestión'] = this.obtenerDescIdProcesoSistema(detalle.idProceso);
                    obj['Código'] = detalle.codOpor;
                    obj['Oportunidad'] = detalle.deOportunidad;
                    obj['Nivel de Complejidad'] = detalle.nivelComplejidad;
                    obj['Nivel de Costo'] = detalle.nivelCosto;
                    obj['Viabilidad (V)'] = detalle.nuViabilidad;
                    obj['Tipo de Beneficio'] = this.obtenerDescIdBeneficio( detalle.idTipoBeneficio);
                    obj['Beneficio (B)'] = detalle.nuBeneficio;
                    obj['NP = B x V'] = detalle.nuNivelPriori;
                    obj['Nivel de Priorización'] = detalle.deNivelPriori;
                    obj['Estrategia'] = this.obtenerDescIdEstrategia( detalle.idEstrategiaPlan);
                    obj['Código SAM / Iniciativa PMO / Otros'] = detalle.codSam;
                    obj['Código del plan de acción'] = detalle.codPlanAccion;
                    obj['Plan de acción'] = detalle.dePlanAccion;
                    obj['Responsable'] = detalle.idRespPlanAccion;
                    obj['Recursos Financiero (S/.)'] = this.obtenerDescIdSINO( detalle.recursoFina);
                    obj['Recursos Operacionales'] = this.obtenerDescIdSINO( detalle.recursoOper);
                    obj['Recursos Tecnológicos'] = this.obtenerDescIdSINO( detalle.recursoTecno);
                    obj['Recursos Humanos'] = this.obtenerDescIdSINO( detalle.recursoHuma);
                    obj['Requisitos de Negocio'] = this.obtenerDescIdSINO( detalle.reqNego);
                    obj['Fecha de Inicio'] = this.invertirFecha(detalle.feIniPlanAccion?.toString() ?? undefined);
                    obj['Fecha Fin'] = this.invertirFecha(detalle.feFinPlanAccion?.toString() ?? undefined);
                    obj['Entregable'] = detalle.deEntregable;
                    obj['Estado'] = this.obtenerDescIdEstado(detalle.idEstadoPlanAccion);
                    obj['Fecha Prevista'] = this.invertirFecha(detalle.fePrevista?.toString() ?? undefined);
                    obj['¿El plan de acción fue eficaz?'] = this.obtenerDescIdFueEficaz(detalle.inEficaz);
                    obj['Fecha de verificación'] = this.invertirFecha(detalle.feVerificacion?.toString() ?? undefined);
                    obj['Verificado por'] = detalle.idVerificador;
                    obj['Evidencia'] = detalle.deEvidencia;
                    obj['Comentario'] = detalle.deComentario;

                    lista.push(obj);
                }

                var worksheet = xlsx.utils.aoa_to_sheet([["IDENTIFICACIÓN","","","","","","",
                    "EVALUACIÓN","","","","","","",
                    "TRATAMIENTO","","","","","","","","","","","","","",
                    "VERIFICACIÓN DE LA EFICACIA","","","","",""]]);
                xlsx.utils.sheet_add_json(worksheet,lista,{origin:1,skipHeader: false});

                if(!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({s:{r:0,c:0},e:{r:0,c:6}},
                    {s:{r:0,c:7},e:{r:0,c:13}},
                    {s:{r:0,c:14},e:{r:0,c:27}},
                    {s:{r:0,c:28},e:{r:0,c:33}},);


                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
                this.saveAsExcelFile(excelBuffer, 'MatrizOportunidad');
            }
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    invertirFecha(fechaAinvertir: string){

      if(fechaAinvertir != undefined){
        var fecha = fechaAinvertir.split('-',3);
        var dia = fecha[2];
        var mes = fecha[1];
        var anio = fecha[0];
        return dia+"/"+mes+"/"+anio;
      }
    }

    obtenerDescIdGerencia(idGerencia:number){
        let descIdGerencia = "";
        for(let lista of this.listaGerencias){
            if(lista.idGerencia==idGerencia) descIdGerencia= lista.descripcionGerencia
        }
        return descIdGerencia;
    }

    obtenerDescIdProcesoSistema(idValorControl:number){
        let valor = "";
        for(let lista of this.listaProcesosSelected){
            if(lista.idProceso==idValorControl) valor= lista.deProceso
        }
        return valor;
    }

    obtenerDescIdBeneficio(idValorControl:number){
        let valor = "";
        for(let lista of this.listaTipoDeBeneficio){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEstrategia(idValorControl:number){
        let valor = "";
        for(let lista of this.listEstrategiaPlan){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdSINO(idValorControl:number){
        let valor = "";
        for(let lista of this.listobtenerIndicadorSeleccionSINO){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEstado(idValorControl:number){
        let valor = "";
        for(let lista of this.listobtenerobtenerEstadoPlanAccion){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdFueEficaz(idValorControl:Number){
        let valor = "";
        for(let lista of this.listaobtenerPlanAccionEficaz){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

  get periodoNoValido(): boolean {
    return this.formularioMatrizOportunidad.get('periodo').invalid && this.formularioMatrizOportunidad.get('periodo').touched;
}

obtenermetodoIP (){

  this.authLoginService.obtenerIp().subscribe(
      resp => {
          this.dataIp = resp.ip;
          console.log(resp);
      }
  );
}

}
