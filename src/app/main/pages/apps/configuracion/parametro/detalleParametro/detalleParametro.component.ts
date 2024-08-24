import { Component, OnInit } from "@angular/core";
import FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { DetalleParametroService } from "./detalleParametro.services";
import { DetalleParametro } from "src/app/shared/models/detalleParametro";
import { AuthLoginService } from "src/app/main/pages/authentication/auth-login/auth-login.service";

@Component({
    selector : 'app-conf-detalleParametro',
    templateUrl : './detalleParametro.component.html',
    styleUrls: ['./detalleParametro.component.scss']
})

export class DetalleParametroComponent implements OnInit{

    public formularioDetalleParametro: FormGroup;
    listaVacia: DetalleParametro[];
    cols: any[];
    loading: boolean;
    listaDetalleParametros: DetalleParametro[];
    listaIndicadoresBaja: any[];
    estado: string;
    idParametro: number;
    detalleParametro: DetalleParametro;

    deParametro: string;

    hola: string;

    idEstado: string;

    displayc: boolean = false;

    usuarioCreacion: string;

    dataIp: string = "";

    constructor(private detalleParametroService: DetalleParametroService, private formBuilder: FormBuilder
        , private router: Router, private activatedRoute: ActivatedRoute,
        private authLoginService: AuthLoginService) {        
        this.listaIndicadoresBaja = [];
        this.crearFormulario();
        // this.hola='hola richard';
        this.obtenermetodoIP();
        
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            // console.log("params");
            // console.log(params);
            if (params.idParametro) {
                this.idParametro = params.idParametro;
                this.obtenerParametro(this.idParametro);
            }
            // console.log("valor de idParametro en detalle parametro");
            // console.log(this.idParametro);
        });

        this.loading = true;
        this.estado = 'Activo';

        this.cols = [
            // {
            //     field: 'idDetaParametro',
            //     header: 'ID',
            //     class: 'text-center w-10',
            //     ordenadmiento: 'idDetaParametro',
            //     headerClass: 'text-center'
            // },
            /*{
                field: 'idParametro',
                header: 'ID Parametro',
                class: 'text-center w-10',
                ordenadmiento: 'idParametro',
                headerClass: 'text-center'
            }, */
            /* {
                field: 'coParametro',
                header: 'Codigo',
                class: 'text-center',
                ordenadmiento: 'coParametro',
                headerClass: 'text-center'
            }, */
            {
                field: 'deParametro',
                header: 'Descripción',
                class: 'text-center',
                ordenadmiento: 'deParametro',
                headerClass: 'text-center'
            },
            {
                field: 'deValor1',
                header: 'Descripción Valor 1',
                class: 'text-center',
                ordenadmiento: 'deValor1',
                headerClass: 'text-center'
            },
            {
                field: 'deValor2',
                header: 'Descripción Valor 2',
                class: 'text-center',
                ordenadmiento: 'deValor2',
                headerClass: 'text-center'
            },
            {
                field: 'deValor3',
                header: 'Descripción Valor 3',
                class: 'text-center',
                ordenadmiento: 'Valor3',
                headerClass: 'text-center'
            },
            {
                field: 'deValor4',
                header: 'Descripción Valor 4',
                class: 'text-center',
                ordenadmiento: 'deValor4',
                headerClass: 'text-center'
            },
            /* {
                field: 'feValor1',
                header: 'Fecha Valor1',
                class: 'text-center',
                ordenadmiento: 'feValor1',
                headerClass: 'text-center'
            },
            {
                field: 'feValor2',
                header: 'Fecha Valor2',
                class: 'text-center',
                ordenadmiento: 'feValor2',
                headerClass: 'text-center'
            },
            {
                field: 'feValor3',
                header: 'Fecha Valor3',
                class: 'text-center',
                ordenadmiento: 'feValor3',
                headerClass: 'text-center'
            },
            {
                field: 'feValor4',
                header: 'Fecha Valor4',
                class: 'text-center',
                ordenadmiento: 'feValor4',
                headerClass: 'text-center'
            }, */
            {
                field: 'indicadorBaja',
                header: 'Estado',
                class: 'text-center w-10',
                ordenadmiento: 'indicadorBaja',
                headerClass: 'text-center'
            }
        ];

        this.listaVacia = [{deValor1:'',deValor2:''},{deValor1:'',deValor2:''}];

        this.obtenerListaDetalleParametros();

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioCreacion = datosToken.data.username;

    }

    rutaDetalle(idParametro): void{
        console.log("pruebaaaa "+this.idParametro);

        this.router.navigate(['pages', 'main', 'configuracion','parametro','detalle',idParametro,'registrarDetalleParametro']);

    }

    obtenerParametro(idParametro:number): void {

        if(idParametro){
            this.detalleParametroService.obtenerParametro(idParametro).subscribe(
                resp => {
                    this.deParametro= "Lista de " + resp.Parametro.deParametro;
                }
            );
        }
        
    }


    obtenerListaDetalleParametros(): void {
        this.detalleParametroService.obtenerListaDetalleParametros(this.idParametro).subscribe(
            resp => {
                if (resp.listaDetalleParametros.length > 0) {
                    this.listaIndicadoresBaja = [];
                    for(let i = 0; i < resp.listaDetalleParametros.length; i++){                        
                        resp.listaDetalleParametros[i].indicadorBaja == '0' ? resp.listaDetalleParametros[i].indicadorBaja = 'Inactivo' :resp.listaDetalleParametros[i].indicadorBaja = 'Activo';                        
                        if(!this.listaIndicadoresBaja.includes(resp.listaDetalleParametros[i].indicadorBaja)){                            
                            this.listaIndicadoresBaja.push(resp.listaDetalleParametros[i].indicadorBaja.toString());
                        }

                        this.listaDetalleParametros = resp.listaDetalleParametros;
                        this.obtenerDetalleParametroEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaDetalleParametros = [];
                }
            }
        );
        
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];
           
            for(var j=0;j<this.listaDetalleParametros.length;j++){

                var obj = new Object();                
                obj['ID'] =this.listaDetalleParametros[j]['idDetaParametro'];
                obj['Descripción'] =this.listaDetalleParametros[j]['deParametro'];                
                obj['Descripción Valor 1'] =this.listaDetalleParametros[j]['deValor1'];
                obj['Descripción Valor 2'] =this.listaDetalleParametros[j]['deValor2'];
                obj['Descripción Valor 3'] =this.listaDetalleParametros[j]['deValor3'];
                obj['Descripción Valor 4'] =this.listaDetalleParametros[j]['deValor4'];
                obj['Estado'] =this.listaDetalleParametros[j]['indicadorBaja'];
                lista.push(obj);
            }


            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'DetalleParametro');
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

    /* public registrarDetalleParametro(): void {        
        if (this.formularioDetalleParametro.invalid) {
            return Object.values(this.formularioDetalleParametro.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const detalleParametroBody: DetalleParametro = {            
            idParametro: this.formularioDetalleParametro.get('idParametro').value,
            usuarioCreacion: "USER1",
            ipCreacion: "127.0.0.1"
        };
        
        Swal.fire({
            title: '¿Está seguro de registrar el parametro?',
            showCancelButton: true,
            confirmButtonText: `Guardar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos registrando los datos del nuevo detalle parametro',
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
                            Swal.fire('¡Registro exitoso!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'detalle-parametro']);
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
    } */

    public actualizarDetalleParametro(): void {

        if (this.formularioDetalleParametro.invalid) {
            console.log("ES INVALIDO");
            return Object.values(this.formularioDetalleParametro.controls).forEach(control => {
                control.markAsTouched();
            });
        }
        
        const idDetaParametro = this.detalleParametro.idDetaParametro;
        const idParametro = this.formularioDetalleParametro.get("idParametro").value;
        const deParametro = this.formularioDetalleParametro.get("deParametro").value;
        const coParametro = this.formularioDetalleParametro.get("coParametro").value;
        const indicadorBaja = this.idEstado;        
        const usuarioModificacion = this.usuarioCreacion; //"USER1";
        const ipModificacion = this.dataIp; //"127.0.0.1";

        var detalleParametroBody: DetalleParametro = {
            idDetaParametro: idDetaParametro,
            idParametro: idParametro,
            deParametro: deParametro,
            coParametro: coParametro,
            indicadorBaja: indicadorBaja,
            usuarioModificacion: usuarioModificacion,
            ipModificacion: ipModificacion,

        };

        Swal.fire({
            title: '¿Está seguro de actualizar el detalle parámetro?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando el detalle parámetro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.detalleParametroService.actualizarDetalleParametro(detalleParametroBody).subscribe(
                    resp => {

                        if (resp.idDetaParametro !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'detalle-parametro']);                            

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

    eliminarDetalleParametro(idDetaParametroEliminar: number): void {
        const DetalleParametroBodyEliminar: DetalleParametro = {
            idDetaParametro: idDetaParametroEliminar,
            usuarioModificacion: this.usuarioCreacion, //"USER",
            ipModificacion: this.dataIp //'127.0.0.1'
        };

        Swal.fire({
            title: '¿Está seguro de eliminar el detalle parametro?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando el detalle parametro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.detalleParametroService.eliminarDetalleParametro(DetalleParametroBodyEliminar).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idEmpresa !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaDetalleParametros();
                            Swal.fire('¡Eliminación exitosa!', resp.mensaje, 'success');
                           
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

    obtenerDetalleParametroEstado(value): void{

        let listDetalleParametroEstado = this.listaDetalleParametros.filter(parametro =>
            parametro.indicadorBaja == this.estado
            );
        this.listaDetalleParametros = listDetalleParametroEstado;
    }

    onChange(deviceValue){
        this.estado = deviceValue;
        this.obtenerListaDetalleParametros();
    }


    private crearFormulario():void {
        this.formularioDetalleParametro = this.formBuilder.group({
            coParametro: ['', [Validators.required, Validators.maxLength(10)]],
            deParametro: ['', [Validators.required, Validators.maxLength(250)]],
            idEstado: [''],
        });
    }


    get idDetaParametroNoValido(): boolean {
        return this.formularioDetalleParametro.get('idDetaParametro').invalid && this.formularioDetalleParametro.get('idDetaParametro').touched;
    }

    get deValor1NoValido(): boolean {
        return this.formularioDetalleParametro.get('deValor1').invalid && this.formularioDetalleParametro.get('deValor1').touched;
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