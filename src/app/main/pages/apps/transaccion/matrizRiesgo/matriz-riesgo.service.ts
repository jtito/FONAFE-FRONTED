import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {CODIGO_PARAMETRO_MATRIZ,CODIGO_PARAMETRO_TIPO_MATRIZ,CODIGO_PARAMETRO_CARTERA, CODIGO_PARAMETRO_ORIGEN_RIESGO, CODIGO_PARAMETRO_FRECUENCIA_RIESGO, CODIGO_PARAMETRO_TIPO_RIESGO, CODIGO_PARAMETRO_AREA_RESPONSABLE, CODIGO_PARAMETRO_FRECUENCIA_CONTROL, CODIGO_PARAMETRO_OPORTUNIDAD_CONTROL, CODIGO_PARAMETRO_AUTOMATIZACION_CONTROL, CODIGO_PARAMETRO_RESPONSABLE_CONTROL, CODIGO_PARAMETRO_ESTADO,CODIGO_PARAMETRO_EFICAZ_PLAN_ACCION,CODIGO_PARAMETRO_ESTADO_PLAN_ACCION,CODIGO_PARAMETRO_ESTRATEGIA_RESPUESTA, MATRIZ_OPERACIONAL, CODIGO_CANTIDAD_CONTROL} from "../../../../../shared/Constantes";
import {MatrizRiesgo} from "../../../../../shared/models/matrizRiesgo";

@Injectable({
    providedIn: 'root'
})

export class MatrizRiesgoService {

    urlEndpointMatriz = `${environment.apiUrl}/gestionriesgo/nivelmatriz`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointMatrizRiesgo = `${environment.apiUrl}/gestionriesgo/matrizRiesgo`;
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
        return this.httpClient.get(this.urlEndpointSubProceso + '/listarSubProceso/' +idProceso, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los Sub Procesos. Msg: ' + e.error);
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
        return this.httpClient.get(this.urlEndpointMatrizRiesgo + '/listarBandejaMatrizRiesgo/' + idEmpresa + '/' + idPeriodo + '/' + idMatrizNivel, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar la bandeja de matriz de riesgo. Msg: ' + e.error);
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

    obtenerListaCantidadControl(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_CANTIDAD_CONTROL, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las cantidades de control. Msg: ' + e.error);
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

    processFileMatrizRiesgo(ProcessFile){

        let headers = new HttpHeaders();
        headers.set('Accept', 'multipart/form-data');

        let params = {file:ProcessFile.get("file"),idEmpresa:ProcessFile.get("idEmpresa"),idSede:ProcessFile.get("idSede"),idTipo:ProcessFile.get("idTipo"),idPeriodo:ProcessFile.get("idPeriodo")};

        return this.httpClient.post(this.urlEndpointMatrizRiesgo + '/upload/file', ProcessFile).pipe(
            catchError(
                e => {
                    console.error('Error al Procesar el archivo, porfavor valide el formato empleado. Msg: ' + e.error);
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
        return this.httpClient.get(this.urlEndpointMatrizRiesgo + '/obtenerMatrizRiesgo/' + idMatrizRiesgo +"/"+ idUsuario, {}).pipe(
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

    obtenerMatrizPeriodo(idEmpresa: number,idTipoMatriz:number, matrizNivel:number):Observable<any>{
        return this.httpClient.get(this.urlEndpointMatrizRiesgo + '/obtenerMatrizPeriodo/' + idEmpresa+"/"+idTipoMatriz+"/"+matrizNivel, {}).pipe(
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
        return this.httpClient.get(this.urlEndpointMatrizRiesgo + '/obtenerDescripcion/' + codRiesgo, {}).pipe(
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
        return this.httpClient.post(this.urlEndpointMatrizRiesgo + '/editarRegistro', {matrizRiesgo}).pipe(
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

    registrarMatrizRiesgo(matrizRiesgo: MatrizRiesgo): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatrizRiesgo + '/registrarMatrizRiesgo', matrizRiesgo).pipe(
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

    actualizarMatrizRiesgo(matrizRiesgo: MatrizRiesgo): Observable<any> {
        return this.httpClient.put(this.urlEndpointMatrizRiesgo + '/actualizarMatrizRiesgo', matrizRiesgo).pipe(
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

    eliminarMatrizRiesgo(matrizriesgoBodyEliminar: MatrizRiesgo): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatrizRiesgo + '/anularMatrizRiesgo', matrizriesgoBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar la Matriz Riesgo. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerSeveridad(probabilidad: number,impacto:number):Observable<any>{
        return this.httpClient.get(this.urlEndpointMatrizRiesgo + '/obtenerSeveridad/' + probabilidad + "/" + impacto + "/" + MATRIZ_OPERACIONAL, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar obtener la severidad. Msg: ' + e.error);
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
