import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AgregarCategoriaPage } from '../agregar-categoria/agregar-categoria.page';
import { Storage } from '@ionic/storage';
import { AgregarPruebaPage } from '../agregar-prueba/agregar-prueba.page';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  
  categorias;
  pruebas;

  constructor(public modalController: ModalController,
    private storage: Storage,
    public alertCtrl: AlertController) {

      this.obtenerCategorias();
      this.obtenerPruebas();
  }

  ngOnInit() {
  }

  limpiarCategorias(){
    this.storage.remove('categorias');
  }

  agregarCategoria(){
    this.crearModal(AgregarCategoriaPage);
  }

  agregarPrueba(){
    this.crearModal(AgregarPruebaPage);
  }

  editarPrueba(prueba){
    console.log('Prueba enviando: ',prueba);
    this.crearModal(AgregarPruebaPage, prueba);
  }

  async crearModal(page, params = null) {
    const modal =  await this.modalController.create({
      component: page,
      componentProps: {
        params: params
      }
    });
    modal.onDidDismiss().then(()=>{
      this.obtenerCategorias();
      this.obtenerPruebas();
    });
    return await modal.present();
  }

  obtenerCategorias(){
    this.storage.get('categorias').then((val) => {
      var valor = (val)?JSON.parse(val):{categorias:[]};
      console.log(valor);
      this.categorias = valor.categorias;
    });
  }

  obtenerPruebas(){
    this.storage.get('pruebas').then((val) => {
      var valor = (val)?JSON.parse(val):{pruebas:[]};
      console.log(valor);
      this.pruebas = valor.pruebas;
    });
  }

  confirmarQuitarCategoria(categoria){
    this.mostrarAlert(
      'Eliminar categoría',
      '¿Quitar la categoría ' + categoria.edadMenor + ' - ' + categoria.edadMayor + '?',
      [
        {
          text: 'Quitar',
          handler: () =>{
            this.quitarCategoria(categoria.id);
          }
        },
        {
          text: 'Cancelar',
          handler: () =>{
            
          }
        }
      ]
    );
  }

  confirmarQuitarPrueba(prueba){
    this.mostrarAlert(
      'Eliminar prueba',
      '¿Quitar la prueba ' + prueba.prueba + '?',
      [
        {
          text: 'Quitar',
          handler: () =>{
            this.quitarPrueba(prueba.id);
          }
        },
        {
          text: 'Cancelar',
          handler: () =>{
            
          }
        }
      ]
    );
  }

  quitarCategoria(id){
    this.storage.get('categorias').then((val) => {
      var valor = JSON.parse(val);
      var categorias:Array<any> = valor.categorias;
      var index = categorias.findIndex(categoria => {
        return categoria.id == id;
      });
      categorias.splice(index,1);
      console.log(categorias);
      this.storage.set('categorias', JSON.stringify({categorias:categorias}));
      this.categorias = categorias;
    });
  }

  quitarPrueba(id){
    this.storage.get('pruebas').then((val) => {
      var valor = JSON.parse(val);
      var pruebas:Array<any> = valor.pruebas;
      var index = pruebas.findIndex(prueba => {
        return prueba.id == id;
      });
      pruebas.splice(index,1);
      console.log(pruebas);
      this.storage.set('pruebas', JSON.stringify({pruebas:pruebas}));
      this.pruebas = pruebas;
    });
  }

  async mostrarAlert(header,message,buttons:any = ['Aceptar']) {
    const alert = await this.alertCtrl.create({
      header: header,
      //subHeader: 'El correo o la contraseña es incorrecto.',
      message: message,
      buttons: buttons
    });

    await alert.present();
  }


}
