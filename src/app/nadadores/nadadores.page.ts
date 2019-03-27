import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AgregarNadadorPage } from '../agregar-nadador/agregar-nadador.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-nadadores',
  templateUrl: './nadadores.page.html',
  styleUrls: ['./nadadores.page.scss'],
})
export class NadadoresPage implements OnInit {

  nadadores;
  nadadoresFiltrados;
  nadadoresPorBloques = [];
  botonesIndex = [];

  page = 0;

  busquedaSinResultados = false;

  categorias;
  pruebas;

  categoria;
  prueba;
  rama;

  busqueda
  filtrandoPorCaracteristicas: boolean = false;

  numNadadores;

  configuraciones;

  constructor(public modalCtrl: ModalController,
    public storage: Storage,
    public alertCtrl: AlertController) {
    this.obtenerConfiguraciones();
    this.obtenerNadadores();
    this.obtenerCategorias();
    this.obtenerPruebas();
  }

  ngOnInit() {
  }

  obtenerConfiguraciones() {
    this.storage.get('configuraciones').then((val) => {
      var valor = JSON.parse(val);
      if (valor) {
        this.configuraciones = valor.configuraciones;
        console.log('Configuraciones', this.configuraciones);
      }
    });
  }

  obtenerCategorias() {
    this.storage.get('categorias').then((val) => {
      var valor = (val) ? JSON.parse(val) : { categorias: [] };

      this.categorias = valor.categorias;
    });
  }

  obtenerPruebas() {
    this.storage.get('pruebas').then((val) => {
      var valor = (val) ? JSON.parse(val) : { pruebas: [] };

      this.pruebas = valor.pruebas;
    });
  }

  limpiar() {
    this.storage.remove('nadadores');
    this.nadadores = []
  }

  agregar() {
    this.crearModal(AgregarNadadorPage);
  }

  obtenerNadadores() {
    this.storage.get('nadadores').then((val) => {
      var valor = (val) ? JSON.parse(val) : { nadadores: [] };
      this.nadadores = valor.nadadores;
      this.obtenerPruebasNadador();
    });
  }

  obtenerPruebasNadador() {
    for (let a = 0; a < this.nadadores.length; a++) {
      for (let b = 0; b < this.nadadores[a].pruebas.length; b++) {
        this.storage.get('pruebas').then((val) => {
          var valor = (val) ? JSON.parse(val) : { pruebas: [] };
          var pruebas = valor.pruebas;
          var prueba = pruebas.find(pruebaEncontrda => {
            return pruebaEncontrda.id == this.nadadores[a].pruebas[b].id
          });
          if (prueba) {
            this.nadadores[a].pruebas[b].prueba = prueba.prueba;
          }
        });
      }
    }

    this.nadadoresFiltrados = this.nadadores;
    this.ordernarPorBloques();
  }

  ordernarPorBloques() {
    var vuelta = 0;
    const porBloque = 20;

    this.page = 0;
    this.nadadoresPorBloques = [];
    this.botonesIndex = [];

    console.log('Nadadores filtrados antes bloques: ', this.nadadoresFiltrados);
    for (let i = 0; i < this.nadadoresFiltrados.length; i += porBloque) {
      this.nadadoresPorBloques[vuelta] = this.nadadoresFiltrados.slice(i, i + porBloque);
      this.botonesIndex.push(vuelta);
      vuelta++;
    }

    console.log(this.nadadoresPorBloques);
  }


  async crearModal(page, params = null) {
    const modal = await this.modalCtrl.create({
      component: page,
      componentProps: {
        nadador: params
      }
    });
    modal.onDidDismiss().then(() => {
      this.obtenerNadadores();
    });
    return await modal.present();
  }

  editar(nadador) {
    this.crearModal(AgregarNadadorPage, nadador);
  }

  confirmarQuitar(nadador) {
    this.mostrarAlert(
      'Quitar nadador',
      '¿Quitar el nadador ' + nadador.nombre + ' y todos resultados?',
      [
        {
          text: 'Quitar',
          handler: () => {
            this.quitar(nadador.id);
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

    this.storage.get('resultados').then((res) => {
      var valor = JSON.parse(res);

      if (valor) {
        var resultados = valor.resultados;

        var resultadosNadador = resultados.filter((item) => {
          return item.nadador.id == id;
        });



        for (let i = 0; i < resultadosNadador.length; i++) {
          var indexRes = resultados.findIndex(resultadoEncontrado => {
            return resultadoEncontrado.id == resultadosNadador[i].id;
          });

          resultados.splice(indexRes, 1);
          this.storage.set('resultados', JSON.stringify({ resultados: resultados }));
        }
      }

      this.storage.get('nadadores').then((val) => {
        var valor = JSON.parse(val);
        var nadadores: Array<any> = valor.nadadores;
        var index = nadadores.findIndex(nadador => {
          return nadador.id == id;
        });
        nadadores.splice(index, 1);

        this.storage.set('nadadores', JSON.stringify({ nadadores: nadadores })).then(() => {
          this.nadadores = nadadores;
          //this.nadadoresFiltrados = this.nadadores;
          this.obtenerPruebasNadador();
        });
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


  filtrarPorNombre(e) {
    const val = e.target.value;
    if (val && val.trim() != '') {
      this.quitarFiltro();
      this.nadadoresFiltrados = this.nadadores.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      if (this.nadadoresFiltrados.length <= 0) {
        this.busquedaSinResultados = true;
        this.ordernarPorBloques();
      } else {
        this.ordernarPorBloques();
        this.busquedaSinResultados = false;
      }
    } else {
      this.busquedaSinResultados = false;
      if (!this.filtrandoPorCaracteristicas) {
        this.nadadoresFiltrados = this.nadadores;
        this.ordernarPorBloques();
        //this.obtenerNadadores();
      }
    }
  }

  filtrarPorCaracteristicas() {
    this.filtrandoPorCaracteristicas = true;
    this.busquedaSinResultados = false;
    this.busqueda = null;
    this.nadadoresFiltrados = this.nadadores;

    if (this.categoria) {
      this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
        return item.categoria.id == this.categoria;
      });

    }

    if (this.prueba) {
      this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
        return item.pruebas[0].id == this.prueba || item.pruebas[1].id == this.prueba;
      })

    }

    if (this.rama) {
      this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
        return item.rama == this.rama;
      });
    }

    this.ordernarPorBloques();

  }

  quitarFiltro() {
    this.filtrandoPorCaracteristicas = false;

    this.categoria = null;
    this.prueba = null;
    this.rama = null;

    this.nadadoresFiltrados = this.nadadores;
    this.ordernarPorBloques();
  }

  confirmarGenerarNadadores() {
    this.mostrarAlert(
      'Generar nadadores aleatorios',
      'Se generará la cantidad de nadadores que hayas ingresado. Se remplazarán todos los que ya existen ¿Continuar?',
      [
        {
          text: 'Generar',
          handler: () => {
            this.generarNadadores();
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

  generarNadadores() {

    var letras = "qwertyuiopasdfghjklñzxcvbnm";

    var nadadoresRamdom = [];

    if(!this.pruebas || this.pruebas.length <= 0){
      this.mostrarAlert(
        'No se pueden generar nadadores.',
        'No se pueden generar nadadores porque no hay pruebas.'
      );
      return;
    }

    if(!this.categorias || this.categorias.length <= 0){
      this.mostrarAlert(
        'No se pueden generar nadadores.',
        'No se pueden generar nadadores porque no hay categorías.'
      );
      return;
    }

    for (let i = 0; i < parseInt(this.numNadadores); i++) {

      var minutos = Math.floor(Math.random() * (60 - 0) + 0);
      var segundos = Math.floor(Math.random() * (60 - 0) + 0);
      var decimas = Math.floor(Math.random() * (100 - 0) + 0);

      var tiempo1 = {
        minutos: (minutos < 10) ? '0' + minutos : minutos.toString(),
        segundos: (segundos < 10) ? '0' + segundos : segundos.toString(),
        decimas: (decimas < 10) ? '0' + decimas : decimas.toString(),
      }

      var minutos2 = Math.floor(Math.random() * (60 - 0) + 0);
      var segundos2 = Math.floor(Math.random() * (60 - 0) + 0);
      var decimas2 = Math.floor(Math.random() * (100 - 0) + 0);

      var tiempo2 = {
        minutos: (minutos2 < 10) ? '0' + minutos2 : minutos2.toString(),
        segundos: (segundos2 < 10) ? '0' + segundos2 : segundos2.toString(),
        decimas: (decimas2 < 10) ? '0' + decimas2 : decimas2.toString(),
      }

      var pruebas = [
        {
          id: this.pruebas[Math.floor(Math.random() * this.pruebas.length)].id,
          tiempoEstimado: tiempo1.minutos + ":" + tiempo1.segundos + ":" + tiempo1.decimas,
          tiempoEstimadoInt: tiempo1.minutos + tiempo1.segundos + tiempo1.decimas,
          tiempoEstimadoObj: tiempo1
        },
        {

          id: this.pruebas[Math.floor(Math.random() * this.pruebas.length)].id,
          tiempoEstimado: tiempo2.minutos + ":" + tiempo2.segundos + ":" + tiempo2.decimas,
          tiempoEstimadoInt: tiempo2.minutos + tiempo2.segundos + tiempo2.decimas,
          tiempoEstimadoObj: tiempo2
        }
      ];

      var nombre = "";
      for (let a = 0; a < 6; a++) {
        nombre += letras[Math.floor(Math.random() * letras.length)]
      }

      var categoria = this.categorias[Math.floor(Math.random() * this.categorias.length)];
      var edad = Math.floor(Math.random() * ((parseInt(categoria.edadMayor) + 1) - parseInt(categoria.edadMenor)) +
        parseInt(categoria.edadMenor));

      var nuevoNadador = {
        nombre: nombre,
        pruebas: pruebas,
        categoria: categoria,
        edad: edad,
        rama: (Math.floor(Math.random() * (3 - 1) + 1) == 1) ? 'Varonil' : 'Femenil',
        id: i + 1,
        /*tiempoEstimado: tiempo.minutos + ":" + tiempo.segundos + ":" + tiempo.decimas,
        tiempoEstimadoInt: tiempo.minutos + tiempo.segundos + tiempo.decimas,
        tiempoEstimadoObj: tiempo*/
      }

      nadadoresRamdom.push(nuevoNadador);
    }

    nadadoresRamdom.sort(this.ordenarPorNombre);
    this.storage.set('nadadores', JSON.stringify({ nadadores: nadadoresRamdom })).then(() => {
      this.obtenerNadadores();
    });

  }

  ordenarPorNombre(a, b) {
    if (a.nombre > b.nombre) {
      return 1;
    }
    if (a.nombre < b.nombre) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  cambiarPagina(num) {
    this.page += num;
  }

}
