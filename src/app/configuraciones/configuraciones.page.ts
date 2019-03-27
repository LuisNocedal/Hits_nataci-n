import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {

  configuraciones = {
    modoPrueba: false
  }

  constructor(public storage: Storage, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.obtenerConfiguraciones();
  }

  obtenerConfiguraciones(){
    this.storage.get('configuraciones').then((val)=>{
      var valor = JSON.parse(val);
      console.log(valor);
      if(valor){
        this.configuraciones.modoPrueba = valor.configuraciones.modoPrueba;
      }
    });
  }

  guardarConfiguracionModoPrueba(e){
    console.log(e);
    this.configuraciones.modoPrueba = e;
    this.storage.set('configuraciones',JSON.stringify({configuraciones:this.configuraciones}));
  }

  confimarLimpiarDatos() {
    this.mostrarAlert(
      'Eliminar todos los datos',
      'Una vez eliminados los datos no podrán ser recuperados de ninguna manera. Escribe "ELIMINAR" en la linea y presiona el botón',
      [
        {
          text: 'Eliminar',
          handler: (data) => {
            console.log(data);
            if(data.inputEliminar === 'ELIMINAR'){
              this.limpiarDatos();
              this.mostrarAlert(
                'Datos borrados.',
                'Todos los datos han sidos borrados.'
              )
            }else{
              this.mostrarAlert(
                'Los datos no se eliminaron.',
                'El mensaje escrito no es "ELIMINAR". Escribalo en la linea y presione el boton eliminar.'
              )
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ],
      [
        {
          name: 'inputEliminar',
          type: 'text'
        }
      ]
    )
  }


  confimarLimpiarNadadoresYResultados() {
    this.mostrarAlert(
      'Eliminar todos los nadadores y resultados',
      'Una vez eliminados los datos no podrán ser recuperados de ninguna manera. Escribe "ELIMINAR" en la linea y presiona el botón',
      [
        {
          text: 'Eliminar',
          handler: (data) => {
            console.log(data);
            if(data.inputEliminar === 'ELIMINAR'){
              this.limpiarNadadoresYResultados();
              this.mostrarAlert(
                'Datos borrados.',
                'Todos los nadadores y resultados han sido borrados.'
              )
            }else{
              this.mostrarAlert(
                'Los datos no se eliminaron.',
                'El mensaje escrito no es "ELIMINAR". Escribalo en la linea y presione el boton eliminar.'
              )
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ],
      [
        {
          name: 'inputEliminar',
          type: 'text'
        }
      ]
    )
  }

  confimarLimpiarResultados() {
    this.mostrarAlert(
      'Eliminar todos los resultados',
      'Una vez eliminados los datos no podrán ser recuperados de ninguna manera. Escribe "ELIMINAR" en la linea y presiona el botón',
      [
        {
          text: 'Eliminar',
          handler: (data) => {
            console.log(data);
            if(data.inputEliminar === 'ELIMINAR'){
              this.limpiarResultados();
              this.mostrarAlert(
                'Datos borrados.',
                'Todos los resultados han sidos borrados.'
              )
            }else{
              this.mostrarAlert(
                'Los datos no se eliminaron.',
                'El mensaje escrito no es "ELIMINAR". Escribalo en la linea y presione el boton eliminar.'
              )
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ],
      [
        {
          name: 'inputEliminar',
          type: 'text'
        }
      ]
    )
  }

  limpiarDatos() {
    this.storage.clear();
  }

  limpiarNadadoresYResultados(){
    this.storage.remove('resultados');
    this.storage.remove('nadadores');
  }

  limpiarResultados(){
    this.storage.remove('resultados');
  }

  async mostrarAlert(header, message, buttons: any = ['Aceptar'], inputs = []) {
    const alert = await this.alertCtrl.create({
      header: header,
      //subHeader: 'El correo o la contraseña es incorrecto.',
      message: message,
      inputs: inputs,
      buttons: buttons
    });

    await alert.present();
  }

}
