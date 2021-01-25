import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido-tracking',
  templateUrl: './pedido-tracking.component.html',
  styleUrls: ['./pedido-tracking.component.scss'],
})
export class PedidoTrackingComponent implements OnInit {

  @Input() orden: any;
  constructor() { }

  ngOnInit() {
    console.log("ORDEN", this.orden);
  }

}
