import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { RequestService } from 'src/app/services/request.service';
import { NavController } from '@ionic/angular';
import { ControllersService } from '../../services/controllers.service';

@Component({
  selector: 'app-productos-detalle',
  templateUrl: './productos-detalle.page.html',
  styleUrls: ['./productos-detalle.page.scss'],
})
export class ProductosDetallePage implements OnInit {

  productoId: any;
  producto: any;
  sucursalName = '';
  afiliado: any;
  extrasSeleccion = [];
  preferencias = [];
  notaAdicional = '';
  constructor(private activatedRoute: ActivatedRoute,
              private storageServ: StorageService,
              private navCtrl: NavController,
              private controlServ: ControllersService,
              private requestServ: RequestService) { }

  ngOnInit() {
    this.productoId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getData();
  }


  async getData() {
    const response = await this.requestServ.getProductosDetailById(this.productoId);
    if (response[0]) {
      this.sucursalName = response[1].afiliado.nombres;
      this.afiliado = response[1].afiliado;
      this.producto = response[1].producto;
    }
  }

  manageDetalle(preferencia: any, detalle: any) {
    let index = 0;
    const flag = this.preferencias.findIndex((data: any) => data.id_producto_preferencia === preferencia.id_producto_preferencia);
    if (flag === -1) {
      this.preferencias.push({ id_producto_preferencia: preferencia.id_producto_preferencia, nombre: preferencia.nombre});
      index = this.preferencias.length - 1;
    } else {
      index = flag;
    }
    this.preferencias[index].seleccion = detalle;
  }

  manageExtra(extra: any) {
    const flag = this.extrasSeleccion.findIndex(data => data.id_producto_extra === extra.id_producto_extra);
    if (flag >= 0) {
      this.extrasSeleccion.splice(flag, 1);
    } else {
      this.extrasSeleccion.push(extra);
    }
  }

  addCarrito() {
    if (this.producto.preferencias && this.preferencias.length < this.producto.preferencias.length) {
      this.controlServ.errorToast('Por favor seleccione todas sus preferencias');
      return;
    }
    this.storageServ.carrito.push({id: this.productoId, info: this.producto, extras: this.extrasSeleccion, preferencias: this.preferencias, notas: this.notaAdicional, cantidad: 1});
    this.navCtrl.pop();
    this.storageServ.guardarCarrito();
  }
}
