import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";

import {environment} from "../../../environments/environment";
import {AuthLoginService} from "../../main/pages/authentication/auth-login/auth-login.service";
import {Parametro} from "../../shared/models/parametro";
import {ComentarioMatrizRiesgo} from "../../shared/models/comentarioMatrizRiesgo";

@Injectable({
    providedIn: 'root'
})
export class ComentarioService {
    urlEndpointMatrizRiesgo = `${environment.apiUrl}/gestionriesgo/matrizRiesgo`;
    alertService: any;
    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    obtenerComentarioMatrizRiesgo(idMatrizRiesgo,idDetaMatrizRiesgo): Observable<any> {
        return this.httpClient.get(this.urlEndpointMatrizRiesgo + '/obtenerComentarioMatrizRiesgo/' + idMatrizRiesgo + '/' + idDetaMatrizRiesgo, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos del comentario. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarComentarioMatrizRiesgo(comentarioBody: ComentarioMatrizRiesgo): Observable<any> {
        return this.httpClient.put(this.urlEndpointMatrizRiesgo + '/actualizarComentarioMatrizRiesgo', comentarioBody, {}).pipe(catchError(e => {
                console.error('Error al intentar grabar comentario. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }
}
