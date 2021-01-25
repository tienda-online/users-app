import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.scss'],
})
export class AyudaComponent implements OnInit {

  tipos = ["Tiger", "Lion", "Elephant", "Fox", "Wolf"];
  ayuda = {
    asunto: '',
    tipo: '',
    contenido: '',
    telefono: '',
    id_usuario: 0
  }
  constructor(private pickerCtrl: PickerController) { }

  ngOnInit() {}

  async showPicker() {
    let options = {
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(value:any) => {
            this.ayuda.tipo = value.Tipos.value;
          }
        }
      ],
      columns:[{
        name:'Tipos',
        options:this.getColumnOptions()
      }]
    };

    let picker = await this.pickerCtrl.create(options);
    picker.present()
  }

  getColumnOptions(){
    let options = [];
    this.tipos.forEach(x => {
      options.push({text:x, value:x});
    });
    return options;
  }

  feedback() {

  }
}
