import { SubProceso } from './subproceso';
import { Proceso } from './proceso';

export class MatrizContinuidad {
    idDetaMatrizContinuidad?: number;
    idMatrizRiesgo?: number;
    idCartera?: number;
    idEmpresa?: number;
    idSede?: number;
    idPeriodo?: number;
    codMatriz?: string;
    idTipoMatriz?: number;
    idMatrizNivel?: number;
    listaDetalleMatrizContinuidad?: MatrizContinuidad[];
    fechaCreacion?: string;
    indicadorBaja?: string;
    usuarioCreacion?: string;
    ipCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;

    nombreSede?: string;
    nombreGerencia?: string;

    deCartera?:string;
    descripcionGerencia?: string;
    idGerencia?: number;

    deFoda?:string;
    deGrupoInteres?:string;

    /* Riesgo */
    
    idProceso?: number;
    idSubProceso?: number;
    codRiesgo?:string;
    deRiesgo ?: string;
    nuProbabilidadInherente?: number;
    nuImpactoInherente?: number;
    nuPuntajeInherente?: number;
    deSeveridadInherente?: string;
    idSeveridadRiesgoInherente?: number;
  
    /* Control */
    idCodigoControl?: number;
    codControl?:string;
    deControl?: string;
    idEfecControl?: number;
    adicControl?: string;
    infraControl?: string;
    reHuControl?: string;
    reTiControl?: string;
    regVitalControl?: string;
    proveControl?: string;
    otrosControl?: string;

    nuProbabilidadResidual?: number;
    nuImpactoResidual?: number;
    nuPuntajeResidual?: number;
    deSeveridadResidual?: string;

    idEstrategiaPlan?: number;
    codPlanAccion?:string;
    dePlanAccion?:string;
    idAreaPlanAccion?:string;
    idResPlanAccion?:string;
    feIniPlanAccion?:string;
    idEstadoPlanAccion?:number;
    feFinPlanAccion?:string;
    comePlanAccion?:string;


    procesos?: string;

    listaProcesos?:Proceso[];
    listaSubProcesos?:SubProceso[];
    
    ordenTabla?:number;
    modified?:boolean;
}
