/**
 * Script grader for eval case (b) — theme correctness against DDR-003/004.
 *
 *   pnpm exec tsx <this file> <artefact> [<artefact> ...]
 *
 * Three assertions. Each parses what the artefact DOES rather than what its
 * text contains, because the text-search version of this grader could be
 * satisfied by a comment, and its write-detection could not match ordinary
 * assignment syntax. The controls in ../fixtures/theming/ pin each boundary
 * in both directions.
 *
 *   five-selections-offered      — the selectable set actually rendered or
 *                                  declared is the DDR-004 five. Comments and
 *                                  string literals in prose do not count.
 *   only-palette-themes-carry-trees
 *                                — no authored CSS gives a non-palette
 *                                  data-theme value its own token tree
 *                                  (custom-property declarations outside a
 *                                  prefers-color-scheme resolution block).
 *                                  Writing `data-theme="system"` is
 *                                  conformant: the shipped runtime
 *                                  (oak-theme.js set/apply) does exactly
 *                                  that, and the stylesheet resolves it via
 *                                  `:root[data-theme='system'] {
 *                                  color-scheme: light dark; }`. DDR-004's
 *                                  rule is that `system` has no TREE, so the
 *                                  grader reads the CSS, not the write sites.
 *   applied-value-never-round-trips
 *                                — a read of the applied attribute may exist
 *                                  (diagnostics are fine); it fails only when
 *                                  the read FLOWS INTO a choice or storage
 *                                  sink, which is the DDR-003 conflation.
 *
 * LIMITS, stated because a grader that hides them is worse than one that
 * fails: this is regex-based static reading, not a parser. Escalate to a
 * parser over an AST if an artefact appears whose CSS these scans misread.
 *
 * Exits non-zero if any assertion fails.
 */
import { readFileSync } from 'node:fs';

const PALETTE_THEMES = ['light', 'dark', 'high-contrast', 'colour-safe'] as const;
const REQUIRED_SELECTIONS = [...PALETTE_THEMES, 'system'] as const;

/** Strip comments so a commented-out theme name cannot satisfy an assertion. */
function stripComments(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

/**
 * The selections the artefact actually offers.
 *
 * Controls are built in more than one shape, and a parser that knows only
 * `<option value>` reports a button-group switcher as offering NOTHING —
 * a false negative caught first-hand in iteration 1, on an artefact that
 * offered its three themes as `<button data-theme-choice="light">`. So the
 * scan collects theme-valued attributes on any interactive element,
 * whatever the attribute is called, plus array literals that enumerate a
 * theme set.
 */
function offeredSelections(code: string): ReadonlySet<string> {
  const found = new Set<string>();
  for (const tag of code.matchAll(/<(?:option|button|input|a|li)\b([^>]*)>/gi)) {
    for (const attr of tag[1].matchAll(/[\w-]+\s*=\s*["']([a-z-]+)["']/gi)) {
      const value = attr[1].toLowerCase();
      if ((REQUIRED_SELECTIONS as readonly string[]).includes(value)) {
        found.add(value);
      }
    }
  }
  for (const item of code.matchAll(/\[([^\]]{0,400})\]/g)) {
    const quoted = [...item[1].matchAll(/["']([a-z-]+)["']/gi)].map((m) => m[1].toLowerCase());
    absorbIfThemeSet(quoted, found);
  }
  // Object maps: the estate's own reference switcher declares its set as
  // `{ light: 'Light', dark: 'Dark', system: …, 'high-contrast': … }` — a
  // third shape, and the third false negative this parser produced against
  // a real artefact. Keys may be bare or quoted.
  for (const block of code.matchAll(/\{([^{}]{0,600})\}/g)) {
    const keys = [...block[1].matchAll(/(?:^|[,{\s])["']?([a-z][a-z-]*)["']?\s*:/gi)].map((m) =>
      m[1].toLowerCase(),
    );
    absorbIfThemeSet(keys, found);
  }
  return found;
}

/**
 * Adopt a candidate name list only when it is MOSTLY theme names, so an
 * unrelated array or object carrying the word "light" cannot register as a
 * theme set.
 */
function absorbIfThemeSet(candidates: readonly string[], found: Set<string>): void {
  const themeish = candidates.filter((value) =>
    (REQUIRED_SELECTIONS as readonly string[]).includes(value),
  );
  if (themeish.length >= 2 && themeish.length >= candidates.length / 2) {
    for (const value of themeish) {
      found.add(value);
    }
  }
}

/**
 * CSS rule blocks that give a NON-PALETTE data-theme value its own palette.
 *
 * DDR-004's rule is that `system` carries no token tree — it resolves. The
 * design system implements that resolution with `[data-theme='system'] {
 * color-scheme: light dark; }` plus icon filters inside a
 * `prefers-color-scheme` media block. That is the resolution mechanism, not
 * a fifth palette, and a grader that cannot tell the difference fails the
 * design system itself.
 *
 * So a block is a defect only when it BOTH selects a non-palette value AND
 * declares custom properties, while NOT sitting inside a
 * `prefers-color-scheme` media query.
 */
function cssPaletteTrees(code: string): readonly string[] {
  const offenders: string[] = [];
  const mediaResolutionRanges: Array<[number, number]> = [];
  for (const media of code.matchAll(/@media[^{]*prefers-color-scheme[^{]*\{/gi)) {
    // Find the matching close brace for this media block.
    let depth = 0;
    let index = media.index! + media[0].length - 1;
    for (; index < code.length; index += 1) {
      if (code[index] === '{') depth += 1;
      else if (code[index] === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    mediaResolutionRanges.push([media.index!, index]);
  }
  const insideResolution = (at: number) =>
    mediaResolutionRanges.some(([start, end]) => at >= start && at <= end);

  for (const rule of code.matchAll(/([^{}]*\[data-theme=["']([a-z-]+)["']\][^{}]*)\{([^{}]*)\}/gi)) {
    const value = rule[2].toLowerCase();
    if ((PALETTE_THEMES as readonly string[]).includes(value)) continue;
    if (!/--[a-z0-9-]+\s*:/i.test(rule[3])) continue; // no custom properties: not a tree
    if (insideResolution(rule.index!)) continue; // resolution, not an independent palette
    // The captured prefix runs from the previous `}` (or file start), so in
    // an HTML artefact it swallows the markup before a <style> block — the
    // first evidence slice printed `</select>` ahead of the selector.
    // Stripping through the last complete HTML tag leaves the selector
    // itself; a CSS child combinator (`a > b`) contains no `<`, so real
    // selectors survive intact.
    const selector = rule[1].replace(/^[\s\S]*<[^<>]*>/, '').replace(/\s+/g, ' ').trim();
    const body = rule[3].replace(/\s+/g, ' ').trim();
    offenders.push(`${selector.slice(0, 60)} { ${body.slice(0, 60)} }`);
  }
  return offenders;
}

interface RoundTrip {
  readonly read: string;
  readonly sink: string;
}

/**
 * Reads of the APPLIED value that flow into a choice/storage sink.
 *
 * A bare read is not a defect — DDR-003 forbids the applied value becoming
 * state, not being observed. So each read is traced to the identifier it
 * binds, and only a binding that reaches a sink is reported.
 */
function roundTrips(code: string): readonly RoundTrip[] {
  const SINK = String.raw`localStorage\.setItem|sessionStorage\.setItem|\bset[A-Z]\w*\s*\(|\b(?:choice|selected|stored|preference|userTheme)\w*\s*=`;
  const hits: RoundTrip[] = [];

  const readExpr = String.raw`(?:getAttribute\s*\(\s*["']data-theme["']\s*\)|\.dataset\s*\.\s*theme\b(?!\s*=))`;

  // Direct: the read is an argument to the sink in one expression.
  for (const m of code.matchAll(new RegExp(String.raw`(${SINK})[^;\n]{0,120}?${readExpr}`, 'gi'))) {
    hits.push({ read: m[0].replace(/\s+/g, ' ').slice(0, 100), sink: m[1] });
  }

  // Indirect: `const x = <read>` and `x` later reaches a sink.
  for (const bind of code.matchAll(
    new RegExp(String.raw`(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*[^;\n]*?${readExpr}`, 'gi'),
  )) {
    const name = bind[1];
    const sinkUse = new RegExp(String.raw`(${SINK})[^;\n]{0,120}?\b${name}\b`, 'i').exec(code);
    if (sinkUse) {
      hits.push({
        read: bind[0].replace(/\s+/g, ' ').slice(0, 100),
        sink: sinkUse[0].replace(/\s+/g, ' ').slice(0, 100),
      });
    }
  }
  return hits;
}

const artefacts = process.argv.slice(2);
if (artefacts.length === 0) {
  console.error('usage: grade-theming.ts <artefact> [<artefact> ...]');
  process.exit(2);
}

let anyFailed = false;
for (const artefact of artefacts) {
  const code = stripComments(readFileSync(artefact, 'utf8'));

  const offered = offeredSelections(code);
  const missing = REQUIRED_SELECTIONS.filter((theme) => !offered.has(theme));

  const paletteTrees = cssPaletteTrees(code);

  const trips = roundTrips(code);

  const assertions = {
    'five-selections-offered': {
      pass: missing.length === 0,
      evidence:
        missing.length === 0
          ? `offers ${[...offered].sort().join(', ')}`
          : `offered set is ${[...offered].sort().join(', ') || 'empty'}; missing ${missing.join(', ')} (DDR-004: a subset control is non-conformant)`,
    },
    'only-palette-themes-carry-trees': {
      pass: paletteTrees.length === 0,
      evidence:
        paletteTrees.length > 0
          ? `CSS gives a non-palette value its own palette: ${paletteTrees.join('; ')} — DDR-004: system resolves, it has no tree`
          : 'no non-palette data-theme value carries a token tree in the authored CSS',
    },
    'applied-value-never-round-trips': {
      pass: trips.length === 0,
      evidence:
        trips.length === 0
          ? 'no read of the applied attribute reaches a choice or storage sink'
          : `${trips.length} round-trip(s): ${trips.map((t) => t.read).slice(0, 3).join(' | ')} (DDR-003)`,
    },
  };

  if (Object.values(assertions).some((a) => !a.pass)) {
    anyFailed = true;
  }
  console.log(JSON.stringify({ artefact, assertions }, null, 2));
}
process.exit(anyFailed ? 1 : 0);
