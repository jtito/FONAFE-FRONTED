import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { ComponentsService } from '../components.service';
import { MATRIZ_OPERACIONAL } from 'src/app/shared/Constantes'
import * as zingchart from 'zingchart';
@Component({
  selector: 'app-barr',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {

    
    public data: any;
    @Input() idMatriz: number;
    @Input() idPeriodo: number;
    @Input() idEmpresa: number;
    @Input() idTipoMatriz : number;
    render:boolean=false;
    niveles:String[]=[];
    labels:String[]=[];
    altura:number = 200;
    //listaEmpresas: Empresa[];
  
    @ViewChild('chart2', {static: false}) chart2: any;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    dataset = []
    config2:zingchart.graphset =  {
      type: 'hbar',    
      width: 800,
      plotarea: {
        adjustLayout: true
     
      },
        scaleY: {
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
            paddingRight: 5,
          }
        },
        tooltip: {
          visible: false,
        },
        scaleX: {
          labels: []
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
          barWidth: 25,
          barSpace:0
        },

        series: []
      };

    
  @ViewChild('chart3', {static: false}) chart3: any;
  config3:zingchart.graphset =  {
    type: 'bar',  
    plot: {
      'value-box': {
        //Displays all data values by default.
      },
      barWidth: 20
    },
     legend: {
            "max-items": 3,
            "overflow": "scroll",
            //"align": "center",
            "margin-right": "70%",
            "margin-top": "70%",         
            layout: "1x3", //row x column
            x: "25%",
            y: "88%",
          },        
    'scale-x': {
      labels: [ "Asuntos Legales",
      "Planeamiento",
      "Servicios Compartidos",
      "Desarrollo Corporativo",
      "Gestión Integral" ]
    },
    'scale-y': {
      values: "0:40:10"
    },
    "series": [{
      "values": [
        3,
        2,
        20,
        9,
        7
      ],
      "alpha": 0.95,
     // "borderRadiusTopLeft": 7,
      "background-color": "teal",
      "text": "Concluido",
    },
    {
      "values": [
        5,
        4,
        5,
        1,
        2
      ],
      //"borderRadiusTopLeft": 7,
      "alpha": 0.95,
      "background-color": "orange",
      "text": "En Proceso"
    },  
    {
      "values": [
        2,
        2,
        6,
         8,
         3
      ],
      //"borderRadiusTopLeft": 7,
      "alpha": 0.95,
      "background-color": "blue",
      "text": "No Iniciado"
    },
     ]       
    };
 
  
  @ViewChild('chart4', {static: false}) chart4: any;
  config4:zingchart.graphset =  {
    type: 'hbar',     
    scaleY: {
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
    
    backgroundColor: '#fff',
    plot: {
      'value-box': {
        text: '%v',
        placement: 'middle',
        //backgroundColor: '#fff',
        fontColor: 'white'
      },
      stacked: true,      
      barWidth: 18
    },     
    series: [{
     "values":[49, 31, 39, 148, 64],"backgroundColor":"rgb(74, 165, 144)"}]
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
      this.idTipoMatriz=changes.idEmpresa.currentValue;
      this.obtenerGraphKri();
      this.obtenerGraphInhe();
      this.obtenerGraphGer();
    }
    if(changes.idPeriodo){
  
      this.idPeriodo=changes.idPeriodo.currentValue;
      this.idTipoMatriz=changes.idPeriodo.currentValue;
      this.obtenerGraphKri();
      this.obtenerGraphInhe();
      this.obtenerGraphGer();
    }
    if(changes.idTipoMatriz){

      this.idTipoMatriz=changes.idTipoMatriz.currentValue;
      this.obtenerGraphKri();
      this.obtenerGraphInhe();
      this.obtenerGraphGer();
    }
  
    // changes.prop contains the old and the new value...
  }

  obtenerGraphGer(){
    this.render=false;
    return this.componentsService.obtenerGraphGer(this.idEmpresa, this.idPeriodo,this.idTipoMatriz).subscribe(resp => {
        
      this.convertToGraphSet1(resp.listaDetalleGrafico);
    });
  }
  
  obtenerGraphInhe(){
    //this.render=false;
   // return this.componentsService.obtenerGraphInhe(0, 0,0,this.idMatriz).subscribe(resp => {
      //  this.convertToGraphSet(resp.listaDetalleGrafico);
   // });
  }
  
  
  obtenerGraphKri(){
  //  return this.componentsService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,this.idTipoMatriz,MATRIZ_OPERACIONAL).subscribe(resp => {
        
   
   // });
  }

  convertToGraphSet1(detalleGrafico:DetalleGrafico[]){


    let detalle:DetalleGrafico[]= detalleGrafico;
    
    this.niveles= detalle.map(item => item.nom).filter((value, index, self) => self.indexOf(value) === index);
    this.labels= detalle.map(item => item.des).filter((value, index, self) => self.indexOf(value) === index);
    //console.log("2712 LABELS "+JSON.stringify(this.labels))
    this.config2.series=[];
    this.config2.scaleX.labels=this.labels;
    let temp_array:number[]=[];
    let temp_color="";
    let temp_nom="";
    let temp_des="";
    let max=0;
    detalleGrafico.forEach((detalle,indice) => {

      if(indice==0){
        temp_color=detalle.color;
  
      }
      else if(indice<detalleGrafico.length-1 && indice>0){
  
        if(temp_color!=detalle.color){
          
          if(temp_array.length>max){
            max=temp_array.length;
          }
  
        }
        else{
          temp_array.push(detalle.cant);
        }
  
      }
      else{
  
        if(temp_color!=detalle.color){
          temp_color=detalle.color;
          if(temp_array.length>max){
            max=temp_array.length;
          }
          temp_array = [];
          temp_array.push(detalle.cant);
  
        }
        else{
          temp_array.push(detalle.cant);
          if(temp_array.length>max){
            max=temp_array.length;
          }
        }
  
      }
  
  
    });

    //console.log("2712 MAX "+max)

    this.niveles.forEach((nivel) => {

      let temp_array1=new Array(max);
      let temp_nom1="";
      let temp_des1="";
      let temp_color1="";
  
      this.labels.forEach((gerencia,indiceger) => {
  
  
        detalleGrafico.forEach((detalle,indice) => {
    
          if(detalle.des==gerencia && nivel==detalle.nom){
            temp_color1 = detalle.color;
            temp_array1[indiceger]=detalle.cant;
            temp_des1 = detalle.des;
            temp_nom1 = detalle.nom;
          }
    
    
        });
    
        
        if(indiceger==this.labels.length-1){
    
          
          for(let j=0;j<temp_array1.length;j++){
  
            if(temp_array1[j]>0){
  
           
            }else{
   
             // temp_array1[j]=0;
            }
  
          }
       }
    
      });
      
      let val={ values: temp_array1,"backgroundColor":temp_color1, "legend-text":temp_nom1, "text":temp_des1 };
      this.config2.series.push(val);   
    });

    //this.config2.height = this.config2.series.length*50;

    if (this.config2.scaleX.labels.length > 2){

      this.config2.height = this.config2.scaleX.labels.length*50;
      this.altura = this.config2.scaleX.labels.length*50;

    }else{
      this.config2.height = this.config2.scaleX.labels.length*90;
      this.altura = this.config2.scaleX.labels.length*90;

    }

    //console.log("2712 SERIE LONGITUD"+this.config2.scaleX.labels.length)

    this.render=true;
  }

  convertToGraphSet(detalleGrafico:DetalleGrafico[]){

    let detalle:DetalleGrafico[]= detalleGrafico;
    
    this.niveles= detalle.map(item => item.nom).filter((value, index, self) => self.indexOf(value) === index);
    this.labels= detalle.map(item => item.des).filter((value, index, self) => self.indexOf(value) === index);
    console.log("2712 LABELS "+JSON.stringify(this.labels))
    this.config2.series=[];
    this.config2.scaleX.labels=this.labels;
    let temp_array:number[]=[];
    let temp_color="";
    let temp_nom="";
    let temp_des="";

    detalleGrafico.forEach((detalle,indice) => {

      if(indice==0){
        temp_color=detalle.color;
        temp_nom=detalle.nom;
        temp_des=detalle.des;
        temp_array.push(detalle.cant);
      }
      else if(indice<detalleGrafico.length-1 && indice>0){

        if(temp_des!=detalle.des){
          
          let val={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
          this.config2.series.push(val);
          temp_color=detalle.color;
          temp_nom=detalle.nom;
          temp_des=detalle.des;
          temp_array = [];
          temp_array.push(detalle.cant);
          
        }
        else{
          temp_array.push(detalle.cant);
        }

      }
      else if(indice==detalleGrafico.length-1){

        if(temp_des!=detalle.des){

          let val={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
          this.config2.series.push(val);
          temp_color=detalle.color;
          temp_nom=detalle.nom;
          temp_des=detalle.des;
          temp_array = [];
          temp_array.push(detalle.cant);
          let val1={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
         
          this.config2.series.push(val1);
        }
        else{
          temp_array.push(detalle.cant);
          let val={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
          this.config2.series.push(val);
        }

      }

  
    });
  

    console.log("2712 SERIES BAR "+JSON.stringify(this.config2.series));
    this.render=true;
    
  }
  
    
getConfig() {
 return (this.config2) ? JSON.stringify(this.config2): '' || (this.config3) ? JSON.stringify(this.config3): '' || (this.config4) ? JSON.stringify(this.config4): '';
}
    
generateDataset() {
  const dataset = this.months.map((month) => {
    return {
      month,
      values: generateValues(30)
    }
});
  this.dataset = dataset;
    
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
     
    
}