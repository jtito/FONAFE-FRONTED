import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {MatrizNivel} from '../../../../../shared/models/matrizNivel';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {CODIGO_PARAMETRO_MATRIZ,CODIGO_PARAMETRO_PERIODO,CODIGO_PARAMETRO_TIPO_MATRIZ, CODIGO_PARAMETRO_INDICADOR_SI_NO, CODIGO_PARAMETRO_ESTADO} from '../../../../../shared/Constantes';
import { Proceso } from 'src/app/shared/models/proceso';
import { Procesolst } from 'src/app/shared/models/procesolst';
import { ProcesoMatriz } from 'src/app/shared/models/procesoMatriz';

@Injectable({
    providedIn: 'root'
})

export class MatrizNivelService {


    urlEndpointMatriz = `${environment.apiUrl}/gestionriesgo/nivelmatriz`;
    urlEndpointParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointGerencia = `${environment.apiUrl}/gestionriesgo/gerencia`;
    urlEndpointProceso = `${environment.apiUrl}/gestionriesgo/proceso`;
    urlEndpointProcesoMatriz = `${environment.apiUrl}/gestionriesgo/procesoMatriz`;
    urlEndpointSede = `${environment.apiUrl}/gestionriesgo/sede`;
    urlEndpointPeriodoParametro = `${environment.apiUrl}/gestionriesgo/parametros`;
    listaMatriz: string;
    codigoTipoMatriz = CODIGO_PARAMETRO_MATRIZ;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }



    registrarNuevaMatriz(matrizBody: MatrizNivel): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatriz + '/registrarMatriz', matrizBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar el nueva cabecera de matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    registrarNuevoProcesoMatriz(procesoMatrizBody: ProcesoMatriz): Observable<any> {
        return this.httpClient.post(this.urlEndpointProcesoMatriz + '/registrarProcesoMatriz', procesoMatrizBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar el nuevo proceso matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    registrarProceso(procesoBody: Procesolst): Observable<any> {
        return this.httpClient.post(this.urlEndpointProceso + '/registrarProceso', procesoBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar el nuevo proceso. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaMatrizParametro(): Observable<any> {
        return this.httpClient.get(this.urlEndpointPeriodoParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_PERIODO, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar los tipos de periodos. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaEmpresa(): Observable<any> {
        return this.httpClient.get(this.urlEndpointEmpresa + '/listarEmpresas', {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar las Empresa. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaGerencia(idEmpresa,idSede): Observable<any> {
        return this.httpClient.get(this.urlEndpointGerencia + '/listarGerencias/'+idEmpresa+"/"+idSede, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar las Gerencias Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaParametro(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/', {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar las Empresa. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaSedes(idEmpresa:number): Observable<any> {
        return this.httpClient.get(this.urlEndpointSede + '/listarSedes/'+idEmpresa, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar las Sedes. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaProcesoMatriz(idEmpresa: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointProcesoMatriz + '/listarProcesoMatriz/' + idEmpresa, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar procesos matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    obtenerListaMatriz(idEmpresa: number,idSede, idTipoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointMatriz + '/listarMatriz/' + idEmpresa+'/'+idSede +'/'+idTipoMatriz, {}).pipe(
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



    obtenerMatriz(idMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointMatriz + '/obtenerMatriz/' + idMatriz, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de Matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerProcesoMatriz(idProcesoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointProcesoMatriz + '/obtenerProcesoMatriz/' + idProcesoMatriz, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de Proceso Matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    obtenerProcesos(idEmpresa): Observable<any> {
        return this.httpClient.get(this.urlEndpointProceso + '/listarProceso/' + idEmpresa+'/'+ 1, {}).pipe(
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

    obtenerProcesosMatriz(idProcesoMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointProceso + '/listaProcesoMatriz/' + idProcesoMatriz, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los procesos. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }


    actualizarMatriz(matriz: MatrizNivel): Observable<any> {
        return this.httpClient.put(this.urlEndpointMatriz + '/actualizarMatrizNivel', matriz, {

            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar Matriz Msg: ' + e.error);

                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarProcesoMatriz(procesoMatriz: ProcesoMatriz): Observable<any> {
        return this.httpClient.put(this.urlEndpointProcesoMatriz + '/actualizarProcesoMatriz', procesoMatriz, {

            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar Proceso Matriz Msg: ' + e.error);

                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarProcesos(procesos:Procesolst): Observable<any> {
        return this.httpClient.post(this.urlEndpointProceso + '/actualizarProcesos', procesos, {

            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar Proceso. Msg: ' + e.error);

                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaEstadoParametros(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_MATRIZ, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los tipos de matriz nivel. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaEstado(): Observable<any> {
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

    obtenerListaTipoMatriz(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_TIPO_MATRIZ, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los tipos de matriz. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }



    /* Se utilizará httpPost para enviar el cuerpo al delete */
    eliminarMatriz(matrizBodyEliminar: MatrizNivel): Observable<any> {
        return this.httpClient.post(this.urlEndpointMatriz + '/anularMatriz', matrizBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar la Matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarProcesoMatriz(procesoMatrizBody: ProcesoMatriz): Observable<any> {
        return this.httpClient.post(this.urlEndpointProcesoMatriz + '/anularProcesoMatriz', procesoMatrizBody, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar el proceso matriz. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaIndicador(): Observable<any> {
        return this.httpClient.get(this.urlEndpointParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_INDICADOR_SI_NO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar indicadores. Msg: ' + e.error);
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
