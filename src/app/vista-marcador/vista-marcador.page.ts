import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-vista-marcador',
  templateUrl: './vista-marcador.page.html',
  styleUrls: ['./vista-marcador.page.scss'],
})
export class VistaMarcadorPage implements OnInit {

  datos;

  resultados;
  resultadosFiltrados;
  categoria: any;
  prueba: any;
  rama;

  constructor(private route: ActivatedRoute, public storage: Storage) { }

  ngOnInit() {
    var params = this.route.snapshot.paramMap.get('datos');
    this.datos = JSON.parse(params);
    console.log(this.datos);
    this.obtenerTitulos();
    this.obtenerResultados();
  }

  obtenerTitulos(){
    this.rama = this.datos.rama;

    this.storage.get('categorias').then((val) => {
      var valor = (val)?JSON.parse(val):{categorias:[]};
      console.log(valor);
      var categorias = valor.categorias;

      this.categoria = categorias.find(categoriaEncontrada => {
        return categoriaEncontrada.id == this.datos.categoria;
      });
    });

    this.storage.get('pruebas').then((val) => {
      var valor = (val)?JSON.parse(val):{pruebas:[]};
      console.log(valor);
      var pruebas = valor.pruebas;
      this.prueba = pruebas.find(pruebaEncontrada => {
        return pruebaEncontrada.id == this.datos.prueba;
      })
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

            this.storage.get('pruebas').then((val) => {
              var pruebas = JSON.parse(val);
              var prueba = pruebas.pruebas.find(pruebaEncontrada => {
                return pruebaEncontrada.id == this.resultados[i].prueba.id;
              });

              this.resultados[i].prueba.prueba = prueba.prueba;

              this.verResultados();
            })
          })
        }
      }

      console.log('Resultados: ', this.resultados);

    });
  }

  verResultados() {
    console.log(this.resultados);
    this.resultadosFiltrados = this.resultados.filter((item) => {
      return item.nadador.categoria.id == this.datos.categoria &&
        item.prueba.id == this.datos.prueba && item.nadador.rama == this.datos.rama;
    });

    this.resultadosFiltrados.sort(this.ordenarPorTiempo);

    if(this.datos.soloPrimeros){
      this.resultadosFiltrados = this.resultadosFiltrados.slice(0,3);
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


}
