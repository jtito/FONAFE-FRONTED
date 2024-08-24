import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { DimensionMetodologia } from "src/app/shared/models/dimensionMetodologia";
import {CODIGO_PARAMETRO_NIVEL_RIESGOS,CODIGO_PARAMETRO_ESTADO} from '../../../../../shared/Constantes';

@Injectable({
    providedIn: 'root'
})
export class DimensionService{

    urlEndpointDimension = `${environment.apiUrl}/v1/controller`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointResponsableParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    obtenerListaDimension(empresa: number, tipoEvaluacion: number): Observable<any>{
        return this.httpClient.get(this.urlEndpointDimension+'/listarDimension/'+empresa+'/'+tipoEvaluacion,{}).pipe(
            catchError(e => {
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    };

    registrarNuevaDimension(dimensionMetodologia: DimensionMetodologia): Observable<any> {
        console.log(this.urlEndpointDimension + '/registrarDimension')
        return this.httpClient.post(this.urlEndpointDimension + '/registrarDimension', dimensionMetodologia, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar el nuevo periodo. Msg: ' + e.error);
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

    //obtenerTipoEvaluacion && 
    obtenerListaTipoEvaluacion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsableParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_NIVEL_RIESGOS, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las carteras. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerDimension(idDimRiesgo): Observable<any> {
        return this.httpClient.get(this.urlEndpointDimension + '/buscarDimension/' + idDimRiesgo, {}).pipe(
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
    
    actualizarDimension(dimension: DimensionMetodologia): Observable<any>{
        return this.httpClient.put(this.urlEndpointDimension + '/actualizarDimension', dimension, {}).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la dimension. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarDimension(dimension: DimensionMetodologia): Observable<any> {
        return this.httpClient.post(this.urlEndpointDimension + '/anularDimension', dimension, {}).pipe(
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
}