/**
 * Harness artefact emitter.
 *
 * @remarks
 * Turns an esbuild ESM bundle of a stage entry (which exports `main`) into the exact
 * shape the harness Workflow tool executes:
 *
 * 1. `export const meta = <literal>` as the first statement (the harness reads it
 *    statically before running the body);
 * 2. the bundled body with esbuild's trailing `export { ... };` footer removed (the
 *    harness wraps the body in an AsyncFunction, where `export` is illegal);
 * 3. a trailing top-level `return await main();` that yields the stage result (legal
 *    only inside that AsyncFunction wrap — which is why `node --check` rejects the
 *    artefact and the output contract validates it the way the harness runs it).
 *
 * The stage's meta literal lives in a dedicated `<stage>.meta.ts` module that the entry
 * never imports, so the bundle contains no `meta` binding to collide with the prepended
 * export; {@link emitHarnessArtefact} enforces that invariant.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import type { WorkflowMeta } from '../workflow-meta.js';

/** Single-character whitespace probe (linear scanning; no regex backtracking). */
function isWhitespaceChar(character: string): boolean {
  return character === ' ' || character === '\t' || character === '\n' || character === '\r';
}

/**
 * Locate the start of esbuild's trailing ESM export footer — a final
 * `\nexport { … };` (no inner braces) followed only by whitespace — returning
 * the index of its leading newline, or -1 when absent. Implemented as linear
 * string scanning: the regex form (`/\nexport\s*\{[^}]*\};\s*$/`) had
 * super-linear backtracking on adversarial whitespace runs (typescript:S8786).
 */
function exportFooterStart(bundleSource: string): number {
  const trimmed = bundleSource.trimEnd();
  if (!trimmed.endsWith('};')) {
    return -1;
  }
  const braceOpen = trimmed.lastIndexOf('{');
  if (braceOpen === -1 || trimmed.indexOf('}', braceOpen) !== trimmed.length - 2) {
    return -1;
  }
  return exportKeywordStart(trimmed, braceOpen);
}

/**
 * Walk back from the footer's `{` over whitespace to confirm a newline-led
 * `export` keyword; returns the leading newline's index, or -1.
 */
function exportKeywordStart(trimmed: string, braceOpen: number): number {
  let cursor = braceOpen - 1;
  while (cursor >= 0 && isWhitespaceChar(trimmed.charAt(cursor))) {
    cursor -= 1;
  }
  const keywordStart = cursor - 'export'.length + 1;
  if (keywordStart < 1 || trimmed.slice(keywordStart, cursor + 1) !== 'export') {
    return -1;
  }
  return trimmed.charAt(keywordStart - 1) === '\n' ? keywordStart - 1 : -1;
}

/**
 * Any `meta` binding in the bundle body would collide with the prepended meta
 * export. Leading whitespace is horizontal-only (`[ \t]*`, matching statement
 * indentation): with the `m` flag, `^\s*` spans newlines and backtracks
 * super-linearly on adversarial whitespace runs (typescript:S8786).
 */
const META_BINDING = /^[ \t]*(?:var|let|const|function)[ \t]+meta\b/m;

/**
 * Remove esbuild's trailing export footer so the body is legal inside the harness's
 * AsyncFunction wrap. A bundle without one means the stage entry stopped exporting
 * `main` and the build is malformed.
 */
export function stripExportFooter(bundleSource: string): Result<string, Error> {
  const footerStart = exportFooterStart(bundleSource);
  if (footerStart === -1) {
    return err(
      new Error(
        'Bundle has no trailing export footer — the stage entry must `export async function main()`.',
      ),
    );
  }
  return ok(`${bundleSource.slice(0, footerStart)}\n`);
}

/**
 * Produce the harness artefact from one stage's bundle and its meta literal.
 *
 * The meta literal is serialised with `JSON.stringify` — exact for the pure-literal meta
 * modules, and guaranteed computed-value-free by construction.
 */
export function emitHarnessArtefact(input: {
  readonly bundleSource: string;
  readonly meta: WorkflowMeta;
}): Result<string, Error> {
  if (META_BINDING.test(input.bundleSource)) {
    return err(
      new Error(
        'Bundle declares its own `meta` binding — stage entries must not import or declare meta; it lives in <stage>.meta.ts only.',
      ),
    );
  }
  const body = stripExportFooter(input.bundleSource);
  if (!body.ok) {
    return body;
  }
  const metaLine = `export const meta = ${JSON.stringify(input.meta, null, 2)};\n`;
  return ok(`${metaLine}${body.value}\nreturn await main();\n`);
}
