import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsable } from '../../../../../shared/models/responsable';
import { Empresa } from '../../../../../shared/models/empresa';
import { Parametro } from '../../../../../shared/models/parametro';
import { Perfil } from '../../../../../shared/models/perfil';
import Swal from 'sweetalert2';
import { ResponsableService } from './responsable.service';
import { FileModel } from "../../../../../core/schema/file.model";
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { Sede } from 'src/app/shared/models/sede';
import { ForgotPasswordService } from 'src/app/main/components/forgot-password/forgot-password.service';
import { Proceso } from "../../../../../shared/models/proceso";
import { TipoPerfil } from "../../../../../shared/models/tipoPerfil";
import { DataLogin } from "../../../../../shared/models/data";

@Component({
    selector: 'app-conf-registrar-responsable',
    templateUrl: 'form-responsable.responsable.html',
    styleUrls: ['responsable.component.scss']
})

export class FormResponsableComponent implements OnInit {

    formularioResponsable: FormGroup;
    responsable: Responsable;
    fileModel: FileModel = new FileModel();
    loading: boolean;
    listaEstados: Parametro[];
    listaResponsabilidades: Parametro[];
    listaCargos: Parametro[];
    listaCarteras: Parametro[];
    listaPerfiles: Perfil[];
    listaTipos: Parametro[];
    listaProceso: Proceso[];
    lstSetProcesoSeleccionado: Proceso[];
    listIdProceso: any[];
    editar: boolean;
    mostrarProceso = false;
    mostrarSede = true;
    mostrarCorreoJefe = false;
    mostrarResponsabilidad = false;
    showButtonSave = true;

    listaEmpresa: Empresa[];
    empresa: Empresa;
    listaSede: Sede[] = [];

    cancelButtonText = 'Cancelar';
    idEstado: string;
    idTipo: number;
    idUser: number;
    idEmpresa = 0;
    idCartera: number;
    indicadorBaja = 1;

    uploadedFiles: any[] = [];

    usuarioCreacion: string;
    payload: DataLogin;
    idPerfil: number;
    tipoPerfilAdminEmpresa: TipoPerfil = TipoPerfil.admin_empresa;
    tipoPerfilAdminFonafe: TipoPerfil = TipoPerfil.admin;

    // validacionResponsabilidad: any[]= [''];

    mensajeFiltroVacio = "No se encontraron resultados";
    dataIp: string = "";


    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authLoginService: AuthLoginService,
        private responsableService: ResponsableService,
        private activatedRoute: ActivatedRoute,
        private forgotPasswordService: ForgotPasswordService
    ) {
        this.crearFormulario();
        // this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        // this.idPerfil = this.payload.data.idPerfil;
        this.solverPermissions();
        this.obtenerListaEstadoParametros();
        this.obtenerListaEmpresas();
        this.obtenerListaCarteras();
        this.obtenerListaResponsabilidades();
        this.obtenerListaCargos();
        this.obtenerListaPerfiles();
        this.obtenermetodoIP();

        this.listaProceso = [];
        this.listIdProceso = [];
        this.lstSetProcesoSeleccionado = [];

    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.formularioResponsable = this.formBuilder.group({
                    idCartera: ['', Validators.required],
                    idEmpresa: ['', Validators.required],
                    idSede: [''],
                    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
                    nombre: ['', [Validators.required, Validators.maxLength(100)]],
                    apellidoPaterno: ['', [Validators.required, Validators.maxLength(100)]],
                    apellidoMaterno: ['', [Validators.required, Validators.maxLength(100)]],
                    idResponsabilidad: ['', [Validators.required]],
                    idCargo: ['', Validators.required],
                    correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
                    //password: [''],
                    // prefijoTelefono: ['', [Validators.required, Validators.maxLength(8)]],
                    numeroTelefono: ['', [Validators.maxLength(32)]],
                    anexo: ['', [Validators.maxLength(16)]],
                    celular: ['', [Validators.required, Validators.maxLength(32)]],
                    idPerfil: ['', Validators.required],
                    idEstado: [''],
                    listaProcesos: ['', [Validators.required]],
                    correoJefe: ['', Validators.email]
                });
            } else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.editar = false;
            } else {
                this.formularioResponsable.disable();
                this.editar = false;
            }

            if (params.idUsuario) {
                this.loading = true;
            }
        });
        console.log(this.loading);
        this.cargarResponsable();

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioCreacion = datosToken.data.username;
    }

    solverPermissions() {
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if (this.idPerfil == TipoPerfil.admin) {

        }
        else {

            this.formularioResponsable.get('idCartera').setValue(this.payload.data.datosEmpresa.idCartera);
            this.formularioResponsable.get('idEmpresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
            this.formularioResponsable.get('idEmpresa').disable();
            this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
            this.obtenerListaSedes();

        }
    }

    obtenerListaEmpresas(): void {
        this.responsableService.obtenerListaEmpresas().subscribe(
            resp => {
                this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
                    empresa.indicadorBaja == this.indicadorBaja
                );
            }
        );
    }

    obtenerListaSedes(): void {
        this.responsableService.obtenerListaSedes(this.idEmpresa).subscribe(
            resp => {
                this.listaSede = resp.listaSedes.filter(sede =>
                    sede.indicadorBaja == this.indicadorBaja
                );

                /*for (let i = 0; i < this.listaSede.length; i++) {
                    this.formularioResponsable.get('idSede').enable();
                    if (this.listaSede[i].descripcionSede == 'Sin Sede'){
                        this.formularioResponsable.get('idSede').setValue(this.listaSede[i].idSede);
                        this.formularioResponsable.get('idSede').disable();
                    }
                }*/
            }
        );
    }

    obtenerListaEstadoParametros(): void {
        this.responsableService.obtenerListaEstadoParametros().subscribe(
            resp => {
                this.listaEstados = resp.listaParametros;
            }
        );
    }

    obtenerListaCarteras(): void {
        this.responsableService.obtenerListaCarteras().subscribe(
            resp => {
                this.listaCarteras = resp.listaParametros;
            }
        );
    }

    obtenerListaResponsabilidades(): void {
        this.responsableService.obtenerListaResponsabilidad().subscribe(
            resp => {
                this.listaResponsabilidades = resp.listaParametros;
            }
        );
    }

    obtenerListaCargos(): void {
        this.responsableService.obtenerListaCargos().subscribe(
            resp => {
                this.listaCargos = resp.listaParametros;
            }
        );
    }

    public obtenerListarProceso(): void {
        const idEmpresa = this.idEmpresa;
        if (idEmpresa.toString() == "") {
            this.listaProceso = [];
        } else {
            //this.formularioResponsable.get('listaProcesos').setValue([]);
            /*Swal.fire({
                title: 'Espere por favor',
                html: 'Cargando lista de procesos',
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            });
            Swal.showLoading();*/
            //this.loading=true;
            this.responsableService.obtenerListaProcesos(idEmpresa).subscribe(
                resp => {
                    if (resp.codigo == 1) {
                        // if (Swal.isLoading())Swal.close();
                        this.listaProceso = resp.listaProceso;
                        if (this.responsable != null) {
                            this.formularioResponsable.get('listaProcesos').setValue(this.obtenerProcesoSeleccionado());
                        }

                        this.listaProceso = resp.listaProceso.filter(proceso =>
                            proceso.indicadorBaja == this.indicadorBaja
                        );

                        this.loading = false;
                    } else {
                        Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                        this.listaProceso = [];
                    }
                }
            );

        }
    }

    obtenerListaPerfiles(): void {
        this.responsableService.obtenerListaPerfiles().subscribe(
            resp => {
                this.listaPerfiles = resp.listaPerfiles;
                if (this.idPerfil == this.tipoPerfilAdminEmpresa) {
                    this.listaPerfiles = this.listaPerfiles.filter(perfil => perfil.idPerfil != this.tipoPerfilAdminFonafe);
                }
            }
        );
    }

    onChangeEmpresa(deviceValue): void {
        for (let i = 0; i < this.listaEmpresa.length; i++) {
            if (this.listaEmpresa[i].idEmpresa == deviceValue.target.value) {
                this.idCartera = this.listaEmpresa[i].idCartera;
            }
        }
        this.formularioResponsable.get('idCartera').setValue(this.idCartera)
        this.idEmpresa = deviceValue.target.value;
        this.obtenerListaSedes();
        this.obtenerListarProceso();
    }

    onChangePerfil(deviceValue): void {
        if ((deviceValue.target.value == TipoPerfil.admin) || (deviceValue.target.value == TipoPerfil.admin_empresa)) {
            this.mostrarProceso = false;
            this.formularioResponsable.get('listaProcesos').setValue('');
            this.formularioResponsable.get('listaProcesos').setErrors(null);

            this.mostrarResponsabilidad = true;
            this.formularioResponsable.get('idResponsabilidad').setValue('');
        }
        if ((deviceValue.target.value == TipoPerfil.admin) || (deviceValue.target.value == TipoPerfil.admin_empresa) || (deviceValue.target.value == TipoPerfil.auditor)) {
            this.mostrarSede = false;
            this.formularioResponsable.get('idSede').setValue('');
        }
        if ((deviceValue.target.value == TipoPerfil.user)) {
            this.mostrarSede = true;
            this.formularioResponsable.get('idSede').setValue('');
        }
        if ((deviceValue.target.value == TipoPerfil.user) || (deviceValue.target.value == TipoPerfil.auditor)) {
            if (this.listaProceso.length == 0) {
                this.obtenerListarProceso();
            }
            this.mostrarProceso = true;
            this.formularioResponsable.get('listaProcesos').setValue('');

            this.mostrarResponsabilidad = false;
            this.formularioResponsable.get('idResponsabilidad').setValue('');
            this.formularioResponsable.get('idResponsabilidad').setErrors(null);
        }

        if (deviceValue.target.value == TipoPerfil.user) {
            this.mostrarCorreoJefe = true;
        } else {
            this.mostrarCorreoJefe = false;
            this.formularioResponsable.get('correoJefe').setValue('');
        }

        console.log(this.formularioResponsable);
    }

    mostrarControlesActualizar(): void {
        const idperfil = this.formularioResponsable.get('idPerfil').value;

        if ((idperfil == TipoPerfil.admin) || (idperfil == TipoPerfil.admin_empresa)) {
            this.mostrarProceso = false;

            this.formularioResponsable.get('listaProcesos').setValue('');
            //this.formularioResponsable.get('listaProcesos').setErrors(null);

            this.mostrarResponsabilidad = true;
            //this.formularioResponsable.get('idResponsabilidad').setValue(this.responsable.idResponsabilidad);
        }
        if ((idperfil == TipoPerfil.user) || (idperfil == TipoPerfil.auditor)) {
            this.mostrarProceso = true;
            //this.formularioResponsable.get('listaProcesos').setValue(this.listaProceso);

            this.mostrarResponsabilidad = false;
            //this.formularioResponsable.get('idResponsabilidad').setValue('');
        }

        if (idperfil == TipoPerfil.user) {
            this.mostrarCorreoJefe = true;
        } else {
            this.mostrarCorreoJefe = false;
        }
    }


    onChangeEstado(deviceValue): void {
        this.idEstado = deviceValue.target.value;
    }

    public registrarResponsable(): void {
        if (this.formularioResponsable.invalid) {
            return Object.values(this.formularioResponsable.controls).forEach(control => {
                control.markAsTouched();
            });
        }
        const listProceso = this.formularioResponsable.get('listaProcesos').value;
        this.listIdProceso = [];
        for (let item of listProceso) {
            this.listIdProceso.push(item.idProceso)
        }

        let passwordValue = this.generateTempPassword();//this.formularioResponsable.get('password').value;
        console.log('pw ' + passwordValue);
        /*if (!passwordValue) {
            passwordValue = null;
        } */


        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;

        const responsableBody: Responsable = {
            idCartera: this.formularioResponsable.get('idCartera').value,
            idEmpresa: this.formularioResponsable.get('idEmpresa').value,
            idSede: this.formularioResponsable.get('idSede').value,
            dni: this.formularioResponsable.get('dni').value,
            nombre: this.formularioResponsable.get('nombre').value,
            apellidoPaterno: this.formularioResponsable.get('apellidoPaterno').value,
            apellidoMaterno: this.formularioResponsable.get('apellidoMaterno').value,
            idResponsabilidad: this.formularioResponsable.get('idResponsabilidad').value,
            idCargo: this.formularioResponsable.get('idCargo').value.toUpperCase(),
            correo: this.formularioResponsable.get('correo').value,
            password: passwordValue,
            // prefijoTelefono: this.formularioResponsable.get('prefijoTelefono').value,
            numeroTelefono: this.formularioResponsable.get('numeroTelefono').value,
            anexo: this.formularioResponsable.get('anexo').value,
            celular: this.formularioResponsable.get('celular').value,
            idPerfil: this.formularioResponsable.get('idPerfil').value,
            indicadorBaja: '1',
            usuarioCreacion: this.usuarioCreacion, //'USER1',
            ipCreacion: this.dataIp,
            procesos: this.listIdProceso,
            correoJefe: this.formularioResponsable.get('correoJefe').value
        };

        Swal.fire({
            title: '¿Está seguro de crear el usuario?',
            showCancelButton: true,
            confirmButtonText: `Crear`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos creando el usuario',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.responsableService.registrarNuevoResponsable(responsableBody).subscribe(
                    resp => {

                        console.log(resp);
                        if (resp.idResponsable !== 0) {
                            Swal.fire('¡Creación exitosa!', resp.mensaje, 'success');
                            Swal.fire({
                                title: '¿Desea Adjuntar su documento ahora?',
                                icon: 'question',
                                showDenyButton: true,
                                confirmButtonText: 'Si, deseo subir mi documento',
                                denyButtonText: `No, lo hare en otro momento`,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.idUser = resp.idResponsable;
                                    console.log('SE CREO EL ID' + resp.idResponsable);
                                    this.cancelButtonText = 'Cerrar';
                                    this.showButtonSave = false;
                                } else if (result.isDenied) {
                                    console.log('SE CREO EL ID  ' + resp.idResponsable)
                                    this.router.navigate(['/pages', 'main', 'configuracion', 'responsable']);
                                }
                            })
                            const url = `http://localhost:4200/pages/auth/login/changePassword?id=${resp.idResponsable}&pwTkn=${resp.pToken}`;
                            //const mensaje = 'La clave autogenerada es  : ' + passwordValue + '<br> Ingresa al siguiente link para establecer una contraseña URL : ' +url;
                            const mensaje = `
                            La clave autogenerada es: ${passwordValue}<br>
                            <a href="${url}" style="text-decoration: none;">
                                <button style="
                                    background-color: #4CAF50; /* Green */
                                    border: none;
                                    color: white;
                                    padding: 15px 32px;
                                    text-align: center;
                                    text-decoration: none;
                                    display: inline-block;
                                    font-size: 16px;
                                    margin: 4px 2px;
                                    cursor: pointer;
                                    border-radius: 12px;
                                ">
                                    Establecer nueva contraseña
                                </button>
                            </a>
                        `;
                            const asunto = 'Notificacion FONAFE - Clave generada';

                            this.forgotPasswordService.reestablecerContrasenia(this.formularioResponsable.get('correo').value, mensaje, asunto).subscribe(
                                resp => {
                                    console.log('CORREO ENVIADO' + resp.toString());
                                }, error => {
                                    console.log('ERROR ENVI CORREO : ' + error.toString());
                                }
                            );
                        } else {
                            if (Swal.isLoading()) {
                                Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                            }
                        }
                    }
                );



            }
        });
    }

    generateTempPassword(): string {
        const length = 6;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    cargarResponsable(): void {
        this.activatedRoute.params.subscribe(params => {
            const idUsuario = params.idUsuario;
            if (idUsuario) {
                this.responsableService.obtenerResponsable(idUsuario).subscribe(
                    resp => {
                        console.log(resp.dtoFile);
                        console.log(resp.Responsable.dtoFile);
                        this.fileModel = resp.Responsable.dtoFile;
                        console.log(this.fileModel);
                        this.responsable = resp.Responsable;
                        this.idEstado = this.responsable.indicadorBaja;
                        this.formularioResponsable.get('idCartera').setValue(this.responsable.idCartera);
                        this.formularioResponsable.get('idEmpresa').setValue(this.responsable.idEmpresa);
                        this.idEmpresa = this.responsable.idEmpresa;
                        this.obtenerListaSedes();
                        this.formularioResponsable.get('idSede').setValue(this.responsable.idSede);
                        this.formularioResponsable.get('dni').setValue(this.responsable.dni);
                        this.formularioResponsable.get('nombre').setValue(this.responsable.nombre);
                        this.formularioResponsable.get('apellidoPaterno').setValue(this.responsable.apellidoPaterno);
                        this.formularioResponsable.get('apellidoMaterno').setValue(this.responsable.apellidoMaterno);
                        this.formularioResponsable.get('idResponsabilidad').setValue(this.responsable.idResponsabilidad);
                        this.formularioResponsable.get('idCargo').setValue(this.responsable.idCargo);
                        this.formularioResponsable.get('correo').setValue(this.responsable.correo);
                        // this.formularioResponsable.get('prefijoTelefono').setValue(this.responsable.prefijoTelefono),
                        this.formularioResponsable.get('numeroTelefono').setValue(this.responsable.numeroTelefono);
                        this.formularioResponsable.get('anexo').setValue(this.responsable.anexo);
                        this.formularioResponsable.get('celular').setValue(this.responsable.celular);
                        this.formularioResponsable.get('idPerfil').setValue(this.responsable.idPerfil);
                        this.mostrarControlesActualizar();
                        this.formularioResponsable.get('idEstado').setValue(this.responsable.indicadorBaja);
                        this.formularioResponsable.get('listaProcesos').setValue(this.listaProceso);

                        this.formularioResponsable.get('correoJefe').setValue(this.responsable.correoJefe)

                        if (this.responsable != null && this.editar == true && this.responsable.indicadorBaja == '0') {
                            this.formularioResponsable.get('idEmpresa').disable();
                            this.formularioResponsable.get('idSede').disable();
                        }
                        if ((this.responsable.idPerfil == TipoPerfil.user) || (this.responsable.idPerfil == TipoPerfil.auditor)) {
                            this.obtenerListarProceso();
                        } else {
                            this.loading = false;
                        }

                        if (this.responsable != null && this.editar == true && this.idPerfil == TipoPerfil.admin_empresa) {
                            this.formularioResponsable.get('idEmpresa').disable();
                        }
                    }
                );
                this.idUser = idUsuario;

            }
        });
    }

    private crearFormulario(): void {

        this.formularioResponsable = this.formBuilder.group({
            idCartera: ['', Validators.required],
            idEmpresa: ['', Validators.required],
            idSede: [''],
            dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            apellidoPaterno: ['', [Validators.required, Validators.maxLength(100)]],
            apellidoMaterno: ['', [Validators.required, Validators.maxLength(100)]],
            idResponsabilidad: ['', [Validators.required]],
            idCargo: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
            //password: [''],
            // prefijoTelefono: ['', [Validators.required, Validators.maxLength(8)]],
            numeroTelefono: ['', [Validators.maxLength(32)]],
            anexo: ['', [Validators.maxLength(16)]],
            celular: ['', [Validators.required, Validators.maxLength(32)]],
            idPerfil: ['', Validators.required],
            idEstado: [''],
            listaProcesos: ['', [Validators.required]],
            correoJefe: ['', Validators.email]
        });

    }

    obtenerProcesoSeleccionado(): Proceso[] {
        const listaProceso = this.listaProceso;
        console.log("this.listaProceso");
        console.log(this.listaProceso);
        const listaIdProcesoSeleccionado = this.responsable.procesos;
        this.lstSetProcesoSeleccionado = [];

        for (let item of listaProceso) {
            for (let itemId of listaIdProcesoSeleccionado) {
                if (itemId == item.idProceso) {
                    this.lstSetProcesoSeleccionado.push(item);
                }
            }
        }
        return this.lstSetProcesoSeleccionado;
    }

    public actualizarResponsable(): void {
        if (!this.formularioResponsable.get('idResponsabilidad').touched &&
            (this.formularioResponsable.get('idPerfil').value == TipoPerfil.user || this.formularioResponsable.get('idPerfil').value == TipoPerfil.auditor)) {
            this.formularioResponsable.get('idResponsabilidad').setErrors(null);
        }

        if (!this.formularioResponsable.get('listaProcesos').touched &&
            (this.formularioResponsable.get('idPerfil').value == TipoPerfil.admin_empresa || this.formularioResponsable.get('idPerfil').value == TipoPerfil.admin)) {
            this.formularioResponsable.get('listaProcesos').setErrors(null);
        }

        if (this.formularioResponsable.invalid) {
            return Object.values(this.formularioResponsable.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const listProceso = this.formularioResponsable.get('listaProcesos').value;
        this.listIdProceso = [];
        for (let item of listProceso) {
            this.listIdProceso.push(item.idProceso)
        }

        const responsableBodyActualizado: Responsable = {
            idUsuario: this.responsable.idUsuario,
            idCartera: this.formularioResponsable.get('idCartera').value,
            idEmpresa: this.formularioResponsable.get('idEmpresa').value,
            idSede: this.formularioResponsable.get('idSede').value,
            dni: this.formularioResponsable.get('dni').value,
            nombre: this.formularioResponsable.get('nombre').value,
            apellidoPaterno: this.formularioResponsable.get('apellidoPaterno').value,
            apellidoMaterno: this.formularioResponsable.get('apellidoMaterno').value,
            idResponsabilidad: this.formularioResponsable.get('idResponsabilidad').value,
            idCargo: this.formularioResponsable.get('idCargo').value.toUpperCase(),
            correo: this.formularioResponsable.get('correo').value,
            // password: this.formularioResponsable.get('password').value,
            // prefijoTelefono: this.formularioResponsable.get('prefijoTelefono').value,
            numeroTelefono: this.formularioResponsable.get('numeroTelefono').value,
            anexo: this.formularioResponsable.get('anexo').value,
            celular: this.formularioResponsable.get('celular').value,
            idPerfil: this.formularioResponsable.get('idPerfil').value,
            indicadorBaja: this.idEstado,
            usuarioModificacion: this.usuarioCreacion, //'USER1',
            ipModificacion: this.dataIp,
            procesos: this.listIdProceso,
            correoJefe: this.formularioResponsable.get('correoJefe').value
        };

        console.log('Actualizar response : ' + JSON.stringify(responsableBodyActualizado));

        Swal.fire({
            title: '¿Está seguro de actualizar el usuario?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando el usuario',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.responsableService.actualizarResponsable(responsableBodyActualizado).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idResponsable !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'responsable']);
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

    cambiarMayuscula(letra): void {
        letra.target.value = letra.target.value.toUpperCase();
    }

    obtenermetodoIP() {

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
            }
        );
    }

    get carteraNoValido(): boolean {
        return this.formularioResponsable.get('idCartera').invalid && this.formularioResponsable.get('idCartera').touched;
    }

    get empresaNoValido(): boolean {
        return this.formularioResponsable.get('idEmpresa').invalid && this.formularioResponsable.get('idEmpresa').touched;
    }

    get sedeNoValido(): boolean {
        return this.formularioResponsable.get('idSede').invalid && this.formularioResponsable.get('idSede').touched;
    }

    get dniNoValido(): boolean {
        return this.formularioResponsable.get('dni').invalid && this.formularioResponsable.get('dni').touched;
    }

    get nombreNoValido(): boolean {
        return this.formularioResponsable.get('nombre').invalid && this.formularioResponsable.get('nombre').touched;
    }

    get apellidoPaternoNoValido(): boolean {
        return this.formularioResponsable.get('apellidoPaterno').invalid && this.formularioResponsable.get('apellidoPaterno').touched;
    }

    get apellidoMaternoNoValido(): boolean {
        return this.formularioResponsable.get('apellidoMaterno').invalid && this.formularioResponsable.get('apellidoMaterno').touched;
    }

    get idResponsabilidadNoValido(): boolean {
        const idPerfil = this.formularioResponsable.get('idPerfil').value;
        return ((idPerfil == TipoPerfil.user) || (idPerfil == TipoPerfil.auditor)) ? false : (this.formularioResponsable.get('idResponsabilidad').invalid && this.formularioResponsable.get('idResponsabilidad').touched);
    }

    get idCargoNoValido(): boolean {
        return this.formularioResponsable.get('idCargo').invalid && this.formularioResponsable.get('idCargo').touched;
    }

    get correoNoValido(): boolean {
        return this.formularioResponsable.get('correo').invalid && this.formularioResponsable.get('correo').touched;
    }

    // get passwordNoValido(): boolean {
    //     return this.formularioResponsable.get('password').invalid && this.formularioResponsable.get('password').touched;
    // }

    get prefijoTelefonoNoValido(): boolean {
        return this.formularioResponsable.get('prefijoTelefono').invalid && this.formularioResponsable.get('prefijoTelefono').touched;
    }

    /* get numeroTelefonoNoValido(): boolean {
        return this.formularioResponsable.get('numeroTelefono').invalid && this.formularioResponsable.get('numeroTelefono').touched;
    }

    get anexoNoValido(): boolean {
        return this.formularioResponsable.get('anexo').invalid && this.formularioResponsable.get('anexo').touched;
    } */

    get celularNoValido(): boolean {
        return this.formularioResponsable.get('celular').invalid && this.formularioResponsable.get('celular').touched;
    }

    get idPerfilNoValido(): boolean {
        return this.formularioResponsable.get('idPerfil').invalid && this.formularioResponsable.get('idPerfil').touched;
    }

    get listaProcesosNoValido(): boolean {
        const idPerfil = this.formularioResponsable.get('idPerfil').value;
        return ((idPerfil == TipoPerfil.admin_empresa) || (idPerfil == TipoPerfil.admin)) ? false : (this.formularioResponsable.get('listaProcesos').invalid && this.formularioResponsable.get('listaProcesos').touched);
    }

    get correoJefeNoValido(): boolean {
        return this.formularioResponsable.get('correoJefe').invalid && this.formularioResponsable.get('correoJefe').touched;
    }
}
