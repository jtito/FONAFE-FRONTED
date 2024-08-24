import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthLoginService} from '../../main/pages/authentication/auth-login/auth-login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authLoginService: AuthLoginService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        const token = this.authLoginService.userToken;

        if (token != null) {
            console.log('Interceptor para agregar cabecera');
            const authReq = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + token)
            });

            return next.handle(authReq);
        }

        return next.handle(request);
    }
}
