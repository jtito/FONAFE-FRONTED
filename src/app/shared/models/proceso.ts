import { SubProceso } from "./subproceso";

export class Proceso {
    idProceso?:number;
    idMatrizNivel?:number;
    deProceso?:string;
    idTipoMatriz?:number;
    idEmpresa?: number;
    deEmpresa?: string;
    ipCreacion?:string;
    fechaCreacion?:string;
    usuarioCreacion?:string;
    usuarioModificacion?:string;
    ipModificacion?:string;
    fechaModificacion?:string;
    idSedeEmpresa?: number;
    deSedeEmpresa?: string;
    idGerencia?: number;
    indicadorBaja?: string;
    online?:number;
    lstProcAdd?: SubProceso[];
    lstProcDel?: SubProceso[];
    lstProc?: SubProceso[];

    idProcesoMatriz?:number;
    inMatrizOperacional?: number;
    inMatrizFraude?: number;
    inMatrizContinuidad?: number;
    inMatrizAnticorrupcion?: number;
    inMatrizOportunidad?: number;
    inMatrizEvento?: number;

    idProcTemp?: number;
}

