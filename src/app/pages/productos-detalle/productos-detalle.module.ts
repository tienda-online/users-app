import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosDetallePageRoutingModule } from './productos-detalle-routing.module';

import { ProductosDetallePage } from './productos-detalle.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ProductosDetallePageRoutingModule
  ],
  declarations: [ProductosDetallePage]
})
export class ProductosDetallePageModule {}
