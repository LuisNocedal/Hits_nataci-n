import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgregarPruebaPage } from './agregar-prueba.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPruebaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgregarPruebaPage]
})
export class AgregarPruebaPageModule {}
