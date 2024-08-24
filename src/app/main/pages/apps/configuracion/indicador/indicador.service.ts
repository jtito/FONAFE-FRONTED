import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {AuthLoginService} from '../../../authentication/auth-login/auth-login.service';

@Injectable({
    providedIn: 'root'
})

export class IndicadorService {

}
