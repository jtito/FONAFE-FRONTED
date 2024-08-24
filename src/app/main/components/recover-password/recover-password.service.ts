import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

import {catchError} from 'rxjs/operators';
import {HTTP_HEADERS_TOKEN} from 'src/app/shared/Constantes';
import {environment} from "src/environments/environment.prod";
import Swal from "sweetalert2";


@Injectable({providedIn: 'root'})
export class RecoverPasswordService {
    private token: string;
    private correo: string;
    private contrasenia: string;

    constructor(private http: HttpClient) {

    }


    public reestablecerContrasenia(token: string, correo: string, contrasenia: string): Observable<any> {
        
        const body = {
            token: token,
            correo: correo,
            contrasenia: contrasenia
          };
      
          const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });
        

        return this.http.post(environment.apiUrl + '/gestionriesgo/correoPlan/test',
            body, { headers: headers })
            .pipe(
            catchError(e => {
                console.error(' Error al reestablecer contraseña. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }



 
}