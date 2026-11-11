// Modo 3 años: cada juego se juega entero tocando, como lo haría un niño; y el generador de fichas.
const { test, expect } = require('@playwright/test');

const JUEGOS = ['burbujas', 'cara', 'animales', 'emociones', 'manos', 'colores', 'cuenta', 'tamanos', 'primero', 'quiero', 'calma', 'turnos', 'numeros', 'banda'];

let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

/* Resuelve el reto visible tocando de verdad: primero una opción equivocada (si la hay) y luego la buena. */
async function resolver(page, reto) {
  const z = page.locator('#zona');
  if (await z.locator('.burbuja').count()) {
    while (await z.locator('.burbuja.sig').count()) await z.locator('.burbuja.sig .cuerpo-b').click({ force: true });
    return;
  }
  if (await z.locator('.turnos').count()) {
    if (reto === 0) { await z.locator('.jug.espera').click(); await expect(page.locator('#texto')).toContainText('Espera'); }
    while (await z.locator('.jug.toca').count()) await z.locator('.jug.toca').click({ force: true });
    return;
  }
  if (await z.locator('.tren-n').count()) {
    const n = await z.locator('.tn-num').count();
    if (reto === 0) { await z.locator('.tn-num[data-n="2"]').click(); await expect(page.locator('#texto')).toContainText('Buscamos el uno'); }
    for (let i = 1; i <= n; i++) await z.locator(`.tn-num[data-n="${i}"]`).click();
    return;
  }
  if (await z.locator('.banda').count()) {
    await expect(z.locator('.tambor-n')).toBeEnabled({ timeout: 15000 });
    const n = await z.locator('.banda-lolo .golpes i').count();
    for (let i = 0; i < n; i++) await z.locator('.tambor-n').click({ force: true });
    return;
  }
  if (await z.locator('.ops-quiero').count()) { await z.locator('.op').nth(reto % 2).click(); return; }
  if (await page.locator('body[data-juego="calma"]').count()) {
    await z.locator('.op[data-ok]').click();
    await z.locator('.ops-ayuda .op').first().click({ timeout: 6000 });
    await z.locator('.big.pulso', { hasText: 'tranquilos' }).click();
    return;
  }
  const cara = z.locator('.cara-caja');
  if (await cara.count()) {
    const busca = await cara.getAttribute('data-busca');
    if (reto === 0) { await z.locator('.parte[data-parte="boca"]').click(); await expect(page.locator('#texto')).toContainText('Eso es la boca'); }
    await z.locator(`.parte[data-parte="${busca}"] .zona-toque`).click({ force: true });
    return;
  }
  if (reto === 0) { await z.locator('.op:not([data-ok])').click(); await expect(z.locator('.op.bien')).toHaveCount(0); }
  await z.locator('.op[data-ok]').click();
}

test('el menú muestra los catorce juegos en dos secciones y la entrada a las fichas', async ({ page }) => {
  await page.goto('/tres.html');
  await expect(page.locator('h1')).toHaveText('Juegos para 3 años');
  await expect(page.locator('.tile')).toHaveCount(14);
  await expect(page.locator('.menu-sec')).toHaveCount(2);
  await page.locator('.apoyos summary').click();
  await expect(page.locator('.apoyos ul')).toBeVisible();
  await expect(page.locator('.tile-fichas')).toHaveAttribute('href', 'fichas-3.html');
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho).toBeLessThanOrEqual(1);
});

for (const id of JUEGOS) {
  test(`${id}: se juega de principio a fin`, async ({ page }) => {
    await page.goto('/tres.html');
    await page.locator(`.tile[data-id="${id}"]`).click();
    const retos = id === 'burbujas' ? 4 : 3;
    await expect(page.locator('#agenda .ag')).toHaveCount(retos + 1);
    for (let reto = 0; reto < retos; reto++) {
      await resolver(page, reto);
      const sig = page.locator('#zona .big.pulso');
      await expect(sig, `reto ${reto + 1}`).toBeVisible({ timeout: 6000 });
      await sig.click();
    }
    await expect(page.locator('#zona .final')).toBeVisible();
    await expect(page.locator('#agenda .ag.hecho')).toHaveCount(retos + 1);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(ancho, 'desborde a lo ancho').toBeLessThanOrEqual(1);
    await page.locator('#zona .big', { hasText: 'Otro juego' }).click();
    await expect(page.locator('#menu')).toBeVisible();
  });
}

test('en «Quiero…» todas las respuestas valen, también el «no»', async ({ page }) => {
  await page.goto('/tres.html#quiero');
  for (let r = 0; r < 2; r++) { await page.locator('#zona .op').first().click(); await page.locator('#zona .big.pulso').click(); }
  await page.locator('#zona .op[aria-label="No"]').click();
  await expect(page.locator('#texto')).toContainText('Decir que no también está muy bien');
});

test('al segundo intento se ilumina la respuesta, sin sonido de error', async ({ page }) => {
  await page.goto('/tres.html#colores');
  const mal = page.locator('#zona .op:not([data-ok])');
  await mal.click(); await mal.click();
  await expect(page.locator('#zona .op[data-ok]')).toHaveClass(/pista/);
});

test('el modo tranquilo se comparte con el resto de juegos', async ({ page }) => {
  await page.goto('/tres.html');
  await page.click('#btnCalma');
  await expect(page.locator('html')).toHaveClass(/calma/);
  await page.goto('/jugar.html');
  await expect(page.locator('html')).toHaveClass(/calma/);
});

test('fichas para 3 años: cuatro tipos, dos por hoja y listas para imprimir', async ({ page }) => {
  await page.goto('/fichas-3.html');
  await expect(page.locator('.chip-trazo')).toHaveCount(5);
  await expect(page.locator('.hoja')).toHaveCount(5);
  for (const [tipo, n] of [['punzon', 6], ['flecos', 3], ['colorear', 5]]) {
    await page.locator(`.segmento input[value="${tipo}"]`).check({ force: true });
    await expect(page.locator('.chip-trazo')).toHaveCount(n);
    await expect(page.locator('.hoja .ficha-trazo')).toHaveCount(n * 2);
  }
  await page.locator('label.op-hoja', { hasText: 'Dos dibujos seguidos' }).click();
  await expect(page.locator('.hoja')).toHaveCount(3);
  await page.click('#ninguno');
  await expect(page.locator('.panel-pie .imprimir')).toBeDisabled();
  await page.click('#todos');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.panel')).toBeHidden();
  const caja = await page.locator('.hoja').first().boundingBox();
  expect(Math.round(caja.width)).toBe(794);
});

test('la portada lleva al modo 3 años', async ({ page }) => {
  await page.goto('/');
  await page.click('.novedad');
  await page.waitForURL(/tres\.html$/);
  await expect(page.locator('h1')).toHaveText('Juegos para 3 años');
});
