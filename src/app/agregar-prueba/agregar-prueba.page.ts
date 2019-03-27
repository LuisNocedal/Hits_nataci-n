import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-prueba',
  templateUrl: './agregar-prueba.page.html',
  styleUrls: ['./agregar-prueba.page.scss'],
})
export class AgregarPruebaPage implements OnInit {

  prueba;

  pruebaEditando;

  constructor(public modalCtrl: ModalController,
    private storage: Storage,
    public alertCtrl: AlertController,
    public navParams: NavParams) {

      this.pruebaEditando = this.navParams.data.params;

      if(this.pruebaEditando){
        console.log('Prueba editando: ',this.pruebaEditando);
        this.prueba = this.pruebaEditando.prueba;
      }

  }

  ngOnInit() {
  }

  guardar(){
    var fecha = moment().format('hhmmssSS');

    var nuevaPrueba = {
      prueba: this.prueba,
      id: fecha
    }

    console.log('Nueva prueba: ', nuevaPrueba);

    var pruebas;

    this.storage.get('pruebas').then((val) => {
      pruebas = (val) ? JSON.parse(val) : { pruebas: [] };
      console.log('Pruebas: ', pruebas);

      var pruebaExistente = pruebas.pruebas.find(pruebaExistente => {
        return pruebaExistente.prueba == nuevaPrueba.prueba
      });

      console.log('Prueba existente: ',pruebaExistente);

      if(!pruebaExistente){
        pruebas.pruebas.push(nuevaPrueba);
        this.storage.set('pruebas', JSON.stringify(pruebas));
        this.cerrar();
      }else{
        this.mostrarAlert('Prueba existente','Esta prueba ya existe');
      }
    });
  }

  guardarCambios(){
    this.storage.get('pruebas').then((val) => {
      var pruebas = (val) ? JSON.parse(val) : { pruebas: [] };
      console.log('Pruebas: ', pruebas);

      var pruebaExistente = pruebas.pruebas.find(pruebaExistente => {
        return pruebaExistente.prueba == this.prueba.prueba
      });

      console.log('Prueba existente: ',pruebaExistente);

      if(!pruebaExistente){
        var pruebaEditada = pruebas.pruebas.find(pruebaEncotrada => {
          return pruebaEncotrada.id == this.pruebaEditando.id;
        })

        pruebaEditada.prueba = this.prueba;

        this.storage.set('pruebas', JSON.stringify(pruebas));
        this.cerrar();
      }else{
        this.mostrarAlert('Prueba existente','Esta prueba ya existe');
      }
    });
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

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
