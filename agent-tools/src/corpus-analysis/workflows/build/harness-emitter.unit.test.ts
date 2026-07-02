import { isErr, isOk } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { WorkflowMeta } from '../workflow-meta.js';
import { emitHarnessArtefact, stripExportFooter } from './harness-emitter.js';

/**
 * The harness emitter turns an esbuild ESM bundle (which exports `main`) into the exact
 * shape the harness Workflow tool executes: `export const meta = <literal>` first, the
 * bundled body (footer stripped, so it is legal inside the harness's AsyncFunction wrap),
 * and a trailing top-level `return await main();`.
 */

const meta: WorkflowMeta = {
  name: 'test-stage',
  description: 'a test stage',
  phases: [{ title: 'run', detail: 'one step' }],
};

function emitted(bundleSource: string): string {
  const result = emitHarnessArtefact({ bundleSource, meta });
  if (!result.ok) {
    expect.fail(`expected an emitted artefact, got: ${result.error.message}`);
  }
  return result.value;
}

describe('stripExportFooter', () => {
  it('removes a single-binding export footer', () => {
    const result = stripExportFooter('function main() {}\nexport {\n  main\n};\n');
    expect(isOk(result) && result.value).toBe('function main() {}\n');
  });

  it('removes a multi-binding export footer', () => {
    const result = stripExportFooter(
      'function a() {}\nasync function main() {}\nexport {\n  a,\n  main\n};\n',
    );
    expect(isOk(result) && result.value).toBe('function a() {}\nasync function main() {}\n');
  });

  it('removes only the trailing footer, never an export mid-bundle string literal', () => {
    const result = stripExportFooter(
      'const s = "export { x };";\nasync function main() {}\nexport {\n  main\n};\n',
    );
    expect(isOk(result) && result.value).toBe(
      'const s = "export { x };";\nasync function main() {}\n',
    );
  });

  it('errs when the bundle has no export footer (a malformed entry)', () => {
    const result = stripExportFooter('function main() {}\n');
    expect(isErr(result) && result.error.message).toMatch(/export footer/);
  });
});

describe('emitHarnessArtefact', () => {
  const bundleSource =
    'async function main() {\n  log("hi");\n  return { ok: true };\n}\nexport {\n  main\n};\n';

  it('begins with the serialised meta export', () => {
    const artefact = emitted(bundleSource);
    expect(artefact.startsWith('export const meta = {')).toBe(true);
    expect(artefact).toContain('"name": "test-stage"');
  });

  it('ends with the top-level return that yields the workflow result', () => {
    expect(emitted(bundleSource).trimEnd().endsWith('return await main();')).toBe(true);
  });

  it('carries the stripped bundle body between meta and the return', () => {
    const artefact = emitted(bundleSource);
    expect(artefact).toContain('log("hi")');
    expect(artefact).not.toMatch(/export\s*\{\s*main\s*\};/);
  });

  it('errs on a bundle that declares its own meta binding (would collide with the prepended export)', () => {
    const colliding =
      'var meta = { name: "x" };\nasync function main() {}\nexport {\n  main,\n  meta\n};\n';
    const result = emitHarnessArtefact({ bundleSource: colliding, meta });
    expect(isErr(result) && result.error.message).toMatch(/meta/);
  });
});
