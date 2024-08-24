import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert2';
import {AuthLoginService} from '../../authentication/auth-login/auth-login.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main-board',
    templateUrl: './main-board.component.html',
    styleUrls: ['main.component.css']
})

export class MainBoardComponent implements OnInit {

    constructor(private authLoginService: AuthLoginService, private router: Router) {
    }

    ngOnInit(): void {
        console.log('Menu principal');
        if (this.authLoginService.isAuthenticated()) {
            this.router.navigate(['pages', 'main', 'menu']);
        }
    }

}
