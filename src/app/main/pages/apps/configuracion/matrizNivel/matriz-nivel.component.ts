import {Component, OnInit} from "@angular/core";
import FileSaver from 'file-saver';
import {Empresa} from "../../../../../shared/models/empresa";
import {MatrizNivel} from "../../../../../shared/models/matrizNivel";
import {ParametroMatrizNivel} from "../../../../../shared/models/parametroMatrizNivel";
import {MatrizNivelService} from './matriz-nivel.service';
import {AuthLoginService} from '../../../../pages/authentication/auth-login/auth-login.service';

import Swal from 'sweetalert2';
import { ProcesoMatriz } from "src/app/shared/models/procesoMatriz";
import { DataLogin } from "src/app/shared/models/data";
import { TipoPerfil } from "src/app/shared/models/tipoPerfil";

@Component({
    selector: 'app-conf-matriz-nivel',
    templateUrl: 'matriz-nivel.component.html',
    styleUrls: ['matriz-nivel.component.scss']
})
export class MatrizNivelComponent implements OnInit {

    listaEmpresas: Empresa[];
    listaProcesoMatriz: ProcesoMatriz[];
    listaVacia: ProcesoMatriz[];
    loading: boolean;
    cols: any[];
    listaIndicadoresBaja: any[];
    EmpresaSel:number=0;
    SedeSel:number=0;
    idTipoMatriz:number=0;
    estado: string;
    indicadorBaja: number = 1;
    idPerfil:number;
    payload: DataLogin;
    dataIp: string = "";
    
    constructor(private matrizNivelService:MatrizNivelService,private authLoginService:AuthLoginService) {
        this.listaIndicadoresBaja = [];
        this.solvePermissions();
        this.obtenermetodoIP();
    }

    ngOnInit(): void {
        this.loading = true;
        this.estado = 'Activo';
        this.cols = [
            {field: 'deEmpresa', header: 'Empresa', class: 'text-center', ordenadmiento: 'deEmpresa', headerClass: 'text-center'},
            {field: 'cantidadProcesos', header: 'Cantidad de Procesos', class: 'text-center', ordenadmiento: 'cantidadProcesos', headerClass: 'text-center'},
            {field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja', headerClass: 'text-center'},
        ];

        this.listaVacia = [
            {deEmpresa: ''},
            {deEmpresa: ''},
            {deEmpresa: ''},
        ]
        
    }

    solvePermissions(){
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if(this.idPerfil==TipoPerfil.admin){
            
            this.EmpresaSel=0;
            this.obtenerListaEmpresa();
            this.obtenerListaProcesosMatriz();
            
        }
        else{
            this.EmpresaSel = this.payload.data.datosEmpresa.idEmpresa;
            this.obtenerListaProcesosMatriz();
        }
      }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];
           
            for(var j=0;j<this.listaProcesoMatriz.length;j++){
    
                var obj = new Object();
                obj['Empresa'] =this.listaProcesoMatriz[j]['deEmpresa'];
                obj['Cantidad de procesos'] =this.listaProcesoMatriz[j]['cantidadProcesos'];
                obj['Estado'] =this.listaProcesoMatriz[j]['indicadorBaja'];
                lista.push(obj);
            }
    
            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Procesos por matriz');
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

    onChangeEmpresa(input) {

        this.EmpresaSel = input.target.value;
        this.obtenerListaProcesosMatriz();

    }

    obtenerListaEmpresa():void{

        this.matrizNivelService.obtenerListaEmpresa().subscribe(
            resp => {
                this.listaEmpresas = resp.listaEmpresas.filter(empresa =>
                    empresa.indicadorBaja == this.indicadorBaja    
                );
            
            }
        );

    }

    obtenerListaProcesosMatriz(): void {

        this.matrizNivelService.obtenerListaProcesoMatriz(this.EmpresaSel).subscribe(
            resp => {
                // console.log('lista de Matriz : ' + JSON.stringify(resp.listaProcesoMatriz));
                if (resp.listaProcesoMatriz.length > 0) {
                    this.listaIndicadoresBaja = [];
                    for (let i = 0; i < resp.listaProcesoMatriz.length; i++) {
                        resp.listaProcesoMatriz[i].indicadorBaja == '0' ? resp.listaProcesoMatriz[i].indicadorBaja = 'Inactivo' : resp.listaProcesoMatriz[i].indicadorBaja = 'Activo';
                        if (!this.listaIndicadoresBaja.includes(resp.listaProcesoMatriz[i].indicadorBaja)) {
                          this.listaIndicadoresBaja.push(resp.listaProcesoMatriz[i].indicadorBaja.toString());
                      }
                        this.listaProcesoMatriz = resp.listaProcesoMatriz;

                        this.obtenerProcesosMatrizEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaProcesoMatriz = [];
                }
            }
        );
    }

    onChange(deviceValue){
        this.estado = deviceValue;

        this.obtenerListaProcesosMatriz();
    }

    obtenerProcesosMatrizEstado(value): void {

        let listProcesosEstado;

        listProcesosEstado = this.listaProcesoMatriz.filter(procesosMatriz =>
            procesosMatriz.indicadorBaja == this.estado
        );

        if (listProcesosEstado.length == 0){
            listProcesosEstado = this.listaProcesoMatriz.filter(procesosMatriz =>
                procesosMatriz.indicadorBaja=='Inactivo'
            );
        }

        this.listaProcesoMatriz = listProcesosEstado;
    } 

    eliminarProcesoMatriz(idProcesoMatrizEliminar: number): void {

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const ipModificacion = this.dataIp;
    
        const procesoMatrizBodyEliminar: ProcesoMatriz = {
            idProcesoMatriz: idProcesoMatrizEliminar,
            usuarioModificacion:datosToken.data.username,
            ipModificacion: ipModificacion //'127.0.0.1'
        };
    
        console.log(procesoMatrizBodyEliminar);
    
        Swal.fire({
            title: '¿Está seguro de eliminar el proceso por matriz?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando el proceso por matriz',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.matrizNivelService.eliminarProcesoMatriz(procesoMatrizBodyEliminar).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idProcesoMatriz !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaProcesosMatriz();
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
