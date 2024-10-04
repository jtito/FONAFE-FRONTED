import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-riesgo',
  templateUrl: './create-riesgo.component.html',
  styleUrls: ['./create-riesgo.component.scss']
})
export class CreateRiesgoComponent implements OnInit {

  matrizRiesgo: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.matrizRiesgo = new FormGroup({
      nombreRiesgo: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      cartera: new FormControl('', Validators.required),
      empresa: new FormControl('', Validators.required),
      sede: new FormControl('', Validators.required),
      idTipoMatriz: new FormControl('', Validators.required),
      idMatrizNivel: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required),
      causa: new FormControl('', Validators.required),
      consecuencia: new FormControl('', Validators.required),
      riesgo: new FormControl('', Validators.required),
      origen: new FormControl('', Validators.required),
      agente: new FormControl('', Validators.required),
      frecuencia: new FormControl('', Validators.required),
      sub_tipo: new FormControl('', Validators.required),
      asociarRiesgo: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.matrizRiesgo.valid) {
      console.log('Datos del formulario:', this.matrizRiesgo.value);
    } else {
      console.log('El formulario no es válido');
    }
  }
}
