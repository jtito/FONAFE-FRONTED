import { Menu } from './menu';
import {Empresa} from "./empresa";
import { Sede } from './sede';

export interface UserLogin {

    idUsuario: number;
    username: string;
    password: string;
    estado: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    listaMenu: Menu[];
    datosEmpresa: Empresa;
    datosSede: Sede;
    idPerfil: number;
    ipCreacion: string;
}
