import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-hits',
  templateUrl: './hits.page.html',
  styleUrls: ['./hits.page.scss'],
})
export class HitsPage implements OnInit {

  nadadores;
  nadadoresFiltrados: Array<any>;

  categorias;
  pruebas;

  categoria;
  prueba;
  rama;
  nadadoresPorHit = 5;

  hits = [];

  columnas = [];
  datosVista: any;

  constructor(public storage: Storage) { }

  ngOnInit() {
    //this.inicializarColumnas();
    this.obtenerCategorias();
    this.obtenerPruebas();
    this.obtenerNadadores();
  }

  inicializarColumnas() {
    this.columnas = [];
    for (let i = 0; i < this.nadadoresPorHit; i++) {
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
    });

    console.log(this.nadadores);
    this.nadadoresFiltrados = this.nadadores;
  }

  filtrar() {
    /*this.filtrandoPorCaracteristicas = true;
    this.busquedaSinResultados = false;
    this.busqueda = null;*/
    this.nadadoresFiltrados = this.nadadores;

    this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
      return item.categoria.id == this.categoria;
    });

    this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
      return item.pruebas[0].id == this.prueba || item.pruebas[1].id == this.prueba;
    })

    this.nadadoresFiltrados = this.nadadoresFiltrados.filter((item) => {
      return item.rama == this.rama;
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
    this.hits = [];
    for (let i = 0; i < this.nadadoresFiltrados.length; i += this.nadadoresPorHit) {
      this.hits[vuelta] = this.nadadoresFiltrados.slice(i, i + this.nadadoresPorHit);
      vuelta++;
    }
    console.log(this.hits);
    this.datosVista = {
      prueba: this.prueba,
      categoria: this.categoria,
      rama: this.rama,
      nadadoresPorHit: this.nadadoresPorHit
    }
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

  exportarExcel() {
    var fecha = moment().format('DD-MM-YY');

    var pruebaSeleccionada = this.pruebas.find(pruebaEncontrada => {
      return pruebaEncontrada.id == this.prueba
    });

    var categoriaSeleccionada = this.categorias.find(categoriaEncontrada => {
      return categoriaEncontrada.id == this.categoria
    });

    var filename = "Hits: " + categoriaSeleccionada.edadMenor + " a " + categoriaSeleccionada.edadMayor
      + " - " + pruebaSeleccionada.prueba + " - " + this.rama + " - " + fecha;

    var tableHTML = "<meta http-equiv='content-type' content='application/vnd.ms-excel; charset=UTF-8'>";
    
    tableHTML += "<table>";

    tableHTML += "<tr><th></th><th> <strong>Rama:</strong>&nbsp;" + this.rama  +"</th></tr>";
    tableHTML += "<tr><th></th><th> <strong>Categoría:</strong>&nbsp;" + categoriaSeleccionada.edadMenor + "&nbsp; a &nbsp;" + categoriaSeleccionada.edadMayor  +"</th></tr>";
    var prueba = pruebaSeleccionada.prueba.replace(/\s/g, "&nbsp;");
    tableHTML += "<tr><th></th><th> <strong>Prueba:</strong>&nbsp;" + prueba +"</th></tr>";
    tableHTML += "<tr></tr>";
    tableHTML += "<tr><th></th>";
    for (let i = 0; i < this.nadadoresPorHit; i++) {
      tableHTML += "<th>" + (i+1) + "</th>";
    };
    tableHTML += "</tr>";

    for (let a = 0; a < this.hits.length; a++) {
      tableHTML += "<tr>";
      tableHTML += "<th>" + (a + 1) + "</th>";
      for (let b = 0; b < this.hits[a].length; b++) {
        var nombre = this.hits[a][b].nombre.replace(/\s/g, "&nbsp;");
        console.log('Nombre: ', nombre);
        tableHTML += "<td>"
        tableHTML += "<strong>Nombre:</strong>&nbsp;" + nombre + " \n ";
        tableHTML += "<strong>Tiempo:</strong>&nbsp;" + this.hits[a][b].pruebaFiltro.tiempoEstimado + "";
        tableHTML += "</td>";
      }
      tableHTML += "</tr>"
    }

    tableHTML += "</table>";

    var downloadLink;
    var dataType = 'application/vnd.ms-excel';

    filename = filename ? filename + '.xls' : 'excel_data.xls';

    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      var blob = new Blob(['ufeff', tableHTML], {
        type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

      downloadLink.download = filename;

      downloadLink.click();
    }
  }

  abrirEnVentana() {
    window.open('index.html#/vista-hits/'+JSON.stringify(this.datosVista),'','toolbar=yes');
    //window.open('#/vista-hits/' + JSON.stringify(this.datosVista), '', 'toolbar=yes');

  }

}
