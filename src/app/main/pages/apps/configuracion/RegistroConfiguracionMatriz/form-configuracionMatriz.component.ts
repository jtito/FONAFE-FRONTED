import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigMatrizService } from '../../configuracion/RegistroConfiguracionMatriz/configuracionMatriz.service';
import { ConfigMatriz } from "../../../../../shared/models/configMatriz";
import Swal from 'sweetalert2';
import { AuthLoginService } from '../../../authentication/auth-login/auth-login.service';



@Component({
  selector: 'app-form-configuracion-matriz',
  templateUrl: './form-configuracionMatriz.component.html',
  styleUrls: ['./configuracionMatriz.component.scss']
})
export class FormConfiguracionMatrizComponent implements OnInit {
  configuracionForm: FormGroup;
  DisplayConfigel = false;
  loading = false;
  SelectedDes = '';
  configMatriz: ConfigMatriz;
  listaNiveles: ConfigMatriz[];
  idNiveles: number = 1;
  nivel: string;
  cols: any[];
  colsSub: any[];
  editar: boolean;



  constructor(private fb: FormBuilder, private router: Router, private ConfiguracionMatrizService: ConfigMatrizService,
    private authLoginService: AuthLoginService
  ) {

  }

  ngOnInit(): void {
    this.configuracionForm = this.fb.group({
      codigo: ['', Validators.required],
      tipoMatriz: ['', Validators.required],
      proceso: ['', Validators.required],
      dimension: ['', Validators.required],
      tipoATC: ['', Validators.required],
      nivel: ['', Validators.required],
      cantidadRiesgos: ['', Validators.required],
      periodo: ['', Validators.required],
      nombreMatriz: ['', Validators.required]
    });

    this.cols = [
      { field: 'idConfigMatriz', header: 'Configuración', class: 'text-center', ordenadmiento: 'idConfigMatriz', headerClass: 'text-center' },
      { field: 'nivel', header: 'Cantidad de Niveles', class: 'text-center', ordenadmiento: 'nivel', headerClass: 'text-center' },
    ];

    this.colsSub = [
      {
        field: 'indicadorNiveles',
        header: 'Niveles',
        class: 'text-center',
        ordenadmiento: 'niveles',
        headerClass: 'text-center w-10'
      },
    ]
  }

  regresar() {
    this.router.navigate(['/apps/configuracion/configuracionMatriz']);
  }

  onSubmit() {
    if (this.configuracionForm.valid) {
    }
  }

  public registrarConfigMatriz(): void {
    if (this.configuracionForm.invalid) {
      return Object.values(this.configuracionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    const configBody: ConfigMatriz = {
      coConfigMatriz: this.configuracionForm.get('coConfigMatriz').value,
      usuarioCreacion: this.configuracionForm.get('usuarioCreacion').value
    };

    Swal.fire({
      title: '¿Estás seguro de crear la configuración?',
      showCancelButton: true,
      confirmButtonText: `Guardar`,
      cancelButtonText: `Cancelar`,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Espere por favor',
          html: 'Estamos creando la configuración',
          allowOutsideClick: () => !Swal.isLoading(),
          allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();
        this.ConfiguracionMatrizService.registrarNuevaConfig(configBody).subscribe(
          respuesta => {
            console.log(respuesta);
            if (respuesta.idConfigMatriz !== 0) {
              if (Swal.isLoading()) {
                Swal.close();
              }
              Swal.fire('¡Creación exitosa!', respuesta.mensaje, 'success');
              this.router.navigate(['/pages', 'main', 'configuracion', 'configuracionMatriz']);
            }
            else {
              if (Swal.isLoading()) {
                Swal.close();
                Swal.fire('Ocurrió un error', respuesta.mensaje, 'error');
              }
            }
          }
        )
      }
    })
  }

  public actualizarConfigMatriz(): void {

    if (this.configuracionForm.invalid) {
      console.log("ES INVALIDO");
      return Object.values(this.configuracionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    const idConfigMatriz = this.configMatriz.idConfigMatriz;
    const coConfigMatriz = this.configuracionForm.get("coConfigMatriz").value;
    const nivel = this.nivel;

    const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    const usuarioModificacion = datosToken.data.username;

    var configBody: ConfigMatriz = {
      idConfigMatriz: idConfigMatriz,
      coConfigMatriz: coConfigMatriz,
      nivel: nivel,
      usuarioModificacion: usuarioModificacion,
    };

    Swal.fire({
      title: '¿Está seguro de actualizar la configuración?',
      showCancelButton: true,
      confirmButtonText: `Actualizar`,
      cancelButtonText: `Cancelar`,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Espere por favor',
          html: 'Estamos actualizando la configuración',
          allowOutsideClick: () => !Swal.isLoading(),
          allowEscapeKey: () => !Swal.isLoading()
        });
        Swal.showLoading();

        this.ConfiguracionMatrizService.actualizarConfig(configBody).subscribe(
          resp => {
            if (resp.idParametro !== 0) {
              if (Swal.isLoading()) {
                Swal.close();
              }
              Swal.fire('¡Actualización exitosa!', resp.mensaje, 'success');
              this.router.navigate(['/pages', 'main', 'configuracion', 'configuracionMatriz']);

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

  obtenerValorNivelProc(checked): void {
    this.idNiveles = checked.nivel;
  }

  public onChangeNivel(deviceValue): void {
    this.idNiveles = deviceValue.target.value;
  }

  get CoConfigMatrizNoValido(): boolean {
    return this.configuracionForm.get('coConfigMatriz')?.invalid && this.configuracionForm.get('coConfigMatriz')?.touched;
  }

}