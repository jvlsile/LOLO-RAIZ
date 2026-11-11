// La tinta de Lolo: con 4 años aparecen las vocales en mayúscula.
const { test, expect } = require('@playwright/test');
const VOC = ['vA', 'vE', 'vI', 'vO', 'vU'];
async function abre(page, edad) {
  await page.addInitScript(e => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); localStorage.setItem('raiz-edad', e); sessionStorage.setItem('limpio', '1'); } } catch (x) {} }, edad);
  await page.goto('/jugar.html#tinta');
  await expect(page.locator('#panel-tinta .opt').first()).toBeVisible();
}
async function trazar(page) {
  await page.locator('#panel-tinta .pizarra-trazo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const tramos = await page.evaluate(() => [...document.querySelectorAll('#panel-tinta .guia')].map(g => {
    const L = g.getTotalLength(), m = g.getScreenCTM(), pts = [];
    for (let i = 0; i <= 50; i++) { const q = g.getPointAtLength(L * i / 50), s = new DOMPoint(q.x, q.y).matrixTransform(m); pts.push([s.x, s.y]); }
    return pts;
  }));
  for (const pts of tramos) {
    await page.mouse.move(pts[0][0], pts[0][1]); await page.mouse.down();
    for (const [i, [x, y]] of pts.entries()) await page.mouse.move(x + Math.sin(i) * 5, y + Math.cos(i * 1.3) * 5);
    await page.mouse.up();
  }
}

test('con 3 y con 5 años solo hay los ocho trazos; con 4 se suman cinco vocales', async ({ page }) => {
  await abre(page, '3');
  await expect(page.locator('#panel-tinta .opt')).toHaveCount(8);
  await page.evaluate(() => localStorage.setItem('raiz-edad', '4'));
  await page.reload();
  await expect(page.locator('#panel-tinta .opt')).toHaveCount(13);
  await expect(page.locator('#panel-tinta .opt').last()).toContainText('La vocal U');
});

for (const k of VOC) {
  test(`la vocal «${k.slice(1)}» se completa siguiendo los puntos`, async ({ page }) => {
    await abre(page, '4');
    await page.click(`#panel-tinta .opt[data-k="${k}"]`);
    await expect(page.locator('#panel-tinta .pizarra-trazo')).toBeVisible();
    await trazar(page);
    await expect(page.locator('#panel-tinta .pizarra-trazo[data-hecho]')).toBeVisible();
  });
}
