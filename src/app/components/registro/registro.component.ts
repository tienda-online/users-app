import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { RequestService } from '../../services/request.service';
import { StorageService } from '../../services/storage.service';
import { ControllersService } from '../../services/controllers.service';
import { PoliticasComponent } from '../politicas/politicas.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {

  usuario = {
    imagen: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    telefono: ''
  };
  registro = false;
  codigo = '';
  constructor(private camera: Camera,
              private domsanitizer: DomSanitizer,
              private requestServ: RequestService,
              private controllersServ: ControllersService,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {}

  async registrar() {
    const copy = {...this.usuario, telefono: `+593${this.usuario.telefono}`, imagen: `data:image/jpeg;base64,${this.usuario.imagen}`};
    if (this.usuario.imagen === '') {
      delete copy.imagen;
    }
    const body = JSON.stringify(copy);
    const response = await this.requestServ.registrarUsuario(body);
    if (response) {
      this.registro = true;
    }
  }

  async presentarOpciones() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciono como desear subir la foto',
      buttons: [
      {
        text: 'Cámara',
        icon: 'camera',
        cssClass: 'black',
        handler: () => {
          this.setImagen(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Galería',
        icon: 'apps',
        cssClass: 'black',
        handler: () => {
          this.setImagen(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  setImagen(tipo: any) {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: tipo
    };

    this.camera.getPicture(options).then((imageData) => {
      this.domsanitizer.bypassSecurityTrustUrl(imageData && imageData.dataUrl);
      this.usuario.imagen = imageData;
    }, (err) => {
      this.controllersServ.errorToast(err);
    });
  }

  async validar() {
    const copy = {codigo_acceso: this.codigo, correo: this.usuario.correo};
    const body = JSON.stringify(copy);
    const response = await this.requestServ.verificarUsuario(body);
    if (response) {
      this.modalCtrl.dismiss();
    }
  }

  async openTerminos() {
    const modal = await this.modalCtrl.create({
      component: PoliticasComponent,
      cssClass: 'modal-fullscreen'
    });
    modal.present();
  }
}
