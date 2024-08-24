import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../../../../../shared/models/empresa';
import { Parametro } from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { EmpresaService } from './empresa.service';
import { SedeLista } from '../../../../../shared/models/sedeLista';
import { Sede } from 'src/app/shared/models/sede';
import { Gerencia } from 'src/app/shared/models/gerencia';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { DataLogin } from 'src/app/shared/models/data';
import { UserLogin } from 'src/app/shared/models/userLogin';

@Component({
    selector: 'app-conf-registrar-empresa',
    templateUrl: 'form-empresa.empresa.html'
})

export class FormEmpresaComponent implements OnInit {

    formularioEmpresa: FormGroup;
    empresa: Empresa;
    sede: Sede;
    gerencia: Gerencia;
    loading: boolean;
    listaEstados: Parametro[];
    listaTipos: Parametro[];
    editar: boolean;
    editarGer: boolean;
    listaVacia: any[];
    listaVaciaGer: any[];
    listaGer: any[];
    listaSedes: any[];
    listaGerencias: Gerencia[];
    cols: any[];
    colsGer: any[];
    tieneSede: boolean;
    listaCarteras: Parametro[];
    sedeLista: SedeLista;

    sedeSel = -1;

    idEstado: string;
    idTipo: number;
    idEmpresa: number = 0;
    indicadorEstado: boolean;
    indicadorEstadoGer: boolean;
    displayc: boolean = false;
    displayg: boolean = false;
    displaySedesel: boolean = false;
    displayGerenciasel: boolean = false;
    mostrarEstadoGer: boolean;

    sedeIndex: number = 0;
    gerenciaIndex: number = 0;
    sedeDescripEdit = "";
    gerenciaDescripEdit = "";
    usuarioCreacion: string;
    dataIp: string = "";

    constructor(private formBuilder: FormBuilder, private router: Router,
        private empresaService: EmpresaService, private activatedRoute: ActivatedRoute,
        private authLoginService: AuthLoginService) {
        this.crearFormulario();
        this.obtenerListaCarteras();
        this.obtenerListaEstadoParametros();
        this.listaSedes = [];
        this.listaGerencias = [];
        this.sedeLista = new SedeLista();
        this.sedeLista.listaSedes = [];
        this.obtenermetodoIP();
    }

    ngOnInit(): void {

        this.tieneSede = false;

        this.editar = false;

        this.mostrarEstadoGer = false;
        this.cols = [

            {
                field: 'descripcionSede',
                header: 'Nombre Sede',
                class: 'text-center',
                ordenadmiento: 'descripcionSede',
                headerClass: 'text-center w-45'
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

        this.editarGer = false;
        this.colsGer = [

            {
                field: 'descripcionGerencia',
                header: 'Nombre Gerencia',
                class: 'text-center',
                ordenadmiento: 'descripcionGerencia',
                headerClass: 'text-center w-45'
            },
            {
                field: 'indicadorBaja',
                header: 'Estado',
                class: 'text-center',
                ordenadmiento: 'indicadorBaja',
                headerClass: 'text-center w-10'
            },
        ];

        this.listaVaciaGer = [
            { texto1: '', text2: '' },
            { texto1: '', text2: '' },
            { texto1: '', text2: '' },
        ]

        this.activatedRoute.params.subscribe(params => {
            if (params.idEmpresa) {
                this.loading = true;
            }

            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.formularioEmpresa.enable();
            } else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {

                this.editar = false;
                this.formularioEmpresa.enable();
                if (!this.tieneSede) {
                    this.agregarSinSede();
                }

            } else {

                this.formularioEmpresa.disable();

            }

        });

        // if(!this.tieneSede && !this.editar){
        //     this.agregarSinSede();
        // }

        this.cargarEmpresa();

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioCreacion = datosToken.data.username;//"USER1";       
    }

    private crearFormulario(): void {
        console.log('Se construyo el form');
        this.formularioEmpresa = this.formBuilder.group({
            idCartera: ['', Validators.required],
            razonSocial: ['', [Validators.required, Validators.maxLength(200)]],
            ruc: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
            nombreCortoEmpresa: ['', [Validators.required, Validators.maxLength(50)]],
            direccion: ['', [Validators.required, Validators.maxLength(300)]],
            descripcionSede: [''],
            descripcionGerencia: [''],
            tieneSede: [''],
            idEstado: ['']
        });
    }

    showDialogC() {
        this.displayc = true;
    }

    closeDialogC() {
        this.displayc = false;
    }

    showDialogg() {

        if (this.sedeSel > -1) {
            this.displayg = true;
        } else {
            Swal.fire("Debe seleccionar una sede");
        }
    }

    closeDialogg() {
        this.displayg = false;
    }

    showDisplaySedesel(index) {
        this.sedeIndex = index;
        this.displaySedesel = true;
        this.sedeDescripEdit = this.sedeLista.listaSedes[this.sedeIndex].descripcionSede;
        this.indicadorEstado = this.sedeLista.listaSedes[this.sedeIndex].indicadorBaja == '0' ? false : true;

    }

    closeDisplaySedesel() {
        this.displaySedesel = false;
    }

    obtenerValorEstado(checked): void {
        this.indicadorEstado = checked.checked;
    }

    obtenerListaEstadoParametros(): void {
        this.empresaService.obtenerListaEstadoParametros().subscribe(
            resp => {
                this.listaEstados = resp.listaParametros;
            }
        );
    }

    modificarSede() {

        this.sedeLista.listaSedes[this.sedeIndex].descripcionSede = this.sedeDescripEdit;
        this.sedeLista.listaSedes[this.sedeIndex].indicadorBaja = this.indicadorEstado ? '1' : '0';
        this.displaySedesel = false;
        this.sedeDescripEdit = "";

    }

    showDisplayGerenciasel(index) {
        this.gerenciaIndex = index;
        this.displayGerenciasel = true;
        this.gerenciaDescripEdit = this.sedeLista.listaSedes[this.sedeSel].listaGerencias[this.gerenciaIndex].descripcionGerencia;
        this.mostrarEstadoGer = this.sedeLista.listaSedes[this.sedeSel].listaGerencias[this.gerenciaIndex].indicadorBaja == '0';
        this.indicadorEstadoGer = this.sedeLista.listaSedes[this.sedeSel].listaGerencias[this.gerenciaIndex].indicadorBaja == '0' ? false : true;
    }

    closeDisplayGerenciasel() {
        this.displayGerenciasel = false;
    }

    obtenerValorEstadoGer(checked): void {
        this.indicadorEstadoGer = checked.checked;
    }

    modificarGerencia() {

        this.sedeLista.listaSedes[this.sedeSel].listaGerencias[this.gerenciaIndex].descripcionGerencia = this.gerenciaDescripEdit;
        this.sedeLista.listaSedes[this.sedeSel].listaGerencias[this.gerenciaIndex].indicadorBaja = this.indicadorEstadoGer ? '1' : '0';
        this.displayGerenciasel = false;
        this.gerenciaDescripEdit = "";

    }

    eliminarSede(index) {

        if (this.editar == true && this.sedeLista.listaSedes[index].idSede != null) {
            this.sedeLista.listaSedes[index].indicadorBaja = '0';
        } else {

            if (this.sedeLista.listaSedes[index].listaGerencias.length == 0) {
                this.listaSedes.splice(index, 1);
                this.sedeLista.listaSedes.splice(index, 1);
            } else {
                Swal.fire("Primero debe eliminar las gerencias de la sede");
            }
        }

        this.sedeIndex = 0;
    }

    eliminarGerencia(index) {
        console.log(index);
        const gerencia = this.sedeLista.listaSedes[this.sedeSel].listaGerencias[index];
        console.log(gerencia);
        if (this.editar && gerencia.idGerencia != null) {
            if (gerencia.indicadorBaja == '0') {
                Swal.fire({
                    title: '¿Está seguro de eliminar la gerencia?',
                    showCancelButton: true,
                    confirmButtonText: `Eliminar`,
                    cancelButtonText: `Cancelar`,
                    allowOutsideClick: () => !Swal.isLoading(),
                }).then((result) => {
                    if (result.isConfirmed) {

                        gerencia.indicadorBaja = '2';  // Cambiar a ELIMINADO
                        this.sedeLista.listaSedes[this.sedeSel].listaGerencias[index].indicadorBaja = '2';
                    }
                });

            } else if (gerencia.indicadorBaja == '1') {
                gerencia.indicadorBaja = '0';  // Cambiar a INACTIVO
                this.sedeLista.listaSedes[this.sedeSel].listaGerencias[index].indicadorBaja = '0';
            }
            console.log("se cambio a : " + gerencia.indicadorBaja)
        } else {
            this.sedeLista.listaSedes[this.sedeSel].listaGerencias.splice(index, 1);
        }

        // Filtrar las gerencias eliminadas (indicadorBaja === '2') fuera de la lista mostrada
        this.sedeLista.listaSedes[this.sedeSel].listaGerencias = [...this.sedeLista.listaSedes[this.sedeSel].listaGerencias];

        this.gerenciaIndex = 0;
    }

    obtenerListaCarteras(): void {
        this.empresaService.obtenerListaCarteras().subscribe(
            resp => {
                this.listaCarteras = resp.listaParametros;
            }
        );
    }

    onChangeEstado(deviceValue): void {
        this.idEstado = deviceValue.target.value;
    }

    onChangeTipo(deviceValue): void {
        this.idTipo = deviceValue.target.value;
    }

    obtenerValorCheck(checked): void {
        this.tieneSede = checked.checked;

        if (!this.editar) {
            if (this.tieneSede) {
                const cantidadGerencias = this.sedeLista.listaSedes[0].listaGerencias.length;
                for (var i = 0; i < cantidadGerencias; i++) {
                    this.eliminarGerencia(0);
                    console.log(cantidadGerencias);
                }

                this.eliminarSede(0);
            } else {
                this.agregarSinSede();
            }
        }
    }

    selectSede(index, event) {

        var id = "check" + index;
        var checkbox = <HTMLInputElement>document.getElementById(id);
        console.log("Index " + index);

        if (checkbox.checked) {

            this.sedeSel = index;

            for (var j = 0; j < this.sedeLista.listaSedes.length; j++) {

                if (j != index) {

                    var id1 = "check" + j;
                    var checkboxnot = <HTMLInputElement>document.getElementById(id1);
                    checkboxnot.checked = false;
                }
            }

            if (this.sedeLista.listaSedes[this.sedeSel].listaGerencias == undefined) {

                this.sedeLista.listaSedes[this.sedeSel].listaGerencias = [];
                this.listaGerencias = [];

            } else {
                this.listaGerencias = this.sedeLista.listaSedes[this.sedeSel].listaGerencias;
                //this.listaGerencias = this.sedeLista.listaSedes[this.sedeSel].listaGerencias.filter(gerencia => gerencia.indicadorBaja != '2');
            }
        } else {

            this.sedeSel = -1;
            this.listaGerencias = [];

        }

    }

    agregarSinSede(): void {

        const descripcionSede = "Sin Sede";
        const usuarioCreacion = this.usuarioCreacion;//"USER1";
        const ipCreacion = this.dataIp; //"127.0.0.1";
        const indicadorBaja = "1"

        var sedeBody: Sede = {
            descripcionSede: descripcionSede, usuarioCreacion: usuarioCreacion, ipCreacion: ipCreacion
            , listaGerencias: [], indicadorBaja: indicadorBaja
        }

        this.sedeLista.listaSedes.push(sedeBody);

        this.listaSedes.push(sedeBody);

        this.sedeSel = 0;

        this.listaGerencias = this.sedeLista.listaSedes[this.sedeSel].listaGerencias;
    }

    agregarSede(): void {

        const descripcionSede = this.formularioEmpresa.get("descripcionSede").value;
        const usuarioCreacion = this.usuarioCreacion; //"USER1";
        const ipCreacion = this.dataIp; //"127.0.0.1";
        const indicadorBaja = "1"

        var sedeBody: Sede = {
            descripcionSede: descripcionSede, usuarioCreacion: usuarioCreacion, ipCreacion: ipCreacion
            , listaGerencias: [], indicadorBaja: indicadorBaja
        }

        this.sedeLista.listaSedes.push(sedeBody);

        this.listaSedes.push(sedeBody);

        this.listaSedes = [...this.sedeLista.listaSedes];

        this.displayc = false;
        this.sedeSel = -1;
    }

    agregarGerencia(): void {

        if (this.sedeSel > -1) {

            const descripcionGerencia = this.formularioEmpresa.get("descripcionGerencia").value;
            const usuarioCreacion = this.usuarioCreacion; //"USER1";
            const ipCreacion = this.dataIp; //"127.0.0.1";

            var gerenciaBody: Gerencia = {
                descripcionGerencia: descripcionGerencia,
                usuarioCreacion: usuarioCreacion,
                ipCreacion: ipCreacion
            }

            if (this.sedeLista.listaSedes[this.sedeSel].listaGerencias == undefined) {

                this.sedeLista.listaSedes[this.sedeSel].listaGerencias = [];

            } else {

                this.sedeLista.listaSedes[this.sedeSel].listaGerencias.push(gerenciaBody);
            }

            this.listaGerencias = [...this.sedeLista.listaSedes[this.sedeSel].listaGerencias];
        } else {
            Swal.fire("Debe seleccionar una sede");

        }

        this.displayg = false;
    }

    registrarEmpresa(): void {

        if (this.formularioEmpresa.invalid) {
            return Object.values(this.formularioEmpresa.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const idCartera = this.formularioEmpresa.get("idCartera").value;
        const razonSocial = this.formularioEmpresa.get("razonSocial").value;
        const nombreCortoEmpresa = this.formularioEmpresa.get("nombreCortoEmpresa").value;
        const direccion = this.formularioEmpresa.get("direccion").value;
        const indicadorSede = this.formularioEmpresa.get("tieneSede").value ? 1 : 0;
        const ruc = this.formularioEmpresa.get("ruc").value;

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioCreacion = datosToken.data.username;
        const ipCreacion = this.dataIp; // "127.0.0.1";

        var empresaBody: Empresa = {
            idCartera: idCartera,
            razonSocial: razonSocial,
            nombreCortoEmpresa: nombreCortoEmpresa,
            direccion: direccion,
            ruc: ruc,
            indicadorSede: indicadorSede,
            usuarioCreacion: usuarioCreacion,
            ipCreacion: ipCreacion,

        };

        Swal.fire({
            title: '¿Está seguro de crear la empresa?',
            showCancelButton: true,
            confirmButtonText: `Crear`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos creando la empresa',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.empresaService.registrarNuevaEmpresa(empresaBody).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idEmpresa !== 0) {
                            this.idEmpresa = resp.idEmpresa;

                            for (var j = 0; j < this.sedeLista.listaSedes.length; j++) {

                                this.sedeLista.listaSedes[j].idEmpresa = this.idEmpresa;

                                for (var i = 0; i < this.sedeLista.listaSedes[j].listaGerencias.length; i++) {

                                    this.sedeLista.listaSedes[j].listaGerencias[i].idEmpresa = this.idEmpresa;

                                }
                            }

                            // console.log("Sedes"+JSON.stringify(this.sedeLista));

                            this.empresaService.registrarSede(this.sedeLista).subscribe(
                                resp => {
                                    console.log(resp);
                                    if (resp.idSede !== 0) {
                                        if (Swal.isLoading()) {
                                            Swal.close();
                                        }
                                        Swal.fire('¡Creación exitosa!', "La empresa se creó con éxito", 'success');
                                        this.router.navigate(['/pages', 'main', 'configuracion', 'empresa']);

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

    public cargarEmpresa(): void {
        this.activatedRoute.params.subscribe(params => {
            const idEmpresa = params.idEmpresa;
            if (idEmpresa) {
                this.empresaService.obtenerEmpresa(idEmpresa).subscribe(
                    resp => {
                        this.empresa = resp.Empresa;
                        this.idEstado = this.empresa.indicadorBaja;

                        this.formularioEmpresa.get('idCartera').setValue(this.empresa.idCartera),
                            this.formularioEmpresa.get('razonSocial').setValue(this.empresa.razonSocial),
                            this.formularioEmpresa.get('nombreCortoEmpresa').setValue(this.empresa.nombreCortoEmpresa),
                            this.formularioEmpresa.get('ruc').setValue(this.empresa.ruc),
                            this.formularioEmpresa.get('idEstado').setValue(this.empresa.indicadorBaja),
                            this.formularioEmpresa.get('direccion').setValue(this.empresa.direccion),
                            this.tieneSede = this.empresa.indicadorSede == 1 ? true : false;

                        for (var i = 0; i < this.empresa.listaSedes.length; i++) {

                            this.sedeLista.listaSedes.push(this.empresa.listaSedes[i]);

                            this.listaSedes.push(this.empresa.listaSedes[i]);

                            console.log("Aqui" + this.empresa.listaSedes[i].listaGerencias.length);

                            // for(var j=0;j<this.empresa.listaSedes[i].listaGerencias.length;j++){

                            //     // this.sedeLista.listaSedes[j].listaGerencias.push(this.empresa.listaSedes[i].listaGerencias[j]);

                            //     if(this.sedeLista.listaSedes[j].listaGerencias ==undefined){

                            //         this.sedeLista.listaSedes[j].listaGerencias = [];

                            //     }
                            //     else{

                            //         this.sedeLista.listaSedes[j].listaGerencias.push(this.empresa.listaSedes[i].listaGerencias[j]);
                            //     }
                            // }


                        }

                        if (this.empresa.indicadorSede == 0) {
                            this.sedeSel = 0;

                            this.listaGerencias = this.sedeLista.listaSedes[this.sedeSel].listaGerencias;
                        }

                        this.loading = false;
                        console.log(this.listaSedes);
                        console.log(this.listaGerencias);
                    }
                );
            }
        });
    }

    actualizarEmpresa(): void {

        if (this.formularioEmpresa.invalid) {
            console.log("ES INVALIDO");
            return Object.values(this.formularioEmpresa.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const idCartera = this.formularioEmpresa.get("idCartera").value;
        const razonSocial = this.formularioEmpresa.get("razonSocial").value;
        const nombreCortoEmpresa = this.formularioEmpresa.get("nombreCortoEmpresa").value;
        const direccion = this.formularioEmpresa.get("direccion").value;
        const indicadorSede = this.formularioEmpresa.get("tieneSede").value ? 1 : 0;
        const ruc = this.formularioEmpresa.get("ruc").value;

        const usuarioModificacion = this.usuarioCreacion;//"USER1";
        const ipModificacion = this.dataIp;

        var empresaBody: Empresa = {
            idEmpresa: this.empresa.idEmpresa,
            idCartera: idCartera,
            razonSocial: razonSocial,
            nombreCortoEmpresa: nombreCortoEmpresa,
            direccion: direccion,
            ruc: ruc,
            indicadorBaja: this.idEstado,
            indicadorSede: indicadorSede,
            usuarioModificacion: usuarioModificacion,
            ipModificacion: ipModificacion

        };

        Swal.fire({
            title: '¿Está seguro de actualizar la empresa?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la empresa',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.empresaService.actualizarEmpresa(empresaBody).subscribe(
                    resp => {
                        console.log('Empresa Updated' + resp);
                        if (resp.idEmpresa !== 0) {
                            this.idEmpresa = resp.idEmpresa;
                            for (var j = 0; j < this.sedeLista.listaSedes.length; j++) {
                                this.sedeLista.listaSedes[j].idEmpresa = this.idEmpresa;
                                for (var i = 0; i < this.sedeLista.listaSedes[j].listaGerencias.length; i++) {
                                    this.sedeLista.listaSedes[j].listaGerencias[i].idEmpresa = this.idEmpresa;
                                }
                            }

                            console.log("Sedes " + JSON.stringify(this.sedeLista));
                            this.empresaService.actualizarSede(this.sedeLista).subscribe(
                                resp => {
                                    console.log(resp);
                                    if (resp.idSede !== 0) {
                                        if (Swal.isLoading()) {
                                            Swal.close();
                                        }
                                        Swal.fire('¡Actualización exitosa!', "La empresa se actualizó con éxito", 'success');
                                        this.router.navigate(['/pages', 'main', 'configuracion', 'empresa']);

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

    cambiarMayuscula(letra): void {
        letra.target.value = letra.target.value.toUpperCase();
    }

    get descripcionSedeNoValido(): boolean {
        return this.formularioEmpresa.get('descripcionSede').invalid && this.formularioEmpresa.get('descripcionSede').touched;
    }

    get carteraNoValido(): boolean {
        return this.formularioEmpresa.get('idCartera').invalid && this.formularioEmpresa.get('idCartera').touched;
    }

    get razonSocialNoValido(): boolean {
        return this.formularioEmpresa.get('razonSocial').invalid && this.formularioEmpresa.get('razonSocial').touched;
    }

    get nombreCortoEmpresaNoValido(): boolean {
        return this.formularioEmpresa.get('nombreCortoEmpresa').invalid && this.formularioEmpresa.get('nombreCortoEmpresa').touched;
    }

    get rucNoValido(): boolean {
        return this.formularioEmpresa.get('ruc').invalid && this.formularioEmpresa.get('ruc').touched;
    }

    get direccionNoValido(): boolean {
        return this.formularioEmpresa.get('direccion').invalid && this.formularioEmpresa.get('direccion').touched;
    }

    obtenermetodoIP() {

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
            }
        );
    }

}
