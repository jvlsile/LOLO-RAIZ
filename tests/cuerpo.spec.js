// El cuerpo: la sección de la portada, el pasaporte de sellos y las fichas para imprimir.
const { test, expect } = require('@playwright/test');

let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('la portada tiene la sección del cuerpo con Nico y sus seis juegos', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#cuerpo');
  await expect(sec.locator('h2')).toHaveText('El cuerpo');
  await expect(sec.locator('.cue-nico')).toHaveCount(3);
  await expect(sec.locator('.sen-card')).toHaveCount(6);
  await expect(sec.locator('.sen-sello')).toHaveCount(6);
  // Los Nicos de la cabecera no se salen de ella.
  const cab = await sec.locator('.sen-cab').boundingBox();
  for (const n of await sec.locator('.cue-nico').all()) {
    const b = await n.boundingBox();
    expect(b.x).toBeGreaterThanOrEqual(cab.x - 1);
    expect(b.x + b.width).toBeLessThanOrEqual(cab.x + cab.width + 1);
  }
});

test('la categoría «El cuerpo» lleva a su sección y una tarjeta abre el juego', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="cuerpo"]').click();
  await expect(page.locator('#cuerpo .sen-cab')).toBeInViewport();
  await page.locator('.sen-card[data-id="monta"]').click();
  await expect(page).toHaveURL(/jugar\.html#monta$/);
  await expect(page.locator('#actualT')).toHaveText('Monta a Nico');
});

test('en «¿Dónde está?» tocar otra parte da una pista y tocar la buena la ilumina', async ({ page }) => {
  await page.goto('/jugar.html#cuerpo');
  await expect(page.locator('#panel-cuerpo .txt')).toContainText('cabeza');
  await page.locator('#panel-cuerpo [data-region="tronco"]').dispatchEvent('click');
  await expect(page.locator('#panel-cuerpo .txt')).toContainText('Esa es la barriga');
  await page.locator('#panel-cuerpo [data-region="cabeza"]').dispatchEvent('click');
  await expect(page.locator('#panel-cuerpo .txt')).toContainText('vuestra cabeza');
  await expect(page.locator('#panel-cuerpo .brillo')).toHaveCount(1);
});

test('terminar un juego del cuerpo pone su sello y la portada lo muestra', async ({ page }) => {
  await page.goto('/jugar.html#sirve');
  for (let r = 0; r < 5; r++) {
    await page.evaluate(async () => {
      const z = document.querySelector('#panel-sirve .jz');
      for (const b of z.querySelectorAll('.opt')) { if (z.querySelector('.big.pulso')) break; b.click(); await new Promise(res => setTimeout(res, 40)); }
    });
    const sig = page.locator('#panel-sirve .big.pulso').last();
    await expect(sig).toBeVisible({ timeout: 8000 });
    await sig.click({ force: true });
  }
  await expect(page.locator('#panel-sirve .pas-t')).toHaveText('Pasaporte del cuerpo');
  await expect(page.locator('#panel-sirve .pasaporte .sello.si')).toHaveCount(1);
  await page.goto('/');
  await expect(page.locator('#cuerpo .sen-sello.si')).toHaveCount(1);
  // El pasaporte de los sentidos no cambia.
  await expect(page.locator('#sentidos .sen-sello.si')).toHaveCount(0);
});

test('las fichas del cuerpo: nueve hojas A4 y el diploma por enlace', async ({ page }) => {
  await page.goto('/fichas-cuerpo.html');
  await expect(page.locator('.chip-trazo[aria-pressed="true"]')).toHaveCount(9);
  await expect(page.locator('.hoja .ficha-sen')).toHaveCount(9);
  await page.locator('.chip-trazo[data-k="registro"]').click();
  await expect(page.locator('.hoja')).toHaveCount(8);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho, 'desborde a lo ancho').toBeLessThanOrEqual(1);
  await page.goto('/');
  await page.goto('/fichas-cuerpo.html#diploma');
  await expect(page.locator('.hoja')).toHaveCount(1);
  await expect(page.locator('.hoja')).toContainText('Ya conozco mi cuerpo');
});
