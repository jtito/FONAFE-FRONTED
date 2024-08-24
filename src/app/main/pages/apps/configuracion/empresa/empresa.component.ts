import {Component, OnInit} from '@angular/core';
import FileSaver from 'file-saver';
import {EmpresaService} from './empresa.service';
import {Empresa} from '../../../../../shared/models/empresa';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {DataLogin} from 'src/app/shared/models/data';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {TipoPerfil} from 'src/app/shared/models/tipoPerfil';

@Component({
    selector: 'app-conf-empresa',
    templateUrl: 'empresa.component.html',
    styleUrls: ['empresa.component.scss']
})

export class EmpresaComponent implements OnInit {

    listaVacia: Empresa[];
    cols: any[];
    loading: boolean;
    listaEmpresas: Empresa[];
    listaIndicadoresBaja: any[];
    listaIndicadoresSede: any[];
    estado: string;
    idPerfil:number;
    payload: DataLogin;
    dataIp: string = "";
    tipoPerfilAdminEmpresa: TipoPerfil = TipoPerfil.admin_empresa;

    constructor(private authLoginService: AuthLoginService,private empresaService: EmpresaService, private router: Router) {
        this.solvePermissions();
        this.listaEmpresas=[]
        this.listaIndicadoresBaja = [];
        this.listaIndicadoresSede = [];

    }

    ngOnInit(): void {
        this.loading = true;
        this.estado = 'Activo';
        this.cols = [
            {field: 'nombreCortoEmpresa', header: 'Empresa', class: 'text-center', ordenadmiento: 'nombreCortoEmpresa'},
            {field: 'ruc', header: 'RUC', class: 'text-center', ordenadmiento: 'ruc'},
            {field: 'razonSocial', header: 'Razón Social', class: 'text-center', ordenadmiento: 'razonSocial'},
            {field: 'descripcionCartera', header: 'Cartera', class: 'text-center', ordenadmiento: 'descripcionCartera'},
            // {field: 'direccion', header: 'Dirección', class: 'text-center', ordenadmiento: 'direccion'},
            // {field: 'indicadorSede', header: 'Sede', class: 'text-center', ordenadmiento: 'indicadorSede'},
            {field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja'}

        ];

        this.listaVacia = [
            {usuarioCreacion: '', razonSocial: ''},
            {usuarioCreacion: '', razonSocial: ''}
        ];

        //this.ipModificacion = this.authLoginService.obtenerIp();
    }

    solvePermissions(){
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if(this.idPerfil==TipoPerfil.admin){
            this.obtenerListaEmpresas()
        }
        else{
            let idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
            this.obtenerEmpresa(idEmpresa);
        }
    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];

            for(var j=0;j<this.listaEmpresas.length;j++){

                var obj = new Object();

                obj['Empresa'] =this.listaEmpresas[j]['nombreCortoEmpresa'];
                obj['RUC'] =this.listaEmpresas[j]['ruc'];
                obj['Razón Social'] =this.listaEmpresas[j]['razonSocial'];
                obj['Cartera'] =this.listaEmpresas[j]['descripcionCartera'];
                obj['Dirección'] =this.listaEmpresas[j]['direccion'];
                obj['Estado'] =this.listaEmpresas[j]['indicadorBaja'];
                lista.push(obj);
            }


            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Empresa');
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

    obtenerListaEmpresas(): void {
        this.empresaService.obtenerListaEmpresas().subscribe(
            resp => {
                if (resp.listaEmpresas.length > 0) {
                    this.listaIndicadoresBaja = [];
                    for (let i = 0; i < resp.listaEmpresas.length; i++) {
                        resp.listaEmpresas[i].indicadorBaja == '0' ? resp.listaEmpresas[i].indicadorBaja = 'Inactivo' : resp.listaEmpresas[i].indicadorBaja = 'Activo';
                        if (!this.listaIndicadoresBaja.includes(resp.listaEmpresas[i].indicadorBaja)) {
                            this.listaIndicadoresBaja.push(resp.listaEmpresas[i].indicadorBaja.toString());
                        }

                        resp.listaEmpresas[i].indicadorSede == '0' ? resp.listaEmpresas[i].indicadorSede = 'No' : resp.listaEmpresas[i].indicadorSede = 'Si';
                        if (!this.listaIndicadoresSede.includes(resp.listaEmpresas[i].indicadorSede)) {
                            this.listaIndicadoresSede.push(resp.listaEmpresas[i].indicadorSede.toString());
                        }

                        this.listaEmpresas = resp.listaEmpresas;

                        this.obtenerEmpresasEstado(this.estado);
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listaEmpresas = [];
                }

            }
        );
    }

    obtenerEmpresa(idEmpresa:number){

        this.empresaService.obtenerEmpresa(idEmpresa).subscribe(
            resp => {
                let empresa = resp.Empresa;

                empresa.indicadorBaja == '0' ? empresa.indicadorBaja = 'Inactivo' : empresa.indicadorBaja = 'Activo';
                if (!this.listaIndicadoresBaja.includes(empresa.indicadorBaja)) {
                    this.listaIndicadoresBaja.push(empresa.indicadorBaja.toString());
                }

                empresa.indicadorSede == '0' ? empresa.indicadorSede = 'No' : empresa.indicadorSede = 'Si';
                if (!this.listaIndicadoresSede.includes(empresa.indicadorSede)) {
                    this.listaIndicadoresSede.push(empresa.indicadorSede.toString());
                }
                this.listaEmpresas.push(empresa);
                this.obtenerEmpresasEstado(this.estado);
                this.loading = false;
            }
        );
    }

    onChange(deviceValue){
        this.estado = deviceValue;

        this.obtenerListaEmpresas();
    }

    obtenerEmpresasEstado(value): void {

        let listEmpresasEstado;

        listEmpresasEstado = this.listaEmpresas.filter(empresa =>
            empresa.indicadorBaja==this.estado
        );

        if (listEmpresasEstado.length == 0){
            listEmpresasEstado = this.listaEmpresas.filter(empresa =>
                empresa.indicadorBaja=='Inactivo'
            );
        }

        this.listaEmpresas = listEmpresasEstado;
    }

    eliminarEmpresa(idEmpresaEliminar: number): void {

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioModificacion = datosToken.data.username;
        const ipModificacion = this.dataIp;

        const EmpresaBodyEliminar: Empresa = {
            idEmpresa: idEmpresaEliminar,
            usuarioModificacion: usuarioModificacion, //"USER",
            ipModificacion: ipModificacion //'127.0.0.1'
        };

        Swal.fire({
            title: '¿Está seguro de eliminar la empresa?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos eliminando la empresa',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                this.empresaService.eliminarEmpresa(EmpresaBodyEliminar).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.idEmpresa !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            this.obtenerListaEmpresas();
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
