import { Gerencia } from "./gerencia";
import { Sede } from "./sede";

export interface Empresa {
    idEmpresa?: number;
    idCartera?: number;
    razonSocial?: string;
    nombreCortoEmpresa?: string;
    direccion?: string;
    ruc?:number;
    indicadorSede?: number;
    indicadorBaja?: string;
    descripcionCartera?: string;
    listaSedes?: Sede[];
    listaGerencias?: Gerencia[];
    usuarioCreacion?: string;
    ipCreacion?: string;
    fechaCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
}
