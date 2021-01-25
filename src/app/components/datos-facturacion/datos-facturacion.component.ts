import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-datos-facturacion',
  templateUrl: './datos-facturacion.component.html',
  styleUrls: ['./datos-facturacion.component.scss'],
})
export class DatosFacturacionComponent implements OnInit {

  facturacion = {
    isRuc: false,
    identificacion: '',
    razon_social: '',
    direccion: '',
    telefono: '',
    correo: '',
  };
  constructor(private requestServ: RequestService,
              private modalCtrl: ModalController) { }

  ngOnInit() {}

  segmentChanged(event) {
    this.facturacion.isRuc = (event.detail.value === 'true') ? true : false;
  }

  async guardar() {
    const copy = {...this.facturacion, tipo: (this.facturacion.isRuc) ? '' : ''};
    const body = JSON.stringify(copy);
    const response = await this.requestServ.createFacturacion(body);

    if (response) {
      this.modalCtrl.dismiss();
    }
  }
}
