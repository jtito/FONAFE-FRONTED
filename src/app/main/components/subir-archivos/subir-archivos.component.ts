import { Component, OnInit,ElementRef, Input, ViewChild, Output, EventEmitter, Injectable, Inject  } from '@angular/core';
import { FilesService } from 'src/app/core/service/files.service';
import { ActivatedRoute } from "@angular/router";
import { Archivo } from 'src/app/core/schema/archivo';
import Swal from 'sweetalert2';
import { MatrizRiesgo } from 'src/app/shared/models/matrizRiesgo';
import {MatrizEvidencia} from "../../../shared/models/matrizEvidencia";
import { FileModel } from 'src/app/core/schema/file.model';
import {TipoEvidencia} from "../../../shared/models/tipoEvidencia";

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthLoginService } from '../../pages/authentication/auth-login/auth-login.service';

@Component({
  selector: 'app-subir-archivos',
  templateUrl: './subir-archivos.component.html',
  styleUrls: ['./subir-archivos.component.css']
})

export class SubirArchivosComponent implements OnInit {
    [x: string]: any;

    @Output() closeModalEvent = new EventEmitter<boolean>();

    @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

    
    idMatrizRiesgo = 0;
    idDetaMatrizRiesgo = 0;
    usuarioCreacion = "";
    ipCreacion = "";
    tipoEvidencia = 0;

    //@Input() public classModal = 'primary';
    //authLoginService: any;
    files: any[] = [];
    
    @ViewChild('fileDropRef') fileDropRef: ElementRef;
    editar:boolean;
    ver:boolean;
    matrizListaEvidencia: MatrizEvidencia[] = [];
    //existDoc = false;
    @Input() fileModel: FileModel = new FileModel();

    @Output() respuesta = new EventEmitter<any>();

    //@Output() closeModalEvent = new EventEmitter<boolean>();
    
    modalVisible = false;

    displayc: boolean = false;

    dataIp: string = "";

  constructor(private filesService: FilesService,public activatedRoute: ActivatedRoute, matrizRiesgo: DynamicDialogConfig,
    public ref: DynamicDialogRef, private authLoginService: AuthLoginService) {  /* , matrizRiesgo: MatrizRiesgo*/
    this.idMatrizRiesgo = matrizRiesgo.data.idMatrizRiesgo;
    this.idDetaMatrizRiesgo = matrizRiesgo.data.idDetaMatrizRiesgo;
    this.usuarioCreacion = matrizRiesgo.data.usuarioCreacion;
    this.ipCreacion = matrizRiesgo.data.ipCreacion;
    this.tipoEvidencia = matrizRiesgo.data.tipoEvidencia;
    //this.obtenermetodoIP();

  }

  ngOnInit(): void {

      
      this.listarFile(this.idMatrizRiesgo, this.idDetaMatrizRiesgo); //Listar Evidencias registradas

      if (this.activatedRoute.snapshot.url[0].toString() === 'editar') {
          this.editar = true;
          this.ver = false;

      }
      else if (this.activatedRoute.snapshot.url[0].toString() === 'registrar') {
          this.editar = false;
          this.ver = false;

      }
      else {
          this.editar = false;
          this.ver = true;

      }
      
  }

  // on file drop handler
  onFileDropped($event) {
      this.prepareFilesList($event);
  }


  // handle file from browsing
  fileBrowseHandler(files) {
      this.prepareFilesList(files);
  }

  
   closeDialogC() {
    //this.displayc = false;
    this.ref.close(this.files);
}
  
  

  deleteFile(index: number, file: any) {
    this.files.splice(index, 1);
    let fileName = file.fileName;
    //const datosToken = this.authLoginService.obtenerDatosToken(this.authLoginService.userToken);
    const usuarioCreacion = this.usuarioCreacion;//datosToken.data.username;
    let ipCreacion = this.ipCreacion; //"127.0.0.1";
    this.filesService.eliminarArchivo(fileName, usuarioCreacion, ipCreacion).subscribe(resp => {
        console.log(resp);

        Swal.fire('El archivo se eliminó correctamente', "", 'success');
        
        /*this.listarFile(this.idMatrizRiesgo, this.idDetaMatrizRiesgo); //Listar Evidencias registradas*/
    }, error => {
        console.error("Error al borrar Archivo");
    })
}

 // Simulate the upload process
 uploadFilesSimulator(index: number) {
    setTimeout(() => {
        const progressInterval = setInterval(() => {
            this.fileModel.progress += 5;
        }, 200);
    }, 1000);
}


    downloadFileEvidencia(index: number, file: any) {
        let nombreArchivo = file.fileName.split("\\.(?=[^\\.]+$)"); //file.fileName;
        window.open(this.filesService.downloadFileEvidencia(nombreArchivo), '_parent');
    }


  // Convert Files list to normal array list
  prepareFilesList(files: Array<any>) {
      let size = 0;
      let sizeTotal = 0;
      let cantidad = 0;
      
      if(this.files.length < 5)
      {
        for (const item of files) {
            //console.log(sizeTotal);
            item.progress = 0;
            sizeTotal = sizeTotal + item.size;
            cantidad = cantidad + 1;
            //console.log('aqui'+ item.size)
  
           if (item.size > 5242880) {
  
               Swal.fire('El archivo debe tener como maximo 5MB', "", 'error');
  
            }
            else if (sizeTotal > 26214400) {
              Swal.fire('El archivo debe tener como maximo 25MB', "", 'error');
            }
  
            else {
              this.files.push(item);
            }
  
        }      
     
        if (cantidad < 6){
            this.files.map(f => {
                if (!f.idFile) {
        
                  var obj = new Object();
                  obj['idMatrizRiesgo'] =this.idMatrizRiesgo;
                  obj['idDetaMatrizRiesgo'] =this.idDetaMatrizRiesgo;
                  obj['tipoEvidencia'] =this.tipoEvidencia;
                  obj['usuarioCreacion'] =this.usuarioCreacion;
                  obj['ipCreacion'] =this.ipCreacion;
        
                    this.filesService.registrarEvidencia(f, obj).subscribe(resp => {
        
                        let fileResponse = resp.data;
                        f.progress = 100;
                        f.fileName = fileResponse.fileName;
                        f.idFile = fileResponse.idFile;
                        f.isTemp = "1";
                        console.log("fileResponse" + fileResponse);
                        Swal.fire('El archivo se cargó correctamente', "", 'success');
                    }, error => {
                        Swal.fire('Error en la carga del archivo', "", 'error');
                        console.error(error);
                    })
        
                    //this.listarFile(idMatrizRiesgo, idDetaMatrizRiesgo); //Listar Evidencias registradas
                }
                
               })
        }else{
            Swal.fire('Solo se permite como máximo 5 archivos', "", 'error');
            this.files = []
        }
      
        //console.log(this.files);
        this.uploadFilesSimulator(0);
        this.fileDropRef.nativeElement.value = '';
    }
    else{

        Swal.fire('Solo se permite como máximo 5 archivos', "", 'error');
    }

  }

  
  listarFile(idMatrizRiesgo: number, idDetaMatrizRiesgo: number) {

    this.filesService.listarEvidencia(idMatrizRiesgo, idDetaMatrizRiesgo).subscribe(resp => {
        if (this.tipoEvidencia==TipoEvidencia.evidenciaControl){
            this.matrizListaEvidencia = resp.listaMatrizEvidenciaControl;
        }
        if (this.tipoEvidencia==TipoEvidencia.evidenciaPlan){
            this.matrizListaEvidencia = resp.listaMatrizEvidenciaPlan;
        }

        this.matrizListaEvidencia.forEach(fi => {
            let f: any = new File([""], fi.nombreOriginalArchivo);
            f.progress = 100;
            f.fileName = fi.nombreArchivo;
            f.idFile = fi.idEvidencia;
            f.isTemp = "0";
            this.files.push(f)
        })
    }, error => {
        console.error("Error al listar Archivos");
    })
}

/*obtenermetodoIP (){

    this.authLoginService.obtenerIp().subscribe(
        resp => {
            this.dataIp = resp.ip;
            console.log(resp);
        }
    );
}*/


}


function success(arg0: string, success: any, arg2: string) {
    throw new Error('Function not implemented.');
}

function jQuery(arg0: string) {
    throw new Error('Function not implemented.');
}

