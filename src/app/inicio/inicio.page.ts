import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AlertController, PickerController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  formResultado: FormGroup;

  nadadores;
  busquedaSinResultados = false;
  nadadoresFiltrados;

  nombreNadador;
  pruebas = [];

  busqueda;

  resultados;
  resultadosPorBloques;

  page = 0;
  botonesIndex = [];

  tiempo = {
    minutos: '00',
    segundos: '00',
    decimas: '00'
  };

  minutos = [];
  segundos = [];
  decimas = [];

  editMode: boolean = false;
  idResultadoEdicion;

  configuraciones;

  constructor(public fb: FormBuilder,
    public storage: Storage,
    public alertCtrl: AlertController,
    public pickerCtrl: PickerController) {
    this.formResultado = this.fb.group({
      'nadador': new FormControl("", Validators.required),
      'prueba': new FormControl("", Validators.required)
    });

    this.obtenerConfiguraciones();
    this.inicializarTiempos();
    this.obtenerNadadores();
    this.obtenerResultados();
  }

  ngOnInit() {

  }

  obtenerConfiguraciones(){
    this.storage.get('configuraciones').then((val)=>{
      var valor = JSON.parse(val);
      if(valor){
        this.configuraciones = valor.configuraciones;
        console.log('Configuraciones',this.configuraciones);
      }
    });
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

  limpiar() {
    this.storage.remove('resultados');
    this.resultados = null;
  }

  obtenerNadadores() {
    this.storage.get('nadadores').then((val) => {
      var valor = (val) ? JSON.parse(val) : { nadadores: [] };
      this.nadadores = valor.nadadores;
    });
  }

  obtenerResultados() {
    this.storage.get('nadadores').then((val) => {
      var nadadores = JSON.parse(val);


      this.storage.get('pruebas').then((val) => {
        var pruebas = JSON.parse(val);

        this.storage.get('resultados').then((val) => {
          var valor = (val) ? JSON.parse(val) : { resultados: [] };
          this.resultados = valor.resultados;
          if (this.resultados) {
            for (let i = 0; i < this.resultados.length; i++) {

              var nadador = nadadores.nadadores.find(nadadorEncontrado => {
                return nadadorEncontrado.id == this.resultados[i].nadador.id;
              });

              this.resultados[i].nadador.nombre = nadador.nombre;
              this.resultados[i].nadador.categoria = nadador.categoria;
              this.resultados[i].nadador.rama = nadador.rama;

              var prueba = pruebas.pruebas.find(pruebaEncontrada => {
                return pruebaEncontrada.id == this.resultados[i].prueba.id;
              });

              this.resultados[i].prueba.prueba = prueba.prueba;
            }
          }
          this.ordenarPorBloques();
        });
      })
    })

  }

  ordenarPorBloques() {
    var vuelta = 0;
    const porBloque = 20;

    this.page = 0;
    this.resultadosPorBloques = [];
    this.botonesIndex = [];

    for (let i = 0; i < this.resultados.length; i += porBloque) {
      this.resultadosPorBloques[vuelta] = this.resultados.slice(i, i + porBloque);
      this.botonesIndex.push(vuelta);
      vuelta++;
    }

    console.log(this.resultadosPorBloques);
  }

  filtrarNadadores(e) {
    const val = e.target.value;
    this.nadadoresFiltrados = [];
    if (val && val.trim() != '') {
      this.nadadoresFiltrados = this.nadadores.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      if (this.nadadoresFiltrados.length <= 0) {
        this.busquedaSinResultados = true;
      } else {
        this.busquedaSinResultados = false;
      }
    } else {
      this.busquedaSinResultados = false;
      this.nadadoresFiltrados = null;
    }
  }

  seleccionarNadador(nadador) {
    this.nombreNadador = nadador.nombre;
    this.formResultado.controls['nadador'].setValue(nadador.id);
    this.nadadoresFiltrados = null;
    this.busqueda = null;
    this.obtenerPruebas(nadador);
  }

  obtenerPruebas(nadador) {
    this.pruebas = [];
    this.storage.get('pruebas').then((val) => {
      var valor = (val) ? JSON.parse(val) : { pruebas: [] };
      var listaPruebas = valor.pruebas;
      for (let i = 0; i < nadador.pruebas.length; i++) {
        var prueba = listaPruebas.find(pruebaEncontrada => {
          return pruebaEncontrada.id == nadador.pruebas[i].id
        });
        if (prueba) {
          this.pruebas.push(prueba);
        }
      }
    });
  }

  guardar() {
    var f = this.formResultado.value;

    var id = moment().format('hhmmssSS');

    var nuevoResultado = {
      id: id,
      horaFormato: moment().format('DD/MM/YY hh:mm'),
      horaInt: moment().format('DDMMYYhhmm'),
      nadador: { id: f.nadador },
      tiempo: this.tiempo.minutos + ":" + this.tiempo.segundos + ":" + this.tiempo.decimas,
      tiempoInt: this.tiempo.minutos + this.tiempo.segundos + this.tiempo.decimas,
      tiempoObj: this.tiempo,
      prueba: { id: f.prueba }
    }

    this.storage.get('resultados').then((val) => {
      var resultados = (val) ? JSON.parse(val) : { resultados: [] };
      resultados.resultados.unshift(nuevoResultado);
      this.storage.set('resultados', JSON.stringify(resultados)).then(() => {
        this.obtenerResultados();
      });
      this.formResultado.reset();
      this.nombreNadador = null;
      this.busqueda = null;
      this.tiempo.minutos = '00';
      this.tiempo.segundos = '00';
      this.tiempo.decimas = '00';
    });
  }

  confirmarQuitar(resultado) {
    this.mostrarAlert(
      'Quitar resultado',
      '¿Quitar el resultado de ' + resultado.nadador.nombre + ' con el tiempo ' + resultado.tiempo + '?',
      [
        {
          text: 'Quitar',
          handler: () => {
            this.quitar(resultado.id);
          }
        },
        {
          text: 'Cancelar',
          handler: () => {

          }
        }
      ]
    );
  }

  quitar(id) {
    this.storage.get('resultados').then((val) => {
      var valor = JSON.parse(val);
      var resultados: Array<any> = valor.resultados;
      var index = resultados.findIndex(resultado => {
        return resultado.id == id;
      });
      resultados.splice(index, 1);
      this.storage.set('resultados', JSON.stringify({ resultados: resultados })).then(() => {
        this.obtenerResultados();
      });
    });
  }

  async mostrarAlert(header, message, buttons: any = ['Aceptar']) {
    const alert = await this.alertCtrl.create({
      header: header,
      //subHeader: 'El correo o la contraseña es incorrecto.',
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  async openPicker() {
    var minutos = [];
    var segundos = [];

    for (let i = 0; i < 60; i++) {
      minutos.push({
        text: (i < 10) ? '0' + i : i,
        value: (i < 10) ? '0' + i : i
      });
      segundos.push({
        text: (i < 10) ? '0' + i : i,
        value: (i < 10) ? '0' + i : i
      });
    }

    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Aceptar',
        handler: (val) => {

          this.formResultado.controls['tiempo'].setValue(val.minutos.value + ':' + val.segundos.value),
            this.formResultado.controls['tiempoInt'].setValue(val.minutos.value + val.segundos.value)
        }
      }],
      columns: [
        {
          name: 'minutos',
          options: minutos
        },
        {
          name: 'segundos',
          options: segundos
        },
      ]
    });
    await picker.present();
  }

  editar(resultado) {
    this.nombreNadador = resultado.nadador.nombre;
    this.formResultado.controls['nadador'].setValue(resultado.nadador.id);
    this.tiempo.minutos = resultado.tiempoObj.minutos;
    this.tiempo.segundos = resultado.tiempoObj.segundos;
    this.tiempo.decimas = resultado.tiempoObj.decimas;
    this.obtenerPruebas(
      this.nadadores.find(nadadorEncontrado => {
        return nadadorEncontrado.id == resultado.nadador.id;
      })
    );
    this.formResultado.controls['prueba'].setValue(resultado.prueba.id);
    this.editMode = true;
    this.idResultadoEdicion = resultado.id;
  }

  cancelarEdicion() {
    this.nombreNadador = null;
    this.formResultado.reset();
    this.tiempo.minutos = '00';
    this.tiempo.segundos = '00';
    this.tiempo.decimas = '00';
    this.editMode = false;
    this.idResultadoEdicion = null;
  }

  guardarCambios() {
    var f = this.formResultado.value;

    var resultado = this.resultados.find(resultadoEncontrado => {
      return resultadoEncontrado.id == this.idResultadoEdicion;
    });

    resultado.nadador.id = f.nadador;
    resultado.tiempo = this.tiempo.minutos + ":" + this.tiempo.segundos + ":" + this.tiempo.decimas;
    resultado.tiempoInt = this.tiempo.minutos + this.tiempo.segundos + this.tiempo.decimas;
    resultado.tiempoObj = this.tiempo;
    resultado.prueba.id = f.prueba;

    this.storage.set('resultados', JSON.stringify({ resultados: this.resultados })).then(() => {
      this.obtenerResultados();
    });

    this.cancelarEdicion();
  }

  confirmarGenerar() {
    this.mostrarAlert(
      'Generar resultados aleatorios',
      'Se generará un resultado aleatorio para cada uno de los nadadores que existe. Se remplazarán todos los que ya existen ¿Continuar?',
      [
        {
          text: 'Generar',
          handler: () => {
            this.generarResultados();
          }
        },
        {
          text: 'Cancelar',
          handler: () => {

          }
        }
      ]
    );
  }

  generarResultados() {

    var resultados = [];

    for (let i = 0; i < this.nadadores.length; i++) {

      var minutos = Math.floor(Math.random() * (60 - 0) + 0);
      var segundos = Math.floor(Math.random() * (60 - 0) + 0);
      var decimas = Math.floor(Math.random() * (100 - 0) + 0);

      var tiempo = {
        minutos: (minutos < 10) ? '0' + minutos : minutos.toString(),
        segundos: (segundos < 10) ? '0' + segundos : segundos.toString(),
        decimas: (decimas < 10) ? '0' + decimas : decimas.toString(),
      }


      var nuevoResultado = {
        id: i + 1,
        nadador: { id: this.nadadores[i].id },
        tiempo: tiempo.minutos + ":" + tiempo.segundos + ":" + tiempo.decimas,
        tiempoInt: tiempo.minutos + tiempo.segundos + tiempo.decimas,
        tiempoObj: tiempo,
        prueba: {
          id: (Math.floor(Math.random() * (3 - 1) + 1) == 1) ? this.nadadores[i].pruebas[0].id :
            (this.nadadores[i].pruebas[1]) ? this.nadadores[i].pruebas[1].id : this.nadadores[i].pruebas[0].id
        }
      }

      resultados.push(nuevoResultado);

    }
    this.storage.set('resultados', JSON.stringify({ resultados: resultados })).then(() => {
      this.obtenerResultados();
    });
    console.log(resultados);

  }

  cambiarPagina(num){
    this.page += num;
  }

}
