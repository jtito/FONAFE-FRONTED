import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatrizFraude} from '../../../../../shared/models/matrizFraude';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {MatrizFraudeService} from './matriz-fraude.service';
import {MessageService} from "primeng/api";
import {Empresa} from "../../../../../shared/models/empresa";
import {Sede} from "../../../../../shared/models/sede";
import {Periodo} from "../../../../../shared/models/periodo";
import {MATRIZ_FRAUDE} from "../../../../../shared/Constantes";
import {DataLogin} from 'src/app/shared/models/data';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {Gerencia} from "../../../../../shared/models/gerencia";
import {Proceso} from "../../../../../shared/models/proceso";
import {SubProceso} from "../../../../../shared/models/subproceso";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {RiesgoInherenteComponent} from "../matrizFraude/riesgo-inherente/riesgo-inherente.component";
import { RiesgoResidualComponent } from '../matrizFraude/riesgo-residual/riesgo-residual.component';
import { cartesianPoint } from 'src/app/shared/models/cartesianPoint';
import FileSaver from 'file-saver';
import {TipoMatrizRiesgo} from "../../../../../shared/models/tipoMatrizRiesgo";
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";

@Component({
    selector: 'app-conf-registrar-matriz-fraude',
    templateUrl: 'form-matriz-fraude.component.html',
    providers: [DialogService],
    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})

export class FormMatrizFraudeComponent implements OnInit {

    formularioMatrizRiesgo: FormGroup;
    matrizRiesgo: MatrizFraude;
    loading: boolean;
    listaEstados: Parametro[];
    listaEstadoPlanAccion: Parametro[];
    listaEficazPlanAccion: Parametro[];
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
    listaIndicador: Parametro[];
    listaEstrategiaRespuesta: Parametro[];

    listaTipos: Parametro[];
    editar: boolean;

    idEstado: string;
    idEmpresa: number;
    idCartera: number;
    idTipoMatriz: number;
    idTipoMatrizSelect: number=1;
    indicadorBaja: number = 1;

    cols: any[];
    fijoCols: any[];
    matricesRiesgo: MatrizFraude[];
    matrizRiesgoEditar: MatrizFraude;
    matrizRiesgoTemporal: { [s: string]: MatrizFraude; } = {};
    payload: DataLogin;

    /*lista detalle matriz*/
    listaGerencias: Gerencia[];
    listaProcesos: Proceso[];
    listaSubProcesos: SubProceso[];

    listaProcesosSelected: Proceso[];
    listaSubProcesosSelected: SubProceso[];


    SelectedCant = "";
    DisplayControl: boolean = false;
    matrizRiesgoTemp: MatrizFraude;
    idTipoMatrizNivel: number = 1;
    ri: number = 0; //indice
    ref: DynamicDialogRef;
    probImpInherente: number[] = [];
    impInherente: number[] = [];
    probImpResidual: number[] = [];
    ImpResidual: number[] = [];
    matrizFraudeEliminado: MatrizFraude[] = [];
    listaCantControl: Parametro[];

    idPerfil: number;
    idSede:number;
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    tipoPerfilUsuario: TipoPerfil = TipoPerfil.user;
    notadmin:boolean;
    ver:boolean=false;

    dataIp: string = "";

    constructor(private authLoginService: AuthLoginService, private formBuilder: FormBuilder, private router: Router,
                private matrizRiesgoService: MatrizFraudeService, private activatedRoute: ActivatedRoute,
                public dialogService: DialogService,
                private messageService: MessageService) {

        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
        this.idSede = this.payload.data.datosSede.idSede;
        this.obtenerListaEmpresas();
        this.obtenerListaCarteras();
        this.obtenerListaMatrizNivel();
        this.obtenerListaTipoMatriz();
        this.crearFormulario();
        this.obtenerListaEstadoParametros();
        this.obtenerListaEstados();
        this.obtenerListaEstadoPlanAccion();
        this.obtenerListaEficaciaPlanAccion();
        this.obtenerListaOrigenRiesgo();
        this.obtenerListaFrecuenciaRiesgo();
        this.obtenerListaTipoRiesgo();
        this.obtenerListaEstrategiaRespuesta();
        this.obtenerListaAreaResponsable();
        this.obtenerListaResponsableControl();
        this.obtenerListaFrecuenciaControl();
        this.obtenerListaOportunidadControl();
        this.obtenerListaAutomatizacionControl();
        this.obtenerListaIndicador();
        this.obtenerListaCantidadControl();
        this.solvePermissions();

        this.listaGerencias = [{idGerencia: 0, descripcionGerencia: 'Seleccione'}];
        this.listaProcesos = [{idProceso: 0, deProceso: 'Seleccione'}];
        this.obtenermetodoIP();

    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            if (params.idMatrizRiesgo) {
                this.loading = true;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.ver = false;
                this.formularioMatrizRiesgo.disable();
                //this.cargarListas();
            }else if(this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                //  this.formularioMatrizRiesgo.disable();
                  this.cargarListas();
                  this.ver = false;
                  this.editar = false;
                  this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
                  this.formularioMatrizRiesgo.get('sede').setValue(this.payload.data.datosSede.idSede);
                  this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);

            }else if(this.activatedRoute.snapshot.url[0].toString() === 'ver') {
                this.formularioMatrizRiesgo.disable();
                this.ver = true;
                this.editar = false;
            } else {
                this.formularioMatrizRiesgo.disable();
                this.editar = false;
                this.ver = false;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.cargarProcesos(this.idEmpresa,0);
            }


        });

        this.cargarMatrizRiesgo();

        this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
        this.formularioMatrizRiesgo.get('sede').setValue(this.payload.data.datosSede.idSede);
        this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);

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
                field: 'codMatriz',
                header: 'COD',
                class: 'text-center tdsmall',
                ordenadmiento: 'codMatriz',
                headerClass: 'text-center tdsmall',
                styleClass: 'width: 10%',
                colspan:"1",
                placeholder:''
            },
            {
                field: 'idMatrizNivel',
                header: 'Nivel',
                class: 'text-center tdlarge',
                ordenadmiento: 'idMatrizNivel',
                headerClass: 'text-center tdlarge',
                styleClass: 'width: 10%',
                colspan:"2",
                placeholder:''
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center tdxlarge',
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center tdxlarge',
                colspan:"4",
                placeholder:''
            },
            {
                field: 'idProceso',
                header: 'Nombre del proceso analizado',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'idProceso',
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },

            {
                field: 'codRiesgo',
                header: 'Código del Riesgo',
                class: 'text-center static-sticky-col tdlarge',
                ordenadmiento: 'codRiesgo',
                colspan:"2",
                headerClass: 'text-center static-sticky-col tdlarge'
            },
            {
                field: 'deRiesgo',
                header: 'Descripción del Riesgo',
                class: 'text-center static-sticky-col1 tdzlarge',
                ordenadmiento: 'deRiesgo',
                colspan:"3",
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                placeholder:'Descripción del Riesgo'
            },
            {
                field: 'riesgoAsociado',
                header: 'Riesgo operacional asociado',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'riesgoAsociado',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idOrigenRiesgo',
                header: 'Origen del Riesgo',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idOrigenRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'agenteFraude',
                header: 'Agente',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'agenteFraude',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idFrecuenciaRiesgo',
                header: 'Frecuencia del Riesgo',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idFrecuenciaRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idTipoRiesgo',
                header: 'Tipo de Riesgo',
                class: 'text-center tdzlarge',
                ordenadmiento: 'idTipoRiesgo',
                colspan:"3",
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'nuImpactoInherenteE',
                header: 'Impacto Económico (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteE',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteL',
                header: 'Impacto Legal (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteL',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteR',
                header: 'Impacto Reputacional (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteR',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteC',
                header: 'Impacto en la continuidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteC',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteG',
                header: 'Impacto General (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteG',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntajeInherente',
                header: 'Severidad',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntajeInherente',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'deSeveridadInherente',
                header: 'Severidad Inherente',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },
            {
                field: 'idAreaControl',
                header: 'Área a la que pertenece el responsable del control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idAreaControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idResponsableControl',
                header: 'Responsable del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idResponsableControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'limitaOportunidaControl',
                header: 'Limita la oportunidad de comisión del acto',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'limitaOportunidaControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'motivaActoControl',
                header: 'Identifica las motivaciones del acto',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'motivaActoControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'actitudPotencialControl',
                header: 'Fortalece la actitud frente a potenciales actos',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'actitudPotencialControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idFrecuenciaControl',
                header: 'Frecuencia del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idFrecuenciaControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idOportunidadControl',
                header: 'Oportunidad del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idOportunidadControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idAutomatizacionControl',
                header: 'Automatización del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idAutomatizacionControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'deEvidenciaControl',
                header: 'Evidencia del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deEvidenciaControl',
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },
            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'nuImpactoResidualE',
                header: 'Impacto Económico (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualE',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualL',
                header: 'Impacto Legal (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualL',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualR',
                header: 'Impacto Reputacional (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualR',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualC',
                header: 'Impacto en la continuidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualC',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualG',
                header: 'Impacto General (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualC',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntajeResidual',
                header: 'Severidad',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntajeResidual',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'deSeveridadResidual',
                header: 'Severidad Residual',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },

            //PLAN ACCON
            {
                field: 'idEstrategiaResp',
                header: 'Estrategia de Respuesta',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEstrategiaResp',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código del plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'desPlanAccion',
                header: 'Descripción del plan de acción',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'desPlanAccion',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'idResponsablePlanAccion',
                header: ' Responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idResponsablePlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaInicioPlanAccion',
                header: 'Inicio del Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaInicioPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'estadoPlanAccion',
                header: 'Estado Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'estadoPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaFinPlanAccion',
                header: 'Fin del plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaFinPlanAccion',
                headerClass: 'text-center tdlarge'
            },

//Verificacion eficacia
            {
                field: 'fechaPrevista',
                header: 'Fecha Prevista',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaPrevista',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'fueEficaz',
                header: '¿El plan de acción fue eficaz?',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fueEficaz',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaVerificacion',
                header: 'Fecha de verificación',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaVerificacion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'verificadoPor',
                header: 'Verificado Por',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'verificadoPor',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'evidenciaEficacia',
                header: 'Evidencia',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'evidenciaEficacia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'observaciones',
                header: 'Observaciones',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'observaciones',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'codkri',
                header: 'Código KRI',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codkri',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'defkri',
                header: 'Definición del KRI',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'defkri',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'frecuencia',
                header: 'Frecuencia',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'frecuencia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'metkri',
                header: 'Meta del KRI',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'metkri',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriActual',
                header: 'KRI Actual',
                class: 'text-center tdsmall',
                ordenadmiento: 'kriActual',
                colspan:"1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriResponsable',
                header: 'Responsable de Asegurar su cumplimiento',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'kriResponsable',
                headerClass: 'text-center tdlarge'
            },
        ];

        this.matricesRiesgo = [];

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
            this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
        }
    }


    exportExcel(): void {
        import('xlsx').then(xlsx => {
            var lista = [];

            if(this.idTipoMatrizSelect==TipoMatrizRiesgo.proceso){
                for(var j=0;j<this.matricesRiesgo.length;j++){

                    var obj = new Object();
                    obj['COD'] =this.matricesRiesgo[j]['codMatriz'];
                    obj['Nivel'] =this.obtenerDescIdMatrizNivel(this.matricesRiesgo[j]['idMatrizNivel']);
                    obj['Gerencia Responsable'] = this.obtenerDescIdGerencia(this.matricesRiesgo[j]['idGerencia']);
                    obj['Nombre del proceso analizado'] = this.obtenerDescIdProcesoAnalizado(this.matricesRiesgo[j]['idProceso']);
                    obj['Código del Riesgo'] =this.matricesRiesgo[j]['codRiesgo'];
                    obj['Descripción del Riesgo'] =this.matricesRiesgo[j]['deRiesgo'];
                    obj['Riesgo operacional asociado'] =this.matricesRiesgo[j]['riesgoAsociado'];
                    obj['Origen del Riesgo'] =this.obtenerDescIdOrigenRiesgo(this.matricesRiesgo[j]['idOrigenRiesgo']);
                    obj['Agente'] =this.matricesRiesgo[j]['agenteFraude'];
                    obj['Frecuencia de Riesgo'] =this.obtenerDescIdFrecuenciaRiesgo(this.matricesRiesgo[j]['idFrecuenciaRiesgo']);
                    obj['Tipo de Riesgo'] =this.obtenerDescIdTipoRiesgo(this.matricesRiesgo[j]['idTipoRiesgo']);
                    obj['Probabilidad (1-4)'] =this.matricesRiesgo[j]['nuProbabilidadInherente'];
                    obj['Impacto Económico (1-4)'] =this.matricesRiesgo[j]['nuImpactoInherenteE'];
                    obj['Impacto Legado (1-4)'] =this.matricesRiesgo[j]['nuImpactoInherenteL'];
                    obj['Impacto Reputacional (1-4)'] =this.matricesRiesgo[j]['nuImpactoInherenteR'];
                    obj['Impacto en la continuidad (1-4)'] =this.matricesRiesgo[j]['nuImpactoInherenteC'];
                    obj['Impacto general (1-4)'] =this.matricesRiesgo[j]['nuImpactoInherenteG'];
                    obj['Severidad'] =this.matricesRiesgo[j]['nuPuntajeInherente'];
                    obj['Severidad Inherente'] = this.matricesRiesgo[j]['deSeveridadInherente'];
                    obj['Código del control'] =this.matricesRiesgo[j]['codControl'];
                    obj['Descripción del control'] =this.matricesRiesgo[j]['deControl'];
                    obj['Área a la que pertenece el responsable del control'] =this.matricesRiesgo[j]['idAreaControl'];
                    obj['Responsable del control'] =this.matricesRiesgo[j]['idResponsableControl'];
                    obj['Limita la oportunidad de comisión del acto'] =this.obtenerDescIdOportunidadActo(this.matricesRiesgo[j]['limitaOportunidaControl']);
                    obj['Identifica las motivaciones del acto'] = this.obtenerDescIdMotivacionActo(this.matricesRiesgo[j]['motivaActoControl']);
                    obj['Fortalece la actitud frente a potenciales actos'] = this.obtenerDescFortalecePotencialActo(this.matricesRiesgo[j]['actitudPotencialControl']);
                    obj['Frecuencia del control'] = this.obtenerDescIdFrecuenciaControl(this.matricesRiesgo[j]['idFrecuenciaControl']);
                    obj['Oportunidad del control'] = this.obtenerDescIdOportunidadControl(this.matricesRiesgo[j]['idOportunidadControl']);
                    obj['Automatización del control'] = this.obtenerDescIdAutomatizacionControl(this.matricesRiesgo[j]['idAutomatizacionControl']);
                    obj['Evidencia del control'] =this.matricesRiesgo[j]['deEvidenciaControl'];
                    obj['Probabilidad (1-4) '] =this.matricesRiesgo[j]['nuProbabilidadResidual'];
                    obj['Impacto Económico (1-4) '] =this.matricesRiesgo[j]['nuImpactoResidualE'];
                    obj['Impacto Legal (1-4)'] =this.matricesRiesgo[j]['nuImpactoResidualL'];
                    obj['Impacto Reputacional (1-4) '] =this.matricesRiesgo[j]['nuImpactoResidualR'];
                    obj['Impacto en la continuidad (1-4) '] =this.matricesRiesgo[j]['nuImpactoResidualC'];
                    obj['Impacto general (1-4) '] =this.matricesRiesgo[j]['nuImpactoResidualG'];
                    obj['Severidad '] =this.matricesRiesgo[j]['nuPuntajeResidual'];
                    obj['Severidad residual'] = this.matricesRiesgo[j]['deSeveridadResidual'];//this.obtenerDescIdSeveridadResidual(this.matricesRiesgo[j]['deSeveridadResidual']);
                    obj['Estrategia de respuesta'] = this.obtenerDescIdEstrategiaRespuesta(this.matricesRiesgo[j]['idEstrategiaResp']);
                    obj['Codigo del plan de acción '] =this.matricesRiesgo[j]['codPlanAccion'];
                    obj['Descripción del plan de acción '] =this.matricesRiesgo[j]['desPlanAccion'];
                    obj['Responsable de realizar el plan de acción '] =this.matricesRiesgo[j]['idResponsablePlanAccion'];
                    obj['Inicio de Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['fechaInicioPlanAccion']);
                    obj['Estado Plan de Acción'] = this.obtenerDescIdEstadoPlan(this.matricesRiesgo[j]['estadoPlanAccion']);
                    obj['Fin Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['fechaFinPlanAccion']);
                    obj['Fecha Prevista'] = this.invertirFecha(this.matricesRiesgo[j]['fechaPrevista']);
                    obj['¿El plan de acción fue eficaz?'] =this.obtenerDescIdAccionEficaz(this.matricesRiesgo[j]['fueEficaz']);
                    obj['Fecha de verificación'] = this.invertirFecha(this.matricesRiesgo[j]['fechaVerificacion']);
                    obj['Verificado por'] =this.matricesRiesgo[j]['verificadoPor'];
                    obj['Evidencia'] =this.matricesRiesgo[j]['evidenciaEficacia'];
                    obj['Observaciones'] =this.matricesRiesgo[j]['observaciones'];
                    obj['Código KRI'] =this.matricesRiesgo[j]['codkri'];
                    obj['Definición del KRI'] =this.matricesRiesgo[j]['defkri'];
                    obj['Frecuencia'] =this.obtenerDescIdFrecuencia(this.matricesRiesgo[j]['frecuencia']);
                    obj['Meta del KRI'] =this.matricesRiesgo[j]['metkri'];
                    obj['KRI Actual'] =this.matricesRiesgo[j]['kriActual'];
                    obj['Responsable de asegurar su cumplimiento'] = this.matricesRiesgo[j]['kriResponsable'];//this.obtenerDescIdResponsableAsegurarCumplimiento(this.matricesRiesgo[j]['kriResponsable']);


                    lista.push(obj);

                }

                var worksheet = xlsx.utils.aoa_to_sheet([["DATOS GENERALES DEL RIESGO","","","","","","","","","","",
                    "EVALUACIÓN DE RIEGO INHERENTE","","","","","","","",
                    "CONTROL","","","","","","","","","","",
                    "EVALUACIÓN DE RIESGO RESIDUAL","","","","","","","",
                    "PLAN DE ACCIÓN","","","","","","",
                    "VERIFICACIÓN DE EFICACIA","","","","","",
                    "INDICADORES","","","","",""]]);
                xlsx.utils.sheet_add_json(worksheet,lista,{origin:1,skipHeader: false});

                if(!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({s:{r:0,c:0},e:{r:0,c:10}},
                    {s:{r:0,c:11},e:{r:0,c:18}},
                    {s:{r:0,c:19},e:{r:0,c:29}},
                    {s:{r:0,c:30},e:{r:0,c:37}},
                    {s:{r:0,c:38},e:{r:0,c:44}},
                    {s:{r:0,c:45},e:{r:0,c:50}},
                    {s:{r:0,c:51},e:{r:0,c:56}},);


                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
                this.saveAsExcelFile(excelBuffer, 'MatrizFraude');
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

    obtenerDescIdMatrizNivel(idMatrizNivel:number){
        let descIdMatrizNivel = "";
        for(var j=0;j<this.listaTiposMatriz.length;j++){
            if(this.listaTiposMatriz[j]['nombreParametro']==idMatrizNivel){
                descIdMatrizNivel = this.listaTiposMatriz[j]['deValor1'];
            }
        }
        return descIdMatrizNivel;
    }

    obtenerDescIdGerencia(idGerencia:number){
        let descIdGerencia = "";
        for(let lista of this.listaGerencias){
            if(lista.idGerencia==idGerencia) descIdGerencia= lista.descripcionGerencia
        }
        return descIdGerencia;
    }

    obtenerDescIdProcesoAnalizado(idProcAnalizado:number){
        let descProcAnalizado="";
        for(let lista of this.matricesRiesgo){
            for(let Proceso of lista.listaProcesos){
                if(Proceso.idProceso == idProcAnalizado) descProcAnalizado=Proceso.deProceso;
            }
        }
        return descProcAnalizado;
    }

    obtenerDescIdOrigenRiesgo(idOrigenRiesgo:number){
        let descIdOrigenRiesgo = "";
        for (let fila of this.listaOrigenRiesgo){
            if(fila.idParametro==idOrigenRiesgo) descIdOrigenRiesgo = fila.nombreParametro;
        }
        return descIdOrigenRiesgo;
    }

    obtenerDescIdFrecuenciaRiesgo(idFrecuenciaRiesgo : number){
        let descIdFrecuenciaRiesgo = "";
        for(let fila of this.listaFrecuenciaRiesgo){
            if(fila.idParametro==idFrecuenciaRiesgo) descIdFrecuenciaRiesgo= fila.nombreParametro
        }
        return descIdFrecuenciaRiesgo;
    }

    obtenerDescIdTipoRiesgo(idTipoRiesgo : number){
        let descIdTipoRiesgo = "";
        for(let fila of this.listaTipoRiesgo){
            if(fila.idParametro==idTipoRiesgo) descIdTipoRiesgo= fila.nombreParametro
        }
        return descIdTipoRiesgo;
    }

    obtenerDescIdOportunidadActo(idOportunidad : number){
        let valor = "";
        if (idOportunidad != undefined){
            for(let fila of this.listaIndicador){
                if(fila.deValor1==idOportunidad.toString()) valor= fila.nombreParametro
            }
        }
        return valor;
    }

    obtenerDescIdMotivacionActo(idMotivacion : number){
        let valor = "";
        if (idMotivacion != undefined){
            for(let fila of this.listaIndicador){
                if(fila.deValor1==idMotivacion.toString()) valor= fila.nombreParametro
            }
        }
        return valor;
    }

    obtenerDescFortalecePotencialActo(idFortalece : number){
        let valor = "";
        if (idFortalece != undefined){
            for(let fila of this.listaIndicador){
                if(fila.deValor1==idFortalece.toString()) valor= fila.nombreParametro
            }
        }
        return valor;
    }

    obtenerDescIdFrecuenciaControl(idFrecuecia : number){
        let valor = "";
        for(let fila of this.listaFrecuenciaControl){
            if(fila.idParametro==idFrecuecia) valor= fila.nombreParametro
        }
        return valor;
    }

    obtenerDescIdOportunidadControl(idOportunidad : number){
        let valor = "";
        for(let fila of this.listaOportunidadControl){
            if(fila.idParametro==idOportunidad) valor= fila.nombreParametro
        }
        return valor;
    }

    obtenerDescIdAutomatizacionControl(idAutomatizacion : number){
        let valor = "";
        for(let fila of this.listaAutomatizacionControl){
            if(fila.idParametro==idAutomatizacion) valor= fila.nombreParametro
        }
        return valor;
    }

    obtenerDescIdSeveridadResidual(idSeveridadResidual : number){
        let valor = "";
        for(let fila of this.listaAutomatizacionControl){
            if(fila.idParametro==idSeveridadResidual) valor= fila.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEstrategiaRespuesta(idEstrategia : number){
        let valor = "";
        for(let fila of this.listaEstrategiaRespuesta){
            if(fila.idParametro==idEstrategia) valor= fila.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEstadoPlan(idEstadoPlan : number){
        let valor = "";
        for(let fila of this.listaEstadoPlanAccion){
            if(fila.idParametro==idEstadoPlan) valor= fila.nombreParametro
        }
        return valor;
    }


    obtenerDescIdAccionEficaz(idFueEficaz : string){
        let descIdEstadoPlanAccion = "";
        for(let fila of this.listaEficazPlanAccion){
            if(fila.deValor1== idFueEficaz) descIdEstadoPlanAccion= fila.nombreParametro;
        }
        return descIdEstadoPlanAccion;
    }

    obtenerDescIdFrecuencia(idFrecuencia : string){
        let valor = "";
        if (idFrecuencia != undefined){
            for(let fila of this.listaFrecuenciaControl){
                if(fila.idParametro.toString() == idFrecuencia) valor= fila.nombreParametro;
            }
        }
        return valor;
    }

    obtenerDescIdResponsableAsegurarCumplimiento(idResponsableAsegurarCumplimiento : string){
        let descIdEstadoPlanAccion = "";
        for(let fila of this.listaAreaResponsable){
            if(fila.idParametro==Number(idResponsableAsegurarCumplimiento)) descIdEstadoPlanAccion= fila.nombreParametro
        }
        return descIdEstadoPlanAccion;
    }

    openDiagramRiesgoInherente() {
        this.probImpInherente[0]=this.matricesRiesgo[0].nuProbabilidadInherente;
        this.impInherente[0]=this.matricesRiesgo[0].nuImpactoInherenteG;
        let cartesianPoints:cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint:cartesianPoint=new Object();
            cartesianPoint.label = matriz.codRiesgo;
            cartesianPoint.x = matriz.nuProbabilidadInherente;
            cartesianPoint.y = matriz.nuImpactoInherenteG;
            cartesianPoints.push(cartesianPoint);
        });



        this.ref = this.dialogService.open(RiesgoInherenteComponent, {
            data: {
                x1: this.probImpInherente[0],
                x2: this.probImpInherente[1],
                y1: this.impInherente[0],
                y2: this.impInherente[1],
                cartesianPoints:cartesianPoints,
                label: 'Riesgo Inherente',
                labelx: 'Probabilidad',
                labely: 'Impacto'
            },
            header: 'Riesgo Inherente',
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
        this.ImpResidual[0]=this.matricesRiesgo[0].nuImpactoResidualG;
        let cartesianPoints:cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint:cartesianPoint=new Object();
            cartesianPoint.label = matriz.codRiesgo;
            cartesianPoint.x = matriz.nuProbabilidadResidual;
            cartesianPoint.y = matriz.nuImpactoResidualG;
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
                labelx: 'Probabilidad',
                labely: 'Impacto'
            },
            header: 'Riesgo Residual',
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

    cargarMatrizRiesgo(): void {
        this.activatedRoute.params.subscribe(params => {
            const idMatrizRiesgo = params.idMatrizRiesgo;
            const idUsuario = this.payload.data.idUsuario;
            if (idMatrizRiesgo) {
                this.matrizRiesgoService.obtenerMatrizRiesgo(idMatrizRiesgo, idUsuario).subscribe(
                    resp => {
                        // console.log("MATRIZ RIESGO FRAUDE");
                        // console.log(resp);
                        this.matrizRiesgo = resp.MatrizFraude;
                        this.obtenerEmpresa(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
                        //  this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
                        this.formularioMatrizRiesgo.get('periodo').setValue(this.matrizRiesgo.idPeriodo);
                        this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.matrizRiesgo.idTipoMatriz);
                        this.formularioMatrizRiesgo.get('idTipoMatriz').setValue(this.matrizRiesgo.idMatrizNivel);
                        this.formularioMatrizRiesgo.get('idEstado').setValue(this.matrizRiesgo.indicadorBaja);
                        //this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.matrizRiesgo.matrizNivel);
                        //this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.matrizRiesgo.idMatrizNivel);
                        this.formularioMatrizRiesgo.get('periodo').disable();
                        this.formularioMatrizRiesgo.get('idTipoMatriz').disable();
                        this.formularioMatrizRiesgo.get('idMatrizNivel').disable();
                        this.idEmpresa = this.matrizRiesgo.idEmpresa;
                        this.idTipoMatriz = this.matrizRiesgo.idTipoMatriz;
                        this.idTipoMatrizSelect = this.matrizRiesgo.idMatrizNivel;

                        for (var j = 0; j < this.matrizRiesgo.listaDetalleMatriz.length; j++) {

                            var orden = this.matricesRiesgo.length;
                            this.matrizRiesgo.listaDetalleMatriz[j].ordenTabla = orden;
                            var impactoinherenteg = (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoInherenteL * 0.25) +
                                (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoInherenteR * 0.25) +
                                (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoInherenteE * 0.25) +
                                (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoInherenteC * 0.25);
                            if (impactoinherenteg > 0) {
                                this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoInherenteG = impactoinherenteg;

                            }

                            var impactoresidualg = (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoResidualL * 0.25) +
                                (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoResidualR * 0.25) +
                                (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoResidualE * 0.25) +
                                (this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoResidualC * 0.25);
                            if (impactoresidualg > 0) {
                                this.matrizRiesgo.listaDetalleMatriz[j].nuImpactoResidualG = impactoresidualg;

                            }


                            this.matricesRiesgo.push(this.matrizRiesgo.listaDetalleMatriz[j]);

                        }

                        // this.obtenerListaMatriz();

                        if (this.matrizRiesgo.idMatrizNivel == 0) {

                            this.showColumnasEntidad();
                        } else {
                            this.showColumnasProcesos();
                        }

                        this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
                        this.formularioMatrizRiesgo.get('cartera').setValue(this.matrizRiesgo.idCartera);
                        this.idEmpresa= this.matrizRiesgo.idEmpresa;
                        this.idSede = this.matrizRiesgo.idSede;
                        this.obtenerListaSedes();
                        this.obtenerListaPeriodos();
                        this.obtenerListaGerencia();

                        this.cargarProcesos(this.matrizRiesgo.idEmpresa, 0);
                        this.loading = false;

                    }
                );
            }
        });


    }

    private crearFormulario(): void {
        console.log('Se construyo el form');
        this.formularioMatrizRiesgo = this.formBuilder.group({
            empresa: ['', Validators.required],
            sede: ['', Validators.required],
            cartera: ['', Validators.required],
            periodo: ['', Validators.required],
            idTipoMatriz: ['', Validators.required],
            idMatrizRiesgo: [''],
            idMatrizNivel: [41, Validators.required],
            descripcionGerencia: [''],
            idEstado: '0'
        });

        this.formularioMatrizRiesgo.get('idMatrizNivel').disable();
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

    obtenerListaIndicador() {
        return this.matrizRiesgoService.obtenerListaIndicador().subscribe(resp => {
            this.listaIndicador = resp.listaParametros;
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
        this.formularioMatrizRiesgo.get('cartera').setValue(this.idCartera)
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

            }

        }

        if (tipomatriz == "Entidad") {

            this.showColumnasEntidad();
        } else {

            this.showColumnasProcesos();
        }

    }

    showColumnasEntidad(): void {

        this.cols = [
            {
                field: 'idMatrizRiesgo',
                header: 'COD',
                class: 'text-center',
                ordenadmiento: 'idMatrizRiesgo',
                headerClass: 'text-center',
                styleClass: 'width: 10%',
                placeholder: ''
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center',
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo',
                class: 'text-center static-sticky-col',
                ordenadmiento: 'codRiesgo',
                headerClass: 'text-center static-sticky-col'
            },
            {
                field: 'deRiesgo',
                header: 'Descripción del Riesgo',
                class: 'text-center static-sticky-col1',
                ordenadmiento: 'deRiesgo',
                headerClass: 'text-center static-sticky-col1',
                placeholder: 'Descripción del Riesgo'
            },
            {
                field: 'procesosImpactados',
                header: 'Procesos Impactados',
                class: 'text-center',
                ordenadmiento: 'procesosImpactados',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'deFoda',
                header: 'FODA',
                class: 'text-center',
                ordenadmiento: 'deFoda',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'deGrupoInteres',
                header: 'Grupo de Interes',
                class: 'text-center',
                ordenadmiento: 'deGrupoInteres',
                headerClass: 'text-center',
                placeholder: ''
            },


            {
                field: 'idOrigenRiesgo',
                header: 'Origen del Riesgo',
                class: 'text-center',
                ordenadmiento: 'idOrigenRiesgo',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idFrecuenciaRiesgo',
                header: 'Frecuencia del Riesgo',
                class: 'text-center',
                ordenadmiento: 'idFrecuenciaRiesgo',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idTipoRiesgo',
                header: 'Tipo de Riesgo',
                class: 'text-center',
                ordenadmiento: 'idTipoRiesgo',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'nuImpactoInherenteE',
                header: 'Impacto Económico(1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoInherenteE',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoInherenteL',
                header: 'Impacto Legal(1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoInherenteL',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoInherenteR',
                header: 'Impacto Reputacional (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoInherenteR',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoInherenteC',
                header: 'Impacto en la continuidad (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoInherenteC',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoInherenteG',
                header: 'Impacto General (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoInherenteG',
                headerClass: 'text-center'
            },
            {
                field: 'nuPuntajeInherente',
                header: 'Severidad',
                class: 'text-center',
                ordenadmiento: 'nuPuntajeInherente',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'deSeveridadInherente',
                header: 'Severidad Inherente',
                class: 'text-center',
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center',
                placeholder: ''
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center',
                ordenadmiento: 'codControl',
                headerClass: 'text-center'
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center',
                ordenadmiento: 'deControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idAreaControl',
                header: 'Área del responsable del rol',
                class: 'text-center',
                ordenadmiento: 'idAreaControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idResponsableControl',
                header: 'Responsable del Control',
                class: 'text-center',
                ordenadmiento: 'idResponsableControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idFrecuenciaControl',
                header: 'Frecuencia del Control',
                class: 'text-center',
                ordenadmiento: 'idFrecuenciaControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idOportunidadControl',
                header: 'Oportunidad del Control',
                class: 'text-center',
                ordenadmiento: 'idOportunidadControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'idAutomatizacionControl',
                header: 'Automatización del Control',
                class: 'text-center',
                ordenadmiento: 'idAutomatizacionControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'deEvidenciaControl',
                header: 'Evidencia del Control',
                class: 'text-center',
                ordenadmiento: 'deEvidenciaControl',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'nuImpactoResidualE',
                header: 'Impacto Económico(1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoResidualE',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoResidualL',
                header: 'Impacto Legal(1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoResidualL',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoResidualR',
                header: 'Impacto Reputacional (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoResidualR',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoResidualC',
                header: 'Impacto en la continuidad (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoResidualC',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoResidualG',
                header: 'Impacto General (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoResidualC',
                headerClass: 'text-center'
            },
            {
                field: 'nuPuntajeResidual',
                header: 'Severidad',
                class: 'text-center',
                ordenadmiento: 'nuPuntajeResidual',
                headerClass: 'text-center',
                placeholder: ''
            },
            {
                field: 'deSeveridadResidual',
                header: 'Severidad Residual',
                class: 'text-center',
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center',
                placeholder: ''
            },

            //PLAN ACCON
            {
                field: 'idEstrategiaResp',
                header: 'Estrategia de Respuesta',
                class: 'text-center',
                ordenadmiento: 'idEstrategiaResp',
                headerClass: 'text-center'
            },
            {
                field: 'codPlanAccion',
                header: 'Cod. Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'codPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'desPlanAccion',
                header: 'Descripcion Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'desPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'idResponsablePlanAccion',
                header: 'Resp. Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'idResponsablePlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'fechaInicioPlanAccion',
                header: 'Fecha Inicio Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'fechaInicioPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'estadoPlanAccion',
                header: 'Estado Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'estadoPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'fechaFinPlanAccion',
                header: 'Fecha Fin Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'fechaFinPlanAccion',
                headerClass: 'text-center'
            },

//Verificacion eficacia
            {
                field: 'fechaPrevista',
                header: 'Fecha Prevista',
                class: 'text-center',
                ordenadmiento: 'fechaPrevista',
                headerClass: 'text-center'
            },

            {
                field: 'fueEficaz',
                header: '¿El plan de acción fue eficaz?',
                class: 'text-center',
                ordenadmiento: 'fueEficaz',
                headerClass: 'text-center'
            },
            {
                field: 'fechaVerificacion',
                header: 'Fecha Verificacion',
                class: 'text-center',
                ordenadmiento: 'fechaVerificacion',
                headerClass: 'text-center'
            },
            {
                field: 'verificadoPor',
                header: 'Verificado Por',
                class: 'text-center',
                ordenadmiento: 'verificadoPor',
                headerClass: 'text-center'
            },
            {
                field: 'evidenciaEficacia',
                header: 'Evidencia Eficacia',
                class: 'text-center',
                ordenadmiento: 'evidenciaEficacia',
                headerClass: 'text-center'
            },
            {
                field: 'observaciones',
                header: 'Observaciones',
                class: 'text-center',
                ordenadmiento: 'observaciones',
                headerClass: 'text-center'
            },
            {
                field: 'codkri',
                header: 'Codigo KRI',
                class: 'text-center',
                ordenadmiento: 'codkri',
                headerClass: 'text-center'
            },

            {
                field: 'defkri',
                header: 'Def KRI',
                class: 'text-center',
                ordenadmiento: 'defkri',
                headerClass: 'text-center'
            },
            {
                field: 'frecuencia',
                header: 'Frecuencia',
                class: 'text-center',
                ordenadmiento: 'frecuencia',
                headerClass: 'text-center'
            },
            {
                field: 'metkri',
                header: 'Met KRI',
                class: 'text-center',
                ordenadmiento: 'metkri',
                headerClass: 'text-center'
            },
            {
                field: 'kriActual',
                header: 'KRI Actual',
                class: 'text-center',
                ordenadmiento: 'kriActual',
                headerClass: 'text-center'
            },
            {
                field: 'kriResponsable',
                header: 'Reponsable de Asegurar cumplimiento',
                class: 'text-center',
                ordenadmiento: 'kriResponsable',
                headerClass: 'text-center'
            },
        ];
    }

    showColumnasProcesos(): void {

        this.cols = [
            {
                field: 'codMatriz',
                header: 'COD',
                class: 'text-center tdsmall',
                ordenadmiento: 'codMatriz',
                headerClass: 'text-center tdsmall',
                styleClass: 'width: 10%',
                colspan:"1",
                placeholder:''
            },
            {
                field: 'idMatrizNivel',
                header: 'Nivel',
                class: 'text-center tdlarge',
                ordenadmiento: 'idMatrizNivel',
                headerClass: 'text-center tdlarge',
                styleClass: 'width: 10%',
                colspan:"2",
                placeholder:''
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center tdxlarge',
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center tdxlarge',
                colspan:"4",
                placeholder:''
            },
            {
                field: 'idProceso',
                header: 'Nombre del proceso analizado',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'idProceso',
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },

            {
                field: 'codRiesgo',
                header: 'Código del Riesgo',
                class: 'text-center static-sticky-col tdlarge',
                ordenadmiento: 'codRiesgo',
                colspan:"2",
                headerClass: 'text-center static-sticky-col tdlarge'
            },
            {
                field: 'deRiesgo',
                header: 'Descripción del Riesgo',
                class: 'text-center static-sticky-col1 tdzlarge',
                ordenadmiento: 'deRiesgo',
                colspan:"3",
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                placeholder:'Descripción del Riesgo'
            },
            {
                field: 'riesgoAsociado',
                header: 'Riesgo operacional asociado',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'riesgoAsociado',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idOrigenRiesgo',
                header: 'Origen del Riesgo',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idOrigenRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'agenteFraude',
                header: 'Agente',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'agenteFraude',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idFrecuenciaRiesgo',
                header: 'Frecuencia del Riesgo',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idFrecuenciaRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idTipoRiesgo',
                header: 'Tipo de Riesgo',
                class: 'text-center tdzlarge',
                ordenadmiento: 'idTipoRiesgo',
                colspan:"3",
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'nuImpactoInherenteE',
                header: 'Impacto Económico (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteE',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteL',
                header: 'Impacto Legal (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteL',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteR',
                header: 'Impacto Reputacional (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteR',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteC',
                header: 'Impacto en la continuidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteC',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherenteG',
                header: 'Impacto General (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherenteG',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntajeInherente',
                header: 'Severidad',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntajeInherente',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'deSeveridadInherente',
                header: 'Severidad Inherente',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },
            {
                field: 'idAreaControl',
                header: 'Área a la que pertenece el responsable del control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idAreaControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idResponsableControl',
                header: 'Responsable del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idResponsableControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'limitaOportunidaControl',
                header: 'Limita la oportunidad de comisión del acto',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'limitaOportunidaControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'motivaActoControl',
                header: 'Identifica las motivaciones del acto',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'motivaActoControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'actitudPotencialControl',
                header: 'Fortalece la actitud frente a potenciales actos',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'actitudPotencialControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idFrecuenciaControl',
                header: 'Frecuencia del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idFrecuenciaControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idOportunidadControl',
                header: 'Oportunidad del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idOportunidadControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'idAutomatizacionControl',
                header: 'Automatización del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idAutomatizacionControl',
                headerClass: 'text-center tdlarge',
                placeholder:''
            },
            {
                field: 'deEvidenciaControl',
                header: 'Evidencia del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deEvidenciaControl',
                headerClass: 'text-center tdzlarge',
                placeholder:''
            },
            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'nuImpactoResidualE',
                header: 'Impacto Económico (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualE',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualL',
                header: 'Impacto Legal (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualL',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualR',
                header: 'Impacto Reputacional (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualR',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualC',
                header: 'Impacto en la continuidad (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualC',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidualG',
                header: 'Impacto General (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoResidualC',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntajeResidual',
                header: 'Severidad',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntajeResidual',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },
            {
                field: 'deSeveridadResidual',
                header: 'Severidad Residual',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center tdsmall',
                placeholder:''
            },

            //PLAN ACCON
            {
                field: 'idEstrategiaResp',
                header: 'Estrategia de Respuesta',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEstrategiaResp',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código del plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'desPlanAccion',
                header: 'Descripción del plan de acción',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'desPlanAccion',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'idResponsablePlanAccion',
                header: ' Responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idResponsablePlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaInicioPlanAccion',
                header: 'Inicio del Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaInicioPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'estadoPlanAccion',
                header: 'Estado Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'estadoPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaFinPlanAccion',
                header: 'Fin del plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaFinPlanAccion',
                headerClass: 'text-center tdlarge'
            },

//Verificacion eficacia
            {
                field: 'fechaPrevista',
                header: 'Fecha Prevista',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaPrevista',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'fueEficaz',
                header: '¿El plan de acción fue eficaz?',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fueEficaz',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaVerificacion',
                header: 'Fecha de verificación',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'fechaVerificacion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'verificadoPor',
                header: 'Verificado Por',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'verificadoPor',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'evidenciaEficacia',
                header: 'Evidencia',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'evidenciaEficacia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'observaciones',
                header: 'Observaciones',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'observaciones',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'codkri',
                header: 'Código KRI',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codkri',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'defkri',
                header: 'Definición del KRI',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'defkri',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'frecuencia',
                header: 'Frecuencia',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'frecuencia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'metkri',
                header: 'Meta del KRI',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'metkri',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriActual',
                header: 'KRI Actual',
                class: 'text-center tdsmall',
                ordenadmiento: 'kriActual',
                colspan:"1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriResponsable',
                header: 'Responsable de Asegurar su cumplimiento',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'kriResponsable',
                headerClass: 'text-center tdlarge'
            },
        ];
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
            });
    }

    onChangeSubProceso(event) {

        const idsubproceso = event.target.value;


    }

    onChangeMatrizNivel(input) {

        const idTipoMatriz = input.target.value;
        const idSede = this.payload.data.datosSede.idSede;
        const idEmpresa = this.idEmpresa;

        // console.log("EL TIPO MATRIZ "+"EMP "+idEmpresa+" SEDE "+idSede+" TIPOMA "+idTipoMatriz);
        // return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, idSede,1, idTipoMatriz).subscribe(
        //     resp => {
        //         this.listaProcesosSelected = resp.listaProceso;
        //         //  console.log("Gerencia1 "+JSON.stringify(resp));

        //         //    this.listaGerencias =resp.listaGerencias;
        //         console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
        //     });

    }

    // obtenerProcesosMatriz(idTipoMatriz){


    //     const idSede = this.payload.data.datosSede.idSede;
    //     const idEmpresa = this.idEmpresa;

    //     return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, idSede, 1, idTipoMatriz).subscribe(
    //         resp => {
    //             this.listaProcesosSelected = resp.listaProceso;
    //             //  console.log("Gerencia1 "+JSON.stringify(resp));

    //             //    this.listaGerencias =resp.listaGerencias;
    //             console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
    //         });

    // }

    cargarProcesos(idEmpresa, idProceso) {

        // const idEmpresa = this.idEmpresa;
        const idSede = this.payload.data.datosSede.idSede;

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_FRAUDE).subscribe(
            resp => {
                // @ts-ignore
                this.listaProcesosSelected = resp.listaProceso.filter(proceso =>
                    proceso.indicadorBaja == this.indicadorBaja
                );

                for (var j = 0; j < this.matricesRiesgo.length; j++) {
                    this.matricesRiesgo[j].listaProcesos = this.listaProcesosSelected;
                }
                // this.cargarSubProcesos(idProceso);
            });

    }

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
                this.matricesRiesgo.map(value => {
                    this.probImpInherente.push(value.nuProbabilidadInherente);
                    this.impInherente.push(value.nuImpactoInherenteG);
                    this.probImpResidual.push(value.nuProbabilidadResidual);
                    this.ImpResidual.push(value.nuImpactoResidualG);
                })
            });


    }


    agregarMatrizRiesgo(): void {

        if (this.formularioMatrizRiesgo.invalid) {
            return Object.values(this.formularioMatrizRiesgo.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const idControl = this.matricesRiesgo.length;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.getIdMatrizNextVal();
        console.log("AGREGANDO MATRIZ " + idMatrizRiesgo);
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        this.formularioMatrizRiesgo.disable();

        var matrizRiesgo: MatrizFraude = {
            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
            idEmpresa: idEmpresa,
            idCartera: idCartera,
            idSede: idSede,
            idPeriodo: idPeriodo,
            idTipoMatriz: idTipoMatriz,
            idCodigoControl: idControl,
            listaProcesos: [],
            listaSubProcesos: [],
            idGerencia: 0,
            usuarioCreacion: usuarioCreacion,
            ipCreacion: ipCreacion,
            deCartera: "",
            idMatrizNivel: idMatrizNivel,
            listaDetalleMatriz: [],
            codRiesgo: "",
            codControl: "",
            codPlanAccion: ""


        };

        var control: MatrizFraude = new MatrizFraude();
        control.ordenTabla = 0;
        control.idMatrizRiesgo = idMatrizRiesgo;

        control.idPeriodo = matrizRiesgo.idPeriodo;
        control.idProceso = matrizRiesgo.idProceso;
        control.idSubProceso = matrizRiesgo.idSubProceso;
        control.idEmpresa = matrizRiesgo.idEmpresa;
        control.idFrecuenciaControl = matrizRiesgo.idFrecuenciaControl;
        control.idFrecuenciaRiesgo = matrizRiesgo.idFrecuenciaRiesgo;
        control.deRiesgo = matrizRiesgo.deRiesgo;
        control.listaProcesos = matrizRiesgo.listaProcesos;
        control.listaSubProcesos = matrizRiesgo.listaSubProcesos;
        control.idCodigoControl = 0;
        control.idMatrizNivel = idMatrizNivel;
        control.codRiesgo = "";
        control.deCartera = "";

        control.usuarioCreacion = usuarioCreacion;
        control.ipCreacion = ipCreacion;

        matrizRiesgo.listaDetalleMatriz.push(control);
        matrizRiesgo.listaProcesos = this.listaProcesosSelected;

        if (idTipoMatriz == 0) {
            matrizRiesgo.idProceso = this.listaProcesosSelected[0].idProceso;
            matrizRiesgo.idMatrizNivel = this.listaProcesosSelected[0].idMatrizNivel;

        }

        console.log("La lista procesos a " + JSON.stringify(this.listaProcesosSelected));
        console.log("La lista procesos a agregar mat " + JSON.stringify(matrizRiesgo));
        console.log("La lista procesos a agregar " + JSON.stringify(matrizRiesgo.listaProcesos));

        this.matricesRiesgo.push(matrizRiesgo);


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

    getCorrelativoPlan(idRiesgo: number, idFraude: number): string {

        var inicial: string = "F";
        var correlativo: string = idRiesgo.toString() + inicial + idFraude;

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

    /* Lista select detalle */
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

    replicarMatrices(matrizRiesgoTemp: MatrizFraude, ri: number) {
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
        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const cantidad: number = Number(this.SelectedCant);
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idTipoMatriz').value;

        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";
        if (cantidad > 0) {
            var cant = cantidad;
            var orden = this.matricesRiesgo.length;
            for (var j = 0; j < orden; j++) {
                if (this.matricesRiesgo[j].idCodigoControl != undefined) {

                    if (this.matricesRiesgo[j].idMatrizRiesgo == this.matrizRiesgoTemp.idMatrizRiesgo) {

                        if (this.matricesRiesgo[j].modified) {

                        } else {

                            var control: MatrizFraude = new MatrizFraude();
                            control.ordenTabla = j + 1;

                            control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;
                            control.codMatriz = this.matrizRiesgoTemp.codMatriz;

                            control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
                            control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                            control.idMatrizNivel = idMatrizNivel;
                            control.idSede = this.matrizRiesgoTemp.idSede;
                            control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                            control.idProceso = this.matrizRiesgoTemp.idProceso;
                            control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                            control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                            control.riesgoAsociado = this.matrizRiesgoTemp.riesgoAsociado;
                            control.idOrigenRiesgo = this.matrizRiesgoTemp.idOrigenRiesgo;
                            control.agenteFraude = this.matrizRiesgoTemp.agenteFraude;
                            control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
                            control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;

                            control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
                            control.nuImpactoInherenteE = this.matrizRiesgoTemp.nuImpactoInherenteE;
                            control.nuImpactoInherenteL = this.matrizRiesgoTemp.nuImpactoInherenteL;
                            control.nuImpactoInherenteR = this.matrizRiesgoTemp.nuImpactoInherenteR;
                            control.nuImpactoInherenteC = this.matrizRiesgoTemp.nuImpactoInherenteC;
                            control.nuImpactoInherenteG = this.matrizRiesgoTemp.nuImpactoInherenteG;
                            control.nuPuntajeInherente = this.matrizRiesgoTemp.nuPuntajeInherente;
                            control.deSeveridadInherente = this.matrizRiesgoTemp.deSeveridadInherente;

                            control.codControl = this.matrizRiesgoTemp.codControl;
                            control.deControl = this.matrizRiesgoTemp.deControl;
                            control.idAreaControl = this.matrizRiesgoTemp.idAreaControl;
                            control.idResponsableControl = this.matrizRiesgoTemp.idResponsableControl;
                            control.limitaOportunidaControl = this.matrizRiesgoTemp.limitaOportunidaControl;
                            control.motivaActoControl = this.matrizRiesgoTemp.motivaActoControl;
                            control.actitudPotencialControl = this.matrizRiesgoTemp.actitudPotencialControl;
                            control.idFrecuenciaControl = this.matrizRiesgoTemp.idFrecuenciaControl;
                            control.idOportunidadControl = this.matrizRiesgoTemp.idOportunidadControl;
                            control.idAutomatizacionControl = this.matrizRiesgoTemp.idAutomatizacionControl;
                            control.deEvidenciaControl = this.matrizRiesgoTemp.deEvidenciaControl;

                            control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
                            control.nuImpactoResidualE = this.matrizRiesgoTemp.nuImpactoResidualE;
                            control.nuImpactoResidualL = this.matrizRiesgoTemp.nuImpactoResidualL;
                            control.nuImpactoResidualR = this.matrizRiesgoTemp.nuImpactoResidualR;
                            control.nuImpactoResidualC = this.matrizRiesgoTemp.nuImpactoResidualC;
                            control.nuImpactoResidualG = this.matrizRiesgoTemp.nuImpactoResidualG;
                            control.nuPuntajeResidual = this.matrizRiesgoTemp.nuPuntajeResidual;
                            control.deSeveridadResidual = this.matrizRiesgoTemp.deSeveridadResidual;


                            control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
                            control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;
                            control.listaDetalleMatriz = [];

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


                } else {
                    //    this.matricesRiesgo[j].idCodigoControl = j;
                    //    this.matricesRiesgo.push(control);
                    //    cant--;
                }

            }

            for (var i = 0; i < cant; i++) {

                var control: MatrizFraude = new MatrizFraude();
                orden++;
                control.ordenTabla = orden;

                control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;
                control.codMatriz = this.matrizRiesgoTemp.codMatriz;

                control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
                control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                control.idMatrizNivel = idMatrizNivel;
                control.idSede = this.matrizRiesgoTemp.idSede;
                control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                control.idProceso = this.matrizRiesgoTemp.idProceso;
                control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                control.riesgoAsociado = this.matrizRiesgoTemp.riesgoAsociado;
                control.idOrigenRiesgo = this.matrizRiesgoTemp.idOrigenRiesgo;
                control.agenteFraude = this.matrizRiesgoTemp.agenteFraude;
                control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
                control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;

                control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
                control.nuImpactoInherenteE = this.matrizRiesgoTemp.nuImpactoInherenteE;
                control.nuImpactoInherenteL = this.matrizRiesgoTemp.nuImpactoInherenteL;
                control.nuImpactoInherenteR = this.matrizRiesgoTemp.nuImpactoInherenteR;
                control.nuImpactoInherenteC = this.matrizRiesgoTemp.nuImpactoInherenteC;
                control.nuImpactoInherenteG = this.matrizRiesgoTemp.nuImpactoInherenteG;
                control.nuPuntajeInherente = this.matrizRiesgoTemp.nuPuntajeInherente;
                control.deSeveridadInherente = this.matrizRiesgoTemp.deSeveridadInherente;

                control.codControl = this.matrizRiesgoTemp.codControl;
                control.deControl = this.matrizRiesgoTemp.deControl;
                control.idAreaControl = this.matrizRiesgoTemp.idAreaControl;
                control.idResponsableControl = this.matrizRiesgoTemp.idResponsableControl;
                control.limitaOportunidaControl = this.matrizRiesgoTemp.limitaOportunidaControl;
                control.motivaActoControl = this.matrizRiesgoTemp.motivaActoControl;
                control.actitudPotencialControl = this.matrizRiesgoTemp.actitudPotencialControl;
                control.idFrecuenciaControl = this.matrizRiesgoTemp.idFrecuenciaControl;
                control.idOportunidadControl = this.matrizRiesgoTemp.idOportunidadControl;
                control.idAutomatizacionControl = this.matrizRiesgoTemp.idAutomatizacionControl;
                control.deEvidenciaControl = this.matrizRiesgoTemp.deEvidenciaControl;

                control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
                control.nuImpactoResidualE = this.matrizRiesgoTemp.nuImpactoResidualE;
                control.nuImpactoResidualL = this.matrizRiesgoTemp.nuImpactoResidualL;
                control.nuImpactoResidualR = this.matrizRiesgoTemp.nuImpactoResidualR;
                control.nuImpactoResidualC = this.matrizRiesgoTemp.nuImpactoResidualC;
                control.nuImpactoResidualG = this.matrizRiesgoTemp.nuImpactoResidualG;
                control.nuPuntajeResidual = this.matrizRiesgoTemp.nuPuntajeResidual;
                control.deSeveridadResidual = this.matrizRiesgoTemp.deSeveridadResidual;

                control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
                control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;

                control.listaDetalleMatriz = [];

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


    editarRegistro(matrizRiesgoTemp: MatrizFraude, idMatriz: number) {

        //   this.matrizRiesgoTemp=matrizRiesgoTemp;
        //   if (matrizRiesgoTemp.idMatrizRiesgo == idMatriz) {
        this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo] = {...matrizRiesgoTemp};
        console.log("Matriz Edit " + JSON.stringify(matrizRiesgoTemp));
        //  }
    }

    registrarMatrizRiesgo() {


        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        // const idMatrizNivel = this.matricesRiesgo[0].idMatrizNivel;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.getIdMatrizNextVal();
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        var matrizRiesgo: MatrizFraude = {
            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
            idEmpresa: idEmpresa,
            idCartera: idCartera,
            idSede: idSede,
            idPeriodo: idPeriodo,
            idTipoMatriz: idTipoMatriz,
            listaProcesos: [],
            listaSubProcesos: [],
            idGerencia: 0,
            usuarioCreacion: usuarioCreacion,
            ipCreacion: ipCreacion,
            deCartera: "",
            idMatrizNivel: idMatrizNivel,
            listaDetalleMatriz: []

        };

        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatriz.push(this.matricesRiesgo[j]);

        }

        if (matrizRiesgo.listaDetalleMatriz.length == 0) {
            Swal.fire("Debe de ingresar el detalle de la Matriz de Riesgo de Fraude");

        } else {
            Swal.fire({
                title: '¿Está seguro de crear la Matriz de Riesgo de Fraude?',
                showCancelButton: true,
                confirmButtonText: `Crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos creando la Matriz de Riesgo de Fraude',
                        allowOutsideClick: () => !Swal.isLoading(),
                        allowEscapeKey: () => !Swal.isLoading()
                    });
                    Swal.showLoading();
                    this.matrizRiesgoService.registrarMatrizFraude(matrizRiesgo).subscribe(
                        resp => {
                            console.log(resp);
                            if (resp.idMatrizRiesgo !== 0) {
                                if (Swal.isLoading()) {
                                    Swal.close();
                                }
                                //console.log("REG: MATRIZ " + JSON.stringify(resp));
                                Swal.fire('¡Creación exitosa!', "La Matriz de Riesgo de Fraude se creó con éxito", 'success');
                                this.router.navigate(['/pages', 'main', 'transaccion', 'matrizFraude']);
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
        console.log("REG MATRIZ " + JSON.stringify(this.matricesRiesgo[0]));

        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const indicadorBaja = this.formularioMatrizRiesgo.get('idEstado').value;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.matrizRiesgo.idMatrizRiesgo;
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        var matrizRiesgo: MatrizFraude = {
            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
            idEmpresa: idEmpresa,
            idCartera: idCartera,
            idSede: idSede,
            idPeriodo: idPeriodo,
            idTipoMatriz: idTipoMatriz,
            listaProcesos: [],
            listaSubProcesos: [],
            idGerencia: 0,
            usuarioCreacion: usuarioCreacion,
            ipCreacion: ipCreacion,
            deCartera: "",
            idMatrizNivel: idMatrizNivel,
            indicadorBaja: indicadorBaja,
            listaDetalleMatriz: []


        };


        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatriz.push(this.matricesRiesgo[j]);

        }

        for (var j = 0; j < this.matrizFraudeEliminado.length; j++) {

            matrizRiesgo.listaDetalleMatriz.push(this.matrizFraudeEliminado[j]);

        }

        console.log("EL JSON ACT " + JSON.stringify(matrizRiesgo));

        Swal.fire({
            title: '¿Está seguro de actualizar la Matriz de Riesgo de Fraude?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la Matriz de Riesgo de Fraude',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.matrizRiesgoService.actualizarMatrizFraude(matrizRiesgo).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idMatrizRiesgo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            console.log("REG: MATRIZ " + JSON.stringify(resp));
                            Swal.fire('¡Actualización exitosa!', "La matriz de riesgo de fraude se actualizó con éxito", 'success');
                            this.router.navigate(['/pages', 'main', 'transaccion', 'matrizFraude']);

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


    guardarRegistroEditado(matrizRiesgoTemp: MatrizFraude) {

        matrizRiesgoTemp.modified = true;
        console.log("LA MAT " + JSON.stringify(matrizRiesgoTemp));
        console.log("LA MAT1 " + JSON.stringify(this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo]));
        //      if (matrizRiesgoTemp.idMatrizRiesgo > 0) {
        delete this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo];
        //this.matrizRiesgoService.registrarEdicionRegistroMatrizRiesgo(matrizRiesgoTemp, {severity: 'success', summary: 'Success', detail: 'Product is updated'});
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Registro actualizado'});
        //      } else {
        //        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Proceso inválido'});
        //     }
    }

    obtenerListaTipoMatriz() {

        this.matrizRiesgoService.obtenerListaTipoMatriz().subscribe(
            resp => {
                console.log('lista de Tipo MatrizR1 : ' + JSON.stringify(resp.listaParametros));
                this.listaTiposMatrizRiesgo = resp.listaParametros;
                //    this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[0].idParametro);
                //   this.obtenerProcesosMatriz(this.listaTiposMatrizRiesgo[0].idParametro);
                //  this.formularioMatrizRiesgo.get('idMatrizNivel').disable();

            }
        );

    }

    obtenerListaEstadoParametros() {

        this.matrizRiesgoService.obtenerListaEstadoParametros().subscribe(
            resp => {
                this.listaTiposMatriz = resp.listaParametros;

                this.formularioMatrizRiesgo.get('idTipoMatriz').setValue(this.idTipoMatrizNivel);

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

    obtenerListaCantidadControl() {

        this.matrizRiesgoService.obtenerListaCantidadControl().subscribe(
            resp => {
                this.listaCantControl = resp.listaParametros;
            }
        );

    }

    obtenerListaEstadoPlanAccion() {

        this.matrizRiesgoService.obtenerEstadoPlanAccion().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEstadoPlanAccion = resp.listaParametros;


            }
        );

    }

    obtenerEmpresa(idEmpresa: number) {

        this.matrizRiesgoService.obtenerEmpresa(idEmpresa).subscribe(
            resp => {

                this.formularioMatrizRiesgo.get('cartera').setValue(resp.Empresa.idCartera);


            }
        );

    }

    obtenerListaEstrategiaRespuesta() {
        return this.matrizRiesgoService.obtenerListaEstrategiaRespuesta().subscribe(
            resp => {
                // @ts-ignore
                this.listaEstrategiaRespuesta = resp.listaParametros;

            });
    }

    obtenerListaEficaciaPlanAccion() {

        this.matrizRiesgoService.obtenerEficazPlanAccion().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEficazPlanAccion = resp.listaParametros;


            }
        );

    }

    cancelarEdicion(matrizRiesgoTemp: MatrizFraude, index: number) {

        console.log();
        this.matricesRiesgo[index] = this.matrizRiesgoTemp;
        //   delete this.products2[product.id];
    }

    borrarRegistro(matrizRiesgoTemp: MatrizFraude, index: number) {

        if (matrizRiesgoTemp.idDetaMatrizFraude > 0 ){

            matrizRiesgoTemp.indicadorBaja = '0';

            this.matrizFraudeEliminado.push(matrizRiesgoTemp);

            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }else {
            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }
    }

    calculoSeveridadProbabilidad(indice, event): void {

        console.log("Cal Sev");
        const probabilidadRiesgo: number = event.target.value;
        const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherenteE;
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
        const impactoControl: number = this.matricesRiesgo[indice].nuImpactoResidualE;
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

    limit_number_prob_riesgo(limitfield, indice) {

        const valor: number = limitfield.target.value;
        console.log("LIMIT " + valor);
        if (valor > 4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuProbabilidadInherente = 4;

            const probabilidadRiesgo: number = 4;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherenteE;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited: string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result: number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;

            }


        } else {

            const probabilidadRiesgo: number = valor;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherenteE;
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
            this.matricesRiesgo[indice].nuImpactoInherenteE = 4;

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
        } else {


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
            const impactoControl: number = this.matricesRiesgo[indice].nuImpactoResidualE;

            var calculo: number = probabilidadControl * impactoControl;
            var calculo_limited: string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result: number = Number(calculo_limited);

                this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
                var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
                this.matricesRiesgo[indice].deSeveridadResidual = severidad;
            }

        } else {

            const probabilidadControl: number = valor;
            const impactoControl: number = this.matricesRiesgo[indice].nuImpactoResidualE;

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

    limit_number_prob_res(limitfield, indice) {

        const valor: number = limitfield.target.value;
        console.log("LIMIT " + valor);
        if (valor > 4) {

            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuProbabilidadResidual = 4;

            const probabilidadControl: number = 4;
            const nuImpactoResidualE: number = this.matricesRiesgo[indice].nuImpactoResidualE * 0.25;
            const nuImpactoResidualL: number = this.matricesRiesgo[indice].nuImpactoResidualL * 0.25;
            const nuImpactoResidualR: number = this.matricesRiesgo[indice].nuImpactoResidualR * 0.25;
            const nuImpactoResidualC: number = this.matricesRiesgo[indice].nuImpactoResidualC * 0.25;


            if (calculoImpactoG > 0) {

                var calculoImpactoG = nuImpactoResidualE + nuImpactoResidualL + nuImpactoResidualR + nuImpactoResidualC;

                this.matricesRiesgo[indice].nuImpactoResidualG = calculoImpactoG;
                var calculo: number = probabilidadControl * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadControl, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadResidual = severidad;
                }


            }


        } else {

            const probabilidadControl: number = valor;
            const nuImpactoResidualE: number = this.matricesRiesgo[indice].nuImpactoResidualE * 0.25;
            const nuImpactoResidualL: number = this.matricesRiesgo[indice].nuImpactoResidualL * 0.25;
            const nuImpactoResidualR: number = this.matricesRiesgo[indice].nuImpactoResidualR * 0.25;
            const nuImpactoResidualC: number = this.matricesRiesgo[indice].nuImpactoResidualC * 0.25;

            var calculoImpactoG = nuImpactoResidualE + nuImpactoResidualL + nuImpactoResidualR + nuImpactoResidualC;

            if (calculoImpactoG > 0) {
                this.matricesRiesgo[indice].nuImpactoResidualG = calculoImpactoG;
                var calculo: number = probabilidadControl * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadControl, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadResidual = severidad;
                }
            }
        }
    }

    limit_number_prob_inhe(limitfield, indice) {

        const valor: number = limitfield.target.value;
        console.log("LIMIT " + valor);
        if (valor > 4) {

            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuProbabilidadInherente = 4;

            const probabilidadControl: number = 4;
            const nuImpactoInherenteE: number = this.matricesRiesgo[indice].nuImpactoInherenteE * 0.25;
            const nuImpactoInherenteL: number = this.matricesRiesgo[indice].nuImpactoInherenteL * 0.25;
            const nuImpactoInherenteR: number = this.matricesRiesgo[indice].nuImpactoInherenteR * 0.25;
            const nuImpactoInherenteC: number = this.matricesRiesgo[indice].nuImpactoInherenteC * 0.25;

            var calculoImpactoG = nuImpactoInherenteE + nuImpactoInherenteL + nuImpactoInherenteR + nuImpactoInherenteC;

            if (calculoImpactoG > 0) {
                this.matricesRiesgo[indice].nuImpactoInherenteG = calculoImpactoG;
                var calculo: number = probabilidadControl * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadControl, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadInherente = severidad;
                }

            }


        } else {


            this.matricesRiesgo[indice].nuProbabilidadInherente = valor;

            const probabilidadControl: number = valor;
            const nuImpactoInherenteE: number = this.matricesRiesgo[indice].nuImpactoInherenteE * 0.25;
            const nuImpactoInherenteL: number = this.matricesRiesgo[indice].nuImpactoInherenteL * 0.25;
            const nuImpactoInherenteR: number = this.matricesRiesgo[indice].nuImpactoInherenteR * 0.25;
            const nuImpactoInherenteC: number = this.matricesRiesgo[indice].nuImpactoInherenteC * 0.25;

            var calculoImpactoG = nuImpactoInherenteE + nuImpactoInherenteL + nuImpactoInherenteR + nuImpactoInherenteC;

            if (calculoImpactoG > 0) {

                this.matricesRiesgo[indice].nuImpactoInherenteG = calculoImpactoG;
                var calculo: number = probabilidadControl * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadControl, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadInherente = severidad;
                }
            }
        }
    }

    limit_number_impa_inhe(limitfield, indice, campo) {

        const valor: number = limitfield.target.value;
        console.log("LIMIT " + valor);
        if (valor > 4) {

            limitfield.target.value = 4;

            var nuImpactoInherenteE: number = this.matricesRiesgo[indice].nuImpactoInherenteE * 0.25;
            var nuImpactoInherenteL: number = this.matricesRiesgo[indice].nuImpactoInherenteL * 0.25;
            var nuImpactoInherenteR: number = this.matricesRiesgo[indice].nuImpactoInherenteR * 0.25;
            var nuImpactoInherenteC: number = this.matricesRiesgo[indice].nuImpactoInherenteC * 0.25;


            if (campo == "E") {
                nuImpactoInherenteE = 4 * 0.25;
            } else if (campo == "L") {
                nuImpactoInherenteL = 4 * 0.25;
            } else if (campo == "R") {
                nuImpactoInherenteR = 4 * 0.25;
            } else if (campo == "C") {
                nuImpactoInherenteC = 4 * 0.25;
            }


            const probabilidadInherente: number = this.matricesRiesgo[indice].nuProbabilidadInherente;

            var calculoImpactoG = nuImpactoInherenteE + nuImpactoInherenteL + nuImpactoInherenteR + nuImpactoInherenteC;

            if (calculoImpactoG > 0) {

                this.matricesRiesgo[indice].nuImpactoInherenteG = calculoImpactoG;

                var calculo: number = probabilidadInherente * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadInherente, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadInherente = severidad;
                }

            }


        } else {


            var nuImpactoInherenteE: number = this.matricesRiesgo[indice].nuImpactoInherenteE * 0.25;
            var nuImpactoInherenteL: number = this.matricesRiesgo[indice].nuImpactoInherenteL * 0.25;
            var nuImpactoInherenteR: number = this.matricesRiesgo[indice].nuImpactoInherenteR * 0.25;
            var nuImpactoInherenteC: number = this.matricesRiesgo[indice].nuImpactoInherenteC * 0.25;


            if (campo == "E") {
                nuImpactoInherenteE = valor * 0.25;
            } else if (campo == "L") {
                nuImpactoInherenteL = valor * 0.25;
            } else if (campo == "R") {
                nuImpactoInherenteR = valor * 0.25;
            } else if (campo == "C") {
                nuImpactoInherenteC = valor * 0.25;
            }


            const probabilidadInherente: number = this.matricesRiesgo[indice].nuProbabilidadInherente;

            var calculoImpactoG = nuImpactoInherenteE + nuImpactoInherenteL + nuImpactoInherenteR + nuImpactoInherenteC;

            if (calculoImpactoG > 0) {

                this.matricesRiesgo[indice].nuImpactoInherenteG = calculoImpactoG;

                var calculo: number = probabilidadInherente * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadInherente, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadInherente = severidad;
                }


            }
        }
    }


    limit_number_impa_res(limitfield, indice, campo) {

        const valor: number = limitfield.target.value;
        console.log("LIMIT " + valor);
        if (valor > 4) {

            limitfield.target.value = 4;

            var nuImpactoResidualE: number = this.matricesRiesgo[indice].nuImpactoResidualE * 0.25;
            var nuImpactoResidualL: number = this.matricesRiesgo[indice].nuImpactoResidualL * 0.25;
            var nuImpactoResidualR: number = this.matricesRiesgo[indice].nuImpactoResidualR * 0.25;
            var nuImpactoResidualC: number = this.matricesRiesgo[indice].nuImpactoResidualC * 0.25;


            if (campo == "E") {
                nuImpactoResidualE = 4 * 0.25;
            } else if (campo == "L") {
                nuImpactoResidualL = 4 * 0.25;
            } else if (campo == "R") {
                nuImpactoResidualR = 4 * 0.25;
            } else if (campo == "C") {
                nuImpactoResidualC = 4 * 0.25;
            }


            const probabilidadResidual: number = this.matricesRiesgo[indice].nuProbabilidadResidual;

            var calculoImpactoG = nuImpactoResidualE + nuImpactoResidualL + nuImpactoResidualR + nuImpactoResidualC;

            if (calculoImpactoG > 0) {

                this.matricesRiesgo[indice].nuImpactoResidualG = calculoImpactoG;

                var calculo: number = probabilidadResidual * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadResidual, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadResidual = severidad;
                }

            }


        } else {


            var nuImpactoResidualE: number = this.matricesRiesgo[indice].nuImpactoResidualE * 0.25;
            var nuImpactoResidualL: number = this.matricesRiesgo[indice].nuImpactoResidualL * 0.25;
            var nuImpactoResidualR: number = this.matricesRiesgo[indice].nuImpactoResidualR * 0.25;
            var nuImpactoResidualC: number = this.matricesRiesgo[indice].nuImpactoResidualC * 0.25;


            if (campo == "E") {

                nuImpactoResidualE = valor * 0.25;
            } else if (campo == "L") {

                nuImpactoResidualL = valor * 0.25;
            } else if (campo == "R") {

                nuImpactoResidualR = valor * 0.25;
            } else if (campo == "C") {

                nuImpactoResidualC = valor * 0.25;
            }

            const probabilidadResidual: number = this.matricesRiesgo[indice].nuProbabilidadResidual;

            var calculoImpactoG = nuImpactoResidualE + nuImpactoResidualL + nuImpactoResidualR + nuImpactoResidualC;

            if (calculoImpactoG > 0) {

                this.matricesRiesgo[indice].nuImpactoResidualG = calculoImpactoG;
                var calculo: number = probabilidadResidual * calculoImpactoG;
                var calculo_limited: string = calculo.toFixed(2);

                if (calculo > 0) {
                    var calculo_result: number = Number(calculo_limited);

                    this.matricesRiesgo[indice].nuPuntajeResidual = calculo_result;
                    var severidad = this.obtener_severidad(probabilidadResidual, calculoImpactoG);
                    this.matricesRiesgo[indice].deSeveridadResidual = severidad;
                }

            }


        }
    }

    limit_number_impa_control(limitfield, indice) {

        const valor: number = limitfield.target.value;
        console.log("LIMIT " + valor);
        if (valor > 4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuImpactoResidualE = 4;

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
        } else {

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

        } else {
            calculo_result = 0;

        }

        return calculo_result;

    }

    obtener_severidad(proba: number, impa: number): string {
        let severidad: string;

        if (proba < 2.5 && impa < 2.5){

            if (proba < 1.75 && impa < 1.75){
                severidad = "Bajo";
            }else{
                severidad = "Moderado";
            }

        }else if (proba >= 2.5 && impa < 2.5){

            if (proba < 3.25 && impa < 1.75){
                severidad = "Moderado";
            }else{
                severidad = "Alto";
            }

        }else if (proba < 2.5 && impa >= 2.5){

            if (proba < 1.75 && impa < 3.25){
                severidad = "Moderado";
            }else{
                severidad = "Alto";
            }

        }else if (proba >= 2.5 && impa >= 2.5){

            if (proba < 3.25 && impa < 3.25){
                severidad = "Alto";
            }else{
                severidad = "Extremo";
            }

        }

        return severidad;
    }


    get periodoNoValido(): boolean {
        return this.formularioMatrizRiesgo.get('periodo').invalid && this.formularioMatrizRiesgo.get('periodo').touched;
    }

    get idTipoMatrizNoValido(): boolean {
        return this.formularioMatrizRiesgo.get('idTipoMatriz').invalid && this.formularioMatrizRiesgo.get('idTipoMatriz').touched;
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
