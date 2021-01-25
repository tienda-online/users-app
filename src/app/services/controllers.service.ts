import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  loading: any;
  constructor(private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) { }

  successToast(msg: string) {
    this.showToast(msg, 3000, 'bottom', 'success');
  }

  errorToast(msg: string) {
    this.showToast(msg, 3000, 'bottom', 'danger');
  }

  async showAlert(title: string, subtitle: string, msg: string, btnname: string) {
    const alert = await this.alertCtrl.create({
    header: title,
    subHeader: subtitle,
    message: msg,
    buttons: [btnname]
    });
    await alert.present();
  }

  async showToast(msg: string, time: number, pos: any, clr: string) {
    const toast = await this.toastCtrl.create({
    message: msg,
    duration: time,
    position: pos,
    color: clr
    });
    toast.present();
  }

  async showLoading(msg: string) {
    this.loading = await this.loadingCtrl.create({
    message: msg,
    });
    await this.loading.present();
  }
}
