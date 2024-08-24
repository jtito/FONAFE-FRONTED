export interface Respuesta{
    idRespuesta?: number;
    deRespuesta?:string;
    idPregunta?:number;
    indicadorAlternativa?: number;
    inAlternativa?: string;
    indicadorBaja?: string;
    usuarioCreacion?: string;
    ipCreacion?: string;
    fechaCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
}