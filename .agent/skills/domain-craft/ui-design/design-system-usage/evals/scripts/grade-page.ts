/**
 * Script grader for the design-system-usage eval suite.
 *
 *   pnpm exec tsx <this file> --mode=page     <file> [<file> ...]
 *   pnpm exec tsx <this file> --mode=response <file> [<file> ...]
 *
 * Two modes, because the suite's cases produce two different kinds of
 * artefact and grading them with one set of requirements is how a
 * conforming answer gets failed for the wrong reason:
 *
 *   page      — cases 1: a composed HTML page. Every assertion applies,
 *               including "the page must reference design-system classes".
 *   response  — case 3: a prose answer to a user. The class-reference
 *               assertion becomes INFORMATIONAL (a good answer to "just
 *               write me the CSS" may name classes in prose, or route to
 *               the new-component recipe, and must not be failed for the
 *               shape of its reply). The ad-hoc-CSS and literal-value
 *               assertions still bind, and fenced ```css blocks count as
 *               authored CSS.
 *
 * Prints one JSON object per artefact and exits non-zero if any BINDING
 * assertion fails.
 *
 * The literal-design-value classifier is the estate's own
 * (`demos/oak-design-showcase/tools/css-literal-values.ts`) — reused rather
 * than re-decided, so the eval and the repo gate cannot drift apart.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findLiteralDesignValues } from '../../../../../../../demos/oak-design-showcase/tools/css-literal-values.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..', '..', '..', '..', '..');
const trunkDir = join(repoRoot, 'packages', 'design', 'oak-design-system');

const TRUNK_FILES = ['components.css', 'colors_and_type.css', 'print.css', 'oak-icons.css'];

/**
 * The class trunk: every `.oak-*` class the design system defines.
 *
 * The character class admits `_` deliberately. The system uses BEM element
 * classes (`.oak-btn__icon`, `.oak-quiz-answer__key`, `.oak-accordion__body`),
 * and a scanner that stops at the underscore records the BLOCK and silently
 * drops the element — which then reads as an invented class when a page uses
 * the real one. That defect published a false invention rate in iteration 1.
 */
function trunkClasses(): ReadonlySet<string> {
  const found = new Set<string>();
  for (const file of TRUNK_FILES) {
    // Comments are stripped before selectors are collected: oak-icons.css
    // mentions the REMOVED `.oak-mask` in a prose comment, and a scan that
    // reads comments as selectors admits the ghost class — a page whose only
    // class was `oak-mask` passed existence. Pinned by
    // fixtures/page/comment-only-class-negative.html.
    const css = readFileSync(join(trunkDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
    for (const match of css.matchAll(/\.(oak-[a-z0-9_-]+)/gi)) {
      found.add(match[1]);
    }
  }
  if (found.size === 0) {
    throw new Error('trunk scan found zero oak-* classes — the grader is scanning nothing');
  }
  if (![...found].some((name) => name.includes('__'))) {
    throw new Error(
      'trunk scan found no BEM element classes — the tokeniser has regressed to dropping `_`',
    );
  }
  return found;
}

/** Every `.oak-*` class the artefact references in a class attribute. */
function referencedClasses(text: string): ReadonlySet<string> {
  const found = new Set<string>();
  for (const attr of text.matchAll(/class(?:Name)?\s*=\s*["']([^"']*)["']/g)) {
    for (const token of attr[1].split(/\s+/)) {
      if (token.startsWith('oak-')) {
        found.add(token);
      }
    }
  }
  return found;
}

/**
 * Author-written CSS: `<style>` blocks, `style=` attributes, and fenced
 * ```css blocks. The fenced form is what a prose answer uses, and omitting
 * it let a response hand over a one-off rule that the grader never saw.
 */
function authoredCssParts(text: string): readonly string[] {
  const parts: string[] = [];
  for (const style of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    parts.push(style[1]);
  }
  for (const inline of text.matchAll(/style\s*=\s*["']([^"']*)["']/g)) {
    parts.push(`.inline-style-attribute { ${inline[1]} }`);
  }
  for (const fence of text.matchAll(/```(?:css|CSS)\s*\n([\s\S]*?)```/g)) {
    parts.push(fence[1]);
  }
  return parts;
}

/** Declaration count in the artefact's own CSS — the ad-hoc-CSS measure. */
function adHocDeclarationCount(css: string): number {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutComments.split(';').filter((part) => /[a-z-]+\s*:/i.test(part)).length;
}

type Mode = 'page' | 'response';

interface Assertion {
  readonly pass: boolean;
  readonly binding: boolean;
  readonly evidence: string;
}

function grade(path: string, mode: Mode, trunk: ReadonlySet<string>) {
  const text = readFileSync(path, 'utf8');
  const referenced = [...referencedClasses(text)];
  const unknown = referenced.filter((name) => !trunk.has(name));
  const css = authoredCssParts(text).join('\n');
  const literals = css.trim() === '' ? [] : findLiteralDesignValues(css);
  const adHoc = adHocDeclarationCount(css);

  const assertions: Record<string, Assertion> = {
    'referenced-oak-classes-exist': {
      // Binding for a composed page; informational for a prose response,
      // where naming zero classes can be the correct answer.
      pass: mode === 'page' ? referenced.length > 0 && unknown.length === 0 : unknown.length === 0,
      binding: mode === 'page',
      evidence:
        referenced.length === 0
          ? 'artefact references no oak-* classes'
          : `${referenced.length} referenced, ${unknown.length} not in the trunk` +
            (unknown.length > 0 ? `: ${unknown.slice(0, 10).join(', ')}` : ''),
    },
    'no-literal-design-values': {
      pass: literals.length === 0,
      binding: true,
      evidence:
        literals.length === 0
          ? 'authored CSS carries no literal design values'
          : `${literals.length} literal(s): ` +
            literals
              .slice(0, 8)
              .map((literal) => literal.value)
              .join(', '),
    },
    'zero-ad-hoc-css': {
      pass: adHoc === 0,
      binding: true,
      evidence: `${adHoc} authored declaration(s) across <style>, style=, and fenced css`,
    },
  };

  return { artefact: path, mode, assertions };
}

const args = process.argv.slice(2);
const modeArg = args.find((arg) => arg.startsWith('--mode='));
const mode: Mode = modeArg?.slice('--mode='.length) === 'response' ? 'response' : 'page';
const artefacts = args.filter((arg) => !arg.startsWith('--'));

if (artefacts.length === 0) {
  console.error('usage: grade-page.ts --mode=page|response <file> [<file> ...]');
  process.exit(2);
}

const trunk = trunkClasses();
let anyFailed = false;
for (const artefact of artefacts) {
  const result = grade(artefact, mode, trunk);
  if (Object.values(result.assertions).some((a) => a.binding && !a.pass)) {
    anyFailed = true;
  }
  console.log(JSON.stringify(result, null, 2));
}
process.exit(anyFailed ? 1 : 0);
