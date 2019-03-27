import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'agregar-categoria', loadChildren: './agregar-categoria/agregar-categoria.module#AgregarCategoriaPageModule' },
  { path: 'agregar-prueba', loadChildren: './agregar-prueba/agregar-prueba.module#AgregarPruebaPageModule' },
  { path: 'agregar-nadador', loadChildren: './agregar-nadador/agregar-nadador.module#AgregarNadadorPageModule' },
  { path: 'vista-marcador/:datos', loadChildren: './vista-marcador/vista-marcador.module#VistaMarcadorPageModule' },
  { path: 'vista-hits/:datos', loadChildren: './vista-hits/vista-hits.module#VistaHitsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
