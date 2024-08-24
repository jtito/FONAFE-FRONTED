import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { correos } from 'src/app/shared/models/correos'; 
import { Parametro } from '../../../../../shared/models/parametro';

@Component({
    selector:'app-conf-registrar-correos',
    templateUrl: 'form-correos.correos.html'
})

export class FormCorreosComponent implements OnInit{

    public correos: correos;
    public formularioCorreos: FormGroup;
    public loading: boolean;
    public editar: boolean;
    listaEstados: Parametro[];
    listaEtapa: Parametro[];
    idEtapa: string;

    constructor(private formBuilder: FormBuilder){
        this.crearFormularios();
    }

    ngOnInit(): void{
        this.loading = false;
        console.log(this.loading);
    }

    private crearFormularios(): void{
        console.log('Se construyo el form');
        this.formularioCorreos = this.formBuilder.group({

            idCorreo:['',Validators.required],
            asunto:['',Validators.required],
            destinatario:['',Validators.required],
            cuerpo:['',Validators.required],
            pie:['',Validators.required]

        });
    }
    
    public registrarCorreo(): void {

    }

    public actualizarCorreo(): void {

    }

    onChangeEtapa(deviceValue): void {
        // this.idEstado = deviceValue.target.value;
    }

    get idCorreoNoValido(): boolean {
        return this.formularioCorreos.get('idCorreo').invalid && this.formularioCorreos.get('idCorreo').touched;
    }

    get asuntoNoValido(): boolean {
        return this.formularioCorreos.get('asunto').invalid && this.formularioCorreos.get('asunto').touched;
    }

    get destinatarioNoValido(): boolean {
        return this.formularioCorreos.get('destinatario').invalid && this.formularioCorreos.get('destinatario').touched;
    }

    get cuerpoNoValido(): boolean {
        return this.formularioCorreos.get('cuerpo').invalid && this.formularioCorreos.get('cuerpo').touched;
    }

    get pieNoValido(): boolean {
        return this.formularioCorreos.get('pie').invalid && this.formularioCorreos.get('pie').touched;
    }

}