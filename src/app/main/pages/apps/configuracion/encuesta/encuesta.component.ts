import {Component, OnInit} from "@angular/core";
import FileSaver from 'file-saver';
import {Encuesta} from "../../../../../shared/models/encuesta";
import {Periodo} from "../../../../../shared/models/periodo";
import {Empresa} from "../../../../../shared/models/empresa";
import {EncuestaService} from "./encuesta.service";
import {Router} from '@angular/router';
import {PrimeNGConfig} from 'primeng/api';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';
import { AuthLoginService } from "../../../authentication/auth-login/auth-login.service";

@Component({
    selector: 'app-conf-encuesta',
    templateUrl: 'encuesta.component.html',
    styleUrls: ['encuesta.component.scss']
})

export class EncuestaComponent implements OnInit {

    listaEncuestas: Encuesta[];
    listaEmpresas: Empresa[];
    listaPeriodos: Periodo[];
    idEmpresa: number = 0;
    idAnio: number = 0;
    listaVacia: Encuesta[];
    cols: any[];
    loading: boolean;
    idPeriodo: number = 0;
    listaIndicadoresBaja: any[];
    estado: string;

    constructor(private encuestaService: EncuestaService,
                private router: Router,
                private config: PrimeNGConfig,
                private authLoginService: AuthLoginService) {
        // this.obtenerListaAnios();
        // this.obtenerListaPeriodosParametro();
        // this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
        this.obtenerListaEmpresas();
        this.obtenerListaEncuestas();
        this.listaIndicadoresBaja = [];

    }

    ngOnInit(): void {

        this.loading = true;

        this.estado = 'Activo';

        this.cols = [
            // {
            //     field: 'descripcionEmpresa',
            //     header: 'Empresa',
            //     class: 'text-center w-10',
            //     ordenadmiento: 'descripcionEmpresa',
            //     headerClass: 'text-center'
            // },
            // {
            //     field: 'dePeriodo',
            //     header: 'Periodo',
            //     class: 'text-center',
            //     ordenadmiento: 'dePeriodo',
            //     headerClass: 'text-center'
            // },
            {
                field: 'idEncuesta',
                header: 'ID Encuesta',
                class: 'text-center w-10',
                ordenadmiento: 'idEncuesta',
                headerClass: 'text-center'
            },
            {
                field: 'tituloEncuesta',
                header: 'Nombre Encuesta',
                class: 'text-center',
                ordenadmiento: 'tituloEncuesta',
                headerClass: 'text-center'
            },
            {
                field: 'cantidadPreguntas',
                header: 'Total Preguntas',
                class: 'text-center',
                ordenadmiento: 'cantidadPreguntas',
                headerClass: 'text-center'
            },
            {
                    field: 'feEncuesta',
                    header: 'Fecha Inicio',
                    class: 'text-center',
                    ordenadmiento: 'feEncuesta',
                    headerClass: 'text-center'
            },
            {
                field: 'feFinEncuesta',
                header: 'Fecha Fin',
                class: 'text-center',
                ordenadmiento: 'feFinEncuesta',
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
            {tituloEncuesta: ''},
            {tituloEncuesta: ''},
            {tituloEncuesta: ''},
        ]
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];

            for (var j = 0; j < this.listaEncuestas.length; j++) {

                var obj = new Object();
                obj['ID Encuesta'] = this.listaEncuestas[j]['idEncuesta'];
                obj['Nombre Encuesta'] = this.listaEncuestas[j]['tituloEncuesta'];
                obj['Total Preguntas'] = this.listaEncuestas[j]['cantidadPreguntas'];                
                obj['Fecha Inicio'] = this.listaEncuestas[j]['feEncuesta'];
                obj['Fecha Fin'] = this.listaEncuestas[j]['feFinEncuesta'];
                obj['Estado'] = this.listaEncuestas[j]['indicadorBaja'];
                lista.push(obj);
            }


            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Encuesta');
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


    onChangeEmpresa(deviceValue) {
        this.idEmpresa = deviceValue.target.value;
        console.log('empresa: ' + this.idEmpresa);
        this.obtenerListaPeriodos(this.idEmpresa, this.idAnio);
        this.obtenerListaEncuestas();
    }

    onChangePeriodo(deviceValue) {
        this.idPeriodo = deviceValue.target.value;

        this.obtenerListaEncuestas();
    }

    onChange(deviceValue){
        this.estado = deviceValue;

        this.obtenerListaEncuestas();
    }

    obtenerEncuestaEstado(value): void {

        let listEncuestaEstado

        listEncuestaEstado = this.listaEncuestas.filter(encuesta =>
            encuesta.indicadorBaja ==this.estado
        );

        if (listEncuestaEstado.length == 0){
            listEncuestaEstado = this.listaEncuestas.filter(encuesta =>
                encuesta.indicadorBaja=='Inactivo'
            );
        }

        this.listaEncuestas = listEncuestaEstado;
    }

    obtenerListaEmpresas(): void {
        this.encuestaService.obtenerListaEmpresas().subscribe(
            resp => {
                this.listaEmpresas = resp.listaEmpresas;
                console.log('lista de empresas : ', resp.listaEmpresas);
            }
        );
    }

    obtenerListaPeriodos(empresa: number, anio: number): void {
        this.encuestaService.obtenerListaPeriodos(empresa, anio).subscribe(
            resp => {
                this.listaPeriodos = resp.listaPeriodos;
                console.log('lista de periodos : ', resp.listaPeriodos);
            }
        );
    }

    obtenerListaEncuestas(): void {
        this.encuestaService.obtenerListaEncuestas(this.idEmpresa, this.idPeriodo).subscribe(
            resp => {
                // debugger;
                if (resp.listaEncuestas.length > 0) {
                    
                    this.listaIndicadoresBaja = [];
                    for (let i = 0; i < resp.listaEncuestas.length; i++) {
                        resp.listaEncuestas[i].indicadorBaja == '0' ? resp.listaEncuestas[i].indicadorBaja = 'Inactivo' : resp.listaEncuestas[i].indicadorBaja = 'Activo';
                        if (!this.listaIndicadoresBaja.includes(resp.listaEncuestas[i].indicadorBaja)) {
                            this.listaIndicadoresBaja.push(resp.listaEncuestas[i].indicadorBaja.toString());
                        }
                        // if (resp.listaEncuestas[i].feEncuesta != null) {
                        //     resp.listaEncuestas[i].feEncuesta = this.formatearFechas(resp.listaEncuestas[i].feEncuesta);
                        // }
                        this.listaEncuestas = resp.listaEncuestas;

                        this.obtenerEncuestaEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaEncuestas = [];
                }
            }
        );
    }

    formatearFechas(fecha: string): string {
        let d = new Date(Date.parse(fecha));
        return ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    eliminarEncuesta(idEncuesta: number): void {

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioModificacion = datosToken.data.username;

        const encuestaBodyEliminar: Encuesta = {
            idEncuesta: idEncuesta,
            usuarioModificacion: usuarioModificacion, //'UserPrueba',
            ipModificacion: '192.168.1.10'
        };
        console.log(encuestaBodyEliminar);

        Swal.fire({
            title: '¿Está seguro de eliminar la encuesta?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando la encuesta',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.encuestaService.eliminarEncuesta(encuestaBodyEliminar).subscribe(
                    resp => {
                        console.log("Metodo eliminarEncuesta");
                        console.log(resp);
                        if (resp.idPeriodo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaEncuestas();
                            Swal.fire('¡Eliminación exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'encuesta']);
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

    downloadReport(idSurvey: number) {
        window.open(this.encuestaService.downloadLink(idSurvey), '_parent');
    }
}
