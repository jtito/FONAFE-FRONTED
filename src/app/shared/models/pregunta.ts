import { Respuesta } from "./respuesta";

export interface Pregunta {
    idPregunta?: number;
    dePregunta?: string;
    tiPregunta?: number;
    deTipoPregunta?: string;
    grupoPregunta?: number;
    deGrupoPregunta?: string;
    puntaje?: string;
    idEncuesta?: number;
    idEmpresa?: string;
    usuarioCreacion?: string;
    fechaCreacion?: string;
    ipCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
    indicadorBaja?: string;
    listaRespuestas?: Respuesta[];
    notaPregunta?: string;
}
