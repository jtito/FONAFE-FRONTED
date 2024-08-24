import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {CODIGO_PARAMETRO_CARTERA,CODIGO_PARAMETRO_RESPONSABILIDAD,CODIGO_PARAMETRO_CARGO,CODIGO_PARAMETRO_ESTADO} from '../../../../../shared/Constantes';
import { Responsable } from 'src/app/shared/models/responsable';

@Injectable({
    providedIn: 'root'
})

export class ResponsableService {
    urlEndpointResponsable = `${environment.apiUrl}/gestionriesgo/responsable`;
    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointSede = `${environment.apiUrl}/gestionriesgo/sede`;
    urlEndpointResponsableParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointProceso = `${environment.apiUrl}/gestionriesgo/proceso`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }


    obtenerListaResponsables(idEmpresa, idSede): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsable + '/listarResponsables/' + idEmpresa + '/' + idSede, {}).pipe(
            catchError(e => {
                console.error('Error al intentar listar los responsables. Msg: ' + e.error);
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

    obtenerListaSedes(idEmpresa): Observable<any> {
        return this.httpClient.get(this.urlEndpointSede + '/listarSedes/' + idEmpresa , {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de las sedes. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaCarteras(): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsableParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_CARTERA, {}).pipe(
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

    obtenerListaResponsabilidad(): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsableParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_RESPONSABILIDAD, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar las responsabilidades. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaCargos(): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsableParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_CARGO, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los cargos. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaProcesos(idEmpresa:number): Observable<any>{
        return this.httpClient.get(this.urlEndpointProceso + '/listarProceso/' + idEmpresa+'/'+0, {}).pipe(
            catchError(
                e => {
                    console.error('Error al intentar listar los procesos. Msg: ' + e.error);
                    if (Swal.isLoading()) {
                        Swal.close();
                    }
                    Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                    return throwError(e);
                }
            )
        );
    }

    obtenerListaPerfiles(): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsable + '/listarPerfiles/', {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los perfiles. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerListaEstadoParametros(): Observable<any> {
        return this.httpClient.get(this.urlEndpointResponsableParametro + '/listarParametrosxCodigo/' + CODIGO_PARAMETRO_ESTADO, {}).pipe(
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

    registrarNuevoResponsable(responsableBody: Responsable): Observable<any> {
        return this.httpClient.post(this.urlEndpointResponsable + '/registrarResponsable', responsableBody, {
            headers: this.agregarCabeceras()
        }).pipe(catchError(e => {
                console.error('Error al intentar registrar el nuevo responsable. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerResponsable(idUsuario): Observable<any> {

        return this.httpClient.get(this.urlEndpointResponsable + '/obtenerResponsable/' + idUsuario, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos del responsable. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarResponsable(responsable: Responsable): Observable<any> {
        return this.httpClient.put(this.urlEndpointResponsable + '/actualizarResponsable', responsable, {}).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar el responsable. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarResponsable(responsableBodyEliminar: Responsable): Observable<any> {
        return this.httpClient.post(this.urlEndpointResponsable + '/anularResponsable', responsableBodyEliminar, {
            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar anular el responsable. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

}
