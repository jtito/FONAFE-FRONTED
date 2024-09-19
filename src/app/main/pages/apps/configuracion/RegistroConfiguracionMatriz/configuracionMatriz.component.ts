import {Component, OnInit} from '@angular/core';
import {ConfigMatrizService} from './configuracionMatriz.service';
import {ConfigMatriz} from '../../../../../shared/models/configMatriz';
import Swal from 'sweetalert2';
import FileSaver from 'file-saver';

import {Router} from '@angular/router';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';

@Component({
    selector: 'app-conf-matriz',
    templateUrl: 'configuracionMatriz.component.html',
    styleUrls: ['configuracionMatriz.component.scss']
})

export class ConfigMatrizComponent implements OnInit{

    listaConfigMatriz: ConfigMatriz[];
    listaVacia: ConfigMatriz[];
    listaNiveles: any[];
    ConfigMatrizSel:number=0;
    loading: boolean;
    cols: any[];

    constructor(private ConfigMatrizService: ConfigMatrizService, private router: Router, private authLoginService: AuthLoginService){
        this.listaConfigMatriz = [];
        this.listaNiveles = [];
    }

    ngOnInit(): void {
        this.loading = true;
        this.cols = [
            {field: 'idConfigMatriz', header: 'Configuración', class: 'text-center', ordenadmiento: 'idConfigMatriz', headerClass: 'text-center'},
            {field: 'nivel', header: 'Cantidad de Niveles', class: 'text-center', ordenadmiento: 'nivel', headerClass: 'text-center'},
        ];
        this.listaVacia = [
            {idConfigMatriz: ''},
            {idConfigMatriz: ''},
            {idConfigMatriz: ''},
        ]
    }

    onChange(deviceValue){
        this.fetchListaConfigMatriz();
    }


    onChangeConfigMatriz(input) {

        this.ConfigMatrizSel = input.target.value;
        this.fetchListaConfigMatriz();

    }

    exportExcel(): void {
        import('xlsx').then(xlsx => {

            var lista = [];
           
            for(var j=0;j<this.listaConfigMatriz.length;j++){
    
                var obj = new Object();
                obj['idConfigMatriz'] =this.listaConfigMatriz[j]['idConfigMatriz'];
                obj['niveles'] =this.listaConfigMatriz[j]['niveles'];
                lista.push(obj);
            }
    
            const worksheet = xlsx.utils.json_to_sheet(lista);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, 'Configuracion por matriz');
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

    fetchListaConfigMatriz(): void{
        this.ConfigMatrizService.obtenerListaConfigMatriz(this.ConfigMatrizSel).subscribe(
            resp => {
                if(resp.listaConfigMatriz.length > 0){
                    this.listaNiveles = [];
                   for(let i = 0; i < resp.listaConfigMatriz.length; i++){
                       this.listaNiveles.push(resp.listaConfigMatriz[i]);
                       this.listaConfigMatriz = resp.listaConfigMatriz;
                    }
                    this.loading = false;
                } else{
                    this.loading = false;
                    this.listaNiveles = [];
                }
                
            }
        )
    }
}