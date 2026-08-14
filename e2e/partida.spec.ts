import { expect, test, type Page } from '@playwright/test';

/** Crea una partida de dos jugadores y entra al tablero. */
async function crearPartida(page: Page): Promise<void> {
  await page.goto('/partida/nueva');

  await page.getByRole('button', { name: /empezar/i }).click();
  await expect(page).toHaveURL(/\/partida$/);
}

test.describe('Partida', () => {
  test('el tablero muestra la frase y las dos respuestas', async ({ page }) => {
    await crearPartida(page);

    await expect(page.getByText('¿Quién lo dijo?')).toBeVisible();
    await expect(page.getByRole('button', { name: /responder jesús/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /responder karl marx/i })).toBeVisible();
    await expect(page.getByRole('timer')).toBeVisible();
  });

  test('al responder se revela la explicación y avanza el turno', async ({ page }) => {
    await crearPartida(page);
    const primerTurno = await page.locator('.ql-card__quote').textContent();

    await page.getByRole('button', { name: /responder jesús/i }).click();

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.locator('.ql-card__explanation')).toBeVisible();

    await page.getByRole('button', { name: /siguiente|ver resultado/i }).click();
    await expect(page.locator('.ql-card__quote')).not.toHaveText(primerTurno ?? '');
  });

  test('no se puede entrar al tablero sin partida', async ({ page }) => {
    await page.goto('/partida');

    await expect(page).toHaveURL(/\/partida\/nueva$/);
  });
});
