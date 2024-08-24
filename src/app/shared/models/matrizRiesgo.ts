import {MatrizRiesgoControl} from '../models/matrizRiesgoControl';
import { SubProceso } from './subproceso';
import { Proceso } from './proceso';
import {Archivo} from "./archivo";
export class MatrizRiesgo {
    data?: any;
    idCartera?: number;
    idEmpresa?: number;
    idSede?: number;
    idPeriodo?: number;
    idTipoMatriz?: number;
    codMatriz?: string;
    idMatrizNivel?: number;
    fechaCreacion?: string;
    deCartera?:string;
    deFoda?:string;
    deGrupoInteres?:string;
    deTitulo?:string;

    /* Riesgo */
    idMatrizRiesgo?: number;
    idDetaMatrizRiesgo?: number;
    descripcionGerencia?: string;
    idGerencia?: number;
    idProceso?: number;
    idSubProceso?: number;
    deRiesgo ?: string;
    deProcesoImpactado?: string;
    idOrigenRiesgo?: number;
    idFrecuenciaRiesgo?: number;
    idTipoRiesgo?: number;
    nuProbabilidadInherente?: number;
    nuImpactoInherente?: number;
    nuPuntajeInherente?: number;
    deSeveridadInherente?: string;
    idSeveridadRiesgoInherente?: number;
    codRiesgo?:string;
    codControl?:string;
    tipoEvidencia?:string;

    /* Control */
    idCodigoControl?: number;
    deControl?: string;
    idAreaControl?: string;
    idResponsableControl?: string;
    idFrecuenciaControl?: number;
    idOportunidadControl?: number;
    idAutomatizacionControl?: number;
    deEvidenciaControl?: string;
    evidenciaPlanAccion?: string;
    nuProbabilidadResidual?: number;
    nuImpactoResidual?: number;
    nuPuntajeResidual?: number;
    
    deSeveridadResidual?: string;
    idnPuntajeResidualResidual?: number;

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
    /* Lista Control */

    
    listaDetalleMatriz?:MatrizRiesgo[];
    listaProcesos?:Proceso[];
    listaSubProcesos?:SubProceso[];
    /* Id temporal Para edicion */

    lstArchivoFisico?: Archivo[];
    lstArchivoValidacion?: Archivo[];

    /* Fraude */
    //1108 Plan Accion
    idEstrategiaResp?:number;
    codPlanAccion?:string;
    desPlanAccion?:string;
    idAreaPlanAccion?: string;
    idResponsablePlanAccion?:string;
    fechaInicioPlanAccion?:string;
    estadoPlanAccion?:string;
    fechaFinPlanAccion?:string;

    //1108 Verificacion eficacia
    fechaPrevista?:string;
    fueEficaz?:string;
    fechaVerificacion?:string;
    verificadoPor?:string;
    evidenciaEficacia?:string; 
    observaciones?:string;
    codkri?:string;
    defKri?:string;
    frecuencia?:string;
    metkri?:string;
    kriActual?:string;
    kriResponsable?:string;
    cantidadArchivosControl?:number=0;
    cantidadArchivosPlan?:number=0;
    cantidadArchivosControlString?:string;
    cantidadArchivosPlanString?:string;

    ordenTabla?:number;
    modified?:boolean;
}
