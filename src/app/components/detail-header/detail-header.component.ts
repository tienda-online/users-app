import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss'],
})
export class DetailHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() isModal = false;
  @Input() removeCart = false;
  @Input() chatHeader = false;
  @Input() repartidor: any;
  constructor(private modalCtrl: ModalController,
              private navCtrl: NavController,
              private storageServ: StorageService,
              private alertCtrl: AlertController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  async backAction() {
    if (this.storageServ.carrito.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Si regresa se reiniciará su pedido ¿Seguro desea realizar esta acción?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          }, {
            text: 'Sí, seguro',
            handler: () => {
              this.storageServ.carrito = [];
              this.storageServ.guardarCarrito();
              this.navCtrl.pop();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.navCtrl.pop();
    }
  }
}
