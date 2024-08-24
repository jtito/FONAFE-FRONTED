import { Component, OnInit } from "@angular/core";
import { Encuesta } from "../../../../../shared/models/encuesta";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pregunta } from "../../../../../shared/models/pregunta";
import { Periodo } from "../../../../../shared/models/periodo";
import { Empresa } from "../../../../../shared/models/empresa";
import { EncuestaService } from "./encuesta.service";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreguntaLista } from "src/app/shared/models/preguntaLista";
import { Parametro } from "src/app/shared/models/parametro";
import { Respuesta } from "src/app/shared/models/respuesta";
import { AuthLoginService } from "../../../authentication/auth-login/auth-login.service";

@Component({
    selector: 'app-conf-form-encuesta',
    templateUrl: 'form-encuesta.component.html'
})
export class FormEncuestaComponent implements OnInit {

    formularioEncuesta: FormGroup;
    formularioPregunta: FormGroup;
    formularioRespuesta: FormGroup;
    pregunta: Pregunta[];
    respuesta: Respuesta[];
    encuesta: Encuesta;
    listaTipoPregunta: Parametro[];
    listaGrupoPregunta: Parametro[];
    listaPeriodos: Periodo[];
    listaEmpresas: Empresa[];
    idEmpresa: number = 0;
    idAnio: number = 0;
    idEncuesta: number = 0;
    loading: boolean;
    editar: boolean;
    cols: any[];
    colsRespuesta: any[];
    idTipoPregunta: number = 0;
    deTipoPregunta: string;
    deGrupoPregunta: string;
    fechaEncuesta: string;
    fechaFinEncuesta: string;

    indicadorAlternativa: boolean;

    popUpPregunta: boolean;
    popUpRespuesta: boolean;
    listaPreguntas: any[];
    listaRespuestas: Respuesta[];
    preguntasSel = -1;
    preguntasList: PreguntaLista;
    preguntaTextual = 0;

    indicadorEstadoPreg: boolean;
    indicadorEstadoResp: boolean;
    listaEstados: Parametro[];
    preguntaIndex: number = 0;
    respuestaIndex: number = 0;
    indicePreg: number = 0;
    indiceResp: number = 0;
    idEstado: string;
    mostrarEstado: boolean;
    fechaIniEncuesta: Date;
    dataIp: string = "";

    // linkEncuestaBase: String = 'http://localhost:4200/presentation/';
    linkEncuestaBase: String = 'http://wari.fonafe.gob.pe:8080/EncuestaGestionRiesgo/presentation/';

    constructor(private formBuilder: FormBuilder, private router: Router,
        private encuestaService: EncuestaService, private activatedRoute: ActivatedRoute,
        private authLoginService: AuthLoginService) {
        this.crearFormulario();
        this.crearFormularioPregunta();
        this.crearFormularioRespuesta();
        // this.obtenerListaEmpresas();
        this.obtenerListaTipoPreguntas();
        this.obtenerListaGrupoPreguntas();
        this.obtenerListaEstadoParametros();
        this.listaPreguntas = [];
        this.listaRespuestas = [];
        this.preguntasList = new PreguntaLista();
        this.preguntasList.listaPreguntas = [];
        this.obtenermetodoIP();
    }

    ngOnInit(): void {
        this.editar = false;

        this.loading = false;

        this.indicadorAlternativa = false;

        this.mostrarEstado = true;

        this.cols = [
            { field: 'dePregunta', header: 'Pregunta', class: 'text-center', ordenadmiento: 'dePregunta', headerClass: 'text-center w-30' },
            { field: 'deTipoPregunta', header: 'Tipo de pregunta', class: 'text-center', ordenadmiento: 'deTipoPregunta', headerClass: 'text-center w-10' },
            { field: 'puntaje', header: 'Puntaje', class: 'text-center', ordenadmiento: 'puntaje', headerClass: 'text-center w-5' },
            { field: 'deGrupoPregunta', header: 'Grupo', class: 'text-center', ordenadmiento: 'deGrupoPregunta', headerClass: 'text-center' },
            { field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja', headerClass: 'text-center' },
        ];

        this.colsRespuesta = [
            { field: 'deRespuesta', header: 'Respuesta', class: 'text-center', ordenadmiento: 'deRespuesta', headerClass: 'text-center w-50' },
            { field: 'inAlternativa', header: 'Alternativa', class: 'text-center', ordenadmiento: 'inAlternativa', headerClass: 'text-center w-10' },
            { field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja', headerClass: 'text-center w-10' }
        ];

        this.activatedRoute.params.subscribe(params => {
            if (params.idEncuesta) {
                this.loading = true;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.formularioEncuesta.enable();
            }
            else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.editar = false;
                this.formularioEncuesta.enable();

            }
            else {
                //this.cargarEncuesta();
                this.formularioEncuesta.disable();

            }

        });

        this.cargarEncuesta()
    }

    crearFormulario(): void {
        this.formularioEncuesta = this.formBuilder.group({
            // idEmpresa: ['', Validators.required],
            // idPeriodo: [''],
            feEncuesta: ['', Validators.required],
            feFinEncuesta: ['', Validators.required],
            tituloEncuesta: ['', Validators.required],
            subtituloEncuesta: [''],
            textoEncuesta: [''],
            contTextoEncuesta: [''],
            idEstado: ['0'],
            linkEncuesta: ['']
        });
    }

    obtenerListaEstadoParametros(): void {
        this.encuestaService.obtenerListaEstadoParametros().subscribe(
            resp => {
                this.listaEstados = resp.listaParametros;
            }
        );
    }
    // obtenerListaEmpresas(): void {
    //     this.encuestaService.obtenerListaEmpresas().subscribe(
    //         resp => {
    //             this.listaEmpresas = resp.listaEmpresas;
    //             console.log('lista de empresas : ', resp.listaEmpresas);
    //         }
    //     );
    // }

    // obtenerListaPeriodos(empresa: number, anio: number): void {
    //     this.encuestaService.obtenerListaPeriodos(empresa,anio).subscribe(
    //         resp => {
    //             this.listaPeriodos = resp.listaPeriodos;
    //             console.log('lista de periodos : ', resp.listaPeriodos);
    //         }
    //     );
    // }

    obtenerListaTipoPreguntas(): void {
        this.encuestaService.obtenerListaTipoPreguntas().subscribe(
            resp => {
                this.listaTipoPregunta = resp.listaParametros;
            }
        );
    }

    obtenerListaGrupoPreguntas(): void {
        this.encuestaService.obtenerListaGrupoPreguntas().subscribe(
            resp => {
                this.listaGrupoPregunta = resp.listaParametros;
            }
        );
    }

    // onChangeEmpresa(deviceValue) {
    //     this.idEmpresa = deviceValue.target.value;
    //     console.log('empresa: ' + this.idEmpresa);
    //     console.log('anio: ' + this.idAnio);
    //     this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
    // }

    onSelectFechaEncuesta(event): void {
        let d = new Date(Date.parse(event));
        this.fechaIniEncuesta = new Date(d.setHours(0, 0, 0, 0));
        console.log(this.fechaIniEncuesta);

        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);
        console.log(fechaActual);

     /*    this.fechaEncuesta = ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        console.log('fecha encuensta: '+this.fechaEncuesta); */

        if (this.fechaIniEncuesta.getTime() < fechaActual.getTime()) {
            Swal.fire("Debe seleccionar una fecha igual o posterior a la fecha de hoy.");
            this.formularioEncuesta.get('feEncuesta').setValue('');
        }

    }

    onSelectFechaFinEncuesta(event): void {
        let d = new Date(Date.parse(event));
        this.fechaFinEncuesta = ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

        if (new Date(event) < this.fechaIniEncuesta) {
            Swal.fire("Debe seleccionar una fecha posterior al inicial");
            this.formularioEncuesta.get('feFinEncuesta').setValue('');
        } else {
            this.fechaFinEncuesta = ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            console.log(this.fechaFinEncuesta);
        }
    }

    registrarEncuesta(): void {

        if (this.formularioEncuesta.invalid) {
            return Object.values(this.formularioEncuesta.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;

        const encuestaBody: Encuesta = {
            // idEmpresa: this.formularioEncuesta.get('idEmpresa').value,
            // idPeriodo: this.formularioEncuesta.get('idPeriodo').value,
            feEncuesta: this.fechaEncuesta,
            feFinEncuesta: this.fechaFinEncuesta,
            tituloEncuesta: this.formularioEncuesta.get('tituloEncuesta').value,
            subtituloEncuesta: this.formularioEncuesta.get('subtituloEncuesta').value,
            textoEncuesta: this.formularioEncuesta.get('textoEncuesta').value,
            contTextoEncuesta: this.formularioEncuesta.get('contTextoEncuesta').value,
            usuarioCreacion: usuarioCreacion, //'USERPRUEBA',
            ipCreacion: '192.168.1.10'
        };

        if (this.preguntasList.listaPreguntas.length == 0) {
            Swal.fire("Debe de registrar las preguntas de la encuesta");

        } else {

            Swal.fire({
                title: '¿Está seguro de crear la encuesta?',
                showCancelButton: true,
                confirmButtonText: `Crear`,
                cancelButtonText: `Cancelar`,
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Espere por favor',
                        html: 'Estamos creando la encuesta',
                        allowOutsideClick: () => !Swal.isLoading(),
                        allowEscapeKey: () => !Swal.isLoading()
                    });
                    Swal.showLoading();

                    this.encuestaService.registrarNuevaEncuesta(encuestaBody).subscribe(
                        resp => {
                            if (resp.idEncuesta !== 0) {
                                this.idEncuesta = resp.idEncuesta;

                                for (var j = 0; j < this.preguntasList.listaPreguntas.length; j++) {
                                    this.preguntasList.listaPreguntas[j].idEncuesta = this.idEncuesta;
                                }

                                // console.log("Sedes"+JSON.stringify(this.sedeLista));

                                this.encuestaService.registrarPregunta(this.preguntasList).subscribe(
                                    resp => {
                                        console.log(resp);
                                        if (resp.idPregunta !== 0) {
                                            if (Swal.isLoading()) {
                                                Swal.close();
                                            }
                                            Swal.fire('¡Creación exitosa!', "La encuesta se creó con éxito", 'success');
                                            this.router.navigate(['/pages', 'main', 'configuracion', 'encuesta']);

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
                                    Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                                }
                            }
                        }

                    );
                }
            });
        }
    }

    public cargarEncuesta(): void {
        this.activatedRoute.params.subscribe(params => {
            const idEncuesta = params.idEncuesta;
            if (idEncuesta) {
                this.encuestaService.obtenerEncuesta(idEncuesta).subscribe(
                    resp => {
                        this.encuesta = resp.Encuesta;
                        this.idEstado = this.encuesta.indicadorBaja;
                        // this.formularioEncuesta.get('idEmpresa').setValue(this.encuesta.idEmpresa),
                        // this.formularioEncuesta.get('idPeriodo').setValue(this.encuesta.idPeriodo),
                        this.formularioEncuesta.get('feEncuesta').setValue(this.encuesta.feEncuesta),
                            this.formularioEncuesta.get('feFinEncuesta').setValue(this.encuesta.feFinEncuesta),
                            this.formularioEncuesta.get('tituloEncuesta').setValue(this.encuesta.tituloEncuesta),
                            this.formularioEncuesta.get('subtituloEncuesta').setValue(this.encuesta.subtituloEncuesta),
                            this.formularioEncuesta.get('textoEncuesta').setValue(this.encuesta.textoEncuesta),
                            this.formularioEncuesta.get('contTextoEncuesta').setValue(this.encuesta.contTextoEncuesta);
                        this.formularioEncuesta.get('linkEncuesta').setValue(this.linkEncuestaBase + this.encuesta.idEncuesta.toString());
                        //this.formularioEncuesta.get('linkEncuesta').setValue('prue');
                        // this.idEmpresa = this.encuesta.idEmpresa;
                        // this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
                        this.fechaEncuesta = this.encuesta.feEncuesta;
                        this.fechaFinEncuesta = this.encuesta.feFinEncuesta;

                        for (var i = 0; i < this.encuesta.listaPreguntas.length; i++) {

                            this.preguntasList.listaPreguntas.push(this.encuesta.listaPreguntas[i]);

                            this.listaPreguntas.push(this.encuesta.listaPreguntas[i]);

                            for (var j = 0; j < this.listaTipoPregunta.length; j++) {

                                if (this.listaTipoPregunta[j].idParametro == this.preguntasList.listaPreguntas[i].tiPregunta) {

                                    this.preguntasList.listaPreguntas[i].deTipoPregunta = this.listaTipoPregunta[j].nombreParametro;
                                }
                            }

                            for (var j = 0; j < this.listaGrupoPregunta.length; j++) {

                                if (this.listaGrupoPregunta[j].idParametro == this.preguntasList.listaPreguntas[i].grupoPregunta) {

                                    this.preguntasList.listaPreguntas[i].deGrupoPregunta = this.listaGrupoPregunta[j].nombreParametro;
                                }
                            }

                            for (var j = 0; j < this.preguntasList.listaPreguntas[i].listaRespuestas.length; j++) {
                                this.preguntasList.listaPreguntas[i].listaRespuestas[j].inAlternativa = this.preguntasList.listaPreguntas[i].listaRespuestas[j].indicadorAlternativa == 1 ? "Si" : "No";
                            }

                        }

                        this.loading = false;
                        console.log(resp.Encuesta);
                        console.log(this.listaRespuestas);
                    }
                );
            }
        });
    }

    onChangeEstado(deviceValue): void {
        this.idEstado = deviceValue.target.value;
    }

    actualizarEncuesta(): void {

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioModificacion = datosToken.data.username;

        console.log('actualizarEncuesta ' + this.idEstado)

        const encuestaBody: Encuesta = {
            idEncuesta: this.encuesta.idEncuesta,
            // idEmpresa: this.formularioEncuesta.get('idEmpresa').value,
            // idPeriodo: this.formularioEncuesta.get('idPeriodo').value,
            feEncuesta: this.fechaEncuesta,
            feFinEncuesta: this.fechaFinEncuesta,
            tituloEncuesta: this.formularioEncuesta.get('tituloEncuesta').value,
            subtituloEncuesta: this.formularioEncuesta.get('subtituloEncuesta').value,
            textoEncuesta: this.formularioEncuesta.get('textoEncuesta').value,
            contTextoEncuesta: this.formularioEncuesta.get('contTextoEncuesta').value,
            usuarioModificacion: usuarioModificacion, //'USERPRUEBAMODIF',
            ipModificacion: '192.168.1.10',
            indicadorBaja: this.idEstado
        };
        console.log(encuestaBody);
        Swal.fire({
            title: '¿Está seguro de actualizar la encuesta?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la encuesta',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.encuestaService.actualizarEncuesta(encuestaBody).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idEncuesta !== 0) {

                            this.idEncuesta = resp.idEncuesta;

                            for (var j = 0; j < this.preguntasList.listaPreguntas.length; j++) {
                                this.preguntasList.listaPreguntas[j].idEncuesta = this.idEncuesta;
                            }

                            this.encuestaService.actualizarPregunta(this.preguntasList).subscribe(
                                resp => {
                                    console.log(resp);
                                    if (resp.idPregunta !== 0) {
                                        if (Swal.isLoading()) {
                                            Swal.close();
                                        }
                                        Swal.fire('Actualización exitosa!', "Se actualizó correctamente", 'success');
                                        this.router.navigate(['/pages', 'main', 'configuracion', 'encuesta']);

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
                                Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                            }
                        }
                    }
                );
            }
        });

    }

    /* Modal agregar - actualizar pregunta */
    mostrarPopUpAgregaPregunta(): void {
        this.formularioPregunta.reset();
        this.popUpPregunta = true;
        this.preguntaIndex = null;
    }

    crearFormularioPregunta(): void {
        this.formularioPregunta = this.formBuilder.group({
            pregunta: ['', Validators.required],
            puntaje: ['', Validators.required],
            notaPregunta: ['', Validators.required],
            grupoPregunta: ['', Validators.required],
            idTipoPregunta: ['', Validators.required],
            indicadorEstadoPreg: ['', Validators.required],
        });
    }

    obtenerValorEstado(checked): void {
        this.indicadorEstadoPreg = checked.checked;
    }

    eliminarPregunta(index) {

        if (this.editar == true && this.preguntasList.listaPreguntas[index].idPregunta != null) {
            this.preguntasList.listaPreguntas[index].indicadorBaja = '0';
        } else {
            if (this.preguntasList.listaPreguntas[index].listaRespuestas.length == 0) {
                this.listaPreguntas.splice(index, 1);
                this.preguntasList.listaPreguntas.splice(index, 1);
            } else {
                Swal.fire("Primero debe eliminar las respuestas de la pregunta");
            }
        }

        this.listaPreguntas = [...this.listaPreguntas];

        this.preguntaIndex = 0;

    }

    showPopUpPreguntaSel(index) {
        this.preguntaIndex = index;
        this.indicePreg = index;
        this.popUpPregunta = true;
        this.formularioPregunta.get('pregunta').setValue(this.preguntasList.listaPreguntas[this.preguntaIndex].dePregunta);
        this.formularioPregunta.get('puntaje').setValue(this.preguntasList.listaPreguntas[this.preguntaIndex].puntaje);
        this.formularioPregunta.get('notaPregunta').setValue(this.preguntasList.listaPreguntas[this.preguntaIndex].notaPregunta);
        this.formularioPregunta.get('idTipoPregunta').setValue(this.preguntasList.listaPreguntas[this.preguntaIndex].tiPregunta);
        this.formularioPregunta.get('grupoPregunta').setValue(this.preguntasList.listaPreguntas[this.preguntaIndex].grupoPregunta);
        this.formularioPregunta.get('indicadorEstadoPreg').setValue(this.preguntasList.listaPreguntas[this.preguntaIndex].indicadorBaja == '0' ? false : true);
        this.indicadorEstadoPreg = this.preguntasList.listaPreguntas[this.preguntaIndex].indicadorBaja == '0' ? false : true;

    }

    actualizarPregunta() {

        this.preguntasList.listaPreguntas[this.preguntaIndex].dePregunta = this.formularioPregunta.get('pregunta').value;
        this.preguntasList.listaPreguntas[this.preguntaIndex].puntaje = this.formularioPregunta.get('puntaje').value;
        this.preguntasList.listaPreguntas[this.preguntaIndex].notaPregunta = this.formularioPregunta.get('notaPregunta').value;
        this.preguntasList.listaPreguntas[this.preguntaIndex].tiPregunta = this.formularioPregunta.get('idTipoPregunta').value;
        this.preguntasList.listaPreguntas[this.preguntaIndex].grupoPregunta = this.formularioPregunta.get('grupoPregunta').value;
        this.preguntasList.listaPreguntas[this.preguntaIndex].indicadorBaja = this.indicadorEstadoPreg ? '1' : '0';

        for (var i = 0; i < this.listaTipoPregunta.length; i++) {

            if (this.listaTipoPregunta[i].idParametro == this.formularioPregunta.get('idTipoPregunta').value) {

                this.preguntasList.listaPreguntas[this.preguntaIndex].deTipoPregunta = this.listaTipoPregunta[i].nombreParametro;
            }
        }

        for (var i = 0; i < this.listaGrupoPregunta.length; i++) {

            if (this.listaGrupoPregunta[i].idParametro == this.formularioPregunta.get('grupoPregunta').value) {

                this.preguntasList.listaPreguntas[this.preguntaIndex].deGrupoPregunta = this.listaGrupoPregunta[i].nombreParametro;
            }
        }

        this.popUpPregunta = false;
        this.preguntaIndex = null;

    }

    agregarPreguntas(): void {

        for (var i = 0; i < this.listaTipoPregunta.length; i++) {

            if (this.listaTipoPregunta[i].idParametro == this.formularioPregunta.get('idTipoPregunta').value) {

                this.deTipoPregunta = this.listaTipoPregunta[i].nombreParametro;
            }
        }

        for (var i = 0; i < this.listaGrupoPregunta.length; i++) {

            if (this.listaGrupoPregunta[i].idParametro == this.formularioPregunta.get('grupoPregunta').value) {

                this.deGrupoPregunta = this.listaGrupoPregunta[i].nombreParametro;
            }
        }

        var objPregunta: Pregunta = {
            dePregunta: this.formularioPregunta.get('pregunta').value,
            puntaje: this.formularioPregunta.get('puntaje').value,
            notaPregunta: this.formularioPregunta.get('notaPregunta').value,
            grupoPregunta: this.formularioPregunta.get('grupoPregunta').value,
            tiPregunta: this.formularioPregunta.get('idTipoPregunta').value,
            deTipoPregunta: this.deTipoPregunta,
            deGrupoPregunta: this.deGrupoPregunta,
            listaRespuestas: [],
            indicadorBaja: "1"
        }
        this.preguntasList.listaPreguntas.push(objPregunta);
        this.listaPreguntas.push(objPregunta);
        console.log('lista Preguntas: ', this.preguntasList);
        this.popUpPregunta = false;
        this.preguntasSel = -1;

        this.listaPreguntas = [...this.preguntasList.listaPreguntas];
    }

    selectPregunta(index, event) {

        var id = "check" + index;
        var checkbox = <HTMLInputElement>document.getElementById(id);
        console.log("Index " + index);

        if (checkbox.checked) {

            this.preguntasSel = index;

            for (var j = 0; j < this.preguntasList.listaPreguntas.length; j++) {

                if (j != index) {

                    var id1 = "check" + j;
                    var checkboxnot = <HTMLInputElement>document.getElementById(id1);
                    if (checkboxnot != null) {

                        checkboxnot.checked = false;

                    }
                }
            }

            if (this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas == undefined) {

                this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas = [];
                this.listaRespuestas = [];

            }
            else {
                this.listaRespuestas = this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas;
            }
        }
        else {

            this.preguntasSel = -1;
            this.listaRespuestas = [];

        }

    }

    agregarRespuesta(): void {

        if (this.preguntasSel > -1) {

            const descripcionRespuesta = this.formularioRespuesta.get("deRespuesta").value;
            const indicadorAlternativa = this.formularioRespuesta.get("indicadorAlternativa").value ? 1 : 0;
            const inAlternativa = this.formularioRespuesta.get("indicadorAlternativa").value ? "Si" : "No";

            const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
            const usuarioCreacion = datosToken.data.username; //"USER1"           
            const ipCreacion = this.dataIp; //"127.0.0.1";
            const indicadorBaja = "1"

            var respuestaBody: Respuesta = {
                deRespuesta: descripcionRespuesta, usuarioCreacion: usuarioCreacion, ipCreacion: ipCreacion,
                indicadorAlternativa: indicadorAlternativa, inAlternativa: inAlternativa, indicadorBaja: indicadorBaja
            }

            if (this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas == undefined) {

                this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas = [];

            }
            else {

                this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas.push(respuestaBody);
            }

            this.listaRespuestas = [...this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas];
        }
        else {
            Swal.fire("Debe seleccionar una pregunta");

        }
        this.popUpRespuesta = false;
        this.respuestaIndex = null;
    }

    obtenerValorEstadoResp(checked): void {
        this.indicadorEstadoResp = checked.checked;
    }

    actualizarRespuesta(): void {
        this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].deRespuesta = this.formularioRespuesta.get('deRespuesta').value;
        this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].indicadorAlternativa = this.formularioRespuesta.get("indicadorAlternativa").value ? 1 : 0;
        this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].inAlternativa = this.formularioRespuesta.get("indicadorAlternativa").value ? "Si" : "No";
        this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].indicadorBaja = this.formularioRespuesta.get("indicadorEstadoResp").value ? '1' : '0';

        this.popUpRespuesta = false;
        this.respuestaIndex = null;

    }

    eliminarRespuesta(index) {

        if (this.editar == true && this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[index].idRespuesta != null) {
            this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[index].indicadorBaja = '0';
            console.log('aqui editar');
        } else {
            this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas.splice(index, 1);
            this.listaRespuestas.splice(index, 1);
            console.log('aqui eliminar');
        }

        this.listaRespuestas = [...this.listaRespuestas];

        this.respuestaIndex = 0;
        this.indiceResp = 0;

        /*if (this.editar == true && this.preguntasList.listaPreguntas[index].idPregunta != null){
            this.preguntasList.listaPreguntas[index].indicadorBaja = '0';
        }else{
            if (this.preguntasList.listaPreguntas[index].listaRespuestas.length == 0){
                this.listaPreguntas.splice(index,1);
                this.preguntasList.listaPreguntas.splice(index,1);
            }else{
                Swal.fire("Primero debe eliminar las respuestas de la pregunta");
            }
        }

        this.preguntaIndex = 0;*/
    }

    showPopUpRespuestaSel(index) {
        this.respuestaIndex = index;
        this.indiceResp = index;
        this.popUpRespuesta = true;
        this.mostrarEstado = this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.indiceResp].indicadorBaja == '0';
        this.formularioRespuesta.get('deRespuesta').setValue(this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].deRespuesta);
        this.indicadorAlternativa = this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].indicadorAlternativa == 0 ? false : true;
        this.formularioRespuesta.get('indicadorAlternativa').setValue(this.indicadorAlternativa);
        this.indicadorEstadoResp = this.preguntasList.listaPreguntas[this.preguntasSel].listaRespuestas[this.respuestaIndex].indicadorBaja == '0' ? false : true;
        this.formularioRespuesta.get('indicadorEstadoResp').setValue(this.indicadorEstadoResp);
    }

    crearFormularioRespuesta(): void {
        this.formularioRespuesta = this.formBuilder.group({
            deRespuesta: ['', Validators.required],
            indicadorAlternativa: [''],
            indicadorEstadoResp: ['', Validators.required]
        });
    }

    obtenerValorCheck(checked): void {
        this.indicadorAlternativa = checked.checked;
    }

    mostrarPopUpAgregaRespuesta(): void {

        if (this.preguntasSel > -1) {
            if (this.preguntasList.listaPreguntas[this.preguntasSel].tiPregunta != 37) {
                this.formularioRespuesta.reset();
                this.popUpRespuesta = true;
                this.respuestaIndex = null;
                this.mostrarEstado = false;
            } else {
                Swal.fire("Las respuestas solo son para preguntas con alternativas");
            }
        } else {
            Swal.fire("Debe seleccionar una pregunta");
        }
    }

    cerrarPopUpRespuesta() {
        this.popUpRespuesta = false;
    }

    cerrarPopUp() {
        this.popUpPregunta = false;
    }

    // get empresaNoValido(): boolean {
    //     return this.formularioEncuesta.get('idEmpresa').invalid && this.formularioEncuesta.get('idEmpresa').touched;
    // }

    // get periodoNoValido(): boolean {
    //     return this.formularioEncuesta.get('idPeriodo').invalid && this.formularioEncuesta.get('idPeriodo').touched;
    // }

    get fechaEncuestaNoValido(): boolean {
        return this.formularioEncuesta.get('feEncuesta').invalid && this.formularioEncuesta.get('feEncuesta').touched;
    }

    get fechaFinEncuestaNoValido(): boolean {
        return this.formularioEncuesta.get('feFinEncuesta').invalid && this.formularioEncuesta.get('feFinEncuesta').touched;
    }

    get tituloNoValido(): boolean {
        return this.formularioEncuesta.get('tituloEncuesta').invalid && this.formularioEncuesta.get('tituloEncuesta').touched;
    }

    get subtituloNoValido(): boolean {
        return this.formularioEncuesta.get('subtituloEncuesta').invalid && this.formularioEncuesta.get('subtituloEncuesta').touched;
    }

    get textoNoValido(): boolean {
        return this.formularioEncuesta.get('textoEncuesta').invalid && this.formularioEncuesta.get('textoEncuesta').touched;
    }

    get contenidoTextoNoValido(): boolean {
        return this.formularioEncuesta.get('contTextoEncuesta').invalid && this.formularioEncuesta.get('contTextoEncuesta').touched;
    }

    get tipoPreguntaNoValido(): boolean {
        return this.formularioPregunta.get('idTipoPregunta').invalid && this.formularioPregunta.get('idTipoPregunta').touched;
    }

    get preguntaNoValido(): boolean {
        return this.formularioPregunta.get('pregunta').invalid && this.formularioPregunta.get('pregunta').touched;
    }

    get puntajeNoValido(): boolean {
        return this.formularioPregunta.get('puntaje').invalid && this.formularioPregunta.get('puntaje').touched;
    }

    get notaPreguntaNoValido(): boolean {
        return this.formularioPregunta.get('notaPregunta').invalid && this.formularioPregunta.get('notaPregunta').touched;
    }

    get grupoPreguntaNoValido(): boolean {
        return this.formularioPregunta.get('grupoPregunta').invalid && this.formularioPregunta.get('grupoPregunta').touched;
    }

    get respuestaNoValido(): boolean {
        return this.formularioRespuesta.get('deRespuesta').invalid && this.formularioRespuesta.get('deRespuesta').touched;
    }

    obtenermetodoIP() {

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
            }
        );
    }

}
