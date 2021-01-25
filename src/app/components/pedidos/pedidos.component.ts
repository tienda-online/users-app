import { Component, Input, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ControllersService } from '../../services/controllers.service';
import { ModalController } from '@ionic/angular';
import { PedidoDetalleComponent } from '../pedido-detalle/pedido-detalle.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  @Input() url = 'ordenes';
  ordenes = [];
  estados = {
    FCS: {texto: 'Confirmando Orden', color: 'warning', active: false},
    OPBR: {texto: 'Buscando repartidor', color: 'warning', active: false},
    OPRC: {texto: 'Repartidor en camino', color: 'primary', active: true},
    OPRL: {texto: 'Repartidor Listo', color: 'primary', active: true},
    OLBR: {texto: 'Buscando repartidor', color: 'primary', active: false},
    OLRC: {texto: 'Repartidor retirando pedido', color: 'primary', active: true},
    RCU: {texto: 'Repartidor entregando pedido', color: 'primary', active: true},
    C: {texto: 'Orden cancelada', color: 'danger', active: false},
    E: {texto: 'Orden eliminadada', color: 'danger', active: false},
    T: {texto: 'Orden Terminada', color: 'success', active: false},
  };
  loading = false;
  constructor(private requestServ: RequestService,
              private modalCtrl: ModalController,
              private controllserServ: ControllersService) { }

  ngOnInit() {
    this.getOrdenesActivas();
  }

  async getOrdenesActivas() {
    this.loading = true;
    await this.controllserServ.showLoading('Cargando...');
    const response = await this.requestServ.getOrdenes(this.url);
    if (response[0]) {
      this.ordenes = (this.url !== 'ordenes') ? response[1].ordenes : response[1];
      this.controllserServ.loading.dismiss();
      this.loading = false;
    }
  }

  async goOrden(id: number) {
    const modal = await this.modalCtrl.create({
      component: PedidoDetalleComponent,
      cssClass: 'modal-fullscreen',
      componentProps: {
        idOrden: id,
      }
    });

    modal.present();
  }

  doRefresh(event) {
    this.ordenes = [];
    this.getOrdenesActivas();
    event.target.complete();
  }
}
