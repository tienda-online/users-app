import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosDetallePage } from './productos-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosDetallePageRoutingModule {}
