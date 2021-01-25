import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-afiliados-cards',
  templateUrl: './afiliados-cards.component.html',
  styleUrls: ['./afiliados-cards.component.scss'],
})
export class AfiliadosCardsComponent implements OnInit {

  @Input() afiliados = [];
  constructor(private storageServ: StorageService,
              public navCtrl: NavController) { }

  ngOnInit() {}

  goProductos(afiliado: any) {
    this.storageServ.afiliado = afiliado;
    this.navCtrl.navigateForward(['/productos', afiliado.id_afiliado_sucursal]);
  }
}
