import { describe, expect, it } from 'vitest';

import {
  declaredCustomProperties,
  importedStylesheets,
  isRemoteStylesheet,
} from './identity-deltas';

/**
 * The delta is read from the sheet, so what these tests hold is that the
 * READING sees the whole sheet: properties re-pointed inside a theme arm or
 * a media query change with the identity exactly as much as the ones on
 * `:root`, and a sheet that splits its contract across an `@import` carries
 * the imported half's properties too.
 */

describe('declaredCustomProperties', () => {
  it('collects custom properties from every scope, not only :root', () => {
    const css = `
      :root { --text-primary: #111; }
      [data-theme='dark'] { --bg-primary: #000; }
      @media (min-width: 960px) { .mast { --mast-pad: 2rem; } }
    `;
    expect(declaredCustomProperties(css)).toEqual(['--text-primary', '--bg-primary', '--mast-pad']);
  });

  it('reports a property once however many times the sheet re-points it', () => {
    const css = `
      :root { --text-primary: #111; }
      [data-theme='dark'] { --text-primary: #eee; }
      [data-theme='high-contrast'] { --text-primary: #fff; }
    `;
    expect(declaredCustomProperties(css)).toEqual(['--text-primary']);
  });

  it('ignores ordinary declarations and commented-out ones', () => {
    const css = `:root { color: red; /* --ghost: 1; */ --real: 1; }`;
    expect(declaredCustomProperties(css)).toEqual(['--real']);
  });

  it('reads a var() consumer as a use, never as a declaration', () => {
    const css = `.foo { background: var(--surface-decorative-1); }`;
    expect(declaredCustomProperties(css)).toEqual([]);
  });
});

describe('importedStylesheets', () => {
  it('finds an import written as url() with either quote style', () => {
    expect(importedStylesheets(`@import url('brand-a.css');`)).toEqual(['brand-a.css']);
    expect(importedStylesheets(`@import url("brand-a.css");`)).toEqual(['brand-a.css']);
  });

  it('finds a bare quoted import', () => {
    expect(importedStylesheets(`@import 'brand-a.css';`)).toEqual(['brand-a.css']);
  });

  it('finds every import in declaration order', () => {
    const css = `@import url('a.css');\n@import url('b.css');\n:root { --x: 1; }`;
    expect(importedStylesheets(css)).toEqual(['a.css', 'b.css']);
  });

  it('reports nothing for a sheet that imports nothing', () => {
    expect(importedStylesheets(`:root { --x: 1; }`)).toEqual([]);
  });

  it('reports a remote import too, so the caller decides rather than the reader', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Public+Sans&display=swap');`;
    expect(importedStylesheets(css)).toEqual([
      'https://fonts.googleapis.com/css2?family=Public+Sans&display=swap',
    ]);
  });
});

describe('isRemoteStylesheet', () => {
  it('names the font imports both identity sheets actually open with', () => {
    // Not a hypothetical: public/brands/pds/brand-a.css and
    // .../creature/brand-a.css each import a Google Fonts sheet, and
    // reading one as a file path is what a first render of this page did.
    expect(isRemoteStylesheet('https://fonts.googleapis.com/css2?family=Public+Sans')).toBe(true);
    expect(isRemoteStylesheet('http://example.test/x.css')).toBe(true);
    expect(isRemoteStylesheet('//fonts.example.test/x.css')).toBe(true);
  });

  it('leaves every in-repo path to be followed', () => {
    expect(isRemoteStylesheet('brand-a.css')).toBe(false);
    expect(isRemoteStylesheet('./brand-a.css')).toBe(false);
    expect(isRemoteStylesheet('../shared/brand-a.css')).toBe(false);
    expect(isRemoteStylesheet('/brands/pds/brand-a.css')).toBe(false);
  });
});
