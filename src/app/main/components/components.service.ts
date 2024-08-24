import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Empresa } from 'src/app/shared/models/empresa';
import { SedeLista } from 'src/app/shared/models/sedeLista';
import { environment } from 'src/environments/environment.prod';
import { AuthLoginService } from '../pages/authentication/auth-login/auth-login.service';
import { CODIGO_PARAMETRO_COLOR_VELOCIMETRO } from 'src/app/shared/Constantes';

@Injectable({
    providedIn: 'root'
})

export class ComponentsService {

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

    obtenerGraphInhe(idEmpresa: number, idPeriodo: number, idMatrizNivel: number, idTipoMatriz: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointGraph + '/MatrizOperacionInhe/' + idEmpresa + '/' + idPeriodo+'/'+idMatrizNivel+'/'+idTipoMatriz, {}).pipe(
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

    obtenerGraphGer(idEmpresa: number, idPeriodo: number, idMatrizNivel: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointGraph + '/MatrizOperacionGer/' + idEmpresa + '/' + idPeriodo+'/'+idMatrizNivel, {}).pipe(
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

    obtenerGraphKri(idEmpresa: number, idPeriodo: number, idMatrizNivel: number,idTipoMatriz:number): Observable<any> {
        return this.httpClient.get(this.urlEndpointGraph + '/MatrizOperacionKri/' + idEmpresa + '/' + idPeriodo+'/'+idMatrizNivel+'/'+idTipoMatriz, {}).pipe(
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

    obtenerGraphEvento(idEmpresa: number, idPeriodo: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointGraph + '/matrizEvento/' + idEmpresa + '/' + idPeriodo+'/', {}).pipe(
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

    obtenerGraphColorVolicimetro(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_COLOR_VELOCIMETRO, {}).pipe(
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
}
