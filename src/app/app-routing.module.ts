import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'slides',
    loadChildren: () => import('./tutorial/slides/slides.module').then( m => m.SlidesPageModule)
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('./pages/ubicacion/ubicacion.module').then( m => m.UbicacionPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'afiliados/:id',
    loadChildren: () => import('./pages/afiliados/afiliados.module').then( m => m.AfiliadosPageModule)
  },
  {
    path: 'productos/:id',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'productos-detalle/:id',
    loadChildren: () => import('./pages/productos-detalle/productos-detalle.module').then( m => m.ProductosDetallePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
