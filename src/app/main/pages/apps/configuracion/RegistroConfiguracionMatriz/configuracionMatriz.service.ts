import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';
import { ConfigMatriz } from 'src/app/shared/models/configMatriz';

@Injectable({
    providedIn: 'root'
})

export class ConfigMatrizService{
    urlEndpointConfigMatriz = `${environment.apiUrl}/configuracion/matriz`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {}

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    obtenerListaConfigMatriz(idConfigMatriz: number): Observable<any> {
        return this.httpClient.get(this.urlEndpointConfigMatriz + '/listarConfigMatriz/' + idConfigMatriz, {}).pipe(
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

    registrarNuevaConfig(configBody: ConfigMatriz): Observable<any> {
        console.log("registrandoNuevaConfig");
        console.log(configBody);
        return this.httpClient.post(this.urlEndpointConfigMatriz + '/registrarConfig', configBody, {}).pipe(catchError(e => {
                console.error('Error al intentar registrar nueva configuración. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarConfig(configMatriz: ConfigMatriz): Observable<any> {
        return this.httpClient.put(this.urlEndpointConfigMatriz + '/actualizarConfig', configMatriz, {
            headers: this.agregarCabeceras()
        }).pipe(
            catchError(e => {
                console.error('Error al intentar actualizar la configuración. Msg: ' + e.error);
                
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    obtenerConfig(idConfigMatriz): Observable<any> {
        return this.httpClient.get(this.urlEndpointConfigMatriz + '/obtenerConfig/' + idConfigMatriz, {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de la configuración. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

}