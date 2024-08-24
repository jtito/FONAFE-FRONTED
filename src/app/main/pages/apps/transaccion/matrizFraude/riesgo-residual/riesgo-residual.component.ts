import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {DynamicDialogConfig} from "primeng/dynamicdialog";
import { cartesianPoint } from 'src/app/shared/models/cartesianPoint';
import { ZingchartAngularModule } from 'zingchart-angular';
@Component({
  selector: 'app-riesgo-residual',
  templateUrl: './riesgo-residual.component.html',
  styleUrls: ['./riesgo-residual.component.css']
})
export class RiesgoResidualComponent implements OnInit {

  
  ejeX1 = 0;
  ejeX2 = 0;
  ejeY1 = 0;
  ejeY2 = 0;
  label = "";
  labely = "";
  labelx = "";
  cartesianPoints:cartesianPoint[]=[];
  
  config;

    getConfig() {
      return (this.config) ? JSON.stringify(this.config) : '';
  }
 
  dataSource: Object[] = [
      [100, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    
   ];

  xAxis: Object = {
      labels: ['1', '1.75', '2.5', '3.25', '4.0', '4.75'],
  };
  yAxis: Object = {
      labels: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
  };

   public paletteSettings: Object = {
      palette: [{ value: 0, color: '#cc0000' },
      { value: 50, color: '#f44336' },
      { value: 100, color: '#355C7D' },
      ]
  };

  public cellSettings: Object = {
      showLabel: false,
  };

  constructor(config1: DynamicDialogConfig) {
      this.ejeX1 = config1.data.x1;
      this.ejeX2 = config1.data.x2;
      this.ejeY1 = config1.data.y1;
      this.ejeY2 = config1.data.y2;
      this.label = config1.data.label;
      this.labely = config1.data.labely;
      this.labelx = config1.data.labelx;
      this.cartesianPoints =config1.data.cartesianPoints;
      this.initconfig();
  }
  

  ngOnInit(): void {
      this.setheatarea();
      this.setpoint();
  }

  initconfig(){
    this.config = {
      graphset: [
        {
          type: 'mixed',
          bubbleLegend: {
            layout: 'v',
            marker: {},
            connector: {},
            item: {}
          },
          /*legend: {
            layout: "20x2",    
           'max-items':40,
           'overflow': "scroll",
             'scroll': {
                'bar': {
                  'background-color': "#ffe6e6",
                  'border-left': "1px solid red",
                  'border-right': "1px solid red",
                  'border-top': "1px solid red",
                  'border-bottom': "1px solid red",
                },
                'handle': {
                  'background-color': "#ffe6e6",
                  'border-left': "2px solid red",
                  'border-right': "2px solid red",
                  'border-top': "2px solid red",
                  'border-bottom': "2px solid red",
                  'border-radius': "15px"
                }
            },
            
            x: "72%",
            y: "2%",
          },*/
          plotarea: {
            //'margin-right': "33%",
            'margin-right': "5%",
            'margin-top': "5%"
          },
          scaleY: {
            values: '1.0:4:0.75',
            guide: {
              lineStyle: 'dashed',
              lineGapSize: 10
            },
            label: {
              "text": this.labely
            },
            step: "0.75"
          },
          
          'scale-x': {
            values: '1.0:4:0.75',
          },
          'scale-y': {
            values: '1.0:4:0.75',
          },
          scaleX: {
            minValue: 1.0
            ,
            values: '1.0:4:0.75',
            label: {
              "text": this.labelx
            },
            step: "0.75"
          },
          plot: {
            borderRadius: 100,
            barMaxWidth: 15,
          },
          backgroundColor: '#fff',
          series: [   
          ]
        }
      ]
  
    };
  }

  setarea(){

      this.config.graphset[0].series.push({
          type: "area",
          values: [4, 4, 4, 4, 4],
          marker: {
            size: 1,
          },
          aspect: "spline",
          'contour-on-top': false,
          text: "Area Chart"
        });
  }

  setheatarea(){

    this.config.graphset[0].series.push({
      type: "area",
      tooltip: {
        visible: false
      },
      legendItem: {
        visible: false
      },
      values: [[2.5,3.25],[2.5,4.0],[3.25,4.0],[4.0,4.0]],
      marker: {
        size: 1,
      },
      'background-color': "#FFA8A8",
      aspect: "segmented",
      'line-color':"#FFA8A8",
      'contour-on-top': false,
      text: "Area Chart",
      'alpha-area':1,
      scaleX: {
        minValue: 3.25


      }
    });



    this.config.graphset[0].series.push({
      type: "area",
      tooltip: {
        visible: false
      },
      legendItem: {
        visible: false
      },
      values: [[1,3.25],[1,4.0],[2.5,4.0],[2.5,3.25],[3.25,3.25],[3.25,2.5],[4.0,2.5]],
      marker: {
        size: 1,
      },
      'background-color': "#FFEAA8",
      aspect: "segmented",
      'line-color':"#FFEAA8",
      'contour-on-top': false,
      text: "Area Chart",
      'alpha-area':1,
      scaleX: {
        minValue: 3.25


      }
    });

    this.config.graphset[0].series.push({
      type: "area",
      tooltip: {
        visible: false
      },
      legendItem: {
        visible: false
      },
      values: [[1,3.25],[1.75,3.25],[1.75,2.5],[2.5,2.5],[2.5,1.75],[3.25,1.75]],
      marker: {
        size: 1,
      },
      'background-color': "#FFFFA8",
      'line-color':"#FFFFA8",
      aspect: "segmented",
      'alpha-area':1,
      'contour-on-top': false,
      text: "Area Chart"
    });

    this.config.graphset[0].series.push({
        type: "area",
        tooltip: {
          visible: false
        },
        legendItem: {
          visible: false
        },
        values: [[1,1.75],[1.75,1.75],[1.75,1]],
        marker: {
          size: 1,
        },
        aspect: "segmented",
        'background-color': "#A8E4C3",
        'line-color': "#A8E4C3",
        'alpha-area':1,
        'contour-on-top': false,
        text: "Area Chart"
      });

  }

  setpoint(){

    let values = [];
  
    this.cartesianPoints.forEach((cartesian) => {

      if(cartesian.x>0 && cartesian.y>0){

        let valtemp = [cartesian.x,cartesian.y,4];
        this.config.graphset[0].series.push({
            
          type: 'bubble',
          tooltip: {
            text: cartesian.label,
            placement: "node:out",
              sticky: true,
              timeout: 5000,
          },
          values: [
            
            valtemp
          ],
          text:cartesian.label,
          lineWidth: 0,
          marker: {
            size: 6,
            borderWidth: 0,
            borderColor: '#60d09d'
          }
        });
  
        values.push(valtemp);

      }
      
    });

  }

}

