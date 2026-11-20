// Asamblea guiada: recorrido, menú lateral y contenido por edad.
const { test, expect } = require('@playwright/test');
let errores;
test.beforeEach(async ({ page }) => {
  errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('limpio')) { localStorage.clear(); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
});
test.afterEach(() => { expect(errores, 'errores en la consola').toEqual([]); });

test('se recorre con Siguiente y con la barra espaciadora, y el menú salta a cualquier bloque', async ({ page }) => {
  await page.goto('/asamblea.html');
  await expect(page.locator('#cuenta')).toContainText('1 de 13');
  await page.click('#btnSig');
  await expect(page.locator('#cuenta')).toContainText('2 de 13');
  await page.locator('#bloque').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#cuenta')).toContainText('3 de 13');
  await page.locator('#menu button').nth(11).click();
  await expect(page.locator('#bloque h2')).toHaveText('Los tres rincones');
  await page.click('#btnAnt');
  await expect(page.locator('#bloque h2')).toHaveText('Pregunta reto');
});

test('la palabra cambia con la edad: 3 en mayúscula, 4 con colores y 5 en minúscula con frase', async ({ page }) => {
  await page.goto('/asamblea.html#palabra');
  await page.click('#edades [data-e="3"]');
  await expect(page.locator('.datos .dato').first()).toContainText('Palmas');
  await expect(page.locator('#frase')).toHaveCount(0);
  await page.click('#edades [data-e="4"]');
  await expect(page.locator('.datos .dato')).toHaveCount(3);
  await expect(page.locator('.silabas .vocal').first()).toBeVisible();
  await page.click('#edades [data-e="5"]');
  await expect(page.locator('#frase')).toBeVisible();
  await page.reload();
  await expect(page.locator('#edades [data-e="5"]')).toHaveAttribute('aria-pressed', 'true');
});

test('el número respeta el máximo de cada edad y la pauta tiene copa, tronco y raíces', async ({ page }) => {
  await page.goto('/asamblea.html#numero');
  for (const [e, max] of [[3, 5], [4, 15], [5, 50]]) {
    await page.click(`#edades [data-e="${e}"]`);
    const n = +(await page.locator('.tarjeta .gran').nth(e === 4 ? 1 : 0).innerText());
    expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(max);
  }
  await page.goto('/asamblea.html#trazo');
  await expect(page.locator('.pauta')).toBeVisible();
  const h = await page.locator('.pauta').evaluate(el => el.getBoundingClientRect().height);
  expect(h).toBeGreaterThan(100);
});

test('al llegar a la despedida se guarda el registro del día', async ({ page }) => {
  await page.goto('/asamblea.html#despedida');
  const reg = await page.evaluate(() => JSON.parse(localStorage.getItem('raiz-asamblea-registro')));
  const dia = Object.values(reg)[0];
  expect(dia.palabra).toBeTruthy(); expect(dia.numero).toBeGreaterThan(0);
});

test('la asamblea no se sale de la pantalla a lo ancho', async ({ page }) => {
  await page.goto('/asamblea.html');
  for (let i = 0; i < 9; i++) {
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(ancho, `desborde en el bloque ${i + 1}`).toBeLessThanOrEqual(1);
    await page.locator('#menu button').nth(i).click();
  }
});

test('Preparar: la palabra, el número y los rincones elegidos aparecen en la asamblea', async ({ page }) => {
  await page.goto('/preparar.html');
  await page.fill('#asPal', 'ma-ri-po-sa');
  await page.fill('#asNum', '3');
  await page.fill('#asR1', 'Pintura');
  await page.goto('/asamblea.html#palabra');
  await expect(page.locator('.datos .dato').first()).toContainText('4');
  await page.goto('/asamblea.html#numero');
  await page.click('#edades [data-e="3"]');
  await expect(page.locator('.tarjeta .gran')).toHaveText('3');
  await page.goto('/asamblea.html#rincones');
  await expect(page.locator('.rincon').first()).toHaveText('Pintura');
});

test('los bloques nuevos aparecen en orden y los de 3 años incluyen el repaso de nombres', async ({ page }) => {
  await page.goto('/asamblea.html');
  await page.click('#edades [data-e="4"]');
  await expect(page.locator('#menu button')).toHaveCount(13);
  await expect(page.locator('#menu button .t').nth(4)).toHaveText('Cuerpo');
  await expect(page.locator('#menu button .t').nth(7)).toHaveText('Lógica');
  await expect(page.locator('#menu button .t').nth(8)).toHaveText('Pictogramas');
  await expect(page.locator('#menu button .t').nth(9)).toHaveText('Veo-veo');
  await page.click('#edades [data-e="3"]');
  await expect(page.locator('#menu button')).toHaveCount(14);
  await page.evaluate(() => localStorage.setItem('raiz-nombres', JSON.stringify(['Ana', 'Lucía'])));
  await page.locator('#menu button .t').filter({ hasText: 'Nombres' }).click();
  await expect(page.locator('#bloque .picto')).toHaveCount(2);
});

test('el veo-veo tiene dos opciones en 3 años y tres en 4, y se marca la elección', async ({ page }) => {
  await page.goto('/asamblea.html#veo');
  await page.click('#edades [data-e="3"]');
  await expect(page.locator('.opcion')).toHaveCount(2);
  await page.click('#edades [data-e="4"]');
  await expect(page.locator('.opcion')).toHaveCount(3);
  await page.locator('.opcion').first().click();
  await expect(page.locator('.opcion').first()).toHaveClass(/ok|no/);
});

test('en la palabra se pueden señalar las letras y se cuentan las vocales', async ({ page }) => {
  await page.goto('/asamblea.html#palabra');
  await page.click('#edades [data-e="4"]');
  const primera = page.locator('.silabas .gran span.vocal').first();
  await primera.click();
  await expect(page.locator('#marca')).toContainText('Vocales señaladas: 1');
});

test('lo que la docente planifica para el día aparece en la asamblea', async ({ page }) => {
  const dow = new Date().getDay();
  test.skip(dow === 0 || dow === 6, 'La planificación es de lunes a viernes');
  await page.goto('/asamblea.html');
  await page.evaluate(() => {
    const d = new Date(), m = d.getMonth() + 1;
    const t = m >= 9 ? 1 : m <= 3 ? 2 : m <= 6 ? 3 : 1;
    const dia = { palabra: 'sol', numero: 2, reto: '¿Qué ves en el cielo?', rincones: ['Rincón A', 'Rincón B'] };
    const semana = {};
    semana[t + '-4'] = { d0: dia, d1: dia, d2: dia, d3: dia, d4: dia };
    localStorage.setItem('raiz-planificacion-semana', JSON.stringify(semana));
    localStorage.setItem('raiz-edad', '4');
  });
  await page.goto('/asamblea.html#palabra');
  await expect(page.locator('.silabas')).toContainText(/sol/i);
  await page.goto('/asamblea.html#reto');
  await expect(page.locator('#bloque')).toContainText('¿Qué ves en el cielo?');
});

test('la edad se elige una vez y la planificación usa la misma', async ({ page }) => {
  await page.goto('/planificacion.html');
  await page.click('[data-e="5"]');
  await page.goto('/asamblea.html');
  await expect(page.locator('#edades [data-e="5"]')).toHaveAttribute('aria-pressed', 'true');
});
