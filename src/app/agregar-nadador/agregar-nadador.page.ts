import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-nadador',
  templateUrl: './agregar-nadador.page.html',
  styleUrls: ['./agregar-nadador.page.scss'],
})
export class AgregarNadadorPage implements OnInit {

  formNadador: FormGroup;

  edades = [];

  pruebas;

  nadador;

  tiempoPrueba = {
    minutos: '00',
    segundos: '00',
    decimas: '00'
  }

  tiempoPrueba2 = {
    minutos: '00',
    segundos: '00',
    decimas: '00'
  }

  minutos = [];
  segundos = [];
  decimas = [];

  constructor(public modalCtrl: ModalController,
    public fb: FormBuilder,
    public storage: Storage,
    public alertCtrl: AlertController,
    public navParams: NavParams) {

    this.formNadador = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'edad': new FormControl("", Validators.required),
      'rama': new FormControl("", Validators.required),
      'prueba': new FormControl("", Validators.required),
      'prueba2': new FormControl("")
    });

    this.nadador = this.navParams.data.nadador;
    console.log('Nadador: ', this.nadador);
    if (this.nadador) {
      this.formNadador.controls['nombre'].setValue(this.nadador.nombre);
      this.formNadador.controls['edad'].setValue(this.nadador.edad);
      this.formNadador.controls['rama'].setValue(this.nadador.rama);
      this.formNadador.controls['prueba'].setValue(this.nadador.pruebas[0].id);
      this.formNadador.controls['prueba2'].setValue(this.nadador.pruebas[1].id);
      //this.tiempo = this.nadador.tiempoEstimadoObj;
      this.tiempoPrueba = this.nadador.pruebas[0].tiempoEstimadoObj;
      this.tiempoPrueba2 = this.nadador.pruebas[1].tiempoEstimadoObj;
    }

  }

  ngOnInit() {
    this.inicializarEdades();
    this.obtenerPruebas();
    this.inicializarTiempos();
  }

  inicializarTiempos() {
    for (let i = 0; i < 100; i++) {
      if (i < 60) {
        this.minutos.push((i < 10) ? '0' + i : i);
        this.segundos.push((i < 10) ? '0' + i : i);
      }
      this.decimas.push((i < 10) ? '0' + i : i);
    }
  }

  inicializarEdades() {
    for (let i = 0; i < 99; i++) {
      this.edades.push(i + 1);
    }
  }

  obtenerPruebas() {
    this.storage.get('pruebas').then((val) => {
      var valor = (val) ? JSON.parse(val) : { pruebas: [] };
      console.log(valor);
      this.pruebas = valor.pruebas;
    });
  }

  guardar() {
    var f = this.formNadador.value;

    var pruebas = [
      {
        id: f.prueba,
        tiempoEstimado: this.tiempoPrueba.minutos + ":" + this.tiempoPrueba.segundos + ":" + this.tiempoPrueba.decimas,
        tiempoEstimadoInt: this.tiempoPrueba.minutos + this.tiempoPrueba.segundos + this.tiempoPrueba.decimas,
        tiempoEstimadoObj: this.tiempoPrueba
      },
      {

        id: f.prueba2,
        tiempoEstimado: this.tiempoPrueba2.minutos + ":" + this.tiempoPrueba2.segundos + ":" + this.tiempoPrueba2.decimas,
        tiempoEstimadoInt: this.tiempoPrueba2.minutos + this.tiempoPrueba2.segundos + this.tiempoPrueba2.decimas,
        tiempoEstimadoObj: this.tiempoPrueba2
      }
    ];

    var fecha = moment().format('hhmmssSS');

    var nuevoNadador = {
      nombre: f.nombre,
      pruebas: pruebas,
      categoria: null,
      edad: f.edad,
      rama: f.rama,
      id: fecha,
      /*tiempoEstimado: this.tiempo.minutos + ":" + this.tiempo.segundos + ":" + this.tiempo.decimas,
      tiempoEstimadoInt: this.tiempo.minutos + this.tiempo.segundos + this.tiempo.decimas,
      tiempoEstimadoObj: this.tiempo,*/
    }

    console.log('Nuevo nadador: ', nuevoNadador);

    this.storage.get('categorias').then((val) => {
      var categorias = (val) ? JSON.parse(val) : { categorias: [] };
      console.log('Categorías: ', categorias);

      nuevoNadador.categoria = categorias.categorias.find(categoriaAsignada => {
        return parseInt(categoriaAsignada.edadMenor) <= parseInt(f.edad)
          && parseInt(categoriaAsignada.edadMayor) >= parseInt(f.edad)
      });

      if (!nuevoNadador.categoria) {
        this.mostrarAlert(
          'No se encotró la categoría',
          'No se ha encontrado una edad para esa edad'
        )

        return;
      }

      this.storage.get('nadadores').then((val) => {
        var nadadores = (val) ? JSON.parse(val) : { nadadores: [] };
        console.log('nadadores: ', nadadores);

        nadadores.nadadores.push(nuevoNadador);
        nadadores.nadadores.sort(this.ordenarPorNombre);
        console.log('Nadadores ordenados: ', nadadores.nadadores);
        this.storage.set('nadadores', JSON.stringify(nadadores));
        this.cerrar();
      });
    });
  }

  guardarCambios() {
    var f = this.formNadador.value;

    var pruebas = [
      {
        id: f.prueba,
        tiempoEstimado: this.tiempoPrueba.minutos + ":" + this.tiempoPrueba.segundos + ":" + this.tiempoPrueba.decimas,
        tiempoEstimadoInt: this.tiempoPrueba.minutos + this.tiempoPrueba.segundos + this.tiempoPrueba.decimas,
        tiempoEstimadoObj: this.tiempoPrueba
      },
      {

        id: f.prueba2,
        tiempoEstimado: this.tiempoPrueba2.minutos + ":" + this.tiempoPrueba2.segundos + ":" + this.tiempoPrueba2.decimas,
        tiempoEstimadoInt: this.tiempoPrueba2.minutos + this.tiempoPrueba2.segundos + this.tiempoPrueba2.decimas,
        tiempoEstimadoObj: this.tiempoPrueba2
      }
    ];

    this.storage.get('nadadores').then((val) => {
      var valor = (val) ? JSON.parse(val) : { nadadores: [] };
      console.log(valor);
      var nadadores = valor.nadadores;
      var nadador = nadadores.find(nadadorEncontrado => {
        return nadadorEncontrado.id == this.nadador.id;
      });

      this.storage.get('categorias').then((val) => {
        var categorias = (val) ? JSON.parse(val) : { categorias: [] };
        console.log('Categorías: ', categorias);

        nadador.nombre = f.nombre;
        nadador.edad = f.edad;
        nadador.pruebas = pruebas;
        /*nadador.tiempoEstimado = this.tiempo.minutos + ":" + this.tiempo.segundos + ":" + this.tiempo.decimas;
        nadador.tiempoEstimadoInt = this.tiempo.minutos + this.tiempo.segundos + this.tiempo.decimas;
        nadador.tiempoEstimadoObj = this.tiempo;*/

        nadador.categoria = categorias.categorias.find(categoriaAsignada => {
          return categoriaAsignada.edadMenor <= f.edad && categoriaAsignada.edadMayor >= f.edad
        });

        if (!nadador.categoria) {
          this.mostrarAlert(
            'No se encotró la categoría',
            'No se ha encontrado una edad para esa edad'
          )

          return;
        }

        console.log('Nadadores después del cambio: ', nadadores);
        nadadores.sort(this.ordenarPorNombre);
        this.storage.set('nadadores', JSON.stringify({ nadadores: nadadores }));
        this.cerrar();
      });

    });
  }

  ordenarPorNombre(a, b) {
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
      return 1;
    }
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  async mostrarAlert(header, message, buttons = ['Aceptar']) {
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
