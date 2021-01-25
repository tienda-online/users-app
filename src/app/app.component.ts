import { StorageService } from './services/storage.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storageServ: StorageService,
    private pushServ: PushService,
    private router: Router
  ) {
      this.initializeApp();
  }

  initializeApp() {
    this.storageServ.cargarTutorial().then(async (tutorial) => {
      this.setRoot(tutorial);
      this.platform.ready().then(() => {
        this.pushServ.configuracionInicial();
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    });
  }

  async setRoot(tutorial) {
    if (tutorial) {
      const ubicacion = await this.storageServ.cargarUbicacion();
      if (ubicacion) {
        this.storageServ.ubicacion = ubicacion;
      } else {
        this.router.navigateByUrl('/ubicacion');
      }
    } else {
      this.router.navigateByUrl('/slides');
    }
  }
}
