import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { AlertController, ModalController } from '@ionic/angular';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  items = [];
  body = [];
  total = 0;
  constructor(public storageServ: StorageService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private requestServ: RequestService) { }

  ngOnInit() {
    this.checkCarrito();
  }

  checkCarrito() {
    this.items = [];
    for (const item of this.storageServ.carrito) {
      let total = 0;
      if (item.info.is_plato === '1'){
        const plato = this.normalizePlato(item);
        this.body.push(plato);

        for (const extra of item.extras) {
          total = total + extra.precio;
        }

        for (const preferencia of item.preferencias) {
          total = total + preferencia.seleccion.precio;
        }
      } else {
        this.body.push({id_producto: Number(item.info.id_producto), cantidad: item.cantidad});
      }

      let subtotal = item.info.precio;
      if (item.info.descuento.valor === 0) {
        if (item.info.descuento.is_porcentaje === '0') {
          subtotal = item.info.precio - item.info.descuento.valor;
        }else{
          subtotal = item.info.precio - (item.info.precio * (item.info.descuento.valor / 100));
        }
      }
      total = total + subtotal;
      this.total = this.total + total;
      this.items.push({...item, total});
    }
  }

  normalizePlato(item: any) {
    const extras = item.extras.map((extra: any) => extra.id_producto_extra);
    const preferencias = item.preferencias.map((preferencia: any) => preferencia.seleccion.id_preferencia_detalle);
    const plato = {
      id_producto: Number(item.id),
      extras,
      preferencias,
      cantidad: item.cantidad,
      detalles: item.notas
    };
    return plato;
  }

  async deleteProducto(i: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Seguro que desea eliminar esta producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Sí, seguro',
          handler: () => {
            this.deleteProductoRequest(i);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteProductoRequest(i: number) {
    this.storageServ.carrito.splice(i, 1);
    this.items.splice(i, 1);
    this.checkCarrito();
    if (this.storageServ.carrito.length === 0) {
      this.close();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async checkout() {
    const previousBody = {
      cliente: {
        direccion: {
          id_usuario_direccion: 0,
          direccion: this.storageServ.ubicacion.direccion,
          latitud: this.storageServ.ubicacion.latitud.toString(),
          longitud: this.storageServ.ubicacion.longitud.toString(),
        },
      },
      tipo: this.storageServ.afiliado.tipo,
      sucursal: { id_afiliado_sucursal: this.storageServ.afiliado.id_afiliado_sucursal },
      productos: [...this.body]
    };
    const body = JSON.stringify(previousBody);
    const response = await this.requestServ.createOrden(body);
    if (response) {
      this.storageServ.carrito = [];
      this.storageServ.guardarCarrito();
      this.modalCtrl.dismiss({
        orderOk: true
      });
    }
  }
}
