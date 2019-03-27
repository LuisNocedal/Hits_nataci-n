import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-vista-hits',
  templateUrl: './vista-hits.page.html',
  styleUrls: ['./vista-hits.page.scss'],
})
export class VistaHitsPage implements OnInit {

  datos;

  rama;
  categoria;
  prueba;

  nadadores: any;
  nadadoresFiltrados;

  columnas = [];

  categorias: any;
  pruebas: any;

  hits = [];

  constructor(private route: ActivatedRoute, public storage: Storage) { }

  ngOnInit() {
    var params = this.route.snapshot.paramMap.get('datos');
    this.datos = JSON.parse(params);
    console.log(this.datos);
    this.obtenerTitulos();

    //this.inicializarColumnas();
    this.obtenerCategorias();
    this.obtenerPruebas();
    this.obtenerNadadores();
    //this.obtenerResultados();
  }

  obtenerTitulos() {
    this.rama = this.datos.rama;

    this.storage.get('categorias').then((val) => {
      var valor = (val) ? JSON.parse(val) : { categorias: [] };
      console.log(valor);
      var categorias = valor.categorias;

      this.categoria = categorias.find(categoriaEncontrada => {
        return categoriaEncontrada.id == this.datos.categoria;
      });
    });

    this.storage.get('pruebas').then((val) => {
      var valor = (val) ? JSON.parse(val) : { pruebas: [] };
      console.log(valor);
      var pruebas = valor.pruebas;
      this.prueba = pruebas.find(pruebaEncontrada => {
        return pruebaEncontrada.id == this.datos.prueba;
      })
    });
  }

  inicializarColumnas() {
    for (let i = 0; i < this.datos.nadadoresPorHit; i++) {
      this.columnas.push(i+1);
    }
    console.log('Columnas: ', this.columnas);
    this.filtrar();
  }

  obtenerCategorias() {
    this.storage.get('categorias').then((val) => {
      var valor = (val) ? JSON.parse(val) : { categorias: [] };
      console.log(valor);
      this.categorias = valor.categorias;
    });
  }

  obtenerPruebas() {
    this.storage.get('pruebas').then((val) => {
      var valor = (val) ? JSON.parse(val) : { pruebas: [] };
      console.log(valor);
      this.pruebas = valor.pruebas;
    });
  }

  obtenerNadadores() {
    this.storage.get('nadadores').then((val) => {
      var valor = (val) ? JSON.parse(val) : { nadadores: [] };
      this.nadadores = valor.nadadores;
      this.obtenerPruebasNadador();
    });
  }

  obtenerPruebasNadador() {
    this.storage.get('pruebas').then((val) => {
      var valor = (val) ? JSON.parse(val) : { pruebas: [] };
      var pruebas = valor.pruebas;
      for (let a = 0; a < this.nadadores.length; a++) {
        for (let b = 0; b < this.nadadores[a].pruebas.length; b++) {
          var prueba = pruebas.find(pruebaEncontrda => {
            return pruebaEncontrda.id == this.nadadores[a].pruebas[b].id
          });
          if (prueba) {
            this.nadadores[a].pruebas[b].prueba = prueba.prueba;
          }
        }
      }
      console.log(this.nadadores);
      this.nadadoresFiltrados = this.nadadores;
      this.inicializarColumnas();
      //this.filtrar();
    });
  }

  filtrar() {
    /*this.filtrandoPorCaracteristicas = true;
    this.busquedaSinResultados = false;
    this.busqueda = null;*/
    this.nadadoresFiltrados = this.nadadores;

    this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
      return item.categoria.id == this.datos.categoria;
    });

    this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
      return item.pruebas[0].id == this.datos.prueba || item.pruebas[1].id == this.datos.prueba;
    })

    this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
      return item.rama == this.datos.rama;
    });

    for (let i = 0; i < this.nadadoresFiltrados.length; i++) {
      if(this.nadadoresFiltrados[i].pruebas[0].id == this.prueba){
        this.nadadoresFiltrados[i].pruebaFiltro = this.nadadoresFiltrados[i].pruebas[0];
      }else{
        this.nadadoresFiltrados[i].pruebaFiltro = this.nadadoresFiltrados[i].pruebas[1];
      }
    }

    console.log('Nadadores filtrados: ', this.nadadoresFiltrados);
    this.ordernarHits();
  }

  ordernarHits() {
    this.nadadoresFiltrados.sort(this.ordenarPorTiempo);
    var vuelta = 0;
    for (let i = 0; i < this.nadadoresFiltrados.length; i += this.datos.nadadoresPorHit) {
      console.log('I: ', i);
      this.hits[vuelta] = this.nadadoresFiltrados.slice(i, i + this.datos.nadadoresPorHit);
      vuelta++;
    }
    console.log(this.hits);
  }

  ordenarPorTiempo(a, b) {
    if (parseInt(a.pruebaFiltro.tiempoEstimadoInt) > parseInt(b.pruebaFiltro.tiempoEstimadoInt)) {
      return 1;
    }
    if (parseInt(a.pruebaFiltro.tiempoEstimadoInt) < parseInt(b.pruebaFiltro.tiempoEstimadoInt)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

}
