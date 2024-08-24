import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import {CODIGO_PARAMETRO_CARTERA,CODIGO_PARAMETRO_ESTADO} from '../../../../../shared/Constantes';
import { Empresa } from 'src/app/shared/models/empresa';
import { SedeLista } from 'src/app/shared/models/sedeLista';

@Injectable({
    providedIn: 'root'
})

export class EmpresaService {

    urlEndpointEmpresa = `${environment.apiUrl}/gestionriesgo/empresa`;
    urlEndpointResponsableParametro = `${environment.apiUrl}/gestionriesgo/parametro`;
    urlEndpointSede = `${environment.apiUrl}/gestionriesgo/sede`;
    urlEndpointGerencia = `${environment.apiUrl}/gestionriesgo/gerencia`;
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

    registrarNuevaEmpresa(empresaBody: Empresa): Observable<any> {
        return this.httpClient.post(this.urlEndpointEmpresa + '/registrarEmpresa', empresaBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar la nueva empresa. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    registrarSede(sedeBody: SedeLista): Observable<any> {
        return this.httpClient.post(this.urlEndpointSede + '/registrarSede', sedeBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar la nueva sede. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    eliminarEmpresa(empresaBodyEliminar: Empresa): Observable<any> {
        return this.httpClient.post(this.urlEndpointEmpresa + '/anularEmpresa', empresaBodyEliminar, {}).pipe(
            catchError(e => {
                console.error('Error al intentar eliminar la empresa. Msg: ' + e.error);
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

    actualizarEmpresa(empresa: Empresa): Observable<any> {
        return this.httpClient.put(this.urlEndpointEmpresa + '/actualizarEmpresa', empresa, {
            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la empresa. Msg: ' + e.error);
                
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarSede(sedes:SedeLista): Observable<any> {
        return this.httpClient.put(this.urlEndpointSede + '/actualizarSede', sedes, {

            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la sede. Msg: ' + e.error);
                
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

}
