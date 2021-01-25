import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ModalController } from '@ionic/angular';
import { DatosFacturacionComponent } from '../datos-facturacion/datos-facturacion.component';
import { PedidosComponent } from '../pedidos/pedidos.component';
import { PoliticasComponent } from '../politicas/politicas.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { AyudaComponent } from '../ayuda/ayuda.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(public storageServ: StorageService,
              private modalCtrl: ModalController) { }

  ngOnInit() {}

  async goModal(tipo: number) {
    let modal: any;
    switch (tipo) {
      case 1:
        modal = await this.modalCtrl.create({
          component: DatosFacturacionComponent,
          cssClass: 'modal-fullscreen'
        });
        break;

      case 2:
      modal = await this.modalCtrl.create({
        component: PedidosComponent,
        cssClass: 'modal-fullscreen',
        componentProps: {
          url: 'ordenes/activas'
        }
      });
      break;

      case 3:
      modal = await this.modalCtrl.create({
        component: PedidosComponent,
        cssClass: 'modal-fullscreen'
      });
      break;

      case 4:
      modal = await this.modalCtrl.create({
        component: PoliticasComponent,
        cssClass: 'modal-fullscreen'
      });
      break;

      case 5:
      modal = await this.modalCtrl.create({
        component: PerfilComponent,
        cssClass: 'modal-fullscreen'
      });
      break;

      case 6:
      modal = await this.modalCtrl.create({
        component: AyudaComponent,
        cssClass: 'modal-fullscreen'
      });
      break;

      default:
        break;
    }

    modal.present();
  }

  cerrarSesion() {
    this.storageServ.cerrarSesion();
    this.modalCtrl.dismiss();
  }
}
