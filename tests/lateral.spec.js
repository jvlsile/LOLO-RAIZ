// Menú lateral de iconos: navegación entre secciones, página activa, pantalla completa y no tapar el contenido.
const { test, expect } = require('@playwright/test');
let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

const PAGINAS = [['hoy.html', 'Hoy'], ['asamblea.html', 'Asamblea'], ['jugar.html', 'Juegos'], ['registro.html', 'Registro'], ['planificacion.html', 'Planificación'], ['preparar.html', 'Preparar']];

for (const [url, nombre] of PAGINAS) {
  test(`${url}: menú visible con la sección activa y sin tapar el contenido`, async ({ page }) => {
    await page.goto('/' + url);
    const nav = page.locator('#lateral');
    await expect(nav).toBeVisible();
    await expect(nav.locator('[aria-current="page"]')).toContainText(nombre);
    await expect(nav.locator('.lat-it')).toHaveCount(url === "jugar.html" ? 8 : 7);
    const cont = await page.locator('main, .stage').first().boundingBox();
    const caja = await nav.boundingBox();
    if (caja.width > caja.height) expect(cont.y + cont.height).toBeLessThanOrEqual(caja.y + 1 + 4000);
    else expect(cont.x).toBeGreaterThanOrEqual(caja.x + caja.width - 1);
  });
}

test('se navega de Hoy a Asamblea y a Registro con el menú', async ({ page }) => {
  await page.goto('/hoy.html');
  await page.locator('#lateral a[href="asamblea.html"]').click();
  await expect(page).toHaveURL(/asamblea\.html/);
  await page.locator('#lateral a[href="registro.html"]').click();
  await expect(page).toHaveURL(/registro\.html/);
});

test('en juegos la pantalla completa oculta el menú y se puede salir', async ({ page, viewport }) => {
  test.skip(viewport.width <= 760, 'en móvil la barra es inferior y no lleva pantalla completa');
  await page.goto('/jugar.html');
  await page.click('#latPantalla');
  await expect(page.locator('#lateral')).toBeHidden();
  await page.click('.lat-salir');
  await expect(page.locator('#lateral')).toBeVisible();
});
