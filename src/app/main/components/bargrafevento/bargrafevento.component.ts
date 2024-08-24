import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import * as zingchart from 'zingchart';
@Component({
  selector: 'app-bargrafevento',
  templateUrl: './bargrafevento.component.html',
  styleUrls: ['./bargrafevento.component.scss']
})

export class BarGrafEventoComponent implements OnInit {


  @ViewChild('chart4', {static: false}) chart4: any;
  value = 0;
    plotindex = 0;
    nodeindex = 0;
    @Input() idMatriz: number;
    @Input() idPeriodo: number;
    @Input() idEmpresa: number;
    render:boolean=false;
    ocultar:boolean=true;
    cantidad = [];
    labels:String[]=[];
    obj : any;

  config4:zingchart.graphset =  {

    type: 'hbar',
    plotarea: {
      adjustLayout: true

    },
    scaleY: {
      //values: '0:50:1',
      guide: {
        lineStyle: 'black',
        lineGapSize: 10,
      },
      lineColor: 'none',
      tick: {
        visible: false
      },
    },
    tooltip: {
      visible: false,
    },
    scaleX: {
      
      item: {
        fontSize: 12,
      },
      labels: []
    },

    backgroundColor: '#fff',
    plot: {
      'value-box': {
        text: '%v',
        placement: 'middle',
        //backgroundColor: '#fff',
        fontColor: 'white',
        fontSize: '17px',        
      },
      //stacked: true,
      //barSpace:0
      barWidth: 18
    },
    series: [
    {
    values:[]}
    ] //,"backgroundColor":"rgb(74, 165, 144)"
  };


  constructor(private router: Router, public componentsService:ComponentsService) {
   // this.obtenerGraphInhe();
    this.obj = {
      values: [],
      backgroundColor:"#46e327"
      }
  }


  ngOnInit(): void {

    //this.btnObjSistema;
}

ngOnChanges(changes) {

  this.obj = {
    values: [],
    backgroundColor:"#00b050"
    }

  if(changes.idEmpresa){

    //console.log("Empresa "+ changes.idEmpresa.currentValue);
    this.idPeriodo=changes.idEmpresa.currentValue;
    this.obtenerGraphInhe();
  }

  if(changes.idPeriodo){

    this.idPeriodo=changes.idPeriodo.currentValue;
    this.obtenerGraphInhe();
  }

  // changes.prop contains the old and the new value...
}

getConfig() {
  return (this.config4) ? JSON.stringify(this.config4): '' ;
 }


obtenerGraphInhe(){

  this.render=false;

  //console.log("FILTRO IDEMPRESA " + this.idEmpresa + " FILTRO IDPERIODO " + this.idPeriodo);

  return this.componentsService.obtenerGraphEvento(this.idEmpresa, this.idPeriodo).subscribe(resp => {   //1,21

    if (resp.listaGraficoEvento.length>0){

      this.convertToGraphSet(resp.listaGraficoEvento );

    }
  });
}


convertToGraphSet(detalleGrafico:DetalleGrafico[]){

let detalle:DetalleGrafico[]= detalleGrafico;
let max_scaley=Math.max.apply(Math, detalleGrafico.map(function(o) { return o.cant; }))
this.labels= detalle.map(item => item.nom).filter((value, index, self) => self.indexOf(value) === index);
 this.config4.scaleX.labels=this.labels;

  /*let obj = {
    values: [],
    backgroundColor:"#46e327"
    //text: detalle.nom
  }*/
 this.obj.values = [];
 this.config4.series=[];

  detalleGrafico.forEach((detalle) => {

    this.obj.values.push(detalle.cant);

  });
  //detalleGrafico = null;

  this.config4.series.push(this.obj);

  this.config4.scaleY.values="0:"+max_scaley+":1";
  this.render=true;
}

}
