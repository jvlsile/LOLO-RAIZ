// Planificación por trimestre.
const { test, expect } = require('@playwright/test');
let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('cada trimestre muestra su tema y las tres áreas', async ({ page }) => {
  await page.goto('/planificacion.html');
  await expect(page.locator('.area')).toHaveCount(3);
  await page.click('[data-t="2"]');
  await expect(page.locator('#tTema')).toHaveText('Trimestre 2: Los alimentos');
  await page.click('[data-t="3"]');
  await expect(page.locator('#tTema')).toHaveText('Trimestre 3: La calle');
  await page.click('[data-t="1"]');
  await expect(page.locator('#tTema')).toHaveText('Trimestre 1: El cuerpo');
});

test('la situación de aprendizaje se guarda', async ({ page }) => {
  await page.goto('/planificacion.html');
  await page.fill('#sit', 'Mi cuerpo y yo');
  await page.reload();
  await expect(page.locator('#sit')).toHaveValue('Mi cuerpo y yo');
});
