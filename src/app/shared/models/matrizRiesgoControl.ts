export class MatrizRiesgoControl {
    idCartera?: number;
    idEmpresa?: number;
    idSede?: number;
    idPeriodo?: number;
    idTipoMatriz?: number;
    idMatrizNivel?: number;
    fechaCreacion?: string;
    deCartera?:string;
    deFoda?:string;
    deGrupoInteres?:string;
    /* Riesgo */
    idMatrizRiesgo?: number;
    descripcionGerencia?: string;
    idGerencia?: number;
    idProceso?: number;
    idSubProceso?: number;
    deRiesgo ?: string;
    procesosImpactados?: string;
    idOrigenRiesgo?: number;
    idFrecuenciaRiesgo?: number;
    idTipoRiesgo?: number;
    probabilidadRiesgo?: number;
    impactoRiesgo?: number;
    severidadRiesgo?: number;
    idSeveridadRiesgoInherente?: number;

    /* Control */
    idCodigoControl?: number;
    deControl?: string;
    idAreaControl?: number;
    idResponsableControl?: number;
    idFrecuenciaControl?: number;
    idOportunidadControl?: number;
    idAutomatizacionControl?: number;
    descripcionEvidenciaControl?: string;
    probabilidadControl?: number;
    impactoControl?: number;
    severidadControl?: number;
    idSeveridadControlResidual?: number;

    nombreSede?: string;
    nombreGerencia?: string;
    procesos?: string;
    indicadorBaja?: string;
    usuarioCreacion?: string;
    ipCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
    matrizNivel?:number;
    /* Id temporal Para edicion */
    ordenTabla?:number;
    modified?:boolean;
}
