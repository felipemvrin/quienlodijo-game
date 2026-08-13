import { expect, test } from '@playwright/test';

test.describe('Pantalla de bienvenida', () => {
  test('presenta el concepto del juego', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Quién lo dijo?');
    await expect(page.getByText('Jesús')).toBeVisible();
    await expect(page.getByText('Karl Marx')).toBeVisible();
  });

  test('el botón Comenzar responde', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /comenzar/i }).click();

    await expect(page.getByRole('status')).toBeVisible();
  });
});
