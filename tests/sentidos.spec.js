// Los sentidos: la sección de la portada con su vídeo, el pasaporte de sellos y las fichas para imprimir.
const { test, expect } = require('@playwright/test');

let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('la portada tiene la sección de los sentidos con el vídeo de cabecera y sus seis juegos', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#sentidos');
  await expect(sec.locator('h2')).toHaveText('Los cinco sentidos');
  const video = sec.locator('video#senVideo');
  await expect(video).toHaveAttribute('poster', 'video/lolo-sentidos.jpg');
  await expect(video).toHaveJSProperty('muted', true);
  expect(await video.evaluate(v => v.querySelector('source').getAttribute('src'))).toBe('video/lolo-sentidos.mp4');
  await expect(sec.locator('.sen-card')).toHaveCount(6);
  await expect(sec.locator('.sen-sello')).toHaveCount(6);
  await expect(sec.locator('.sen-sello.si')).toHaveCount(0);
  // El vídeo no se sale de su cabecera.
  const [c, v] = await Promise.all([sec.locator('.sen-cab').boundingBox(), video.boundingBox()]);
  expect(v.width).toBeLessThanOrEqual(c.width + 1);
  expect(v.height).toBeLessThanOrEqual(c.height + 1);
});

test('el botón de sonido del vídeo se activa y se desactiva', async ({ page }) => {
  await page.goto('/');
  const b = page.locator('#senSonido');
  await b.scrollIntoViewIfNeeded();
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#senVideo')).toHaveJSProperty('muted', false);
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'false');
});

test('la categoría «Los sentidos» lleva a su sección y una tarjeta abre el juego', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="sentidos"]').click();
  await expect(page.locator('#sentidos .sen-cab')).toBeInViewport();
  await page.locator('.sen-card[data-id="olfato"]').click();
  await expect(page).toHaveURL(/jugar\.html#olfato$/);
  await expect(page.locator('#actualT')).toHaveText('La nariz de Lolo');
});

test('terminar un juego pone su sello en el pasaporte y la portada lo muestra', async ({ page }) => {
  await page.goto('/jugar.html#sentidos');
  for (let r = 0; r < 5; r++) {
    await page.evaluate(async () => {
      const z = document.querySelector('#panel-sentidos .jz');
      for (const b of z.querySelectorAll('.opt')) { if (z.querySelector('.big.pulso')) break; b.click(); await new Promise(res => setTimeout(res, 40)); }
    });
    const sig = page.locator('#panel-sentidos .big.pulso').last();
    await expect(sig).toBeVisible({ timeout: 8000 });
    await sig.click({ force: true });
  }
  await expect(page.locator('#panel-sentidos .pasaporte .sello.si')).toHaveCount(1);
  await expect(page.locator('#panel-sentidos .pas-txt')).toContainText('1 de 6');
  await page.goto('/');
  await expect(page.locator('#sentidos .sen-sello.si')).toHaveCount(1);
  await expect(page.locator('.sen-card[data-id="sentidos"] .sen-card-sello.si')).toHaveCount(1);
});

test('en «¿Qué suena?» primero hay que escuchar', async ({ page }) => {
  await page.goto('/jugar.html#oido');
  await page.locator('#panel-oido .opt').first().click();
  await expect(page.locator('#panel-oido .txt')).toContainText('Primero tocamos la oreja');
  await expect(page.locator('#panel-oido .opt.bien')).toHaveCount(0);
});

test('las fichas de los sentidos: nueve hojas A4, una por ficha', async ({ page }) => {
  await page.goto('/fichas-sentidos.html');
  await expect(page.locator('.chip-trazo[aria-pressed="true"]')).toHaveCount(9);
  await expect(page.locator('.hoja .ficha-sen')).toHaveCount(9);
  await expect(page.locator('#resumen')).toContainText('9 hojas A4');
  await page.locator('.chip-trazo[data-k="registro"]').click();
  await expect(page.locator('.hoja')).toHaveCount(8);
  await page.locator('#ninguno').click();
  await expect(page.locator('#vacio')).toBeVisible();
  await page.locator('#todos').click();
  await expect(page.locator('.hoja')).toHaveCount(9);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(ancho, 'desborde a lo ancho').toBeLessThanOrEqual(1);
});

test('el enlace al diploma abre solo el diploma', async ({ page }) => {
  await page.goto('/fichas-sentidos.html#diploma');
  await expect(page.locator('.hoja')).toHaveCount(1);
  await expect(page.locator('.hoja')).toContainText('Explorador o exploradora');
});
