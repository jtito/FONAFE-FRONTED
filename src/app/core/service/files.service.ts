import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { catchError } from "rxjs/operators";
import { MatrizRiesgo } from "src/app/shared/models/matrizRiesgo";
import Swal from "sweetalert2";


@Injectable({
    providedIn: 'root'
})
export class FilesService {
    /*getFile(nombreArchivo: any) {
      throw new Error('Method not implemented.');
    }*/
    urlEndpointMatrizEvidencia = `${environment.apiUrl}/gestionriesgo/MatrizEvidenciaControl`;
    alertService: any;

    getFile(nombreArchivo: string): Observable<any> {
        const url = `${this.urlEndpointMatrizEvidencia}/downloadMatrizEvidenciaControl/${nombreArchivo}`;
        return this.httpClient.get(url).pipe(catchError(err => {
            console.error(err);            
            Swal.fire('Ocurrió un error inesperado en el servidor', "Intente nuevamente por favor", 'error');
            return throwError(err);
        })
        )
    }


    api = `${environment.apiUrl}/file`;

    constructor(private httpClient: HttpClient) {
    }


    uploadFile(idUser: number, file: File): Observable<any> {
        let headers = new HttpHeaders();
        headers.set('Accept', 'multipart/form-data');
        const formData: FormData = new FormData();
        console.log(file);
        formData.set('file', file);
        console.log(formData);
        return this.httpClient.post(`${this.api}/${idUser}`, formData, {
            headers
        });
    }


    deleteFile(idUser: number, fileName: string): Observable<any> {
        return this.httpClient.delete(`${this.api}/${idUser}/${fileName}`);
    }

    downloadFile(idUser: number, fileName: string) {
        return `${this.api}/${idUser}/${fileName}`
    }

    downloadFileEvidencia(fileName: string) {
        const url = `${this.urlEndpointMatrizEvidencia}/downloadMatrizEvidenciaControl/${fileName}`;
        return url;
    }


    eliminarArchivo(fileName: string, usuarioModificacion: string, ipModificacion: string): Observable<any> {
        let headers = new HttpHeaders();
        headers.set('Accept', 'multipart/form-data');
        let params = new HttpParams();
        const formData = new FormData()
        formData.append("fileName", fileName);
        //formData.append("idFile", idFile);
       //console.log("Idfile", + idFile);
        //formData.append("isTemp", isTemp);
        formData.append("usuarioModificacion", usuarioModificacion);
        formData.append("ipModificacion", ipModificacion);

        return this.httpClient.post(`${this.urlEndpointMatrizEvidencia}/deleteFileMatrizEvidenciaControl`, formData, {
            params,
            headers
        }).pipe(
            catchError(err => {
                console.error(err);
                Swal.fire('Ocurrió un error inesperado en el servidor', "Intente nuevamente por favor", 'error');
                return throwError(err);
            })
        )
    }


    registrarEvidencia(file: File, matrizRiesgo: MatrizRiesgo): Observable<any> {
        let headers = new HttpHeaders();
        headers.set('Accept', 'multipart/form-data');
        let params = new HttpParams();
        const formData = new FormData();
        formData.set('file', file, file.name);
        //console.log("id Matriz Riesgo", + matrizRiesgo.idMatrizRiesgo);
        formData.append("idMatrizRiesgo", matrizRiesgo.idMatrizRiesgo.toString());
        formData.append("idDetaMatrizRiesgo", matrizRiesgo.idDetaMatrizRiesgo.toString());
        formData.append("tipoEvidencia", matrizRiesgo.tipoEvidencia.toString());
        formData.append("usuarioCreacion", matrizRiesgo.usuarioCreacion.toString());
        formData.append("ipCreacion", matrizRiesgo.ipCreacion.toString());

        return this.httpClient.post(`${this.urlEndpointMatrizEvidencia}/registrarMatriz/file`, formData, {
            params,
            headers
        }).pipe(
            catchError(err => {
                console.error(err);
                Swal.fire('Ocurrió un error inesperado en el servidor', "Intente nuevamente por favor", 'error');
                return throwError(err);
            })
        )
    }


    listarEvidencia(idMatrizRiesgo: number,idDetaMatrizRiesgo : number): Observable<any> {
        let headers = new HttpHeaders();
        headers.set('Accept', 'multipart/form-data');
        let params = new HttpParams();
        const formData = new FormData();
        formData.append("idMatrizRiesgo", idMatrizRiesgo.toString());
        formData.append("idDetaMatrizRiesgo", idDetaMatrizRiesgo.toString());

        const url = `${this.urlEndpointMatrizEvidencia}/listarMatrizEvidenciaControl/${idMatrizRiesgo}/${idDetaMatrizRiesgo}`;
        return this.httpClient.get(url).pipe(catchError(err => {
            console.error(err);
            Swal.fire('Ocurrió un error inesperado en el servidor', "Intente nuevamente por favor", 'error');
            return throwError(err);
        })
        )
        /*return this.httpClient.get(`${this.urlEndpointMatrizEvidencia}/listarMatrizEvidenciaControl`, formData, {
            params,
            headers
        }).pipe(
            catchError(err => {
                console.error(err);
                this.alertService.confirm('Ocurrió un error inesperado en el servidor', 'error', 'Intente nuevamente por favor');
                return throwError(err);
            })
        )*/
    }
}
