import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.page.html',
  styleUrls: ['./marcadores.page.scss'],
})
export class MarcadoresPage implements OnInit {
  categorias: any;
  pruebas: any;

  resultados;

  categoria;
  prueba;
  rama;
  soloPrimeros = false;

  resultadosFiltrados;

  datosVista;

  constructor(public storage: Storage, public router: Router) {
    this.obtenerCategorias();
    this.obtenerPruebas();
    this.obtenerResultados();
  }

  ngOnInit() {
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

  obtenerResultados() {
    this.storage.get('resultados').then((val) => {
      var valor = (val) ? JSON.parse(val) : { resultados: [] };
      this.resultados = valor.resultados;
      if (this.resultados) {
        for (let i = 0; i < this.resultados.length; i++) {
          this.storage.get('nadadores').then((val) => {
            var nadadores = JSON.parse(val);
            var nadador = nadadores.nadadores.find(nadadorEncontrado => {
              return nadadorEncontrado.id == this.resultados[i].nadador.id;
            });

            this.resultados[i].nadador.nombre = nadador.nombre;
            this.resultados[i].nadador.categoria = nadador.categoria;
            this.resultados[i].nadador.rama = nadador.rama;
          })

          this.storage.get('pruebas').then((val) => {
            var pruebas = JSON.parse(val);
            var prueba = pruebas.pruebas.find(pruebaEncontrada => {
              return pruebaEncontrada.id == this.resultados[i].prueba.id;
            });

            this.resultados[i].prueba.prueba = prueba.prueba;
          })
        }
      }

      console.log('Resultados: ', this.resultados);
    });
  }

  verResultados() {
    console.log(this.resultados);
    this.resultadosFiltrados = this.resultados.filter((item) => {
      return item.nadador.categoria.id == this.categoria &&
        item.prueba.id == this.prueba && item.nadador.rama == this.rama;
    });

    this.resultadosFiltrados.sort(this.ordenarPorTiempo);

    if (this.soloPrimeros) {
      this.resultadosFiltrados = this.resultadosFiltrados.slice(0, 3);
    }

    this.datosVista = {
      prueba: this.prueba,
      categoria: this.categoria,
      rama: this.rama,
      soloPrimeros: this.soloPrimeros
    }

    console.log('Resultados filtrados: ', this.resultadosFiltrados);
  }

  ordenarPorTiempo(a, b) {
    console.log('Tiempo: ', parseInt(a.tiempoInt));
    if (parseInt(a.tiempoInt) > parseInt(b.tiempoInt)) {
      return 1;
    }
    if (parseInt(a.tiempoInt) < parseInt(b.tiempoInt)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  abrirEnVentana() {
    /*window.open('/vista-marcador/{"prueba":"'+this.prueba+
    '","categoria":"'+this.categoria+'","rama":"'+this.rama+'","soloPrimeros":'
    +this.soloPrimeros+'}','','toolbar=yes');*/
    //this.router.navigateByUrl('/vista-marcador/'+JSON.stringify(this.datosVista));
    window.open('index.html#/vista-marcador/' + JSON.stringify(this.datosVista), '', 'toolbar=yes');
    //window.open('#/vista-marcador/'+JSON.stringify(this.datosVista),'','toolbar=yes');

  }

  exportarExcel() {
    var fecha = moment().format('DD-MM-YY');

    var pruebaSeleccionada = this.pruebas.find(pruebaEncontrada => {
      return pruebaEncontrada.id == this.prueba
    });

    var categoriaSeleccionada = this.categorias.find(categoriaEncontrada => {
      return categoriaEncontrada.id == this.categoria
    });

    var filename = "Resultados: " + categoriaSeleccionada.edadMenor + " a " + categoriaSeleccionada.edadMayor
      + " - " + pruebaSeleccionada.prueba + " - " + this.rama + " - " + fecha;

    var tableHTML = "<meta http-equiv='content-type' content='application/vnd.ms-excel; charset=UTF-8'>";

    tableHTML += "<table>";

    tableHTML += "<tr><th></th><th> <strong>Rama:</strong>&nbsp;" + this.rama + "</th></tr>";
    tableHTML += "<tr><th></th><th> <strong>Categoría:</strong>&nbsp;" + categoriaSeleccionada.edadMenor + "&nbsp; a &nbsp;" + categoriaSeleccionada.edadMayor + "</th></tr>";
    var prueba = pruebaSeleccionada.prueba.replace(/\s/g, "&nbsp;");
    tableHTML += "<tr><th></th><th> <strong>Prueba:</strong>&nbsp;" + prueba + "</th></tr>";
    tableHTML += "<tr></tr>";

    tableHTML += "<tr><th>Lugar</th> <th>Nombre</th><th>Tiempo</th></tr>";

    for (let i = 0; i < this.resultadosFiltrados.length; i++) {
      tableHTML += "<tr><th>" + (i + 1) + "</th> <td>" + this.resultadosFiltrados[i].nadador.nombre +
        "</td><td> '" + this.resultadosFiltrados[i].tiempo + "' </td></tr>";
      console.log('Tiempo excel: ', this.resultadosFiltrados[i].tiempo);
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

}
