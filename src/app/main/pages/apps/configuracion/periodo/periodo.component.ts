import {Component, OnInit, QueryList, ViewChild} from '@angular/core';
import FileSaver from 'file-saver';
import {PeriodoService} from './periodo.service';
import {Periodo} from '../../../../../shared/models/periodo';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {PrimeNGConfig} from 'primeng/api';
import {IdiomaEsp} from '../../../../../shared/config/idiomaEsp';
import { filter } from 'rxjs/operators';
import { Table } from 'primeng/table';
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";
import { DataLogin } from 'src/app/shared/models/data';
import {AuthLoginService} from "../../../authentication/auth-login/auth-login.service";

@Component({
    selector: 'app-conf-periodo',
    templateUrl: 'periodo.component.html',
    styleUrls: ['periodo.component.scss']
})

export class PeriodoComponent implements OnInit {

    listaPeriodos: Periodo[];
    listaVacia: Periodo[];
    cols: any[];
    listaAnios: [];
    loading: boolean;
    stopListening: boolean;
    idEmpresa: number = 0;
    idAnio: number = 0;
    indicadorBaja: number = 1;
    // lstAnios = [];
    // listaPeriodosParametro: Parametro[];
 
    // idPeriodo: number;
    listaIndicadoresBaja: any[];
    listaEmpresa: [];
    estado: string;
    idPerfil:number;
    payload: DataLogin;
    usuarioModificacion: string;

    constructor(private authLoginService: AuthLoginService,private periodoService: PeriodoService, private router: Router, private config: PrimeNGConfig) {
        
        this.solvePermissions();
        this.listaPeriodos = [];
        this.listaIndicadoresBaja = [];
        this.obtenerListaAnios();
        
        console.log('Filter'+ this.listaPeriodos);

    }
    ngOnInit(): void {
        this.loading = true;
        this.estado = 'Activo';
        this.cols = [
            {field: 'nombreCorto', header: 'Empresa', class: 'text-center', ordenadmiento: 'nombreCorto', headerClass: 'text-center'},
            {field: 'anio', header: 'Año', class: 'text-center', ordenadmiento: 'anio', headerClass: 'text-center'},
            {field: 'dePeriodo', header: 'Periodo', class: 'text-center', ordenadmiento: 'dePeriodo', headerClass: 'text-center'},
            {field: 'feIni', header: 'Fecha Inicio', class: 'text-center', ordenadmiento: 'feIni', headerClass: 'text-center'},
            {field: 'feFin', header: 'Fecha Fin', class: 'text-center', ordenadmiento: 'feFin', headerClass: 'text-center'},
            {field: 'inBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'inBaja', headerClass: 'text-center'},
            // {field: 'accion', header: 'Accion', class: 'text-center', headerClass: 'text-center'},
        ];

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioModificacion = datosToken.data.username;

        this.listaVacia = [
            {dePeriodo: ''},
            {dePeriodo: ''}
        ]

    }

    solvePermissions(){
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if(this.idPerfil==TipoPerfil.admin){
            
            this.idEmpresa=0;
            this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
            this.obtenerListaEmpresas();
            
        }
        else{
            this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
            this.obtenerListaAnios();
            this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
        }
    }


    // customFilterCallback(filter: (a) => void, value: any): void {
    //     this.stopListening = true;
    //     filter(value);
    //     this.stopListening = false;
    //     console.log('Aqui'+ value);
    //   }


    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];
           
            for(var j=0;j<this.listaPeriodos.length;j++){

                var obj = new Object();
                obj['Empresa'] =this.listaPeriodos[j]['nombreCorto'];
                obj['Año'] =this.listaPeriodos[j]['anio'];
                obj['Periodo'] =this.listaPeriodos[j]['dePeriodo'];
                obj['Fecha Inicio'] =this.listaPeriodos[j]['feIni'];
                obj['Fecha Fin'] =this.listaPeriodos[j]['feFin'];
                obj['Estado'] =this.listaPeriodos[j]['inBaja'];
                lista.push(obj);
            }


            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Periodo');
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

    obtenerListaPeriodos(empresa: number, anio: number): void {
        
        this.periodoService.obtenerListaPeriodos(empresa,anio).subscribe(
            resp => {
                
                // console.log('lista de periodos : ' + resp.listaPeriodos); 
                if(resp.listaPeriodos.length > 0){
                    
                    this.listaIndicadoresBaja = [];
                    for (let i = 0; i < resp.listaPeriodos.length; i++) {
                        resp.listaPeriodos[i].inBaja == '0' ? resp.listaPeriodos[i].inBaja = 'Inactivo' : resp.listaPeriodos[i].inBaja = 'Activo';
                        if (!this.listaIndicadoresBaja.includes(resp.listaPeriodos[i].inBaja)) {
                            this.listaIndicadoresBaja.push(resp.listaPeriodos[i].inBaja.toString());
                        }
                        if(resp.listaPeriodos[i].feIni!=null){
                            resp.listaPeriodos[i].feIni = this.formatearFechas(resp.listaPeriodos[i].feIni);
                        }
                        if(resp.listaPeriodos[i].feFin!=null){
                            resp.listaPeriodos[i].feFin = this.formatearFechas(resp.listaPeriodos[i].feFin);
                        }
                        
                        this.listaPeriodos = resp.listaPeriodos;

                        this.obtenerPeriodosEstado(this.estado);
                    }

                    this.loading = false;
                }else{
                    // console.log('resp.codigo : ' + resp.codigo); 
                        this.loading = false;
                        this.listaPeriodos = [];
                }

                // if (resp.listaPeriodos.length > 0) {
                //     for (let i = 0; i < resp.listaPeriodos.length; i++) {
                //         resp.listaPeriodos[i].indicadorBaja == '0' ? resp.listaPeriodos[i].indicadorBaja = 'Inactivo' : resp.listaPeriodos[i].indicadorBaja = 'Activo';
                //         if (!this.listaIndicadoresBaja.includes(resp.listaPeriodos[i].indicadorBaja)) {
                //             this.listaIndicadoresBaja.push(resp.listaPeriodos[i].indicadorBaja.toString());
                //         }
                //         this.listaPeriodos = resp.listaPeriodos;
                //     }
                //     this.loading = false;
                // } else {
                //     this.loading = false;
                //     this.listaPeriodos = [];
                // }
            }
        );
    }

    onChange(deviceValue){
        this.estado = deviceValue;

        this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
    }

    obtenerPeriodosEstado(value): void {

        let listPeriodosEstado;

        listPeriodosEstado = this.listaPeriodos.filter(periodo =>
            periodo.inBaja == this.estado
        );

        if (listPeriodosEstado.length == 0){
            listPeriodosEstado = this.listaPeriodos.filter(periodo =>
                periodo.inBaja == 'Inactivo'
            );
        }

        this.listaPeriodos = listPeriodosEstado;
    }

    obtenerListaEmpresas(): void {
        this.periodoService.obtenerListaEmpresas().subscribe(
            resp => {
                this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
                    empresa.indicadorBaja == this.indicadorBaja    
                );
                console.log('lista de empresas : ' + resp.listaEmpresas);
            }
        );
    }

    obtenerListaAnios(): void {
        this.periodoService.obtenerListaAnios().subscribe(
            resp => {
                this.listaAnios = resp.listaParametros;
            }
        );
    }

    formatearFechas(fecha:string):string{
        let d = new Date(Date.parse(fecha));
        return ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    // obtenerListaAnios(): void {
    //     this.periodoService.obtenerListaAnios().subscribe(
    //         resp => {
    //             this.lstAnios = resp.listaAnio;
    //         }
    //     );
    // }

    onChangeEmpresa(deviceValue): void {
        this.idEmpresa = deviceValue.target.value;
        console.log('empresa: ' + this.idEmpresa);
        console.log('anio: ' + this.idAnio);
        this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
    }

    onChangeAnio(deviceValue): void {
        this.idAnio = deviceValue.target.value;
        console.log('anio: ' + this.idAnio);
        console.log('empresa: ' + this.idEmpresa);
        this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
    }

    // obtenerListaPeriodosParametro(): void {
    //     this.periodoService.obtenerListaPeriodosParametro().subscribe(
    //         resp => {
    //             console.log(resp.listaParametros);
    //             this.listaPeriodosParametro = resp.listaParametros;
    //         }
    //     );
    // }

    eliminarPeriodo(idPeriodoEliminar: number): void {       
        

        const periodoBodyEliminar: Periodo = {
            idPeriodo: idPeriodoEliminar,
            inBaja: '0',
            idUsuaModi: this.usuarioModificacion,//'USER1',
            deUsuaModiIp: '192.168.1.1'
        };

        console.log(periodoBodyEliminar);

        Swal.fire({
            title: '¿Está seguro de eliminar el periodo?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando el periodo',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.periodoService.eliminarPeriodo(periodoBodyEliminar).subscribe(
                    resp => {
                        
                        if (resp.idPeriodo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaPeriodos(this.idEmpresa,this.idAnio);
                            Swal.fire('¡Eliminación exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'periodo']);
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
