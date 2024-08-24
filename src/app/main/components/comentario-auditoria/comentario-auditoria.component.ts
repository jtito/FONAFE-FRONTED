import {Component,OnInit} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

import {TipoMatriz} from "../../../shared/models/tipoMatriz";
import {ComentarioService} from "../../../core/service/comentario.service";
import {ComentarioMatrizRiesgo} from "../../../shared/models/comentarioMatrizRiesgo";
import { AuthLoginService } from "../../pages/authentication/auth-login/auth-login.service";
import { TipoPerfil } from "src/app/shared/models/tipoPerfil";
import { DataLogin } from "src/app/shared/models/data";


@Component({
    selector: 'app-comentario-auditoria',
    templateUrl: './comentario-auditoria.component.html',
    styleUrls: ['./comentario-auditoria.component.css']
})

export class ComentarioAuditoriaComponent implements OnInit {

    idMatrizRiesgo = 0;
    idDetaMatrizRiesgo = 0;
    tipoMatrizGeneral :TipoMatriz;
    formularioComentarioAuditoria: FormGroup;
    dataIp: string = "";
    tipoPerfilAuditor: TipoPerfil = TipoPerfil.auditor;
    idPerfil: number;
    payload: DataLogin;

    constructor(private comentarioService: ComentarioService ,private formBuilder: FormBuilder,matrizRiesgo: DynamicDialogConfig, public ref: DynamicDialogRef,
        private authLoginService: AuthLoginService) {  /* , matrizRiesgo: MatrizRiesgo*/
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idMatrizRiesgo = matrizRiesgo.data.idMatrizRiesgo;
        this.idDetaMatrizRiesgo = matrizRiesgo.data.idDetaMatrizRiesgo;
        this.tipoMatrizGeneral = matrizRiesgo.data.tipoMatrizGeneral;
        this.idPerfil = this.payload.data.idPerfil;

        this.crearFormulario();
        this.obtenermetodoIP();
    }

    ngOnInit(): void {
        this.cargarComentario();
    }

    private crearFormulario():void {
        this.formularioComentarioAuditoria = this.formBuilder.group({
            coAuditoria: ['']
        });
    }

    public cargarComentario(): void {
        if (this.tipoMatrizGeneral==TipoMatriz.matrizRiesgoOperacional){
            this.cargarMatrizRiesgoOperacional();
        }
    }

    public cargarMatrizRiesgoOperacional(){
        const idMatrizRiesgo = this.idMatrizRiesgo;
        const idDetaMatrizRiesgo = this.idDetaMatrizRiesgo;

        if (this.idPerfil != this.tipoPerfilAuditor){
            this.formularioComentarioAuditoria.get('coAuditoria').disable();
        }

        // Swal.fire({
        //     title: 'Espere por favor',
        //     html: 'Cargando comentario',
        //     allowOutsideClick: () => !Swal.isLoading(),
        //     allowEscapeKey: () => !Swal.isLoading()
        // });
        // Swal.showLoading();

        this.comentarioService.obtenerComentarioMatrizRiesgo(idMatrizRiesgo,idDetaMatrizRiesgo).subscribe(
            resp => {
                if (resp.codigo==1){
                    // if (Swal.isLoading()) {
                    //     Swal.close();
                        this.formularioComentarioAuditoria.get('coAuditoria').setValue(resp.ComentarioMatrizRiesgo.comentarioAuditoria);
                    //}
                }else{
                    //if (Swal.isLoading()) {
                    //    Swal.close();
                     //   Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                    //}
                }
            }
        );
    }

    closeDialogC() {
        this.ref.close();
    }

    actualizarComentario(): void{
        const idMatrizRiesgo = this.idMatrizRiesgo;
        const idDetaMatrizRiesgo = this.idDetaMatrizRiesgo;
        const comentario = this.formularioComentarioAuditoria.get('coAuditoria').value;
        const ipModificacion = this.dataIp;

        const ComentarioBodyActualizar: ComentarioMatrizRiesgo={
            idMatrizRiesgo: idMatrizRiesgo,
            idDetaMatrizRiesgo: idDetaMatrizRiesgo,
            comentarioAuditoria: comentario,
            usuarioModificacion: 'AUDITOR',
            ipModificacion: ipModificacion //'127.0.0.1'
        };

        Swal.fire({
            title: 'Espere por favor',
            html: 'Estamos guardando el comentario de auditoria',
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();

        this.comentarioService.actualizarComentarioMatrizRiesgo(ComentarioBodyActualizar).subscribe(
            resp => {
                if (resp.codigo==1){
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire({
                        title: "¡Guardado exitoso!",
                        icon:"success",
                        text: "El comentario de auditoria se guardó con éxito"
                        }).then(okay => {
                        if (okay) {
                            this.ref.close();
                        }
                    });
                }else{
                    Swal.fire({
                        title: "Ocurrió un error",
                        icon:"error",
                        text: "El comentario de auditoria no se guardó"
                    }).then(okay => {
                        if (okay) {
                            this.ref.close();
                        }
                    });
                }
            }
        );
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
