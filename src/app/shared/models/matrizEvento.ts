import {MatrizRiesgoControl} from '../models/matrizRiesgoControl';
import { Proceso } from './proceso';

export class MatrizEvento {
    

    ordenTabla?:number;
    idDetaMatrizEvento?:number;
    idMatrizRiesgo?:number;
    idCartera?:number;
    deCartera?:string;
    idEmpresa?:number;
    idTipoMatriz?: number;
    idSede?:number;
    idGerencia?:number;
    idPeriodo?:number;
    dePeriodo?:string;
    idMatrizNivel?:number;
    deMatrizNivel?:string;
    trimestre?:string;
    tievento1?:string;
    tievento2?:string;
    perdidaBruta?:number;
    interes?:number;
    inPlanAccion?:number;
    indicadorBaja?:number;
    importePerdida?:number;
    usuarioCreacion?:string;
    ipCreacion?:string;
    usuarioModificacion?:string;
    ipModificacion?:string;
    idEstadoEvento?:number;
    feOcurrencia?:string;
    feMaterial?:string;
    essalud?:number;
    dePlanAccion?:string;
    deEvento?:string;
    cuentaContable?:string;
    comentario?:string;
    codEvento?:string;
    causaEvento?:string;
    areaEvento?:number;
    anio?:number;

    idCodigoControl?:number;
    
    listaDetalleMatriz?:MatrizEvento[];
    modified?:boolean;
    listaProcesos?:Proceso[];
   
}