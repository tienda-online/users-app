import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pedido-resumen',
  templateUrl: './pedido-resumen.component.html',
  styleUrls: ['./pedido-resumen.component.scss'],
})
export class PedidoResumenComponent implements OnInit {

  @Input() orden: any;
  constructor() { }

  ngOnInit() {}

}
