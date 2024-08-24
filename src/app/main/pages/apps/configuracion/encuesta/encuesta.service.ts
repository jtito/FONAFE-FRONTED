import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Encuesta} from '../../../../../shared/models/encuesta';
import {
    CODIGO_PARAMETRO_TIPO_PREGUNTA,
    CODIGO_PARAMETRO_GRUPO_PREGUNTA,
    CODIGO_PARAMETRO_ESTADO
} from '../../../../../shared/Constantes';
import {PreguntaLista} from 'src/app/shared/models/preguntaLista';

@Injectable({
    providedIn: 'root'
})

export class EncuestaService {
    urlEndPointEncuesta = `${environment.apiUrl}/gestionriesgo/encuesta`;
    urlEndPointReporte = `${environment.apiUrl}/gestionriesgo/report`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointPeriodo = `${environment.apiUrl}/gestionriesgo/periodo`;
    urlEndpointPregunta = `${environment.apiUrl}/gestionriesgo/pregunta`;
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

    downloadLink(idSurvey: number) {
        return `${this.urlEndPointReporte}/download/xlsx/${idSurvey}`
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

    obtenerListaTipoPreguntas(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_TIPO_PREGUNTA, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los tipos de preguntas. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaGrupoPreguntas(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_GRUPO_PREGUNTA, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los grupos de preguntas. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaEncuestas(idEmpresa: number, idPeriodo: number): Observable<any> {
        return this.httpClient.get(this.urlEndPointEncuesta + '/listarEncuestas/' + idEmpresa + '/' + idPeriodo, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de la encuesta. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerEncuesta(idEncuesta: number): Observable<any> {
        return this.httpClient.get(this.urlEndPointEncuesta + '/obtenerEncuesta/' + idEncuesta, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de la encuesta. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarEncuesta(encuestaBodyEliminar: Encuesta): Observable<any> {
        return this.httpClient.post(this.urlEndPointEncuesta + '/anularEncuesta', encuestaBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar la encuesta. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    registrarPregunta(preguntaBody: PreguntaLista): Observable<any> {
        return this.httpClient.post(this.urlEndpointPregunta + '/registrarPreguntas', preguntaBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar la nueva pregunta. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarPregunta(preguntaBody: PreguntaLista): Observable<any> {
        return this.httpClient.put(this.urlEndpointPregunta + '/actualizarPreguntas', preguntaBody, {}).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar las preguntas. Msg: ' + e.error);

                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    registrarNuevaEncuesta(encuestaBody: Encuesta): Observable<any> {
        return this.httpClient.post(this.urlEndPointEncuesta + '/registrarEncuesta', encuestaBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar la nueva encuesta. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarEncuesta(encuestaBody: Encuesta): Observable<any> {
        return this.httpClient.put(this.urlEndPointEncuesta + '/actualizarEncuesta', encuestaBody, {}).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la encuesta. Msg: ' + e.error);
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
}
