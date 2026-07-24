// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  // Direct links (not styles.css): @import-only sheets parse to zero rules in this serve context.
  for (const p of ["colors_and_type.css", "components.css", "print.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  // White-label proof: ?brand=<slug> loads whitelabel/<slug>/ over the DS sheets.
  // Both parts linked directly — same serve-context rule as above: brand-full's
  // @import of brand-a may not resolve here.
  const brand = new URLSearchParams(location.search).get('brand');
  if (brand && /^[\w-]+$/.test(brand)) {
    for (const f of ['brand-a.css', 'brand-full.css']) {
      const b = document.createElement('link');
      b.rel = 'stylesheet'; b.href = base + '/whitelabel/' + brand + '/' + f;
      document.head.appendChild(b);
    }
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
