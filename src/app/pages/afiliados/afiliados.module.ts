import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AfiliadosPageRoutingModule } from './afiliados-routing.module';

import { AfiliadosPage } from './afiliados.page';
import { ComponentsModule } from '../../components/components.module';
import { MenuComponent } from '../../components/menu/menu.component';
import { DatosFacturacionComponent } from '../../components/datos-facturacion/datos-facturacion.component';
import { PedidosComponent } from '../../components/pedidos/pedidos.component';
import { PedidoDetalleComponent } from '../../components/pedido-detalle/pedido-detalle.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { PoliticasComponent } from 'src/app/components/politicas/politicas.component';
import { RecoverComponent } from 'src/app/components/recover/recover.component';
import { PerfilComponent } from 'src/app/components/perfil/perfil.component';
import { AyudaComponent } from 'src/app/components/ayuda/ayuda.component';

@NgModule({
  entryComponents: [
    MenuComponent,
    DatosFacturacionComponent,
    PedidosComponent,
    PedidoDetalleComponent,
    ChatComponent,
    PoliticasComponent,
    RecoverComponent,
    PerfilComponent,
    AyudaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AfiliadosPageRoutingModule
  ],
  declarations: [AfiliadosPage]
})
export class AfiliadosPageModule {}
