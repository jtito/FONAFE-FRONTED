import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { MATRIZ_EVENTO } from 'src/app/shared/Constantes'
import * as zingchart from 'zingchart';
@Component({
  selector: 'app-piegrafevento',
  templateUrl: './piegrafevento.component.html',
  styleUrls: ['./piegrafevento.component.scss']
})

export class PieGrafEventoComponent implements OnInit {

    @ViewChild('chart5', {static: false}) chart5: any;
    value = 0;
    plotindex = 0;
    nodeindex = 0;
    @Input() idMatriz: number;
    @Input() idPeriodo: number;
    @Input() idEmpresa: number;
    idMatrizF : number=MATRIZ_EVENTO;
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
        'margin': "45 475 200",
        //'line-style': "dashdot",
        header: {

        },
      },
    series: []
};


  constructor(private router: Router,public componentsService:ComponentsService) {
    //this.setDataset('January');
  }

  ngOnInit(): void {

    //this.btnObjSistema;
}
ngOnChanges(changes) {

  if(changes.idEmpresa){

    this.idPeriodo=changes.idEmpresa.currentValue;
   // this.obtenerGraphKri();
 //   this.obtenerGraphInhe();
 ///   this.obtenerGraphGer();
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


obtenerGraphGer(){
  return this.componentsService.obtenerGraphGer(this.idEmpresa, this.idPeriodo,0).subscribe(resp => {

  });
}

obtenerGraphInhe(){
  this.render=false;

    return this.componentsService.obtenerGraphEvento(this.idEmpresa,this.idPeriodo).subscribe(resp => {

      if (resp.listaGraficoCump.length > 0){

        this.convertToGraphSet(resp.listaGraficoCump);

     }
 });
 }

convertToGraphSet(detalleGrafico:DetalleGrafico[]){
  this.config5.series=[];

  detalleGrafico.forEach((detalle) => {

      let val={ values: [detalle.cant],"backgroundColor":detalle.color, "text":detalle.nom +" \n "+detalle.cant};

      this.config5.series.push(val);
      //val = null;
  });
  this.render=true;
}

}

