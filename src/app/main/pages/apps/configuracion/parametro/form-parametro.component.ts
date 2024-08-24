import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { ParametroService } from './parametro.service';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';


@Component({
    selector: 'app-conf-registrar-parametro',
    templateUrl: 'form-parametro.parametro.html'
})

export class FormParametroComponent implements OnInit {

    formularioParametro: FormGroup;
    parametro: Parametro;
    loading: boolean;
    listaEstados: Parametro[];
    editar: boolean;
    listaVacia: any[];
    cols: any[];

    idEstado: string;
    idParametro: number = 0;
    indicadorEstado: boolean;

    idParametroModificar: number;

    usuarioCreacion: string;
    dataIp: string = "";

    constructor(private formBuilder: FormBuilder, private router: Router,
                private parametroService: ParametroService, private activatedRoute: ActivatedRoute,
                private authLoginService: AuthLoginService){
                    this.crearFormulario();
                    this.obtenerListaEstadoParametros();
                    this.obtenermetodoIP();
                }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params.idParametro) {
                this.idParametroModificar = params.idParametro;
                this.loading = true;
            }
            if (this.activatedRoute.snapshot.url[0].toString() === 'editar' ||
                this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.editar = true;
            } else {
                this.formularioParametro.disable();
                this.editar = false;
            }
        });
        //this.loading = false;
        console.log(this.loading);
        this.cargarParametro();

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioCreacion = datosToken.data.username;
    }

    private crearFormulario():void {
        this.formularioParametro = this.formBuilder.group({
            coParametro: ['', [Validators.required, Validators.maxLength(10)]],
            deParametro: ['', [Validators.required, Validators.maxLength(250)]],
            idEstado: [''],
        });
    }

    public cargarParametro(): void {
        this.activatedRoute.params.subscribe(params => {
            const idParametro = params.idParametro;
            if(idParametro){
                this.parametroService.obtenerParametro(idParametro).subscribe(
                    resp => {                        
                        this.parametro = resp.Parametro;
                        this.idEstado = this.parametro.indicadorBaja;
                        this.formularioParametro.get('coParametro').setValue(this.parametro.coParametro);
                        this.formularioParametro.get('deParametro').setValue(this.parametro.deParametro);
                        this.formularioParametro.get('idEstado').setValue(this.parametro.indicadorBaja);

                        this.loading = false;
                    }
                );
            }
        });
    }

    public onChangeEstado(deviceValue): void {
        this.idEstado = deviceValue.target.value;
    }


    public registrarParametro(): void {
        
        if (this.formularioParametro.invalid) {
            return Object.values(this.formularioParametro.controls).forEach(control => {
                control.markAsTouched();
            });
        }       

        const parametroBody: Parametro = {            
            coParametro: this.formularioParametro.get('coParametro').value,
            deParametro: this.formularioParametro.get('deParametro').value,
            usuarioCreacion: this.usuarioCreacion,
            ipCreacion: this.dataIp //"127.0.0.1"
        };
        
        Swal.fire({
            title: '¿Está seguro de crear el parámetro?',
            showCancelButton: true,
            confirmButtonText: `Guardar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos creando el parámetro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.parametroService.registrarNuevoParametro(parametroBody).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idParametro !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Creación exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'parametro']);
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

    public obtenerListaEstadoParametros(): void {
        this.parametroService.obtenerListaEstadoParametros().subscribe(
            resp => {
                this.listaEstados = resp.listaParametros;
            }
        );
   }


    public actualizarParametro(): void {

        if (this.formularioParametro.invalid) {
            console.log("ES INVALIDO");
            return Object.values(this.formularioParametro.controls).forEach(control => {
                control.markAsTouched();
            });
        }
        
        const idParametro = this.parametro.idParametro;
        const deParametro = this.formularioParametro.get("deParametro").value;
        const coParametro = this.formularioParametro.get("coParametro").value;
        const indicadorBaja = this.idEstado; 
        
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioModificacion = datosToken.data.username; //"USER1"     
        const ipModificacion = this.dataIp //"127.0.0.1";

        var parametroBody: Parametro = {
            idParametro: idParametro,
            deParametro: deParametro,
            coParametro: coParametro,
            indicadorBaja: indicadorBaja,
            usuarioModificacion: usuarioModificacion,
            ipModificacion: ipModificacion,

        };

        Swal.fire({
            title: '¿Está seguro de actualizar el parámetro?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando el parámetro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.parametroService.actualizarParametro(parametroBody).subscribe(
                    resp => {
                        
                        if (resp.idParametro !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'parametro']);                            

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

    get coParametroNoValido(): boolean {
        return this.formularioParametro.get('coParametro').invalid && this.formularioParametro.get('coParametro').touched;
    }

    get deParametroNoValido(): boolean {
        return this.formularioParametro.get('deParametro').invalid && this.formularioParametro.get('deParametro').touched;
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