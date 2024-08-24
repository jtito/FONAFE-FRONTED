import { MatrizRiesgoControl } from '../models/matrizRiesgoControl';
import { SubProceso } from './subproceso';
import { Proceso } from './proceso';
import { MatrizOportunidadDetalle } from './matrizOportunidadDetalle';

export class MatrizOportunidad {


    idMatrizRiesgo?: number;
    idCartera?: number;
    deCartera?: string;
    idEmpresa?: number;
    idSede?: number;
    idGerencia?: number;
    idPeriodo?: number;
    dePeriodo?: string;
    idTipoMatriz?: number;
    deTipoMatriz?: string;
    idMatrizNivel?: number;
    deMatrizNivel?: string;
    matrizNivel?: number;
    usuarioCreacion?: string;
    ipCreacion?: string;
    fechaCreacion?: string;
    usuarioModificacion?: string;
    ipModificacion?: string;
    fechaModificacion?: string;
    indicadorBaja?: number;
    deGrupoInteres?: Date;
    listaDetalleMatrizOportunidad?: MatrizOportunidadDetalle[];

}

