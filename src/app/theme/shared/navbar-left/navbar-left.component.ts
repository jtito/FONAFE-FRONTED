import {Component, Injectable, OnInit} from '@angular/core';
import {Menu} from '../../../shared/models/menu';
import {AuthLoginService} from '../../../main/pages/authentication/auth-login/auth-login.service';
import {PrimeNGConfig} from 'primeng/api';
import {OPCIONES} from 'src/app/fakedata/menu.json';
import {DataLogin} from "../../../shared/models/data";

@Injectable({providedIn: 'root'})
@Component({
    selector: 'app-navbar-left',
    templateUrl: 'navbar-left.component.html',
    styleUrls: ['../css/navbar-left.css']
})

export class NavbarLeftComponent implements OnInit {

    visibleSidebar1;
    submenu: boolean;
    opcionId: number;
    descripcionSede: string;
    listaOpciones: Menu[];
    payload: DataLogin;

    constructor(private authLoginService: AuthLoginService, private primengConfig: PrimeNGConfig) {
        this.submenu = false;
        this.opcionId = -1;
        this.primengConfig.ripple = true;
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.listaOpciones = this.payload.data.listaMenu;
        //this.listaOpciones = OPCIONES;
        this.descripcionSede = this.payload.data.datosSede.descripcionSede;
        if(this.descripcionSede == null || this.descripcionSede.length == 0)
            this.descripcionSede = 'Sin Sede';
        console.log(this.payload.data);
        console.log(this.payload.data.datosSede);
    }

    ngOnInit(): void {

    }

    mostrarSubmenu(idOpcion: number): void {
        console.log(this.listaOpciones);
        this.submenu = !this.submenu;
        if (this.opcionId !== idOpcion) {
            this.submenu = true;
        }
        this.opcionId = idOpcion;
    }

    ocultarSubmenu():void{
        this.visibleSidebar1 = false;
    }

    decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

}
