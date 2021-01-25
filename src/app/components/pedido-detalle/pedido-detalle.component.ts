import { Component, Input, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.scss'],
})
export class PedidoDetalleComponent implements OnInit {

  @Input() idOrden: number;
  submenu = 1;
  orden: any;
  estados = {
    FCS: {texto: 'Confirmando Orden', color: 'warning', active: false, refresh: true},
    OPBR: {texto: 'Buscando repartidor', color: 'warning', active: false, refresh: true},
    OPRC: {texto: 'Repartidor en camino', color: 'primary', active: true, refresh: true},
    OPRL: {texto: 'Repartidor Listo', color: 'primary', active: true, refresh: true},
    OLBR: {texto: 'Buscando repartidor', color: 'primary', active: false, refresh: true},
    OLRC: {texto: 'Repartidor en camino', color: 'primary', active: true, refresh: true},
    RCU: {texto: 'Repartidor entregando pedido', color: 'primary', active: true},
    C: {texto: 'Orden cancelada', color: 'danger', active: false, refresh: false},
    E: {texto: 'Orden eliminadada', color: 'danger', active: false, refresh: false},
    T: {texto: 'Orden Terminada', color: 'success', active: false, refresh: false},
  };
  constructor(private requestServ: RequestService) { }

  ngOnInit() {
    this.getOrdenById();
  }

  async getOrdenById() {
    const response = await this.requestServ.getOrdenByID(this.idOrden);
    if (response[0]) {
      this.orden = response[1];
    }
  }

  changeSubmenu(option: number) {
    this.submenu = option;
  }

  doRefresh(event: any) {
    this.getOrdenById();
    event.target.complete();
  }
}
