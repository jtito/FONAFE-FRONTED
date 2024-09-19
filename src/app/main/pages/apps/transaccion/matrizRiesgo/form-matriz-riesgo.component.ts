import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatrizRiesgo } from '../../../../../shared/models/matrizRiesgo';
import { Parametro } from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { MatrizRiesgoService } from './matriz-riesgo.service';
import { MessageService } from "primeng/api";
import { Empresa } from "../../../../../shared/models/empresa";
import { Sede } from "../../../../../shared/models/sede";
import { Periodo } from "../../../../../shared/models/periodo";
import { MATRIZ_OPERACIONAL } from "../../../../../shared/Constantes";
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { Gerencia } from "../../../../../shared/models/gerencia";
import { Proceso } from "../../../../../shared/models/proceso";
import { SubProceso } from "../../../../../shared/models/subproceso";
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RiesgoResidualComponent } from './riesgo-residual/riesgo-residual.component';
import { RiesgoInherenteComponent } from './riesgo-inherente/riesgo-inherente.component';
import { cartesianPoint } from 'src/app/shared/models/cartesianPoint';
import FileSaver from 'file-saver';

import { TipoMatrizRiesgo } from 'src/app/shared/models/tipoMatrizRiesgo';
import { SubirArchivosComponent } from 'src/app/main/components/subir-archivos/subir-archivos.component';

import { FilesService } from 'src/app/core/service/files.service';
import { TipoEvidencia } from "../../../../../shared/models/tipoEvidencia";
import * as XLSX from 'xlsx';
import { TipoPerfil } from "../../../../../shared/models/tipoPerfil";
import { ComentarioAuditoriaComponent } from "../../../../components/comentario-auditoria/comentario-auditoria.component";
import { TipoMatriz } from "../../../../../shared/models/tipoMatriz";
import { CreateRiesgoComponent } from './create-riesgo/create-riesgo.component';

@Component({
    selector: 'app-conf-registrar-matriz-riesgo',
    templateUrl: 'form-matriz-riesgo.component.html',
    styleUrls: ['form-matriz-riesgo.component.scss'],
    providers: [DialogService],
    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})

export class FormMatrizRiesgoComponent implements OnInit {

    formularioMatrizRiesgo: FormGroup;
    matrizRiesgo: MatrizRiesgo;
    loading: boolean;
    listaEstados: Parametro[];
    listaEmpresas: Empresa[];
    listaCarteras: Parametro[];
    listaCantControl: Parametro[];
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
    listaEstadoPlanAccion: Parametro[];
    listaEficazPlanAccion: Parametro[];
    listaTipos: Parametro[];
    listaEstrategiaRespuesta: Parametro[];
    editar: boolean;

    idEstado: string;
    idEmpresa: number;
    idSede: number;
    idCartera: number;
    idTipoMatriz: number;
    idTipoMatrizSelect: number = 0;
    severidad: string;
    indicadorBaja: number = 1;

    cols: any[];
    frozenColumns: any[];
    matricesRiesgo: MatrizRiesgo[];
    matrizRiesgoEliminado: MatrizRiesgo[] = [];
    matrizRiesgoEditar: MatrizRiesgo;
    matrizRiesgoTemporal: { [s: string]: MatrizRiesgo; } = {};
    payload: DataLogin;

    /*lista detalle matriz*/
    listaGerencias: Gerencia[];
    listaGerenciasSel: Gerencia[];
    listaProcesos: Proceso[];
    listaSubProcesos: SubProceso[];

    listaProcesosSelected: Proceso[];
    listaSubProcesosSelected: SubProceso[];

    keys: string[];
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

    modalVisible = false;

    isExcelFile: boolean;
    dataSheet = new Subject();
    columns = [];

    idPerfil: number;
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    tipoPerfilUsuario: TipoPerfil = TipoPerfil.user;
    notadmin: boolean = false;

    deSeveridadList: String[];
    codRiesgoList: String[];
    //Filtros Model

    gerenciaModel;
    deSeveridadRModel;
    estadoPlanModel;
    procesosModel;
    listaEstadosSel: Parametro[] = [];
    ver: boolean = false;
    dataIp: string = "";

    idListaGerencia: number[];
    idListaProceso: number[];
    gerenciaList = [];
    procesoList = [];
    @ViewChild('f1') file1: ElementRef;

    activeImport: boolean = true;

    constructor(public dialogService: DialogService, private authLoginService: AuthLoginService, private formBuilder: FormBuilder, private router: Router,
        private matrizRiesgoService: MatrizRiesgoService, private activatedRoute: ActivatedRoute,
        private messageService: MessageService, private filesService: FilesService, private cdr: ChangeDetectorRef) {

        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
        this.idPerfil = this.payload.data.idPerfil;
        this.idSede = this.payload.data.datosSede.idSede;
        this.deSeveridadList = [];
        this.codRiesgoList = [];
        this.idListaGerencia = [];
        this.idListaProceso = [];
        this.gerenciaList = [];
        this.procesoList = [];
        this.obtenerListaEmpresas();
        this.obtenerListaCarteras();
        this.obtenerTipoMatriz();
        this.obtenerListaMatrizNivel();
        this.obtenerListaTipoMatriz();
        this.crearFormulario();
        this.obtenerListaEstadoParametros();
        this.obtenerListaEstados();
        this.solverPermissions();
        this.obtenerListaEstrategiaRespuesta();
        this.obtenerListaOrigenRiesgo();
        this.obtenerListaFrecuenciaRiesgo();
        this.obtenerListaTipoRiesgo();

        this.obtenerListaAreaResponsable();
        this.obtenerListaResponsableControl();
        this.obtenerListaFrecuenciaControl();
        this.obtenerListaOportunidadControl();
        this.obtenerListaAutomatizacionControl();
        this.obtenerListaEstadoPlanAccion();
        this.obtenerListaEficaciaPlanAccion();
        this.obtenerListaCantidadControl();

        this.listaGerencias = [{ idGerencia: 0, descripcionGerencia: 'Seleccione' }];


        this.obtenermetodoIP();
    }

    cargarListas() {

        this.obtenerListaSedes();
        this.obtenerListaPeriodos();
        this.obtenerListaGerencia();
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            if (params.idMatrizRiesgo) {
                this.loading = true;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.ver = false;
                this.formularioMatrizRiesgo.enable();
                this.cargarMatrizRiesgo();
            } else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                //  this.formularioMatrizRiesgo.disable();
                this.cargarProcesos(this.idEmpresa, 0);
                this.cargarListas();
                this.ver = false;
                this.editar = false;
                this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
                this.formularioMatrizRiesgo.get('sede').setValue(this.payload.data.datosSede.idSede);
                this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);

            } else if (this.activatedRoute.snapshot.url[0].toString() === 'ver') {
                this.formularioMatrizRiesgo.disable();
                this.ver = true;
                this.editar = false;
                this.cargarMatrizRiesgo();
            }

            else {
                this.formularioMatrizRiesgo.disable();
                this.ver = false;
                this.editar = false;
            }


        });





        this.frozenColumns = [
            {
                field: 'idMatrizRiesgo',
                header: 'COD',
                class: 'text-center',
                ordenadmiento: 'idMatrizRiesgo',
                headerClass: 'text-center',
                styleClass: 'width: 10%',
                frozen: 'idMatrizRiesgo'
            }
        ];

        this.cols = [
            {
                field: 'codMatriz',
                header: 'COD',
                class: 'text-center',
                colspan: "1",
                ordenadmiento: 'codMatriz',
                headerClass: 'text-center',
                styleClass: 'width: 10%'
            },
            {
                field: 'idMatrizNivel',
                header: 'Nivel',
                class: 'text-center',
                colspan: "1",
                ordenadmiento: 'idMatrizNivel',
                headerClass: 'text-center',
                styleClass: 'width: 10%'
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center',
                colspan: "1",
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center'
            },
            {
                field: 'idProceso',
                header: 'Proceso',
                class: 'text-center',
                colspan: "2",
                ordenadmiento: 'idProceso',
                headerClass: 'text-center'
            },
            {
                field: 'idSubProceso',
                header: 'Sub Proceso',
                class: 'text-center',
                colspan: "1",
                ordenadmiento: 'idSubProceso',
                headerClass: 'text-center'
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo',
                colspan: "1",
                class: 'text-center static-sticky-col',
                ordenadmiento: 'codRiesgo',
                headerClass: 'text-center static-sticky-col'
            },
            {
                field: 'deRiesgo',
                header: 'Descripción del Riesgo',
                class: 'text-center  static-sticky-col1',
                ordenadmiento: 'deRiesgo',
                colspan: "2",
                headerClass: 'text-center static-sticky-col1'
            },
            {
                field: 'procesosImpactados',
                header: 'Procesos Impactados',
                class: 'text-center',
                ordenadmiento: 'procesosImpactados',
                headerClass: 'text-center'

            },
            {
                field: 'idOrigenRiesgo',
                header: 'Origen del Riesgo',
                class: 'text-center',
                ordenadmiento: 'idOrigenRiesgo',
                headerClass: 'text-center'
            },
            {
                field: 'idFrecuenciaRiesgo',
                header: 'Frecuencia del Riesgo',
                class: 'text-center',
                ordenadmiento: 'idFrecuenciaRiesgo',
                headerClass: 'text-center'
            },
            {
                field: 'idTipoRiesgo',
                header: 'Tipo de Riesgo',
                class: 'text-center',
                ordenadmiento: 'idTipoRiesgo',
                headerClass: 'text-center'
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoInherente',
                header: 'Impacto (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoInherente',
                headerClass: 'text-center'
            },
            {
                field: 'nuPuntajeInherente',
                header: 'Severidad',
                class: 'text-center',
                ordenadmiento: 'nuPuntajeInherente',
                headerClass: 'text-center'
            },
            {
                field: 'deSeveridadInherente',
                header: 'Severidad Inherente',
                class: 'text-center',
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center'
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
                headerClass: 'text-center'
            },
            {
                field: 'idAreaControl',
                header: 'Área del responsable del rol',
                class: 'text-center',
                ordenadmiento: 'idAreaControl',
                headerClass: 'text-center'
            },
            {
                field: 'idResponsableControl',
                header: 'Responsable del Control',
                class: 'text-center',
                ordenadmiento: 'idResponsableControl',
                headerClass: 'text-center'
            },
            {
                field: 'idFrecuenciaControl',
                header: 'Frecuencia del Control',
                class: 'text-center',
                ordenadmiento: 'idFrecuenciaControl',
                headerClass: 'text-center'
            },
            {
                field: 'idOportunidadControl',
                header: 'Oportunidad del Control',
                class: 'text-center',
                ordenadmiento: 'idOportunidadControl',
                headerClass: 'text-center'
            },
            {
                field: 'idAutomatizacionControl',
                header: 'Automatización del Control',
                class: 'text-center',
                ordenadmiento: 'idAutomatizacionControl',
                headerClass: 'text-center'
            },
            {
                field: 'deEvidenciaControl',
                header: 'Evidencia de Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'deEvidenciaControl',
                headerClass: 'text-center'
            },
            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpactoResidual',
                header: 'Impacto (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpactoResidual',
                headerClass: 'text-center'
            },
            {
                field: 'nuPuntajeResidual',
                header: 'Severidad',
                class: 'text-center',
                ordenadmiento: 'nuPuntajeResidual',
                headerClass: 'text-center'
            },
            {
                field: 'deSeveridadResidual',
                header: 'Severidad Residual',
                class: 'text-center',
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center'
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
                header: 'Cod. Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'codPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'desPlanAccion',
                header: 'Descripción Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'desPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'idAreaPlanAccion',
                header: 'Área del Resp. Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'idAreaPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'idResponsablePlanAccion',
                header: 'Resp. Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'idResponsablePlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'fechaInicioPlanAccion',
                header: 'Fecha Inicio Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'fechaInicioPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'estadoPlanAccion',
                header: 'Estado Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'estadoPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'fechaFinPlanAccion',
                header: 'Fecha Fin Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'fechaFinPlanAccion',
                headerClass: 'text-center'
            },

            {
                field: 'evidenciaPlanAccion',
                header: 'Evidencia de Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'evidenciaPlanAccion',
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
                header: 'Fecha Verificación',
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
                header: 'Evidencia',
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
            }
            ,

            {
                field: 'codkri',
                header: 'Código KRI',
                class: 'text-center',
                ordenadmiento: 'codkri',
                headerClass: 'text-center'
            },

            {
                field: 'defKri',
                header: 'Definición del KRI',
                class: 'text-center',
                ordenadmiento: 'defKri',
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
                header: 'Meta del KRI',
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
                header: 'Responsable de asegurar su cumplimiento',
                class: 'text-center',
                ordenadmiento: 'kriResponsable',
                headerClass: 'text-center'
            },
        ];

        this.matricesRiesgo = [];

        console.log(this.loading);
    }

    solverPermissions() {
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if (this.idPerfil == TipoPerfil.admin) {
            console.log("NOTADMIN FALS");
            this.notadmin = false;
        }
        else {
            this.notadmin = true;
            this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
        }
    }


    cargarMatrizRiesgo(): void {
        this.activatedRoute.params.subscribe(params => {
            const idMatrizRiesgo = params.idMatrizRiesgo;
            const idUsuario = this.payload.data.idUsuario;
            if (idMatrizRiesgo) {
                this.matrizRiesgoService.obtenerMatrizRiesgo(idMatrizRiesgo, idUsuario).subscribe(
                    resp => {
                        // console.log("MATRIZ RIESGO " + JSON.stringify(resp));
                        this.matrizRiesgo = resp.MatrizRiesgo;

                        //  this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        //  this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
                        this.obtenerEmpresa(this.matrizRiesgo.idEmpresa);
                        //this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
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
                        let severidadList = [];
                        let codList = [];
                        let estadoList = [];

                        this.listaGerenciasSel = [];

                        for (var j = 0; j < this.matrizRiesgo.listaDetalleMatriz.length; j++) {

                            this.idListaGerencia.push(this.matrizRiesgo.listaDetalleMatriz[j].idGerencia);
                            this.idListaProceso.push(this.matrizRiesgo.listaDetalleMatriz[j].idProceso);
                            var orden = this.matricesRiesgo.length;
                            this.matrizRiesgo.listaDetalleMatriz[j].ordenTabla = orden;

                            if (this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosPlan == undefined || this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosPlan == 0) {
                                this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosPlanString = "Sustento";
                            }
                            else {
                                this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosPlanString = "Sustentos:" + this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosPlan;
                            }
                            if (this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosControl == undefined || this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosControl == 0) {
                                this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosControlString = "Sustento";
                            }
                            else {
                                this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosControlString = "Sustentos:" + this.matrizRiesgo.listaDetalleMatriz[j].cantidadArchivosControl;
                            }
                            this.matricesRiesgo.push(this.matrizRiesgo.listaDetalleMatriz[j]);
                            if (this.matrizRiesgo.listaDetalleMatriz[j].deSeveridadResidual != null && this.matrizRiesgo.listaDetalleMatriz[j].deSeveridadResidual.length > 0) {
                                severidadList.push(this.matrizRiesgo.listaDetalleMatriz[j].deSeveridadResidual);

                            }

                            if (this.matrizRiesgo.listaDetalleMatriz[j].codRiesgo != null && this.matrizRiesgo.listaDetalleMatriz[j].codRiesgo.length > 0) {
                                codList.push(this.matrizRiesgo.listaDetalleMatriz[j].codRiesgo);

                            }

                            this.listaEstadoPlanAccion.forEach(estado => {
                                if (this.matricesRiesgo[j].estadoPlanAccion == estado.idParametro.toString()) {
                                    estadoList.push(estado);
                                }
                            })
                        }

                        this.idEmpresa = this.matrizRiesgo.idEmpresa;
                        this.idSede = this.matrizRiesgo.idSede;

                        this.obtenerListaGerencia();

                        let uniqueSev = new Set(severidadList);
                        let ArraySev = [...uniqueSev];
                        this.deSeveridadList = ArraySev;

                        let uniqueCod = new Set(codList);
                        let ArrayCod = [...uniqueCod];
                        this.codRiesgoList = ArrayCod;

                        let uniqueEst = new Set(estadoList);
                        let ArrayEst = [...uniqueEst];
                        this.listaEstadosSel = ArrayEst;


                        this.obtenerListaSedes();
                        this.obtenerListaPeriodos();

                        // this.obtenerListaMatriz();

                        this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
                        this.formularioMatrizRiesgo.get('cartera').setValue(this.matrizRiesgo.idCartera);


                        if (this.matrizRiesgo.idMatrizNivel == 0) {
                            this.showColumnasEntidad();
                        }
                        else {
                            this.showColumnasProcesos();
                            this.cargarProcesos(this.matrizRiesgo.idEmpresa, 0);
                        }

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
            idMatrizRiesgo: ['',],
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

    obtenerEmpresa(idEmpresa: number) {

        this.matrizRiesgoService.obtenerEmpresa(idEmpresa).subscribe(
            resp => {

                this.formularioMatrizRiesgo.get('cartera').setValue(resp.Empresa.idCartera);


            }
        );

    }

    obtenerListaSedes() {
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
        this.formularioMatrizRiesgo.get('cartera').setValue(this.idCartera);
        this.formularioMatrizRiesgo.get('sede').setValue(null);
        this.idEmpresa = deviceValue.target.value;
        this.obtenerListaPeriodos();
        this.obtenerListaSedes();
    }

    onChangeCartera(input) {

    }

    onChangeSede(deviceValue) {

        this.idSede = deviceValue.target.value;
        this.obtenerListaGerencia();
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

        if (tipomatriz == "Entidad") {

            this.showColumnasEntidad();
        } else {

            this.showColumnasProcesos();
        }


        // this.obtenerListaMatriz();

    }

    showColumnasEntidad(): void {

        this.cols = [
            {
                field: 'codMatriz',
                header: 'COD',
                class: 'text-center tdsmall',
                ordenadmiento: 'codMatriz',
                headerClass: 'text-center tdsmall',
                styleClass: 'width: 10%',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'idMatrizNivel',
                header: 'Nivel',
                class: 'text-center tdlarge',
                ordenadmiento: 'idMatrizNivel',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                styleClass: 'width: 10%'
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center tdxlarge',
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center tdxlarge',
                colspan: "4",
                placeholder: ''
            },
            {
                field: 'deTitulo',
                header: 'Título',
                class: 'text-center tdzlarge',
                ordenadmiento: 'deTitulo',
                headerClass: 'text-center tdzlarge',
                colspan: "3",
                placeholder: ''
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo',
                class: 'text-center  static-sticky-col tdlarge',
                ordenadmiento: 'codRiesgo',
                colspan: "2",
                headerClass: 'text-center static-sticky-col tdlarge'
            },
            {
                field: 'deRiesgo',
                header: 'Descripción del Riesgo',
                class: 'text-center  static-sticky-col1 tdzlarge',
                ordenadmiento: 'deRiesgo',
                colspan: "3",
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                placeholder: ''
            },
            {
                field: 'deProcesoImpactado',
                header: 'Procesos Impactados',
                class: 'text-center tdlarge',
                ordenadmiento: 'deProcesoImpactado',
                colspan: "2",
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'deFoda',
                header: 'FODA',
                class: 'text-center tdlarge',
                ordenadmiento: 'deFoda',
                colspan: "2",
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'deGrupoInteres',
                header: 'Grupos de Interés',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'deGrupoInteres',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },


            {
                field: 'idOrigenRiesgo',
                header: 'Origen',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idOrigenRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idFrecuenciaRiesgo',
                header: 'Frecuencia del Riesgo',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idFrecuenciaRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idTipoRiesgo',
                header: 'Tipo de Riesgo',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idTipoRiesgo',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },
            {
                field: 'nuImpactoInherente',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'nuImpactoInherente',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },
            {
                field: 'nuPuntajeInherente',
                header: 'Puntaje',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'nuPuntajeInherente',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },
            {
                field: 'deSeveridadInherente',
                header: 'Severidad',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                colspan: "3",
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                placeholder: ''
            },
            {
                field: 'idAreaControl',
                header: 'Área a la que pertenece el responsable del control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idAreaControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idResponsableControl',
                header: 'Responsable del Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idResponsableControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idFrecuenciaControl',
                header: 'Frecuencia del Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idFrecuenciaControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idOportunidadControl',
                header: 'Oportunidad del Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idOportunidadControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idAutomatizacionControl',
                header: 'Automatización del Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idAutomatizacionControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'deEvidenciaControl',
                header: 'Evidencia del Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'deEvidenciaControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'sustentoControl',
                header: 'Sustento de Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'sustentoControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },
            {
                field: 'nuImpactoResidual',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'nuImpactoResidual',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },
            {
                field: 'nuPuntajeResidual',
                header: 'Puntaje',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'nuPuntajeResidual',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },
            {
                field: 'deSeveridadResidual',
                header: 'Severidad',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center tdsmall',
                placeholder: ''
            },

            //PLAN ACCON
            {
                field: 'idEstrategiaResp',
                header: 'Estrategia de Respuesta',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idEstrategiaResp',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código del Plan de acción',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'codPlanAccion',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'desPlanAccion',
                header: 'Descripción del Plan de acción',
                class: 'text-center tdzlarge',
                colspan: "3",
                ordenadmiento: 'desPlanAccion',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'idAreaPlanAccion',
                header: 'Área a la que pertenece el responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idAreaPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'idResponsablePlanAccion',
                header: ' Responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idResponsablePlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaInicioPlanAccion',
                header: 'Inicio de Plan de Acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fechaInicioPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'estadoPlanAccion',
                header: 'Estado de Plan de Acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'estadoPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaFinPlanAccion',
                header: 'Fin del plan de acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fechaFinPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'evidenciaPlanAccion',
                header: 'Sustento de Plan de Acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'evidenciaPlanAccion',
                headerClass: 'text-center tdlarge'
            },

            //Verificacion eficacia
            {
                field: 'fechaPrevista',
                header: 'Fecha Prevista',
                colspan: "2",
                class: 'text-center tdlarge',
                ordenadmiento: 'fechaPrevista',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'fueEficaz',
                header: '¿El plan de acción fue eficaz?',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'fueEficaz',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'fechaVerificacion',
                header: 'Fecha Verificación',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fechaVerificacion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'verificadoPor',
                header: 'Verificado Por',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'verificadoPor',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'evidenciaEficacia',
                header: 'Evidencia',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'evidenciaEficacia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'observaciones',
                header: 'Observaciones',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'observaciones',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'codkri',
                header: 'Código KRI',
                class: 'text-center tdsmall',
                ordenadmiento: 'codkri',
                colspan: "1",
                headerClass: 'text-center tdsmall'
            },

            {
                field: 'defKri',
                header: 'Definición del KRI',
                class: 'text-center tdzlarge',
                ordenadmiento: 'defKri',
                colspan: "3",
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'frecuencia',
                header: 'Frecuencia',
                class: 'text-center tdsmall',
                ordenadmiento: 'frecuencia',
                colspan: "1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'metkri',
                header: 'Meta del KRI',
                class: 'text-center tdsmall',
                ordenadmiento: 'metkri',
                colspan: "1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriActual',
                header: 'KRI Actual',
                class: 'text-center tdsmall',
                ordenadmiento: 'kriActual',
                colspan: "1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriResponsable',
                header: 'Responsable de asegurar su cumplimiento',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'kriResponsable',
                headerClass: 'text-center tdlarge'
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
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'idMatrizNivel',
                header: 'Nivel',
                class: 'text-center tdlarge',
                ordenadmiento: 'idMatrizNivel',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                styleClass: 'width: 10%'
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center tdxlarge',
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center tdxlarge',
                colspan: "4",
                placeholder: ''
            },
            {
                field: 'idProceso',
                header: 'Proceso',
                class: 'text-center tdzlarge',
                ordenadmiento: 'idProceso',
                headerClass: 'text-center tdzlarge',
                colspan: "3",
                placeholder: ''
            },
            {
                field: 'idSubProceso',
                header: 'Subproceso',
                class: 'text-center tdzlarge',
                ordenadmiento: 'idSubProceso',
                headerClass: 'text-center tdzlarge',
                colspan: "3",
                placeholder: ''
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo',
                class: 'text-center static-sticky-col tdlarge',
                ordenadmiento: 'codRiesgo',
                colspan: "2",
                headerClass: 'text-center  static-sticky-col tdlarge'
            },
            {
                field: 'deRiesgo',
                header: 'Descripción del Riesgo',
                class: 'text-center static-sticky-col1 tdzlarge',
                ordenadmiento: 'deRiesgo',
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                colspan: "3",
                placeholder: 'Registra Consecuencia y Causa'
            },

            {
                field: 'idOrigenRiesgo',
                header: 'Origen del Riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idOrigenRiesgo',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'idFrecuenciaRiesgo',
                header: 'Frecuencia del Riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idFrecuenciaRiesgo',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'idTipoRiesgo',
                header: 'Tipo de Riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idTipoRiesgo',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'nuImpactoInherente',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuImpactoInherente',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'nuPuntajeInherente',
                header: 'Severidad',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuPuntajeInherente',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'deSeveridadInherente',
                header: 'Severidad Inherente',
                class: 'text-center tdsmall',
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdsmall',
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                colspan: "3",
                placeholder: ''
            },
            {
                field: 'idAreaControl',
                header: 'Área a la que pertenece el responsable del control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'idAreaControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'idResponsableControl',
                header: 'Responsable del Control',
                class: 'text-center tdlarge',
                ordenadmiento: 'idResponsableControl',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'idFrecuenciaControl',
                header: 'Frecuencia del Control',
                class: 'text-center tdlarge',
                ordenadmiento: 'idFrecuenciaControl',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'idOportunidadControl',
                header: 'Oportunidad del Control',
                class: 'text-center tdlarge',
                ordenadmiento: 'idOportunidadControl',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'idAutomatizacionControl',
                header: 'Automatización del Control',
                class: 'text-center tdlarge',
                ordenadmiento: 'idAutomatizacionControl',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'deEvidenciaControl',
                header: 'Evidencia del Control',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'deEvidenciaControl',
                headerClass: 'text-center tdlarge',
                placeholder: ''
            },
            {
                field: 'sustentoControl',
                header: 'Sustento del Control',
                class: 'text-center tdlarge',
                ordenadmiento: 'sustentoControl',
                headerClass: 'text-center tdlarge',
                colspan: "2",
                placeholder: ''
            },
            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'nuImpactoResidual',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuImpactoResidual',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'nuPuntajeResidual',
                header: 'Severidad',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuPuntajeResidual',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },
            {
                field: 'deSeveridadResidual',
                header: 'Severidad Residual',
                class: 'text-center tdsmall',
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center tdsmall',
                colspan: "1",
                placeholder: ''
            },

            //PLAN ACCON
            {
                field: 'idEstrategiaResp',
                header: 'Estrategia de Respuesta',
                class: 'text-center tdlarge',
                ordenadmiento: 'idEstrategiaResp',
                colspan: "2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código del Plan de acción',
                class: 'text-center tdsmall',
                ordenadmiento: 'codPlanAccion',
                colspan: "1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'desPlanAccion',
                header: 'Descripción del Plan de acción',
                class: 'text-center tdzlarge',
                ordenadmiento: 'desPlanAccion',
                colspan: "3",
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'idAreaPlanAccion',
                header: 'Área a la que pertenece el responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                ordenadmiento: 'idAreaPlanAccion',
                colspan: "2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'idResponsablePlanAccion',
                header: ' Responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                ordenadmiento: 'idResponsablePlanAccion',
                colspan: "2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaInicioPlanAccion',
                header: 'Inicio de Plan de Acción',
                class: 'text-center tdlarge',
                ordenadmiento: 'fechaInicioPlanAccion',
                colspan: "2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'estadoPlanAccion',
                header: 'Estado de Plan de Acción',
                class: 'text-center tdlarge',
                ordenadmiento: 'estadoPlanAccion',
                colspan: "2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaFinPlanAccion',
                header: 'Fin del plan de acción',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fechaFinPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'evidenciaPlanAccion',
                header: 'Sustento de Plan de Acción',
                class: 'text-center tdlarge',
                ordenadmiento: 'evidenciaPlanAccion',
                headerClass: 'text-center tdlarge',
                colspan: "2"
            },

            //Verificacion eficacia
            {
                field: 'fechaPrevista',
                header: 'Fecha Prevista',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fechaPrevista',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'fueEficaz',
                header: '¿El plan de acción fue eficaz?',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fueEficaz',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'fechaVerificacion',
                header: 'Fecha de verificación',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'fechaVerificacion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'verificadoPor',
                header: 'Verificado Por',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'verificadoPor',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'evidenciaEficacia',
                header: 'Evidencia',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'evidenciaEficacia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'observaciones',
                header: 'Observaciones',
                class: 'text-center tdzlarge',
                colspan: "3",
                ordenadmiento: 'observaciones',
                headerClass: 'text-center tdzlarge'
            },

            {
                field: 'codkri',
                header: 'Código KRI',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'codkri',
                headerClass: 'text-center tdsmall'
            },

            {
                field: 'defKri',
                header: 'Definición del KRI',
                class: 'text-center tdzlarge',
                ordenadmiento: 'defKri',
                colspan: "3",
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'frecuencia',
                header: 'Frecuencia',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'frecuencia',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'metkri',
                header: 'Meta del KRI',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'metkri',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriActual',
                header: 'KRI Actual',
                class: 'text-center tdsmall',
                colspan: "1",
                ordenadmiento: 'kriActual',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'kriResponsable',
                header: 'Responsable de asegurar su cumplimiento',
                class: 'text-center tdlarge',
                colspan: "2",
                ordenadmiento: 'kriResponsable',
                headerClass: 'text-center tdlarge'
            },
        ];
    }



    obtenerListaEstadoPlanAccion() {

        this.matrizRiesgoService.obtenerEstadoPlanAccion().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEstadoPlanAccion = resp.listaParametros;


            }
        );

    }

    obtenerListaEficaciaPlanAccion() {

        this.matrizRiesgoService.obtenerEficazPlanAccion().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEficazPlanAccion = resp.listaParametros;


            }
        );

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

        // return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, idSede, this.idTipoMatrizSelect, idTipoMatriz).subscribe(
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

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_OPERACIONAL).subscribe(
            resp => {
                // @ts-ignore
                this.listaProcesos = resp.listaProceso.filter(proceso =>
                    proceso.indicadorBaja == this.indicadorBaja
                );

                if (this.editar || this.ver) {
                    for (let idProceso of this.idListaProceso) {
                        this.listaProcesos.forEach((proceso) => {
                            if (idProceso == proceso.idProceso) {
                                this.procesoList.push(proceso);
                            }
                        });
                    }
                    let uniqueProc = new Set(this.procesoList);
                    let ArrayProc = [...uniqueProc];
                    this.listaProcesosSelected = ArrayProc;
                } else {
                    this.listaProcesosSelected = this.listaProcesos;
                }

                for (var j = 0; j < this.matricesRiesgo.length; j++) {

                    this.matricesRiesgo[j].listaProcesos = this.listaProcesos;
                    this.cargarSubProcesos(this.matricesRiesgo[j].idProceso, j);
                    //console.log("ProcesosSel " + JSON.stringify(this.matricesRiesgo[j].listaProcesos));

                }

                //    this.listaGerencias =resp.listaGerencias;
                //console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
            });

    }

    cargarSubProcesos(idProceso, indice) {

        const idEmpresa = this.idEmpresa;
        const idSede = this.payload.data.datosSede.idSede;

        return this.matrizRiesgoService.obtenerSubProcesos(idProceso).subscribe(
            resp => {
                // @ts-ignore

                this.listaSubProcesosSelected = resp.listaSubProcesos.filter(subproceso =>
                    subproceso.indicadorBaja == this.indicadorBaja
                );

                this.matricesRiesgo[indice].listaSubProcesos = this.listaSubProcesosSelected;


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
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        this.formularioMatrizRiesgo.disable();

        var matrizRiesgo: MatrizRiesgo = {
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

        var control: MatrizRiesgo = new MatrizRiesgo();
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

        control.usuarioCreacion = usuarioCreacion;
        control.ipCreacion = ipCreacion;

        matrizRiesgo.listaDetalleMatriz.push(control);
        matrizRiesgo.listaProcesos = this.listaProcesos;

        this.matricesRiesgo.push(matrizRiesgo);

        this.matricesRiesgo = [...this.matricesRiesgo];

        this.activeImport = false;

        console.log("JSON IMPORT " + JSON.stringify(this.matricesRiesgo));

        this.cdr.detectChanges();
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
                if (this.editar || this.ver) {
                    for (let idGerencia of this.idListaGerencia) {
                        this.listaGerencias.forEach((gerencia) => {
                            if (idGerencia == gerencia.idGerencia) {
                                this.gerenciaList.push(gerencia);
                            }
                        });
                    }
                    let uniqueGer = new Set(this.gerenciaList);
                    let ArrayGer = [...uniqueGer];
                    this.listaGerenciasSel = ArrayGer;
                }
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
        /*this.showControl();
        this.matrizRiesgoTemp = matrizRiesgoTemp;
        this.ri = ri;*/
        console.log('abriendo dialog crear matriz');
        this.ref = this.dialogService.open(CreateRiesgoComponent, {

        });

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
                            control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                            control.idTipoMatriz = idTipoMatriz;
                            control.idSede = this.matrizRiesgoTemp.idSede;
                            control.deCartera = "";

                            control.codMatriz = this.matrizRiesgoTemp.codMatriz;
                            control.idMatrizNivel = idMatrizNivel;
                            control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                            control.idProceso = this.matrizRiesgoTemp.idProceso;
                            control.idSubProceso = this.matrizRiesgoTemp.idSubProceso;
                            control.deTitulo = this.matrizRiesgoTemp.deTitulo;
                            control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                            control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                            control.deProcesoImpactado = this.matrizRiesgoTemp.deProcesoImpactado;
                            control.deFoda = this.matrizRiesgoTemp.deFoda;
                            control.deGrupoInteres = this.matrizRiesgoTemp.deGrupoInteres;
                            control.idOrigenRiesgo = this.matrizRiesgoTemp.idOrigenRiesgo;
                            control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
                            control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;
                            control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
                            control.nuImpactoInherente = this.matrizRiesgoTemp.nuImpactoInherente;

                            const sev_riesgo = this.getProbabilidad(control.nuProbabilidadInherente, control.nuImpactoInherente);
                            control.nuPuntajeInherente = sev_riesgo;
                            control.deSeveridadInherente = this.obtener_severidad(control.nuProbabilidadInherente, control.nuImpactoInherente);

                            control.codControl = this.matrizRiesgoTemp.codControl;
                            control.deControl = this.matrizRiesgoTemp.deControl;
                            control.idAreaControl = this.matrizRiesgoTemp.idAreaControl;
                            control.idResponsableControl = this.matrizRiesgoTemp.idResponsableControl;
                            control.idFrecuenciaControl = this.matrizRiesgoTemp.idFrecuenciaControl;
                            control.idOportunidadControl = this.matrizRiesgoTemp.idOportunidadControl;
                            control.idAutomatizacionControl = this.matrizRiesgoTemp.idAutomatizacionControl;
                            control.deEvidenciaControl = this.matrizRiesgoTemp.deEvidenciaControl;

                            control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
                            control.nuImpactoResidual = this.matrizRiesgoTemp.nuImpactoResidual;
                            const sev_control = this.getProbabilidad(control.nuProbabilidadResidual, control.nuImpactoResidual);
                            control.nuPuntajeResidual = sev_control;
                            control.deSeveridadResidual = this.obtener_severidad(control.nuProbabilidadResidual, control.nuImpactoResidual);

                            control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
                            control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;
                            control.usuarioCreacion = usuarioCreacion;
                            control.ipCreacion = ipCreacion;

                            control.listaDetalleMatriz = [];

                            //    this.matricesRiesgo[j] = control;
                            this.matricesRiesgo.push(control);
                            if (this.matricesRiesgo[this.ri].listaDetalleMatriz != undefined) {
                                this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                            } else {
                                this.matricesRiesgo[this.ri].listaDetalleMatriz = [];
                                this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                            }

                            this.matricesRiesgo = [...this.matricesRiesgo];

                            //console.log("ADD MATRIZ "+this.ri);
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
                control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                control.idTipoMatriz = idTipoMatriz;
                control.idSede = this.matrizRiesgoTemp.idSede;
                control.deCartera = "";

                control.codMatriz = this.matrizRiesgoTemp.codMatriz;
                control.idMatrizNivel = idMatrizNivel;
                control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                control.idProceso = this.matrizRiesgoTemp.idProceso;
                control.idSubProceso = this.matrizRiesgoTemp.idSubProceso;
                control.deTitulo = this.matrizRiesgoTemp.deTitulo;
                control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                control.deProcesoImpactado = this.matrizRiesgoTemp.deProcesoImpactado;
                control.deFoda = this.matrizRiesgoTemp.deFoda;
                control.deGrupoInteres = this.matrizRiesgoTemp.deGrupoInteres;
                control.idOrigenRiesgo = this.matrizRiesgoTemp.idOrigenRiesgo;
                control.idFrecuenciaRiesgo = this.matrizRiesgoTemp.idFrecuenciaRiesgo;
                control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;
                control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
                control.nuImpactoInherente = this.matrizRiesgoTemp.nuImpactoInherente;

                const sev_riesgo = this.getProbabilidad(control.nuProbabilidadInherente, control.nuImpactoInherente);
                control.nuPuntajeInherente = sev_riesgo;
                control.deSeveridadInherente = this.obtener_severidad(control.nuProbabilidadInherente, control.nuImpactoInherente);

                control.codControl = this.matrizRiesgoTemp.codControl;
                control.deControl = this.matrizRiesgoTemp.deControl;
                control.idAreaControl = this.matrizRiesgoTemp.idAreaControl;
                control.idResponsableControl = this.matrizRiesgoTemp.idResponsableControl;
                control.idFrecuenciaControl = this.matrizRiesgoTemp.idFrecuenciaControl;
                control.idOportunidadControl = this.matrizRiesgoTemp.idOportunidadControl;
                control.idAutomatizacionControl = this.matrizRiesgoTemp.idAutomatizacionControl;
                control.deEvidenciaControl = this.matrizRiesgoTemp.deEvidenciaControl;

                control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
                control.nuImpactoResidual = this.matrizRiesgoTemp.nuImpactoResidual;
                const sev_control = this.getProbabilidad(control.nuProbabilidadResidual, control.nuImpactoResidual);
                control.nuPuntajeResidual = sev_control;
                control.deSeveridadResidual = this.obtener_severidad(control.nuProbabilidadResidual, control.nuImpactoResidual);

                control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
                control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;
                control.usuarioCreacion = usuarioCreacion;
                control.ipCreacion = ipCreacion;

                this.matricesRiesgo.push(control);

                if (this.matricesRiesgo[this.ri].listaDetalleMatriz != undefined) {
                    this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                } else {
                    this.matricesRiesgo[this.ri].listaDetalleMatriz = [];
                    this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                }
                this.matricesRiesgo = [...this.matricesRiesgo];

                console.log("Matriz " + this.ri);
            }
            this.DisplayControl = false;

        } else {
            this.DisplayControl = false;
        }


    }


    editarRegistro(matrizRiesgoTemp: MatrizRiesgo, idMatriz: number) {

        //   this.matrizRiesgoTemp=matrizRiesgoTemp;
        //   if (matrizRiesgoTemp.idMatrizRiesgo == idMatriz) {
        this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo] = { ...matrizRiesgoTemp };
        console.log("Matriz Edit " + JSON.stringify(matrizRiesgoTemp));
        //  }
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];

            if (this.idTipoMatrizSelect == TipoMatrizRiesgo.entidad) {
                for (var j = 0; j < this.matricesRiesgo.length; j++) {

                    var obj = new Object();
                    let idGerencia = this.matricesRiesgo[j]['idGerencia'];
                    obj['COD'] = this.matricesRiesgo[j]['codMatriz'];
                    obj['Nivel'] = this.obtenerDescIdMatrizNivel(this.matricesRiesgo[j]['idMatrizNivel']);
                    obj['Gerencia Responsable'] = this.obtenerDescIdGerencia(this.matricesRiesgo[j]['idGerencia']);
                    obj['Título'] = this.matricesRiesgo[j]['deTitulo'];
                    obj['Código del Riesgo'] = this.matricesRiesgo[j]['codRiesgo'];
                    obj['Descripción del Riesgo'] = this.matricesRiesgo[j]['deRiesgo'];
                    obj['Procesos Impactados'] = this.matricesRiesgo[j]['deProcesoImpactado'];
                    obj['FODA'] = this.matricesRiesgo[j]['deFoda'];
                    obj['Grupos de Interés'] = this.matricesRiesgo[j]['deGrupoInteres'];
                    obj['Origen'] = this.obtenerDescIdOrigenRiesgo(this.matricesRiesgo[j]['idOrigenRiesgo']);
                    obj['Frecuencia de Riesgo'] = this.obtenerDescIdFrecuenciaRiesgo(this.matricesRiesgo[j]['idFrecuenciaRiesgo']);
                    obj['Tipo de Riesgo'] = this.obtenerDescIdTipoRiesgo(this.matricesRiesgo[j]['idTipoRiesgo']);
                    obj['Probabilidad (1-4)'] = this.matricesRiesgo[j]['nuProbabilidadInherente'];
                    obj['Impacto (1-4)'] = this.matricesRiesgo[j]['nuImpactoInherente'];
                    obj['Severidad'] = this.matricesRiesgo[j]['nuPuntajeInherente'];
                    obj['Severidad Inherente'] = this.matricesRiesgo[j]['deSeveridadInherente'];
                    obj['Código Control'] = this.matricesRiesgo[j]['codControl'];
                    obj['Descripción del Control'] = this.matricesRiesgo[j]['deControl'];
                    obj['Area a la que pertenece el responsable del Control'] = this.matricesRiesgo[j]['idAreaControl'];
                    obj['Responsable del Control'] = this.matricesRiesgo[j]['idResponsableControl'];
                    obj['Frecuencia del Control'] = this.obtenerDescIdFrecuenciaControl(this.matricesRiesgo[j]['idFrecuenciaControl']);
                    obj['Oportunidad del Control'] = this.obtenerDescIdOportunidadControl(this.matricesRiesgo[j]['idOportunidadControl']);
                    obj['Automatización del Control'] = this.obtenerDescIdAutomatizacionControl(this.matricesRiesgo[j]['idAutomatizacionControl']);
                    obj['Evidencia del Control'] = this.matricesRiesgo[j]['deEvidenciaControl'];
                    obj['Probabilidad (1-4) '] = this.matricesRiesgo[j]['nuProbabilidadResidual'];
                    obj['Impacto (1-4) '] = this.matricesRiesgo[j]['nuImpactoResidual'];
                    obj['Severidad '] = this.matricesRiesgo[j]['nuPuntajeResidual'];
                    obj['Severidad Residual'] = this.matricesRiesgo[j]['deSeveridadResidual'];
                    obj['Estrategia de Respuesta'] = this.obtenerDescIdEstrategiaRespuesta(this.matricesRiesgo[j]['idEstrategiaResp']);
                    obj['Código del Plan de Acción'] = this.matricesRiesgo[j]['codPlanAccion'];
                    obj['Descripción del Plan de Acción'] = this.matricesRiesgo[j]['desPlanAccion'];
                    obj['Área a la que pertenece el responsable de realizar el plan de acción'] = this.matricesRiesgo[j]['idAreaPlanAccion'];
                    obj['Responsable de realizar el plan de acción'] = this.matricesRiesgo[j]['idResponsablePlanAccion'];
                    obj['Inicio de Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['fechaInicioPlanAccion']);
                    obj['Estado de plan de acción'] = this.obtenerDescIdEstadoPlanAccion(this.matricesRiesgo[j]['estadoPlanAccion']);
                    obj['Fin Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['fechaFinPlanAccion']);
                    obj['Evidencia de Plan de Acción'] = this.matricesRiesgo[j]['evidenciaPlanAccion'];
                    obj['Fecha Prevista'] = this.invertirFecha(this.matricesRiesgo[j]['fechaPrevista']);
                    obj['¿El plan de acción fue eficaz?'] = this.obtenerDescIdAccionEficaz(this.matricesRiesgo[j]['fueEficaz']);
                    obj['Fecha Verificacion'] = this.invertirFecha(this.matricesRiesgo[j]['fechaVerificacion']);
                    obj['Verificado por'] = this.matricesRiesgo[j]['verificadoPor'];
                    obj['Evidencia'] = this.matricesRiesgo[j]['evidenciaEficacia'];
                    obj['Observaciones'] = this.matricesRiesgo[j]['observaciones'];
                    obj['Código KRI'] = this.matricesRiesgo[j]['codkri'];
                    obj['Definición del KRI'] = this.matricesRiesgo[j]['defKri'];
                    obj['Frecuencia'] = this.matricesRiesgo[j]['frecuencia'];
                    obj['Meta del KRI'] = this.matricesRiesgo[j]['metkri'];
                    obj['KRI Actual'] = this.matricesRiesgo[j]['kriActual'];
                    obj['Responsable de asegurar su cumplimiento'] = this.matricesRiesgo[j]['kriResponsable'];


                    lista.push(obj);
                }

                var worksheet = xlsx.utils.aoa_to_sheet([["DATOS GENERALES DEL RIESGO", "", "", "", "", "", "", "", "", "", "", "",
                    "EVALUACIÓN DE RIEGO INHERENTE", "", "", "",
                    "CONTROL", "", "", "", "", "", "", "",
                    "EVALUACIÓN DE RIESGO RESIDUAL", "", "", "",
                    "PLAN DE ACCIÓN", "", "", "", "", "", "", "", "",
                    "VERIFICACIÓN DE EFICACIA", "", "", "", "", "",
                    "INDICADORES", "", "", "", "", ""]]);
                xlsx.utils.sheet_add_json(worksheet, lista, { origin: 1, skipHeader: false });

                if (!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
                    { s: { r: 0, c: 12 }, e: { r: 0, c: 15 } },
                    { s: { r: 0, c: 16 }, e: { r: 0, c: 23 } },
                    { s: { r: 0, c: 24 }, e: { r: 0, c: 27 } },
                    { s: { r: 0, c: 28 }, e: { r: 0, c: 36 } },
                    { s: { r: 0, c: 37 }, e: { r: 0, c: 42 } },
                    { s: { r: 0, c: 43 }, e: { r: 0, c: 48 } },);


                const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
                const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                this.saveAsExcelFile(excelBuffer, 'MatrizRiesgoEntidad');


            }
            if (this.idTipoMatrizSelect == TipoMatrizRiesgo.proceso) {
                for (var j = 0; j < this.matricesRiesgo.length; j++) {

                    var obj = new Object();
                    let idGerencia = this.matricesRiesgo[j]['idGerencia'];
                    obj['COD'] = this.matricesRiesgo[j]['codMatriz'];
                    obj['Nivel'] = this.obtenerDescIdMatrizNivel(this.matricesRiesgo[j]['idMatrizNivel']);
                    obj['Gerencia Responsable'] = this.obtenerDescIdGerencia(this.matricesRiesgo[j]['idGerencia']);
                    obj['Proceso'] = this.obtenerDescIdProceso(this.matricesRiesgo[j]['idProceso']);
                    obj['Subproceso'] = this.obtenerDescIdSubProceso(this.matricesRiesgo[j]['idSubProceso']);
                    obj['Código del Riesgo'] = this.matricesRiesgo[j]['codRiesgo'];
                    obj['Descripción del Riesgo'] = this.matricesRiesgo[j]['deRiesgo'];
                    obj['Origen del Riesgo'] = this.obtenerDescIdOrigenRiesgo(this.matricesRiesgo[j]['idOrigenRiesgo']);
                    obj['Frecuencia de Riesgo'] = this.obtenerDescIdFrecuenciaRiesgo(this.matricesRiesgo[j]['idFrecuenciaRiesgo']);
                    obj['Tipo de Riesgo'] = this.obtenerDescIdTipoRiesgo(this.matricesRiesgo[j]['idTipoRiesgo']);
                    obj['Probabilidad (1-4)'] = this.matricesRiesgo[j]['nuProbabilidadInherente'];
                    obj['Impacto (1-4)'] = this.matricesRiesgo[j]['nuImpactoInherente'];
                    obj['Severidad'] = this.matricesRiesgo[j]['nuPuntajeInherente'];
                    obj['Severidad Inherente'] = this.matricesRiesgo[j]['deSeveridadInherente'];
                    obj['Código Control'] = this.matricesRiesgo[j]['codControl'];
                    obj['Descripción del Control'] = this.matricesRiesgo[j]['deControl'];
                    obj['Area a la que pertenece el responsable del Control'] = this.matricesRiesgo[j]['idAreaControl'];
                    obj['Responsable del Control'] = this.matricesRiesgo[j]['idResponsableControl'];
                    obj['Frecuencia del Control'] = this.obtenerDescIdFrecuenciaControl(this.matricesRiesgo[j]['idFrecuenciaControl']);
                    obj['Oportunidad del Control'] = this.obtenerDescIdOportunidadControl(this.matricesRiesgo[j]['idOportunidadControl']);
                    obj['Automatización del Control'] = this.obtenerDescIdAutomatizacionControl(this.matricesRiesgo[j]['idAutomatizacionControl']);
                    obj['Evidencia del Control'] = this.matricesRiesgo[j]['deEvidenciaControl'];
                    obj['Probabilidad (1-4) '] = this.matricesRiesgo[j]['nuProbabilidadResidual'];
                    obj['Impacto (1-4) '] = this.matricesRiesgo[j]['nuImpactoResidual'];
                    obj['Severidad '] = this.matricesRiesgo[j]['nuPuntajeResidual'];
                    obj['Severidad Residual'] = this.matricesRiesgo[j]['deSeveridadResidual'];
                    obj['Estrategia de Respuesta'] = this.obtenerDescIdEstrategiaRespuesta(this.matricesRiesgo[j]['idEstrategiaResp']);
                    obj['Código del Plan de Acción'] = this.matricesRiesgo[j]['codPlanAccion'];
                    obj['Descripción del Plan de Acción'] = this.matricesRiesgo[j]['desPlanAccion'];
                    obj['Área a la que pertenece el responsable de realizar el plan de acción'] = this.matricesRiesgo[j]['idAreaPlanAccion'];
                    obj['Responsable de realizar el plan de acción'] = this.matricesRiesgo[j]['idResponsablePlanAccion'];
                    obj['Inicio de Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['fechaInicioPlanAccion']);
                    obj['Estado de plan de acción'] = this.obtenerDescIdEstadoPlanAccion(this.matricesRiesgo[j]['estadoPlanAccion']);
                    obj['Fin Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['fechaFinPlanAccion']);
                    obj['Evidencia de Plan de Accion'] = this.matricesRiesgo[j]['evidenciaPlanAccion'];
                    obj['Fecha Prevista'] = this.invertirFecha(this.matricesRiesgo[j]['fechaPrevista']);
                    obj['¿El plan de acción fue eficaz?'] = this.obtenerDescIdAccionEficaz(this.matricesRiesgo[j]['fueEficaz']);
                    obj['Fecha Verificacion'] = this.invertirFecha(this.matricesRiesgo[j]['fechaVerificacion']);
                    obj['Verificado por'] = this.matricesRiesgo[j]['verificadoPor'];
                    obj['Evidencia'] = this.matricesRiesgo[j]['evidenciaEficacia'];
                    obj['Observaciones'] = this.matricesRiesgo[j]['observaciones'];
                    obj['Código KRI'] = this.matricesRiesgo[j]['codkri'];
                    obj['Definición del KRI'] = this.matricesRiesgo[j]['defKri'];
                    obj['Frecuencia'] = this.matricesRiesgo[j]['frecuencia'];
                    obj['Meta del KRI'] = this.matricesRiesgo[j]['metkri'];
                    obj['KRI Actual'] = this.matricesRiesgo[j]['kriActual'];
                    obj['Responsable de asegurar su cumplimiento'] = this.matricesRiesgo[j]['kriResponsable'];


                    lista.push(obj);
                }

                var worksheet = xlsx.utils.aoa_to_sheet([["DATOS GENERALES DEL RIESGO", "", "", "", "", "", "", "", "", "",
                    "EVALUACIÓN DE RIEGO INHERENTE", "", "", "",
                    "CONTROL", "", "", "", "", "", "", "",
                    "EVALUACIÓN DE RIESGO RESIDUAL", "", "", "",
                    "PLAN DE ACCIÓN", "", "", "", "", "", "", "", "",
                    "VERIFICACIÓN DE EFICACIA", "", "", "", "", "",
                    "INDICADORES", "", "", "", "", ""]]);
                xlsx.utils.sheet_add_json(worksheet, lista, { origin: 1, skipHeader: false });

                if (!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
                    { s: { r: 0, c: 10 }, e: { r: 0, c: 13 } },
                    { s: { r: 0, c: 14 }, e: { r: 0, c: 21 } },
                    { s: { r: 0, c: 22 }, e: { r: 0, c: 25 } },
                    { s: { r: 0, c: 26 }, e: { r: 0, c: 34 } },
                    { s: { r: 0, c: 35 }, e: { r: 0, c: 40 } },
                    { s: { r: 0, c: 41 }, e: { r: 0, c: 46 } },);


                const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
                const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                this.saveAsExcelFile(excelBuffer, 'MatrizRiesgoProceso');
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

    invertirFecha(fechaAinvertir: string) {

        if (fechaAinvertir != undefined) {
            var fecha = fechaAinvertir.split('-', 3);
            var dia = fecha[2];
            var mes = fecha[1];
            var anio = fecha[0];
            return dia + "/" + mes + "/" + anio;
        }
    }

    obtenerDescIdMatrizNivel(idMatrizNivel: number) {
        let descIdMatrizNivel = "";
        for (var j = 0; j < this.listaTiposMatriz.length; j++) {
            if (this.listaTiposMatriz[j]['nombreParametro'] == idMatrizNivel) {
                descIdMatrizNivel = this.listaTiposMatriz[j]['deValor1'];
            }
        }
        return descIdMatrizNivel;
    }
    obtenerDescIdProceso(idProceso: number) {
        let descIdProceso = "";
        for (let lista of this.matricesRiesgo) {
            for (let proceso of lista.listaProcesos) {
                if (proceso.idProceso == idProceso) descIdProceso = proceso.deProceso;
            }
        }
        return descIdProceso;
    }

    obtenerDescIdSubProceso(idSubProceso: number) {
        let descIdSubProceso = "";
        for (let lista of this.matricesRiesgo) {
            for (let subProceso of lista.listaSubProcesos) {
                if (subProceso.idSubProceso == idSubProceso) descIdSubProceso = subProceso.deSubProceso;
            }
        }
        return descIdSubProceso;
    }

    obtenerDescIdOrigenRiesgo(idOrigenRiesgo: number) {
        let descIdOrigenRiesgo = "";
        for (let fila of this.listaOrigenRiesgo) {
            if (fila.idParametro == idOrigenRiesgo) descIdOrigenRiesgo = fila.nombreParametro;
        }
        return descIdOrigenRiesgo;
    }

    obtenerDescIdGerencia(idGerencia: number) {
        let descIdGerencia = "";
        for (let lista of this.listaGerencias) {
            if (lista.idGerencia == idGerencia) descIdGerencia = lista.descripcionGerencia
        }
        return descIdGerencia;
    }

    obtenerDescIdFrecuenciaRiesgo(idFrecuenciaRiesgo: number) {
        let descIdFrecuenciaRiesgo = "";
        for (let fila of this.listaFrecuenciaRiesgo) {
            if (fila.idParametro == idFrecuenciaRiesgo) descIdFrecuenciaRiesgo = fila.nombreParametro
        }
        return descIdFrecuenciaRiesgo;
    }

    obtenerDescIdTipoRiesgo(idTipoRiesgo: number) {
        let descIdTipoRiesgo = "";
        for (let fila of this.listaTipoRiesgo) {
            if (fila.idParametro == idTipoRiesgo) descIdTipoRiesgo = fila.nombreParametro
        }
        return descIdTipoRiesgo;
    }

    obtenerDescIdAreaControl(idAreaControl: number) {
        let descIdAreaControl = "";
        for (let fila of this.listaAreaResponsable) {
            if (fila.idParametro == idAreaControl) descIdAreaControl = fila.nombreParametro
        }
        return descIdAreaControl;
    }

    obtenerDescIdFrecuenciaControl(idFrecuenciaControl: number) {
        let descIdFrecuenciaControl = "";
        for (let fila of this.listaFrecuenciaControl) {
            if (fila.idParametro == idFrecuenciaControl) descIdFrecuenciaControl = fila.nombreParametro
        }
        return descIdFrecuenciaControl;
    }

    obtenerDescIdOportunidadControl(idOportunidadControl: number) {
        let descIdOportunidadControl = "";
        for (let fila of this.listaOportunidadControl) {
            if (fila.idParametro == idOportunidadControl) descIdOportunidadControl = fila.nombreParametro
        }
        return descIdOportunidadControl;
    }

    obtenerDescIdAutomatizacionControl(idAutomatizacionControl: number) {
        let descIdAutomatizacionControl = "";
        for (let fila of this.listaAutomatizacionControl) {
            if (fila.idParametro == idAutomatizacionControl) descIdAutomatizacionControl = fila.nombreParametro
        }
        return descIdAutomatizacionControl;
    }

    obtenerDescIdEstrategiaRespuesta(idEstrategiaResp: number) {
        let descIdEstrategiaResp = "";
        for (let fila of this.listaEstrategiaRespuesta) {
            if (fila.idParametro == idEstrategiaResp) descIdEstrategiaResp = fila.nombreParametro
        }
        return descIdEstrategiaResp;
    }

    obtenerDescIdResposablePlanAccion(idResponsablePlanAccion: number) {
        let descIdResponsablePlanAccion = "";
        for (let fila of this.listaResponsableControl) {
            if (fila.idParametro == idResponsablePlanAccion) descIdResponsablePlanAccion = fila.nombreParametro
        }
        return descIdResponsablePlanAccion;
    }

    obtenerDescIdEstadoPlanAccion(idEstadoPlanAccion: string) {
        let descIdEstadoPlanAccion = "";
        for (let fila of this.listaEstadoPlanAccion) {
            if (fila.idParametro == Number(idEstadoPlanAccion)) descIdEstadoPlanAccion = fila.nombreParametro
        }
        return descIdEstadoPlanAccion;
    }

    obtenerDescIdAccionEficaz(idFueEficaz: string) {
        let descIdEstadoPlanAccion = "";
        for (let fila of this.listaEficazPlanAccion) {
            if (fila.deValor1 == idFueEficaz) descIdEstadoPlanAccion = fila.nombreParametro;
        }
        return descIdEstadoPlanAccion;
    }

    obtenerDescIdResponsableAsegurarCumplimiento(idResponsableAsegurarCumplimiento: string) {
        let descIdEstadoPlanAccion = "";
        for (let fila of this.listaAreaResponsable) {
            if (fila.idParametro == Number(idResponsableAsegurarCumplimiento)) descIdEstadoPlanAccion = fila.nombreParametro
        }
        return descIdEstadoPlanAccion;
    }

    registrarMatrizRiesgo() {
        console.log("REG MATRIZ " + JSON.stringify(this.matricesRiesgo[0]));

        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const matrizNivel = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        // const idMatrizNivel = this.matricesRiesgo[0].idMatrizNivel;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.getIdMatrizNextVal();
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        var matrizRiesgo: MatrizRiesgo = {
            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
            idEmpresa: idEmpresa,
            idCartera: idCartera,
            idSede: idSede,
            idPeriodo: idPeriodo,
            idTipoMatriz: idTipoMatriz,
            matrizNivel: matrizNivel,
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
            Swal.fire("Debe de ingresar el detalle de la Matriz de Riesgo Operacional");

        } else {

            Swal.fire({
                title: '¿Está seguro de crear la Matriz de Riesgo Operacional?',
                showCancelButton: true,
                confirmButtonText: `Crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos creando la Matriz de Riesgo Operacional',
                        allowOutsideClick: () => !Swal.isLoading(),
                        allowEscapeKey: () => !Swal.isLoading()
                    });
                    Swal.showLoading();
                    this.matrizRiesgoService.registrarMatrizRiesgo(matrizRiesgo).subscribe(
                        resp => {
                            console.log(resp);
                            if (resp.idMatrizRiesgo !== 0) {
                                if (Swal.isLoading()) {
                                    Swal.close();
                                }
                                console.log("REG: MATRIZ " + JSON.stringify(resp));
                                Swal.fire('¡Creación exitosa!', "La Matriz de Riesgo Operacional se creó con éxito", 'success');
                                this.router.navigate(['/pages', 'main', 'transaccion', 'matrizRiesgo']);

                            } else {
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

        var matrizRiesgo: MatrizRiesgo = {
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
        for (var j = 0; j < this.matrizRiesgoEliminado.length; j++) {

            matrizRiesgo.listaDetalleMatriz.push(this.matrizRiesgoEliminado[j]);

        }

        Swal.fire({
            title: '¿Está seguro de actualizar la Matriz de Riesgo Operacional?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la Matriz de Riesgo Operacional',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.matrizRiesgoService.actualizarMatrizRiesgo(matrizRiesgo).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idMatrizRiesgo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            console.log("REG: MATRIZ " + JSON.stringify(resp));
                            Swal.fire('¡Actualización exitosa!', "La Matriz de Riesgo Operacional se actualizó con éxito", 'success');
                            this.router.navigate(['/pages', 'main', 'transaccion', 'matrizRiesgo']);

                        } else {
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
                this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[0].idParametro);
                // this.obtenerProcesosMatriz(this.listaTiposMatrizRiesgo[0].idParametro);
                //  this.formularioMatrizRiesgo.get('idMatrizNivel').disable();

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

    obtenerListaCantidadControl() {

        this.matrizRiesgoService.obtenerListaCantidadControl().subscribe(
            resp => {
                this.listaCantControl = resp.listaParametros;
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

    borrarRegistro(matrizRiesgoTemp: MatrizRiesgo, index: number) {

        //console.log(this.matricesRiesgo);

        if (matrizRiesgoTemp.idDetaMatrizRiesgo > 0) {

            matrizRiesgoTemp.indicadorBaja = '0';

            this.matrizRiesgoEliminado.push(matrizRiesgoTemp);

            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({ severity: 'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000 });

        } else {
            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({ severity: 'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000 });

        }

        this.matricesRiesgo = [...this.matricesRiesgo];
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

    onchangecod(limitfield, indice) {
        const codRiesgo = limitfield.target.value;
        var acceso = this;

        return this.matrizRiesgoService.obtenerDescripcion(codRiesgo).subscribe(
            resp => {
                // @ts-ignore
                var descripcion = resp.DetalleMatrizRiesgo.deRiesgo;
                this.matricesRiesgo[indice].deRiesgo = descripcion;

            });

    }

    findIndexById(matrizRiesgoTemp: MatrizRiesgo): number {
        let index = -1;


        if (matrizRiesgoTemp.idDetaMatrizRiesgo != null) {

            for (let i = 0; i < this.matricesRiesgo.length; i++) {
                if (this.matricesRiesgo[i].idDetaMatrizRiesgo === matrizRiesgoTemp.idDetaMatrizRiesgo) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    /*limit_number_prob_riesgo(limitfield,matrizTemp: MatrizRiesgo,indice){

        const valor:number = limitfield.target.value;
        //console.log("LIMIT "+valor);

        if (matrizTemp.idDetaMatrizRiesgo != null){
            indice = this.findIndexById(matrizTemp);
        }

        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuProbabilidadInherente = 4;

            const probabilidadRiesgo: number = 4;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherente;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadInherente = severidad;

            }


        }
        else{

            const probabilidadRiesgo: number = valor;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherente;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadInherente = severidad;

            }

        }

    }*/

    /*limit_number_impa_riesgo(limitfield,matrizTemp: MatrizRiesgo, indice){

        const valor:number = limitfield.target.value;
        //console.log("LIMIT "+valor);

        if (matrizTemp.idDetaMatrizRiesgo != null){
            indice = this.findIndexById(matrizTemp);
        }

        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuImpactoInherente = 4;

            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuProbabilidadInherente;
            const impactoRiesgo: number = 4;

            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

                this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadInherente = severidad;
            }
        }
        else{


            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuProbabilidadInherente;
            const impactoRiesgo: number = valor;

            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

                this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadInherente = severidad;
            }


        }



    }*/
    limit_number_prob_riesgo(event: any, matrizTemp: MatrizRiesgo, indice) {
        const valor: number = event.target.value;

        if (matrizTemp.idDetaMatrizRiesgo != null) {
            indice = this.findIndexById(matrizTemp);
        }

        this.matricesRiesgo[indice].nuProbabilidadInherente = valor === 0 ? null : valor;
        const probabilidadRiesgo: number = valor;
        const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpactoInherente;

        if (probabilidadRiesgo > 0 && impactoRiesgo > 0) {
            const calculo: number = probabilidadRiesgo * impactoRiesgo;
            const calculo_result: number = Number(calculo.toFixed(2));

            this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
            const severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
            this.matricesRiesgo[indice].deSeveridadInherente = severidad;

            this.copiarValoresRiesgoInherenteAlResidual(indice);
        } else {
            this.matricesRiesgo[indice].deSeveridadInherente = '';
            this.matricesRiesgo[indice].nuPuntajeInherente = null;
            this.matricesRiesgo[indice].nuPuntajeInherente = 0;
            this.matricesRiesgo[indice].nuPuntajeInherente = undefined;
        }
    }

    limit_number_impa_riesgo(event: any, matrizTemp: MatrizRiesgo, indice) {
        const valor: number = event.target.value;

        if (matrizTemp.idDetaMatrizRiesgo != null) {
            indice = this.findIndexById(matrizTemp);
        }

        this.matricesRiesgo[indice].nuImpactoInherente = valor === 0 ? null : valor;
        const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuProbabilidadInherente;
        const impactoRiesgo: number = valor;

        if (probabilidadRiesgo > 0 && impactoRiesgo > 0) {
            const calculo: number = probabilidadRiesgo * impactoRiesgo;
            const calculo_result: number = Number(calculo.toFixed(2));

            this.matricesRiesgo[indice].nuPuntajeInherente = calculo_result;
            const severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
            this.matricesRiesgo[indice].deSeveridadInherente = severidad;

            this.copiarValoresRiesgoInherenteAlResidual(indice);
        } else {
            this.matricesRiesgo[indice].deSeveridadInherente = '';
            this.matricesRiesgo[indice].nuPuntajeInherente = null;
            this.matricesRiesgo[indice].nuPuntajeInherente = 0;
            this.matricesRiesgo[indice].nuPuntajeInherente = undefined;
        }
    }

    validarYActualizar(event: Event) {
        event.preventDefault();
    
        const probabilidadInvalida = this.matricesRiesgo.some(matriz => 
            matriz.nuProbabilidadInherente === undefined || 
            matriz.nuProbabilidadInherente === null || 
            matriz.nuProbabilidadInherente == 0
        );
    
        const impactoInvalido = this.matricesRiesgo.some(matriz => 
            matriz.nuImpactoInherente === undefined || 
            matriz.nuImpactoInherente === null || 
            matriz.nuImpactoInherente == 0
        );
    
        if (probabilidadInvalida || impactoInvalido) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Debe completar ambos campos de Probabilidad e Impacto antes de actualizar. Ninguno puede ser 0.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }    
    
        this.actualizarMatrizRiesgo(); 
    }
    
    


    copiarValoresRiesgoInherenteAlResidual(indice: number) {
        this.matricesRiesgo[indice].nuProbabilidadResidual = this.matricesRiesgo[indice].nuProbabilidadInherente;
        this.matricesRiesgo[indice].nuImpactoResidual = this.matricesRiesgo[indice].nuImpactoInherente;
        this.matricesRiesgo[indice].nuPuntajeResidual = this.matricesRiesgo[indice].nuPuntajeInherente;
        this.matricesRiesgo[indice].deSeveridadResidual = this.matricesRiesgo[indice].deSeveridadInherente;
    }


    calcularPuntajeYSeveridadResidual(probabilidad: number, impacto: number, indice: number) {
        if (probabilidad > 0 && impacto > 0) {
            const puntajeResidual = probabilidad * impacto;
            this.matricesRiesgo[indice].nuPuntajeResidual = puntajeResidual;

            const severidad = this.obtener_severidad(probabilidad, impacto);
            this.matricesRiesgo[indice].deSeveridadResidual = severidad;
        }
    }

    validarProbabilidadImpactoResidual(event: any, indice: number, tipo: 'probabilidad' | 'impacto') {
        const valor = event.target.value;

        if (tipo === 'probabilidad') {
            const probabilidadInherente = this.matricesRiesgo[indice].nuProbabilidadInherente;
            if (valor > probabilidadInherente) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos inválidos',
                    text: 'La probabilidad residual no puede ser mayor que la probabilidad inherente',
                    confirmButtonText: 'Aceptar'
                });
                this.matricesRiesgo[indice].nuProbabilidadResidual = probabilidadInherente;
            } else {
                this.matricesRiesgo[indice].nuProbabilidadResidual = valor;
            }
        }

        if (tipo === 'impacto') {
            const impactoInherente = this.matricesRiesgo[indice].nuImpactoInherente;
            if (valor > impactoInherente) {
                alert('El impacto residual no puede ser mayor que el impacto inherente');
                this.matricesRiesgo[indice].nuImpactoResidual = impactoInherente;
            } else {
                this.matricesRiesgo[indice].nuImpactoResidual = valor;
            }
        }

        this.calcularPuntajeYSeveridadResidual(this.matricesRiesgo[indice].nuProbabilidadResidual, this.matricesRiesgo[indice].nuImpactoResidual, indice);
    }


    calcularRiesgoInherente(indice: number) {
        const probabilidadInherente = this.matricesRiesgo[indice].nuProbabilidadInherente;
        const impactoInherente = this.matricesRiesgo[indice].nuImpactoInherente;

        if (probabilidadInherente > 0 && impactoInherente > 0) {
            const puntajeInherente = probabilidadInherente * impactoInherente;
            this.matricesRiesgo[indice].nuPuntajeInherente = puntajeInherente;
            const severidadInherente = this.obtener_severidad(probabilidadInherente, impactoInherente);
            this.matricesRiesgo[indice].deSeveridadInherente = severidadInherente;

            this.copiarValoresRiesgoInherenteAlResidual(indice);
        }
    }

    limit_number_prob_control(limitfield, matrizTemp: MatrizRiesgo, indice) {

        const valor: number = limitfield.target.value;
        //console.log("LIMIT "+valor);

        if (matrizTemp.idDetaMatrizRiesgo != null) {
            indice = this.findIndexById(matrizTemp);
        }

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

    limit_number_impa_control(limitfield, matrizTemp: MatrizRiesgo, indice) {

        const valor: number = limitfield.target.value;
        //console.log("LIMIT "+valor);

        if (matrizTemp.idDetaMatrizRiesgo != null) {
            indice = this.findIndexById(matrizTemp);
        }

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

    obtener_severidad(proba: number, impa: number) {
        let severidad: string;

        if (proba < 2.5 && impa < 2.5) {
            if (proba >= 1.75 && impa >= 1.75) {
                severidad = "Moderado";
            } else {
                severidad = "Bajo";
            }
        } else if (proba >= 2.5 && impa < 2.5) {
            if (impa < 1.75) {
                severidad = "Moderado";
            } else {
                severidad = "Alto";
            }
        } else if (proba < 2.5 && impa >= 2.5) {
            if (proba < 1.75) {
                severidad = "Moderado";
            } else {
                severidad = "Alto";
            }
        } else if (proba >= 2.5 && impa >= 2.5) {
            if (proba < 3.25 && impa < 3.25) {
                severidad = "Alto";
            } else {
                severidad = "Extremo";
            }
        }

        return severidad;

        /*this.matrizRiesgoService.obtenerSeveridad(proba,impa).subscribe(
            (resp) => {

                console.log(resp.severidad);

                severidad = resp.severidad;

            }
        );*/


    }

    openDiagramRiesgoInherente() {


        this.probImpInherente[0] = this.matricesRiesgo[0].nuProbabilidadInherente;
        this.impInherente[0] = this.matricesRiesgo[0].nuImpactoInherente;
        let cartesianPoints: cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint: cartesianPoint = new Object();
            cartesianPoint.label = matriz.codRiesgo;
            cartesianPoint.x = matriz.nuProbabilidadInherente;
            cartesianPoint.y = matriz.nuImpactoInherente;
            cartesianPoints.push(cartesianPoint);
        });


        this.ref = this.dialogService.open(RiesgoInherenteComponent, {
            data: {
                x1: this.probImpInherente[0],
                x2: this.probImpInherente[1],
                y1: this.impInherente[0],
                y2: this.impInherente[1],
                cartesianPoints: cartesianPoints,
                label: 'Riesgo Inherente',
                labelx: 'Probabilidad',
                labely: 'Impacto'
            },
            // closable:false,
            header: 'Riesgo Inherente',
            //width: '67%',
            width: '50%',
            contentStyle: { "max-height": "700px", "max-width": "100%", "overflow": "auto" },
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((object: any) => {
            if (object) {
                this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: object });
            }
        });
    }

    openDiagramRiesgoResidual() {

        this.probImpResidual[0] = this.matricesRiesgo[0].nuProbabilidadResidual;
        this.ImpResidual[0] = this.matricesRiesgo[0].nuImpactoResidual;
        let cartesianPoints: cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint: cartesianPoint = new Object();
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
                cartesianPoints: cartesianPoints,
                label: 'Riesgo Residual',
                labelx: 'Probabilidad',
                labely: 'Impacto'
            },
            header: 'Riesgo Residual',
            //width: '67%',
            width: '50%',
            contentStyle: { "max-height": "700px", "max-width": "100%", "overflow": "auto" },
            baseZIndex: 10000
        });


        this.ref.onClose.subscribe((object: any) => {
            if (object) {
                this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: object });
            }
        });
    }

    obtenerMatrizPeriodo() {

        if (this.formularioMatrizRiesgo.invalid) {
            return Object.values(this.formularioMatrizRiesgo.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        Swal.fire({
            title: 'Cargando Matriz',
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();

        this.matrizRiesgoService.obtenerMatrizPeriodo(this.idEmpresa, MATRIZ_OPERACIONAL, this.idTipoMatriz).subscribe(
            resp => {


                this.matricesRiesgo = resp.DetalleMatrizRiesgo;

                /*for (var j = 0; j < resp.DetalleMatrizRiesgo.length; j++) {

                  this.matricesRiesgo.push(resp.DetalleMatrizRiesgo[j]);

                }*/

                if (this.idTipoMatriz == 1) {

                    this.cargarProcesos(this.idEmpresa, this.idTipoMatriz);

                }

                this.formularioMatrizRiesgo.disable();

                Swal.close();
            }
        );
    }

    onChangeExp1(evt) {

        if (this.formularioMatrizRiesgo.invalid) {
            this.file1.nativeElement.value = '';
            Swal.close();
            return Object.values(this.formularioMatrizRiesgo.controls).forEach(control => {
                control.markAsTouched();
            });

        }

        let data, header;
        const target: DataTransfer = <DataTransfer>(evt.target);
        this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx|.xlsm)/);
        if (this.isExcelFile) {
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                data = XLSX.utils.sheet_to_json(ws, { defval: "" });
            };

            reader.readAsBinaryString(target.files[0]);

            reader.onloadend = (e) => {

                this.keys = Object.keys(data[0]);

                if (this.idTipoMatriz == 0) {

                    if (this.keys.length != 48) {
                        this.file1.nativeElement.value = '';
                        Swal.fire("El archivo no coincide con el formato entidad", "", 'error');
                        return
                    } else {
                        this.formularioMatrizRiesgo.disable();
                        console.log('Aqui entidad');
                        Swal.fire({
                            title: 'Espere por favor',
                            html: 'Cargando datos',
                            allowOutsideClick: () => !Swal.isLoading(),
                            allowEscapeKey: () => !Swal.isLoading()
                        });
                        Swal.showLoading();

                        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
                        const idSede = this.formularioMatrizRiesgo.get('sede').value;
                        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
                        let file: File = evt.target.files[0];
                        let idTipo = this.idTipoMatriz.toString();

                        let form = new FormData();
                        form.append("file", file);
                        form.append("idEmpresa", idEmpresa);
                        form.append("idSede", idSede);
                        form.append("idPeriodo", idPeriodo);
                        form.append("idTipo", idTipo);

                        this.matrizRiesgoService.processFileMatrizRiesgo(form).subscribe(resp => {
                            Swal.close();
                            this.matricesRiesgo = resp['listado'];

                        });

                        this.activeImport = false;

                    }

                }
                else {
                    if (this.keys.length != 46) {
                        this.file1.nativeElement.value = '';
                        Swal.fire("El archivo no coincide con el formato proceso", "", 'error');
                        return
                    } else {
                        console.log('Aqui proceso');
                        this.formularioMatrizRiesgo.disable();

                        Swal.fire({
                            title: 'Espere por favor',
                            html: 'Cargando datos',
                            allowOutsideClick: () => !Swal.isLoading(),
                            allowEscapeKey: () => !Swal.isLoading()
                        });
                        Swal.showLoading();

                        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
                        const idSede = this.formularioMatrizRiesgo.get('sede').value;
                        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
                        let file: File = evt.target.files[0];
                        let idTipo = this.idTipoMatriz.toString();

                        let form = new FormData();
                        form.append("file", file);
                        form.append("idEmpresa", idEmpresa);
                        form.append("idSede", idSede);
                        form.append("idPeriodo", idPeriodo);
                        form.append("idTipo", idTipo);

                        this.matrizRiesgoService.processFileMatrizRiesgo(form).subscribe(resp => {
                            Swal.close();
                            this.matricesRiesgo = resp['listado'];

                        });

                        this.activeImport = false;

                    }

                }

            }


        } else {
            Swal.close();
            Swal.fire("El archivo no tiene la extensión adecuada", "", 'error');
            this.file1.nativeElement.value = '';
        }

    }

    onChangeExp(evt) {

        Swal.fire({
            title: 'Espere por favor',
            html: 'Cargando datos',
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();
        if (this.formularioMatrizRiesgo.invalid) {
            Swal.close();
            return Object.values(this.formularioMatrizRiesgo.controls).forEach(control => {
                control.markAsTouched();
            });

        }

        let data, header;
        const target: DataTransfer = <DataTransfer>(evt.target);
        this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx|.xlsm)/);
        if (this.isExcelFile) {
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                data = XLSX.utils.sheet_to_json(ws, { defval: "" });
            };

            reader.readAsBinaryString(target.files[0]);

            reader.onloadend = (e) => {

                this.keys = Object.keys(data[0]);
                console.log("JSON IMPORT " + JSON.stringify(data));
                this.dataSheet.next(data);
                Swal.close();

                if (this.idTipoMatriz == 0) {
                    this.feedJsonToTableEntidad(data);

                }
                else {
                    this.feedJsonToTableProceso(data);

                }

            }

            this.formularioMatrizRiesgo.disable();

        } else {
            Swal.close();
            Swal.fire("El archivo no tiene la extensión adecuada", "", 'error');
        }
    }

    feedJsonToTableEntidad(data) {

        this.keys = Object.keys(data[0]);

        if (this.keys.length != 48) {

            Swal.fire("El archivo no coincide con el formato entidad", "", 'error');
            return
        }
        //   console.log("JSON HEAD "+JSON.stringify(this.keys));
        data.forEach((matriz) => {

            let c1 = matriz[this.keys[0]];
            let c2 = matriz[this.keys[1]];
            let c3 = matriz[this.keys[2]];
            let c4 = matriz[this.keys[3]];
            let c5 = matriz[this.keys[4]];
            let c6 = matriz[this.keys[5]];
            let c7 = matriz[this.keys[6]];
            let c8 = matriz[this.keys[7]];
            let c9 = matriz[this.keys[8]];
            let c10 = matriz[this.keys[9]];
            let c11 = matriz[this.keys[10]];
            let c12 = matriz[this.keys[11]];

            let c13 = matriz[this.keys[12]];
            let c14 = matriz[this.keys[13]];
            let c15 = matriz[this.keys[14]];
            let c16 = matriz[this.keys[15]];
            let c17 = matriz[this.keys[16]];
            let c18 = matriz[this.keys[17]];
            let c19 = matriz[this.keys[18]];
            let c20 = matriz[this.keys[19]];
            let c21 = matriz[this.keys[20]];
            let c22 = matriz[this.keys[21]];
            let c23 = matriz[this.keys[22]];
            let c24 = matriz[this.keys[23]];

            let c25 = matriz[this.keys[24]];
            let c26 = matriz[this.keys[25]];
            let c27 = matriz[this.keys[26]];
            let c28 = matriz[this.keys[27]];
            let c29 = matriz[this.keys[28]];
            let c30 = matriz[this.keys[29]];
            let c31 = matriz[this.keys[30]];
            let c32 = matriz[this.keys[31]];
            let c33 = matriz[this.keys[32]];
            let c34 = matriz[this.keys[33]];
            let c35 = matriz[this.keys[34]];
            let c36 = matriz[this.keys[35]];

            let c37 = matriz[this.keys[36]];
            let c38 = matriz[this.keys[37]];
            let c39 = matriz[this.keys[38]];
            let c40 = matriz[this.keys[39]];
            let c41 = matriz[this.keys[40]];
            let c42 = matriz[this.keys[41]];

            let c43 = matriz[this.keys[42]];
            let c44 = matriz[this.keys[43]];
            let c45 = matriz[this.keys[44]];
            let c46 = matriz[this.keys[45]];
            let c47 = matriz[this.keys[46]];
            let c48 = matriz[this.keys[47]];

            let matriz_temp: MatrizRiesgo = new MatrizRiesgo();
            matriz_temp.idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
            matriz_temp.idSede = this.formularioMatrizRiesgo.get('sede').value;
            matriz_temp.idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
            matriz_temp.codMatriz = c1;
            matriz_temp.idMatrizNivel = this.getMatrizNivel(c2);
            matriz_temp.idGerencia = this.getGerencia(c3);
            matriz_temp.deTitulo = c4;
            matriz_temp.codRiesgo = c5;
            matriz_temp.deRiesgo = c6;

            matriz_temp.deProcesoImpactado = c7;
            matriz_temp.deFoda = c8;
            matriz_temp.deGrupoInteres = c9;
            matriz_temp.idOrigenRiesgo = this.getOrigen(c10);
            matriz_temp.idFrecuenciaRiesgo = this.getFrecuencia(c11);
            matriz_temp.idTipoRiesgo = this.getTipo(c12);
            matriz_temp.nuProbabilidadInherente = c13;
            matriz_temp.nuImpactoInherente = c14;
            matriz_temp.nuPuntajeInherente = c15;
            matriz_temp.deSeveridadInherente = c16;

            matriz_temp.codControl = c17;
            matriz_temp.deControl = c18;

            matriz_temp.idAreaControl = c19;
            matriz_temp.idResponsableControl = c20;

            matriz_temp.idFrecuenciaControl = this.getFrecuenciaId(c21);
            matriz_temp.idOportunidadControl = this.getOportunidad(c22);
            matriz_temp.idAutomatizacionControl = this.getAutomatizacion(c23);
            matriz_temp.deEvidenciaControl = c24;
            matriz_temp.nuProbabilidadResidual = c25;
            matriz_temp.nuImpactoResidual = c26;

            matriz_temp.nuPuntajeResidual = c27;
            matriz_temp.deSeveridadResidual = c28;
            matriz_temp.idEstrategiaResp = this.getEstrategia(c29);
            matriz_temp.codPlanAccion = c30;
            matriz_temp.desPlanAccion = c31;
            matriz_temp.idAreaPlanAccion = c32;
            matriz_temp.idResponsablePlanAccion = c33;
            var dateString = "10/23/2015"; // Oct 23
            var dateObject = new Date(dateString);

            matriz_temp.fechaInicioPlanAccion = this.convertFecha(c34);
            matriz_temp.estadoPlanAccion = this.getEstadoPlanAccion(c35);
            matriz_temp.fechaFinPlanAccion = this.convertFecha(c36);
            matriz_temp.fechaPrevista = this.convertFecha(c37);
            matriz_temp.fueEficaz = this.getFueEficaz(c38);


            matriz_temp.fechaVerificacion = this.convertFecha(c39);
            matriz_temp.verificadoPor = c40;
            matriz_temp.evidenciaEficacia = c41;

            matriz_temp.observaciones = c42;
            matriz_temp.codkri = c43;
            matriz_temp.defKri = c44;

            matriz_temp.frecuencia = c45;
            matriz_temp.metkri = c46;
            matriz_temp.kriActual = c47;
            matriz_temp.kriResponsable = c48;


            this.matricesRiesgo.push(matriz_temp);


        });

    }

    feedJsonToTableProceso(data) {

        this.keys = Object.keys(data[0]);

        console.log("longitud" + this.keys.length);

        if (this.keys.length != 46) {

            Swal.fire("El archivo no coincide con el formato proceso", "", 'error');
            return
        }

        //   console.log("JSON HEAD "+JSON.stringify(this.keys));
        data.forEach((matriz) => {

            let c1 = matriz[this.keys[0]];
            let c2 = matriz[this.keys[1]];
            let c3 = matriz[this.keys[2]];
            let c4 = matriz[this.keys[3]];
            let c5 = matriz[this.keys[4]];
            let c6 = matriz[this.keys[5]];
            let c7 = matriz[this.keys[6]];
            let c8 = matriz[this.keys[7]];
            let c9 = matriz[this.keys[8]];
            let c10 = matriz[this.keys[9]];
            let c11 = matriz[this.keys[10]];
            let c12 = matriz[this.keys[11]];
            let c13 = matriz[this.keys[12]];
            let c14 = matriz[this.keys[13]];
            let c15 = matriz[this.keys[14]];
            let c16 = matriz[this.keys[15]];
            let c17 = matriz[this.keys[16]];
            let c18 = matriz[this.keys[17]];
            let c19 = matriz[this.keys[18]];
            let c20 = matriz[this.keys[19]];
            let c21 = matriz[this.keys[20]];
            let c22 = matriz[this.keys[21]];
            let c23 = matriz[this.keys[22]];
            let c24 = matriz[this.keys[23]];
            let c25 = matriz[this.keys[24]];
            let c26 = matriz[this.keys[25]];
            let c27 = matriz[this.keys[26]];
            let c28 = matriz[this.keys[27]];
            let c29 = matriz[this.keys[28]];
            let c30 = matriz[this.keys[29]];
            let c31 = matriz[this.keys[30]];
            let c32 = matriz[this.keys[31]];
            let c33 = matriz[this.keys[32]];
            let c34 = matriz[this.keys[33]];
            let c35 = matriz[this.keys[34]];
            let c36 = matriz[this.keys[35]];
            let c37 = matriz[this.keys[36]];
            let c38 = matriz[this.keys[37]];
            let c39 = matriz[this.keys[38]];
            let c40 = matriz[this.keys[39]];
            let c41 = matriz[this.keys[40]];
            let c42 = matriz[this.keys[41]];
            let c43 = matriz[this.keys[42]];
            let c44 = matriz[this.keys[43]];
            let c45 = matriz[this.keys[44]];
            let c46 = matriz[this.keys[45]];

            let matriz_temp: MatrizRiesgo = new MatrizRiesgo();
            matriz_temp.idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
            matriz_temp.idSede = this.formularioMatrizRiesgo.get('sede').value;
            matriz_temp.idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
            matriz_temp.codMatriz = c1;
            matriz_temp.idMatrizNivel = this.getMatrizNivel(c2);
            matriz_temp.idGerencia = this.getGerencia(c3);
            matriz_temp.listaProcesos = this.listaProcesosSelected;
            matriz_temp.idProceso = this.getProceso(c4);

            this.matrizRiesgoService.obtenerSubProcesos(matriz_temp.idProceso).subscribe(
                resp => {
                    // @ts-ignore

                    this.listaSubProcesosSelected = resp.listaSubProcesos;
                    matriz_temp.listaSubProcesos = [];
                    matriz_temp.listaSubProcesos = resp.listaSubProcesos;
                    matriz_temp.idSubProceso = this.getSubProceso(c5);

                });
            matriz_temp.codRiesgo = c6;
            matriz_temp.deRiesgo = c7;
            matriz_temp.idOrigenRiesgo = this.getOrigen(c8);
            matriz_temp.idFrecuenciaRiesgo = this.getFrecuencia(c9);
            matriz_temp.idTipoRiesgo = this.getTipo(c10);
            matriz_temp.nuProbabilidadInherente = c11;
            matriz_temp.nuImpactoInherente = c12;
            matriz_temp.nuPuntajeInherente = c13;
            matriz_temp.deSeveridadInherente = c14;
            matriz_temp.codControl = c15;
            matriz_temp.deControl = c16;
            matriz_temp.idAreaControl = c17;
            matriz_temp.idResponsableControl = c18;
            matriz_temp.idFrecuenciaControl = this.getFrecuenciaId(c19);
            matriz_temp.idOportunidadControl = this.getOportunidad(c20);
            matriz_temp.idAutomatizacionControl = this.getAutomatizacion(c21);
            matriz_temp.deEvidenciaControl = c22;
            matriz_temp.nuProbabilidadResidual = c23;
            matriz_temp.nuImpactoResidual = c24;
            matriz_temp.nuPuntajeResidual = c25;
            matriz_temp.deSeveridadResidual = c26;
            matriz_temp.idEstrategiaResp = this.getEstrategia(c27);
            matriz_temp.codPlanAccion = c28;
            matriz_temp.desPlanAccion = c29;
            matriz_temp.idAreaPlanAccion = c30;
            matriz_temp.idResponsablePlanAccion = c31;
            matriz_temp.fechaInicioPlanAccion = this.convertFecha(c32);
            matriz_temp.estadoPlanAccion = this.getEstadoPlanAccion(c33);
            matriz_temp.fechaFinPlanAccion = this.convertFecha(c34);
            matriz_temp.fechaPrevista = this.convertFecha(c35);
            matriz_temp.fueEficaz = this.getFueEficaz(c36);


            matriz_temp.fechaVerificacion = this.convertFecha(c37);
            matriz_temp.verificadoPor = c38;
            matriz_temp.evidenciaEficacia = c39;

            matriz_temp.observaciones = c40;
            matriz_temp.codkri = c41;
            matriz_temp.defKri = c42;

            matriz_temp.frecuencia = c43;
            matriz_temp.metkri = c44;
            // console.log("POS 46 "+c46 +" mt "+matriz_temp.metKri+ " end");
            matriz_temp.kriActual = c45;
            matriz_temp.kriResponsable = c46;


            this.matricesRiesgo.push(matriz_temp);


        });

    }

    convertFecha(fecha: string) {

        // console.log("CHECK FECHA" + fecha);

        if (fecha != undefined) {
            if (this.checkFechaValid(fecha)) {
                var dateString = fecha;
                var dateParts = dateString.split("/");
                var dateObject = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
                return dateObject.toString();
            }
            else {
                // Swal.fire("Existe fecha con formato inválido", "", 'error');
                return;
            }
        }
    }


    getOrigen(origen_val: string): number {

        let idOrigen = 0;
        this.listaOrigenRiesgo.forEach((origen) => {
            if (origen_val == origen.nombreParametro) {
                idOrigen = origen.idParametro;
            }

        });
        return idOrigen;
    }


    getMatrizNivel(matrizNivel: string): number {

        let idMatrizNivel;
        this.listaTiposMatriz.forEach((matriz) => {
            if (matrizNivel == matriz.deValor1) {
                idMatrizNivel = matriz.nombreParametro;
            }

        });
        return idMatrizNivel;
    }

    getProceso(proceso_val: string): number {

        let idProceso = 0;
        this.listaProcesosSelected.forEach((proceso) => {
            if (proceso_val == proceso.deProceso) {
                idProceso = proceso.idProceso;
            }

        });
        return idProceso;
    }

    getSubProceso(subproceso_val: string): number {

        let idSubProceso = 0;
        this.listaSubProcesosSelected.forEach((subproceso) => {
            if (subproceso_val == subproceso.deSubProceso) {
                idSubProceso = subproceso.idSubProceso;
            }

        });
        return idSubProceso;
    }

    getGerencia(gerencia_val: string): number {

        let idGerencia = 0;
        this.listaGerencias.forEach((gerencia) => {
            if (gerencia_val == gerencia.descripcionGerencia) {
                idGerencia = gerencia.idGerencia;
            }

        });
        return idGerencia;
    }

    getFrecuencia(frecuencia_val: string): number {

        let idFrecuencia = 0;
        this.listaFrecuenciaRiesgo.forEach((frecuencia) => {
            if (frecuencia_val == frecuencia.nombreParametro) {
                idFrecuencia = frecuencia.idParametro;
            }

        });
        return idFrecuencia;
    }

    getTipo(tipo_val: string): number {

        let idTipo = 0;
        this.listaTipoRiesgo.forEach((tipo) => {
            if (tipo_val == tipo.nombreParametro) {
                idTipo = tipo.idParametro;
            }

        });
        return idTipo;
    }

    getResponsable(responsable_val: string): number {

        let idResponsable = 0;
        this.listaAreaResponsable.forEach((responsable) => {
            if (responsable_val == responsable.nombreParametro) {
                idResponsable = responsable.idParametro;
            }

        });
        return idResponsable;
    }

    getResponsableKri(responsable_val: string): string {

        let idResponsable = "0";
        this.listaAreaResponsable.forEach((responsable) => {
            if (responsable_val == responsable.nombreParametro) {
                idResponsable = responsable.idParametro.toString();
            }

        });
        return idResponsable;
    }

    getEstrategia(estrategia_val: string): number {
        let idEstrategia = 0;
        this.listaEstrategiaRespuesta.forEach((estrategia) => {
            if (estrategia_val == estrategia.nombreParametro) {
                idEstrategia = estrategia.idParametro;
            }

        });
        return idEstrategia;
    }

    getFrecuenciaId(frecuencia_val: string): number {

        let idFrecuencia = 0;
        this.listaFrecuenciaControl.forEach((frecuencia) => {
            if (frecuencia_val == frecuencia.nombreParametro) {
                idFrecuencia = frecuencia.idParametro;
            }

        });
        return idFrecuencia;
    }

    getOportunidad(oportunidad_val: string): number {

        let idOportunidad = 0;
        this.listaOportunidadControl.forEach((oportunidad) => {
            if (oportunidad_val == oportunidad.nombreParametro) {
                idOportunidad = oportunidad.idParametro;
            }

        });
        return idOportunidad;
    }



    getAutomatizacion(automatizacion_val: string): number {
        let idAutomatizacionControl = 0;
        this.listaAutomatizacionControl.forEach((automatizacion) => {
            if (automatizacion_val == automatizacion.nombreParametro) {
                idAutomatizacionControl = automatizacion.idParametro;
            }

        });
        return idAutomatizacionControl;
    }

    getEstadoPlanAccion(estado_val: string): string {
        let idEstadoPlanAccion = "";
        this.listaEstadoPlanAccion.forEach((estado) => {
            if (estado_val == estado.nombreParametro) {
                idEstadoPlanAccion = estado.idParametro.toString();
            }

        });
        return idEstadoPlanAccion;
    }



    getFueEficaz(eficaz_val: string): string {
        let idEficazPlanAccion = "";
        this.listaEficazPlanAccion.forEach((eficaz) => {
            if (eficaz_val == eficaz.nombreParametro) {
                idEficazPlanAccion = eficaz.deValor1.toString();
            }

        });
        return idEficazPlanAccion;

    }

    checkFechaValid(fecha) {

        let valid: boolean = true;
        try {
            var dateParts = fecha.split("/");
        } catch (error) {
            // Swal.fire("Existe fecha con formato inválido", "", 'error');
        }

        if (dateParts != null) {

            if (dateParts.length < 3) {
                valid = false;

            }
            else {
                valid = true;
            }


        }
        else {
            valid = false;
        }

        return valid;

    }

    onChangeFiltroGerencia(deviceValue) {
        this.gerenciaModel = deviceValue;

    }

    isEmpty(value: any): boolean {
        return value === null || value === undefined || value === '' || value === 0 || value === '0';
    }



    onChangeFiltroSeveridad(deviceValue) {
        this.gerenciaModel = deviceValue;

    }

    onChangeFiltroEstadoPlan(deviceValue) {
        this.estadoPlanModel = deviceValue;

    }

    onChangeFiltroProceso(deviceValue) {
        this.gerenciaModel = deviceValue;

    }

    get periodoNoValido(): boolean {
        return this.formularioMatrizRiesgo.get('periodo').invalid && this.formularioMatrizRiesgo.get('periodo').touched;
    }

    get sedeNoValido(): boolean {
        return this.formularioMatrizRiesgo.get('sede').invalid && this.formularioMatrizRiesgo.get('sede').touched;
    }

    get idTipoMatrizNoValido(): boolean {
        return this.formularioMatrizRiesgo.get('idTipoMatriz').invalid && this.formularioMatrizRiesgo.get('idTipoMatriz').touched;
    }


    openCargadeArchivosControl(dataRow: MatrizRiesgo, ri: number) {

        //const idMatrizRiesgo = 2;
        const idMatrizRiesgo = dataRow.idMatrizRiesgo;
        //const idDetaMatrizRiesgo = 4;
        const idDetaMatrizRiesgo = dataRow.idDetaMatrizRiesgo;
        const tipoEvidencia = TipoEvidencia.evidenciaControl;
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        if (dataRow.idDetaMatrizRiesgo != null) {
            ri = this.findIndexById(dataRow);
        }

        const modalRef = this.dialogService.open(SubirArchivosComponent, {

            data: {
                idMatrizRiesgo: idMatrizRiesgo,
                idDetaMatrizRiesgo: idDetaMatrizRiesgo,
                usuarioCreacion: usuarioCreacion,
                ipCreacion: ipCreacion,
                tipoEvidencia: tipoEvidencia
            },
            closable: true,
            header: 'Sustentos de Control',
            width: '700px',
            contentStyle: { "max-height": "700px", "max-width": "700px", "overflow": "auto" }
            //,baseZIndex: 10000

        });

        modalRef.onClose.subscribe((files: []) => {
            if (files.length > 0) {
                this.matricesRiesgo[ri].cantidadArchivosControlString = "Sustentos:" + files.length;
                //console.log("FILES "+files.length);
            }
            else {
                this.matricesRiesgo[ri].cantidadArchivosControlString = "Sustento";
            }
        });


    }

    openCargadeArchivosPlan(dataRow: MatrizRiesgo, ri: number) {

        //const idMatrizRiesgo = 2;
        const idMatrizRiesgo = dataRow.idMatrizRiesgo;
        //const idDetaMatrizRiesgo = 4;
        const idDetaMatrizRiesgo = dataRow.idDetaMatrizRiesgo;
        const tipoEvidencia = TipoEvidencia.evidenciaPlan;
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        if (dataRow.idDetaMatrizRiesgo != null) {
            ri = this.findIndexById(dataRow);
        }

        let modalref = this.dialogService.open(SubirArchivosComponent, {

            data: {
                idMatrizRiesgo: idMatrizRiesgo,
                idDetaMatrizRiesgo: idDetaMatrizRiesgo,
                usuarioCreacion: usuarioCreacion,
                ipCreacion: ipCreacion,
                tipoEvidencia: tipoEvidencia
            },
            closable: true,
            header: 'Sustentos de Plan de Acción',
            width: '700px',
            contentStyle: { "max-height": "700px", "max-width": "700px", "overflow": "auto" }
            //,baseZIndex: 10000

        });

        modalref.onClose.subscribe((files: []) => {
            if (files.length > 0) {
                this.matricesRiesgo[ri].cantidadArchivosPlanString = "Sustentos:" + files.length;
                //console.log("FILES "+files.length);
            }
            else {
                this.matricesRiesgo[ri].cantidadArchivosPlanString = "Sustento";
            }
        });


    }

    openComentarioAuditoria(dataRow: MatrizRiesgo, ri: number) {
        const idMatrizRiesgo = dataRow.idMatrizRiesgo;
        //const idDetaMatrizRiesgo = 4;
        const idDetaMatrizRiesgo = dataRow.idDetaMatrizRiesgo;

        this.ref = this.dialogService.open(ComentarioAuditoriaComponent, {

            data: {
                idMatrizRiesgo: idMatrizRiesgo,
                idDetaMatrizRiesgo: idDetaMatrizRiesgo,
                tipoMatrizGeneral: TipoMatriz.matrizRiesgoOperacional
            },
            header: 'Comentario de auditoria',
            width: '700px',
            contentStyle: { "max-height": "700px", "max-width": "700px", "overflow": "auto" }
            //,baseZIndex: 10000

        });
    }

    onClose(isVisible: boolean) {
        this.modalVisible = isVisible;
        this.modalVisible = true;
    }

    downloadFileProceso() {
        window.open('assets/imagenes/Matriz Riesgos operacional procesos.xlsm', '_parent');
    }

    downloadFileEntidad() {
        window.open('assets/imagenes/Matriz Riesgos operacional entidad.xlsm', '_parent');
    }

    obtenermetodoIP() {

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
                console.log(resp);
            }
        );
    }



}
