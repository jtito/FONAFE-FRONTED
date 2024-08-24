import {MatrizRiesgoControl} from '../models/matrizRiesgoControl';
import { SubProceso } from './subproceso';
import { Proceso } from './proceso';

export class MatrizFraude {

    idDetaMatrizFraude?: number;
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

    /* Riesgo */
    idMatrizRiesgo?: number;
    descripcionGerencia?: string;
    idGerencia?: number;
    idProceso?: number;
    idSubProceso?: number;
    deRiesgo ?: string;
    riesgoAsociado?: string;
    idOrigenRiesgo?: number;
    agenteFraude?: string;
    idFrecuenciaRiesgo?: number;
    idTipoRiesgo?: number;
    nuProbabilidadInherente?: number;
    nuImpactoInherenteE?: number;
    nuImpactoInherenteL?: number;
    nuImpactoInherenteR?: number;
    nuImpactoInherenteC?: number;
    nuImpactoInherenteG?: number;

    nuPuntajeInherente?: number;
    deSeveridadInherente?: string;
    idSeveridadRiesgoInherente?: number;
    codRiesgo?:string;
    codControl?:string;

    /* Control */
    idCodigoControl?: number;
    deControl?: string;
    idAreaControl?: string;
    idResponsableControl?: string;
    limitaOportunidaControl?: number; 
    motivaActoControl?: number;
    actitudPotencialControl?: number;
    idFrecuenciaControl?: number;
    idOportunidadControl?: number;
    idAutomatizacionControl?: number;
    deEvidenciaControl?: string;
    nuProbabilidadResidual?: number;

    nuImpactoResidualE?: number;
    nuImpactoResidualL?: number;
    nuImpactoResidualR?: number;
    nuImpactoResidualC?: number;
    nuImpactoResidualG?: number;
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

    
    listaDetalleMatriz?:MatrizFraude[];
    listaProcesos?:Proceso[];
    listaSubProcesos?:SubProceso[];
    /* Id temporal Para edicion */

    /* Fraude */
    //1108 Plan Accion
    idEstrategiaResp?:number;
    codPlanAccion?:string;
    desPlanAccion?:string;
    idResponsablePlanAccion?:string;
    fechaInicioPlanAccion?:string;
    estadoPlanAccion?:number;
    fechaFinPlanAccion?:string;

    //1108 Verificacion eficacia
    fechaPrevista?:string;
    fueEficaz?:string;
    fechaVerificacion?:string;
    verificadoPor?:string;
    evidenciaEficacia?:string; 
    observaciones?:string;
    codkri?:string;
    kri?:number;
    defKri?:string;
    frecuencia?:string;
    metKri?:string;
    kriActual?:string;
    resAsegurar?:string;
    kriResponsable?:string;

    ordenTabla?:number;
    modified?:boolean;
}
