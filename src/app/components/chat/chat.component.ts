import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { RequestService } from '../../services/request.service';
import { IonContent } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  @Input() idOrden: number;
  @ViewChild(IonContent) content: IonContent;
  repartidor: any;
  messages = [];
  newMsg = {
    mensaje: ''
  };
  interval: any;
  loading = false;

  constructor(public storageServ: StorageService,
              private requestServ: RequestService) { }

  ngOnInit() {
    moment.locale('es');
  }

  ionViewWillEnter() {
    this.getMessages();
  }

  getMessages() {
    this.getMessagesRequest(true);
    this.interval = window.setInterval(() => {
      if (!this.loading) {
        this.getMessagesRequest();
      }
    }, 5000);
  }

  async getMessagesRequest(loading = false) {
    const response = await this.requestServ.getMensajesOrden(this.idOrden, loading);
    if (response[0]) {
      if (loading) {
        this.repartidor = response[1].repartidor;
      }
      for (const msg of response[1].mensajes) {
        const flag = this.messages.findIndex(item => item.id_mensaje === msg.id_mensaje);
        if (flag < 0) {
          this.messages = [...this.messages, msg];
        }
      }
      setTimeout(() => {
        this.content.scrollToBottom(200);
      });
    }
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
  }

  sendMessage() {
    this.sendMessageRequest();
  }

  async sendMessageRequest() {
    this.loading = true;
    const body = JSON.stringify(this.newMsg);
    const response = await this.requestServ.sendMensajeOrden(this.idOrden, body);
    if (response) {
      this.loading = false;
      this.newMsg.mensaje = '';
      this.getMessagesRequest();
    }
  }
}
