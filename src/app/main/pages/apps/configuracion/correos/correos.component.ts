import { Component, OnInit } from '@angular/core';
import { correos } from 'src/app/shared/models/correos';
@Component({
  selector: 'app-form-correos',
  templateUrl: './correos.component.html',
  styleUrls: ['./correos.component.css']
})
export class CorreosComponent implements OnInit {

  cols: any[];
  loading: boolean;
  listaCorreos: correos[];
  listaVacia: correos[];

  // constructor() { }

  ngOnInit(): void {
    this.cols = [
        {field: 'idCorreo', header: 'Id Correo', class: 'text-center idcorreo', ordenadmiento: 'idCorreo', headerClass: 'text-center'},
        {field: 'etapa', header: 'Etapa', class: 'text-center', ordenadmiento: 'etapa', headerClass: 'text-center'},
        {field: 'asunto', header: 'Asunto', class: 'text-center', ordenadmiento: 'asunto', headerClass: 'text-center'},
        // {field: '', header: 'Impacto', class: 'text-center', ordenadmiento: 'impacto', headerClass: 'text-center'},
        {field: 'estado', header: 'Estado', class: 'text-center', headerClass: 'text-center'},
    ];
    this.listaVacia = [
      {idCorreo: ''},
      {idCorreo: ''},
      {idCorreo: ''}
    ]
  }
  exportExcel(): void{

  }

}
