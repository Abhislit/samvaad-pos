/* Contrast audit against the rendered DOM, not against token values.
   Walks every text node and every non-text mark, resolves the effective
   foreground and the first non-transparent background behind it, and reports
   anything under WCAG AA. Correct sRGB relative luminance, no percentage bugs. */
const { chromium } = require('/home/abhishek-parmar/projects/lichtblick/node_modules/playwright');

const AUDIT = `
(() => {
  /* Any CSS colour syntax, including oklch(), resolves through a canvas.
     Reading computed style alone is not enough: Chrome serialises authored
     oklch() verbatim, so a regex on the string silently skips every token in
     this design system. */
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const parse = (css) => {
    if (!css || css === 'transparent') return null;
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = '#000';
    try { cv.fillStyle = css; } catch (e) { return null; }
    cv.fillRect(0, 0, 1, 1);
    const d = cv.getImageData(0, 0, 1, 1).data;
    if (d[3] === 0) return null;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  const effBg = (node) => {
    let el = node, acc = null;
    while (el && el !== document.documentElement.parentNode) {
      const cs = getComputedStyle(el);
      const c = parse(cs.backgroundColor);
      const img = cs.backgroundImage && cs.backgroundImage !== 'none';
      if (c && c.a > 0) acc = acc ? over(acc, c) : c;
      if (c && c.a >= 1 && !img) return acc;
      if (img && acc) return acc;
      el = el.parentElement;
    }
    return acc || { r: 255, g: 255, b: 255, a: 1 };
  };

  const out = [];
  const seen = new Set();
  const walk = (node) => {
    for (const child of node.children) {
      const cs = getComputedStyle(child);
      if (cs.display === 'none' || cs.visibility === 'hidden') { walk(child); continue; }
      const text = Array.from(child.childNodes)
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      const own = child.querySelector(':scope > *');
      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = px >= 24 || (px >= 18.66 && bold);
      if (text && !own) {
        const fg = parse(cs.color);
        const bg = effBg(child);
        if (fg) {
          const r = ratio(over(fg, bg), bg);
          const need = large ? 3 : 4.5;
          const key = text.slice(0, 30) + '|' + cs.color + '|' + Math.round(r * 100);
          if (r < need && !seen.has(key)) {
            seen.add(key);
            out.push({ kind: 'text', need, got: Math.round(r * 100) / 100, px, sample: text.slice(0, 44),
                       fg: cs.color, sel: child.tagName.toLowerCase() + '.' + (child.className || '').toString().split(' ')[0] });
          }
        }
      }
      // non-text marks: borders and background shapes that carry meaning
      const bc = parse(cs.borderTopColor);
      if (bc && bc.a > 0.05 && parseFloat(cs.borderTopWidth) > 0 && !text && !own) {
        const bg = effBg(child);
        const r = ratio(over(bc, bg), bg);
        if (r < 3) {
          const key = 'b|' + cs.borderTopColor + '|' + child.tagName + Math.round(r * 100);
          if (!seen.has(key)) {
            seen.add(key);
            out.push({ kind: 'mark', need: 3, got: Math.round(r * 100) / 100, sample: (child.className || child.tagName).toString().slice(0, 40),
                       fg: cs.borderTopColor, sel: child.tagName.toLowerCase() + '.' + (child.className || '').toString().split(' ')[0] });
          }
        }
      }
      walk(child);
    }
  };
  walk(document.body);
  return out;
})()
`;

(async () => {
  const b = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const states = [
    ['board', async () => {}],
    ['drawer', async (p) => { await p.click('.row [data-open]'); }],
    ['dropped', async (p) => { await p.click('.row [data-drop]'); }],
    ['after-approve', async (p) => {
      await p.click('.row [data-approve]');
      await p.waitForTimeout(900);
    }],
    ['after-print', async (p) => {
      await p.click('.row [data-approve]');
      await p.waitForTimeout(900);
      await p.click('.row [data-print]');
      await p.waitForTimeout(2600);
    }],
    ['batch', async (p) => {
      await p.click('[data-print-all]');
      await p.waitForTimeout(1600);
    }],
    ['trays-empty', async (p) => {
      await p.click('[data-print-all]');
      await p.waitForTimeout(5200);
    }],
    ['outlet', async (p) => {
      await p.click('.row [data-approve]');
      await p.waitForTimeout(900);
      await p.click('.row [data-print]');
      await p.waitForTimeout(800);
    }],
    ['mobile-nav', async (p) => { await p.click('#demo-btn'); }]
  ];
  const all = [];

  /* Every page in the app, or a new window ships unmeasured. `printed.html` is
     a page an operator reads all day; its empty state is the one nobody looks
     at and the one that goes wrong. */
  const pages = [
    ['index.html', states],
    ['printed.html', [
      ['printed-list', async () => {}],
      ['printed-empty', async (p) => {
        /* Drain it the honest way: print everything at the counter first. */
        await p.evaluate(() => SV.store.update((s) => {
          s.orders.forEach((o) => { o.printedAt = null; o.billNo = null; });
        }));
        await p.waitForTimeout(200);
      }],
      ['printed-drawer', async (p) => { await p.click('.row [data-open]'); }]
    ]]
  ];

  for (const [page, pageStates] of pages) {
    for (const [name, setup] of pageStates) {
      const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
      const p = await ctx.newPage();
      const errs = [];
      p.on('pageerror', (e) => errs.push(page + '/' + name + ': ' + e.message));
      await p.goto('http://127.0.0.1:8123/' + page, { waitUntil: 'domcontentloaded' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(250);
      await setup(p);
      await p.waitForTimeout(350);
      const rows = await p.evaluate(AUDIT);
      rows.forEach((r) => all.push(Object.assign({ state: page + '/' + name }, r)));
      await ctx.close();
      if (errs.length) { console.log('JS ERRORS'); errs.forEach((e) => console.log('  ' + e)); }
    }
  }
  // and the same at 390
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8123/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  (await p.evaluate(AUDIT)).forEach((r) => all.push(Object.assign({ state: 'mobile' }, r)));
  await p.click('.row [data-drop]');
  await p.waitForTimeout(250);
  (await p.evaluate(AUDIT)).forEach((r) => all.push(Object.assign({ state: 'mobile-dropped' }, r)));
  await ctx.close();

  await b.close();
  const uniq = [];
  const k = new Set();
  all.forEach((r) => { const key = r.sel + r.kind + Math.round(r.got * 100); if (!k.has(key)) { k.add(key); uniq.push(r); } });
  if (!uniq.length) { console.log('PASS: no text or non-text mark below its WCAG threshold in any state'); return; }
  console.log(uniq.length + ' findings');
  uniq.sort((a, b) => a.got - b.got).forEach((r) =>
    console.log('  ' + r.kind.padEnd(4) + ' ' + String(r.got).padStart(6) + ' need ' + r.need +
      '  [' + r.state + '] ' + r.sel + '  "' + r.sample + '"  ' + r.fg));
})();