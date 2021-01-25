import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { RequestService } from '../../services/request.service';
import { RecoverComponent } from '../recover/recover.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  usuario = {
    correo: '',
    contrasena: ''
  }
  constructor(public modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private requestServ: RequestService,) { }

  ngOnInit() {}

  async login() {
    const body = JSON.stringify(this.usuario);
    const response = await this.requestServ.login(body);
    if (response) {
      this.modalCtrl.dismiss();
    }
  }

  async goRegistro() {
    const modal = await this.modalCtrl.create({
      component: RegistroComponent,
      cssClass: 'modal-fullscreen'
    });

    modal.present();
  }

  async recoverPass() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperar contraseña',
      message: 'Por favor ingrese su correo para verificar la cuenta.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Ejemplo: johndoe@fomatmedical.com'
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Verificar',
          handler: async (data) => {
            if (data.email) {
              const body = JSON.stringify({'correo': data.email});
              const response = await this.requestServ.recoverRequest(body);
              if (response) {
                this.openPasswordModal(data.email);
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openPasswordModal(correo: string) {
    const modal = await this.modalCtrl.create({
      component: RecoverComponent,
      cssClass: 'modal-fullscreen',
      componentProps: {
        correo
      }
    });
    modal.present();
  }
}
