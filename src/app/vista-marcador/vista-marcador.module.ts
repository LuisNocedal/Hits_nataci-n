import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VistaMarcadorPage } from './vista-marcador.page';

const routes: Routes = [
  {
    path: '',
    component: VistaMarcadorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VistaMarcadorPage]
})
export class VistaMarcadorPageModule {}
