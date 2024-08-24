import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import FileSaver from 'file-saver';
import { PrimeNGConfig } from 'primeng/api';
import { DimensionMetodologia } from 'src/app/shared/models/dimensionMetodologia';
import { DimensionService } from './dimension.service';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';

@Component({
  selector: 'app-conf-dimension-metodologia',
  templateUrl: './dimension-metodologia.component.html',
  styleUrls: ['./dimension-metodologia.component.scss']
})
export class DimensionMetodologiaComponent implements OnInit {

  cols: any[];
  loading: boolean;
  listaDimensionMetodologia: DimensionMetodologia[];
  listaVacia: DimensionMetodologia[];
  listaIndicadoresBaja: any[];
  listaEmpresa: [];
  listaTipoEvaluacion: Parametro[];
  idEmpresa: number = 0;
  idTipoEvaluacion: number = 0;
  estado: string;
  indicadorBaja: number = 1;
  idPerfil:number;
  payload: DataLogin;
  
  constructor(private authLoginService: AuthLoginService,private dimensionService: DimensionService, private router: Router, private config: PrimeNGConfig) {
      // this.obtenerListaAnios();
      // this.obtenerListaPeriodosParametro();
      this.solvePermissions();
      this.listaIndicadoresBaja = [];

  }

  ngOnInit(): void {
    this.loading = true;
    this.estado = 'Activo';
    this.cols = [
        {field: 'nombreCorto', header: 'Empresa', class: 'text-center', ordenadmiento: 'nombreCorto', headerClass: 'text-center'},
        {field: 'deParametro', header: 'Tipo Evaluación', class: 'text-center', ordenadmiento: 'deParametro', headerClass: 'text-center'},
        // {field: 'nuDimRiesgo', header: 'Código', class: 'text-center', ordenadmiento: 'nuDimRiesgo', headerClass: 'text-center'},
        {field: 'nuProbabilidad', header: 'Probabilidad', class: 'text-center', ordenadmiento: 'nuProbabilidad', headerClass: 'text-center'},
        {field: 'nuImpacto', header: 'Impacto', class: 'text-center', ordenadmiento: 'nuImpacto', headerClass: 'text-center'},
        {field: 'deDimension', header: 'Dimension', class: 'text-center', ordenadmiento: 'deDimension', headerClass: 'text-center'},
        {field: 'inBaja', header: 'Estado', class: 'text-center', headerClass: 'text-center'},
    ];
    this.listaVacia = [
      {nuDimRiesgo: ''},
      {nuDimRiesgo: ''},
      {nuDimRiesgo: ''}
    ]
    // this.loading = true;
  }

  solvePermissions(){
    this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    this.idPerfil = this.payload.data.idPerfil;
    if(this.idPerfil==TipoPerfil.admin){
        
        this.idEmpresa=0;
        this.obtenerListaDimension(this.idEmpresa,this.idTipoEvaluacion);
        this.obtenerListaEmpresas();
        this.obtenerListaTipoEvaluacion();
        
    }
    else{
        this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
        this.obtenerListaDimension(this.idEmpresa,this.idTipoEvaluacion);
        this.obtenerListaEmpresas();
        this.obtenerListaTipoEvaluacion();
    }
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {

        var lista = [];
       
        for(var j=0;j<this.listaDimensionMetodologia.length;j++){

            var obj = new Object();
            obj['Empresa'] =this.listaDimensionMetodologia[j]['nombreCorto'];
            obj['Tipo Evaluación'] =this.listaDimensionMetodologia[j]['deParametro'];
            obj['Probabilidad'] =this.listaDimensionMetodologia[j]['nuProbabilidad'];
            obj['Impacto'] =this.listaDimensionMetodologia[j]['nuImpacto'];
            obj['Dimensión'] =this.listaDimensionMetodologia[j]['deDimension'];
            obj['Estado'] =this.listaDimensionMetodologia[j]['inBaja'];
            lista.push(obj);
        }


        const worksheet = xlsx.utils.json_to_sheet(lista);
        const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
        const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
        this.saveAsExcelFile(excelBuffer, 'Escala de nivel de riesgos');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  obtenerListaDimension(empresa: number, tipoEvaluacion: number): void{
    console.log("obtenerListaDimension")
    this.dimensionService.obtenerListaDimension(empresa, tipoEvaluacion).subscribe(
      resp => {
        // console.log(resp)
        if(resp.listaDimension.length > 0){
            this.listaIndicadoresBaja = [];
          for(let i = 0; i < resp.listaDimension.length; i++){
            resp.listaDimension[i].inBaja == '0' ? resp.listaDimension[i].inBaja = 'Inactivo' : resp.listaDimension[i].inBaja = 'Activo';
            if (!this.listaIndicadoresBaja.includes(resp.listaDimension[i].inBaja)) {
                this.listaIndicadoresBaja.push(resp.listaDimension[i].inBaja.toString());
            }
            this.listaDimensionMetodologia = resp.listaDimension;

            this.obtenerEscalasEstado(this.estado);
          }
          this.loading = false;
        }else{ 
          this.loading = false;
          this.listaDimensionMetodologia = [];
        }
      }
    );
  }

onChange(deviceValue){
    this.estado = deviceValue;

    this.obtenerListaDimension(this.idEmpresa,this.idTipoEvaluacion);
}

obtenerEscalasEstado(value): void {

    let listEscalasEstado;

    listEscalasEstado = this.listaDimensionMetodologia.filter(dimension =>
        dimension.inBaja==this.estado
    );

    if (listEscalasEstado.length == 0){
        listEscalasEstado = this.listaDimensionMetodologia.filter(dimension =>
            dimension.inBaja=='Inactivo'
        );
    }

        this.listaDimensionMetodologia = listEscalasEstado;
}

  obtenerListaEmpresas(): void {
      this.dimensionService.obtenerListaEmpresas().subscribe(
          resp => {
              this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
                empresa.indicadorBaja == this.indicadorBaja    
            );
              console.log('lista de empresas : ' + resp.listaEmpresas);
          }
      );
  }

  obtenerListaTipoEvaluacion(): void {
      this.dimensionService.obtenerListaTipoEvaluacion().subscribe(
          resp => {
              this.listaTipoEvaluacion = resp.listaParametros;
          }
      );
  }

  eliminarDimencion(idDimensionRiesgo: number):void{

    const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    const usuarioModificacion = datosToken.data.username;

    const periodoBodyEliminar: DimensionMetodologia = {
            
        idDimRiesgo: idDimensionRiesgo,
        idUsuaModi: usuarioModificacion,//'USERModificador',
        deUsuaModiIp: '192.168.1.2'
    };

    console.log(periodoBodyEliminar);
    Swal.fire({
        title: '¿Está seguro de eliminar la escala de nivel de riesgos?',
        showCancelButton: true,
        confirmButtonText: `Eliminar`,
        cancelButtonText: `Cancelar`,
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Espere por favor',
                html: 'Estamos eliminando la escala de nivel de riesgo',
                allowOutsideClick: () => !Swal.isLoading(),
                allowEscapeKey: () => !Swal.isLoading()
            });
            Swal.showLoading();
            this.dimensionService.eliminarDimension(periodoBodyEliminar).subscribe(
                resp => {
                    console.log(resp);
                    if (resp.idPeriodo !== 0) {
                        if (Swal.isLoading()) {
                            Swal.close();
                        }
                        this.obtenerListaDimension(this.idEmpresa,this.idTipoEvaluacion);
                        Swal.fire('¡Eliminación exitosa!', resp.mensaje, 'success');
                        this.router.navigate(['/pages', 'main', 'configuracion', 'dimensionMetodologia']);
                    } else {
                        if (Swal.isLoading()) {
                            Swal.close();
                            Swal.fire('Ocurrió un error', resp.mensaje, 'error');
                        }
                    }
                }
            );
        }
    });
  }

  onChangeEmpresa(deviceValue): void {
      this.idEmpresa = deviceValue.target.value;
      console.log('empresa: ' + this.idEmpresa);
      console.log('anio: ' + this.idTipoEvaluacion);
      this.obtenerListaDimension(this.idEmpresa,this.idTipoEvaluacion);
  }

  onChangeTipoEvaluacion(deviceValue): void {
      this.idTipoEvaluacion = deviceValue.target.value;
      console.log('anio: ' + this.idTipoEvaluacion);
      console.log('empresa: ' + this.idEmpresa);
      this.obtenerListaDimension(this.idEmpresa,this.idTipoEvaluacion);
  }

}
