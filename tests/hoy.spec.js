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

test('Preparar: se cambia, se añade y se quita una actividad, y Hoy lo refleja', async ({ page }) => {
  await page.goto('/hoy.html');
  await page.click('.preparar');
  await expect(page).toHaveURL(/preparar\.html/);
  await page.click('#btnNueva');
  await page.locator('#listaEd li').last().locator('input').fill('Psicomotricidad');
  await page.goto('/hoy.html');
  await expect(page.locator('.act')).toHaveCount(9);
  await expect(page.locator('.act').last().locator('.nom')).toHaveText('Psicomotricidad');
  await page.goto('/preparar.html');
  await page.locator('#listaEd li').last().locator('[data-a="quita"]').click();
  await expect(page.locator('#listaEd li')).toHaveCount(8);
});

test('Preparar: la copia de seguridad se descarga y se vuelve a cargar', async ({ page }) => {
  await page.goto('/preparar.html');
  await page.click('#btnNueva');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('#btnExporta')]);
  const ruta = await d.path();
  await page.click('#btnReset');
  await expect(page.locator('#listaEd li')).toHaveCount(8);
  await page.setInputFiles('#archivo', ruta);
  await expect(page.locator('#aviso')).toHaveText('Copia cargada.');
  await expect(page.locator('#listaEd li')).toHaveCount(9);
});

test('la agenda no se sale de la pantalla y la asamblea enlaza a su recorrido', async ({ page }) => {
  await page.goto('/hoy.html');
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho).toBeLessThanOrEqual(1);
  await expect(page.locator('.asamblea')).toHaveAttribute('href', 'asamblea.html');
});
