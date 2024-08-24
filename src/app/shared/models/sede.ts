import { Gerencia } from "./gerencia";

export interface Sede {

    idSede?: number;
    descripcionSede?: string;
    idEmpresa?: number;
    indicadorBaja?: string;
    usuarioCreacion?: string;
    ipCreacion?: string;
    fechaCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
    listaGerencias?: Gerencia[];
}
