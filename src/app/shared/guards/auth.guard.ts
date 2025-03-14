import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthLoginService} from '../../main/pages/authentication/auth-login/auth-login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(private router: Router, private authLoginService: AuthLoginService) {
    }

    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        console.log("Ruta "+route.path);
        if (this.authLoginService.isAuthenticated()) {
            if (this.isTokenExpirado()) {
                this.authLoginService.cerrarSesion();
                this.router.navigate(['pages', 'auth', 'login']);
                return false;
            }
            return true;
        }
        this.router.navigate(['pages', 'auth', 'login']);
        return false;
    }

    public isTokenExpirado(): boolean {
        const token = this.authLoginService.userToken;
        const payload = this.authLoginService.obtenerDatosToken(token);
        const horaActual = new Date().getTime() / 1000;

        if (payload.exp < horaActual) {
            return true;
        }
        return false;
    }



}
