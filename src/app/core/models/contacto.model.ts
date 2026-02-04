export interface Contacto {
  idContacto: string;
  rutContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface CrearContactoRequest {
  idUsuario: string;
  idContacto: string;
  rutContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface ModificarContactoRequest {
  idUsuario: string;
  idContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface EliminarContactoRequest {
  idUsuario: string;
  idContacto: string;
}
