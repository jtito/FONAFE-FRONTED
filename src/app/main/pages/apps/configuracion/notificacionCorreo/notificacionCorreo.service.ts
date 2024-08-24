import {Injectable} from "@angular/core";
import {environment} from "../../../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthLoginService} from "../../../authentication/auth-login/auth-login.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";

import {NotificacionCorreo} from "../../../../../shared/models/notificacionCorreo";


@Injectable({
    providedIn: 'root'
})

export class NotificacionCorreoService{
    urlEndpointNotificacionCorreo = `${environment.apiUrl}/gestionriesgo/correoPlan`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    obtenerConfiguracionPlanAccion(): Observable<any> {
        return this.httpClient.get(this.urlEndpointNotificacionCorreo + '/obtenerConfiguracionPlanAccion/', {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener los datos de configuracion de plan de acción. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

    actualizarConfiguracionPlanAccion(NotificacionCorreoBody: NotificacionCorreo): Observable<any>{
        return this.httpClient.put(this.urlEndpointNotificacionCorreo + '/actualizarConfiguracionPlanAccion', NotificacionCorreoBody, {}).pipe(catchError(e => {
                console.error('Error al intentar actualizar la configuracion de plan de acción. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }
}
