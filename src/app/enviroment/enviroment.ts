/**
 * Rutas centralizadas de la aplicación
 * ayuda a evitar codigo hardcodeado
 */
export class AppRoutes {
  static readonly LOGIN = '/login';
  static readonly CONTACTOS = '/contactos';
  static readonly CONTACTOS_NUEVO = '/contactos/nuevo';
  static readonly CONTACTOS_EDITAR = (id: string | number) =>
    `/contactos/${id}/editar`;

  static readonly ROOT = '/';
  static readonly WILDCARD = '/**';

  static list(): string[] {
    return [
      this.LOGIN,
      this.CONTACTOS,
      this.CONTACTOS_NUEVO,
      '/contactos/:id/editar',
      this.ROOT,
      this.WILDCARD,
    ];
  }
}
