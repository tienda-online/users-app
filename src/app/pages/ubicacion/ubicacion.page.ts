import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { environment } from 'src/environments/environment';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { NavController } from '@ionic/angular';
declare var google;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  ubicacion = {
    direccion: '',
    latitud: 0,
    longitud: 0
  };
  marker: any;
  autocompleteItems = [];
  GoogleAutocomplete: any;
  GoogleGeocoder: any;

  constructor(private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              private router: Router,
              private requestServ: RequestService,
              public storageServ: StorageService,
              public navCtrl: NavController, 
              public zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.GoogleGeocoder = new google.maps.Geocoder();
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.ubicacion.latitud = resp.coords.latitude;
      this.ubicacion.longitud = resp.coords.longitude;
      this.loadMap();
    }).catch((error) => {
      this.loadMap();
    });
  }

  loadMap() {
    const latLng = new google.maps.LatLng(this.ubicacion.latitud, this.ubicacion.longitud);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: environment.googleMapsStyles,
    };

    this.getAddressFromCoords(this.ubicacion.latitud, this.ubicacion.longitud);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    });

    this.marker.setIcon('./assets/images/marker.png');

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.ubicacion.latitud = event.latLng.lat();
      this.ubicacion.longitud = event.latLng.lng();
      this.moveMarker(true);
    });
  }

  getAddressFromCoords(lat, lng) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lat, lng, options).then((result: NativeGeocoderResult[]) => {
        this.ubicacion.direccion = '';
        const responseAddress = [];
        for (const [key, value] of Object.entries(result[0])) {
          if ( value.length > 0 ){
            responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        for (const value of responseAddress) {
          this.ubicacion.direccion += value + ', ';
        }
        this.ubicacion.direccion = this.ubicacion.direccion.slice(0, -2);
      })
      .catch((error: any) => {
        console.log(error);
        this.ubicacion.direccion = 'Dirección Personalizada';
      });
  }

  getCoordsFromAddress(placeId) {
    return new Promise(resolve => {
      this.GoogleGeocoder.geocode({placeId}, (result, status) => {
        resolve(result[0]);
      });
    });
  }

  UpdateSearchResults(){
    if (this.ubicacion.direccion === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({input: this.ubicacion.direccion, componentRestrictions: {country: 'ec'}, fields: ['geometry']},
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if (predictions) {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        }
      });
    });
  }

  async SelectSearchResult(item) {
    this.autocompleteItems = [];
    this.ubicacion.direccion = item.description;
    const data: any = await this.getCoordsFromAddress(item.place_id);
    this.ubicacion.latitud = data.geometry.location.lat();
    this.ubicacion.longitud = data.geometry.location.lng();
    this.moveMarker(false);
  }

  ClearAutocomplete(){
    this.autocompleteItems = [];
    this.ubicacion.direccion = '';
  }

  moveMarker(checkAddress) {
    const latlng = new google.maps.LatLng(this.ubicacion.latitud, this.ubicacion.longitud);
    this.map.setCenter(latlng);
    this.marker.setPosition(latlng);
    if(checkAddress) {
      this.getAddressFromCoords(this.ubicacion.latitud, this.ubicacion.longitud);
    }
  }

  async saveUbicacion() {
    const body = {
      latitud: `${this.ubicacion.latitud}`,
      longitud: `${this.ubicacion.longitud}`,
    }
    const response = await this.requestServ.checkUbicacion(body);
    if (response) {
      this.storageServ.guardarUbicacion(this.ubicacion);
      this.router.navigateByUrl('/home');
    }
  }
}
