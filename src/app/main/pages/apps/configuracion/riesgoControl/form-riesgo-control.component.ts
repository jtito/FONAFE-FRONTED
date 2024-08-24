import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Riesgo} from "../../../../../shared/models/riesgo";
import {Control} from "../../../../../shared/models/control";

@Component({
    selector: 'app-conf-riesgo-contro-form',
    templateUrl: 'form-riesgo-control.component.html'
})

export class FormRiesgoControlComponent implements OnInit {

    formularioRiesgoControl: FormGroup;
    riesgoPorControl: Riesgo;
    cols: any[];
    listaControles: Control[];
    listaVacia: Control[];
    loading: boolean;
    editar: boolean;

    /* Modal agregar control */
    popUpVisible: boolean;
    formularioControl: FormGroup;
    control: Control;

    /* Modal agregar control */

    constructor(private formBuilder: FormBuilder) {
        this.crearFormulario();
        this.crearFormularioControl();

    }

    ngOnInit(): void {
        this.editar = false;
        this.cols = [
            {
                field: 'idControl',
                header: 'ID Control',
                class: 'text-center',
                ordenadmiento: 'idControl',
                headerClass: 'text-center w-25'
            },
            {
                field: 'descripcionControl',
                header: 'Control',
                class: 'text-center',
                ordenadmiento: 'descripcionControl',
                headerClass: 'text-center w-50'
            },
            {
                field: 'indicadorBaja',
                header: 'Estado',
                class: 'text-center',
                ordenadmiento: 'indicadorBaja',
                headerClass: 'text-center'
            },
        ];

        this.listaVacia = [
            {texto1: '', text2: ''},
            {texto1: '', text2: ''},
            {texto1: '', text2: ''},
        ]
    }

    private crearFormulario(): void {
        this.formularioRiesgoControl = this.formBuilder.group({
            codigoRiesgo: ['', Validators.required],
            descripcionRiesgo: ['', Validators.required],
            descripcionControl: ['', Validators.required],
        });
    }

    agregarNuevoControl(): void {

    }

    registrarRiesgoPorControl(): void {

    }

    actualizarRiesgoPorControl(): void {

    }

    /* Modal agregar Control */
    mostrarPopUpAgregarControl(): void {
        this.formularioControl.reset();
        this.popUpVisible = true;
    }

    crearFormularioControl(): void {
        this.formularioControl = this.formBuilder.group({
            idCodigoControl: ['', Validators.required],
            descripcionControl: ['', Validators.required]
        });
    }

    cerrarPopUp(): void {
        this.popUpVisible = false;
    }

    registrarDatosControl(): void {

    }

    actualizarDatosControl(): void {

    }
    get codigoControlNoValido(): boolean {
        return this.formularioControl.get('idCodigoControl').invalid && this.formularioControl.get('idCodigoControl').touched;
    }

    get descripcionControlNoValido(): boolean {
        return this.formularioControl.get('descripcionControl').invalid && this.formularioControl.get('descripcionControl').touched;
    }

    /* Modal agregar Control */
}
