/** Identificador de un personaje histórico jugable (ej. `jesus`, `marx`). */
export type CharacterId = string;

/**
 * Personaje al que se pueden atribuir las frases.
 * La primera versión sólo incluye a Jesús y Karl Marx, pero el motor es agnóstico
 * al número de personajes: basta con añadir entradas en `characters.json`.
 */
export interface Character {
  readonly id: CharacterId;
  readonly name: string;
  readonly description: string;
  /** Ruta al retrato del personaje dentro de `assets/characters/`. */
  readonly avatar: string;
  /** Símbolo corto usado en la UI (✝️, ☭, …). */
  readonly symbol: string;
  /** Nombre del token de color asociado (`jesus`, `marx`, …). */
  readonly colorToken: string;
}
