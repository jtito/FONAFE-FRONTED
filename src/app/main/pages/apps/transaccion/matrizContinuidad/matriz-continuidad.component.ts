import {Component, OnInit} from '@angular/core';
import FileSaver from 'file-saver';
import {MatrizContinuidadService} from './matriz-continuidad.service';
import {MatrizRiesgo} from '../../../../../shared/models/matrizRiesgo';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {Empresa} from "../../../../../shared/models/empresa";
import {Periodo} from "../../../../../shared/models/periodo";
import {BandejaMatrizRiesgo} from "../../../../../shared/models/bandejaMatrizRiesgo";
import { MatrizContinuidad } from 'src/app/shared/models/matrizContinuidad';
import {AuthLoginService} from "../../../authentication/auth-login/auth-login.service";
import {DataLogin} from "../../../../../shared/models/data";
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";

@Component({
    selector: 'app-conf-matriz-riesgo',
    templateUrl: 'matriz-continuidad.component.html',
    styleUrls: ['matriz-continuidad.component.scss']
})

export class MatrizContinuidadComponent implements OnInit {

    listaVacia: BandejaMatrizRiesgo[];
    cols: any[];
    loading: boolean;
    listaEmpresa: Empresa[];
    listaMatrizNivel: Parametro[];
    listaPeriodo: Periodo[];
    listaMatrizRiesgo: BandejaMatrizRiesgo[];
    listaIndicadoresBaja: any[];
    indicadorBaja: number = 1;

    idEmpresa: number;
    idPeriodo: number;
    idMatrizNivel: number;
    estado: string;

    payload: DataLogin;
    idPerfil: number;
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    tipoPerfilusuario: TipoPerfil = TipoPerfil.user;

    usuarioModificacion: string;
    dataIp: string = "";

    constructor(private matrizRiesgoService: MatrizContinuidadService, private router: Router,private authLoginService: AuthLoginService) {
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        this.solvePermissions();
        this.idPeriodo = 0;
        this.idMatrizNivel = 0;
        this.listaIndicadoresBaja = [];
        this.obtenerListaEmpresa();
        this.obtenerListaMatrizNivel();
        this.listarBandejaMatrizRiesgo();
        this.obtenermetodoIP();
    }

    ngOnInit(): void {
        this.loading = true;
        this.estado = 'Activo';
        this.cols = [
            {field: 'idMatrizRiesgo', header: 'Id Matriz', class: 'text-center', ordenadmiento: 'idMatrizRiesgo'},
            {field: 'deCartera', header: 'Cartera', class: 'text-center', ordenadmiento: 'deCartera'},
            {field: 'nombreCortoEmpresa', header: 'Empresa', class: 'text-center', ordenadmiento: 'nombreCortoEmpresa'},
            {field: 'deAnioPeriodo', header: 'Periodo', class: 'text-center', ordenadmiento: 'deAnioPeriodo'},
            {field: 'deTipoMatriz', header: 'Matriz Nivel', class: 'text-center', ordenadmiento: 'deTipoMatriz'},
            // {field: 'deMatrizNivel', header: 'Matriz Nivel', class: 'text-center', ordenadmiento: 'deMatrizNivel'},
            {field: 'fechaCreacion', header: 'Fecha de Creación', class: 'text-center', ordenadmiento: 'fechaCreacion'},
            {field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja'}
        ];

        this.listaVacia = [
            {deMatrizNivel: '', deTipoMatriz: ''},
            {deMatrizNivel: '', deTipoMatriz: ''}
        ];

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioModificacion = datosToken.data.username;
    }

    solvePermissions(){
        if(this.idPerfil==TipoPerfil.admin){
            this.idEmpresa=0;
        }
        else{
            this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
            this.obtenerListaPeriodo();
        }
    }

    obtenerListaEmpresa() {
        return this.matrizRiesgoService.obtenerListaEmpresas().subscribe(resp => {
            this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
                empresa.indicadorBaja == this.indicadorBaja
            );
        });
    }

    obtenerListaPeriodo() {
        const anio = 0;
        return this.matrizRiesgoService.obtenerListaPeriodo(this.idEmpresa, anio).subscribe(resp => {
            this.listaPeriodo = resp.listaPeriodos.filter(periodo =>
                periodo.inBaja == this.indicadorBaja
            );
        });
    }

    obtenerListaMatrizNivel() {
        return this.matrizRiesgoService.obtenerListaMatrizNivel().subscribe(resp => {
            this.listaMatrizNivel = resp.listaParametros;
        });
    }

    onChangeEmpresa(input): void {
        this.idEmpresa = input.target.value;
        this.obtenerListaPeriodo();
        this.listarBandejaMatrizRiesgo();
    }

    onChangePeriodo(input) {
        this.idPeriodo = input.target.value;
        this.listarBandejaMatrizRiesgo();
    }

    onChangeMatrizNivel(input) {
        this.idMatrizNivel = input.target.value;
        this.listarBandejaMatrizRiesgo();
    }

    empresaChange(idEmpresa:number){

        this.idEmpresa = idEmpresa;
        this.obtenerListaPeriodo();
        if(this.idEmpresa==0){
            this.idPeriodo=0;
            this.listaPeriodo = [];
            
        }
        this.listarBandejaMatrizRiesgo();
    }
       
    periodoChange(idPeriodo:number){
       
        this.idPeriodo = idPeriodo;
        this.listarBandejaMatrizRiesgo();
    }
  

    listarBandejaMatrizRiesgo() {
        console.log('empresa' + this.idEmpresa + 'periodo' + this.idPeriodo + 'tipoMatriz' + this.idMatrizNivel)
        return this.matrizRiesgoService.listarBandejaMatrizRiesgo(this.idEmpresa, this.idPeriodo, this.idMatrizNivel).subscribe(
            resp => {
                console.log(resp.listaBandejaMatrizContinuidad);
                if (resp.listaBandejaMatrizContinuidad.length > 0) {
                    for (let i = 0; i < resp.listaBandejaMatrizContinuidad.length; i++) {
                        resp.listaBandejaMatrizContinuidad[i].indicadorBaja == '0' ? resp.listaBandejaMatrizContinuidad[i].indicadorBaja = 'Inactivo' : resp.listaBandejaMatrizContinuidad[i].indicadorBaja = 'Activo';
                        if (!this.listaIndicadoresBaja.includes(resp.listaBandejaMatrizContinuidad[i].indicadorBaja)) {
                            this.listaIndicadoresBaja.push(resp.listaBandejaMatrizContinuidad[i].indicadorBaja.toString());
                        }
                        this.listaMatrizRiesgo = resp.listaBandejaMatrizContinuidad;

                        this.obtenerMatrizRiesgoEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaMatrizRiesgo = [];
                }
            });
    }

    onChange(deviceValue){
        this.estado = deviceValue;

        this.listarBandejaMatrizRiesgo();
    }

    obtenerMatrizRiesgoEstado(value): void {

        let listMatricesEstado;

        listMatricesEstado = this.listaMatrizRiesgo.filter(matriz =>
            matriz.indicadorBaja == this.estado
        );

        if (listMatricesEstado.length == 0){
            listMatricesEstado = this.listaMatrizRiesgo.filter(matriz =>
                matriz.indicadorBaja == 'Inactivo'
            );
        }

        this.listaMatrizRiesgo = listMatricesEstado;
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];

            for(var j=0;j<this.listaMatrizRiesgo.length;j++){

                var obj = new Object();
                obj['Id Matriz'] =this.listaMatrizRiesgo[j]['idMatrizRiesgo'];
                obj['Cartera'] =this.listaMatrizRiesgo[j]['deCartera'];
                obj['Empresa'] =this.listaMatrizRiesgo[j]['nombreCortoEmpresa'];
                obj['Periodo'] =this.listaMatrizRiesgo[j]['deAnioPeriodo'];
                obj['Matriz Nivel'] =this.listaMatrizRiesgo[j]['deTipoMatriz'];
                obj['Fecha de Creación'] =this.listaMatrizRiesgo[j]['fechaCreacion'];
                obj['Estado'] =this.listaMatrizRiesgo[j]['indicadorBaja'];
                lista.push(obj);
            }


            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'MatrizRiesgoContinuidad');
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

    eliminarMatrizRiesgo(idMatrizRiesgo: number): void {

        const matrizriesgoBodyEliminar: MatrizContinuidad = {
            idMatrizRiesgo: idMatrizRiesgo,
            usuarioModificacion: this.usuarioModificacion, //"USER",
            ipModificacion: this.dataIp //'127.0.0.1'
        };

        Swal.fire({
            title: '¿Está seguro de eliminar la Matriz riesgo de continuidad?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando la Matriz de Riesgo de Continuidad',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.matrizRiesgoService.eliminarMatrizRiesgo(matrizriesgoBodyEliminar).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idEmpresa !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.listarBandejaMatrizRiesgo();
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
