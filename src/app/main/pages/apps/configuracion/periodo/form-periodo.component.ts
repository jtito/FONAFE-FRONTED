import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Periodo} from '../../../../../shared/models/periodo';
import Swal from 'sweetalert2';
import {PeriodoService} from './periodo.service';
import {Parametro} from '../../../../../shared/models/parametro';
import { DataLogin } from 'src/app/shared/models/data';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';
import { TipoPerfil } from 'src/app/shared/models/tipoPerfil';

@Component({
    selector: 'app-conf-registrar-periodo',
    templateUrl: 'form-periodo.periodo.html'
})

export class FormPeriodoComponent implements OnInit {

    formularioPeriodo: FormGroup;
    periodo: Periodo;
    listaEstados: Parametro[];
    loading: boolean;
    timeValue: string;
    listaAnios = [];
    listaFrecuencias = [];
    identificadorAnio = '';
    fechaInicioPeriodo: string;
    fechaFinPeriodo: string;
    editar: boolean;
    listaPeriodosParametro: Parametro[];
    tipoPeriodo: string;
    ideAnio: number;
    idPeriodoModificar: number;
    Estado: boolean;
    idEstado: string;
    listaEmpresa: [];
    fechaIniVal: Date;
    indicadorBaja: number = 1;
    idEmpresa: number;
    anio: number;
    idFrecuencia: number;
    idPerfil:number;
    payload: DataLogin;
    usuarioModificacion: string;
    
    constructor(private authLoginService: AuthLoginService,private formBuilder: FormBuilder, private router: Router,
                private periodoService: PeriodoService, private activatedRoute: ActivatedRoute) {
    // constructor(private formBuilder: FormBuilder) {
        // this.ideAnio = 0;
    
        // this.Estado=false;
        this.crearFormularios();
        this.obtenerListaEmpresas();
        this.obtenerListaAnios();
        this.obtenerListaEstadoParametros();
        this.obtenerListaFrecuencia();
        this.solverPermissions();
        // this.obtenerListaPeriodosParametro();
       
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params.idPeriodo) {
                this.idPeriodoModificar = params.idPeriodo;
                this.loading = true;
            }
            if (this.activatedRoute.snapshot.url[0].toString() === 'editar' ||
                this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
                this.editar = true;
            } else {
                this.formularioPeriodo.disable();
                this.editar = false;
            }

            
            const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
            this.usuarioModificacion = datosToken.data.username;

        });
        
        console.log(this.loading);
        this.cargarPeriodo();


    }

    solverPermissions(){
        this.payload = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
        this.idPerfil = this.payload.data.idPerfil;
        if(this.idPerfil==TipoPerfil.admin){
            
        }
        else{
            this.formularioPeriodo.get('empresa').setValue(this.payload.data.datosEmpresa.idEmpresa);
            this.formularioPeriodo.get('empresa').disable();
            this.idEmpresa = this.payload.data.datosEmpresa.idEmpresa;
            
        }
    }

    obtenerListaAnios(): void {
        
        this.periodoService.obtenerListaAnios().subscribe(
            resp => {
                this.listaAnios = resp.listaParametros;
            }
        );
    }

    obtenerListaFrecuencia(): void {
        
        this.periodoService.obtenerListaFrecuencias().subscribe(
            resp => {
                this.listaFrecuencias = resp.listaParametros;
            }
        );
    }
    
    obtenerListaEstadoParametros(): void {
         this.periodoService.obtenerListaEstadoParametros().subscribe(
             resp => {
                 this.listaEstados = resp.listaParametros;
             }
         );
    }

    obtenerListaPeriodosParametro(): void {
        // this.periodoService.obtenerListaPeriodosParametro().subscribe(
        //     resp => {
        //         this.listaPeriodosParametro = resp.listaParametros;
        //     }
        // );
    }

    onChangeEmpresa(deviceValue): void {
        
        this.idEmpresa = deviceValue.target.value;

    }

    onChangeAnio(deviceValue): void {
        
        this.anio = deviceValue.target.value;
    }

    onChangeFrecuencia(deviceValue): void {
        
        this.idFrecuencia = deviceValue.target.value;

        this.periodoService.obtenerDescripcionPeriodo(this.idEmpresa, this.anio, this.idFrecuencia).subscribe(
            resp => {

                this.formularioPeriodo.get('nombrePeriodo').setValue(resp.periodo);
            }
        );

        
    }

    onChangeEstado(deviceValue): void {
         this.idEstado = deviceValue.target.value;
    }

    cargarPeriodo(): void {
        this.activatedRoute.params.subscribe(params => {
            const idPeriodo = params.idPeriodo;
            if (idPeriodo) {
                this.periodoService.obtenerPeriodo(idPeriodo).subscribe(
                    resp => {
                        console.log("El Pe "+JSON.stringify(resp));
                        this.periodo = resp.Periodo;
                        this.idEstado = this.periodo.inBaja;
                        this.idEmpresa = this.periodo.idEmpresa;
                        this.anio = this.periodo.anio;
                        this.idFrecuencia = this.periodo.idFrecuencia;

                        this.formularioPeriodo.get('empresa').setValue(this.periodo.idEmpresa);
                        this.formularioPeriodo.get('dateFechaInicio').setValue(this.periodo.feIni);
                        // this.formularioPeriodo.get('dateFechaInicio').setValue("13/07/2021");
                        this.formularioPeriodo.get('dateFechaFin').setValue(this.periodo.feFin);
                        // this.formularioPeriodo.get('dateFechaFin').setValue("14/07/2021");
                        this.formularioPeriodo.get('identificadorAnio').setValue(this.periodo.anio);
                        this.formularioPeriodo.get('nombrePeriodo').setValue(this.periodo.dePeriodo);
                        this.formularioPeriodo.get('frecuencia').setValue(this.periodo.idFrecuencia);

                        this.identificadorAnio =this.periodo.anio.toString();
                        this.fechaInicioPeriodo = this.periodo.feIni;
                        this.fechaFinPeriodo = this.periodo.feFin;

                        if (this.periodo != null && this.editar == true && this.periodo.inBaja == '0'){
                            this.formularioPeriodo.get('empresa').disable();
                            this.formularioPeriodo.get('identificadorAnio').disable();
                            this.formularioPeriodo.get('frecuencia').disable();
                        }

                        console.log("RESP JSON CARGA"+JSON.stringify(resp));
                        this.loading = false;
                        console.log(this.loading);
                    }
                );
            }
        });
    }

    private crearFormularios(): void {
        console.log('Se construyo el form');

        this.formularioPeriodo = this.formBuilder.group({
            empresa:['',Validators.required],
            nombrePeriodo:['', [Validators.required, Validators.maxLength(50)]],
            dateFechaInicio: ['', Validators.required],
            dateFechaFin: ['', Validators.required],
            frecuencia: ['', Validators.required],
            identificadorAnio: ['', Validators.required],
            idEstado: ['0']
        });
    }

    onSelectMethodFechaIni(event): void {
        let d = new Date(Date.parse(event));
        this.fechaIniVal = new Date(event);
        this.fechaInicioPeriodo = ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        console.log(this.fechaInicioPeriodo);
    }

    onSelectMethodFechaFin(event): void {
        let d = new Date(Date.parse(event));

        if(new Date(event) < this.fechaIniVal){
            Swal.fire("Debe seleccionar una fecha posterior al inicial");
            this.formularioPeriodo.get('dateFechaFin').setValue('');
        }else{
            this.fechaFinPeriodo = ` ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            console.log(this.fechaFinPeriodo);
        }
        
    }


    public registrarPeriodo(): void {
        if (this.formularioPeriodo.invalid) {
            return Object.values(this.formularioPeriodo.controls).forEach(control => {
                control.markAsTouched();
            });
        }

        const periodoBody: Periodo = {
            idEmpresa: this.formularioPeriodo.get('empresa').value,
            dePeriodo: this.formularioPeriodo.get('nombrePeriodo').value,
            anio: this.formularioPeriodo.get('identificadorAnio').value,
            idFrecuencia: this.formularioPeriodo.get('frecuencia').value,
            feIni: this.fechaInicioPeriodo,
            feFin: this.fechaFinPeriodo,
            inBaja: '1'
        };
        
        Swal.fire({
            title: '¿Está seguro de crear el periodo?',
            showCancelButton: true,
            confirmButtonText: `Crear`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos creando el periodo',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.periodoService.registrarNuevoPeriodo(periodoBody).subscribe(
                    resp => {
                        
                        if (resp.idPeriodo !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Creación exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'periodo']);
                        } else {
                            if (Swal.isLoading()) {
                                Swal.close();
                                Swal.fire('Ocurrió un error', resp.descripcionResultado, 'error');
                            }
                        }
                    }
                );
            }
        });
    }

    public actualizarPeriodo(idPeriodoEliminar: number): void {
        console.log("actualizarPeriodo"+this.idEstado);
        if (this.formularioPeriodo.invalid) {
            return Object.values(this.formularioPeriodo.controls).forEach(control => {
                control.markAsTouched();
            });
        }
        
        const periodoBodyActualizado: Periodo = {
            idEmpresa: this.formularioPeriodo.get('empresa').value,
            idPeriodo: this.idPeriodoModificar,
            dePeriodo: this.formularioPeriodo.get('nombrePeriodo').value,
            anio: this.formularioPeriodo.get('identificadorAnio').value,
            idFrecuencia: this.formularioPeriodo.get('frecuencia').value,
            feFin: this.fechaFinPeriodo,
            feIni: this.fechaInicioPeriodo,
            inBaja:this.idEstado,
            idUsuaModi: this.usuarioModificacion, //'USER1',
            deUsuaModiIp: '192.168.1.1'
        };

        console.log('Actualizar response : ', periodoBodyActualizado);

        Swal.fire({
            title: '¿Está seguro de actualizar el periodo?',
            showCancelButton: true,
            confirmButtonText: `Actualizar`,
            cancelButtonText: `Cancelar`,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    html: 'Estamos actualizando el periodo',
                    allowOutsideClick: () => !Swal.isLoading(),
                    allowEscapeKey: () => !Swal.isLoading()
                });
                Swal.showLoading();
                this.periodoService.actualizarPeriodo(periodoBodyActualizado).subscribe(
                    resp => {
                        console.log(resp);
                        if (resp.codigoResultado !== 0) {
                            if (Swal.isLoading()) {
                                Swal.close();
                            }
                            Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
                            this.router.navigate(['/pages', 'main', 'configuracion', 'periodo']);
                        } else {
                            if (Swal.isLoading()) {
                                Swal.close();
                                Swal.fire('Ocurrió un error', resp.descripcionResultado, 'error');
                            }
                        }
                    }
                );
            }
        });
    }

    obtenerListaEmpresas(): void {
        this.periodoService.obtenerListaEmpresas().subscribe(
            resp => {
                this.listaEmpresa = resp.listaEmpresas.filter(empresa =>
                    empresa.indicadorBaja == this.indicadorBaja    
                );
                console.log('lista de empresas : ' + resp.listaEmpresas);
            }
        );
    }

    get AnioNoValido(): boolean {
        return this.formularioPeriodo.get('identificadorAnio').invalid && this.formularioPeriodo.get('identificadorAnio').touched;
    }

    get nombrePeriodoNoValido(): boolean {
        return this.formularioPeriodo.get('nombrePeriodo').invalid && this.formularioPeriodo.get('nombrePeriodo').touched;
    }

    get empresaNoValido(): boolean {
        return this.formularioPeriodo.get('empresa').invalid && this.formularioPeriodo.get('empresa').touched;
    }

    get FrecuenciaNoValido(): boolean {
        return this.formularioPeriodo.get('frecuencia').invalid && this.formularioPeriodo.get('frecuencia').touched;
    }

    get dateFechaInicioNoValido(): boolean {
        return this.formularioPeriodo.get('dateFechaInicio').invalid && this.formularioPeriodo.get('dateFechaInicio').touched;
    }

    get dateFechaFinNoValido(): boolean {
        return this.formularioPeriodo.get('dateFechaFin').invalid && this.formularioPeriodo.get('dateFechaFin').touched;
    }

}
