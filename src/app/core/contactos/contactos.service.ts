import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { 
  Contacto, 
  CrearContactoRequest, 
  ModificarContactoRequest, 
  EliminarContactoRequest 
} from '../models/contacto.model';
import { ApiConfig } from '../../enviroment/api-config';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  constructor(private readonly http: HttpClient) { }

  listarContactos(idUsuario: string): Observable<Contacto[]> {
    const url = ApiConfig.getFullUrl(ApiConfig.ENDPOINTS.LISTAR_CONTACTOS(idUsuario));
    return this.http.get<Contacto[]>(url);
  }

  obtenerContacto(idUsuario: string, idContacto: string): Observable<Contacto> {
    const url = ApiConfig.getFullUrl(ApiConfig.ENDPOINTS.OBTENER_CONTACTO(idUsuario, idContacto));
    return this.http.get<Contacto>(url);
  }

  crearContacto(request: CrearContactoRequest): Observable<any> {
    const url = ApiConfig.getFullUrl(ApiConfig.ENDPOINTS.CREAR_CONTACTO);
    return this.http.post(url, request);
  }

  modificarContacto(request: ModificarContactoRequest): Observable<any> {
    const url = ApiConfig.getFullUrl(ApiConfig.ENDPOINTS.MODIFICAR_CONTACTO);
    return this.http.post(url, request);
  }

  eliminarContacto(request: EliminarContactoRequest): Observable<any> {
    const url = ApiConfig.getFullUrl(ApiConfig.ENDPOINTS.ELIMINAR_CONTACTO);
    return this.http.post(url, request);
  }
}
