import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { summaryFileName } from '@angular/compiler/src/aot/util';
import * as zingchart from 'zingchart';
@Component({
  selector: 'app-piegraf',
  templateUrl: './piegraf.component.html',
  styleUrls: ['./piegraf.component.scss']
})

export class PieGrafComponent implements OnInit {

  @ViewChild('chart1', {static: false}) chart1: any;
  title = 'zing-app';
  value = 0;
  plotindex = 0;
  nodeindex = 0;
  @Input() idMatriz: number;
  @Input() idPeriodo: number;
  @Input() idEmpresa: number;
  @Input() idTipoMatriz : number;
  //months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  dataset = [];
  render:boolean=false;
  total : number;
  config:zingchart.graphset =  {
        type: 'ring',
        
             
        plotarea: {
          "margin-right": "10%",
          "margin-top": "5%",
          "marginBottom": "45px",
        },
        plot: {
          "value-box": {
            "font-size": "15",
            "font-weight": "normal",         
            "text": "Riesgos <br>Totales: <br> %stack-total",
             "placement": "center",
            "font-color": "black",      
            "font-family": "Georgia"         
          } ,
          "tooltip": {
            "text": "%t",
            "font-color": "black",
            "font-family": "Georgia",
            "text-alpha": 1,
            "background-color": "white",
            "alpha": 0.7,
            "border-width": 1,
            "border-color": "#cccccc",          
            "border-radius": "10px",
            "padding": "10%",
            "placement": "node:center"
          },             
        },        
        
      series : [],
      "legend": {
        "layout": "1x4",
        'border-width': 0,     
        ///'border-color': "white",            
        'border-radius': "0px",
        //'line-style': "dashdot",
        
        "y": "85%",
        header: {         
        
        },
      },
    };


    @ViewChild('chart5', {static: false}) chart5: any;
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
        'margin': "60 350 200",
        //'line-style': "dashdot",
        header: {         
        
        },
      },
  "series": [
    {
      "values": [3],
      "background-color": "red", "legend-text":"Alto"
     
    },  
    {
      "values": [30],
      "background-color": "rgb(50, 206, 63)",  "legend-text":"Bajo"    
    },
    {
      "values": [15],
      "background-color": "blue" ,  "legend-text":"Moderado"   
    },
    {
      "values": [10],
      "background-color": "green  ", "legend-text":"Alto"
     
    },        
    
  ]
};


  constructor(private router: Router,public componentsService:ComponentsService) {  
    this.generateDataset();
    //this.setDataset('January');
  } 

  ngOnInit(): void {
       
    //this.btnObjSistema;
}
ngOnChanges(changes) {

  console.log("3012 CHANGESS "+JSON.stringify(changes));
  if(changes.idEmpresa){

    this.idPeriodo=changes.idEmpresa.currentValue;
    this.idTipoMatriz=changes.idEmpresa.currentValue;
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }
  if(changes.idPeriodo){

    this.idPeriodo=changes.idPeriodo.currentValue;
    this.idTipoMatriz=changes.idPeriodo.currentValue;
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }
  if(changes.idTipoMatriz){

    this.idTipoMatriz=changes.idTipoMatriz.currentValue;

    console.log("3012 CHANGES "+this.idTipoMatriz);
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }


  // changes.prop contains the old and the new value...
}

getConfig() {
  return (this.config) ? JSON.stringify(this.config) : '' || (this.config5) ? JSON.stringify(this.config5) : '';
}

generateDataset() {
  /*const dataset = this.months.map((month) => {
    return {
      month,
      values: generateValues(30)
    }
  });*/
  //this.dataset = dataset;

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
//  return this.componentsService.obtenerGraphGer(this.idEmpresa, this.idPeriodo,0).subscribe(resp => {
      
 
 // });
}

obtenerGraphInhe(){
  this.render=false;
  //console.log("Variables " + this.idEmpresa + " - " + this.idPeriodo +  " - " + this.idTipoMatriz +  " - " + this.idMatriz);

  return this.componentsService.obtenerGraphInhe(this.idEmpresa, this.idPeriodo,this.idTipoMatriz,this.idMatriz).subscribe(resp => {
      this.convertToGraphSet(resp.listaDetalleGrafico);
    
  });
}

convertToGraphSet(detalleGrafico:DetalleGrafico[]){
  this.config.series=[];
  
  detalleGrafico.forEach((detalle) => {
    
    let val={ values: [detalle.cant],"backgroundColor":detalle.color,  "text":detalle.nom+" \n "+detalle.cant };
    this.config.series.push(val);
  });
  this.render=true;  
}

}

