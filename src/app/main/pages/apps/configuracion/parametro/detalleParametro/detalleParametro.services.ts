import {Injectable} from '@angular/core';
import {environment} from '../../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthLoginService } from 'src/app/main/pages/authentication/auth-login/auth-login.service';

import { DetalleParametro } from 'src/app/shared/models/detalleParametro';
import { CODIGO_PARAMETRO_ESTADO} from '../../../../../../shared/Constantes';

@Injectable({
    providedIn: 'root'
})

export class DetalleParametroService{
    urlEndpointDetalleParametro = `${environment.apiUrl}/gestionriesgo/detalleParametro`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    obtenerListaDetalleParametros(idParametro):Observable<any> {
        return this.httpClient.get(this.urlEndpointDetalleParametro + '/listarDetalleParametros/'+ idParametro, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de detalles de parametros. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerDetalleParametro(idDetaParametro): Observable<any> {
        return this.httpClient.get(this.urlEndpointDetalleParametro + '/obtenerDetalleParametro/' + idDetaParametro, {}).pipe(
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

    registrarNuevoDetalleParametro(detalleParametroBody: DetalleParametro): Observable<any> {
        console.log("registrando");
        console.log(detalleParametroBody);
        return this.httpClient.post(this.urlEndpointDetalleParametro + '/registrarDetalleParametro', detalleParametroBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar nuevo detalle parametro. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarDetalleParametro(detalleParametroBodyEliminar: DetalleParametro): Observable<any> {
        return this.httpClient.post(this.urlEndpointDetalleParametro + '/anularDetalleParametro', detalleParametroBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar el detalle parametro. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }
    
    actualizarDetalleParametro(detalleParametro: DetalleParametro): Observable<any> {
        return this.httpClient.put(this.urlEndpointDetalleParametro + '/actualizarDetalleParametro', detalleParametro, {
            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar el detalle parametro. Msg: ' + e.error);
                
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaEstadoDetalleParametros(): Observable<any> {
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
}