import { Component, OnInit } from "@angular/core";
import FileSaver from 'file-saver';
import { ParametroService } from "./parametro.service";
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { AuthLoginService } from "../../../authentication/auth-login/auth-login.service";

@Component({
    selector : 'app-conf-parametro',
    templateUrl : './parametro.component.html',
    styleUrls: ['./parametro.component.scss']
})
export class ParametroComponent implements OnInit{

    listaVacia: Parametro[];
    cols: any[];
    loading: boolean;
    listaParametros: Parametro[];
    listaIndicadoresBaja: any[];
    estado: string;

    usuarioModificacion: string;

    dataIp: string = "";

    constructor(private parametroService: ParametroService, private router: Router,
        private authLoginService: AuthLoginService) {
        this.obtenerListaParametros();
        this.listaIndicadoresBaja = [];
        this.obtenermetodoIP();
    }


    ngOnInit(): void {
        this.loading = true;
        this.estado = 'Activo';

        this.cols = [
            // {
            //     field: 'idParametro',
            //     header: 'ID',
            //     class: 'text-center w-10',
            //     ordenadmiento: 'idParametro',
            //     headerClass: 'text-center'
            // },
            // {
            //     field: 'coParametro',
            //     header: 'Codigo',
            //     class: 'text-center',
            //     ordenadmiento: 'coParametro',
            //     headerClass: 'text-center'
            // },
            {
                field: 'deParametro',
                header: 'Descripción',
                class: 'text-center',
                ordenadmiento: 'deParametro',
                headerClass: 'text-center'
            },
            {
                field: 'indicadorBaja',
                header: 'Estado',
                class: 'text-center w-10',
                ordenadmiento: 'indicadorBaja',
                headerClass: 'text-center'
            }
        ];

        this.listaVacia = [
            {coParametro: '', deParametro: ''},
            {coParametro: '', deParametro: ''}
        ];

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioModificacion = datosToken.data.username;
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];
           
            for(var j=0;j<this.listaParametros.length;j++){

                var obj = new Object();
                obj['ID'] =this.listaParametros[j]['idParametro'];
                obj['Codigo'] =this.listaParametros[j]['coParametro'];
                obj['Descripción'] =this.listaParametros[j]['deParametro'];
                obj['Estado'] =this.listaParametros[j]['indicadorBaja'];
                lista.push(obj);
            }


            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Parametro');
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


    obtenerListaParametros(): void {
        this.parametroService.obtenerListaParametros().subscribe(
            resp => {
                if (resp.listaParametros.length > 0) {
                    this.listaIndicadoresBaja = [];
                    for(let i = 0; i < resp.listaParametros.length; i++){                        
                        resp.listaParametros[i].indicadorBaja == '0' ? resp.listaParametros[i].indicadorBaja = 'Inactivo' :resp.listaParametros[i].indicadorBaja = 'Activo';                        
                        if(!this.listaIndicadoresBaja.includes(resp.listaParametros[i].indicadorBaja)){                            
                            this.listaIndicadoresBaja.push(resp.listaParametros[i].indicadorBaja.toString());
                        }

                        this.listaParametros = resp.listaParametros;
                        this.obtenerParametroEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaParametros = [];
                }
            }
        );
    }

    obtenerParametroEstado(value): void{

        let listParametroEstado = this.listaParametros.filter(parametro =>
            parametro.indicadorBaja == this.estado
            );
        this.listaParametros = listParametroEstado;
    }    

    onChange(deviceValue){
        this.estado = deviceValue;
        this.obtenerListaParametros();
    }

    eliminarParametro(idParametroEliminar: number): void {
        const ipModificacion = this.dataIp;
        const ParametroBodyEliminar: Parametro = {
            idParametro: idParametroEliminar,
            usuarioModificacion: this.usuarioModificacion, //"USER",
            ipModificacion: ipModificacion //'127.0.0.1'
        };

        Swal.fire({
            title: '¿Está seguro de eliminar el parámetro?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando el parámetro',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.parametroService.eliminarParametro(ParametroBodyEliminar).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idEmpresa !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaParametros();
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

    obtenermetodoIP (){

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
                console.log(resp);
            }
        );
    }
}