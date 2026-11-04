// Pruebas de la portada: explorar, conocer y lanzar los juegos.
const { test, expect } = require('@playwright/test');

let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('muestra la portada con Lolo, las categorías y los 26 juegos', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('La visita de Lolo');
  await expect(page.locator('h1')).toContainText('Aprender jugando');
  await expect(page.locator('#ctaHoy')).toBeVisible();
  await expect(page.locator('.cat')).toHaveCount(7);
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(26);
});

test('una categoría filtra los juegos y lleva hasta ellos', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="logica"]').click();
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(6);
  await expect(page.locator('.pestana[data-cat="logica"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#cuantos')).toContainText('6 de 26 juegos');
});

test('filtra por edad y por búsqueda', async ({ page }) => {
  await page.goto('/');
  await page.click('#edades button[data-e="5"]');
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(22);
  await page.fill('#buscar', 'robot');
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(1);
  await page.fill('#buscar', 'xyz');
  await expect(page.locator('#vacio')).toBeVisible();
  await page.click('#limpiar');
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(26);
});

test('la ficha explica el juego y lo lanza', async ({ page }) => {
  await page.goto('/');
  await page.locator('.tarjeta[data-id="formas"] h3').click();
  await expect(page.locator('#ficha')).toBeVisible();
  await expect(page.locator('#fichaT')).toHaveText('Formas geométricas');
  await expect(page.locator('#fichaTrabaja li')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(page.locator('#ficha')).toBeHidden();
  await page.locator('.tarjeta[data-id="robot"] h3').click();
  await page.click('#fichaJugar');
  await page.waitForURL(/jugar\.html#robot$/);
  await expect(page.locator('#actualT')).toHaveText('El robot perdido');
});

test('«Jugar» abre el juego directamente y aparece en recientes', async ({ page }) => {
  await page.goto('/');
  await page.locator('.tarjeta[data-id="cuenta"] .jugar').click();
  await page.waitForURL(/jugar\.html#cuenta$/);
  await page.click('.btn-inicio');
  await page.waitForURL(/\/(index\.html)?$/);
  await expect(page.locator('#recientes')).toBeVisible();
  await expect(page.locator('.reciente[data-id="cuenta"]')).toBeVisible();
});

test('la rutina de hoy abre La visita de Lolo', async ({ page }) => {
  await page.goto('/');
  await page.click('#ctaHoy');
  await page.waitForURL(/jugar\.html#lolo$/);
  await expect(page.locator('#actualT')).toHaveText('La visita de Lolo');
});

test('la edad elegida se recuerda en los juegos', async ({ page }) => {
  await page.goto('/');
  await page.click('#edades button[data-e="4"]');
  await page.goto('/jugar.html');
  await page.click('#btnMenu');
  await expect(page.locator('.edad-f[data-e="4"]')).toHaveAttribute('aria-pressed', 'true');
});

test('en modo tranquilo se lanza sin animación', async ({ page }) => {
  await page.goto('/');
  await page.click('#btnCalma');
  await expect(page.locator('html')).toHaveClass(/calma/);
  await page.locator('.tarjeta[data-id="formas"] .jugar').click();
  await page.waitForURL(/jugar\.html#formas$/);
  await expect(page.locator('html')).toHaveClass(/calma/);
});

test('la portada no se sale de la pantalla a lo ancho', async ({ page }) => {
  await page.goto('/');
  for (const y of [0, 900, 2000, 99999]) {
    await page.evaluate(v => scrollTo(0, v), y);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(ancho).toBeLessThanOrEqual(1);
  }
});

test('la categoría de trazos lleva a La tinta de Lolo', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="trazos"]').click();
  await expect(page.locator('.pestana[data-cat="trazos"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(1);
  await page.locator('.tarjeta[data-id="tinta"] .jugar').click();
  await page.waitForURL(/jugar\.html#tinta$/);
  await expect(page.locator('#actualT')).toHaveText('La tinta de Lolo');
});

test('la categoría de otoño reúne sus siete juegos', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="otono"]').click();
  await expect(page.locator('.tarjeta:not([hidden])')).toHaveCount(7);
  await page.locator('.tarjeta[data-id="castanas"] .jugar').click();
  await page.waitForURL(/jugar\.html#castanas$/);
  await expect(page.locator('#actualT')).toHaveText('El puesto de castañas');
});

test('el botón «Invítame a un café» lleva a la donación de PayPal en otra pestaña', async ({ page }) => {
  await page.goto('/');
  const cafe = page.locator('.nav .btn-cafe');
  await expect(cafe).toBeVisible();
  await expect(cafe).toHaveAttribute('href', /^https:\/\/www\.paypal\.com\/donate\//);
  await expect(cafe).toHaveAttribute('target', '_blank');
  await expect(page.locator('.pie-cafe')).toHaveCount(1);
  await cafe.click();
  await expect(page.locator('#cafe')).toBeVisible();
  await expect(page.locator('#cafe .qr')).toBeVisible();
  await expect(page.locator('#cafe .cafe-ir')).toHaveAttribute('href', /hosted_button_id=KGQEKG4Y45SCW/);
  await page.click('#cafeCerrar');
  await expect(page.locator('#cafe')).toBeHidden();
  await page.goto('/jugar.html');
  await expect(page.locator('.btn-cafe')).toHaveCount(0);
});

test('en las categorías hay entrada a los generadores de fichas y al modo 3 años', async ({ page }) => {
  await page.goto('/');
  const extras = page.locator('#fichas .extra');
  await expect(extras).toHaveCount(3);
  await expect(page.locator('#fichas .extra[href="fichas.html"]')).toContainText('Fichas de trazos');
  await page.locator('#fichas .extra[href="fichas-3.html"]').click();
  await page.waitForURL(/fichas-3\.html$/);
  await expect(page.locator('h1')).toHaveText('Fichas para 3 años');
});
