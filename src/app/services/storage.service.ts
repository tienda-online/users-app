import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  ubicacion: any;
  usuario: any;
  afiliado: any;
  carrito = [];
  ordenes = 0;
  constructor(private storage: Storage) {
    this.cargarUsuario();
    this.cargarCarrito();
  }

  guardarUsuario(data: any) {
    this.usuario = data;
    this.storage.set('usuario', this.usuario);
  }

  async cargarUsuario() {
     const usuario = await this.storage.get('usuario');
     if (usuario) {
       this.usuario = usuario;
     }
  }

  async cerrarSesion() {
    await this.storage.remove('usuario');
    this.usuario = null;
    this.afiliado = null;
    this.carrito = [];
  }

  guardarUbicacion(ubicacion: any) {
    this.ubicacion = ubicacion;
    this.storage.set('ubicacion', ubicacion);
  }

  cargarUbicacion() {
    return this.storage.get('ubicacion');
  }

  removeUbicacion() {
    return this.storage.remove('ubicacion');
  }

  guardarTutorial() {
    this.storage.set('tutorial', true);
  }

  cargarTutorial() {
    return this.storage.get('tutorial');
  }

  guardarProductos(producto: any, action: boolean) {
    const index = this.carrito.findIndex(data => data.info.id_producto === producto.info.id_producto);
    if (index < 0) {
      if (action) {
        this.carrito.push(producto);
      }
    } else {
        if (producto.cantidad === 0) {
          this.carrito.splice(index, 1);
        } else {
          this.carrito[index] = producto;
        }
    }
    this.guardarCarrito();
  }

  guardarCarrito() {
    this.storage.set('carrito', this.carrito);
  }

  cargarCarrito() {
    this.storage.get('carrito').then(carrito => {
      if (carrito) {
        this.carrito = carrito;
      }
    });
  }

  getItemsCarrito() {
    let items = 0;
    for (const item of this.carrito) {
      items = items + item.cantidad;
    }
    return items;
  }
}
