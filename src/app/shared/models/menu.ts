import {SubMenu} from './subMenu';

export interface Menu {
    idMenu: number;
    nombreMenu: string;
    rutaMenu: string;
    iconoMenu: string;
    estado: string;
    listaSubmenu?: SubMenu[];
}
