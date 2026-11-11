// HOY: agenda visual del día.
const { test, expect } = require('@playwright/test');
let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('muestra la agenda y se marca lo hecho, también tras recargar', async ({ page }) => {
  await page.goto('/hoy.html');
  await expect(page.locator('.act')).toHaveCount(8);
  await expect(page.locator('.act.ahora .nom')).toHaveText('Entrada');
  await page.locator('.act').first().locator('.hecho').click();
  await expect(page.locator('.act.ahora .nom')).toHaveText('Asamblea');
  await page.reload();
  await expect(page.locator('.act.listo')).toHaveCount(1);
});

test('Preparar: se cambia, se añade y se quita una actividad', async ({ page }) => {
  await page.goto('/hoy.html');
  await expect(page.locator('#editor')).toBeHidden();
  await page.click('#btnPreparar');
  await page.click('#btnNueva');
  await expect(page.locator('.act')).toHaveCount(9);
  await page.locator('#listaEd li').last().locator('input').fill('Psicomotricidad');
  await expect(page.locator('.act').last().locator('.nom')).toHaveText('Psicomotricidad');
  await page.locator('#listaEd li').last().locator('[data-a="quita"]').click();
  await expect(page.locator('.act')).toHaveCount(8);
});

test('la agenda no se sale de la pantalla y la asamblea enlaza a Lolo', async ({ page }) => {
  await page.goto('/hoy.html');
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho).toBeLessThanOrEqual(1);
  await expect(page.locator('.asamblea')).toHaveAttribute('href', 'jugar.html#lolo');
});
