import {Component, Input, OnInit} from '@angular/core';
import {FilesService} from "../../../core/service/files.service";
import {FileModel} from "../../../core/schema/file.model";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-img-upload',
    templateUrl: './img-upload.component.html',
    styleUrls: ['./img-upload.component.scss']
})
export class ImgUploadComponent implements OnInit {


    constructor(private filesService: FilesService, public activatedRoute: ActivatedRoute) {
    }


    existDoc = false;

    @Input() fileModel: FileModel = new FileModel();
    @Input() idUser: number;
    editar:boolean;
    ver:boolean; 

    ngOnInit(): void {
        console.log(this.idUser);
        console.log(this.fileModel);
        if (this.fileModel?.name) {
            this.existDoc = true;
        }

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

    deleteFile(file: FileModel) {
        this.filesService.deleteFile(this.idUser, file.name).subscribe(resp => {
            console.log(resp);
            if (resp.status === 'OK') {
                this.existDoc = false;
            }
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


    // Convert Files list to normal array list
    prepareFilesList(file: any) {
        console.log(file.file);
        console.log(file.files[0]);
        this.filesService.uploadFile(this.idUser, file.files[0]).subscribe(resp => {
            console.log(resp);
            Swal.fire('El archivo se cargó correctamente', "", 'success');
            this.fileModel = resp;
            this.existDoc = true;
        }, error => {
            console.error(error);
        })
        this.uploadFilesSimulator(0);
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    downloadFile(fileModel: FileModel) {
        window.open(this.filesService.downloadFile(this.idUser, this.fileModel.name), '_parent');
    }
}
