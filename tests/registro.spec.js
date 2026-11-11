// Registro semanal: se rellena con la asamblea y guarda observaciones.
const { test, expect } = require('@playwright/test');
let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('muestra cinco días y las observaciones se guardan', async ({ page }) => {
  await page.goto('/registro.html');
  await expect(page.locator('#tabla tbody tr')).toHaveCount(5);
  await page.locator('#tabla textarea').first().fill('Muy buena atención');
  await page.reload();
  await expect(page.locator('#tabla textarea').first()).toHaveValue('Muy buena atención');
});

test('lo trabajado en la asamblea aparece en el registro de la semana (si hoy es día lectivo)', async ({ page }) => {
  await page.goto('/asamblea.html#despedida');
  await page.goto('/registro.html');
  const hoy = new Date().getDay();
  if (hoy >= 1 && hoy <= 5) await expect(page.locator('#tabla tbody tr').nth(hoy - 1).locator('td').nth(3)).not.toHaveText('—');
  await page.click('#btnAnt');
  await expect(page.locator('#tabla tbody tr')).toHaveCount(5);
});
