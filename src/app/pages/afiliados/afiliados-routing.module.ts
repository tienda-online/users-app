import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfiliadosPage } from './afiliados.page';

const routes: Routes = [
  {
    path: '',
    component: AfiliadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfiliadosPageRoutingModule {}
