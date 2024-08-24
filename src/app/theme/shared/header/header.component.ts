import {Component, OnInit} from '@angular/core';
import {AuthLoginService} from '../../../main/pages/authentication/auth-login/auth-login.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {DataLogin} from '../../../shared/models/data';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    datosToken: DataLogin;

    constructor(public authLoginService: AuthLoginService, private router: Router) {
        this.datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    }

    cerrarSesion(): void {

        this.authLoginService.cerrarSesion();
        swal.fire(
            'Hasta pronto',
             this.datosToken.data.nombre + ', ¡Has cerrado sesión con éxito!',
            'success'
        );
        this.router.navigate(['pages', 'auth', 'login']);
        
    }

    cambiarContrasenia(): void {

        this.router.navigate(['pages', 'main', 'contrasenia']);

    }

}
