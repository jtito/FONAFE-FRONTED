import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatrizRiesgo} from '../../../../../shared/models/matrizRiesgo';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {MatrizEventoService} from './matriz-evento.service';
import {MessageService} from "primeng/api";
import {Empresa} from "../../../../../shared/models/empresa";
import {Sede} from "../../../../../shared/models/sede";
import {Periodo} from "../../../../../shared/models/periodo";
import {MatrizNivel} from "../../../../../shared/models/matrizNivel";
import {DataLogin} from 'src/app/shared/models/data';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {Gerencia} from "../../../../../shared/models/gerencia";
import {Proceso} from "../../../../../shared/models/proceso";
import {MatrizEvento} from "../../../../../shared/models/matrizEvento";
import {SubProceso} from "../../../../../shared/models/subproceso";
import { of } from 'rxjs';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { MATRIZ_EVENTO } from 'src/app/shared/Constantes';
import {TipoMatrizRiesgo} from "../../../../../shared/models/tipoMatrizRiesgo";
import FileSaver from 'file-saver';
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";

@Component({
    selector: 'app-conf-registrar-matriz-evento',
    templateUrl: 'form-matriz-evento.component.html',
    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})

export class FormMatrizEventoComponent implements OnInit {

    formularioMatrizRiesgo: FormGroup;
    matrizRiesgo: MatrizEvento;
    loading: boolean;
    listaEstados: Parametro[];
    listaEmpresas: Empresa[];
    listaCarteras: Parametro[];
    listaTiposMatriz = [];
    listaTiposMatrizRiesgo = [];
    listaSedes: Sede[];
    listaPeriodos: Periodo[];
    listaMatrizNivel: Parametro[];


    listaTipoRiesgo: Parametro[];
    listaAreaResponsable: Parametro[];
    listaResponsableControl: Parametro[];
    listaFrecuenciaControl: Parametro[];
    listaOportunidadControl: Parametro[];
    listaAutomatizacionControl: Parametro[];
    listaEstadoPlanAccion: Parametro[];
    listaEficazPlanAccion: Parametro[];
    listaTipos: Parametro[];

    listaEstadoEvento: Parametro[];
    listaCuentaConPlan: Parametro[];

    editar: boolean;

    idEstado: string;
    idEmpresa: number;
    idSede: number;
    idCartera: number;
    idTipoMatriz: number=83;
    idTipoMatrizSelect: number=0;
    indicadorBaja: number = 1;
    idTipoMatrizNivel: number = 1;

    cols: any[];
    fijoCols: any[];
    matricesRiesgo: MatrizEvento[];
    matrizRiesgoEditar: MatrizEvento;
    matrizRiesgoTemporal: { [s: string]: MatrizEvento; } = {};
    payload: DataLogin;

    /*lista detalle matriz*/
    listaGerencias: Gerencia[];
    listaProcesos: Proceso[];
    listaSubProcesos: SubProceso[];

    listaProcesosSelected: Proceso[];
    listaSubProcesosSelected: SubProceso[];


    SelectedCant = "";
    DisplayControl: boolean = false;
    DisplayAnexo1: boolean = false;
    DisplayAnexo2: boolean = false;
    matrizRiesgoTemp: MatrizEvento;
    ri: number = 0; //indice
    matrizEventoEliminado: MatrizEvento[] = [];

    idPerfil: number;
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    tipoPerfilUsuario: TipoPerfil = TipoPerfil.user;
    notadmin:boolean;

    dataIp: string = "";

    constructor(private authLoginService: AuthLoginService, private formBuilder: FormBuilder, private router: Router,
                private matrizRiesgoService: MatrizEventoService, private activatedRoute: ActivatedRoute,
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
  //      pdfDefaultOptions.assetsFolder = 'bleeding-edge';
        this.obtenerListaEstrategiaRespuesta();
        this.solvePermissions();

        this.obtenerListaTipoRiesgo();

        this.obtenerListaAreaResponsable();
        this.obtenerListaResponsableControl();
        this.obtenerListaFrecuenciaControl();
        this.obtenerListaOportunidadControl();
        this.obtenerListaAutomatizacionControl();
        this.obtenerListaEstadoPlanAccion();
        this.obtenerListaEficaciaPlanAccion();

        this.obtenerListaEstadoEvento();
        this.obtenerListaCuentaPlanAccion();


        this.listaGerencias = [{idGerencia: 0, descripcionGerencia: 'Seleccione'}];
        this.listaProcesos = [{idProceso: 0, deProceso: 'Seleccione'}];
        this.obtenermetodoIP();               

    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            if (params.idMatrizRiesgo) {
                this.loading = true;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar' ) {
                this.editar = true;
                this.formularioMatrizRiesgo.disable();
            }else if(this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                //  this.formularioMatrizRiesgo.disable();
                  this.cargarListas();
                  this.editar = false;
                  this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
                  this.formularioMatrizRiesgo.get('sede').setValue(this.payload.data.datosSede.idSede);
                  this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
        
            }
             else {
                this.formularioMatrizRiesgo.disable();
                this.editar = false;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.cargarProcesos(this.idEmpresa, this.idTipoMatriz);
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
                field: 'anio',
                header: 'Año',
                class: 'text-center tdsmall',
                ordenadmiento: 'anio',
                headerClass: 'text-center tdsmall',
                colspan:"1"
            },
            {
                field: 'trimestre',
                header: 'Trimestre',
                class: 'text-center tdsmall',
                ordenadmiento: 'trimestre',
                headerClass: 'text-center tdsmall',
                colspan:"1"
            },

            {
                field: 'codEvento',
                header: 'Código del Evento',
                class: 'text-center static-sticky-col tdlarge',
                ordenadmiento: 'codRiesgo',
                colspan:"2",
                headerClass: 'text-center static-sticky-col tdlarge'
            },
            {
                field: 'deEvento',
                header: 'Descripción del Evento',
                class: 'text-center static-sticky-col1 tdzlarge',
                ordenadmiento: 'deEvento',
                colspan:"3",
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                placeholder:"Descripción del Evento"
            },
            {
                field: 'idEstadoEvento',
                header: 'Estado del Evento',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEstadoEvento',
                headerClass: 'text-center tdlarge'

            },
            {
                field: 'feOcurrencia',
                header: 'Fecha de Ocurrencia o Detección',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feOcurrencia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'feMaterial',
                header: 'Fecha de materialización de la pérdida',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feMaterial',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'areaEvento',
                header: 'Area que origina el evento',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'areaEvento',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'tievento1',
                header: 'Tipo de Evento (Nivel 1)',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'tievento1',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'tievento2',
                header: 'Tipo de Evento (Nivel 2)',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'tievento2',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'causaEvento',
                header: 'Causa / Origen',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'causaEvento',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'cuentaContable',
                header: 'Cuenta Contable Asociada',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'cuentaContable',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'importePerdida',
                header: 'Importe total de la Pérdida S/.',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'importePerdida',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'interes',
                header: 'Intereses',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'interes',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'essalud',
                header: 'Otros',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'essalud',
                headerClass: 'text-center tdlarge',
                placeholder:""
            },
            {
                field: 'perdidaBruta',
                header: 'Pérdida Bruta',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'perdidaBruta',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'inPlanAccion',
                header: 'Cuenta con Plan Acción (Opcional)',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'inPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'dePlanAccion',
                header: 'Plan de Acción',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'dePlanAccion',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'comentario',
                header: 'Comentarios',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'comentario',
                headerClass: 'text-center tdzlarge'
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
            this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
        }
    }

    anexo1():void{
        this.DisplayAnexo1=true;
    }

    anexo2():void{
        this.DisplayAnexo2=true;
    }

    public cargarMatrizRiesgo(): void {
        this.activatedRoute.params.subscribe(params => {
            const idMatrizRiesgo = params.idMatrizRiesgo;
            const idUsuario = this.payload.data.idUsuario;
            if (idMatrizRiesgo) {
                this.matrizRiesgoService.obtenerMatrizRiesgo(idMatrizRiesgo, idUsuario).subscribe(
                    resp => {
                        //console.log("MATRIZ RIESGO " + JSON.stringify(resp));
                        this.matrizRiesgo = resp.MatrizRiesgo;

                        this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
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

                        for (var j = 0; j < this.matrizRiesgo.listaDetalleMatriz.length; j++) {

                            var orden = this.matricesRiesgo.length;
                            this.matrizRiesgo.listaDetalleMatriz[j].ordenTabla = orden;
                            this.matrizRiesgo.listaDetalleMatriz[j].listaDetalleMatriz = [];
                            this.matricesRiesgo.push(this.matrizRiesgo.listaDetalleMatriz[j]);

                        }

                        // this.obtenerProcesosMatriz()

                        this.cargarProcesos(this.idEmpresa, this.idTipoMatriz);

                        // this.obtenerListaMatriz();

                        this.formularioMatrizRiesgo.get('empresa').setValue(this.matrizRiesgo.idEmpresa);
                        this.formularioMatrizRiesgo.get('sede').setValue(this.matrizRiesgo.idSede);
                        this.formularioMatrizRiesgo.get('cartera').setValue(this.matrizRiesgo.idCartera);
                        this.idEmpresa= this.matrizRiesgo.idEmpresa;
                        this.idSede = this.matrizRiesgo.idSede;
                        this.obtenerListaSedes();
                        this.obtenerListaPeriodos();
                        this.obtenerListaGerencia();
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
            idMatrizRiesgo: ['', ],
            idMatrizNivel: ['', Validators.required],
            descripcionGerencia: [''],
            idEstado:'0'
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

    obtenerEmpresa(idEmpresa:number){

        this.matrizRiesgoService.obtenerEmpresa(idEmpresa).subscribe(
            resp => {

                this.formularioMatrizRiesgo.get('cartera').setValue(resp.Empresa.idCartera);

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
        this.idTipoMatriz = 83;
        var tipomatriz = "";
        this.idTipoMatrizSelect =  input.target.value;

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
                field: 'anio',
                header: 'Año',
                class: 'text-center',
                ordenadmiento: 'anio',
                headerClass: 'text-center'
            },
            {
                field: 'trimestre',
                header: 'Trimestre',
                class: 'text-center',
                ordenadmiento: 'trimestre',
                headerClass: 'text-center'
            },

            {
                field: 'codEvento',
                header: 'Código del Evento',
                class: 'text-center static-sticky-col',
                ordenadmiento: 'codRiesgo',
                headerClass: 'text-center static-sticky-col'
            },
            {
                field: 'deEvento',
                header: 'Descripción del Evento',
                class: 'text-center static-sticky-col1',
                ordenadmiento: 'deEvento',
                headerClass: 'text-center static-sticky-col1',
                placeholder:"Descripción del Evento"
            },
            {
                field: 'idEstadoEvento',
                header: 'Estado del Evento',
                class: 'text-center',
                ordenadmiento: 'idEstadoEvento',
                headerClass: 'text-center'

            },
            {
                field: 'feOcurrencia',
                header: 'Fecha de Ocurrencia',
                class: 'text-center',
                ordenadmiento: 'feOcurrencia',
                headerClass: 'text-center'
            },
            {
                field: 'feMaterial',
                header: 'Fecha de Materializacion',
                class: 'text-center',
                ordenadmiento: 'feMaterial',
                headerClass: 'text-center'
            },
            {
                field: 'areaEvento',
                header: 'Area del Evento',
                class: 'text-center',
                ordenadmiento: 'areaEvento',
                headerClass: 'text-center'
            },
            {
                field: 'tievento1',
                header: 'Tipo de Evento 1',
                class: 'text-center',
                ordenadmiento: 'tievento1',
                headerClass: 'text-center'
            },
            {
                field: 'tievento2',
                header: 'Tipo de Evento 2',
                class: 'text-center',
                ordenadmiento: 'tievento2',
                headerClass: 'text-center'
            },
            {
                field: 'causaEvento',
                header: 'Causa/Origen',
                class: 'text-center',
                ordenadmiento: 'causaEvento',
                headerClass: 'text-center'
            },
            {
                field: 'cuentaContable',
                header: 'Cuenta Contable Asociada',
                class: 'text-center',
                ordenadmiento: 'cuentaContable',
                headerClass: 'text-center'
            },
            {
                field: 'importePerdida',
                header: 'Importe Total Perdida S/.',
                class: 'text-center',
                ordenadmiento: 'importePerdida',
                headerClass: 'text-center'
            },

            {
                field: 'interes',
                header: 'Intereses',
                class: 'text-center',
                ordenadmiento: 'interes',
                headerClass: 'text-center'
            },
            {
                field: 'essalud',
                header: 'Otros',
                class: 'text-center',
                ordenadmiento: 'essalud',
                headerClass: 'text-center',
                placeholder:""
            },
            {
                field: 'perdidaBruta',
                header: 'Pérdida Bruta',
                class: 'text-center',
                ordenadmiento: 'perdidaBruta',
                headerClass: 'text-center'
            },
            {
                field: 'cuentaconPlanAccion',
                header: 'Cuenta con Plan Acción(Opcional)',
                class: 'text-center',
                ordenadmiento: 'cuentaconPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'dePlanAccion',
                header: 'Plan de Acción',
                class: 'text-center',
                ordenadmiento: 'dePlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'comentario',
                header: 'Comentarios',
                class: 'text-center',
                ordenadmiento: 'comentario',
                headerClass: 'text-center'
            }
        ];
    }

    showColumnasProcesos(): void {

        this.cols = [

            {
                field: 'anio',
                header: 'Año',
                class: 'text-center tdsmall',
                ordenadmiento: 'anio',
                headerClass: 'text-center tdsmall',
                colspan:"1"
            },
            {
                field: 'trimestre',
                header: 'Trimestre',
                class: 'text-center tdsmall',
                ordenadmiento: 'trimestre',
                headerClass: 'text-center tdsmall',
                colspan:"1"
            },

            {
                field: 'codEvento',
                header: 'Código del Evento',
                class: 'text-center static-sticky-col tdlarge',
                ordenadmiento: 'codRiesgo',
                colspan:"2",
                headerClass: 'text-center static-sticky-col tdlarge'
            },
            {
                field: 'deEvento',
                header: 'Descripción del Evento',
                class: 'text-center static-sticky-col1 tdzlarge',
                ordenadmiento: 'deEvento',
                colspan:"3",
                headerClass: 'text-center static-sticky-col1 tdzlarge',
                placeholder:"Descripción del Evento"
            },
            {
                field: 'idEstadoEvento',
                header: 'Estado del Evento',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEstadoEvento',
                headerClass: 'text-center tdlarge'

            },
            {
                field: 'feOcurrencia',
                header: 'Fecha de Ocurrencia o Detección',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feOcurrencia',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'feMaterial',
                header: 'Fecha de materialización de la pérdida',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feMaterial',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'areaEvento',
                header: 'Area que origina el evento',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'areaEvento',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'tievento1',
                header: 'Tipo de Evento (Nivel 1)',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'tievento1',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'tievento2',
                header: 'Tipo de Evento (Nivel 2)',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'tievento2',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'causaEvento',
                header: 'Causa / Origen',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'causaEvento',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'cuentaContable',
                header: 'Cuenta Contable Asociada',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'cuentaContable',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'importePerdida',
                header: 'Importe total de la Pérdida S/.',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'importePerdida',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'interes',
                header: 'Intereses',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'interes',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'essalud',
                header: 'Otros',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'essalud',
                headerClass: 'text-center tdlarge',
                placeholder:""
            },
            {
                field: 'perdidaBruta',
                header: 'Pérdida Bruta',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'perdidaBruta',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'inPlanAccion',
                header: 'Cuenta con Plan Acción (Opcional)',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'inPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'dePlanAccion',
                header: 'Plan de Acción',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'dePlanAccion',
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'comentario',
                header: 'Comentarios',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'comentario',
                headerClass: 'text-center tdzlarge'
            }
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

    obtenerListaEstadoEvento() {

        this.matrizRiesgoService.obtenerListaEstadoEvento().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEstadoEvento = resp.listaParametros;


            }
        );

    }

    obtenerListaCuentaPlanAccion() {

        this.matrizRiesgoService.obtenerListaCuentaPlanAccion().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaCuentaConPlan = resp.listaParametros;


            }
        );

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

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_EVENTO).subscribe(
            resp => {
                this.listaProcesosSelected = resp.listaProceso;
                //  console.log("Gerencia1 "+JSON.stringify(resp));

                //    this.listaGerencias =resp.listaGerencias;
                console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
            });

    }

    obtenerProcesosMatriz(){

        const idSede = this.payload.data.datosSede.idSede;
        const idEmpresa = this.payload.data.datosEmpresa.idEmpresa;

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_EVENTO).subscribe(
            resp => {
                this.listaProcesosSelected = resp.listaProceso;
                //  console.log("Gerencia1 "+JSON.stringify(resp));

                //    this.listaGerencias =resp.listaGerencias;

                this.listaProcesosSelected = resp.listaProceso.filter(proceso =>
                    proceso.indicadorBaja == this.indicadorBaja
                );

                for (var j = 0; j < this.matricesRiesgo.length; j++) {

                    this.matricesRiesgo[j].listaProcesos = this.listaProcesosSelected;
                    console.log("Procesos " + JSON.stringify(this.matricesRiesgo[j].listaProcesos));

                }

                console.log("Procesos seleccionados" + JSON.stringify(this.listaProcesosSelected));
            });

    }

    /*cargarProcesos(idEmpresa, idProceso) {

        // const idEmpresa = this.idEmpresa;
        const idSede = this.payload.data.datosSede.idSede;

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_EVENTO).subscribe(
            resp => {
                // @ts-ignore



                //    this.listaGerencias =resp.listaGerencias;
                console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
            });

    }*/

    cargarProcesos(idEmpresa, idProceso) {

        // const idEmpresa = this.idEmpresa;
        const idSede = this.payload.data.datosSede.idSede;

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_EVENTO).subscribe(
            resp => {
                // @ts-ignore
                this.listaProcesosSelected = resp.listaProceso.filter(proceso =>
                    proceso.indicadorBaja == this.indicadorBaja
                );

                for (var j = 0; j < this.matricesRiesgo.length; j++) {

                    this.matricesRiesgo[j].listaProcesos = this.listaProcesosSelected;
                    // console.log("ProcesosSel " + JSON.stringify(this.matricesRiesgo[j].listaProcesos));

                }

                // console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
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
        const ipCreacion =  this.dataIp; //"127.0.0.1";

        this.formularioMatrizRiesgo.disable();

        var matrizRiesgo: MatrizEvento = {

            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
            idEmpresa: idEmpresa,
            idCartera: idCartera,
            idSede: idSede,
            idPeriodo: idPeriodo,
            idTipoMatriz: idTipoMatriz,
            idGerencia: 0,
            listaProcesos: [],
            usuarioCreacion: usuarioCreacion,
            ipCreacion: ipCreacion,
            deCartera: "",
            idMatrizNivel: idMatrizNivel,
            listaDetalleMatriz:[]



        };

        var control: MatrizEvento = new MatrizEvento();
        control.ordenTabla = 0;
        control.idMatrizRiesgo = idMatrizRiesgo;

        control.idPeriodo = matrizRiesgo.idPeriodo;

        control.idEmpresa = matrizRiesgo.idEmpresa;


        control.deCartera = "";

        control.usuarioCreacion = usuarioCreacion;
        control.ipCreacion = ipCreacion;
        control.listaProcesos = matrizRiesgo.listaProcesos;
        // control.trimestre = "";
        // control.anio=2021;
        // control.areaEvento=0;
        // control.causaEvento="";
        // control.codEvento="";
        // control.comentario="";
        // control.cuentaContable="";
        // control.deEvento="";
        // control.idEstadoEvento=0,
        // control.feMaterial="";
        // control.feOcurrencia="";
        // control.areaEvento=0;
        // control.tievento1="";
        // control.tievento2="";
        // control.cuentaContable="";
        // control.importePerdida=0;
        // control.interes=0;
        // control.essalud=0;
        // control.perdidaBruta=0;
        // control.dePlanAccion="";
        // control.comentario="";

        matrizRiesgo.listaDetalleMatriz.push(control);

        matrizRiesgo.listaProcesos = this.listaProcesosSelected;

      //  console.log("La lista procesos a " + JSON.stringify(this.listaProcesosSelected));
      //  console.log("La lista procesos a agregar mat " + JSON.stringify(matrizRiesgo));
      //  console.log("La lista procesos a agregar " + JSON.stringify(matrizRiesgo.listaProcesos));
      //console.log("Matriz  " + JSON.stringify(matrizRiesgo));

        this.matricesRiesgo.push(matrizRiesgo);


    }

    getCorrelativoRiesgo(idRiesgo:number):string{

        var inicial:string = "R";
        var correlativo:string = idRiesgo.toString()+inicial+"0";

        return correlativo;

    }

    getCorrelativoControl(idRiesgo:number,idControl:number):string{

        var inicial:string = "C";
        var correlativo:string = idRiesgo.toString()+inicial+idControl;

        return correlativo;

    }

    getCorrelativoPlan(idRiesgo:number,idFraude:number):string{

        var inicial:string = "F";
        var correlativo:string = idRiesgo.toString()+inicial+idFraude;

        return correlativo;

    }


    getIdMatrizNextVal(): number {

        var nextid: number = 0;

        for (var j = 0; j < this.matricesRiesgo.length; j++) {


                nextid = this.matricesRiesgo[j].idMatrizRiesgo;
                console.log("NEXTID "+nextid);

        }
        nextid=nextid+1;


        return nextid;
    }

    getIdControlNextVal(idMatriz:number): number {

        var nextid: number = 0;

        for (var j = 0; j < this.matricesRiesgo.length; j++) {


            console.log("GET ID MATRIZ "+this.matricesRiesgo[j].idMatrizRiesgo +" idma "+idMatriz);
                if(this.matricesRiesgo[j].idMatrizRiesgo==idMatriz){

                }



        }
        nextid=nextid+1;
        console.log("GET ID MATRIZ N "+nextid);


        return nextid;
    }

    /* Lista select detalle */
    obtenerListaGerencia() {

        
        //   console.log("Sede "+JSON.stringify(this.payload.data));
        return this.matrizRiesgoService.obtenerListaGerencia(this.idEmpresa, this.idSede).subscribe(
            resp => {
                // @ts-ignore
                this.listaGerencias = resp.listaGerencias;
                //  console.log("Gerencia1 "+JSON.stringify(resp));

                //    this.listaGerencias =resp.listaGerencias;
                console.log("Gerencia 1 " + JSON.stringify(this.listaGerencias));
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



    replicarMatrices(matrizRiesgoTemp: MatrizEvento, ri: number) {
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

                            var control: MatrizEvento = new MatrizEvento();
                            control.ordenTabla = j + 1;
                            control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;

                            control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;

                            control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;

                            control.idMatrizNivel = idMatrizNivel;
                            control.idSede = this.matrizRiesgoTemp.idSede;
                            control.deCartera = "";
                            control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                            control.usuarioCreacion = usuarioCreacion;
                            control.ipCreacion = ipCreacion;
                            control.listaDetalleMatriz =[];
                            const codRiesgo = this.getCorrelativoRiesgo(this.matrizRiesgoTemp.idMatrizRiesgo);
                            const nextidControl = this.getIdControlNextVal(this.matrizRiesgoTemp.idMatrizRiesgo);
                            const codControl = this.getCorrelativoControl(this.matrizRiesgoTemp.idMatrizRiesgo,nextidControl);



                        //    this.matricesRiesgo[j] = control;
                            this.matricesRiesgo.push(control);
                            if (this.matricesRiesgo[this.ri].listaDetalleMatriz != undefined) {
                                this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                            } else {
                                this.matricesRiesgo[this.ri].listaDetalleMatriz = [];
                                this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                            }


                            console.log("ADD MATRIZ "+this.ri);
                        }

                        cant--;

                    }

                }
                else{
                //    this.matricesRiesgo[j].idCodigoControl = j;
                //    this.matricesRiesgo.push(control);
                //    cant--;
                }

            }

            for (var i = 0; i < cant; i++) {

                var control: MatrizEvento = new MatrizEvento();
                orden++;
                control.ordenTabla = orden;
                control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;

                control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;

                control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;

                control.idSede = this.matrizRiesgoTemp.idSede
                control.deCartera = "";
                control.idMatrizNivel = idMatrizNivel;
                control.idCodigoControl = j;
                control.usuarioCreacion = usuarioCreacion;
                control.ipCreacion = ipCreacion;
                control.idGerencia = this.matrizRiesgoTemp.idGerencia;
              control.listaDetalleMatriz =[];
                const codRiesgo = this.getCorrelativoRiesgo(this.matrizRiesgoTemp.idMatrizRiesgo);

                const nextidControl = this.getIdControlNextVal(this.matrizRiesgoTemp.idMatrizRiesgo);
                const codControl = this.getCorrelativoControl(this.matrizRiesgoTemp.idMatrizRiesgo,nextidControl);


                this.matricesRiesgo.push(control);

                if (this.matricesRiesgo[this.ri].listaDetalleMatriz != undefined) {
                    this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                } else {
                    this.matricesRiesgo[this.ri].listaDetalleMatriz = [];
                    this.matricesRiesgo[this.ri].listaDetalleMatriz.push(control);
                }

                console.log("Matriz "+this.ri);
            }
            this.DisplayControl = false;

        } else {
            this.DisplayControl = false;
        }

        console.log("LONG "+this.matricesRiesgo[1].listaDetalleMatriz.length);


    }


    editarRegistro(matrizRiesgoTemp: MatrizEvento, idMatriz: number) {

        //   this.matrizRiesgoTemp=matrizRiesgoTemp;
        //   if (matrizRiesgoTemp.idMatrizRiesgo == idMatriz) {
        this.matrizRiesgoTemporal[matrizRiesgoTemp.idMatrizRiesgo] = {...matrizRiesgoTemp};
        console.log("Matriz Edit " + JSON.stringify(matrizRiesgoTemp));
        //  }
    }

    registrarMatrizRiesgo() {
     //   console.log("REG MATRIZ " + JSON.stringify(this.matricesRiesgo[0]));

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

        var matrizRiesgo: MatrizEvento = {
            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
            idEmpresa: idEmpresa,
            idCartera: idCartera,
            idSede: idSede,
            idPeriodo: idPeriodo,
            idTipoMatriz: 83,
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

        console.log("REG MATRIZ1 " + JSON.stringify(matrizRiesgo));


        if (matrizRiesgo.listaDetalleMatriz.length == 0){
            Swal.fire("Debe de ingresar el detalle de la Matriz de Eventos de Pérdida");

        } else{

            Swal.fire({
                title: '¿Está seguro de crear la Matriz de Eventos de Pérdida?',
                showCancelButton: true,
                confirmButtonText: `Crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos creando la Matriz de Eventos de Pérdida',
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
                                Swal.fire('¡Creación exitosa!', "La Matriz de Eventos de Pérdida se creó con éxito", 'success');
                                this.router.navigate(['/pages', 'main', 'transaccion', 'matrizEvento']);


                            }

                        });
                }
            });
        }

    }


    actualizarMatrizRiesgo() {
        //console.log("REG MATRIZ " + JSON.stringify(this.matricesRiesgo[0]));

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

        var matrizRiesgo: MatrizEvento = {
            idMatrizRiesgo: idMatrizRiesgo,
            ordenTabla: orden,
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
            indicadorBaja: indicadorBaja,
            listaDetalleMatriz: []


        };


        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatriz.push(this.matricesRiesgo[j]);

        }

        for (var j = 0; j < this.matrizEventoEliminado.length; j++) {

            matrizRiesgo.listaDetalleMatriz.push(this.matrizEventoEliminado[j]);

        }

        console.log("EL JSON ACT " + JSON.stringify(matrizRiesgo));

        Swal.fire({
            title: '¿Está seguro de actualizar la Matriz de Eventos de Pérdida?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la Matriz de Eventos de Pérdida',
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
                            Swal.fire('¡Actualización exitosa!', "La Matriz de Eventos de Pérdida se actualizó con éxito", 'success');
                            this.router.navigate(['/pages', 'main', 'transaccion', 'matrizEvento']);


                        }

                    });
            }
        });


    }


    guardarRegistroEditado(matrizRiesgoTemp: MatrizEvento) {

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
                this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[5].idParametro);
                //this.obtenerProcesosMatriz();
              //  this.formularioMatrizRiesgo.get('idMatrizNivel').disable();

            }
        );

    }

    obtenerListaEstadoParametros() {

        this.matrizRiesgoService.obtenerListaEstadoParametros().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaTiposMatriz = resp.listaParametros;

                this.formularioMatrizRiesgo.get('idTipoMatriz').setValue(this.idTipoMatrizNivel);


            }
        );

    }

    obtenerListaEstrategiaRespuesta(){
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

    cancelarEdicion(matrizRiesgoTemp: MatrizEvento, index: number) {

        console.log();
        this.matricesRiesgo[index] = this.matrizRiesgoTemp;
        //   delete this.products2[product.id];
    }

    borrarRegistro(matrizRiesgoTemp: MatrizEvento, index: number) {

        if (matrizRiesgoTemp.idDetaMatrizEvento > 0 ){

            matrizRiesgoTemp.indicadorBaja = 0;

            this.matrizEventoEliminado.push(matrizRiesgoTemp);

            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }else {
            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }
        //this.matricesRiesgo.splice(index, 1);
        //   delete this.products2[product.id];
    }

    getProbabilidad(probabilidad,impacto):number{

        var calculo: number = probabilidad * impacto;
        var calculo_limited:string = calculo.toFixed(2);
        var calculo_result:number = 0;

        if(calculo>0){
            calculo_result = Number(calculo_limited);

        }
        else{
            calculo_result = 0;

        }

        return calculo_result;

    }

    obtener_severidad(proba: number, impa: number): string {
        var severidad: string;

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
    }

    exportExcel(): void {
        
        import('xlsx').then(xlsx => {
            var lista = [];
            if(this.idTipoMatrizSelect== TipoMatrizRiesgo.proceso){
                for (var detalle of this.matricesRiesgo){
                    var obj = new Object();
                    obj['Año'] = detalle.anio;
                    obj['Trimestre'] = detalle.trimestre;
                    obj['Código del Evento'] = detalle.codEvento;
                    obj['Descripción del Evento'] = detalle.deEvento;
                    obj['Estado del Evento'] = this.obtenerDescIdEstaEvento(detalle.idEstadoEvento);
                    obj['Fecha de Ocurrencia o Detección'] = detalle.feOcurrencia;
                    obj['Fecha de Materialización de la pérdida'] = detalle.feMaterial;
                    obj['Area que origina el evento'] = this.obtenerDescIdAreaEvento(detalle.areaEvento);
                    obj['Tipo de Evento (Nivel 1)'] = detalle.tievento1;
                    obj['Tipo de Evento (Nivel 2)'] = detalle.tievento2;
                    obj['Causa / Origen'] = detalle.causaEvento;
                    obj['Cuenta Contable Asociada'] = detalle.cuentaContable;
                    obj['Importe total de la Pérdida S/.'] = detalle.importePerdida;
                    obj['Intereses'] = detalle.interes;
                    obj['Otros'] = detalle.essalud;
                    obj['Pérdida Bruta S/'] = detalle.perdidaBruta;
                    obj['Cuenta con Plan Acción (Opcional)'] = this.obtenerDescIdcuentaPlan(detalle.inPlanAccion);
                    obj['Plan de Acción'] = detalle.dePlanAccion;
                    obj['Comentarios'] = detalle.comentario;

                    lista.push(obj);
                }

                var worksheet = xlsx.utils.aoa_to_sheet([["IDENTIFICACIÓN DEL EVENTO","","","","","","","","","",
                    "DETALLE DEL EVENTO","","","","",
                    "PLAN DE ACCIÓN","","",""]]);
                xlsx.utils.sheet_add_json(worksheet,lista,{origin:1,skipHeader: false});

                if(!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({s:{r:0,c:0},e:{r:0,c:9}},
                    {s:{r:0,c:10},e:{r:0,c:14}},
                    {s:{r:0,c:15},e:{r:0,c:18}},);


                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
                this.saveAsExcelFile(excelBuffer, 'MatrizEventoPerdida');
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

    obtenerDescIdEstaEvento(idValorControl:number){
        let valor = "";
        for(let lista of this.listaEstadoEvento){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdAreaEvento(idValorControl:number){
        let valor = "";
        for (let evento of this.matricesRiesgo){
            for(let lista of evento.listaProcesos){
                if(lista.idProceso==idValorControl) valor= lista.deProceso
            }
        }
        return valor;
    }

    obtenerDescIdcuentaPlan(idValorControl:number){
        let valor = "";
        for(let lista of this.listaCuentaConPlan){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
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
