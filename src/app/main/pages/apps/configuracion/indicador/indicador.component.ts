import {Component, OnInit} from "@angular/core";
import {Empresa} from "../../../../../shared/models/empresa";
import {Indicador} from "../../../../../shared/models/indicador";;

@Component({
    selector: 'app-conf-indicador',
    templateUrl: 'indicador.component.html',
    styleUrls: ['indicador.component.scss']
})
export class IndicadorComponent implements OnInit {

    listaEmpresas: Empresa[];
    listaIndicador: Indicador[];
    listaVacia: Indicador[];
    loading: boolean;
    cols: any[];

    constructor() {
        this.obtenerListaIndicador();
    }

    ngOnInit(): void {
        //this.loading = true;
        this.cols = [
            {field: 'numeroIndicador', header: 'Número KRI', class: 'text-center', ordenadmiento: 'numeroIndicador', headerClass: 'text-center'},
            {field: 'descripcionIndicador', header: 'Descripción KRI', class: 'text-center', ordenadmiento: 'descripcionIndicador', headerClass: 'text-center'},
            {field: 'frecuenciaIndicador', header: 'Frecuencia', class: 'text-center', ordenadmiento: 'frecuenciaIndicador', headerClass: 'text-center'},
            {field: 'metaIndicador', header: 'Meta del KRI', class: 'text-center', ordenadmiento: 'metaIndicador', headerClass: 'text-center'},
            {field: 'indicadorActual', header: 'KRI Actual', class: 'text-center', ordenadmiento: 'indicadorActual', headerClass: 'text-center'},
            {field: 'responsableIndicador', header: 'Responsable', class: 'text-center', ordenadmiento: 'responsableIndicador', headerClass: 'text-center'},
            {field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja', headerClass: 'text-center'},
        ];

        this.listaVacia = [
            {numeroIndicador: '', descripcionIndicador: ''},
            {numeroIndicador: '', descripcionIndicador: ''},
            {numeroIndicador: '', descripcionIndicador: ''},
        ]
    }

    onChangeEmpresa(input) {

    }

    onChangeMatrizNivel(input) {

    }

    obtenerListaIndicador(){
        this.loading = false;
        console.log('cerrar loading');
        this.listaIndicador = [];
    }
}
