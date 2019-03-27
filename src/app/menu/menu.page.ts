import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuraciones } from '../config';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  providers: [ Configuraciones ]
})
export class MenuPage implements OnInit {
  
  seleccionado = 'inicio';

  version;

  constructor(private router: Router, private config: Configuraciones) { 
    this.router.navigate(['menu/inicio']);
    this.version = config.VERSION;
  }

  ngOnInit() {
  }

}
