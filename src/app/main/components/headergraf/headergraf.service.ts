import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Empresa } from 'src/app/shared/models/empresa';
import { SedeLista } from 'src/app/shared/models/sedeLista';
import { environment } from 'src/environments/environment.prod';
import { AuthLoginService } from '../../pages/authentication/auth-login/auth-login.service';
import { CODIGO_PARAMETRO_MATRIZ, CODIGO_PARAMETRO_TIPO_MATRIZ } from 'src/app/shared/Constantes';

@Injectable({
    providedIn: 'root'
})

export class HeaderGrafService {

    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`; 
    urlEndpointPeriodo = `${environment.apiUrl}/gestionriesgo/periodo`; 
    urlEndpointGraph = `${environment.apiUrl}/gestionriesgo/detalleGrafico`;  
     
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    obtenerListaEmpresas(): Observable<any> {
        return this.httpClient.get(this.urlEndpointEmpresa + '/listarEmpresas', {}).pipe(
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
   
    obtenerEmpresa(idEmpresa): Observable<any> {
        return this.httpClient.get(this.urlEndpointEmpresa + '/obtenerEmpresa/' + idEmpresa, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de Empresa. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaPeriodo(idEmpresaPeriodo: number, anio: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointPeriodo + '/listarPeriodos/' + idEmpresaPeriodo + '/' + anio, {}).pipe(
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

    obtenerListaTipoMatriz(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_TIPO_MATRIZ, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los tipos de Matriz. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaEstadoParametros(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_MATRIZ, {}).pipe(
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