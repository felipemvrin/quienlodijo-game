/** Generador de números aleatorios inyectable: permite tests deterministas. */
export type RandomFn = () => number;

export const defaultRandom: RandomFn = () => Math.random();

/** Fisher–Yates. Devuelve una copia; no muta el array original. */
export function shuffle<T>(items: readonly T[], random: RandomFn = defaultRandom): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
