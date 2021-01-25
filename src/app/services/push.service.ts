import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private oneSignal: OneSignal, private storage: Storage) { }

  configuracionInicial() {
    this.oneSignal.startInit('9975151b-07df-4e4c-8763-3e90e5eccace', '8928662729');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(() => {
     // do something when notification is received
    });
    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });
    this.oneSignal.getIds().then(info => {
      this.storage.set('pushtoken', info.userId);
    });
    this.oneSignal.endInit();
  }
}
