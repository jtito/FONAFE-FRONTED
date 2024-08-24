import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {CODIGO_PARAMETRO_MATRIZ_FRAUDE,CODIGO_PARAMETRO_MATRIZ,CODIGO_PARAMETRO_TIPO_MATRIZ,CODIGO_PARAMETRO_CARTERA, CODIGO_PARAMETRO_ORIGEN_RIESGO, CODIGO_PARAMETRO_FRECUENCIA_RIESGO, CODIGO_PARAMETRO_TIPO_RIESGO, CODIGO_PARAMETRO_AREA_RESPONSABLE, CODIGO_PARAMETRO_FRECUENCIA_CONTROL, CODIGO_PARAMETRO_OPORTUNIDAD_CONTROL, CODIGO_PARAMETRO_AUTOMATIZACION_CONTROL, CODIGO_PARAMETRO_RESPONSABLE_CONTROL, CODIGO_PARAMETRO_ESTADO,CODIGO_PARAMETRO_EFICAZ_PLAN_ACCION,CODIGO_PARAMETRO_ESTADO_PLAN_ACCION,CODIGO_PARAMETRO_ESTRATEGIA_RESPUESTA, CODIGO_PARAMETRO_ESTADO_EVENTO, CODIGO_PARAMETRO_CUENTA_PLAN_ACCION} from "../../../../../shared/Constantes";
import {MatrizRiesgo} from "../../../../../shared/models/matrizRiesgo";
import { MatrizEvento } from 'src/app/shared/models/matrizEvento';

@Injectable({
    providedIn: 'root'
})

export class MatrizEventoService {

    urlEndpointMatriz = `${environment.apiUrl}/gestionriesgo/nivelmatriz`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointMatrizEvento = `${environment.apiUrl}/gestionriesgo/matrizEvento`;
    urlEndpointPeriodo = `${environment.apiUrl}/gestionriesgo/periodo`;
    urlEndpointSede = `${environment.apiUrl}/gestionriesgo/sede`;
    urlEndpointGerencia = `${environment.apiUrl}/gestionriesgo/gerencia`;
    urlEndpointProceso = `${environment.apiUrl}/gestionriesgo/proceso`;
    urlEndpointSubProceso = `${environment.apiUrl}/gestionriesgo/subProceso`;

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
        return this.httpClient.get(this.urlEndpointSede + '/listarSedes/' + idEmpresa , {}).pipe(
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

    obtenerListaMatriz(idEmpresa: number,idSede,idTipoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointMatriz + '/listarMatriz/' + idEmpresa+'/'+idSede+'/'+idTipoMatriz , {}).pipe(
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



    obtenerProcesos(idEmpresa,idSede,idMatrizNivel): Observable<any> {
        return this.httpClient.get(this.urlEndpointProceso + '/listarProceso/' + idEmpresa+'/'+idSede+'/'+idMatrizNivel, {}).pipe(
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


    obtenerProcesosMatriz(idEmpresa,idTipoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointProceso + '/listarProceso/' + idEmpresa+'/'+idTipoMatriz, {}).pipe(
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

    listarBandejaMatrizRiesgo(idEmpresa: number, idPeriodo: number, idMatrizNivel: number): Observable<any>{
        return this.httpClient.get(this.urlEndpointMatrizEvento + '/listarBandejaMatrizEvento/' + idEmpresa + '/' + idPeriodo + '/' + idMatrizNivel, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar la bandeja de matriz de Evento. Msg: ' + e.error);
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

    obtenerEstadoPlanAccion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTADO_PLAN_ACCION, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar Estado Plan Accion. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerEficazPlanAccion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_EFICAZ_PLAN_ACCION, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar Eficacia Plan Accion. Msg: ' + e.error);
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

    obtenerListaGerencia(idEmpresa: number, idSede: number){
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

    obtenerMatrizRiesgo(idMatrizRiesgo: number, idUsuario: number):Observable<any>{
        return this.httpClient.get(this.urlEndpointMatrizEvento + '/obtenerMatrizEvento/' + idMatrizRiesgo +"/"+ idUsuario, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las Matries de Evento. Msg: ' + e.error);
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

    obtenerListaEstrategiaRespuesta(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTRATEGIA_RESPUESTA, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las estrategias. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
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

    obtenerDescripcion(codRiesgo): Observable<any> {
        return this.httpClient.get(this.urlEndpointMatrizEvento + '/obtenerDescripcion/' + codRiesgo, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener la descripcion. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    registrarEdicionRegistroMatrizRiesgo(matrizRiesgo: MatrizRiesgo): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatrizEvento + '/editarRegistro', {matrizRiesgo}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar editar la matriz de riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    registrarMatrizRiesgo(matrizRiesgo: MatrizEvento): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatrizEvento + '/registrarMatrizEvento', matrizRiesgo).pipe(
            catchError(
                e => {
                    console.error('Error al intentar registrar la matriz de riesgo. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    actualizarMatrizRiesgo(matrizEvento: MatrizEvento): Observable<any> {
        return this.httpClient.put(this.urlEndpointMatrizEvento + '/actualizarMatrizEvento', matrizEvento).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la matriz de Riesgo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarMatrizRiesgo(matrizriesgoBodyEliminar: MatrizEvento): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatrizEvento + '/anularMatrizEvento', matrizriesgoBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar la Matriz Evento. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    obtenerListaEstadoEvento(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTADO_EVENTO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los Estado de Eventos. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaCuentaPlanAccion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_CUENTA_PLAN_ACCION, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar Cuenta Plan Accion. Msg: ' + e.error);
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
