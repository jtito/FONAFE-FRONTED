import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { MATRIZ_FRAUDE, MATRIZ_OPORTUNIDAD } from 'src/app/shared/Constantes'
import * as zingchart from 'zingchart';
@Component({
  selector: 'app-piegrafoportunidad',
  templateUrl: './piegrafoportunidad.component.html',
  styleUrls: ['./piegrafoportunidad.component.scss']
})

export class PieGrafOportunidadComponent implements OnInit {

    @ViewChild('chart5', {static: false}) chart5: any;
    value = 0;
    plotindex = 0;
    nodeindex = 0;
    @Input() idMatriz: number;
    @Input() idPeriodo: number;
    @Input() idEmpresa: number;
    idMatrizF : number=MATRIZ_OPORTUNIDAD;
    render:boolean=false;
    config5:zingchart.graphset =  {
      "type": "ring",
      "plot": {
        "tooltip": {
          //"text": "Ages %t: %v",
          "font-color": "black",
          "background-color": "white",
          "border-width": 1,
          "border-color": "gray",
          "border-radius": "solid 3px white",
          'margin-top': "0 0 50",
          "text-alpha": 1,
          "alpha": 0.7,
        },
        "value-box": {
          "visible": false
        },
        "alpha": 0.8,
        "shadow": false,
        "border-width": 1,
      },
      "legend": {
        'border-width': 0,
        ///'border-color': "white",
        'border-radius': "0px",
        'margin': "45 425 200",
        //'line-style': "dashdot",
        header: {

        },
      },
  "series": []
};


  constructor(private router: Router,public componentsService:ComponentsService) {
    this.generateDataset();
    //this.setDataset('January');
  }

  ngOnInit(): void {

    //this.btnObjSistema;
}
ngOnChanges(changes) {

  if(changes.idEmpresa){

    this.idPeriodo=changes.idEmpresa.currentValue;
   // this.obtenerGraphKri();
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }
  if(changes.idPeriodo){

    this.idPeriodo=changes.idPeriodo.currentValue;
    //this.obtenerGraphKri();
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }


  // changes.prop contains the old and the new value...
}

getConfig() {
  return (this.config5) ? JSON.stringify(this.config5) : '';
}

generateDataset() {

  function generateValues(num) {
    const max = 30;
    const min = 0;
    const dataset = [];
    for(let j = 0; j < 4; j++) {
      const values = [];
      for(let i = 0; i < num; i++){
        //values.push( parseInt((Math.random() * max - min) + min) );
      }
      dataset.push(values);
    }
    return dataset;
  }
}

obtenerGraphGer(){
  return this.componentsService.obtenerGraphGer(this.idEmpresa, this.idPeriodo,0).subscribe(resp => {


  });
}

obtenerGraphInhe(){
  this.render=false;
  return this.componentsService.obtenerGraphInhe(this.idEmpresa, this.idPeriodo,0,this.idMatrizF).subscribe(resp => {

       if (resp.listaDetalleGrafico.length > 0){

        this.convertToGraphSet(resp.listaDetalleGrafico);

      }
 });
 }


/*obtenerGraphKri(){
  return this.componentsService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,0).subscribe(resp => {


  });
}*/

convertToGraphSet(detalleGrafico:DetalleGrafico[]){
  this.config5.series=[];

  detalleGrafico.forEach((detalle) => {
    //let color = "rgb(50, 206, 63)";

    let val={ values: [detalle.cant],"backgroundColor":detalle.color, "text":detalle.nom +" \n "+detalle.cant};
    console.log("Data Evento " + val);
    this.config5.series.push(val);
  });
  this.render=true;
}

}

