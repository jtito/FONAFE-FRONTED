import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';

import { DetalleParametro } from 'src/app/shared/models/detalleParametro';
import { DetalleParametroService } from './detalleParametro.services';
import { AuthLoginService } from 'src/app/main/pages/authentication/auth-login/auth-login.service';

@Component({
    selector: 'app-conf-registrar-detalleParametro',
    templateUrl: 'form-detalleParametro.detalleParametro.html'
})

export class FormDetalleParametroComponent implements OnInit {

    formularioDetalleParametro: FormGroup;
    detalleParametro: DetalleParametro;
    loading: boolean;
    listaEstados: DetalleParametro[];
    editar: boolean;
    listaVacia: any[];
    cols: any[];

    idEstado: string;
    idDetaParametro: number = 0;
    indicadorEstado: boolean;

    idDetaParametroModificar: number;
    idParametro: number;
    coParametro: string;
    usuarioCreacion : string;
    dataIp: string = "";

    constructor(private formBuilder: FormBuilder, private router: Router,
                private detalleParametroService: DetalleParametroService, private activatedRoute: ActivatedRoute,
                private authLoginService: AuthLoginService){
                    this.crearFormulario();
                    this.obtenerListaEstadoDetalleParametros();
                    //this.obtenerDetalleParametro();
                    this.obtenermetodoIP();
                    
                }

    ngOnInit(): void {        

        this.editar = false;

        this.activatedRoute.params.subscribe(params => {
            //this.obtenerDetalleParametro();
            
            if (params.idDetaParametro && params.idParametro) {
                this.idDetaParametroModificar = params.idDetaParametro;
                this.idParametro = params.idParametro;
                this.loading = true;
            }            
            if(params.idParametro){
                this.idParametro = params.idParametro;
                this.obtenerParametro(this.idParametro);
            }
            
            console.log("valor de idParametro en form detalle parametro");
            console.log(this.idParametro);
            console.log(this.idDetaParametro);
            
            if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
                this.editar = true;
                this.formularioDetalleParametro.enable();
            } else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {

                this.editar = false;
                this.formularioDetalleParametro.enable();
            } else {

                this.formularioDetalleParametro.disable();

            }

            const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
            this.usuarioCreacion = datosToken.data.username;
        });

        //this.loading = false;
        console.log(this.loading);
        this.cargarDetalleParametro();
    }

    private crearFormulario():void {
        this.formularioDetalleParametro = this.formBuilder.group({
            //coParametro: ['', [Validators.required, Validators.maxLength(10)]],
            deParametro: ['', [Validators.required, Validators.maxLength(250)]],
            deValor1: ['',[Validators.maxLength(100)]],
            deValor2: ['',[Validators.maxLength(100)]],
            deValor3: ['',[Validators.maxLength(100)]],
            deValor4: ['',[Validators.maxLength(100)]],
            idEstado: [''],
        });
    }

    public onChangeEstado(deviceValue): void {
        this.idEstado = deviceValue.target.value;
    }

    public obtenerListaEstadoDetalleParametros(): void {
        this.detalleParametroService.obtenerListaEstadoDetalleParametros().subscribe(
            resp => {
                console.log("pruebade obtener estados");
                console.log(resp)
                this.listaEstados = resp.listaParametros;
            }
        );
   }

    public registrarDetalleParametro(): void {
        // console.log("hola registrarDetalleParametro");
        if (this.formularioDetalleParametro.invalid) {
            return Object.values(this.formularioDetalleParametro.controls).forEach(control => {
                control.markAsTouched();
            });
        }      

        const detalleParametroBody: DetalleParametro = {    
            idParametro: this.idParametro,        
            coParametro: this.coParametro,
            deParametro: this.formularioDetalleParametro.get('deParametro').value,
            deValor1: this.formularioDetalleParametro.get('deValor1').value,
            deValor2: this.formularioDetalleParametro.get('deValor2').value,
            deValor3: this.formularioDetalleParametro.get('deValor3').value,
            deValor4: this.formularioDetalleParametro.get('deValor4').value,
            usuarioCreacion: this.usuarioCreacion, //"USER1",
            ipCreacion: this.dataIp //"127.0.0.1"
        };
        
        Swal.fire({
            title: '¿Está seguro de crear el detalle parámetro?',
            showCancelButton: true,
            confirmButtonText: `Crear`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos creando el detalle parámetro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.detalleParametroService.registrarNuevoDetalleParametro(detalleParametroBody).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idDetaParametro !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Creación exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'parametro','detalle',this.idParametro]);
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

    public cargarDetalleParametro(): void {
        this.activatedRoute.params.subscribe(params => {
            const idDetaParametro = params.idDetaParametro;            
            if(idDetaParametro){
                this.detalleParametroService.obtenerDetalleParametro(idDetaParametro).subscribe(
                    resp => {                        
                        this.detalleParametro = resp.DetalleParametro;
                        this.idEstado = this.detalleParametro.indicadorBaja;
                        //this.formularioDetalleParametro.get('coParametro').setValue(this.detalleParametro.coParametro);
                        this.coParametro= this.detalleParametro.coParametro;
                        this.formularioDetalleParametro.get('deParametro').setValue(this.detalleParametro.deParametro);
                        this.formularioDetalleParametro.get('deValor1').setValue(this.detalleParametro.deValor1);
                        this.formularioDetalleParametro.get('deValor2').setValue(this.detalleParametro.deValor2);
                        this.formularioDetalleParametro.get('deValor3').setValue(this.detalleParametro.deValor3);
                        this.formularioDetalleParametro.get('deValor4').setValue(this.detalleParametro.deValor4);
                        this.formularioDetalleParametro.get('idEstado').setValue(this.detalleParametro.indicadorBaja);

                        this.loading = false;
                    }
                );
            }
        });
    }

    public obtenerParametro(idParametro:number): void {

        if(idParametro){
            this.detalleParametroService.obtenerParametro(idParametro).subscribe(
                resp => {
                    this.coParametro= resp.Parametro.coParametro;
                    console.log("el coParametro es");
                    console.log(this.coParametro);
                    console.log(resp);
                }
            );
        }
        
    }

    public actualizarDetalleParametro(): void {

        if (this.formularioDetalleParametro.invalid) {
            return Object.values(this.formularioDetalleParametro.controls).forEach(control => {
                control.markAsTouched();
            });
        }
        
        const idDetaParametro = this.detalleParametro.idDetaParametro;
        const idParametro = this.detalleParametro.idParametro;
        const deParametro = this.formularioDetalleParametro.get("deParametro").value;
        //const coParametro = this.formularioDetalleParametro.get("coParametro").value;
        const deValor1 = this.formularioDetalleParametro.get("deValor1").value;
        const deValor2 = this.formularioDetalleParametro.get("deValor2").value;
        const deValor3 = this.formularioDetalleParametro.get("deValor3").value;
        const deValor4 = this.formularioDetalleParametro.get("deValor4").value;
        const indicadorBaja = this.idEstado;        
        const usuarioModificacion = this.usuarioCreacion; //"USER1";
        const ipModificacion = this.dataIp //"127.0.0.1";

        var detalleParametroBody: DetalleParametro = {
            idDetaParametro: idDetaParametro,
            idParametro: idParametro,
            deParametro: deParametro,
            coParametro: this.coParametro,
            deValor1: deValor1,
            deValor2: deValor2,
            deValor3: deValor3,
            deValor4: deValor4,
            indicadorBaja: indicadorBaja,
            usuarioModificacion: usuarioModificacion,
            ipModificacion: ipModificacion,

        };

        Swal.fire({
            title: '¿Está seguro de actualizar el detalle del parámetro?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando los datos del detalle parámetro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.detalleParametroService.actualizarDetalleParametro(detalleParametroBody).subscribe(
                    resp => {
                        console.log('Parametro Updated' + resp);
                        if (resp.idDetaParametro !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'parametro', 'detalle', this.idParametro]);                            

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

    get deParametroNoValido(): boolean {
        return this.formularioDetalleParametro.get('deParametro').invalid && this.formularioDetalleParametro.get('deParametro').touched;
    }

    get deValor1NoValido(): boolean {
        return this.formularioDetalleParametro.get('deValor1').invalid && this.formularioDetalleParametro.get('deValor1').touched;
    }

    get deValor2NoValido(): boolean {
        return this.formularioDetalleParametro.get('deValor2').invalid && this.formularioDetalleParametro.get('deValor2').touched;
    }

    get deValor3NoValido(): boolean {
        return this.formularioDetalleParametro.get('deValor3').invalid && this.formularioDetalleParametro.get('deValor3').touched;
    }

    get deValor4NoValido(): boolean {
        return this.formularioDetalleParametro.get('deValor4').invalid && this.formularioDetalleParametro.get('deValor4').touched;
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