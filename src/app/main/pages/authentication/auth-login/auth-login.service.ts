import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { NgxCaptchaService } from '@binssoft/ngx-captcha';
import { catchError } from 'rxjs/operators';
import { HTTP_HEADERS_TOKEN } from '../../../../shared/Constantes';
import { environment } from "../../../../../environments/environment.prod";
import Swal from "sweetalert2";

@Injectable({ providedIn: 'root' })
export class AuthLoginService {
    private token: string;
    private usuario: string;
    captchaStatus: any = false;
    constructor(private http: HttpClient,private captchaService: NgxCaptchaService) {

    }

    public get userToken(): string {

        if (this.token != null) {
            return this.token;
        } else if (this.token == null && sessionStorage.getItem('token') != null) {
            this.token = sessionStorage.getItem('token');
            return this.token;
        }
        return "null";
    }

    public iniciarSesion(usuarioParam: string, passwordParam: string): Observable<any> {

        const params = new URLSearchParams();
        params.set('grant_type', 'password');
        params.set('username', usuarioParam);
        params.set('password', passwordParam);

        return this.http.post(environment.apiUrl + '/oauth/token',
            params.toString(), {
            headers: HTTP_HEADERS_TOKEN
        }).pipe(catchError(e => {
            console.error(' Error al intentar iniciar sesión. Msg: ' + e.error);
            return throwError(e);
        })
        );
    }

    public guardarToken(accessToken: string): void {

        this.token = accessToken;
        sessionStorage.setItem('token', accessToken);
    }

    public obtenerDatosToken(accessToken: string): any {

        if (accessToken != null) {
            return JSON.parse(atob(accessToken.split('.')[1]));
        }
        return null;
    }

    isAuthenticated(): boolean {

        const payload = this.obtenerDatosToken(sessionStorage.getItem('token'));
        if (payload != null) {
            return true;
        }
        return false;
    }

    public guardarUsuario(usuario: string): void {

        this.usuario = usuario;
        sessionStorage.setItem('usuario', usuario);
    }

    public cerrarSesion(): void {

        this.token = null;
        sessionStorage.clear();
        
    }


    public get usuarioData(): string {

        if (this.usuario != null) {
            return this.usuario;
        } else if (this.usuario == null && sessionStorage.getItem('usuario') != null) {
            this.usuario = sessionStorage.getItem('usuario');
            return this.usuario;
        }
        return null;
    }

    /*saveCurrentUser(user: any): void {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }*/

    obtenerIp(): Observable<any> {

        return this.http.get('http://api.ipify.org/?format=json', {}).pipe(
            catchError(e => {
                console.error('Error al intentar obtener la ip del usuario. Msg: ' + e.error);
                if (Swal.isLoading()) {
                    Swal.close();
                }
                Swal.fire('Error', 'Ocurrió un error inesperado.<br><br>Intente nuevamente por favor.', 'error');
                return throwError(e);
            })
        );
    }

}
