import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosPageRoutingModule } from './productos-routing.module';

import { ProductosPage } from './productos.page';
import { ComponentsModule } from '../../components/components.module';
import { LoginComponent } from '../../components/login/login.component';
import { CartComponent } from '../../components/cart/cart.component';
import { RecoverComponent } from 'src/app/components/recover/recover.component';
import { RegistroComponent } from '../../components/registro/registro.component';
import { PoliticasComponent } from 'src/app/components/politicas/politicas.component';

@NgModule({
  entryComponents: [LoginComponent, CartComponent, RecoverComponent, RegistroComponent, PoliticasComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ProductosPageRoutingModule
  ],
  declarations: [ProductosPage]
})
export class ProductosPageModule {}
