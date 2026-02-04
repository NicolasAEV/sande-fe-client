export interface User {
  idUsuario: string;
  nombre: string;
  apellido: string;
  perfil: string;
}

export interface LoginRequest {
  usuario: string;
  clave: string;
}

export interface LoginResponse extends User {}
