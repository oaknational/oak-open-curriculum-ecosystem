/*
 * Fixture surface for the fluid-type cells (fluid-type.spec.ts): reads the
 * kit tier files and brand sheets from their source-of-truth paths and
 * assembles the per-identity fixture page. Lives beside the spec as a
 * helper (not a test file) so the real file reads happen on a non-test
 * surface — the byte-parity gate holds the served copies identical to the
 * sources inlined here, so measuring the sources measures what ships.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../packages/design/oak-design-system',
);

const kitCss = (file: string): string => readFileSync(join(KIT, file), 'utf8');

/** Brand sheets inline in load order; brand-full's relative import of
 *  brand-a is replaced by inlining brand-a first (the Google Fonts import
 *  inside brand-a stays — it leads its own style block, so it remains a
 *  valid leading import). */
const brandCss = (slug: string): string[] => {
  const dir = join(KIT, 'studio-source/whitelabel', slug);
  const partA = readFileSync(join(dir, 'brand-a.css'), 'utf8');
  const full = readFileSync(join(dir, 'brand-full.css'), 'utf8').replace(
    /@import url\('brand-a\.css'\);\n/,
    '',
  );
  return [partA, full];
};

interface SlotExpectation {
  readonly min: number;
  readonly max: number;
  readonly leading: number;
}

export interface IdentityExpectation {
  readonly slug: 'oak' | 'pds' | 'creature';
  /** A named display-face check so a failed webfont load reads as a red
   *  cell, never as a silently different measurement. */
  readonly fontCheck: string | null;
  readonly slots: readonly [SlotExpectation, SlotExpectation, SlotExpectation];
}

/** Expected px per slot (min at 320px; max from 960px up), from each
 *  sheet's declared parts — the plan's §W1 derivation, restated here so a
 *  silent part edit reddens a cell. */
export const IDENTITIES: readonly IdentityExpectation[] = [
  {
    slug: 'oak',
    fontCheck: null,
    slots: [
      { min: 40, max: 56, leading: 1.1429 },
      { min: 32, max: 48, leading: 1.1667 },
      { min: 24, max: 40, leading: 1.2 },
    ],
  },
  {
    slug: 'pds',
    fontCheck: null,
    slots: [
      { min: 36, max: 48, leading: 1.05 },
      { min: 28, max: 36, leading: 1.11 },
      { min: 22, max: 27, leading: 1.11 },
    ],
  },
  {
    slug: 'creature',
    fontCheck: '800 1em "Baloo 2"',
    slots: [
      { min: 56, max: 84, leading: 1.02 },
      { min: 44, max: 64, leading: 1.05 },
      { min: 36, max: 52, leading: 1.08 },
    ],
  },
];

/** The front page's real headline — "Curriculum" is the binding word. */
const HERO_TEXT = 'Oak Open Curriculum Design System';

export const fixtureHtml = (slug: IdentityExpectation['slug']): string => {
  const brand = slug === 'oak' ? [] : brandCss(slug);
  const styles = [kitCss('colors_and_type.css'), kitCss('print.css'), ...brand]
    .map((css) => `<style>${css}</style>`)
    .join('\n');
  return `<!doctype html><html><head>${styles}</head><body class="oak-scope">
    <h1 id="h1" class="oak-heading-1">${HERO_TEXT}</h1>
    <h2 id="h2" class="oak-heading-2">Probe</h2>
    <h3 id="h3" class="oak-heading-3">Probe</h3>
    <div id="fit-box" style="width: 288px; overflow: hidden;">
      <p id="fit" class="oak-heading-1" style="hyphens: none; overflow-wrap: normal; margin: 0;">${HERO_TEXT}</p>
    </div>
  </body></html>`;
};
