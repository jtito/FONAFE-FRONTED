import {Injectable} from '@angular/core';
import swal from 'sweetalert2';

import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {AuthLoginService} from '../../main/pages/authentication/auth-login/auth-login.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authLoginService: AuthLoginService, private router: Router) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('Interceptor para que valida la autenticacion ');
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {

                    if (this.authLoginService.isAuthenticated()) {
                        this.authLoginService.cerrarSesion();
                    }
                    this.router.navigate(['pages', 'auth', 'login']);
                }

                if (err.status === 403) {
                    swal.fire('Acceso denegado', 'No tienes acceso a este recurso', 'warning');
                    this.router.navigate(['pages', 'auth', 'login']);
                }

                return throwError(err);
            })
        );
    }
}
