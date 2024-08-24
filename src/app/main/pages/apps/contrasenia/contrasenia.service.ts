import {Injectable} from "@angular/core";
import {environment} from "../../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthLoginService} from "../../authentication/auth-login/auth-login.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";
import { Responsable } from "src/app/shared/models/responsable";


@Injectable({
    providedIn: 'root'
})

export class ContraseniaService{
    urlEndpointResponsable = `${environment.apiUrl}/gestionriesgo/responsable`;

    constructor(private httpClient: HttpClient, private authLoginService: AuthLoginService) {
    }

    private agregarCabeceras(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + this.authLoginService.userToken
        });
    }

    actualizarContrasenia(responsable: Responsable): Observable<any>{
        return this.httpClient.put(this.urlEndpointResponsable + '/actualizarPassword', responsable, {}).pipe(catchError(e => {
                console.error('Error al intentar cambiar la contraseña. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }
}
