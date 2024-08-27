import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-riesgo',
  templateUrl: './create-riesgo.component.html',
  styleUrls: ['./create-riesgo.component.scss']
})

export class CreateRiesgoComponent implements OnInit {
    matrizForm: FormGroup;
    matrizData: any[] = [];
    editIndex: boolean[] = [];

    constructor(private fb: FormBuilder) {
      this.matrizForm = this.fb.group({
        tipoMatriz: [''],
        areaGerencia: [''],
        proceso: [''],
        codigoRiesgo: [''],
        atributosRiesgo: [''],
        causa: [''],
        consecuencia: [''],
        descripcionRiesgo: [''],
        origen: [''],
        agente: [''],
        frecuencia: [''],
        tipo: [''],
        subtipo: [''],
        adicional: ['']
      });
    }

    ngOnInit(): void {}

    onSubmit(): void {
      if (this.matrizForm.valid) {
        this.matrizData.push(this.matrizForm.value);
        this.editIndex.push(false); // Añadir control de edición
        this.matrizForm.reset();
      }
    }

    editarFila(index: number): void {
      this.editIndex[index] = true; // Activa la edición de esa fila
    }

    guardarFila(index: number): void {
      this.editIndex[index] = false; // Desactiva la edición y guarda los cambios
    }

    eliminarFila(index: number): void {
      this.matrizData.splice(index, 1);
      this.editIndex.splice(index, 1); // Asegura eliminar también el control de edición
    }
  }

