import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import * as zingchart from 'zingchart';

@Component({
  selector: 'app-bargraf2',
  templateUrl: './bargraf2.component.html',
  styleUrls: ['./bargraf2.component.scss']
})

export class BarGraf2Component implements OnInit {    
          
   @ViewChild('chart3', {static: false}) chart3: any;
   value = 0;
   plotindex = 0;
   nodeindex = 0;
   @Input() idMatriz: number;
   @Input() idPeriodo: number;
   @Input() idEmpresa: number;
   @Input() idTipoMatriz : number;
   @Input() isoperacional : boolean;
   render:boolean=false;
   ocultar:boolean=true;
   niveles:String[]=[];
   labels:String[]=[]; 

   
  /*config4:zingchart.graphset =  {
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
            "margin-right": "69%",
            "margin-top": "80%",         
            layout: "1x3", //row x column
            x: "25%",
            y: "91%",
          },        
    'scale-x': {
      labels: [ "Gerencia TI",
      "Órgano de Buen Gobierno Corporativo y Gestión Integral de Riesgos (OGR)"]
    },
    'scale-y': {
      values: "0:35:10"
    },
    "series": [{
      "values": [
        2,
        4
      ],
      "alpha": 0.95,
     // "borderRadiusTopLeft": 7,
      "background-color": "teal",
      "text": "Concluido",
    },
    {
      "values": [
        2
      ],
      //"borderRadiusTopLeft": 7,
      "alpha": 0.95,
      "background-color": "blue",
      "text": "No Iniciado"
    },
    {
      "values": [
        8,
        3
      ],
      //"borderRadiusTopLeft": 7,
      "alpha": 0.95,
      "background-color": "orange",
      "text": "En Proceso"
    },  
    
     ]       
    };*/
   

  config3:zingchart.graphset =  {
    type: 'bar',
    "scroll-x-scroll-y":{
      "bar": {
        "alpha": 0.2,
        "background-color": "#ff0080 orange",
        "border-radius": "5px",
        "height": "50px" //scroll-x only
      }
    },
    plot: {
      'value-box': {
        //Displays all data values by default.
      },
      barWidth: 20
    },
    options: {
      maxFontSize: 8,
      minFontSize: 6
    },
     legend: {
            "max-items": 3,              
            layout: "1x3", //row x column
            x: "38%",
            y: "95%",
            height: "16px"
          },       
    'scale-x': {
      item: {
        fontSize: 10
      },
      labels: []     
    },
    'scale-y': {
    },
    series: []       
    };
   
    
  constructor(private router: Router, public componentsService:ComponentsService) {
             
  }    
    
    
  ngOnInit(): void {
       
    //this.btnObjSistema;
}

ngOnChanges(changes) {

  if(changes.idEmpresa){

    this.idEmpresa=changes.idEmpresa.currentValue;
    this.obtenerGraphKri();   
  }
  if(changes.idPeriodo){

    this.render=false;
    this.idPeriodo=changes.idPeriodo.currentValue;
    if(!this.isoperacional){
      this.idTipoMatriz = 0;
    }
    this.obtenerGraphKri();  
  }
  if(changes.idTipoMatriz){
    this.render=false;
    this.idTipoMatriz=changes.idTipoMatriz.currentValue;
    this.obtenerGraphKri();   
  }
  
}

getConfig() {
  return (this.config3) ? JSON.stringify(this.config3): '' ; 
 }

 obtenerGraphGer(){
  this.render=false;
 // return this.componentsService.obtenerGraphGer(this.idEmpresa, this.idPeriodo,0).subscribe(resp => {      
    
 // });
}


obtenerGraphKri(){

  return this.componentsService.obtenerGraphKri(this.idEmpresa, this.idPeriodo,this.idTipoMatriz,this.idMatriz).subscribe(resp => {

    this.convertToGraphSet(resp.listaDetalleGrafico);
 
  });
}

convertToGraphSet(detalleGrafico:DetalleGrafico[]){
  let labelsAuxiliar = [];
  let detalle:DetalleGrafico[]= detalleGrafico;
  this.niveles= detalle.map(item => item.nom).filter((value, index, self) => self.indexOf(value) === index)
  this.labels= detalle.map(item => item.des).filter((value, index, self) => self.indexOf(value) === index)
  let nuevaEtiqueta = "";
  //console.log("labels "+  this.labels);
  for(let i of this.labels){
   
    if(i.length > 0){   

      let  cadena = i.substr(0, 23);
      let  cadena2 = i.substr(23, 50);

      /*let cuenta = 0;
      let posicion = i.indexOf(" ");
      console.log("posicion "+  posicion);
      while ( posicion != -1 ) {
        cuenta++;
        posicion = i.indexOf(" ",posicion+1);

        nuevaEtiqueta = cadena.concat('<br>');
      }*/
      
      nuevaEtiqueta = cadena.concat('<br>');

      labelsAuxiliar.push(nuevaEtiqueta + cadena2);
    }      
  }
  
  this.config3.series=[];
  this.config3['scale-x'].labels = labelsAuxiliar;
  
  let max=0;
  let temp_color="";
  let temp_array=[];

  let max_scaley=Math.max.apply(Math, detalleGrafico.map(function(o) { return o.cant; }))
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
    this.config3.series.push(val);   
  });
  

  this.config3['scale-y'].values="0:"+max_scaley+":1";

  let temp_array1=new Array(0);
  let iniciado = false;
  let proceso = false;
  let concluido = false;
  let val1;

  this.config3.series.forEach((serie) => {
    
    if (serie['legend-text'] === "No iniciado"){
        iniciado = true;
    }else if(serie['legend-text'] === "En proceso"){
        proceso = true;
    }else{
        concluido = true;
    }
  });

  if(!iniciado){
    val1={ values: temp_array1,"backgroundColor":"#3b76d4", "legend-text":"No iniciado"};
    this.config3.series.push(val1);
  }
  if(!proceso){
    val1={ values: temp_array1,"backgroundColor":"#ffc000", "legend-text":"En proceso"};
    this.config3.series.push(val1);
  }
  if(!concluido){
    val1={ values: temp_array1,"backgroundColor":"#00b050", "legend-text":"Concluido"};
    this.config3.series.push(val1);
  }

  this.config3.series.sort(function (a, b) {
    if (a['legend-text'] > b['legend-text']) {
      return 1;
    }
    if (a['legend-text'] < b['legend-text']) {
      return -1;
    }
    return 0;});
  
  this.render=true;
  
}

convertToGraphSet1(detalleGrafico:DetalleGrafico[]){


  let detalle:DetalleGrafico[]= detalleGrafico;
  this.niveles= detalle.map(item => item.nom).filter((value, index, self) => self.indexOf(value) === index)
  this.labels= detalle.map(item => item.des).filter((value, index, self) => self.indexOf(value) === index)
  this.config3.series=[];
  //console.log("LABELS "+JSON.stringify(this.labels));
  this.config3['scale-x'].labels = this.labels;


  let temp_array:number[]=[];
  let temp_color="";
  let temp_nom="";
  let max=0;
  detalleGrafico.forEach((detalle,indice) => {

    if(indice==0){
      temp_color=detalle.color;
      temp_nom=detalle.des;
      temp_array.push(detalle.cant);
    }
    else if(indice<detalleGrafico.length-1 && indice>0){

      if(temp_color!=detalle.color){
        
        let val={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
        this.config3.series.push(val);
        console.log("COLOR "+temp_color);
        temp_color=detalle.color;
        temp_nom=detalle.nom;
        if(temp_array.length>max){
          max=temp_array.length;
        }

        max=temp_array.length;
        temp_array = [];
        temp_array.push(detalle.cant);
        
      }
      else{
        temp_array.push(detalle.cant);
      }

    }
    else{

      if(temp_color!=detalle.color){

        let val={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
        this.config3.series.push(val);
        temp_color=detalle.color;
        temp_nom=detalle.nom;
        if(temp_array.length>max){
          max=temp_array.length;
        }
        temp_array = [];
        temp_array.push(detalle.cant);
        let val1={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
        
        this.config3.series.push(val1);
      }
      else{
        temp_array.push(detalle.cant);
        let val={ values: temp_array,"backgroundColor":temp_color, "legend-text":temp_nom, "text":temp_nom };
        this.config3.series.push(val);
        if(temp_array.length>max){
          max=temp_array.length;
        }
      }

    }


  });


}

}
