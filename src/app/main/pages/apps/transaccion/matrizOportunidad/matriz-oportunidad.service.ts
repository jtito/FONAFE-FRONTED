import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { CODIGO_PARAMETRO_MATRIZ, CODIGO_PARAMETRO_TIPO_MATRIZ, CODIGO_PARAMETRO_CARTERA, CODIGO_PARAMETRO_ORIGEN_RIESGO, CODIGO_PARAMETRO_FRECUENCIA_RIESGO, CODIGO_PARAMETRO_TIPO_RIESGO, CODIGO_PARAMETRO_AREA_RESPONSABLE, CODIGO_PARAMETRO_FRECUENCIA_CONTROL, CODIGO_PARAMETRO_OPORTUNIDAD_CONTROL, CODIGO_PARAMETRO_AUTOMATIZACION_CONTROL, CODIGO_PARAMETRO_RESPONSABLE_CONTROL, CODIGO_PARAMETRO_ESTADO, CODIGO_PARAMETRO_EFICAZ_PLAN_ACCION, CODIGO_PARAMETRO_INDICADOR_SELECCION_SINO, CODIGO_PARAMETRO_ESTRATEGIA_RESPUESTA, CODIGO_PARAMETRO_ESTADO_PLAN_ACCION, CODIGO_PARAMETRO_TIPO_BENEFICIO, CODIGO_PARAMETRO_ESTRATEGIA_OPOR } from "../../../../../shared/Constantes";
import { MatrizRiesgo } from "../../../../../shared/models/matrizRiesgo";
import { MatrizOportunidadDetalle } from 'src/app/shared/models/matrizOportunidadDetalle';
import { MatrizOportunidad } from 'src/app/shared/models/matrizOportunidad';

@Injectable({
    providedIn: 'root'
})

export class MatrizOportunidadService {

    urlEndpointMatriz = `${environment.apiUrl}/gestionriesgo/nivelmatriz`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointMatrizRiesgo = `${environment.apiUrl}/gestionriesgo/matrizRiesgo`;
    urlEndpointMatrizContinuidad = `${environment.apiUrl}/gestionriesgo/matrizContinuidad`;
    urlEndpointPeriodo = `${environment.apiUrl}/gestionriesgo/periodo`;
    urlEndpointSede = `${environment.apiUrl}/gestionriesgo/sede`;
    urlEndpointGerencia = `${environment.apiUrl}/gestionriesgo/gerencia`;
    urlEndpointProceso = `${environment.apiUrl}/gestionriesgo/proceso`;
    urlEndpointSubProceso = `${environment.apiUrl}/gestionriesgo/subProceso`;
    urlEndpointOportunidad = `${environment.apiUrl}/gestionriesgo/matrizOportunidad`;
    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
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

    obtenerListaSedes(idEmpresa): Observable<any> {
        return this.httpClient.get(this.urlEndpointSede + '/listarSedes/' + idEmpresa, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de sedes. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaCarteras(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_CARTERA, {}).pipe(
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

    obtenerListaMatriz(idEmpresa: number, idSede, idTipoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointMatriz + '/listarMatriz/' + idEmpresa + '/' + idSede + '/' + idTipoMatriz, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar Matrices. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }



    obtenerProcesos(idEmpresa, idSede, idMatrizNivel): Observable<any> {
        return this.httpClient.get(this.urlEndpointProceso + '/listarProceso/' + idEmpresa + '/' + idSede + '/' + idMatrizNivel, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los Procesos. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerSubProcesos(idProceso): Observable<any> {
        return this.httpClient.get(this.urlEndpointSubProceso + '/listarSubProceso/' + idProceso, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los Procesos. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    obtenerProcesosMatriz(idEmpresa, idTipoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointProceso + '/listarProceso/' + idEmpresa + '/' + idTipoMatriz, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los Procesos. Msg: ' + e.error);
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

    obtenerListaMatrizNivel(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_MATRIZ, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar la matriz nivel. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
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

    obtenerListaEstados(): Observable<any> {
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


    obtenerListaOrigenRiesgo(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ORIGEN_RIESGO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los origenes de riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaFrecuenciaRiesgo(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_FRECUENCIA_RIESGO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las frecuencias de riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaTiposRiesgo(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_TIPO_RIESGO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los tipos de riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaAreaResponsable(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_AREA_RESPONSABLE, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaFrecuenciaControl(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_FRECUENCIA_CONTROL, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaOportunidadControl(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_OPORTUNIDAD_CONTROL, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaAutomatizacionControl(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_AUTOMATIZACION_CONTROL, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaGerencia(idEmpresa: number, idSede: number) {
        return this.httpClient.get(this.urlEndpointGerencia + '/listarGerencias/' + idEmpresa + '/' + idSede, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las gerencias. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerMatrizOportunidad(idMatrizRiesgo: number, idUsuario: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointOportunidad + '/obtenerMatrizOportunidad/' + idMatrizRiesgo +"/"+ idUsuario, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las Matries de Riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaAreaResponsableRol(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_AREA_RESPONSABLE, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar Area Responsable. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaResponsableControl(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_RESPONSABLE_CONTROL, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar Responsable de Control. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }




    registrarMatrizOportunidad(matrizOportunidad: MatrizOportunidad): Observable<any> {
        return this.httpClient.post(this.urlEndpointOportunidad + "/registrarMatrizOportunidad", matrizOportunidad).pipe(

            catchError(
                e => {
                    console.error('Error al intentar editar la matriz de riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                })
        );
    }


    actualizarMatrizOportunidad(matrizOportunidad: MatrizOportunidad): Observable<any> {
        return this.httpClient.put(this.urlEndpointOportunidad + "/UpdateMatrizOportunidad", matrizOportunidad).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la Cabecera de Riesgo. Msg: ' + e.error);
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

    eliminarMatrizRiesgo(matrizriesgoBodyEliminar: MatrizOportunidad): Observable<any> {
        return this.httpClient.post(this.urlEndpointOportunidad + '/anularMatrizOportunidad', matrizriesgoBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar la Matriz Oportunidad. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    listarBandejaMatrizOportunidad(idEmpresa: number, idPeriodo: number, idMatrizNivel: number): Observable<any> {
        const url = this.urlEndpointOportunidad + "/listarBandejaMatrizOportunidad/" + idEmpresa + "/" + idPeriodo + "/" + idMatrizNivel;
        return this.httpClient.get(url).pipe(
            map((response: any) => {
                if (response) {
                    console.log(response);
                    return response;
                } else {
                    throw new Error(response.status.error.messages[0]).message;
                }
            })
        );
    }


    obtenerEstrategiaPlanAccion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTRATEGIA_OPOR, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        ); 0
    }
    obtenerIndicadorSeleccionSINO(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_INDICADOR_SELECCION_SINO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }
    obtenerEstadoPlanAccion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTADO_PLAN_ACCION, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerPlanAccionEficaz(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_EFICAZ_PLAN_ACCION, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerTipoBeneficio(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_TIPO_BENEFICIO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las areas responsables. Msg: ' + e.error);
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
