import { MatrizRiesgoControl } from './matrizRiesgoControl';
import { SubProceso } from './subproceso';
import { Proceso } from './proceso';

export class MatrizOportunidadDetalle {

    idDetalleMOportunidad?: number;
    idMatrizRiesgo?: number;
    idPeriodo?: number;
    idMatrizNivel?: number;
    idGerencia?: number;
    idEmpresa?: number;
    idSedeEmpresa?: number;
    deOrigen?: string;
    deGrupoInteres?: string;
    deObjetivo?: string;
    idProceso?: number;
    IdSubproceso?: number;
    codOpor?: string;
    deOportunidad?: string;
    nivelComplejidad?: number;
    nivelCosto?: number;
    nuViabilidad?: number;
    idTipoBeneficio?: number;
    nuBeneficio?: number;
    nuNivelPriori?: number;
    deNivelPriori?: string;
    idEstrategiaPlan?: number;
    codSam?: string;
    codPlanAccion?: string;
    dePlanAccion?: string;
    idRespPlanAccion?: number;
    recursoFina?: number;
    recursoOper?: number;
    recursoTecno?: number;
    recursoHuma?: number;
    reqNego?: number;
    feIniPlanAccion?: Date;
    feFinPlanAccion?: Date;
    deEntregable?: string;
    idEstadoPlanAccion?: number;
    fePrevista?: Date;
    feVerificacion?: Date;
    idVerificador?: String;
    deEvidencia?: string;
    deComentario?: string;
    usuarioCreacion?: string;
    ipCreacion?: string;
    fechaCreacion?: string;
    indicadorBaja?: number;
    inEficaz?: Number;
    idUsuaCrea?: string;
    deUsuaCreaIp?: string;
    feUsuaCrea?: Date;
    idUsuaModi?: string;
    deUsuaModiIp?: string;
    feUsuaModi?: Date;
    inBaja?: number;
    NP?: number;

}

