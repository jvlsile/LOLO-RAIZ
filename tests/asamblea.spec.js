// Asamblea guiada: recorrido, menú lateral y contenido por edad.
const { test, expect } = require('@playwright/test');
let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('se recorre con Siguiente y con la barra espaciadora, y el menú salta a cualquier bloque', async ({ page }) => {
  await page.goto('/asamblea.html');
  await expect(page.locator('#cuenta')).toContainText('1 de 9');
  await page.click('#btnSig');
  await expect(page.locator('#cuenta')).toContainText('2 de 9');
  await page.locator('#bloque').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#cuenta')).toContainText('3 de 9');
  await page.locator('#menu button').nth(7).click();
  await expect(page.locator('#bloque h2')).toHaveText('Los tres rincones');
  await page.click('#btnAnt');
  await expect(page.locator('#bloque h2')).toHaveText('Pregunta reto');
});

test('la palabra cambia con la edad: 3 en mayúscula, 4 con colores y 5 en minúscula con frase', async ({ page }) => {
  await page.goto('/asamblea.html#palabra');
  await page.click('#edades [data-e="3"]');
  await expect(page.locator('.datos .dato').first()).toContainText('Palmas');
  await expect(page.locator('#frase')).toHaveCount(0);
  await page.click('#edades [data-e="4"]');
  await expect(page.locator('.datos .dato')).toHaveCount(3);
  await expect(page.locator('.silabas .vocal').first()).toBeVisible();
  await page.click('#edades [data-e="5"]');
  await expect(page.locator('#frase')).toBeVisible();
  await page.reload();
  await expect(page.locator('#edades [data-e="5"]')).toHaveAttribute('aria-pressed', 'true');
});

test('el número respeta el máximo de cada edad y la pauta tiene copa, tronco y raíces', async ({ page }) => {
  await page.goto('/asamblea.html#numero');
  for (const [e, max] of [[3, 5], [4, 15], [5, 50]]) {
    await page.click(`#edades [data-e="${e}"]`);
    const n = +(await page.locator('.tarjeta .gran').nth(e === 4 ? 1 : 0).innerText());
    expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(max);
  }
  await page.goto('/asamblea.html#trazo');
  await expect(page.locator('.pauta')).toBeVisible();
  const h = await page.locator('.pauta').evaluate(el => el.getBoundingClientRect().height);
  expect(h).toBeGreaterThan(100);
});

test('al llegar a la despedida se guarda el registro del día', async ({ page }) => {
  await page.goto('/asamblea.html#despedida');
  const reg = await page.evaluate(() => JSON.parse(localStorage.getItem('raiz-asamblea-registro')));
  const dia = Object.values(reg)[0];
  expect(dia.palabra).toBeTruthy(); expect(dia.numero).toBeGreaterThan(0);
});

test('la asamblea no se sale de la pantalla a lo ancho', async ({ page }) => {
  await page.goto('/asamblea.html');
  for (let i = 0; i < 9; i++) {
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(ancho, `desborde en el bloque ${i + 1}`).toBeLessThanOrEqual(1);
    await page.locator('#menu button').nth(i).click();
  }
});

test('Preparar: la palabra, el número y los rincones elegidos aparecen en la asamblea', async ({ page }) => {
  await page.goto('/preparar.html');
  await page.fill('#asPal', 'ma-ri-po-sa');
  await page.fill('#asNum', '3');
  await page.fill('#asR1', 'Pintura');
  await page.goto('/asamblea.html#palabra');
  await expect(page.locator('.datos .dato').first()).toContainText('4');
  await page.goto('/asamblea.html#numero');
  await page.click('#edades [data-e="3"]');
  await expect(page.locator('.tarjeta .gran')).toHaveText('3');
  await page.goto('/asamblea.html#rincones');
  await expect(page.locator('.rincon').first()).toHaveText('Pintura');
});
