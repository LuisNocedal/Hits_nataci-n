import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'inicio', loadChildren: '../inicio/inicio.module#InicioPageModule' },
      { path: 'nadadores', loadChildren: '../nadadores/nadadores.module#NadadoresPageModule' },
      { path: 'marcadores', loadChildren: '../marcadores/marcadores.module#MarcadoresPageModule' },
      { path: 'categorias', loadChildren: '../categorias/categorias.module#CategoriasPageModule' },
      { path: 'configuraciones', loadChildren: '../configuraciones/configuraciones.module#ConfiguracionesPageModule' },
      { path: 'hits', loadChildren: '../hits/hits.module#HitsPageModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule { }
