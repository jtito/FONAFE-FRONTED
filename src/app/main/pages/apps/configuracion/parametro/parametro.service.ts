import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import { Parametro } from 'src/app/shared/models/parametro';
import { CODIGO_PARAMETRO_ESTADO} from '../../../../../shared/Constantes';

@Injectable({
    providedIn: 'root'
})

export class ParametroService{
    
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    obtenerListaParametros():Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametros/', {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de parametros. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerParametro(idParametro): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/obtenerParametro/' + idParametro, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos del parametro. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    registrarNuevoParametro(parametroBody: Parametro): Observable<any> {
        console.log("registrandoNuevoParametro");
        console.log(parametroBody);
        return this.httpClient.post(this.urlEndpointParametro + '/registrarParametro', parametroBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar nuevo parametro. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarParametro(parametroBodyEliminar: Parametro): Observable<any> {
        return this.httpClient.post(this.urlEndpointParametro + '/anularParametro', parametroBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar el parametro. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }
    
    actualizarParametro(parametro: Parametro): Observable<any> {
        return this.httpClient.put(this.urlEndpointParametro + '/actualizarParametro', parametro, {
            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar el parametro. Msg: ' + e.error);
                
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaEstadoParametros(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTADO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los estados. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

}