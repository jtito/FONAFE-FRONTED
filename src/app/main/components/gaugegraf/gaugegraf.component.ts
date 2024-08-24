import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa';
import { Periodo } from 'src/app/shared/models/periodo';
import { DataLogin } from 'src/app/shared/models/data';
import { Router } from '@angular/router';
import { ComponentsService } from '../components.service';
import { DetalleGrafico } from 'src/app/shared/models/detalleGrafico';
import { Parametro } from 'src/app/shared/models/parametro';


@Component({
  selector: 'app-gaugegraf',
  templateUrl: './gaugegraf.component.html',
  styleUrls: ['./gaugegraf.component.scss'],
})
export class GaugeGrafComponent implements OnInit {
 
  @ViewChild('chart6', {static: false}) chart6: any;
  "layout": "horizontal";
  value = 0;
  plotindex = 0;
  nodeindex = 0;
  @Input() idMatriz: number;
  @Input() idPeriodo: number;
  @Input() idEmpresa: number; 
  render:boolean=false;
  ocultar:boolean=true;
  nuPerdida : number;
  //@Output() porcentajeCumplimiento: EventEmitter<any> = new EventEmitter();

  feed = (callback) => {
   let tick = {};
   tick = Math.ceil(350 + (Math.random() * 500));
   JSON.stringify(tick);    
 };
  
  config6 =  {  

    type: 'gauge',
    globals: {
      fontSize: '25px'
    },
    plot: {
      valueBox: {
        text: '%v', // default
        fontSize: '18px',
        placement: 'center',
        rules: [],
        'thousands-separator': ", "
      },
      size: '100%'
    },
    plotarea: {
      marginTop: '80px'
    },
    scaleR: {
      aperture: 180,
      
      center: {
        visible: false
      },
      item: {
        offsetR: 0,
        rules: [
          {
            offsetX: '15px',
            rule: '%i == 9'
          }
        ]
      },
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      
      minValue: 0,
      ring: {
        rules: [],
        size: '50px'
      },
      tick: {
        visible: false
      }
    },
    tooltip: {
      borderRadius: '5px'
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      ///interval: 1500,
      //resetTimeout: 1000,
      transport: 'js'
    },
    series: [
      {
        values: [], // starting value
        backgroundColor: 'black',
        indicator: [10, 10, 10, 10, 0.75],
        animation: {
          effect: 'ANIMATION_EXPAND_VERTICAL',
          method: 'ANIMATION_BACK_EASE_OUT',
          sequence: 'null',
          speed: 900
        }
      }
    ]
  };
  
    
    
    constructor(private router: Router,public componentsService:ComponentsService) {  
      
    } 

    ngOnInit(): void {
       
      //this.btnObjSistema;
  }
  ngOnChanges(changes) {
  
    if(changes.idEmpresa){
  
      this.idPeriodo=changes.idEmpresa.currentValue;   
      //this.obtenerGraphInhe();
     /// this.obtenerGraphGer();
    }
    if(changes.idPeriodo){
  
      this.idPeriodo=changes.idPeriodo.currentValue;
   
      this.obtenerGraphInhe();
      //this.obtenerGraphGer();
    }
  
  
    // changes.prop contains the old and the new value...
  }
  
  getConfig() {
    return (this.config6) ? JSON.stringify(this.config6) : '';
  }

  
  obtenerColorVolicimetro() {

    this.render = false;

    this.componentsService.obtenerGraphColorVolicimetro().subscribe(
        resp => {           

          this.convertToGraphParam(resp.listaParametros);  
          this.convertToGraphColor(resp.listaParametros);  
          this.render = true;  
        }
    );
  
  }
  
  obtenerGraphInhe(){
    this.render=false;  
    this.nuPerdida = null;
      
      return this.componentsService.obtenerGraphEvento(this.idEmpresa, this.idPeriodo).subscribe(resp => {

        if (resp.nuPerdida > 0){           
          
          this.nuPerdida = resp.nuPerdida;
          this.convertToGraphSet(this.nuPerdida); 
          this.obtenerColorVolicimetro();        
        }    
      });    
  }    
 
  
  convertToGraphSet(nuPerdida:Number){
     //this.config6.series=[];    
      
     if(nuPerdida > 0){      
      
      this.config6.series=[];

      let obj = {
        values: [nuPerdida], // cantidad
        backgroundColor: 'black',
        indicator: [10, 10, 10, 10, 0.75],
        animation: {
          effect: 'ANIMATION_EXPAND_VERTICAL',
          method: 'ANIMATION_BACK_EASE_OUT',
          sequence: 'null',
          speed: 900
        }
      
      }

      let param1 = Number(nuPerdida)/3;
      let param2 = Number(nuPerdida)*2/3;
      let param3 = Number(nuPerdida);

      let obj1 =            
        [
          {          
            rule: '%v >= 0 && %v < ' + param1,
            "background-color": "green"
          },
          {          
            rule: '%v >= ' + param1 + ' && %v < ' + param2,
            "background-color": "yellow"
          },
          {          
            rule: '%v >= ' + param2 + ' && %v <= ' + param3,
            "background-color": "red" 
          }       
      ]

      let obj1r =            
        [
          {          
            rule: '%v >= 0 && %v <= '+ param1,
            "background-color": "green"
          },
          {          
            rule: '%v > ' + param1 + ' && %v <= ' + param2,
            "background-color": "yellow"
          },
          {          
            rule: '%v > ' + param2 + ' && %v <= ' + param3,
            "background-color": "red" 
          }       
      ]

      for(var item of obj1){

     //   this.config6.plot.valueBox.rules.push(item); 
      }     

      

      this.config6.scaleR['ring']['size']='30px';
   //   this.config6.scaleR['ring']['rules']=obj1;
           
      this.config6.series.push(obj);
     
   }
    
  }  
  
  
  convertToGraphParam(parametro:Parametro[]){
    //this.config6.plot.valueBox.rules=[];
  
     let cantidad = [];  
     let parametro1 = "";         
     let parametro2 = "";         
     let parametro3 = "";        
     
     
  
     parametro1 = parametro[0].deValor1;
     parametro2 = parametro[0].deValor2;
     parametro3 = parametro[0].deValor3;
    
     let obj =            
        [
          {          
            rule: '%v >= ' + parametro1
          },
          {          
            rule: '%v < ' + parametro1 + ' && %v > ' + parametro2
          },
          {          
            rule: '%v < ' + parametro2 + ' && %v > ' + parametro3 
          }       
      ]

      for(var item of obj){

  //      this.config6.plot.valueBox.rules.push(item); 
      }     
   
  } 
 
 convertToGraphColor(parametro:Parametro[]){
  //this.config6.scaleR.ring.rules=[];

   let cantidad = [];  
   let parametro1 = "";         
   let parametro2 = "";         
   let parametro3 = "";         

   parametro1 = parametro[0].deValor1;
   parametro2 = parametro[0].deValor2;
   parametro3 = parametro[0].deValor3;  

   console.log("NUPERDIDA "+this.nuPerdida);
   console.log("PARAMS "+JSON.stringify(parametro) +" PAR1 "+parametro1);


   let param1 = Number(this.nuPerdida)/3;
   let param2 = Number(this.nuPerdida)*2/3;
   let param3 = Number(this.nuPerdida);

   let inside:boolean=false;
   if(this.nuPerdida>=0 && this.nuPerdida<=Number(parametro3)){

    inside=true;
   }

   let obj1 =            
        [
          {        
            backgroundColor:  "green",
            rule: '%v >= 0 && %v < ' + param1
          },
          {          
            backgroundColor:  "yellow",
            rule: '%v >= ' + param1 + ' && %v < ' + param2
          },
          {    
            backgroundColor: "red" ,      
            rule: '%v >= ' + param2 + ' && %v <= ' + param3,
            
          }       
      ]
   

   let obj2 =    
   [
        {
          backgroundColor: '#46e327',
          rule: '%v >= 0 && %v <= ' + parametro1
        },
        {
          backgroundColor: '#e8e805',
          rule: '%v >= ' + parametro1 + ' && %v < ' + parametro2
        },
        {
          backgroundColor: '#EF5350',
          rule: '%v >= ' + parametro2 + ' && %v < ' + parametro3
        }        
      ];


    if(inside){
      for(var item2 of obj2){

        console.log("INSIDE "+JSON.stringify(item2));

        this.config6.scaleR.ring.rules.push(item2); 
      }
      let step:number=Number(parametro3)/3;
      let values="0:"+parametro3+":"+step;

      this.config6.scaleR['values']=values;   
    }
    else{
      for(var item2 of obj1){

        this.config6.scaleR.ring.rules.push(item2); 
      }
      let step:number=Number(this.nuPerdida)/3;
      let values="0:"+this.nuPerdida+":"+step;

      this.config6.scaleR['values']=values;   
    }
    
 
}   
  
}
  
  