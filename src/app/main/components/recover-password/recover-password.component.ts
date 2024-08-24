import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators,AbstractControl  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RecoverPasswordService } from './recover-password.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {
  email: string;
  contrasena: string;
  recontrasena: string;
  codigo: string;
  frmRecoverPWd: FormGroup;
  public loading = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private recoverPasswordService: RecoverPasswordService
  ) {
    this.crearFormulario();

  }

  ngOnInit(): void {
  
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log(token);
      if (token) {
        this.frmRecoverPWd.patchValue({ codigo: token });
      }
    });
  }
  private crearFormulario(): void {
    this.frmRecoverPWd = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      codigo: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      recontrasena: ['', Validators.required]
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
    const password = group.get('contrasena')?.value;
    const recontrasena = group.get('recontrasena')?.value;
    console.log(password);
    console.log(recontrasena);
    return password == recontrasena ? null : { passwordMismatch: true };
  }

  public recoverPassword(): void {
    if (this.frmRecoverPWd.invalid) {
      return Object.values(this.frmRecoverPWd.controls).forEach(control => {
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
    const token = this.frmRecoverPWd.value.codigo;
    const correo = this.frmRecoverPWd.value.email;
    const contrasena = this.frmRecoverPWd.value.contrasena;

    this.recoverPasswordService.reestablecerContrasenia(token, correo, contrasena).subscribe(
      resp => {
        console.log(resp.toString());

        swal.fire(
          'Exito',
          'Se restablecio la contraseña!',
          'success'
        ).then(result => {
          this.router.navigate(['pages', 'auth', 'login']);
        });

      }, error => {

        console.log(error.toString());
        this.loading = false;
        swal.fire(
          'Error',
          'Servicio no Encontrado',
          'error'
        );
      }
    );

  }



  get correoNoValido(): boolean {
    return this.frmRecoverPWd.get('email').invalid && this.frmRecoverPWd.get('email').touched;
  }

  get nuevaContraseniaNoValido(): boolean {
    return this.frmRecoverPWd.get('contrasena').invalid && this.frmRecoverPWd.get('contrasena').touched;
  }

  get recontraseniaNoValido(): boolean {
    return this.frmRecoverPWd.get('recontrasena').invalid && this.frmRecoverPWd.get('recontrasena').touched;
  }
  get codigoNoValido(): boolean {
    return this.frmRecoverPWd.get('codigo').invalid && this.frmRecoverPWd.get('codigo').touched;
  }


}
