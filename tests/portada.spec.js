// Pruebas de la portada: elegir y lanzar juegos.
const { test, expect } = require('@playwright/test');

let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('muestra a Lolo, la pregunta y los 18 juegos', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('La visita de Lolo');
  await expect(page.locator('#pregunta')).toHaveText('¿Qué trabajamos hoy?');
  await expect(page.locator('.juego')).toHaveCount(18);
  await expect(page.locator('#hoy > *')).toHaveCount(4);
});

test('filtra por objetivo y por edad', async ({ page }) => {
  await page.goto('/');
  await page.click('.chip[data-k="numeros"]');
  await expect(page.locator('#tJuegos')).toHaveText('Juegos para «contar»');
  await expect(page.locator('.juego')).toHaveCount(5);
  await page.click('#edades button[data-e="5"]');
  await expect(page.locator('.juego')).toHaveCount(3);
  await page.click('.chip[data-k="moverse"]');
  await page.click('#edades button[data-e="3"]');
  await expect(page.locator('.juego')).toHaveCount(2);
});

test('combina objetivo y edad', async ({ page }) => {
  await page.goto('/');
  await page.click('.chip[data-k="ciencia"]');
  await page.click('#edades button[data-e="3"]');
  await page.click('.chip[data-k="pensar"]');
  await expect(page.locator('.juego')).toHaveCount(1);
  await page.click('.chip[data-k="moverse"]');
  await page.click('#edades button[data-e="5"]');
  await expect(page.locator('.juego')).toHaveCount(1);
});

test('la edad elegida se recuerda en los juegos', async ({ page }) => {
  await page.goto('/');
  await page.click('#edades button[data-e="4"]');
  await page.goto('/jugar.html');
  await page.click('#btnMenu');
  await expect(page.locator('.edad-f[data-e="4"]')).toHaveAttribute('aria-pressed', 'true');
});

test('tocar un juego lo abre y aparece en «jugados hace poco»', async ({ page }) => {
  await page.goto('/');
  await page.locator('.juego[data-id="robot"]').click();
  await page.waitForURL(/jugar\.html#robot$/);
  await expect(page.locator('#actualT')).toHaveText('El robot perdido');
  await page.click('.btn-inicio');
  await page.waitForURL(/\/(index\.html)?$/);
  await expect(page.locator('.mini[data-id="robot"]')).toBeVisible();
});

test('los enlaces funcionan sin animación en modo tranquilo', async ({ page }) => {
  await page.goto('/');
  await page.click('#btnCalma');
  await expect(page.locator('html')).toHaveClass(/calma/);
  await page.locator('.juego[data-id="formas"]').click();
  await page.waitForURL(/jugar\.html#formas$/);
  await expect(page.locator('html')).toHaveClass(/calma/);
});

test('la portada no se sale de la pantalla a lo ancho', async ({ page }) => {
  await page.goto('/');
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho).toBeLessThanOrEqual(1);
});
