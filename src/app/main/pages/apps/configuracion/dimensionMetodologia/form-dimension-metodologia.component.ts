import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DimensionMetodologia } from '../../../../../shared/models/dimensionMetodologia';
import {Parametro} from '../../../../../shared/models/parametro';
import Swal from 'sweetalert2';
import { DimensionService } from './dimension.service';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';

@Component({
    selector:'app-conf-registrar-dimension-metodologia',
    templateUrl: 'form-dimension-metodologia.dimensionmetodologia.html'
})

export class FormDimensionMetodologiaComponent implements OnInit{

    dimensionMetodologia: DimensionMetodologia;
    formularioDimensionMetologia: FormGroup;
    loading: boolean;
    editar: boolean;
    listaEstados: Parametro[];
    listaEmpresa: [];
    listaTipoEvaluacion: Parametro[];
    idDimeRies: number;
    idEstado: string;
    indicadorBaja: number = 1;

    constructor(private formBuilder: FormBuilder, private router: Router,
        private dimensionService: DimensionService, private activatedRoute: ActivatedRoute,
        private authLoginService: AuthLoginService){
        this.crearFormularios();
        this.obtenerListaEmpresas();
        this.obtenerListaTipoEvaluacion();
        this.obtenerListaEstadoParametros();
    }

    ngOnInit(): void{
        this.activatedRoute.params.subscribe(params => {
            if (params.idDimRiesgo) {
                this.idDimeRies = params.idDimRiesgo;
                this.loading = true;
            }
            if (this.activatedRoute.snapshot.url[0].toString() === 'editar' ||
                this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.editar = true;
            } else {
                this.formularioDimensionMetologia.disable();
                this.editar = false;
            }
        });
        this.loading = false;
        console.log(this.loading);
        this.cargarDimension();
    }

    obtenerListaEstadoParametros(): void {
        this.dimensionService.obtenerListaEstadoParametros().subscribe(
            resp => {
                this.listaEstados = resp.listaParametros;
            }
        );
   }

   

    private crearFormularios(): void{
        console.log('Se construyo el form');
        this.formularioDimensionMetologia = this.formBuilder.group({
            empresa:['',Validators.required],
            tipoEvaluacion:['',Validators.required],
            codigo:['',Validators.required],
            probabilidad:['',Validators.required],
            impacto:['',Validators.required],
            dimension:['',Validators.required],
            idEstado:['0']
        });
    }

    public cargarDimension(): void {
        this.activatedRoute.params.subscribe(params => {
            const idDimRiesgo = params.idDimRiesgo;
            if (idDimRiesgo) {
                this.dimensionService.obtenerDimension(idDimRiesgo).subscribe(
                    resp => {
                        console.log("El Pe "+JSON.stringify(resp));
                        this.dimensionMetodologia = resp.Dimension;
                        this.idEstado = resp.Dimension.inBaja;
                        console.log('devuelve BACK' + this.dimensionMetodologia.idDimRiesgo);

                        this.formularioDimensionMetologia.get('empresa').setValue(this.dimensionMetodologia.idEmpresa);
                        this.formularioDimensionMetologia.get('tipoEvaluacion').setValue(this.dimensionMetodologia.idTipoControlRiesgo);
                        // this.formularioPeriodo.get('dateFechaInicio').setValue("13/07/2021");
                        this.formularioDimensionMetologia.get('codigo').setValue(this.dimensionMetodologia.nuDimRiesgo);
                        // this.formularioPeriodo.get('dateFechaFin').setValue("14/07/2021");
                        this.formularioDimensionMetologia.get('probabilidad').setValue(this.dimensionMetodologia.nuProbabilidad);
                        this.formularioDimensionMetologia.get('impacto').setValue(this.dimensionMetodologia.nuImpacto);
                        this.formularioDimensionMetologia.get('dimension').setValue(this.dimensionMetodologia.deDimension);

                        // this.identificadorAnio =this.periodo.anio.toString();
                        // this.fechaInicioPeriodo = this.periodo.feIni;
                        // this.fechaFinPeriodo = this.periodo.feFin;

                        console.log(resp);
                        this.loading = false;
                        console.log(this.loading);
                    }
                );
            }
        });
    }
    
    public registrarDimension(): void {
        // if (this.formularioDimensionMetologia.invalid) {
        //     return Object.values(this.formularioPeriodo.controls).forEach(control => {
        //         control.markAsTouched();
        //     });
        // }

        const periodoBody: DimensionMetodologia = {
            idEmpresa: this.formularioDimensionMetologia.get('empresa').value,
            idTipoControlRiesgo: this.formularioDimensionMetologia.get('tipoEvaluacion').value,
            nuDimRiesgo: this.formularioDimensionMetologia.get('codigo').value,
            nuProbabilidad: this.formularioDimensionMetologia.get('probabilidad').value,
            nuImpacto: this.formularioDimensionMetologia.get('impacto').value,
            deDimension: this.formularioDimensionMetologia.get('dimension').value
        };

        console.log(periodoBody);
        console.log("------ DimensionMetodologia ------");
        Swal.fire({
            title: '¿Está seguro de crear la escala de nivel de riesgo?',
            showCancelButton: true,
            confirmButtonText: `Crear`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos creando la escala de nivel de riesgo',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.dimensionService.registrarNuevaDimension(periodoBody).subscribe(
                    resp => {
                        debugger; 
                        console.log(resp);
                        if (resp.idDimRiesgo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Creación exitosa!', resp.mensaje, 'success');
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

    public actualizarDimension(): void {

        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        const usuarioModificacion = datosToken.data.username;

        const periodoBodyActualizado: DimensionMetodologia = {
            
            idDimRiesgo: this.idDimeRies,
            idEmpresa: this.formularioDimensionMetologia.get('empresa').value,
            idTipoControlRiesgo: this.formularioDimensionMetologia.get('tipoEvaluacion').value,
            nuDimRiesgo: this.formularioDimensionMetologia.get('codigo').value,
            nuProbabilidad: this.formularioDimensionMetologia.get('probabilidad').value,
            nuImpacto: this.formularioDimensionMetologia.get('impacto').value,
            deDimension: this.formularioDimensionMetologia.get('dimension').value,
            inBaja:this.idEstado,
            idUsuaModi: usuarioModificacion, //'USER1',
            deUsuaModiIp: '192.168.1.1'
        };
        console.log('Actualizar response : ', periodoBodyActualizado);

        Swal.fire({
            title: '¿Está seguro de actualizar la escala de nivel de riesgo?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando la escala de nivel de riesgo',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                // debugger;
                this.dimensionService.actualizarDimension(periodoBodyActualizado).subscribe(
                    resp => {
                        if (resp.idDimRiesgo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
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

    onChangeEstado(deviceValue): void {
         this.idEstado = deviceValue.target.value;
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
  

    get codigoNoValido(): boolean {
        return this.formularioDimensionMetologia.get('codigo').invalid && this.formularioDimensionMetologia.get('codigo').touched;
    }

    get probabilidadNoValido(): boolean {
        return this.formularioDimensionMetologia.get('probabilidad').invalid && this.formularioDimensionMetologia.get('probabilidad').touched;
    }

    get impactoNoValido(): boolean {
        return this.formularioDimensionMetologia.get('impacto').invalid && this.formularioDimensionMetologia.get('impacto').touched;
    }

    get dimensionNoValido(): boolean {
        return this.formularioDimensionMetologia.get('dimension').invalid && this.formularioDimensionMetologia.get('dimension').touched;
    }

}