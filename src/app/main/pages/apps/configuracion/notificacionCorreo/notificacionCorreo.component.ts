import {Component, OnInit} from "@angular/core";
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {NotificacionCorreoService} from "./notificacionCorreo.service";
import {NotificacionCorreo} from "../../../../../shared/models/notificacionCorreo";
import { AuthLoginService } from "../../../authentication/auth-login/auth-login.service";


@Component({
    selector : 'app-conf-notificacionCorreo',
    templateUrl : './notificacionCorreo.component.html',
    styleUrls: ['./notificacionCorreo.component.scss']
})
export class NotificacionCorreoComponent implements OnInit{

    formularioNotificacionCorreo: FormGroup;
    dataIp: string = "";

    constructor(private notificacionCorreoService: NotificacionCorreoService, private formBuilder: FormBuilder,private router: Router,
        private authLoginService: AuthLoginService) {
        this.crearFormulario();
        this.obtenermetodoIP();
    }
    ngOnInit(): void {
        this.cargarConfiguracion();
    }

    private crearFormulario():void {
        this.formularioNotificacionCorreo = this.formBuilder.group({
            nuDiasAntes: ['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.max(30)]],
            nuDiasDespues: ['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.max(30)]]
        });
    }

    public cargarConfiguracion(){

        Swal.fire({
            title: 'Espere por favor',
            html: 'Cargando configuración',
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();
        this.notificacionCorreoService.obtenerConfiguracionPlanAccion().subscribe(
            resp => {
                if (resp.codigo==1){
                    if (Swal.isLoading()) {
                        Swal.close();
                        this.formularioNotificacionCorreo.get('nuDiasAntes').setValue(resp.configuracionPlanAccion.nuDiasAntes);
                        this.formularioNotificacionCorreo.get('nuDiasDespues').setValue(resp.configuracionPlanAccion.nuDiasDespues);
                    }
                }else{
                    if (Swal.isLoading()) {
                        Swal.close();
                        Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                    }
                }
            }
        );

    }

    actualizarNotificacion(): void{

        if (this.formularioNotificacionCorreo.invalid) {
            return Object.values(this.formularioNotificacionCorreo.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        Swal.fire({
            title: '¿Está seguro de actualizar la configuración de correo?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Actualizando configuración',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();

                const nuDiasAntes = this.formularioNotificacionCorreo.get("nuDiasAntes").value;
                const nuDiasDespues = this.formularioNotificacionCorreo.get("nuDiasDespues").value;
                const ipModificacion = this.dataIp;

                const NotificacionCorreoBodyActualizar: NotificacionCorreo = {
                    idConfigCorreo: 1,
                    nuDiasAntes: nuDiasAntes,
                    nuDiasDespues: nuDiasDespues,
                    usuarioModificacion: 'AUDITOR',
                    ipModificacion: ipModificacion //'127.0.0.1'
                };

                this.notificacionCorreoService.actualizarConfiguracionPlanAccion(NotificacionCorreoBodyActualizar).subscribe(
                    resp => {
                        if (resp.codigo==1){
                            Swal.fire({
                                title: "¡Se grabo con exito!",
                                icon:"success",
                                text: resp.mensaje
                            }).then(okay => {
                                if (okay) {
                                    //this.router.navigate(['pages', 'main', 'menu']);
                                    //console.log("mandar al main")
                                }
                            });
                        }else{
                            Swal.fire({
                                title: "Ocurrió un error",
                                icon:"error",
                                text: resp.mensaje
                            }).then(okay => {
                                if (okay) {
                                    this.router.navigate(['pages', 'main', 'menu']);
                                    console.log("mandar al main")
                                }
                            });
                        }
                    }
                );
            }
        });


    }

    get nuDiasAntesNoValido(): boolean {
        return this.formularioNotificacionCorreo.get('nuDiasAntes').invalid && this.formularioNotificacionCorreo.get('nuDiasAntes').touched;
    }

    get nuDiasDespuesNoValido(): boolean {
        return this.formularioNotificacionCorreo.get('nuDiasDespues').invalid && this.formularioNotificacionCorreo.get('nuDiasDespues').touched;
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
