import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatrizRiesgo } from '../../../../../shared/models/matrizRiesgo';
import { Parametro } from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { MatrizContinuidadService } from './matriz-continuidad.service';
import { MessageService } from "primeng/api";
import { Empresa } from "../../../../../shared/models/empresa";
import { Sede } from "../../../../../shared/models/sede";
import { Periodo } from "../../../../../shared/models/periodo";
import { MatrizNivel } from "../../../../../shared/models/matrizNivel";
import {MATRIZ_CONTINUIDAD} from "../../../../../shared/Constantes";
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { Gerencia } from "../../../../../shared/models/gerencia";
import { Proceso } from "../../../../../shared/models/proceso";
import { SubProceso } from "../../../../../shared/models/subproceso";
import { of } from 'rxjs';
import { MatrizContinuidad } from 'src/app/shared/models/matrizContinuidad';
import {RiesgoInherenteComponent} from "../matrizContinuidad/riesgo-inherente/riesgo-inherente.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import { RiesgoResidualComponent } from '../matrizContinuidad/riesgo-residual/riesgo-residual.component';
import { cartesianPoint } from 'src/app/shared/models/cartesianPoint';
import {TipoMatrizRiesgo} from "../../../../../shared/models/tipoMatrizRiesgo";
import FileSaver from 'file-saver';
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";

@Component({
    selector: 'app-conf-registrar-matriz-riesgo',
    templateUrl: 'form-matriz-continuidad.component.html',
    providers: [DialogService],

    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})

export class FormMatrizContinuidadComponent implements OnInit {

    formularioMatrizRiesgo: FormGroup;
    matrizRiesgo: MatrizContinuidad;
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
    listaEfectividad: Parametro[];
    listaEstrategia: Parametro[];
    listaIndicador: Parametro[];
    listaEstadoPlanAccion: Parametro[];
    listaCantControl: Parametro[];

    listaTipos: Parametro[];
    editar: boolean;

    idEstado: string;
    idEmpresa: number;
    idCartera: number;
    idSede: number;
    idTipoMatriz: number;
    idTipoMatrizSelect: number = 0;
    indicadorBaja: number = 1;

    cols: any[];
    fijoCols: any[];
    matricesRiesgo: MatrizContinuidad[];
    matrizRiesgoEditar: MatrizContinuidad;
    matrizRiesgoTemporal: { [s: string]: MatrizContinuidad; } = {};
    payload: DataLogin;

    /*lista detalle matriz*/
    listaGerencias: Gerencia[];
    listaProcesos: Proceso[];
    listaSubProcesos: SubProceso[];

    listaProcesosSelected: Proceso[];
    listaSubProcesosSelected: SubProceso[];

    ref: DynamicDialogRef;
    SelectedCant = "";
    DisplayControl: boolean = false;
    matrizRiesgoTemp: MatrizContinuidad;
    ri: number = 0; //indice

    idMatrizContinuidad: number = 45;
    idTipoMatrizNivel: number = 1;

    probImpInherente: number[] = [];
    impInherente: number[] = [];
    probImpResidual: number[] = [];
    ImpResidual: number[] = [];
    matrizContEliminado: MatrizContinuidad[] = [];

    idPerfil: number;
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    tipoPerfilUsuario: TipoPerfil = TipoPerfil.user;
    notadmin:boolean;

    dataIp: string = "";

    constructor(public dialogService: DialogService,private authLoginService: AuthLoginService, private formBuilder: FormBuilder, private router: Router,
        private matrizRiesgoService: MatrizContinuidadService, private activatedRoute: ActivatedRoute,
        private messageService: MessageService) {
        this.crearFormulario();
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

        this.obtenerListaEfectividadControl();
        this.obtenerListaEstrategia();
        this.obtenerListaIndicador();
        this.obtenerListaEstadoPlanAccion();
        this.obtenerListaCantidadControl();
        this.listaGerencias = [{ idGerencia: 0, descripcionGerencia: 'Seleccione' }];
        this.listaProcesos = [{ idProceso: 0, deProceso: 'Seleccione' }];
        this.obtenermetodoIP();
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            if (params.idMatrizRiesgo) {
                this.loading = true;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.formularioMatrizRiesgo.disable();

            } else if(this.activatedRoute.snapshot.url[0].toString() === 'registrar'){
                this.editar = false;
                this.cargarListas();
                this.formularioMatrizRiesgo.enable();
                this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
                this.formularioMatrizRiesgo.get('sede').setValue(this.payload.data.datosSede.idSede);
                this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
                this.cargarProcesos(this.idEmpresa,0);
            }else {
                this.formularioMatrizRiesgo.disable();
                this.editar = false;
            }

        });

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
                field: 'codMatriz',
                header: 'COD',
                class: 'text-center tdsmall',
                ordenadmiento: 'codMatriz',
                headerClass: 'text-center tdsmall',
                styleClass: 'width: 10%',
                colspan:"1"
            },
            {
                field: 'idMatrizNivel',
                header: 'Nivel',
                class: 'text-center tdlarge',
                ordenadmiento: 'idMatrizNivel',
                headerClass: 'text-center tdlarge',
                colspan:"2",
                styleClass: 'width: 10%'
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center tdxlarge',
                ordenadmiento: 'idGerencia',
                colspan:"4",
                headerClass: 'text-center tdxlarge'
            },
            {
                field: 'idProceso',
                header: 'Proceso',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'idProceso',
                headerClass: 'text-center tdzlarge'
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
                header: 'Descripción de la amenaza(Riesgo)',
                class: 'text-center static-sticky-col1 tdzlarge',
                ordenadmiento: 'deRiesgo',
                colspan:"3",
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                placeholder: ""
            },
            {
                field: 'nuProbabilidadInherente',
                header: 'Probabilidad',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuProbabilidadInherente',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoInherente',
                header: 'Impacto',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpactoInherente',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'deSeveridadInherente',
                header: 'Nivel de Riesgo',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadInherente',
                headerClass: 'text-center tdsmall'
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                placeholder: "Descripción del Control"
            },
            {
                field: 'idEfecControl',
                header: 'Efectividad del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEfecControl',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'adicControl',
                header: 'Controles Adicionales',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'adicControl',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'nuProbabilidadResidual',
                header: 'Probabilidad',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuProbabilidadResidual',
                headerClass: 'text-center tdsmall'
            },

            {
                field: 'infraControl',
                header: 'Infraestructura / Equipos',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'infraControl',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'reHuControl',
                header: 'Recursos Humanos',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'reHuControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'reTiControl',
                header: 'Recursos TI',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'reTiControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'regVitalControl',
                header: 'Registros Vitales',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'regVitalControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'proveControl',
                header: 'Proveedores',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'proveControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'otrosControl',
                header: 'Otros',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'otrosControl',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpactoResidual',
                header: 'Impacto',
                colspan:"1",
                class: 'text-center tdsmall',
                ordenadmiento: 'nuImpactoResidual',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'deSeveridadResidual',
                header: 'Nivel de Riesgo',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadResidual',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'idEstrategiaPlan',
                header: 'Estrategia',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEstrategiaPlan',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código de Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'dePlanAccion',
                header: 'Descripción del Plan de Acción',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'dePlanAccion',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'idAreaPlanAccion',
                header: 'Área responsable del Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idAreaPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'idResPlanAccion',
                header: 'Responsable del Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idResPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'feIniPlanAccion',
                header: 'Inicio de Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feIniPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'idEstadoPlanAccion',
                header: 'Estado de Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEstadoPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'feFinPlanAccion',
                header: 'Fin de Plan de Acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feFinPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'comePlanAccion',
                header: 'Comentarios del área',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'comePlanAccion',
                headerClass: 'text-center tdzlarge'
            },
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
            this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
        }
    }

    public cargarMatrizRiesgo(): void {
        this.activatedRoute.params.subscribe(params => {
            const idMatrizRiesgo = params.idMatrizRiesgo;
            const idUsuario = this.payload.data.idUsuario;
            if (idMatrizRiesgo) {
                this.matrizRiesgoService.obtenerMatrizRiesgo(idMatrizRiesgo, idUsuario).subscribe(
                    resp => {
                        this.matrizRiesgo = resp.MatrizRiesgo;
                        this.idEmpresa = this.matrizRiesgo.idEmpresa;
                        this.obtenerEmpresa(this.idEmpresa);

                        // if (this.idEmpresa !== this.payload.data.datosEmpresa.idEmpresa){
                        //     this.obtenerListaSedes();
                        //     this.obtenerListaPeriodos();
                        // }

                        this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
                        this.formularioMatrizRiesgo.get('periodo').setValue(this.matrizRiesgo.idPeriodo);
                        this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.matrizRiesgo.idMatrizNivel);
                        this.formularioMatrizRiesgo.get('idTipoMatriz').setValue(this.matrizRiesgo.idTipoMatriz);
                        this.formularioMatrizRiesgo.get('idEstado').setValue(this.matrizRiesgo.indicadorBaja);
                        this.formularioMatrizRiesgo.get('periodo').disable();
                        this.formularioMatrizRiesgo.get('idTipoMatriz').disable();
                        this.formularioMatrizRiesgo.get('idMatrizNivel').disable();
                        this.idTipoMatriz = this.matrizRiesgo.idTipoMatriz;
                        this.idTipoMatrizSelect = this.matrizRiesgo.idMatrizNivel;

                        for (var j = 0; j < this.matrizRiesgo.listaDetalleMatrizContinuidad.length; j++) {

                            var orden = this.matricesRiesgo.length;
                            this.matrizRiesgo.listaDetalleMatrizContinuidad[j].ordenTabla = orden;
                            this.matricesRiesgo.push(this.matrizRiesgo.listaDetalleMatrizContinuidad[j]);

                        }

                        // this.obtenerListaMatriz();
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
            idMatrizNivel: ['', Validators.required],
            descripcionGerencia: [''],
            idEstado: '0'
        });
    }

    obtenerEmpresa(idEmpresa:number){

        this.matrizRiesgoService.obtenerEmpresa(idEmpresa).subscribe(
            resp => {

                this.formularioMatrizRiesgo.get('cartera').setValue(resp.Empresa.idCartera);

            }
        );
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
            this.listaTiposMatriz = resp.listaParametros;
            this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.idTipoMatrizNivel);
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

    obtenerListaEfectividadControl() {
        return this.matrizRiesgoService.obtenerListaEfectividadControl().subscribe(resp => {
            this.listaEfectividad = resp.listaParametros;
        });
    }

    obtenerListaEstrategia() {
        return this.matrizRiesgoService.obtenerListaEstrategia().subscribe(resp => {
            this.listaEstrategia = resp.listaParametros;
        });
    }

    obtenerListaEstadoPlanAccion() {

        this.matrizRiesgoService.obtenerEstadoPlanAccion().subscribe(
            resp => {
                this.listaEstadoPlanAccion = resp.listaParametros;

            }
        );

    }

    obtenerListaIndicador() {
        return this.matrizRiesgoService.obtenerListaIndicador().subscribe(resp => {
            this.listaIndicador = resp.listaParametros;
        });
    }

    obtenerListaCantidadControl() {

        this.matrizRiesgoService.obtenerListaCantidadControl().subscribe(
            resp => {
                this.listaCantControl = resp.listaParametros;
            }
        );

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

    onChangeProceso(event, indice) {

        const idproceso = event.target.value;
        const idSede = this.payload.data.datosSede.idSede;
        const idEmpresa = this.idEmpresa;

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

    // obtenerProcesosMatriz(idTipoMatriz) {


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

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_CONTINUIDAD).subscribe(
            resp => {
                // @ts-ignore
                this.listaProcesosSelected = resp.listaProceso.filter(proceso =>
                    proceso.indicadorBaja == this.indicadorBaja
                );

                for (var j = 0; j < this.matricesRiesgo.length; j++) {

                    this.matricesRiesgo[j].listaProcesos = this.listaProcesosSelected;

                }

                // this.cargarSubProcesos(idProceso);
                //  console.log("Gerencia1 "+JSON.stringify(resp));

                //    this.listaGerencias =resp.listaGerencias;
                // console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
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

                //    this.listaGerencias =resp.listaGerencias;

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
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const idControl = this.matricesRiesgo.length;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.getIdMatrizNextVal();
        console.log("AGREGANDO MATRIZ " + idMatrizRiesgo);
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        this.formularioMatrizRiesgo.disable();

        var matrizRiesgo: MatrizContinuidad = {
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
            listaDetalleMatrizContinuidad: []


        };

        var control: MatrizContinuidad = new MatrizContinuidad();
        control.ordenTabla = 0;
        control.idMatrizRiesgo = idMatrizRiesgo;

        control.idPeriodo = matrizRiesgo.idPeriodo;
        control.idProceso = matrizRiesgo.idProceso;
        control.idSubProceso = matrizRiesgo.idSubProceso;
        control.idEmpresa = matrizRiesgo.idEmpresa;
        control.deRiesgo = matrizRiesgo.deRiesgo;
        control.listaProcesos = matrizRiesgo.listaProcesos;
        control.listaSubProcesos = matrizRiesgo.listaSubProcesos;
        control.idCodigoControl = 0;
        control.idMatrizNivel = idMatrizNivel;
        control.deCartera = "";

        control.usuarioCreacion = usuarioCreacion;
        control.ipCreacion = ipCreacion;

        matrizRiesgo.listaDetalleMatrizContinuidad.push(control);
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

    replicarMatrices(matrizRiesgoTemp: MatrizContinuidad, ri: number) {
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
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const cantidad: number = Number(this.SelectedCant);
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idMatrizNivel').value;

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

                        }else {

                            var control: MatrizContinuidad = new MatrizContinuidad();
                            control.ordenTabla = j + 1;
                            control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;

                            control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
                            control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                            control.idMatrizNivel = idMatrizNivel;
                            control.idSede = this.matrizRiesgoTemp.idSede;
                            control.deCartera = "";

                            control.codMatriz = this.matrizRiesgoTemp.codMatriz;
                            control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                            control.idProceso = this.matrizRiesgoTemp.idProceso;
                            control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                            control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                            control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
                            // control.nuImpactoInherente = this.matrizRiesgoTemp.nuImpactoInherente;
                            // control.deSeveridadInherente = this.matrizRiesgoTemp.deSeveridadInherente;

                            control.codControl = this.matrizRiesgoTemp.codControl;
                            control.deControl = this.matrizRiesgoTemp.deControl;
                            control.idEfecControl = this.matrizRiesgoTemp.idEfecControl;
                            control.adicControl = this.matrizRiesgoTemp.adicControl;
                            control.infraControl = this.matrizRiesgoTemp.infraControl;
                            control.reHuControl = this.matrizRiesgoTemp.reHuControl;
                            control.reTiControl = this.matrizRiesgoTemp.reTiControl;
                            control.regVitalControl = this.matrizRiesgoTemp.regVitalControl;
                            control.proveControl = this.matrizRiesgoTemp.proveControl;
                            control.otrosControl = this.matrizRiesgoTemp.otrosControl;

                            control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
                            control.nuImpactoResidual = this.matrizRiesgoTemp.nuImpactoResidual;
                            control.deSeveridadResidual = this.matrizRiesgoTemp.deSeveridadResidual;


                            control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
                            control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;

                            this.matricesRiesgo.push(control);
                            if (this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad != undefined) {
                                this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad.push(control);
                            } else {
                                this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad = [];
                                this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad.push(control);
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

                var control: MatrizContinuidad = new MatrizContinuidad();
                orden++;
                control.ordenTabla = orden;

                control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;

                control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
                control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                control.idMatrizNivel = idMatrizNivel;
                control.idSede = this.matrizRiesgoTemp.idSede;
                control.deCartera = "";

                control.codMatriz = this.matrizRiesgoTemp.codMatriz;
                control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                control.idProceso = this.matrizRiesgoTemp.idProceso;
                control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                control.nuProbabilidadInherente = this.matrizRiesgoTemp.nuProbabilidadInherente;
                // control.nuImpactoInherente = this.matrizRiesgoTemp.nuImpactoInherente;
                // control.deSeveridadInherente = this.matrizRiesgoTemp.deSeveridadInherente;

                control.codControl = this.matrizRiesgoTemp.codControl;
                control.deControl = this.matrizRiesgoTemp.deControl;
                control.idEfecControl = this.matrizRiesgoTemp.idEfecControl;
                control.adicControl = this.matrizRiesgoTemp.adicControl;
                control.infraControl = this.matrizRiesgoTemp.infraControl;
                control.reHuControl = this.matrizRiesgoTemp.reHuControl;
                control.reTiControl = this.matrizRiesgoTemp.reTiControl;
                control.regVitalControl = this.matrizRiesgoTemp.regVitalControl;
                control.proveControl = this.matrizRiesgoTemp.proveControl;
                control.otrosControl = this.matrizRiesgoTemp.otrosControl;

                control.nuProbabilidadResidual = this.matrizRiesgoTemp.nuProbabilidadResidual;
                control.nuImpactoResidual = this.matrizRiesgoTemp.nuImpactoResidual;
                control.deSeveridadResidual = this.matrizRiesgoTemp.deSeveridadResidual;

                control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;
                control.listaSubProcesos = this.matrizRiesgoTemp.listaSubProcesos;

                this.matricesRiesgo.push(control);

                if (this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad != undefined) {
                    this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad.push(control);
                } else {
                    this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad = [];
                    this.matricesRiesgo[this.ri].listaDetalleMatrizContinuidad.push(control);
                }

                console.log("Matriz " + this.ri);
            }
            this.DisplayControl = false;

        } else {
            this.DisplayControl = false;
        }

        console.log("LONG " + this.matricesRiesgo[1].listaDetalleMatrizContinuidad.length);


    }


    editarRegistro(matrizRiesgoTemp: MatrizContinuidad, idMatriz: number) {

        //   this.matrizRiesgoTemp=matrizRiesgoTemp;
        //   if (matrizRiesgoTemp.idMatrizRiesgo == idMatriz) {
        this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo] = { ...matrizRiesgoTemp };
        console.log("Matriz Edit " + JSON.stringify(matrizRiesgoTemp));
        //  }
    }

    registrarMatrizRiesgo() {
        console.log("REG MATRIZ " + JSON.stringify(this.matricesRiesgo[0]));

        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.getIdMatrizNextVal();
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        var matrizRiesgo: MatrizContinuidad = {
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
            listaDetalleMatrizContinuidad: []


        };

        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatrizContinuidad.push(this.matricesRiesgo[j]);

        }

        if (matrizRiesgo.listaDetalleMatrizContinuidad.length == 0){
            Swal.fire("Debe de ingresar el detalle de la Matriz de Riesgo de Continuidad");

        } else{
            Swal.fire({
                title: '¿Está seguro de crear la Matriz de Riesgo de Continuidad?',
                showCancelButton: true,
                confirmButtonText: `crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos creando la Matriz de Riesgo de Continuidad',
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
                                Swal.fire('¡Creación exitosa!', "La Matriz de Riesgo de Continuidad se creó con éxito", 'success');
                                this.router.navigate(['/pages', 'main', 'transaccion', 'matrizContinuidad']);

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

        const idEmpresa = this.formularioMatrizRiesgo.get('empresa').value;
        const idCartera = this.formularioMatrizRiesgo.get('cartera').value;
        const idSede = this.formularioMatrizRiesgo.get('sede').value;
        const idPeriodo = this.formularioMatrizRiesgo.get('periodo').value;
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const indicadorBaja = this.formularioMatrizRiesgo.get('idEstado').value;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.matrizRiesgo.idMatrizRiesgo;
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        var matrizRiesgo: MatrizContinuidad = {
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
            listaDetalleMatrizContinuidad: []


        };


        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatrizContinuidad.push(this.matricesRiesgo[j]);

        }

        for (var j = 0; j < this.matrizContEliminado.length; j++) {

            matrizRiesgo.listaDetalleMatrizContinuidad.push(this.matrizContEliminado[j]);

        }

        console.log("EL JSON ACT " + JSON.stringify(matrizRiesgo));

        Swal.fire({
            title: '¿Está seguro de actualizar la Matriz de Riesgo de Continuidad?',
            showCancelButton: true,
            confirmButtonText: `Guardar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la Matriz de Riesgo de Continuidad',
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
                            Swal.fire('¡Actualización exitosa!', "La Matriz de Riesgo de Continuidad se actualizó con éxito", 'success');
                            this.router.navigate(['/pages', 'main', 'transaccion', 'matrizContinuidad']);

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
                this.listaTiposMatrizRiesgo = resp.listaParametros;
                this.formularioMatrizRiesgo.get('idTipoMatriz').setValue(this.idMatrizContinuidad);
                // this.obtenerProcesosMatriz(this.idMatrizContinuidad);

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

    cancelarEdicion(matrizRiesgoTemp: MatrizContinuidad, index: number) {

        console.log();
        this.matricesRiesgo[index] = this.matrizRiesgoTemp;
    }

    borrarRegistro(matrizRiesgoTemp: MatrizContinuidad, index: number) {

        if (matrizRiesgoTemp.idDetaMatrizContinuidad > 0 ){

            matrizRiesgoTemp.indicadorBaja = '0';

            this.matrizContEliminado.push(matrizRiesgoTemp);

            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }else {
            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }

        //this.matricesRiesgo.splice(index, 1);
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

            this.matricesRiesgo[indice].nuProbabilidadResidual = probabilidadRiesgo;

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

            this.matricesRiesgo[indice].nuProbabilidadResidual = probabilidadRiesgo;

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

        if (proba <= 2 && impa <= 2) {

            if (proba == 2 && impa == 2) {
                severidad = 'Moderado';
            }else{
                severidad = 'Bajo';
            }

        }else if (proba > 2 && impa <= 2) {

            if (proba > 2 && impa <= 1) {
                severidad = 'Moderado';
            }else{
                severidad = 'Alto';
            }

        }else if (proba <= 2 && impa > 2) {

            if (proba <= 1 && impa > 2) {
                severidad = 'Moderado';
            }else{
                severidad = 'Alto';
            }

        }else if (proba > 2 && impa > 2) {

            if (proba <= 3 && impa <= 3) {
                severidad = 'Alto';

            }else{
                severidad = 'Extremo';
            }

        }

        return severidad;
    }

    openDiagramRiesgoInherente() {

        this.probImpInherente[0]=this.matricesRiesgo[0].nuProbabilidadInherente;
        this.impInherente[0]=this.matricesRiesgo[0].nuImpactoInherente;
        let cartesianPoints:cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint:cartesianPoint=new Object();
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
                cartesianPoints:cartesianPoints,
                label: 'Riesgo Inherente',
                labelx: 'Probabilidad',
                labely: 'Impacto'
            },
            header: 'Riesgo Inherente',
            width: '800px',
            contentStyle: {"max-height": "800px", "max-width": "800px", "overflow": "auto"},
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
                labelx: 'Probabilidad',
                labely: 'Impacto'
            },
            header: 'Riesgo Residual',
            width: '800px',
            contentStyle: {"max-height": "800px", "max-width": "800px", "overflow": "auto"},
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((object: any) => {
            if (object) {
                this.messageService.add({severity: 'info', summary: 'Product Selected', detail: object});
            }
        });
    }


    get periodoNoValido(): boolean {
        return this.formularioMatrizRiesgo.get('periodo').invalid && this.formularioMatrizRiesgo.get('periodo').touched;
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {
            var lista = [];
            if(this.idTipoMatrizSelect== TipoMatrizRiesgo.entidad){}

            if(this.idTipoMatrizSelect==TipoMatrizRiesgo.proceso){
                for(var j=0;j<this.matricesRiesgo.length;j++){

                    var obj = new Object();
                    obj['COD'] =this.matricesRiesgo[j]['codMatriz'];
                    obj['Nivel'] =this.obtenerDescIdMatrizNivel(this.matricesRiesgo[j]['idMatrizNivel']);
                    obj['Gerencia Responsable'] = this.obtenerDescIdGerencia(this.matricesRiesgo[j]['idGerencia']);
                    obj['Proceso'] = this.obtenerDescIdProceso(this.matricesRiesgo[j]['idProceso']);
                    obj['Código del Riesgo'] =this.matricesRiesgo[j]['codRiesgo'];
                    obj['Descripción de la amenaza(Riesgo)'] =this.matricesRiesgo[j]['deRiesgo'];
                    obj['Probabilidad'] =this.matricesRiesgo[j]['nuProbabilidadInherente'];
                    obj['Impacto'] ="";
                    // obj['Impacto'] =this.matricesRiesgo[j]['nuImpactoInherente'];
                    obj['Nivel de Riesgo'] ="";
                    // obj['Nivel de Riesgo'] =this.matricesRiesgo[j]['deSeveridadInherente'];
                    obj['Código del control'] =this.matricesRiesgo[j]['codControl'];
                    obj['Descripción del control'] =this.matricesRiesgo[j]['deControl'];
                    obj['Efectividad del Control'] =this.obtenerDescIdEfeControl(this.matricesRiesgo[j]['idEfecControl']);
                    obj['Controles Adicionales'] =this.matricesRiesgo[j]['adicControl'];
                    obj['Probabilidad '] =this.matricesRiesgo[j]['nuProbabilidadResidual'];
                    obj['Infraestructura / Equipos'] =this.obtenerDescIdInfraestructura(this.matricesRiesgo[j]['infraControl']);
                    obj['Recursos Humanos'] =this.obtenerDescIdRecursos(this.matricesRiesgo[j]['reHuControl']);
                    obj['Recursos TI'] =this.obtenerDescIdTI(this.matricesRiesgo[j]['reTiControl']);
                    obj['Registros Vitales'] =this.obtenerDescIdRegistrosVit(this.matricesRiesgo[j]['regVitalControl']);
                    obj['Proveedores'] =this.obtenerDescIdProveedores(this.matricesRiesgo[j]['proveControl']);
                    obj['Otros'] =this.obtenerDescIdOtros(this.matricesRiesgo[j]['otrosControl']);
                    obj['Impacto '] =this.matricesRiesgo[j]['nuImpactoResidual'];
                    obj['Nivel de Riesgo '] =this.matricesRiesgo[j]['deSeveridadResidual'];
                    obj['Estrategia'] =this.obtenerDescIdEstrategia(this.matricesRiesgo[j]['idEstrategiaPlan']);
                    obj['Código de plan de Acción'] =this.matricesRiesgo[j]['codPlanAccion'];
                    obj['Descripción del plan de acción'] =this.matricesRiesgo[j]['dePlanAccion'];
                    obj['Área Responsable del Plan de Acción'] =this.matricesRiesgo[j]['idAreaPlanAccion'];
                    obj['Responsable del Plan de Acción'] =this.matricesRiesgo[j]['idResPlanAccion'];
                    obj['Inicio de Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['feIniPlanAccion']);
                    obj['Estado de Plan de Acción'] = this.obtenerDescIdEstadoPlan(this.matricesRiesgo[j]['idEstadoPlanAccion']);
                    obj['Fin Plan de Acción'] = this.invertirFecha(this.matricesRiesgo[j]['feFinPlanAccion']);
                    obj['Comentarios del área'] =this.matricesRiesgo[j]['comePlanAccion'];

                    lista.push(obj);

                }

                var worksheet = xlsx.utils.aoa_to_sheet([["DATOS GENERALES DE LA AMENAZA (RIESGO)","","","","","",
                    "EVALUACIÓN DE RIEGO INHERENTE","","",
                    "CONTROL","","","",
                    "EVALUACIÓN DE RIESGO RESIDUAL","","","","","","","","",
                    "PLAN DE ACCIÓN","","","","","","","",""]]);
                xlsx.utils.sheet_add_json(worksheet,lista,{origin:1,skipHeader: false});

                if(!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({s:{r:0,c:0},e:{r:0,c:5}},
                    {s:{r:0,c:6},e:{r:0,c:8}},
                    {s:{r:0,c:9},e:{r:0,c:12}},
                    {s:{r:0,c:13},e:{r:0,c:21}},
                    {s:{r:0,c:22},e:{r:0,c:30}},);


                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
                this.saveAsExcelFile(excelBuffer, 'MatrizContinuidad');
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

    obtenerDescIdProceso(idProceso:number){
        let descProceso="";
        for(let lista of this.matricesRiesgo){
            for(let Proceso of lista.listaProcesos){
                if(Proceso.idProceso == idProceso) descProceso=Proceso.deProceso;
            }
        }
        return descProceso;
    }

    obtenerDescIdEfeControl(idEfectividad:number){
        let valor="";
        for(let lista of this.listaEfectividad){
            if(lista.idParametro == idEfectividad) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdInfraestructura(idInfraestructura:string){
        let valor="";
        for(let lista of this.listaIndicador){
            if(lista.deValor1 == idInfraestructura) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdRecursos(idRecursos:string){
        let valor="";
        for(let lista of this.listaIndicador){
            if(lista.deValor1 == idRecursos) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdTI(idRecursosTI:string){
        let valor="";
        for(let lista of this.listaIndicador){
            if(lista.deValor1 == idRecursosTI) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdRegistrosVit(idRegistrosVit:string){
        let valor="";
        for(let lista of this.listaIndicador){
            if(lista.deValor1 == idRegistrosVit) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdProveedores(idControl:string){
        let valor="";
        for(let lista of this.listaIndicador){
            if(lista.deValor1 == idControl) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdOtros(idControl:string){
        let valor="";
        for(let lista of this.listaIndicador){
            if(lista.deValor1 == idControl) valor=lista.nombreParametro;
        }
        return valor;
    }

    obtenerDescIdEstrategia(idControl:number){
        let valor="";
        for(let lista of this.listaEstrategia){
            if(lista.idParametro == idControl) valor=lista.nombreParametro;
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

    obtenermetodoIP (){

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
                console.log(resp);
            }
        );
    }

}
