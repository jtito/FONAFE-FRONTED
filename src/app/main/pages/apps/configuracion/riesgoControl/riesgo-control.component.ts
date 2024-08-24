import {Component, OnInit} from "@angular/core";
import {Riesgo} from "../../../../../shared/models/riesgo";
import {Empresa} from "../../../../../shared/models/empresa";

@Component({
    selector: 'app-conf-riesgo-control',
    templateUrl: 'riesgo-control.component.html'
})

export class RiesgoControlComponent implements OnInit {
    listaRiesgosPorControl: Riesgo[];
    listaVacia: Riesgo[];
    listaEmpresas: Empresa[];
    loading: boolean;
    cols: any[];

    ngOnInit(): void {
        this.cols = [
            {field: 'codigoRiesgo', header: 'Codigo Riesgo', class: 'text-center', ordenadmiento: 'codigoRiesgo', headerClass: 'text-center w-25'},
            {field: 'descripcionRiesgo', header: 'Riesgo', class: 'text-center', ordenadmiento: 'parametroMatrizNivel', headerClass: 'text-center w-50'},
            {field: 'cantidadControl', header: 'Cantidad Control', class: 'text-center', ordenadmiento: 'nombreSede', headerClass: 'text-center w-25'},
            {field: 'indicadorBaja', header: 'Estado', class: 'text-center', ordenadmiento: 'indicadorBaja', headerClass: 'text-center w-25'},
        ];

        this.listaVacia = [
            {nombreEmpresa: '', nombreGerencia: ''},
            {nombreEmpresa: '', nombreGerencia: ''},
            {nombreEmpresa: '', nombreGerencia: ''},
        ]
    }

    onChangeEmpresa(input) {

    }
}
