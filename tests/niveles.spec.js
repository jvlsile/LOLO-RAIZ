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
  await page.goto('/jugar.html#formas');
  await expect(page.locator('#nivel')).toBeHidden();
});
