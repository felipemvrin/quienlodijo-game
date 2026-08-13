export type AvatarId = string;

/** Avatar seleccionable por un jugador durante la creación de la partida. */
export interface Avatar {
  readonly id: AvatarId;
  readonly name: string;
  /** Emoji o ruta a ilustración en `assets/characters/`. */
  readonly image: string;
  readonly color: string;
}
