import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../chat/chat.component';
import { RequestService } from '../../services/request.service';
import { environment } from 'src/environments/environment';
import { CallNumber } from '@ionic-native/call-number/ngx';
declare var google;

@Component({
  selector: 'app-pedido-ubicacion',
  templateUrl: './pedido-ubicacion.component.html',
  styleUrls: ['./pedido-ubicacion.component.scss'],
})
export class PedidoUbicacionComponent implements OnInit, OnDestroy {

  @Input() orden: any;
  @ViewChild('map', {static: true}) map: any;
  marker: any;
  conf: any;
  interval: any;
  position = [-2.109928, -79.872109];
  showMap = false;
  tiempo = '';
  constructor(private modalCtrl: ModalController,
              private requestServ: RequestService,
              private callNumber: CallNumber) { }

  ngOnInit() {
    this.chargeMap();
    this.getUbicacion(true);
    this.interval = setInterval(() => this.getUbicacion(), 10000);
  }

  chargeMap() {
    const mapOptions = {
      center: new google.maps.LatLng(this.position[0], this.position[1]),
      zoom: 15,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: environment.googleMapsStyles,
    };
    this.map = new google.maps.Map(this.map.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      position: {lat: this.position[0], lng: this.position[1]},
      map: this.map,
    });

    this.marker.setIcon('./assets/images/repmarker.png');
  }

  async openChat() {
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      cssClass: 'modal-fullscreen',
      componentProps: {
        idOrden: this.orden.id_orden,
      }
    });

    modal.present();
  }

  async getUbicacion(loading = false) {
    const response = await this.requestServ.getUbicacionOrden(this.orden.id_orden, loading);
    if (response[0]) {
      const result = [response[1].ubicacion_repartidor.latitud, response[1].ubicacion_repartidor.longitud];
      this.conf = {
        contador: 0,
        deltaLat: (result[0] - this.position[0]) / 100,
        deltaLng: (result[1] - this.position[1]) / 100,
        delay: 10,
      };
      this.moveMarker();
      this.calculateDistance(result);
      this.showMap = true;
    }
  }

  moveMarker() {
    this.position[0] += this.conf.deltaLat;
    this.position[1] += this.conf.deltaLng;
    const latlng = new google.maps.LatLng(this.position[0], this.position[1]);
    this.map.setCenter(latlng);
    this.marker.setPosition(latlng);
    if (this.conf.contador !== 100) {
        this.conf.contador++;
        setTimeout( () => this.moveMarker(), 10);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  llamar() {
    this.callNumber.callNumber(this.orden.repartidor.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  calculateDistance(coords: any) {
    const origin = new google.maps.LatLng(coords[0], coords[1]);
    const destination = new google.maps.LatLng(Number(this.orden.cliente.direccion.latitud), Number(this.orden.cliente.direccion.longitud));
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
      }, (response: any, status: any) => {
        if (response.rows.length > 0) {
          this.tiempo = response.rows[0].elements[0].duration.text;
        }
      });
  }
}
