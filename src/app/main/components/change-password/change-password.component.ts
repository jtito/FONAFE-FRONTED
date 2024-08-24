import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ContraseniaService } from "src/app/main/pages/apps/contrasenia/contrasenia.service";
import { Responsable } from "src/app/shared/models/responsable";
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  idUser : number;
  pwTkn : string;
  contraseniaActual: string;
  formularioContrasenia: FormGroup;
  public loading = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private contraseniaService: ContraseniaService
  ) { this.crearFormulario(); }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idUser = params['id'];
      console.log(this.idUser);
      this.pwTkn = params['pwTkn'];
      console.log(this.pwTkn);
      //if (this.idUser) {
        //this.formularioContrasenia.patchValue({ contraseniaActual: this.idUser });
      //}
    });
  }

  private crearFormulario(): void {
    this.formularioContrasenia = this.formBuilder.group({
      contraseniaActual: ['', [Validators.minLength(8)]],//Validators.required,
      nuevaContrasenia: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmContrasenia: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }
  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const nuevaContrasenia = group.get('nuevaContrasenia')?.value;
    const confirmContrasenia = group.get('confirmContrasenia')?.value;
    console.log(nuevaContrasenia);
    console.log(confirmContrasenia);
    return nuevaContrasenia == confirmContrasenia ? null : { passwordMismatch: true };
  }

  actualizarContrasenia(): void {

    /*  if (this.formularioContrasenia.invalid) {
         return Object.values(this.formularioContrasenia.controls).forEach(control => {
             control.markAsTouched();
         });
     } */

     const nuevaContrasenia = this.formularioContrasenia.get("nuevaContrasenia").value;
     const confirmContrasenia = this.formularioContrasenia.get("confirmContrasenia").value;

     if (nuevaContrasenia != confirmContrasenia) {
         Swal.fire('Ocurrió un error', "La confirmación de contraseña no coincide con la nueva contraseña", 'error');

     } else {

         Swal.fire({
             title: '¿Está seguro de cambiar la contraseña?',
             showCancelButton: true,
             confirmButtonText: `Guardar`,
             cancelButtonText: `Cancelar`,
             allowOutsideClick: () => !Swal.isLoading(),
             allowEscapeKey: () => !Swal.isLoading()
         }).then((result) => {
             if (result.isConfirmed) {
                 Swal.fire({
                     title: 'Espere por favor',
                     html: 'Guardando la contraseña',
                     allowOutsideClick: () => !Swal.isLoading(),
                     allowEscapeKey: () => !Swal.isLoading()
                 });
                 Swal.showLoading();

                 const contraseniaActual = this.formularioContrasenia.get("contraseniaActual").value;
                 const idUsuario = this.idUser;
                 const contraseniaEncript =this.pwTkn; //this.payload.data.password;

                 const responsableCambioPass: Responsable = {
                     idUsuario: idUsuario,
                     password: contraseniaEncript,
                     actPassword: contraseniaActual,
                     newPassword: nuevaContrasenia
                 };
                 console.log(JSON.stringify(responsableCambioPass, null, 2));
                 this.contraseniaService.actualizarContrasenia(responsableCambioPass).subscribe(
                     resp => {
                         if (resp.codigo == 1) {
                             Swal.fire({
                                 title: "¡Cambio exitoso!",
                                 icon: "success",
                                 text: "La contraseña se cambio con éxito"
                             }).then(okay => {
                                 if (okay) {
                                     //this.router.navigate(['/pages', 'main', 'menu']);
                                     //this.authLoginService.cerrarSesion();
                                     this.router.navigate(['pages', 'auth', 'login']);
                                 }
                             });

                         }
                         else if (resp.codigo == 2) {

                             if (Swal.isLoading()) {
                                 Swal.close();
                                 Swal.fire('Ocurrió un error', 'La contraseña actual no es válida', 'error');
                             }

                         }
                         else {

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


 }

 /* get contraseniaActualNoValido(): boolean {
        return this.formularioContrasenia.get('contraseniaActual').invalid && this.formularioContrasenia.get('contraseniaActual').touched;
    } */

        get nuevaContraseniaNoValido(): boolean {
          return this.formularioContrasenia.get('nuevaContrasenia').invalid && this.formularioContrasenia.get('nuevaContrasenia').touched;
      }
  
      get confirmContraseniaNoValido(): boolean {
          return this.formularioContrasenia.get('confirmContrasenia').invalid && this.formularioContrasenia.get('confirmContrasenia').touched;
      }

}
