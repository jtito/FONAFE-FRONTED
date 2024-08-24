import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {PrimeNGConfig} from "primeng/api";
import {IdiomaEsp} from "./shared/config/idiomaEsp";

@Component({
  selector: 'app-canvia',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'GestionDeRiesgo';

  constructor(private router: Router, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
      this.primengConfig = IdiomaEsp.idiomaEsp(this.primengConfig);
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)){
        return;
      }
      window.scrollTo(0, 0);
    });
  }

}
