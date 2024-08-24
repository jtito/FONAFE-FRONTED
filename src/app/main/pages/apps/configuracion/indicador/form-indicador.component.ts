import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Indicador} from "../../../../../shared/models/indicador";
import {Empresa} from "../../../../../shared/models/empresa";
import {ParametroMatrizNivel} from "../../../../../shared/models/parametroMatrizNivel";
import {Sede} from "../../../../../shared/models/sede";
import {Gerencia} from "../../../../../shared/models/gerencia";

@Component({
    selector: 'app-conf-form-indicador',
    templateUrl: 'form-indicador.indicador.html',
    styleUrls: ['indicador.component.scss']
})

export class FormIndicadorComponent implements OnInit {

    formularioIndicador: FormGroup;
    loading: boolean;
    listaEmpresas: Empresa[];
    listaParametroMatrizNivel: ParametroMatrizNivel[];
    listaSedes: Sede[];
    listaGerenecias: Gerencia[];
    indicador: Indicador;
    listaDescripcionProceso: string[];
    editar: boolean;
    listaVacia: any[];
    cols: any[];

    constructor(private formBuilder: FormBuilder) {
        this.crearFormulario();
    }

    ngOnInit(): void {
        this.editar = false;
        this.cols = [
            {field: 'idProceso', header: 'ID Proceso', class: 'text-center', ordenadmiento: 'idProceso', headerClass: 'text-center w-25'},
            {field: 'descripcionProceso', header: 'Descripción Proceso', class: 'text-center', ordenadmiento: 'descripcionProceso', headerClass: 'text-center w-50'},
        ];

        this.listaVacia = [
            { texto1: '', text2: ''},
            { texto1: '', text2: ''},
            { texto1: '', text2: ''},
        ]
    }

    private crearFormulario(): void {
        console.log('Se construyo el form');
        this.formularioIndicador = this.formBuilder.group({
            empresa: ['', Validators.required],
            numeroIndicador: ['', Validators.required],
            descripcionIndicador: ['', Validators.required],
            frecuenciaIndicador: ['', Validators.required],
            metaIndicador: ['', Validators.required],
            indicadorActual: ['', Validators.required],
            idResponsable: ['', Validators.required],
        });
    }

    onChangeEmpresa(input) {

    }

    onChangeParamMatrizNivel(input) {

    }

    onChangeSede(input) {

    }

    onChangeGerencia(input) {

    }

    agregarDescripcionProceso(): void {

    }

    eliminarDescripcionProceso(idProceso) {

    }

    registrarMatrizNivel(): void {

    }

    actualizarMatrizNivel(): void {

    }

}
