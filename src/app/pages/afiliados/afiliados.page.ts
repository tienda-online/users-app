import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.page.html',
  styleUrls: ['./afiliados.page.scss'],
})
export class AfiliadosPage implements OnInit {

  idCategoria: any;
  afiliados = [];
  backup = [];
  constructor(private activatedRoute: ActivatedRoute,
              public navCtrl: NavController,
              private requestServ: RequestService) { }

  ngOnInit() {
    this.idCategoria = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAfiliados();
  }

  async getAfiliados() {
    const response = await this.requestServ.getAfiliadosByCategoria(this.idCategoria);
    if (response[0]) {
      this.afiliados = response[1];
      this.backup = response[1];
    }
  }

  buscar(e: any) {
    if (e.detail.value.length === 0 ) {
      this.afiliados = this.backup;
      return;
    }
    this.afiliados = this.backup.filter( (info: any) => info.nombre_afiliado.toLowerCase().indexOf(e.detail.value.toLowerCase()) > -1);
  }
}
