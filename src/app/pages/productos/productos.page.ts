import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { IonSegment } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  @ViewChild(IonSegment, {static: true}) segment: IonSegment;
  sucursalId: any;
  sucursalName = '';
  afiliado: any;
  categorias = [];
  subcategorias = [];
  productos = [];
  subcategoriaSeleccion = 0;
  cantidad = 1;
  constructor(private activatedRoute: ActivatedRoute,
              private storageServ: StorageService,
              private requestServ: RequestService) { }

  ngOnInit() {
    this.sucursalId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getData();
  }

  async getData() {
    const response = await this.requestServ.getProductosBySucursal(this.sucursalId);
    if (response[0]) {
      this.sucursalName = response[1].afiliado.nombres;
      this.afiliado = response[1].afiliado;
      this.categorias = response[1].categorias;
      this.segment.value = this.categorias[0].id_afiliado_categoria;
    }
  }

  cambioCategoria(event) {
    this.subcategorias = [];
    this.productos = [];
    this.segment.value = event.detail.value;
    const localCategoria = this.categorias.find((data) => data.id_afiliado_categoria === Number(event.detail.value));
    if (localCategoria.subcategorias) {
      this.subcategorias = localCategoria.subcategorias;
      this.subcategoriaSeleccion = this.subcategorias[0].id_subcategoria;
      this.setProductos();
    } else {
      this.setProductos(false, localCategoria.productos);
    }
  }

  cambioSubcategoria(event) {
    this.subcategoriaSeleccion = event.detail.value;
    this.setProductos();
  }

  setProductos(subcategoria = true, info = []) {
    this.productos = [];
    const productos = (subcategoria) ? this.subcategorias.find((data) => data.id_subcategoria === Number(this.subcategoriaSeleccion)).productos : info;
    for(const producto of productos) {
      this.productos.push({info: producto, cantidad: 0});
    }
  }

  operation(action: boolean, index: number) {
    if (action) {
      this.productos[index].cantidad = this.productos[index].cantidad  + 1;
    } else {
      this.productos[index].cantidad = this.productos[index].cantidad  - 1;
    }

    this.storageServ.guardarProductos(this.productos[index], action);
  }
}
