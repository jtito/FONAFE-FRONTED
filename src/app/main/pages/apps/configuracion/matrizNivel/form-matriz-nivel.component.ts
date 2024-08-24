import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatrizNivel } from "../../../../../shared/models/matrizNivel";
import { ProcesoMatriz } from "../../../../../shared/models/procesoMatriz";
import { Empresa } from "../../../../../shared/models/empresa";
import { ParametroMatrizNivel } from "../../../../../shared/models/parametroMatrizNivel";
import { Sede } from "../../../../../shared/models/sede";
import { Gerencia } from "../../../../../shared/models/gerencia";
import { MatrizNivelService } from './matriz-nivel.service';
import { AuthLoginService } from '../../../../pages/authentication/auth-login/auth-login.service';
import { Parametro } from "src/app/shared/models/parametro";
import { Proceso } from "src/app/shared/models/proceso";
import { Procesolst } from "src/app/shared/models/procesolst";
import Swal from 'sweetalert2';
import { SubProceso } from "src/app/shared/models/subproceso";
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from "primeng/table";
import { DataLogin } from "src/app/shared/models/data";
import { TipoPerfil } from "src/app/shared/models/tipoPerfil";
import { MessageService } from "primeng/api";


@Component({
    selector: 'app-conf-form-matriz',
    templateUrl: 'form-matriz-nivel.component.html',
    styleUrls: ['matriz-nivel.component.scss']
})

export class FormMatrizNivelComponent implements OnInit {

    formularioMatrizNivel: FormGroup;
    loading: boolean;
    loadingProceso: boolean;
    listaEmpresas: Empresa[];
    listaParametroMatrizNivel: ParametroMatrizNivel[];
    listaTipoMatriz: Parametro[];
    listaSedes: Sede[];
    listaGerencias: Gerencia[];
    matrizNivel: MatrizNivel;
    procesoMatriz: ProcesoMatriz;
    listaDescripcionProceso: string[];
    editar: boolean;
    listaVacia: any[];
    cols: any[];
    colsSub: any[];
    lstProcesos: any[];
    lstSubProcesos: SubProceso[];
    idProcesoMatriz: number = 0;
    procesolst: Procesolst;
    procesolstupd: Procesolst;
    ProcesoSel = -1;
    idMatrizNivel = 0;
    listaEstados: Parametro[];
    EmpresaSel: string;
    SedeEmpresaSel: string;
    idEstado: string;
    listaIndicador: Parametro[];

    idEmpresaSel: number;
    idSedeEmpresaSel: number;
    idContador: number = 0;

    SelectedDes = "";
    SelectedSubDes = "";
    DisplayProcesosel = false;
    DisplaySubProcesosel = false;
    indicadorEstadoProc: boolean;
    indicadorEstadoSub: boolean;
    ver: boolean = false;
    indicadorBaja: number = 1;
    procesoTemp: Proceso;
    SubProcesoTemp: SubProceso;
    idSubContador: number = 0;

    ProcIndex: number = 0;
    SubProcIndex: number = 0;

    mostrarEstadoSub: boolean;
    mostrarEstadoProc: boolean;
    @ViewChild('dt1') dataTable: Table;
    idPerfil: number;
    payload: DataLogin;
    notadmin: boolean = false;

    dataIp: string = "";

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private matrizNivelService: MatrizNivelService, private authLoginService: AuthLoginService, private formBuilder: FormBuilder,
        private messageService: MessageService) {
        this.crearFormulario();
        this.listaParametroMatrizNivel = [];
        this.obtenerListaEstados();
        this.obtenerListaEmpresa();

        this.lstProcesos = [];
        this.lstSubProcesos = [];
        this.procesolst = new Procesolst();
        this.procesolst.lstProcAdd = [];
        this.procesolst.lstProcDel = [];
        this.obtenerListaIndicador();
        this.solverPermissions();
        this.obtenermetodoIP();
    }

    ngOnInit(): void {
        this.editar = false;
        this.mostrarEstadoSub = false;
        this.mostrarEstadoProc = false;
        this.cols = [
            {
                field: 'deProceso',
                header: 'Descripción Proceso',
                class: 'text-center',
                ordenadmiento: 'deProceso',
                headerClass: 'text-center',
                width: '350rem'
            },
            {
                field: 'inMatrizOperacional',
                header: 'Matriz Operacional',
                class: 'text-center',
                ordenadmiento: 'inMatrizOperacional',
                headerClass: 'text-center',
                width: '120rem'
            },
            {
                field: 'inMatrizFraude',
                header: 'Matriz de Fraude',
                class: 'text-center',
                ordenadmiento: 'inMatrizFraude',
                headerClass: 'text-center',
                width: '120rem'
            },
            {
                field: 'inMatrizContinuidad',
                header: 'Matriz de Continuidad',
                class: 'text-center',
                ordenadmiento: 'inMatrizContinuidad',
                headerClass: 'text-center',
                width: '120rem'
            },
            {
                field: 'inMatrizAnticorrupcion',
                header: 'Matriz de Anticorrupción',
                class: 'text-center',
                ordenadmiento: 'inMatrizAnticorrupcion',
                headerClass: 'text-center',
                width: '140rem'
            },
            {
                field: 'inMatrizOportunidad',
                header: 'Matriz de Oportunidades',
                class: 'text-center',
                ordenadmiento: 'inMatrizOportunidad',
                headerClass: 'text-center',
                width: '140rem'
            },
            {
                field: 'inMatrizEvento',
                header: 'Matriz de Eventos de Pérdida',
                class: 'text-center',
                ordenadmiento: 'inMatrizEvento',
                headerClass: 'text-center',
                width: '140rem'
            },
            {
                field: 'indicadorBaja',
                header: 'Estado',
                class: 'text-center',
                ordenadmiento: 'indicadorBaja',
                headerClass: 'text-center',
                width: '120rem'
            },
        ];

        this.colsSub = [
            // {
            //     field: 'deEmpresa',
            //     header: 'Empresa',
            //     class: 'text-center',
            //     ordenadmiento: 'deEmpresa',
            //     headerClass: 'text-center w-25'
            // },
            {
                field: 'deSubProceso',
                header: 'Descripción Subproceso',
                class: 'text-center',
                ordenadmiento: 'deSubProceso',
                headerClass: 'text-center w-50'
            },
            {
                field: 'indicadorBaja',
                header: 'Estado',
                class: 'text-center',
                ordenadmiento: 'indicadorBaja',
                headerClass: 'text-center w-10'
            },
        ];

        this.listaVacia = [
            { texto1: '', text2: '' },
            { texto1: '', text2: '' },
            { texto1: '', text2: '' },
        ]

        this.activatedRoute.params.subscribe(params => {
            if (params.idProcesoMatriz) {
                this.loading = true;
                this.idProcesoMatriz = params.idProcesoMatriz;

                this.obtenerProcesoMatriz(this.idProcesoMatriz);
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.formularioMatrizNivel.enable();
                this.loadingProceso = true;


            } else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {

                this.editar = false;
                this.formularioMatrizNivel.enable();


            } else {

                this.ver = true;
                this.loadingProceso = true;
                this.formularioMatrizNivel.disable();

            }


        });

    }

    solverPermissions() {
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if (this.idPerfil == TipoPerfil.admin) {
            this.notadmin = false;
        }
        else {
            this.notadmin = true;
            this.formularioMatrizNivel.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
            this.formularioMatrizNivel.get('empresa').disable();
        }
    }

    private crearFormulario(): void {
        console.log('Se construyo el form');
        this.formularioMatrizNivel = this.formBuilder.group({
            empresa: ['', Validators.required],
            // paramMatrizNivel: ['', Validators.required],
            // tipoMatriz: ['', Validators.required],
            // sede: ['', Validators.required],
            // gerencia: ['', Validators.required],
            descripcionProceso: [''],
            idEstado: '0'
        });
    }

    obtenerListaIndicador() {
        return this.matrizNivelService.obtenerListaIndicador().subscribe(resp => {

            this.listaIndicador = resp.listaParametros;

            if (this.listaIndicador.length > 0) {
                for (let i = 0; i < this.listaIndicador.length; i++) {
                    if (this.listaIndicador[i].nombreParametro == 'No') {
                        //   this.listaIndicador.splice(i,1);
                        this.listaIndicador[i].nombreParametro = '';
                    }
                }
                this.loading = false;
            } else {
                this.loading = false;
                this.listaIndicador = [];
            }

        });
    }

    obtenerListaEstados() {

        this.matrizNivelService.obtenerListaEstado().subscribe(
            resp => {
                console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaParametros));
                this.listaEstados = resp.listaParametros;

            }
        );

    }

    onChangeEstado(deviceValue): void {
        this.idEstado = deviceValue.target.value;
    }

    //Parametros Para editar


    obtenerProcesoMatriz(idProcesoMatriz): void {

        this.matrizNivelService.obtenerProcesoMatriz(idProcesoMatriz).subscribe(
            resp => {

                this.procesoMatriz = resp.ProcesoMatriz;

                this.idEstado = this.procesoMatriz.indicadorBaja;

                //console.log("El id Matriz Nivel " + this.procesoMatriz);
                const idEmpresa = this.procesoMatriz.idEmpresa;
                const idProcesoMatriz = this.procesoMatriz.idProcesoMatriz;

                this.formularioMatrizNivel.get('empresa').setValue(this.procesoMatriz.idEmpresa);
                this.formularioMatrizNivel.get('empresa').disable();
                this.formularioMatrizNivel.get('idEstado').setValue(this.procesoMatriz.indicadorBaja);

                this.obtenerListProceso(idProcesoMatriz);

            }
        );

    }

    obtenerListProceso(idEmpresa) {

        this.matrizNivelService.obtenerProcesosMatriz(idEmpresa).subscribe(
            resp => {
                //console.log('lista de Proceso : ' + JSON.stringify(resp.listaProceso));
                this.procesolst.lstProcAct = resp.listaProceso;

                for (var j = 0; j < this.procesolst.lstProcAct.length; j++) {

                    this.procesolst.lstProcAct[j].online = 1;

                    for (var i = 0; i < this.procesolst.lstProcAct[j].lstProc.length; i++) {

                        this.procesolst.lstProcAct[j].lstProc[i].online = 1;

                    }

                }

                this.lstProcesos = resp.listaProceso;

                for (var j = 0; j < this.lstProcesos.length; j++) {

                    this.lstProcesos[j].online = 1;

                }

                this.loading = false;

                this.loadingProceso = false;

                //this.formularioMatrizNivel.get('empresa').setValue(Number(idEmpresa));

                this.formularioMatrizNivel.get('empresa').disable();
            }
        );

    }

    obtenerListaEmpresa() {

        this.matrizNivelService.obtenerListaEmpresa().subscribe(
            resp => {
                console.log('lista de Tipo Matriz : ' + JSON.stringify(resp.listaEmpresas));
                this.listaEmpresas = resp.listaEmpresas.filter(empresa =>
                    empresa.indicadorBaja == this.indicadorBaja
                );


            }
        );

    }

    onChangeEmpresa(input) {

        const idEmpresa = input.target.value;
        this.idEmpresaSel = idEmpresa;

    }

    SelectProceso(procesoTemp: Proceso, event) {

        let index = this.findIndexById(procesoTemp);

        var id = "check" + index;
        var checkbox = <HTMLInputElement>document.getElementById(id);
        // console.log("Index " + index + " ev " + checkbox.checked);
        if (checkbox.checked) {

            this.ProcesoSel = index;


            if (this.editar || this.ver) {

                for (var j = 0; j < this.procesolst.lstProcAct.length; j++) {

                    if (j != index) {

                        var id1 = "check" + j;
                        var checkboxnot = <HTMLInputElement>document.getElementById(id1);
                        if (checkboxnot != null) {
                            checkboxnot.checked = false;
                        }

                    }


                }

                if (this.procesolst.lstProcAct[this.ProcesoSel].online == 0) {

                    if (this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd == undefined) {

                        this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd = [];
                        this.lstSubProcesos = [];

                    } else {

                        this.lstSubProcesos = this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd;

                    }


                } else {
                    this.lstSubProcesos = this.procesolst.lstProcAct[this.ProcesoSel].lstProc;


                }


            } else {

                for (var j = 0; j < this.procesolst.lstProcAdd.length; j++) {

                    if (j != index) {

                        var id1 = "check" + j;
                        var checkboxnot = <HTMLInputElement>document.getElementById(id1);
                        if (checkboxnot != null) {
                            checkboxnot.checked = false;
                        }
                    }


                }

                if (this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd == undefined) {

                    this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd = [];
                    this.lstSubProcesos = [];

                } else {
                    this.lstSubProcesos = this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd;

                }

            }


        } else {

            this.ProcesoSel = -1;
            this.lstSubProcesos = [];

        }

    }

    agregarDescripcionProceso(): void {

        let procesoExistente = false;

        if (this.formularioMatrizNivel.invalid) {
            return Object.values(this.formularioMatrizNivel.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const idEmpresa = this.formularioMatrizNivel.get("empresa").value;
        const deProceso = this.formularioMatrizNivel.get("descripcionProceso").value;
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";
        const indicadorBaja = '1';

        if (deProceso !== "") {

            for (var j = 0; j < this.lstProcesos.length; j++) {

                if (this.lstProcesos[j].deProceso.toUpperCase() == deProceso.toUpperCase()) {
                    Swal.fire('Ocurrió un error', "El proceso ya existe", 'error');
                    procesoExistente = true;
                }

            }

            /*for (var j = 0; j < this.listaEmpresas.length; j++) {

                if (this.listaEmpresas[j].idEmpresa == idEmpresa) {

                    this.EmpresaSel = this.listaEmpresas[j].nombreCortoEmpresa;
                }
            }*/

            if (!procesoExistente) {

                this.idContador = this.idContador + 1;

                var procesoBody: Proceso = {
                    idEmpresa: idEmpresa,
                    deProceso: deProceso,
                    usuarioCreacion: usuarioCreacion,
                    ipCreacion: ipCreacion,
                    indicadorBaja: indicadorBaja,
                    lstProcAdd: [],
                    idProcTemp: this.idContador,
                    //deEmpresa: this.EmpresaSel,
                    // deSedeEmpresa: this.SedeEmpresaSel
                }

                if (this.editar) {

                    procesoBody.idProcesoMatriz = Number(this.procesoMatriz.idProcesoMatriz);
                    procesoBody.online = 0;

                    this.procesolst.lstProcAct.push(procesoBody);

                    this.lstProcesos = [...this.procesolst.lstProcAct];

                    // console.log(this.procesolst.lstProcAct);

                } else {

                    this.procesolst.lstProcAdd.push(procesoBody);
                    //this.lstProcesos.push(procesoBody);

                    this.lstProcesos = [...this.procesolst.lstProcAdd];

                    // console.log(this.procesolst.lstProcAdd);
                }

                this.formularioMatrizNivel.get('descripcionProceso').setValue("");
            }


        } else {
            Swal.fire("Debe de ingresar la descripción del proceso");
        }

        this.ProcesoSel = -1;

    }

    agregarDescripcionSubProceso(): void {
        let subProcesoExistente = false;

        if (this.ProcesoSel > -1) {

            const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

            const deProceso = (document.getElementById('idSubDescripcion') as HTMLInputElement).value;
            const usuarioCreacion = datosToken.data.username;
            const ipCreacion = this.dataIp; //"127.0.0.1";
            const indicadorBaja = 1;

            if (deProceso !== "") {

                for (var j = 0; j < this.lstSubProcesos.length; j++) {

                    if (this.lstSubProcesos[j].deSubProceso.toUpperCase() == deProceso.toUpperCase()) {
                        Swal.fire('Ocurrió un error', "El subproceso ya existe", 'error');
                        subProcesoExistente = true;
                    }

                }

                if (!subProcesoExistente) {

                    var subProcesoBody: SubProceso = {
                        deSubProceso: deProceso,
                        usuarioCreacion: usuarioCreacion,
                        ipCreacion: ipCreacion,
                        indicadorBaja: indicadorBaja,
                        deEmpresa: this.EmpresaSel,
                        deSedeEmpresa: this.SedeEmpresaSel
                    };


                    if (this.editar) {

                        // procesoBody.idMatrizNivel = Number(this.matrizNivel.idMatrizNivel);
                        subProcesoBody.online = 0;

                        if (this.procesolst.lstProcAct[this.ProcesoSel].online == 0) {

                            if (this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd == undefined) {

                                this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd = [];

                            } else {

                                this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd.push(subProcesoBody);

                            }

                        } else {

                            if (this.procesolst.lstProcAct[this.ProcesoSel].lstProc == undefined) {

                                this.procesolst.lstProcAct[this.ProcesoSel].lstProc = [];

                            } else {

                                this.procesolst.lstProcAct[this.ProcesoSel].lstProc.push(subProcesoBody);
                            }

                            this.lstSubProcesos = [...this.procesolst.lstProcAct[this.ProcesoSel].lstProc];
                            console.log(this.procesolst.lstProcAct[this.ProcesoSel].lstProc);

                        }

                    } else {

                        if (this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd == undefined) {

                            this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd = [];

                        } else {

                            this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd.push(subProcesoBody);
                        }

                        this.lstSubProcesos = [...this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd];
                        console.log(this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd);
                    }

                    (document.getElementById('idSubDescripcion') as HTMLInputElement).value = "";
                }

                console.log("El lst sub " + this.lstSubProcesos.length);
            } else {
                Swal.fire("Debe de ingresar la descripción del subproceso");
            }

        } else {
            Swal.fire("Debe seleccionar un proceso");

        }

    }

    ModificarDescripcionProceso(procesoTemp: Proceso) {

        this.procesoTemp = procesoTemp;

        /*if (this.editar) {

            this.ProcIndex = index;
            this.DisplayProcesosel = true;
            this.SelectedDes = this.procesolst.lstProcAct[this.ProcIndex].deProceso;
            this.indicadorEstadoProc = this.procesolst.lstProcAct[this.ProcIndex].indicadorBaja == '0' ? false :true;
            this.mostrarEstadoProc = this.procesolst.lstProcAct[this.ProcIndex].indicadorBaja == '0';

        } else {

            this.ProcIndex = index;
            this.DisplayProcesosel = true;
            this.SelectedDes = this.procesolst.lstProcAdd[this.ProcIndex].deProceso;
            this.indicadorEstadoProc = this.procesolst.lstProcAdd[this.ProcIndex].indicadorBaja == '0' ? false :true;
            this.mostrarEstadoProc = this.procesolst.lstProcAdd[this.ProcIndex].indicadorBaja == '0';

        }*/

        this.DisplayProcesosel = true;
        this.SelectedDes = this.procesoTemp.deProceso;
        this.indicadorEstadoProc = this.procesoTemp.indicadorBaja == '0' ? false : true;
        this.mostrarEstadoProc = this.procesoTemp.indicadorBaja == '0';

    }

    findIndexById(procesoTemp: Proceso): number {
        let index = -1;

        if (this.editar) {

            if (procesoTemp.idProcTemp != null) {

                for (let i = 0; i < this.procesolst.lstProcAct.length; i++) {
                    if (this.procesolst.lstProcAct[i].idProcTemp === procesoTemp.idProcTemp) {
                        index = i;
                        break;
                    }
                }

            } else {

                for (let i = 0; i < this.procesolst.lstProcAct.length; i++) {
                    if (this.procesolst.lstProcAct[i].idProceso === procesoTemp.idProceso) {
                        index = i;
                        break;
                    }
                }

            }

        } else {

            if (procesoTemp.idProcTemp != null) {

                for (let i = 0; i < this.procesolst.lstProcAdd.length; i++) {
                    if (this.procesolst.lstProcAdd[i].idProcTemp === procesoTemp.idProcTemp) {
                        index = i;
                        break;
                    }
                }

            } else {

                for (let i = 0; i < this.procesolst.lstProcAdd.length; i++) {
                    if (this.procesolst.lstProcAdd[i].idProceso === procesoTemp.idProceso) {
                        index = i;
                        break;
                    }
                }

            }

        }

        return index;
    }

    ModificarProceso() {

        /*if (this.editar) {

            this.procesolst.lstProcAct[this.ProcIndex].deProceso = this.SelectedDes;
            this.procesolst.lstProcAct[this.ProcIndex].indicadorBaja = this.indicadorEstadoProc? '1': '0';
            this.DisplayProcesosel = false;
            this.SelectedDes = "";

        } else {

            this.procesolst.lstProcAdd[this.ProcIndex].deProceso = this.SelectedDes;
            this.DisplayProcesosel = false;
            this.SelectedDes = "";

        }*/

        if (this.editar) {

            this.procesolst.lstProcAct[this.findIndexById(this.procesoTemp)].deProceso = this.SelectedDes;
            this.procesolst.lstProcAct[this.findIndexById(this.procesoTemp)].indicadorBaja = this.indicadorEstadoProc ? '1' : '0';
            this.DisplayProcesosel = false;
            this.SelectedDes = "";

        } else {

            this.procesolst.lstProcAdd[this.findIndexById(this.procesoTemp)].deProceso = this.SelectedDes;
            this.DisplayProcesosel = false;
            this.SelectedDes = "";

        }

    }


    ModificarDescripcionSubProceso(index) {

        if (this.editar) {


            if (this.procesolst.lstProcAct[this.ProcesoSel].online == 0) {

                this.SubProcIndex = index;
                this.DisplaySubProcesosel = true;
                this.SelectedSubDes = this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd[index].deSubProceso;


            } else {

                this.SubProcIndex = index;
                this.DisplaySubProcesosel = true;
                this.SelectedSubDes = this.procesolst.lstProcAct[this.ProcesoSel].lstProc[index].deSubProceso;
                this.indicadorEstadoSub = this.procesolst.lstProcAct[this.ProcesoSel].lstProc[index].indicadorBaja == 0 ? false : true;
                this.mostrarEstadoSub = this.procesolst.lstProcAct[this.ProcesoSel].lstProc[index].indicadorBaja == 0;

            }


        } else {

            this.SubProcIndex = index;
            this.DisplaySubProcesosel = true;
            this.SelectedSubDes = this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd[index].deSubProceso;

        }

    }

    ModificarSubProceso() {
        if (this.editar) {


            if (this.procesolst.lstProcAct[this.ProcesoSel].online == 0) {

                this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd[this.SubProcIndex].deSubProceso = this.SelectedSubDes;
                this.DisplaySubProcesosel = false;
                this.SelectedSubDes = "";


            } else {

                this.procesolst.lstProcAct[this.ProcesoSel].lstProc[this.SubProcIndex].deSubProceso = this.SelectedSubDes;
                this.procesolst.lstProcAct[this.ProcesoSel].lstProc[this.SubProcIndex].indicadorBaja = this.indicadorEstadoSub ? 1 : 0;
                this.DisplaySubProcesosel = false;
                this.SelectedSubDes = "";

            }


        } else {

            this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd[this.SubProcIndex].deSubProceso = this.SelectedSubDes;
            this.DisplaySubProcesosel = false;
            this.SelectedSubDes = "";

        }

    }

    obtenerValorEstadoProc(checked): void {
        this.indicadorEstadoProc = checked.checked;
    }

    obtenerValorEstadoSub(checked): void {
        this.indicadorEstadoSub = checked.checked;
    }

    eliminarDescripcionProceso(procesoTemp: Proceso) {

        /*if (this.editar) {

            if (this.lstProcesos[index].online == 0) {

                if (this.procesolst.lstProcAct[index].lstProcAdd.length == 0){
                    this.lstProcesos.splice(index, 1);
                    this.procesolst.lstProcAct.splice(index, 1);
                }else{
                    Swal.fire("Primero debe eliminar los subprocesos");
                }  

            } else {
                this.procesolst.lstProcAct[index].indicadorBaja = '0';
                this.lstProcesos[index].indicadorBaja = 0;
            }

        } else {

            if (this.procesolst.lstProcAdd[index].lstProcAdd.length == 0){
                this.lstProcesos.splice(index, 1);
                this.procesolst.lstProcAdd.splice(index, 1);
            }else{
                Swal.fire("Primero debe eliminar los subprocesos");
            }  

        }*/
        console.log(procesoTemp);
        let index = this.findIndexById(procesoTemp);
        console.log('Selecciono la fila => ' + index);
        if (this.editar) {
            console.log('idProceso :' + procesoTemp.idProceso);
            if (procesoTemp.idProceso == null) {
                console.log('TEST1');
                console.log(this.procesolst.lstProcAct[index].lstProcAdd.length);
                if (this.procesolst.lstProcAct[index].lstProcAdd.length == 0) {
                    this.lstProcesos.splice(index, 1);
                    this.procesolst.lstProcAct.splice(index, 1);
                    this.messageService.add({ severity: 'success', summary: '¡Eliminación exitosa!', detail: 'El proceso se eliminó correctamente', life: 3000 });
                } else {
                    Swal.fire("Primero debe eliminar los subprocesos");
                }

            } else {
                console.log('TEST2');
                console.log('Cantidad lst proceso act : '+this.procesolst.lstProcAct[index].lstProc.length);
                if (this.procesolst.lstProcAct[index].lstProc.length == 0) { // SI EL PROCESO NO CONTIENE SUBPROCESO
                    if (this.procesolst.lstProcAct[index].indicadorBaja == '0') { //ELIMINAR PROCESO
                        Swal.fire({
                            title: '¿Está seguro de eliminar el proceso de la matriz?',
                            showCancelButton: true,
                            confirmButtonText: `Eliminar`,
                            cancelButtonText: `Cancelar`,
                            allowOutsideClick: () => !Swal.isLoading(),
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.procesolst.lstProcAct[index].indicadorBaja = '2';
                                this.lstProcesos[index].indicadorBaja = 2;
                                this.messageService.add({ severity: 'success', summary: '¡Eliminación exitosa!', detail: 'El proceso se eliminó correctamente', life: 3000 });
                            }
                        });

                    } else if (this.procesolst.lstProcAct[index].indicadorBaja == '1') { //INACTIVAR PROCESO
                        this.procesolst.lstProcAct[index].indicadorBaja = '0';
                        this.lstProcesos[index].indicadorBaja = 0;
                        this.messageService.add({ severity: 'success', summary: 'Inactivo', detail: 'El proceso se inactivó correctamente', life: 3000 });
                    }
                    console.log("Proceso se cambio a : " + this.lstProcesos[index].indicadorBaja)
                } else {
                    Swal.fire("Primero debe eliminar los subprocesos");
                }
            }

        } else {
            console.log('TEST3');
            if (this.procesolst.lstProcAdd[index].lstProcAdd.length == 0) {
                this.lstProcesos.splice(index, 1);
                this.procesolst.lstProcAdd.splice(index, 1);
                this.messageService.add({ severity: 'success', summary: '¡Eliminación exitosa!', detail: 'El proceso se eliminó correctamente', life: 3000 });
            } else {
                Swal.fire("Primero debe eliminar los subprocesos");
            }

        }

        this.lstProcesos = [...this.lstProcesos];

    }

    eliminarDescripcionSubProceso(index) {

        if (this.editar) {
            console.log('this.editar');
            if (this.lstSubProcesos[index].online == 0) {
                console.log('TEST1det');
                if (this.procesolst.lstProcAct[this.ProcesoSel].online == 0) {
                    this.lstSubProcesos.splice(index, 1);
                    this.procesolst.lstProcAct[this.ProcesoSel].lstProcAdd.splice(index, 1);
                } else {
                    this.lstSubProcesos.splice(index, 1);
                }

            } else {
                console.log('TEST2det');
                if (this.lstSubProcesos[index].indicadorBaja == 0) {
                    Swal.fire({
                        title: '¿Está seguro de eliminar el sub proceso de la matriz?',
                        showCancelButton: true,
                        confirmButtonText: `Eliminar`,
                        cancelButtonText: `Cancelar`,
                        allowOutsideClick: () => !Swal.isLoading(),
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.procesolst.lstProcAct[this.ProcesoSel].lstProc[index].indicadorBaja = 2;
                            this.lstSubProcesos[index].indicadorBaja = 2;
                            this.messageService.add({
                                severity: 'success', summary: '¡Eliminación exitosa!',
                                detail: 'El Sub proceso se eliminó correctamente', life: 3000
                            });
                        }
                    });


                } else if (this.lstSubProcesos[index].indicadorBaja == 1) {
                    this.procesolst.lstProcAct[this.ProcesoSel].lstProc[index].indicadorBaja = 0;
                    this.lstSubProcesos[index].indicadorBaja = 0;
                    this.messageService.add({
                        severity: 'success', summary: 'Inactivo',
                        detail: 'El sub proceso se inactivó correctamente', life: 3000
                    });
                }
                console.log("Sub Proceso cambio a : " + this.lstProcesos[index].indicadorBaja)
                //console.log("El Sub proc Eliminado " + JSON.stringify(this.procesolst.lstProcAct[this.ProcesoSel].lstProc[index]));

            }

        } else {
            this.procesolst.lstProcAdd[this.ProcesoSel].lstProcAdd.splice(index, 1);
            this.lstSubProcesos.splice(index, 1);
        }

        //this.messageService.add({ severity: 'success', summary: '¡Eliminación exitosa!', detail: 'El subproceso se eliminó correctamente', life: 3000 });

        this.lstSubProcesos = [...this.lstSubProcesos];

    }

    registrarProcesoMatriz(): void {

        if (this.formularioMatrizNivel.invalid) {
            return Object.values(this.formularioMatrizNivel.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        const idEmpresa = this.formularioMatrizNivel.get("empresa").value;
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; //"127.0.0.1";

        var procesoMatrizBody: ProcesoMatriz = {
            idEmpresa: idEmpresa,
            usuarioCreacion: usuarioCreacion,
            ipCreacion: ipCreacion,
            indicadorBaja: "1",
        };

        if (this.procesolst.lstProcAdd.length > 0) {

            Swal.fire({
                title: '¿Está seguro de crear el proceso por matriz?',
                showCancelButton: true,
                confirmButtonText: `Crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos creando el proceso por matriz',
                        allowOutsideClick: () => !Swal.isLoading(),
                        allowEscapeKey: () => !Swal.isLoading()
                    });
                    Swal.showLoading();

                    this.matrizNivelService.registrarNuevoProcesoMatriz(procesoMatrizBody).subscribe(
                        resp => {
                            console.log(resp);
                            if (resp.idProcesoMatriz !== 0) {
                                console.log("REG: MATRIZ " + JSON.stringify(resp));

                                this.idProcesoMatriz = resp.idProcesoMatriz;


                                for (var j = 0; j < this.procesolst.lstProcAdd.length; j++) {

                                    this.procesolst.lstProcAdd[j].idProcesoMatriz = this.idProcesoMatriz;

                                    // for (var i = 0; i < this.procesolst.lstProcAdd[j].lstProcAdd.length; i++) {

                                    //     this.procesolst.lstProcAdd[j].lstProcAdd[i].idProcesoMatriz = this.idProcesoMatriz;

                                    // }

                                }

                                if (this.procesolst.lstProcAdd.length > 0) {
                                    console.log("LA MATRIZ NIVEL PROCESO " + JSON.stringify(this.procesolst));

                                    this.matrizNivelService.registrarProceso(this.procesolst).subscribe(
                                        resp => {
                                            console.log(resp);
                                            if (resp.idProceso !== 0) {
                                                if (Swal.isLoading()) {
                                                    Swal.close();
                                                }

                                                Swal.fire('¡Creación exitosa!', "El proceso por matriz se creó con éxito", 'success');
                                                this.router.navigate(['/pages', 'main', 'configuracion', 'matrizNivel']);


                                            } else {
                                                if (Swal.isLoading()) {
                                                    Swal.close();
                                                    Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                                                }
                                            }
                                        }
                                    );
                                } else {
                                    if (Swal.isLoading()) {
                                        Swal.close();
                                    }

                                    Swal.fire('¡Creación exitosa!', "El proceso por matriz se creó con éxito", 'success');
                                    this.router.navigate(['/pages', 'main', 'configuracion', 'matrizNivel']);

                                }

                            } else {
                                if (Swal.isLoading()) {
                                    Swal.close();
                                    Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                                }
                            }
                        }
                    );
                }
            });
        } else {
            Swal.fire("Debe de ingresar los procesos");
        }
    }

    actualizarProcesoMatriz(): void {


        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.procesolstupd = new Procesolst();
        this.procesolstupd = this.procesolst;
        this.procesolstupd.lstProcAdd = this.procesolst.lstProcAdd;
        this.procesolstupd.lstProcAct = this.procesolst.lstProcAct;

        console.log(JSON.stringify(this.procesolstupd));

        for (var j = 0; j < this.procesolstupd.lstProcAct.length; j++) {

            this.procesolstupd.lstProcAct[j].usuarioModificacion = datosToken.data.username;
            this.procesolstupd.lstProcAct[j].ipModificacion = this.dataIp; //"127.0.0.1";

            if (this.procesolstupd.lstProcAct[j].online == 0) {

                this.procesolstupd.lstProcAdd.push(this.procesolstupd.lstProcAct[j]);

            }
            if (this.procesolstupd.lstProcAct[j].lstProc != undefined) {

                for (var i = 0; i < this.procesolstupd.lstProcAct[j].lstProc.length; i++) {

                    if (this.procesolstupd.lstProcAct[j].lstProc[i].online == 0) {
                        if (this.procesolstupd.lstProcAct[j].lstProcAdd == undefined) {
                            this.procesolstupd.lstProcAct[j].lstProcAdd = [];
                            this.procesolstupd.lstProcAct[j].lstProcAdd.push(this.procesolstupd.lstProcAct[j].lstProc[i])
                        } else {
                            this.procesolstupd.lstProcAct[j].lstProcAdd.push(this.procesolstupd.lstProcAct[j].lstProc[i]);

                        }


                    }

                }

            }

        }

        Swal.fire({
            title: '¿Está seguro de actualizar el proceso por matriz?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando el proceso por matriz',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                var procesoMatrizBody: ProcesoMatriz = this.procesoMatriz;
                procesoMatrizBody.indicadorBaja = this.idEstado;
                this.matrizNivelService.actualizarProcesoMatriz(procesoMatrizBody).subscribe(
                    resp => {

                        this.matrizNivelService.actualizarProcesos(this.procesolstupd).subscribe(
                            resp => {
                                console.log(resp);
                                if (resp.idClase !== 0) {
                                    if (Swal.isLoading()) {
                                        Swal.close();
                                    }
                                    Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');

                                    this.router.navigate(['/pages', 'main', 'configuracion', 'matrizNivel']);

                                } else {
                                    if (Swal.isLoading()) {
                                        Swal.close();
                                        Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                                    }
                                }
                            }
                        );

                    }
                );

                console.log("ACT " + JSON.stringify(this.procesolstupd));
            }
        });
    }

    //VALIDACION

    get empresaNoValido(): boolean {
        return this.formularioMatrizNivel.get('empresa').invalid && this.formularioMatrizNivel.get('empresa').touched;
    }

    get sedeNoValido(): boolean {
        return this.formularioMatrizNivel.get('sede').invalid && this.formularioMatrizNivel.get('sede').touched;
    }

    get paramMatrizNivelNoValido(): boolean {
        return this.formularioMatrizNivel.get('paramMatrizNivel').invalid && this.formularioMatrizNivel.get('paramMatrizNivel').touched;
    }

    get tipoMatrizNoValido(): boolean {
        return this.formularioMatrizNivel.get('tipoMatriz').invalid && this.formularioMatrizNivel.get('tipoMatriz').touched;
    }

    get gerenciaNoValido(): boolean {
        return this.formularioMatrizNivel.get('gerencia').invalid && this.formularioMatrizNivel.get('gerencia').touched;
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
