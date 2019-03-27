import { Component, OnInit } from '@angular/core';
import { PickerController, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-categoria',
  templateUrl: './agregar-categoria.page.html',
  styleUrls: ['./agregar-categoria.page.scss'],
})
export class AgregarCategoriaPage implements OnInit {

  edades = [];

  edadMenor;
  edadMayor;

  constructor(public pickerCtrl: PickerController,
    private storage: Storage,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.inicializarEdades();
  }

  inicializarEdades() {
    for (let i = 0; i < 99; i++) {
      this.edades.push(i + 1);
    }
  }

  guardar() {
    var fecha = moment().format('hhmmssSS');

    var nuevaCategoria = {
      edadMayor: this.edadMayor,
      edadMenor: this.edadMenor,
      id: fecha
    }

    console.log('Nueva categoría: ', nuevaCategoria);

    var categorias;

    this.storage.get('categorias').then((val) => {
      categorias = (val) ? JSON.parse(val) : { categorias: [] };
      console.log('Categorías: ', categorias);

      var categoriaExistente = categorias.categorias.find(categoriaExistente => {
        return categoriaExistente.edadMayor == nuevaCategoria.edadMayor &&
        categoriaExistente.edadMenor == nuevaCategoria.edadMenor
      });

      console.log('Categoría existente: ',categoriaExistente);

      if(!categoriaExistente){
        categorias.categorias.push(nuevaCategoria);
        this.storage.set('categorias', JSON.stringify(categorias));
        this.cerrar();
      }else{
        this.mostrarAlert('Categoría existente','Esta categoría ya existe');
      }
    });

  }

  compararEdades() {
    return parseInt(this.edadMenor) > parseInt(this.edadMayor);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async mostrarAlert(header,message,buttons = ['Aceptar']) {
    const alert = await this.alertCtrl.create({
      header: header,
      //subHeader: 'El correo o la contraseña es incorrecto.',
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  async abrirPicker() {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Aceptar',
      }],
      columns: [
        {
          name: 'Edad',
          options: [
            {
              text: '1',
              value: 1
            }
          ]
        }
      ]
    });
    await picker.present();
  }

}
