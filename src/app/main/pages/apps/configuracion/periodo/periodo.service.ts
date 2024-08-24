import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Periodo} from '../../../../../shared/models/periodo';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {
    CODIGO_PARAMETRO_PERIODO,
    CODIGO_PARAMETRO_ESTADO,
    CODIGO_PARAMETRO_OPERADORES,
    CODIGO_PARAMETRO_ANIO,
    CODIGO_PARAMETRO_FREC
} from '../../../../../shared/Constantes';

@Injectable({
    providedIn: 'root'
})

export class PeriodoService {

    urlEndpointPeriodo = `${environment.apiUrl}/gestionriesgo/periodo`;
    urlEndpointPeriodoParametro = `${environment.apiUrl}/nivelmadurez/parametros`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    listaPeriodos: string;
    codigoTipoPeriodo = CODIGO_PARAMETRO_PERIODO;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    registrarNuevoPeriodo(periodoBody: Periodo): Observable<any> {
        return this.httpClient.post(this.urlEndpointPeriodo + '/registrarPeriodo', periodoBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar el nuevo periodo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaPeriodos(empresa: number, anio: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointPeriodo + '/listarPeriodos/' + empresa + '/' + anio, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar el periodo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerPeriodo(idPeriodo): Observable<any> {
        return this.httpClient.get(this.urlEndpointPeriodo + '/buscarPeriodo/' + idPeriodo, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos del periodo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarPeriodo(periodo: Periodo): Observable<any> {
        return this.httpClient.put(this.urlEndpointPeriodo + '/actualizarPeriodo', periodo, {}).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar el periodo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    guardarListaPeriodos(listaPeriodos: string): void {
        this.listaPeriodos = listaPeriodos;
        sessionStorage.setItem('listaPeriodos', this.listaPeriodos);
    }

    /* Se utilizará httpPost para enviar el cuerpo al delete */
    eliminarPeriodo(periodoBodyEliminar: Periodo): Observable<any> {
        return this.httpClient.post(this.urlEndpointPeriodo + '/anularPeriodo', periodoBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar el periodo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaEmpresas(): Observable<any> {
        return this.httpClient.get(this.urlEndpointEmpresa + '/listarEmpresas/', {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de la empresa. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
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

    obtenerListaAnios(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ANIO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los años. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaFrecuencias(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_FREC, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las frecuencias. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerDescripcionPeriodo(idEmpresa, anio, idFrecuencia): Observable<any> {
        return this.httpClient.get(this.urlEndpointPeriodo + '/generarDePeriodo/' + idEmpresa + '/' + anio + '/' + idFrecuencia, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar generar la descripción de periodo. Msg: ' + e.error);
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
