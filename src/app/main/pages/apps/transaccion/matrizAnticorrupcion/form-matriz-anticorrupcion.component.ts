import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatrizRiesgo} from '../../../../../shared/models/matrizRiesgo';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {MatrizAnticorrupcionService} from './matriz-anticorrupcion.service';
import {MessageService} from "primeng/api";
import {Empresa} from "../../../../../shared/models/empresa";
import {Sede} from "../../../../../shared/models/sede";
import {Periodo} from "../../../../../shared/models/periodo";
import {MatrizNivel} from "../../../../../shared/models/matrizNivel";
import {MATRIZ_ANTICORRUPCION} from "../../../../../shared/Constantes";
import {DataLogin} from 'src/app/shared/models/data';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {Gerencia} from "../../../../../shared/models/gerencia";
import {Proceso} from "../../../../../shared/models/proceso";
import {SubProceso} from "../../../../../shared/models/subproceso";
import { of } from 'rxjs';
import { MatrizAnticorrupcion } from 'src/app/shared/models/matrizAnticorrupcion';
import {RiesgoInherenteComponent} from "../matrizAnticorrupcion/riesgo-inherente/riesgo-inherente.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import { RiesgoResidualComponent } from '../matrizAnticorrupcion/riesgo-residual/riesgo-residual.component';
import { cartesianPoint } from 'src/app/shared/models/cartesianPoint';
import {TipoMatrizRiesgo} from "../../../../../shared/models/tipoMatrizRiesgo";
import FileSaver from 'file-saver';
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";

@Component({
    selector: 'app-conf-registrar-matriz-anticorrupcion',
    templateUrl: 'form-matriz-anticorrupcion.component.html',
    providers: [DialogService],

    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})

export class FormMatrizAnticorrupcionComponent implements OnInit {

    formularioMatrizRiesgo: FormGroup;
    matrizRiesgo: MatrizAnticorrupcion;
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
    listaidEstadoPlanAccion: Parametro[];
    listaEficazPlanAccion: Parametro[];
    listaTipos: Parametro[];
    listaEstrategiaRespuesta: Parametro[];
    listaTipoDelito: Parametro[];
    listaIndicadorDebDiligencia: Parametro[];
    listaIndicadorFinPlanAccion: Parametro[];
    listaEficaciaControlesActuales: Parametro[];
    editar: boolean;
    listaCantControl: Parametro[];

    idEstado: string;
    idEmpresa: number;
    idCartera: number;
    idTipoMatriz: number;
    idTipoMatrizSelect: number=0;
    indicadorBaja: number = 1;
    idTipoMatrizNivel: number = 1;
    idSede: number;
    cols: any[];
    fijoCols: any[];
    matricesRiesgo: MatrizAnticorrupcion[];
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
    matrizRiesgoTemp: MatrizAnticorrupcion;
    ri: number = 0; //indice

    ref: DynamicDialogRef;


    idMatrizContinuidad: number = 45;

    probImpInherente: number[] = [];
    impInherente: number[] = [];
    probImpResidual: number[] = [];
    ImpResidual: number[] = [];
    matrizAntiEliminado: MatrizAnticorrupcion[] = [];

    idPerfil: number;
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    tipoPerfilUsuario: TipoPerfil = TipoPerfil.user;
    notadmin:boolean;
    ver:boolean=false;

    dataIp: string = "";

    constructor(public dialogService: DialogService,private authLoginService: AuthLoginService, private formBuilder: FormBuilder, private router: Router,
                private matrizRiesgoService: MatrizAnticorrupcionService, private activatedRoute: ActivatedRoute,
                private messageService: MessageService) {

        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
        this.idSede = this.payload.data.datosSede.idSede;
        this.obtenerListaEmpresas();
        this.obtenerListaCarteras();
        //this.obtenerListaSedes();
        // this.obtenerListaPeriodos();
        this.obtenerTipoMatriz();
        this.obtenerListaMatrizNivel();
        this.obtenerListaTipoMatriz();
        this.crearFormulario();
        this.obtenerListaEstadoParametros();
        this.obtenerListaEstados();
        this.solvePermissions();
        this.obtenerListaEstrategiaRespuesta();
        this.obtenerListaOrigenRiesgo();
        this.obtenerListaFrecuenciaRiesgo();
        this.obtenerListaTipoRiesgo();

        this.obtenerListaAreaResponsable();
        this.obtenerListaResponsableControl();
        this.obtenerListaFrecuenciaControl();
        this.obtenerListaOportunidadControl();
        this.obtenerListaAutomatizacionControl();
        this.obtenerListaidEstadoPlanAccion();
        this.obtenerListaEficaciaPlanAccion();

        this.obtenerListaTipoDelito();
        this.obtenerListaIndicadorDebDiligencia();
        this.obtenerListaIndicadorFinPlanAccion();
        this.obtenerListaEficaciaControlActuales();
        this.obtenerListaCantidadControl();

        this.listaGerencias = [{idGerencia: 0, descripcionGerencia: 'Seleccione'}];
        this.listaProcesos = [{idProceso: 0, deProceso: 'Seleccione'}];
        this.obtenerListaGerencia();

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
            }else if(this.activatedRoute.snapshot.url[0].toString() === 'registrar'){
                this.editar = false;
                this.cargarListas();
                this.formularioMatrizRiesgo.enable();
                this.formularioMatrizRiesgo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
                this.formularioMatrizRiesgo.get('sede').setValue(this.payload.data.datosSede.idSede);
                this.formularioMatrizRiesgo.get('cartera').setValue(this.payload.data.datosEmpresa.idCartera);
                this.cargarProcesos(this.idEmpresa,0);
            }else if(this.activatedRoute.snapshot.url[0].toString() === 'ver') {
                this.formularioMatrizRiesgo.disable();
                this.ver = true;
                this.editar = false;
            } else {
                this.formularioMatrizRiesgo.disable();
                this.editar = false;
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
                colspan:"1"

            },
            // {
            //     field: 'idGerencia',
            //     header: 'Gerencia Responsable',
            //     class: 'text-center',
            //     ordenadmiento: 'idGerencia',
            //     headerClass: 'text-center'
            // },
            {
                field: 'idProceso',
                header: 'Nombre del Proceso Analizado',
                class: 'text-center tdzlarge',
                ordenadmiento: 'idProceso',
                colspan:"3",
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo (RAC-PR-XX)',
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
                placeholder:""
            },

            {
                field: 'idTipoRiesgo',
                header: 'Tipo del Riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idTipoRiesgo',
                colspan:"2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'idTipoDelito',
                header: 'Tipo de delito de corrupción relacionado con el riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idTipoDelito',
                colspan:"2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'nuFrecuInhe',
                header: 'Frecuencia (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuFrecuInhe',
                colspan:"1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpaInhe',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuImpaInhe',
                colspan:"1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntaInhe',
                header: 'Nivel de riesgo',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntaInhe',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'dePuntaInhe',
                header: 'Nivel de riesgo inherente',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'dePuntaInhe',
                headerClass: 'text-center tdsmall'
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                placeholder:"¿Cuando? ¿Quién? ¿Qué? ¿Cómo? y evidencia"
            },
            {
                field: 'idEficaciaControl',
                header: 'Eficacia de controles actuales',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEficaciaControl',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'nuFrecuRes',
                header: 'Frecuencia (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuFrecuRes',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpaRes',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpaRes',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntaRes',
                header: 'Nivel de Riesgo',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntaRes',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'deSeveridadRes',
                header: 'Nivel de Riesgo Residual',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadRes',
                headerClass: 'text-center tdsmall'
            },

            //Debida diligencia

            {
                field: 'idDebidaDilig',
                header: '¿Aplica debida diligencia?',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idDebidaDilig',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'decargoRiesgo',
                header: 'Cargo relacionado con el riesgo',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'decargoRiesgo',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'deSociodelRiesgo',
                header: 'Socio de negocio relacionado con el riesgo',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deSociodelRiesgo',
                headerClass: 'text-center tdzlarge'
            },


            //PLAN ACCON
            {
                field: 'idRespEstrategia',
                header: 'Estrategia de Respuesta',
                class: 'text-center tdlarge',
                ordenadmiento: 'idRespEstrategia',
                colspan:"2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código del Plan de Acción',
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
                field: 'idRespPlanAccion',
                header: ' Responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idRespPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'feFinPlanAccion',
                header: 'Fecha planificada de finalización del plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feFinPlanAccion',
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


//Verificacion eficacia


            {
               field: 'indFinPlanAccion',
               header: '¿Se culminó el plan de acción?',
               class: 'text-center tdlarge',
               colspan:"2",
               ordenadmiento: 'indFinPlanAccion',
               headerClass: 'text-center tdlarge'
            },

            {
                field: 'inFicaz',
                header: '¿El tratamiento fue eficaz?',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'inFicaz',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'deAccion',
                header: 'Acciones a tomar (En caso el tratamiento culminado no haya sido eficaz)',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deAccion',
                headerClass: 'text-center tdzlarge'
            },
        ];

        this.matricesRiesgo = [];

        console.log(this.loading);
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

    cargarListas(){

        this.obtenerListaSedes();
        this.obtenerListaPeriodos();
        this.obtenerListaGerencia();
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

                        for (var j = 0; j < this.matrizRiesgo.listaDetalleMatrizAnticorrupcion.length; j++) {

                            var orden = this.matricesRiesgo.length;
                            this.matrizRiesgo.listaDetalleMatrizAnticorrupcion[j].ordenTabla = orden;
                            this.matricesRiesgo.push(this.matrizRiesgo.listaDetalleMatrizAnticorrupcion[j]);

                        }

                        // this.obtenerListaMatriz();

                        if(this.matrizRiesgo.idMatrizNivel==0){

                            this.showColumnasProcesos();
                        }
                        else{
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

                        this.cargarProcesos(this.idEmpresa, 0);
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
                field: 'idMatrizRiesgo',
                header: 'COD',
                class: 'text-center',
                ordenadmiento: 'idMatrizRiesgo',
                headerClass: 'text-center',
                styleClass: 'width: 10%'
            },
            {
                field: 'idGerencia',
                header: 'Gerencia Responsable',
                class: 'text-center',
                ordenadmiento: 'idGerencia',
                headerClass: 'text-center'
            },
            {
                field: 'idProceso',
                header: 'Nombre del Proceso Analizado',
                class: 'text-center',
                ordenadmiento: 'idProceso',
                headerClass: 'text-center'
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo (RAC-PR-XX)',
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
                placeholder:""
            },

            {
                field: 'idTipoRiesgo',
                header: 'Tipo del Riesgo',
                class: 'text-center',
                ordenadmiento: 'idTipoRiesgo',
                headerClass: 'text-center'
            },
            {
                field: 'idTipoDelito',
                header: 'Tipo de delito',
                class: 'text-center',
                ordenadmiento: 'idTipoDelito',
                headerClass: 'text-center'
            },
            {
                field: 'nuFrecuInhe',
                header: 'Frecuencia (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuFrecuInhe',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpaInhe',
                header: 'Impacto (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpaInhe',
                headerClass: 'text-center'
            },
            {
                field: 'nuPuntaInhe',
                header: 'Nivel de riesgo inherente',
                class: 'text-center',
                ordenadmiento: 'nuPuntaInhe',
                headerClass: 'text-center'
            },
            {
                field: 'dePuntaInhe',
                header: 'Severidad Inherente',
                class: 'text-center',
                ordenadmiento: 'dePuntaInhe',
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
                headerClass: 'text-center',
                placeholder:"¿Cuando? ¿Quién? ¿Qué? ¿Cómo? y evidencia"
            },
            {
                field: 'idEficaciaControl',
                header: 'Eficacia de controles actuales',
                class: 'text-center',
                ordenadmiento: 'idEficaciaControl',
                headerClass: 'text-center'
            },

            {
                field: 'nuFrecuRes',
                header: 'Frecuencia (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuFrecuRes',
                headerClass: 'text-center'
            },
            {
                field: 'nuImpaRes',
                header: 'Impacto (1-4)',
                class: 'text-center',
                ordenadmiento: 'nuImpaRes',
                headerClass: 'text-center'
            },
            {
                field: 'nuPuntaRes',
                header: 'Puntaje Riesgo',
                class: 'text-center',
                ordenadmiento: 'nuPuntaRes',
                headerClass: 'text-center'
            },
            {
                field: 'deSeveridadRes',
                header: 'Nivel de Riesgo Residual',
                class: 'text-center',
                ordenadmiento: 'deSeveridadRes',
                headerClass: 'text-center'
            },

            //Debida diligencia

            {
                field: 'idDebidaDilig',
                header: '¿Aplica debida diligencia?',
                class: 'text-center',
                ordenadmiento: 'idDebidaDilig',
                headerClass: 'text-center'
            },

            {
                field: 'decargoRiesgo',
                header: 'Cargo relacionado con el riesgo',
                class: 'text-center',
                ordenadmiento: 'decargoRiesgo',
                headerClass: 'text-center'
            },
            {
                field: 'deSociodelRiesgo',
                header: 'Socio de negocio relacionado con el riesgo',
                class: 'text-center',
                ordenadmiento: 'deSociodelRiesgo',
                headerClass: 'text-center'
            },


            //PLAN ACCON
            {
                field: 'idRespEstrategia',
                header: 'Estrategia de Respuesta',
                class: 'text-center',
                ordenadmiento: 'idRespEstrategia',
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
                field: 'dePlanAccion',
                header: 'Descripcion Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'dePlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'idRespPlanAccion',
                header: 'Resp. Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'idRespPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'feFinPlanAccion',
                header: 'Fecha planificada de finalización del plan de acción',
                class: 'text-center',
                ordenadmiento: 'feFinPlanAccion',
                headerClass: 'text-center'
            },
            {
                field: 'idEstadoPlanAccion',
                header: 'Estado Plan de Accion',
                class: 'text-center',
                ordenadmiento: 'idEstadoPlanAccion',
                headerClass: 'text-center'
            },


//Verificacion eficacia


            {
               field: 'indFinPlanAccion',
               header: '¿Se culminó el plan de acción?',
               class: 'text-center',
               ordenadmiento: 'indFinPlanAccion',
               headerClass: 'text-center'
            },

            {
                field: 'inFicaz',
                header: '¿El plan de acción fue eficaz?',
                class: 'text-center',
                ordenadmiento: 'inFicaz',
                headerClass: 'text-center'
            },
            {
                field: 'deAccion',
                header: 'Acciones a tomar',
                class: 'text-center',
                ordenadmiento: 'deAccion',
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
                colspan:"1"

            },
            // {
            //     field: 'idGerencia',
            //     header: 'Gerencia Responsable',
            //     class: 'text-center',
            //     ordenadmiento: 'idGerencia',
            //     headerClass: 'text-center'
            // },
            {
                field: 'idProceso',
                header: 'Nombre del Proceso Analizado',
                class: 'text-center tdzlarge',
                ordenadmiento: 'idProceso',
                colspan:"3",
                headerClass: 'text-center tdzlarge'
            },
            {
                field: 'codRiesgo',
                header: 'Código del Riesgo (RAC-PR-XX)',
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
                placeholder:""
            },

            {
                field: 'idTipoRiesgo',
                header: 'Tipo del Riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idTipoRiesgo',
                colspan:"2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'idTipoDelito',
                header: 'Tipo de delito de corrupción relacionado con el riesgo',
                class: 'text-center tdlarge',
                ordenadmiento: 'idTipoDelito',
                colspan:"2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'nuFrecuInhe',
                header: 'Frecuencia (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuFrecuInhe',
                colspan:"1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpaInhe',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                ordenadmiento: 'nuImpaInhe',
                colspan:"1",
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntaInhe',
                header: 'Nivel de riesgo',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntaInhe',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'dePuntaInhe',
                header: 'Nivel de riesgo inherente',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'dePuntaInhe',
                headerClass: 'text-center tdsmall'
            },

            {
                field: 'codControl',
                header: 'Código del Control',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'codControl',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'deControl',
                header: 'Descripción del Control',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deControl',
                headerClass: 'text-center tdzlarge',
                placeholder:"¿Cuando? ¿Quién? ¿Qué? ¿Cómo? y evidencia"
            },
            {
                field: 'idEficaciaControl',
                header: 'Eficacia de controles actuales',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idEficaciaControl',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'nuFrecuRes',
                header: 'Frecuencia (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuFrecuRes',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuImpaRes',
                header: 'Impacto (1-4)',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuImpaRes',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'nuPuntaRes',
                header: 'Nivel de Riesgo',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'nuPuntaRes',
                headerClass: 'text-center tdsmall'
            },
            {
                field: 'deSeveridadRes',
                header: 'Nivel de Riesgo Residual',
                class: 'text-center tdsmall',
                colspan:"1",
                ordenadmiento: 'deSeveridadRes',
                headerClass: 'text-center tdsmall'
            },

            //Debida diligencia

            {
                field: 'idDebidaDilig',
                header: '¿Aplica debida diligencia?',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idDebidaDilig',
                headerClass: 'text-center tdlarge'
            },

            {
                field: 'decargoRiesgo',
                header: 'Cargo relacionado con el riesgo',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'decargoRiesgo',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'deSociodelRiesgo',
                header: 'Socio de negocio relacionado con el riesgo',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deSociodelRiesgo',
                headerClass: 'text-center tdzlarge'
            },


            //PLAN ACCON
            {
                field: 'idRespEstrategia',
                header: 'Estrategia de Respuesta',
                class: 'text-center tdlarge',
                ordenadmiento: 'idRespEstrategia',
                colspan:"2",
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'codPlanAccion',
                header: 'Código del Plan de Acción',
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
                field: 'idRespPlanAccion',
                header: ' Responsable de realizar el plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'idRespPlanAccion',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'feFinPlanAccion',
                header: 'Fecha planificada de finalización del plan de acción',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'feFinPlanAccion',
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


//Verificacion eficacia


            {
               field: 'indFinPlanAccion',
               header: '¿Se culminó el plan de acción?',
               class: 'text-center tdlarge',
               colspan:"2",
               ordenadmiento: 'indFinPlanAccion',
               headerClass: 'text-center tdlarge'
            },

            {
                field: 'inFicaz',
                header: '¿El tratamiento fue eficaz?',
                class: 'text-center tdlarge',
                colspan:"2",
                ordenadmiento: 'inFicaz',
                headerClass: 'text-center tdlarge'
            },
            {
                field: 'deAccion',
                header: 'Acciones a tomar (En caso el tratamiento culminado no haya sido eficaz)',
                class: 'text-center tdzlarge',
                colspan:"3",
                ordenadmiento: 'deAccion',
                headerClass: 'text-center tdzlarge'
            },
        ];
    }

    obtenerListaidEstadoPlanAccion() {

        this.matrizRiesgoService.obtenerEstadoPlanAccion().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaidEstadoPlanAccion = resp.listaParametros;


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

    obtenerListaEficaciaControlActuales() {

        this.matrizRiesgoService.obtenerEficaciaControlesActuales().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEficaciaControlesActuales = resp.listaParametros;


            }
        );

    }



    onChangeProceso(event, indice) {

        const idproceso = event.target.value;
        const idSede = this.payload.data.datosSede.idSede;
        const idEmpresa = this.idEmpresa;
        this.matricesRiesgo[indice].idMatrizNivel = this.matricesRiesgo[indice].listaProcesos[0].idMatrizNivel;

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

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_ANTICORRUPCION).subscribe(
            resp => {
                this.listaProcesosSelected = resp.listaProceso;
                //  console.log("Gerencia1 "+JSON.stringify(resp));

                //    this.listaGerencias =resp.listaGerencias;
                console.log("ProcesosSel " + JSON.stringify(this.listaProcesosSelected));
            });

    }

    obtenerProcesosMatriz(idTipoMatriz){


        const idSede = this.payload.data.datosSede.idSede;
        const idEmpresa = this.idEmpresa;

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_ANTICORRUPCION).subscribe(
            resp => {
                this.listaProcesosSelected = resp.listaProceso.filter(proceso =>
                    proceso.indicadorBaja == this.indicadorBaja
                );
            });

    }

    cargarProcesos(idEmpresa, idProceso) {

        // const idEmpresa = this.idEmpresa;
        const idSede = this.payload.data.datosSede.idSede;

        return this.matrizRiesgoService.obtenerProcesosMatriz(idEmpresa, MATRIZ_ANTICORRUPCION).subscribe(
            resp => {
                // @ts-ignore
                this.listaProcesosSelected = resp.listaProceso;

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
        const idTipoMatriz = this.formularioMatrizRiesgo.get('idMatrizNivel').value;
        const idMatrizNivel = this.formularioMatrizRiesgo.get('idTipoMatriz').value;
        const idControl = this.matricesRiesgo.length;
        const orden = this.matricesRiesgo.length;
        const idMatrizRiesgo = this.getIdMatrizNextVal();
        console.log("AGREGANDO MATRIZ "+idMatrizRiesgo);
        const codRiesgo = this.getCorrelativoRiesgo(idMatrizRiesgo);
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp //"127.0.0.1";

        this.formularioMatrizRiesgo.disable();

        var matrizRiesgo: MatrizAnticorrupcion = {
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
            listaDetalleMatrizAnticorrupcion:[],
            codRiesgo:"",
            codControl:"",
            codPlanAccion:""


        };

        var control: MatrizAnticorrupcion = new MatrizAnticorrupcion();
        control.ordenTabla = 0;
        control.idMatrizRiesgo = idMatrizRiesgo;

        control.idPeriodo = matrizRiesgo.idPeriodo;
        control.idProceso = matrizRiesgo.idProceso;
        control.idSubProceso = matrizRiesgo.idSubProceso;
        control.idEmpresa = matrizRiesgo.idEmpresa;
  //      control.idFrecuenciaControl = matrizRiesgo.idFrecuenciaControl;
  //      control.idFrecuenciaRiesgo = matrizRiesgo.idFrecuenciaRiesgo;
        control.deRiesgo = matrizRiesgo.deRiesgo;
        control.listaProcesos = matrizRiesgo.listaProcesos;
        control.listaSubProcesos = matrizRiesgo.listaSubProcesos;
   //     control.idCodigoControl = 0;
        control.idMatrizNivel = idMatrizNivel;
        control.codRiesgo = codRiesgo;
        control.deCartera = "";
   //     control.metKri ="";
   //     control.kriActual="";

        control.usuarioCreacion = usuarioCreacion;
        control.ipCreacion = ipCreacion;

        matrizRiesgo.listaDetalleMatrizAnticorrupcion.push(control);
        matrizRiesgo.listaProcesos = this.listaProcesosSelected;

        if(idTipoMatriz==0){
            matrizRiesgo.idProceso = this.listaProcesosSelected[0].idProceso;
            matrizRiesgo.idMatrizNivel = this.listaProcesosSelected[0].idMatrizNivel;

        }

      //  console.log("La lista procesos a " + JSON.stringify(this.listaProcesosSelected));
      //  console.log("La lista procesos a agregar mat " + JSON.stringify(matrizRiesgo));
      //  console.log("La lista procesos a agregar " + JSON.stringify(matrizRiesgo.listaProcesos));

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
                   // nextid = this.matricesRiesgo[j].i;
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



    replicarMatrices(matrizRiesgoTemp: MatrizAnticorrupcion, ri: number) {
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

                            var control: MatrizAnticorrupcion = new MatrizAnticorrupcion();
                            control.ordenTabla = j + 1;
                            control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;
                            control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
                            control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                            control.idMatrizNivel = idMatrizNivel;
                            control.idSede = this.matrizRiesgoTemp.idSede;
                            control.deCartera = "";
                            control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                            control.codMatriz = this.matrizRiesgoTemp.codMatriz;
                            control.idProceso = this.matrizRiesgoTemp.idProceso;
                            control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                            control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                            control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;
                            control.idTipoDelito = this.matrizRiesgoTemp.idTipoDelito;
                            control.nuFrecuInhe = this.matrizRiesgoTemp.nuFrecuInhe;
                            control.nuImpaInhe = this.matrizRiesgoTemp.nuImpaInhe;
                            control.nuPuntaInhe = this.matrizRiesgoTemp.nuPuntaInhe;
                            control.dePuntaInhe = this.matrizRiesgoTemp.dePuntaInhe;
                            control.codControl = this.matrizRiesgoTemp.codControl;
                            control.deControl = this.matrizRiesgoTemp.deControl;
                            control.idEficaciaControl = this.matrizRiesgoTemp.idEficaciaControl;

                            control.nuFrecuRes = this.matrizRiesgoTemp.nuFrecuRes;
                            control.nuImpaRes = this.matrizRiesgoTemp.nuImpaRes;
                            control.nuPuntaRes = this.matrizRiesgoTemp.nuPuntaRes;
                            control.deSeveridadRes = this.matrizRiesgoTemp.deSeveridadRes;


                            control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;

                            control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;

                            control.listaDetalleMatrizAnticorrupcion =[];

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

                var control: MatrizAnticorrupcion = new MatrizAnticorrupcion();
                orden++;
                control.ordenTabla = orden;
                control.idMatrizRiesgo = this.matrizRiesgoTemp.idMatrizRiesgo;
                control.idPeriodo = this.matrizRiesgoTemp.idPeriodo;
                control.idEmpresa = this.matrizRiesgoTemp.idEmpresa;
                control.idMatrizNivel = idMatrizNivel;
                control.idSede = this.matrizRiesgoTemp.idSede;
                control.deCartera = "";
                control.idGerencia = this.matrizRiesgoTemp.idGerencia;
                control.codMatriz = this.matrizRiesgoTemp.codMatriz;
                control.idProceso = this.matrizRiesgoTemp.idProceso;
                control.codRiesgo = this.matrizRiesgoTemp.codRiesgo;
                control.deRiesgo = this.matrizRiesgoTemp.deRiesgo;
                control.idTipoRiesgo = this.matrizRiesgoTemp.idTipoRiesgo;
                control.idTipoDelito = this.matrizRiesgoTemp.idTipoDelito;
                control.nuFrecuInhe = this.matrizRiesgoTemp.nuFrecuInhe;
                control.nuImpaInhe = this.matrizRiesgoTemp.nuImpaInhe;
                control.nuPuntaInhe = this.matrizRiesgoTemp.nuPuntaInhe;
                control.dePuntaInhe = this.matrizRiesgoTemp.dePuntaInhe;
                control.codControl = this.matrizRiesgoTemp.codControl;
                control.deControl = this.matrizRiesgoTemp.deControl;
                control.idEficaciaControl = this.matrizRiesgoTemp.idEficaciaControl;

                control.nuFrecuRes = this.matrizRiesgoTemp.nuFrecuRes;
                control.nuImpaRes = this.matrizRiesgoTemp.nuImpaRes;
                control.nuPuntaRes = this.matrizRiesgoTemp.nuPuntaRes;
                control.deSeveridadRes = this.matrizRiesgoTemp.deSeveridadRes;

                control.listaProcesos = this.matrizRiesgoTemp.listaProcesos;

                this.matricesRiesgo.push(control);

                if (this.matricesRiesgo[this.ri].listaDetalleMatrizAnticorrupcion != undefined) {
                    this.matricesRiesgo[this.ri].listaDetalleMatrizAnticorrupcion.push(control);
                } else {
                    this.matricesRiesgo[this.ri].listaDetalleMatrizAnticorrupcion = [];
                    this.matricesRiesgo[this.ri].listaDetalleMatrizAnticorrupcion.push(control);
                }

                console.log("Matriz "+this.ri);
            }
            this.DisplayControl = false;

        } else {
            this.DisplayControl = false;
        }

    }


    editarRegistro(matrizRiesgoTemp: MatrizRiesgo, idMatriz: number) {

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

        var matrizRiesgo: MatrizAnticorrupcion = {
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
            listaDetalleMatrizAnticorrupcion: []


        };

        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatrizAnticorrupcion.push(this.matricesRiesgo[j]);

        }
        console.log("REG MATRIZ " + JSON.stringify(matrizRiesgo));

        if (matrizRiesgo.listaDetalleMatrizAnticorrupcion.length == 0){
            Swal.fire("Debe de ingresar el detalle de la Matriz de Riesgo Anticorrupción");

        } else{

            Swal.fire({
                title: '¿Está seguro de crear la Matriz de Riesgo Anticorrupción?',
                showCancelButton: true,
                confirmButtonText: `Crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos registrando la Matriz de Riesgo Anticorrupción',
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
                                Swal.fire('¡Creación exitosa!', "La Matriz de Riesgo Anticorrupción se creó con éxito", 'success');
                                this.router.navigate(['/pages', 'main', 'transaccion', 'matrizAnticorrupcion']);

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

        var matrizRiesgo: MatrizAnticorrupcion = {
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
            listaDetalleMatrizAnticorrupcion: []


        };


        for (var j = 0; j < this.matricesRiesgo.length; j++) {

            matrizRiesgo.listaDetalleMatrizAnticorrupcion.push(this.matricesRiesgo[j]);

        }

        for (var j = 0; j < this.matrizAntiEliminado.length; j++) {

            matrizRiesgo.listaDetalleMatrizAnticorrupcion.push(this.matrizAntiEliminado[j]);

        }

        console.log("EL JSON ACT " + JSON.stringify(matrizRiesgo));

        Swal.fire({
            title: '¿Está seguro de actualizar la Matriz de Riesgo Anticorrupción?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando los datos de la Matriz de Riesgo Anticorrupción',
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
                            Swal.fire('¡Actualización exitosa!', "La Matriz de Riesgo Anticorrupción se actualizó con éxito", 'success');
                            this.router.navigate(['/pages', 'main', 'transaccion', 'matrizAnticorrupcion']);

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
                this.formularioMatrizRiesgo.get('idMatrizNivel').setValue(this.listaTiposMatrizRiesgo[4].idParametro);
                this.obtenerProcesosMatriz(this.listaTiposMatrizRiesgo[4].idParametro);
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

    obtenerListaCantidadControl() {

        this.matrizRiesgoService.obtenerListaCantidadControl().subscribe(
            resp => {
                this.listaCantControl = resp.listaParametros;
            }
        );

    }

    obtenerListaTipoDelito() {

        this.matrizRiesgoService.obtenerTiposdeDelito().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaTipoDelito = resp.listaParametros;

            }
        );

    }

    obtenerListaIndicadorDebDiligencia() {

        this.matrizRiesgoService.obtenerAplicaDebidaDiligencia().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaIndicadorDebDiligencia = resp.listaParametros;


            }
        );

    }

    obtenerListaIndicadorFinPlanAccion() {

        this.matrizRiesgoService.obtenerAplicaDebidaDiligencia().subscribe(
            resp => {
                //    console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaIndicadorFinPlanAccion = resp.listaParametros;


            }
        );

    }


    cancelarEdicion(matrizRiesgoTemp: MatrizRiesgo, index: number) {

        console.log();
        this.matricesRiesgo[index] = this.matrizRiesgoTemp;
        //   delete this.products2[product.id];
    }

    borrarRegistro(matrizRiesgoTemp: MatrizAnticorrupcion, index: number) {

        if (matrizRiesgoTemp.idDetaMatrizAntic > 0 ){

            matrizRiesgoTemp.indicadorBaja = '0';

            this.matrizAntiEliminado.push(matrizRiesgoTemp);

            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }else {
            this.matricesRiesgo.splice(index, 1);

            this.messageService.add({severity:'success', summary: '¡Eliminación exitosa!', detail: 'El registro se eliminó correctamente', life: 3000});

        }
        //   delete this.products2[product.id];
    }

    calculoSeveridadProbabilidad(indice, event): void {

        console.log("Cal Sev");
        const probabilidadRiesgo: number = event.target.value;
        const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaRes;
        var calculo: number = probabilidadRiesgo * impactoRiesgo;
        if (calculo > 0) {

            this.matricesRiesgo[indice].nuPuntaInhe = probabilidadRiesgo * impactoRiesgo;

        }

    }

    calculoSeveridadImpacto(indice, event): void {


        console.log("Cal Sev");
        const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuInhe;
        const impactoRiesgo: number = event.target.value;

        var calculo: number = probabilidadRiesgo * impactoRiesgo;
        if (calculo > 0) {

            this.matricesRiesgo[indice].nuPuntaInhe = probabilidadRiesgo * impactoRiesgo;
            var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
            this.matricesRiesgo[indice].deSeveridadRes = severidad;
        }


    }


    calculoSeveridadProbabilidadControl(indice, event): void {

        console.log("Cal Sev C");
        const probabilidadControl: number = event.target.value;
        const impactoControl: number = this.matricesRiesgo[indice].nuImpaRes;
        var calculo: number = probabilidadControl * impactoControl;
        if (calculo > 0) {

            this.matricesRiesgo[indice].nuPuntaRes = probabilidadControl * impactoControl;
            var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
            this.matricesRiesgo[indice].deSeveridadRes = severidad;


        }

    }

    calculoSeveridadImpactoControl(indice, event): void {


        console.log("Cal Sev C");
        const probabilidadControl: number = this.matricesRiesgo[indice].nuPuntaRes;
        const impactoControl: number = event.target.value;

        var calculo: number = probabilidadControl * impactoControl;
        if (calculo > 0) {

            this.matricesRiesgo[indice].nuPuntaRes = probabilidadControl * impactoControl;

        }


    }

    onchangecod(limitfield,indice){
        const codRiesgo = limitfield.target.value;
        var acceso  =this;

        return this.matrizRiesgoService.obtenerDescripcion(codRiesgo).subscribe(
            resp => {
                // @ts-ignore
                var descripcion = resp.DetalleMatrizRiesgo.deRiesgo;
                this.matricesRiesgo[indice].deRiesgo=descripcion;

            });

    }


    limit_number_frec_inhe(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuFrecuInhe = 4;

            const probabilidadRiesgo: number = 4;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaInhe;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].dePuntaInhe = severidad;

            }


        }
        else{

            const probabilidadRiesgo: number = valor;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaInhe;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].dePuntaInhe = severidad;

            }

        }




    }

    limit_number_Impa_inhe(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuImpaInhe = 4;

            const impactoRiesgo: number = 4;
            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuInhe;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].dePuntaInhe = severidad;

            }


        }
        else{

            const impactoRiesgo: number = valor;
            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuInhe;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].dePuntaInhe = severidad;

            }

        }




    }


    limit_number_frec_res(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuFrecuRes = 4;

            const probabilidadRiesgo: number = 4;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaRes;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadRes = severidad;

            }


        }
        else{

            const probabilidadRiesgo: number = valor;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaRes;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadRes = severidad;

            }

        }




    }

    limit_number_Impa_res(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuImpaRes = 4;

            const impactoRiesgo: number = 4;
            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuRes;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadRes = severidad;

            }


        }
        else{

            const impactoRiesgo: number = valor;
            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuRes;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadRes = severidad;

            }

        }




    }

    limit_number_prob_riesgo(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuFrecuInhe = 4;

            const probabilidadRiesgo: number = 4;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaInhe;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;

            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;

            }


        }
        else{

            const probabilidadRiesgo: number = valor;
            const impactoRiesgo: number = this.matricesRiesgo[indice].nuImpaInhe;
            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);
            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);
                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;

            }

        }




    }

    limit_number_impa_riesgo(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuImpaInhe = 4;

            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuInhe;
            const impactoRiesgo: number = 4;

            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

               this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;
               var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
               this.matricesRiesgo[indice].deSeveridadRes = severidad;
            }
        }
        else{


            const probabilidadRiesgo: number = this.matricesRiesgo[indice].nuFrecuInhe;
            const impactoRiesgo: number = valor;

            var calculo: number = probabilidadRiesgo * impactoRiesgo;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

                this.matricesRiesgo[indice].nuPuntaInhe = calculo_result;
                var severidad = this.obtener_severidad(probabilidadRiesgo, impactoRiesgo);
                this.matricesRiesgo[indice].deSeveridadRes = severidad;
            }


        }



    }


    limit_number_prob_control(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {

            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuFrecuRes= 4;

            const probabilidadControl: number = 4;
            const impactoControl: number = this.matricesRiesgo[indice].nuImpaRes;

            var calculo: number = probabilidadControl * impactoControl;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

               this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
               var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
               this.matricesRiesgo[indice].deSeveridadRes = severidad;
            }

        }
        else{

            const probabilidadControl: number = valor;
            const impactoControl: number = this.matricesRiesgo[indice].nuImpaRes;

            var calculo: number = probabilidadControl * impactoControl;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

               this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
               var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
               this.matricesRiesgo[indice].deSeveridadRes = severidad;
            }

        }

    }

    limit_number_impa_control(limitfield,indice){

        const valor:number = limitfield.target.value;
        console.log("LIMIT "+valor);
        if (valor>4) {
            limitfield.target.value = 4;
            this.matricesRiesgo[indice].nuImpaRes = 4;

            const probabilidadControl: number = this.matricesRiesgo[indice].nuFrecuRes;
            const impactoControl: number = 4;

            var calculo: number = probabilidadControl * impactoControl;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

               this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
               var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
               this.matricesRiesgo[indice].deSeveridadRes = severidad;
            }
        }
        else{

            const probabilidadControl: number = this.matricesRiesgo[indice].nuPuntaRes;
            const impactoControl: number = valor;

            var calculo: number = probabilidadControl * impactoControl;
            var calculo_limited:string = calculo.toFixed(2);

            if (calculo > 0) {
                var calculo_result:number = Number(calculo_limited);

               this.matricesRiesgo[indice].nuPuntaRes = calculo_result;
               var severidad = this.obtener_severidad(probabilidadControl, impactoControl);
               this.matricesRiesgo[indice].deSeveridadRes = severidad;
            }
        }

    }

    openDiagramRiesgoInherente() {


        this.probImpInherente[0]=this.matricesRiesgo[0].nuFrecuInhe;
        this.impInherente[0]=this.matricesRiesgo[0].nuImpaInhe;
        let cartesianPoints:cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint:cartesianPoint=new Object();
            cartesianPoint.label = matriz.codRiesgo;
            cartesianPoint.x = matriz.nuFrecuInhe;
            cartesianPoint.y = matriz.nuImpaInhe;
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
                labelx: 'Frecuencia',
                labely: 'Impacto'
            },
            header: 'Riesgo Inherente',
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

    openDiagramRiesgoResidual() {

        this.probImpResidual[0]=this.matricesRiesgo[0].nuFrecuRes;
        this.ImpResidual[0]=this.matricesRiesgo[0].nuImpaRes;
        let cartesianPoints:cartesianPoint[] = [];
        this.matricesRiesgo.forEach((matriz) => {

            let cartesianPoint:cartesianPoint=new Object();
            cartesianPoint.label = matriz.codRiesgo;
            cartesianPoint.x = matriz.nuFrecuRes;
            cartesianPoint.y = matriz.nuImpaRes;
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
                labelx: 'Frecuencia',
                labely: 'Impacto'
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
        let severidad: string;

        if (proba <= 2 && impa <= 2) {

            if (proba == 2 && impa == 2) {
                severidad = 'Moderado';
            }else{
                severidad = 'Bajo';
            }

        }else if (proba > 2 && impa <= 2) {

            if (proba <= 3 && impa <= 1) {
                severidad = 'Bajo';

            }else if (proba > 3 && impa >= 2) {
                severidad = 'Alto';

            }else{
                severidad = 'Moderado';
            }

        }else if (proba <= 2 && impa > 2) {

            if (proba <= 1 && impa <= 3) {
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

    exportExcel(): void {
        console.log("matricesRiesgo");
        console.log(this.matricesRiesgo);
        import('xlsx').then(xlsx => {
            var lista = [];
            if(this.idTipoMatrizSelect== TipoMatrizRiesgo.proceso){
                for (var detalle of this.matricesRiesgo){
                    var obj = new Object();
                    obj['COD'] = detalle.codMatriz
                    obj['Nombre del Proceso Analizado'] = this.obtenerDescIdProcesoAnalizado(detalle.idProceso);
                    obj['Código del Riesgo (RAC-PR-XX)'] = detalle.codRiesgo;
                    obj['Descripción del Riesgo'] = detalle.deRiesgo;
                    obj['Tipo del Riesgo'] = this.obtenerDescIdTipRiesgo(detalle.idTipoRiesgo);
                    obj['Tipo de delito de corrupción relacionado con el riesgo'] = this.obtenerDescIdDelitoRiesgo(detalle.idTipoDelito);
                    obj['Frecuencia (1-4)'] = detalle.nuFrecuInhe;
                    obj['Impacto (1-4)'] = detalle.nuImpaInhe;
                    obj['Nivel de riesgo'] = detalle.nuPuntaInhe;
                    obj['Nivel de riesgo inherente'] = detalle.dePuntaInhe;
                    obj['Código del Control'] = detalle.codControl;
                    obj['Descripción del Control'] = detalle.deControl;
                    obj['Eficacia de controles actuales'] = this.obtenerDescIdEficaControles(detalle.idEficaciaControl);
                    obj['Frecuencia (1-4) '] = detalle.nuFrecuRes;
                    obj['Impacto (1-4) '] = detalle.nuImpaRes;
                    obj['Nivel de riesgo '] = detalle.nuPuntaRes;
                    obj['Nivel de Riesgo Residual'] = detalle.deSeveridadRes;
                    obj['¿Aplica debida diligencia?'] = this.obtenerDescIdDebidaDiligencia(detalle.idDebidaDilig);
                    obj['Cargo relacionado con el riesgo'] = detalle.decargoRiesgo;
                    obj['Socio de negocio relacionado con el riesgo'] = detalle.deSociodelRiesgo;
                    obj['Estrategia de Respuesta'] = this.obtenerDescIdEstrRespuesta(detalle.idRespEstrategia);
                    obj['Código del Plan de Acción'] = detalle.codPlanAccion;
                    obj['Descripción del Plan de Acción'] = detalle.dePlanAccion;
                    obj['Responsable de realizar el Plan de Acción'] = detalle.idRespPlanAccion;
                    obj['Fecha planificada de finalización del Plan de Acción'] = this.invertirFecha(detalle.feFinPlanAccion);
                    obj['Estado de Plan de Acción'] = this.obtenerDescIdEstAccion(detalle.idEstadoPlanAccion);
                    obj['¿Se culminó el plan de acción?'] = this.obtenerDescIdPlanAccion(detalle.indFinPlanAccion);
                    obj['¿El tratamiento fue eficaz?'] = this.obtenerDescIdTrataEficaz(detalle.inFicaz);
                    obj['Acciones a tomar (En caso el tratamiento culminado no haya sido eficaz)'] = detalle.deAccion;


                    lista.push(obj);
                }

                var worksheet = xlsx.utils.aoa_to_sheet([["DATOS GENERALES DEL RIESGO","","","","","",
                    "EVALUACIÓN DE RIESGO INHERENTE","","","",
                    "CONTROL","","",
                    "EVALUACIÓN DE RIESGO RESIDUAL","","","",
                    "DEBIDA DILIGENCIA","","",
                    "PLAN DE ACCION","","","","","",
                    "EVALUACIÓN DE EFICACIA","",""]]);
                xlsx.utils.sheet_add_json(worksheet,lista,{origin:1,skipHeader: false});

                if(!worksheet['!merges'])
                    worksheet['!merges'] = [];
                worksheet["!merges"].push({s:{r:0,c:0},e:{r:0,c:5}},
                    {s:{r:0,c:6},e:{r:0,c:9}},
                    {s:{r:0,c:10},e:{r:0,c:12}},
                    {s:{r:0,c:13},e:{r:0,c:16}},
                    {s:{r:0,c:17},e:{r:0,c:19}},
                    {s:{r:0,c:20},e:{r:0,c:25}},
                    {s:{r:0,c:26},e:{r:0,c:28}},);


                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
                this.saveAsExcelFile(excelBuffer, 'MatrizAnticorrupcion');
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

    obtenerDescIdProcesoAnalizado(idValorControl:number){
        let valor = "";
        for (let detalle of this.matricesRiesgo){
            for(let lista of detalle.listaProcesos){
                if(lista.idProceso==idValorControl) valor= lista.deProceso
            }
        }

        return valor;
    }

    obtenerDescIdTipRiesgo(idValorControl:number){
        let valor = "";
        for(let lista of this.listaTipoRiesgo){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdDelitoRiesgo(idValorControl:number){
        let valor = "";
        for(let lista of this.listaTipoDelito){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEficaControles(idValorControl:number){
        let valor = "";
        for(let lista of this.listaEficaciaControlesActuales){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdDebidaDiligencia(idValorControl:number){
        let valor = "";
        for(let lista of this.listaIndicadorDebDiligencia){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEstrRespuesta(idValorControl:number){
        let valor = "";
        for(let lista of this.listaEstrategiaRespuesta){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdEstAccion(idValorControl:number){
        let valor = "";
        for(let lista of this.listaidEstadoPlanAccion){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdPlanAccion(idValorControl:number){
        let valor = "";
        for(let lista of this.listaIndicadorFinPlanAccion){
            if(lista.idParametro==idValorControl) valor= lista.nombreParametro
        }
        return valor;
    }

    obtenerDescIdTrataEficaz(idValorControl:string){
        let valor = "";
        for(let lista of this.listaEficazPlanAccion){
            if(lista.deValor1==idValorControl) valor= lista.nombreParametro
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
