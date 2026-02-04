

export class ApiConfig {
  static readonly BASE_URL = 'https://sandeonline.cl:2082/taskfocus/maestros/api';
  
  static readonly ENDPOINTS = {
    LOGIN: '/Test/Login',
    
    LISTAR_CONTACTOS: (idUsuario: string | number) => `/Test/ListarContactos/${idUsuario}`,
    OBTENER_CONTACTO: (idUsuario: string | number, idContacto: string | number) => 
      `/Test/ListaContacto/${idUsuario}/${idContacto}`,
    CREAR_CONTACTO: '/Test/CreaContacto',
    MODIFICAR_CONTACTO: '/Test/UpdateContacto',
    ELIMINAR_CONTACTO: '/Test/DeleteContacto',
  };

  static getFullUrl(endpoint: string): string {
    return `${this.BASE_URL}${endpoint}`;
  }
}
