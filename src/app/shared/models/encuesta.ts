import { Pregunta } from "./pregunta";

export interface Encuesta {
    
    idEncuesta?: number;
    tituloEncuesta?: string;
    feEncuesta?: string;
    feFinEncuesta?: string;
    subtituloEncuesta?: string;
    idEmpresa?: number;
    idPeriodo?: number;
    dePeriodo?: string;
    textoEncuesta?: string;
    contTextoEncuesta?: string;
    cantidadPreguntas?: number;
    listaPreguntas?: Pregunta[];
    usuarioCreacion?: string;
    fechaCreacion?: string;
    ipCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
    indicadorBaja?: string;

}
