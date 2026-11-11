const { test, expect } = require('@playwright/test');

/* Nivel único por edad + ajuste durante el juego (LOLO-RAIZ, fase 1). */
async function abre(page, edad, juego) {
  await page.addInitScript(e => { try { localStorage.clear(); if (e) localStorage.setItem('raiz-edad', e); } catch (x) {} }, edad);
  await page.goto('/jugar.html#' + juego);
  await expect(page.locator('#nivel')).toBeVisible();
}

test('cuenta con 3 años: puntitos de apoyo y números hasta 5', async ({ page }) => {
  await abre(page, '3', 'cuenta');
  await expect(page.locator('#nivelTxt')).toHaveText('Nivel 3 años');
  await expect(page.locator('#nivelMenos')).toBeDisabled();
  expect(await page.locator('.num .pts').count()).toBeGreaterThan(0);
  const k = await page.locator('.num').evaluateAll(b => b.map(x => +x.dataset.k));
  expect(Math.max(...k)).toBeLessThanOrEqual(5);
});

test('cuenta con 5 años: sin puntitos y números más altos', async ({ page }) => {
  await abre(page, '5', 'cuenta');
  await expect(page.locator('#nivelTxt')).toHaveText('Nivel 5 años');
  await expect(page.locator('#nivelMas')).toBeDisabled();
  await expect(page.locator('.num .pts')).toHaveCount(0);
  const k = await page.locator('.num').evaluateAll(b => b.map(x => +x.dataset.k));
  expect(Math.max(...k)).toBeGreaterThan(5);
  expect(Math.max(...k)).toBeLessThanOrEqual(20);
});

test('se puede bajar y subir el nivel durante el juego', async ({ page }) => {
  await abre(page, '4', 'parejas');
  await expect(page.locator('#nivelTxt')).toHaveText('Nivel 4 años');
  await page.locator('#nivelMenos').click();
  await expect(page.locator('#nivelTxt')).toHaveText('Nivel 3 años');
  await page.locator('#nivelMas').click();
  await page.locator('#nivelMas').click();
  await expect(page.locator('#nivelTxt')).toHaveText('Nivel 5 años');
  expect(await page.locator('.carta').count()).toBeGreaterThanOrEqual(6);
});

test('los juegos sin niveles no enseñan el selector', async ({ page }) => {
  await page.goto('/jugar.html#cuento');
  await expect(page.locator('#nivel')).toBeHidden();
});

test('formas: 2 siluetas con 3 años y 4 con 5 años', async ({ page }) => {
  await abre(page, '3', 'formas');
  await expect(page.locator('.silueta')).toHaveCount(2);
  await page.locator('#nivelMas').click(); await page.locator('#nivelMas').click();
  await expect(page.locator('.silueta')).toHaveCount(4);
});

test('cestas: con 5 años hay tres cestas y nueve piezas', async ({ page }) => {
  await abre(page, '5', 'cestas');
  await expect(page.locator('.cesta')).toHaveCount(3);
  await expect(page.locator('.pieza')).toHaveCount(9);
});

test('tamaños: con 3 años el hueco enseña la silueta y con 5 no', async ({ page }) => {
  await abre(page, '3', 'tamanos');
  expect(await page.locator('.peldano .sil svg').count()).toBe(3);
  await page.locator('#nivelMas').click(); await page.locator('#nivelMas').click();
  expect(await page.locator('.peldano .sil svg').count()).toBe(0);
});

test('series: con 3 años la fila es más corta que con 5', async ({ page }) => {
  await abre(page, '3', 'series');
  const a = await page.locator('.serie .tok').count();
  await page.locator('#nivelMas').click(); await page.locator('#nivelMas').click();
  expect(await page.locator('.serie .tok').count()).toBeGreaterThan(a);
});

test('castañas: el pedido es más pequeño con 3 años que con 5', async ({ page }) => {
  await abre(page, '3', 'castanas');
  const a = +(await page.locator('.puesto').getAttribute('data-n'));
  expect(a).toBeLessThanOrEqual(2);
  await page.locator('#nivelMas').click(); await page.locator('#nivelMas').click();
  expect(+(await page.locator('.puesto').getAttribute('data-n'))).toBeGreaterThanOrEqual(4);
});

test('construye: la torre modelo tiene 2 bloques con 3 años y 3 con 5', async ({ page }) => {
  await abre(page, '3', 'construye');
  await expect(page.locator('.modelo .bloque')).toHaveCount(2);
  await page.locator('#nivelMas').click(); await page.locator('#nivelMas').click();
  await expect(page.locator('.modelo .bloque')).toHaveCount(3);
});

test('robot enseña el selector de nivel', async ({ page }) => {
  await abre(page, '5', 'robot');
  await expect(page.locator('#nivelTxt')).toHaveText('Nivel 5 años');
});

test('hojas: con 3 años solo hay dos colores en la primera ronda', async ({ page }) => {
  await abre(page, '3', 'hojas');
  await expect(page.locator('.cesta')).toHaveCount(2);
});
