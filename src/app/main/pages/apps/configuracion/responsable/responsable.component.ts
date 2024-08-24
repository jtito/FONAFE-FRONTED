import {Component, OnInit} from '@angular/core';
import FileSaver from 'file-saver';
import {ResponsableService} from './responsable.service';
import {Responsable} from '../../../../../shared/models/responsable';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {PrimeNGConfig} from 'primeng/api';
import {TipoPerfil} from "../../../../../shared/models/tipoPerfil";
import { DataLogin } from 'src/app/shared/models/data';
import {AuthLoginService} from "../../../authentication/auth-login/auth-login.service";

@Component({
    selector: 'app-conf-responsable',
    templateUrl: 'responsable.component.html',
    styleUrls: ['responsable.component.scss']
})

export class ResponsableComponent implements OnInit {

    listaVacia: Responsable[];
    listaResponsables: Responsable[];
    cols: any[];
    loading: boolean;
    listaEmpresa: [];
    listaSede: [];
    listaIndicadoresBaja: any[];

    idEmpresa = 0;
    idSede = 0;
    estado: string;
    indicadorBaja: number = 1;
    idPerfil:number;
    payload: DataLogin;
    usuarioModificacion: string;
    dataIp: string = "";
    
    constructor(private authLoginService: AuthLoginService,private responsableService: ResponsableService, private router: Router, private config: PrimeNGConfig) {
        
        this.solvePermissions();
        this.obtenermetodoIP();
        this.listaIndicadoresBaja = [];
    }

    ngOnInit(): void {
        this.loading = true;
        this.estado = 'Activo';
        this.cols = [
            {field: 'descripcionCartera', header: 'Cartera', class: 'text-center', ordenadmiento: 'descripcionCartera'},
            {field: 'descripcionEmpresa', header: 'Empresa', class: 'text-center', ordenadmiento: 'descripcionEmpresa'},
            {field: 'descripcionSede', header: 'Sede', class: 'text-center', ordenadmiento: 'descripcionSede'},
            {field: 'responsable', header: 'Responsable', class: 'text-center', ordenadmiento: 'responsable'},
            {field: 'descripcionCargo', header: 'Cargo', class: 'text-center', ordenadmiento: 'descripcionCargo', width: '30% !important'},
            {field: 'dePerfil', header: 'Perfil', class: 'text-center', ordenadmiento: 'dePerfil'},
            // {field: 'dni', header: 'DNI', class: 'text-center', ordenadmiento: 'dni'},
            // {field: 'descripcionResponsabilidad', header: 'Tipo', class: 'text-center', ordenadmiento: 'descripcionResponsabilidad'},
            {field: 'correo', header: 'Correo', class: 'text-center', ordenadmiento: 'correo'},
            {field: 'numeroTelefono', header: 'Teléfono', class: 'text-center', ordenadmiento: 'numeroTelefono'},
            {field: 'anexo', header: 'Anexo', class: 'text-center', ordenadmiento: 'anexo'},
            {field: 'celular', header: 'Celular', class: 'text-center', ordenadmiento: 'celular'},
            {field: 'indResolucion', header: 'Resolución de designación', class: 'text-center', ordenadmiento: 'indResolucion'},
            {field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja'}
        ];

        
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.usuarioModificacion = datosToken.data.username;

        this.listaVacia = [
            {usuarioCreacion: '', nombre: ''},
            {usuarioCreacion: '', nombre: ''}
        ];
    }

    solvePermissions(){
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if(this.idPerfil==TipoPerfil.admin){
            this.obtenerListaEmpresas();
            this.obtenerListaResponsables();
            this.idEmpresa=0;
        }
        else{
            this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
            this.obtenerListaSedes();
            this.obtenerListaResponsables();
        }
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];
           
            for(var j=0;j<this.listaResponsables.length;j++){

                var obj = new Object();
                obj['Cartera'] =this.listaResponsables[j]['descripcionCartera'];
                obj['Empresa'] =this.listaResponsables[j]['descripcionEmpresa'];
                obj['Sede'] =this.listaResponsables[j]['descripcionSede'];
                obj['Nombres'] =this.listaResponsables[j]['nombre'];
                obj['Apellido Paterno'] =this.listaResponsables[j]['apellidoPaterno'];
                obj['Apellido Materno'] =this.listaResponsables[j]['apellidoMaterno'];
                obj['Cargo'] =this.listaResponsables[j]['descripcionCargo'];
                obj['Perfil'] =this.listaResponsables[j]['dePerfil'];
                // obj['DNI'] =this.listaResponsables[j]['dni'];
                // obj['Tipo'] =this.listaResponsables[j]['descripcionResponsabilidad'];
                obj['Correo'] =this.listaResponsables[j]['correo'];
                obj['Teléfono'] =this.listaResponsables[j]['numeroTelefono'];
                obj['Anexo'] =this.listaResponsables[j]['anexo'];
                obj['Celular'] =this.listaResponsables[j]['celular'];
                obj['Resolución de designación'] =this.listaResponsables[j]['indResolucion'];
                obj['Estado'] =this.listaResponsables[j]['indicadorBaja'];
                lista.push(obj);
            }

            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Responsable');
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

    obtenerListaResponsables(): void {
        this.responsableService.obtenerListaResponsables(this.idEmpresa, this.idSede).subscribe(
            resp => {
                if (resp.listaResponsables.length > 0) {
                    this.listaIndicadoresBaja = [];
                    for (let i = 0; i < resp.listaResponsables.length; i++) {
                        resp.listaResponsables[i].indicadorBaja == '0' ? resp.listaResponsables[i].indicadorBaja = 'Inactivo' : resp.listaResponsables[i].indicadorBaja = 'Activo';
                        if (!this.listaIndicadoresBaja.includes(resp.listaResponsables[i].indicadorBaja)) {
                            this.listaIndicadoresBaja.push(resp.listaResponsables[i].indicadorBaja.toString());
                        }
                        this.listaResponsables = resp.listaResponsables;

                        this.obtenerResponsablesEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaResponsables = [];
                }

            }
        );
    }

    onChange(deviceValue){
        this.estado = deviceValue;

        this.obtenerListaResponsables();
    }

    obtenerResponsablesEstado(value): void {

        let listResponsablesEstado;
        
        listResponsablesEstado = this.listaResponsables.filter(responsable =>
            responsable.indicadorBaja==this.estado
        );

        if (listResponsablesEstado.length == 0){
            listResponsablesEstado = this.listaResponsables.filter(empresa =>
                empresa.indicadorBaja=='Inactivo'
            );
        }

        this.listaResponsables = listResponsablesEstado;
    }

    obtenerListaEmpresas(): void {
        this.responsableService.obtenerListaEmpresas().subscribe(
            resp => {
                this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
                    empresa.indicadorBaja == this.indicadorBaja    
                );
                // console.log('lista de empresas : ' + JSON.stringify(resp.listaEmpresas));
            }
        );
    }

    obtenerListaSedes(): void {
        this.responsableService.obtenerListaSedes(this.idEmpresa).subscribe(
            resp => {
                this.listaSede = resp.listaSedes.filter(sede => 
                    sede.indicadorBaja == this.indicadorBaja
                );
            }
        );
    }

    onChangeEmpresa(deviceValue): void {
        console.log(deviceValue.target.value);
        this.idEmpresa = deviceValue.target.value;
        this.obtenerListaSedes();
        this.obtenerListaResponsables();
    }

    onChangeSede(deviceValue): void {
        console.log('Sede ()' + deviceValue.target.value);
        this.idSede = deviceValue.target.value;
        this.obtenerListaResponsables();
    }

    eliminarResponsable(idResponsableEliminar: number): void {

        const responsableBodyEliminar: Responsable = {
            idUsuario: idResponsableEliminar,
            indicadorBaja: '0',
            usuarioModificacion: this.usuarioModificacion, //'USER1',
            ipModificacion: this.dataIp
        };

        //console.log(responsableBodyEliminar);

        Swal.fire({
            title: '¿Está seguro de eliminar el usuario?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando el usuario',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.responsableService.eliminarResponsable(responsableBodyEliminar).subscribe(
                    resp => {
                        //console.log(resp);
                        if (resp.idResponsable !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaResponsables();
                            Swal.fire('¡Eliminación exitosa!', resp.mensaje, 'success');
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

    obtenermetodoIP (){

        this.authLoginService.obtenerIp().subscribe(
            resp => {
                this.dataIp = resp.ip;
            }
        );
    }


}
