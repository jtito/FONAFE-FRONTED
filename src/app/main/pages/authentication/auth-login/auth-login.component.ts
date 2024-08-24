import { Component, Injectable, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLoginService } from './auth-login.service';
import swal from 'sweetalert2';
import { NgxCaptchaService } from '@binssoft/ngx-captcha';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['auth-login.componente.css']
})
export class AuthLoginComponent implements OnInit, AfterViewInit {
  showForgotPassword: boolean = false;
  public formularioLogin: FormGroup;
  public loading = false;
  public errorLogin = false;
  showInfoForgotPassowrd = false;
  // @ViewChild('captcha') captcha: any;

  captchaStatus: any = false;
  captchaConfig: any = {
    type: 1, // 1 or 2 or 3 or 4
    length: 6,
    cssClass: 'custom',
    back: {
      stroke: "#2F9688",
      solid: "#f2efd2"
    },
    font: {
      color: "#000000",
      size: "35px"
    }
  };
  constructor(
    private captchaService: NgxCaptchaService,
    private router: Router, private formBuilder: FormBuilder, private authLoginService: AuthLoginService) {
    this.crearFormulario();
  }

  ngOnInit(): void {


    if (this.authLoginService.isAuthenticated()) {
      this.router.navigate(['pages', 'main', 'menu']);
    }

    this.captchaStatus = false;

    

  }
  ngAfterViewInit() {
    this.changeCaptchaButtonText();
    const isCaptchaValid = this.validarCaptcha();
    console.log(isCaptchaValid);
  }
 

  validarCaptcha(): Promise<boolean> {
    
    return new Promise((resolve, reject) => {
      this.captchaService.captchStatus.subscribe((status) => {
        this.captchaStatus = status;
        console.log('CATPCHA: ' + status)
        if (status === false) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La validación del Captcha no coincide'
          });
          resolve(false);
        } else if (status === true) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Codigo captcha valido !'
          }).then(() => {
            resolve(true);
          });
        }
      });
    });
  }
  changeCaptchaButtonText() {
    setTimeout(() => {
      const checkButton = document.querySelector('.custom input[type="button"]');
      if (checkButton) {
        checkButton.setAttribute('value', 'Verificar');
      }
    }, 100); // Delay to ensure the button is rendered
  }

  public iniciarSesion(): void {
    if (this.formularioLogin.invalid || !this.captchaStatus) { // 
      return Object.values(this.formularioLogin.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    if (!this.captchaStatus) {
      alert("Opps!\nCaptcha mismatch");
      return;
    }

    this.loading = true;
    swal.fire({
      title: 'Espere por favor...',
      text: '¡Estamos iniciando sesión!',
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    swal.showLoading();

    const usuario = this.formularioLogin.value.usuario;
    const password = this.formularioLogin.value.password;

    console.log('Iniciar sesion');
    // console.log('Usuario : ' + usuario);
    // console.log('Password : ' + password);
    this.authLoginService.iniciarSesion(usuario, password).subscribe(
      resp => {
        /* this.authLoginService.saveCurrentUser(resp); */
        this.errorLogin = false;
        //   console.log("TOKEN "+JSON.stringify(resp.access_token));
        this.authLoginService.guardarToken(resp.access_token);
        const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);

        swal.fire(
          'Bienvenido(a)',
          'Hola ' + datosToken.data.nombre + '. ¡Has iniciado sesión con éxito!',
          'success'
        ).then(result => {
          this.router.navigate(['pages', 'main', 'menu']);
        });
        
        this.captchaStatus = false;
        this.captchaService.setCaptchaStatus(null); 

      }, error => {
        this.errorLogin = true;
        this.loading = false;
        swal.fire(
          'Error',
          'Usuario o clave incorrecta',
          'error'
        );

      }
    );


  }

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
  }

  private crearFormulario(): void {
    this.formularioLogin = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarDatos: [false]
    });
  }

  get usuarioNoValido(): boolean {
    return this.formularioLogin.get('usuario').invalid && this.formularioLogin.get('usuario').touched;
  }

  get passwordNoValido(): boolean {
    return this.formularioLogin.get('password').invalid && this.formularioLogin.get('password').touched;
  }

}
