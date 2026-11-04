// Generador de fichas de trazos: dos fichas por hoja A4, listas para imprimir.
const { test, expect } = require('@playwright/test');

let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('genera los ocho trazos, dos fichas iguales por hoja', async ({ page }) => {
  await page.goto('/fichas.html');
  await expect(page.locator('.chip-trazo[aria-pressed="true"]')).toHaveCount(8);
  await expect(page.locator('.hoja')).toHaveCount(8);
  await expect(page.locator('.hoja .ficha-trazo')).toHaveCount(16);
  await expect(page.locator('#resumen')).toContainText('8 hojas A4');
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho, 'desborde a lo ancho').toBeLessThanOrEqual(1);
});

test('dos trazos seguidos por hoja gastan la mitad de papel', async ({ page }) => {
  await page.goto('/fichas.html');
  await page.locator('label.op-hoja', { hasText: 'Dos trazos seguidos' }).click();
  await expect(page.locator('.hoja')).toHaveCount(4);
  await page.locator('.chip-trazo[data-k="caracol"]').click();
  await expect(page.locator('.hoja')).toHaveCount(4);
  await expect(page.locator('.hoja .ficha-trazo')).toHaveCount(8);
});

test('el enlace directo elige un trazo y cambia el tamaño y la ayuda', async ({ page }) => {
  await page.goto('/fichas.html?t=caracol');
  await expect(page.locator('.chip-trazo[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('.hoja')).toHaveCount(1);
  await expect(page.locator('.ficha-trazo').first()).toHaveAttribute('aria-label', /El Caracol de la Raíz/);
  await page.locator('.segmento label', { hasText: '5 años' }).click();
  await page.locator('.segmento label', { hasText: 'Puntos' }).click();
  await expect(page.locator('#nivelDesc')).toContainText('Puntos');
  await expect(page.locator('.ficha-trazo').first()).toHaveAttribute('aria-label', /Ayuda: Puntos/);
});

test('sin trazos no se puede imprimir', async ({ page }) => {
  await page.goto('/fichas.html');
  await page.click('#ninguno');
  await expect(page.locator('.hoja')).toHaveCount(0);
  await expect(page.locator('#vacio')).toBeVisible();
  await expect(page.locator('.panel-pie .imprimir')).toBeDisabled();
  await page.click('#todos');
  await expect(page.locator('.hoja')).toHaveCount(8);
});

test('al imprimir solo salen las hojas, a tamaño A4', async ({ page }) => {
  await page.goto('/fichas.html?t=tronco,rama');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.panel')).toBeHidden();
  await expect(page.locator('.nav')).toBeHidden();
  const caja = await page.locator('.hoja').first().boundingBox();
  expect(Math.round(caja.width)).toBe(794); // 210 mm
  expect(Math.abs(caja.height - 1121.8)).toBeLessThan(2); // 296,8 mm
});

test('el juego y la portada llevan al generador', async ({ page }) => {
  await page.goto('/jugar.html#tinta');
  await expect(page.locator('#panel-tinta .enlace-fichas')).toHaveAttribute('href', 'fichas.html');
  await page.goto('/');
  await page.locator('.tarjeta[data-id="tinta"]').click();
  await expect(page.locator('#fichaImprimir')).toBeVisible();
  await page.locator('#fichaImprimir').click();
  await page.waitForURL(/fichas\.html$/);
  await expect(page.locator('h1')).toHaveText('Fichas de trazos');
});
