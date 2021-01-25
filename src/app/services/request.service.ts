import { StorageService } from './storage.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ControllersService } from './controllers.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  ordenes = [];
  constructor(private http: HttpClient,
              private storageServ: StorageService,
              private storage: Storage,
              private controllersServ: ControllersService) { }

  async login(body: any) {
    await this.controllersServ.showLoading('Validando los datos...');
    return new Promise(async (resolve) => {
      let params = '';
      const token = await this.storage.get('pushtoken');
      if (token) {
        params = `?token=${token}`;
      }
      this.http.put(`${environment.apiUrl}/login${params}`, body).subscribe((data: any) => {
        const user = {...data.respuesta.usuario, apiKey: data.respuesta.token};
        this.storageServ.guardarUsuario(user);
        this.controllersServ.loading.dismiss();
        this.controllersServ.showToast(`Bienvenido, ${user.nombre}`, 1500, 'top', 'success');
        resolve(true);
      },
      (error: any) => {
        this.controllersServ.loading.dismiss();
        this.controllersServ.errorToast(error.error.respuesta);
        resolve(false);
      });
    });
  }

  async registrarUsuario(data: string) {
    await this.controllersServ.showLoading('Enviando mensaje de confirmación...');
    return new Promise(resolve => {
      this.http.post(`${environment.apiUrl}/create`, data).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.successToast(response.respuesta);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve(false);
      });
    });
  }

  async verificarUsuario(data: string) {
    await this.controllersServ.showLoading('Registrando cuenta...');
    return new Promise(resolve => {
      this.http.put(`${environment.apiUrl}/verificar/numero`, data).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.successToast(response.respuesta);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve(false);
      });
    });
  }

  async recoverRequest(data: string) {
    await this.controllersServ.showLoading('Verificando cuenta...');
    return new Promise(resolve => {
      this.http.put(`${environment.apiUrl}/contrasena`, data).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.successToast(response.respuesta);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve(false);
      });
    });
  }

  async recoverPassword(data: string) {
    await this.controllersServ.showLoading('Actualizando contraseña...');
    return new Promise(resolve => {
      this.http.put(`${environment.apiUrl}/recuperar/contrasena/update`, data).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.successToast(response.respuesta);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve(false);
      });
    });
  }

  async checkUbicacion(data: any) {
    await this.controllersServ.showLoading('Verificando ubicación...');
    return new Promise(resolve => {
      this.http.post(`${environment.apiUrl}/pos/verificar`, data).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.loading.dismiss();
        this.controllersServ.errorToast(error.error.respuesta);
        resolve(false);
      });
    });
  }

  async getCategorias() {
    await this.controllersServ.showLoading('Cargando categorías...');
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/categorias`).subscribe((response: any) => {
        resolve([true, response.respuesta]);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.loading.dismiss();
        this.controllersServ.errorToast(error.error.respuesta);
        resolve([false]);
      });
    });
  }

  async editarUsuario(data: string) {
    await this.controllersServ.showLoading('Actualizando perfil...');
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.put(`${environment.apiUrl}/update`, data, {headers}).subscribe((response: any) => {
        resolve([true, response.respuesta]);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve([false]);
      });
    });
  }

  async getAfiliadosByCategoria(id: any) {
    await this.controllersServ.showLoading('Cargando categorías...');
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/categorias/${id}/sucursales/latitud/${this.storageServ.ubicacion.latitud}/longitud/${this.storageServ.ubicacion.longitud}`).subscribe((response: any) => {
        resolve([true, response.respuesta]);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.loading.dismiss();
        this.controllersServ.errorToast(error.error.respuesta);
        resolve([false]);
      });
    });
  }

  async getProductosBySucursal(id: any) {
    await this.controllersServ.showLoading('Cargando productos...');
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/sucursales/${id}/productos`).subscribe((response: any) => {
        resolve([true, response.respuesta]);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.loading.dismiss();
        this.controllersServ.errorToast(error.error.respuesta);
        resolve([false]);
      });
    });
  }

  async getProductosDetailById(id: any) {
    await this.controllersServ.showLoading('Cargando...');
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/productos/${id}`).subscribe((response: any) => {
        resolve([true, response.respuesta]);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.loading.dismiss();
        this.controllersServ.errorToast(error.error.respuesta);
        resolve([false]);
      });
    });
  }

  async createOrden(data: string) {
    await this.controllersServ.showLoading('Realizando compra...');
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.post(`${environment.apiUrl}/orden/create`, data, {headers}).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve(false);
      });
    });
  }

  async createFacturacion(data: string) {
    await this.controllersServ.showLoading('Creando datos de facturación...');
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.post(`${environment.apiUrl}/facturacion`, data, {headers}).subscribe((response: any) => {
        resolve(true);
        this.controllersServ.loading.dismiss();
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve(false);
      });
    });
  }

  async getOrdenes(url: string) {
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/${url}`, {headers}).subscribe((response: any) => {
        resolve([true, response.respuesta]);
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        resolve([false]);
      });
    });
  }

  async getOrdenByID(id: number) {
    await this.controllersServ.showLoading('Cargando orden...');
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/ordenes/${id}`, {headers}).subscribe((response: any) => {
        this.controllersServ.loading.dismiss();
        resolve([true, response.respuesta]);
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        this.controllersServ.loading.dismiss();
        resolve([false]);
      });
    });
  }

  async getUbicacionOrden(id: number, loading = false) {
    if (loading) {
      await this.controllersServ.showLoading('Cargando...');
    }
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/ordenes/${id}/ubicacion`, {headers}).subscribe((response: any) => {
        if (loading) {
          this.controllersServ.loading.dismiss();
        }
        resolve([true, response.respuesta]);
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        if (loading) {
          this.controllersServ.loading.dismiss();
        }
        resolve([false]);
      });
    });
  }

  async getMensajesOrden(id: number, loading = false) {
    if (loading) {
      await this.controllersServ.showLoading('Cargando...');
    }
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.get(`${environment.apiUrl}/ordenes/${id}/mensajes`, {headers}).subscribe((response: any) => {
        if (loading) {
          this.controllersServ.loading.dismiss();
        }
        resolve([true, response.respuesta]);
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        if (loading) {
          this.controllersServ.loading.dismiss();
        }
        resolve([false]);
      });
    });
  }

  async sendMensajeOrden(id: number, body: string) {
    const headers = new HttpHeaders({
      token: this.storageServ.usuario.apiKey
    });
    return new Promise(resolve => {
      this.http.post(`${environment.apiUrl}/ordenes/${id}/mensajes`, body, {headers}).subscribe((response: any) => {
        resolve(true);
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        resolve(false);
      });
    });
  }

  buscarAfiliados(data: string) {
    return new Promise(resolve => {
      this.http.post(`${environment.apiUrl}/sucursales`, data).subscribe((response: any) => {
        resolve([true, response.respuesta]);
      }, (error: any) => {
        this.controllersServ.errorToast(error.error.respuesta);
        resolve([false]);
      });
    });
  }
}
