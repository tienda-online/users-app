import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { ControllersService } from '../../services/controllers.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario = {
    nombre: '',
    apellido:'',
    imagen: '',
  };
  correo = '';
  profilePhoto = '';
  constructor(private storageServ: StorageService,
              private requestServ: RequestService,
              private camera: Camera,
              private domsanitizer: DomSanitizer,
              private controllersServ: ControllersService,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.usuario.nombre = this.storageServ.usuario.nombre;
    this.usuario.apellido = this.storageServ.usuario.apellido;
    this.correo = this.storageServ.usuario.correo;
    this.profilePhoto = this.storageServ.usuario.imagen;
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

  async editar() {
    const copy = {...this.usuario, imagen: `data:image/jpeg;base64,${this.usuario.imagen}`};
    if (this.usuario.imagen === '') {
      delete copy.imagen;
    }
    const body = JSON.stringify(copy);
    const response = await this.requestServ.editarUsuario(body);
    if (response[0]) {
      this.storageServ.usuario.nombre = response[1].nombre;
      this.storageServ.usuario.apellido = response[1].apellido;
      this.storageServ.usuario.imagen = response[1].imagen;
      this.storageServ.guardarUsuario(this.storageServ.usuario);
      this.modalCtrl.dismiss();
    }
  }
}
