import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControllersService } from '../../services/controllers.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent implements OnInit {

  @Input() correo: string;
  recover = {
    contrasena: '',
    confirmar: '',
    clave_temporal: ''
  }
  constructor(private controlServ: ControllersService,
              private requestServ: RequestService,
              private modalCtrl: ModalController) { }

  ngOnInit() {}


  async recoverPassword() {
    if (this.recover.contrasena !== this.recover.confirmar) {
      this.controlServ.errorToast('Contraseñas deben ser iguales');
      return;
    }
    const body = JSON.stringify({...this.recover, correo: this.correo});
    const response = await this.requestServ.recoverPassword(body);
    if (response) {
      this.modalCtrl.dismiss();
    }
  }

}
