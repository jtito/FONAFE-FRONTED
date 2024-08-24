import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { MATRIZ_OPERACIONAL } from 'src/app/shared/Constantes'
import * as zingchart from 'zingchart';
@Component({
  selector: 'app-bargraf',
  templateUrl: './bargraf.component.html',
  styleUrls: ['./bargraf.component.scss']
})

export class BarGrafComponent implements OnInit {    
 
  
    @ViewChild('chart2', {static: false}) chart2: any;
    value = 0;
    plotindex = 0;
    nodeindex = 0;
    @Input() idMatriz: number;
    @Input() idPeriodo: number;
    @Input() idEmpresa: number;
    render:boolean=false;
    ocultar:boolean=true;   
    
    config2:zingchart.graphset =  {
      type: 'hbar',
        plotarea: {        
        },
        scaleY: {
          values: '0:150:50',
          guide: {
            lineStyle: 'black',
            lineGapSize: 10
          },
          lineColor: 'none',
          tick: {
            visible: false
          },
          item: {
            color: '#b8beca',
            //fontWeight: 600, 
            paddingRight: 20,
          }
        },
        tooltip: {
          visible: false,
        },
        scaleX: {
          labels: [ 'GL','GDC','GPC','GSC','OGR']
        },
        
        backgroundColor: '#fff',
        plot: {
          'value-box': {
            text: '%v',
            placement: 'middle',
            //backgroundColor: '#fff',
            fontColor: 'black'
            //shadow : true
          },
          stacked: true,      
          barWidth: 22
        },
        
        series: [{
         "values":[39, 21, 29, 148, 44],"backgroundColor":"#26A235"}, {"values":[4,5,3,7,6],"backgroundColor":"#F4F807"},{"values":[3, 5, 4, 9, 2],"backgroundColor":"#F8AB07"},{"values":[3, 3, 5, 5, 4],"backgroundColor":"#ff0000"}]
      };   
    
  constructor(private router: Router, public componentsService:ComponentsService) {
    
         
  }    
    
    
  ngOnInit(): void {
       
    //this.btnObjSistema;
}

ngOnChanges(changes) {

  if(changes.idEmpresa){

    this.idPeriodo=changes.idEmpresa.currentValue;
    this.obtenerGraphKri();
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }
  if(changes.idPeriodo){

    this.idPeriodo=changes.idPeriodo.currentValue;
    this.obtenerGraphKri();
    this.obtenerGraphInhe();
    this.obtenerGraphGer();
  }

  // changes.prop contains the old and the new value...
}

getConfig() {
  return (this.config2) ? JSON.stringify(this.config2): '' ;  //|| (this.config3) ? JSON.stringify(this.config3): '' || (this.config4) ? JSON.stringify(this.config4): ''
 }

 obtenerGraphGer(){
  return this.componentsService.obtenerGraphGer(this.idEmpresa, this.idPeriodo,0).subscribe(resp => {
      
 
  });
}

obtenerGraphInhe(){
  this.render=false;
  return this.componentsService.obtenerGraphInhe(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {
      this.convertToGraphSet(resp.listaDetalleGrafico);
  });
}


obtenerGraphKri(){
  return this.componentsService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,0,this.idMatriz).subscribe(resp => {
      
 
  });
}

convertToGraphSet(detalleGrafico:DetalleGrafico[]){
  /*this.config2.series=[];
  const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
 
  detalleGrafico.forEach((detalle) => {
    let color = "#"+genRanHex(6);

    let val={ values: [detalle.cant],"backgroundColor":color, "legend-text":detalle.des, "text":detalle.nom };
    this.config2.series.push(val);
  });*/
  this.render=true;
  
}

}
