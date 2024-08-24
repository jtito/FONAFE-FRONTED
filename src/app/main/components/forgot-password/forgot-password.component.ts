import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from './forgot-password.service';

import swal from 'sweetalert2';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string;
  formspreeUrl = 'https://formspree.io/f/mrgnnzzg';
  formularioForgotPWd: FormGroup;
  public loading = false;
  constructor(
    private router: Router, private formBuilder: FormBuilder, private http: HttpClient, private forgotPasswordService: ForgotPasswordService) {
    this.crearFormulario();
  }
  ngOnInit(): void {
    this.email = '';

  }
  private crearFormulario(): void {
    this.formularioForgotPWd = this.formBuilder.group({
      email: ['', Validators.required]

    });
  }
  public resetPassword(): void {
    if (this.formularioForgotPWd.invalid) {
      return Object.values(this.formularioForgotPWd.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    this.loading = true;
    swal.fire({
      title: 'Espere por favor...',
      text: '¡Estamos enviando el correo!',
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    swal.showLoading();
    const correo = this.formularioForgotPWd.value.email;
    const codigo = this.generateTempPassword();
    const url = `http://localhost:4200/pages/auth/login/recoverPassword?token=${codigo}`;
    //const mensaje = 'El codigo de verificación es : ' + codigo + '<br> Ingresa al siguiente link para restablecer contraseña: ' + url;
    const mensaje = `
    <p>El código de verificación es: <strong>${codigo}</strong></p>
    <p>Por favor, haga clic en el siguiente botón para restablecer su contraseña:</p>
    <a href="${url}" style="text-decoration: none;">
        <button style="
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 12px;
        ">
            Restablecer contraseña
        </button>
    </a>
`;
    console.log(mensaje);
    const asunto = 'Notificacion FONAFE - Solicitud de cambio de contraseña';
    this.forgotPasswordService.reestablecerContrasenia(correo, mensaje, asunto).subscribe(
      resp => {
        console.log(resp.toString());

        swal.fire(
          'Exito',
          'Se envío codigo al correo ingresado !',
          'success'
        ).then(result => {
          this.router.navigate(['pages', 'auth', 'login']);
        });

      }, error => {

        console.log(error.toString());
        this.loading = false;
        /*  swal.fire(
             'Error',
             'Servicio Correo',
             'error'
         ); */
        swal.fire(
          'Exito',
          'Se envío codigo al correo ingresado !',
          'success'
        ).then(result => {
          this.router.navigate(['pages', 'auth', 'login']);
        });
      }
    );



  }

  generateTempPassword(): string {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  get correoNoValido(): boolean {
    return this.formularioForgotPWd.get('email').invalid && this.formularioForgotPWd.get('email').touched;
  }
}
