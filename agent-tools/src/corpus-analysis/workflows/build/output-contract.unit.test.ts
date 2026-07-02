import { err, isErr, isOk, ok } from '@oaknational/result';
import type { Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { SyntaxValidator } from './output-contract.js';
import {
  buildHarnessWrapSource,
  checkBeginsWithMetaExport,
  checkCompilesUnderHarness,
  checkEndsWithHarnessReturn,
  checkHarnessArtefactContract,
  checkNoForbiddenTimeSources,
  checkNoModuleSystem,
  checkSandboxPurity,
  checkSeededArtefactShape,
  checkWithinHarnessSizeCap,
} from './output-contract.js';

/**
 * The output contract is the machine enforcement of the harness sandbox rules on every
 * emitted artefact: shape (meta-first, return-last), determinism (no wall-clock or
 * randomness), self-containment (no module system), purity (no schema-library runtime),
 * size, and harness-shaped syntax. A violation fails the build — never a launch
 * checklist.
 */

const validArtefact = [
  'export const meta = { "name": "t", "description": "d", "phases": [] };',
  'async function main() {',
  '  log("ok");',
  '  return { result: true };',
  '}',
  'return await main();',
  '',
].join('\n');

function errorMessage(result: Result<undefined, Error>): string {
  if (result.ok) {
    expect.fail('expected a contract violation, got ok');
  }
  return result.error.message;
}

describe('checkBeginsWithMetaExport', () => {
  it('accepts an artefact whose first statement is the meta export', () => {
    expect(isOk(checkBeginsWithMetaExport(validArtefact))).toBe(true);
  });

  it('rejects an artefact that does not begin with the meta export', () => {
    expect(errorMessage(checkBeginsWithMetaExport(`var x = 1;\n${validArtefact}`))).toMatch(/meta/);
  });
});

describe('checkEndsWithHarnessReturn', () => {
  it('accepts an artefact ending with the top-level return', () => {
    expect(isOk(checkEndsWithHarnessReturn(validArtefact))).toBe(true);
  });

  it('rejects an artefact missing the trailing return', () => {
    expect(
      errorMessage(checkEndsWithHarnessReturn(validArtefact.replace('return await main();', ''))),
    ).toMatch(/return await main/);
  });
});

describe('checkNoForbiddenTimeSources', () => {
  it('accepts deterministic code, including Math.imul (the FNV jitter hash)', () => {
    expect(isOk(checkNoForbiddenTimeSources('const h = Math.imul(2166136261, 16777619);'))).toBe(
      true,
    );
  });

  it.each(['Date.now()', 'new Date()', 'Math.random()'])('rejects %s', (source) => {
    expect(errorMessage(checkNoForbiddenTimeSources(`const t = ${source};`))).toMatch(/forbidden/i);
  });
});

describe('checkNoModuleSystem', () => {
  it('accepts self-contained code', () => {
    expect(isOk(checkNoModuleSystem('async function main() { return 1; }'))).toBe(true);
  });

  it('accepts prose containing the word importance (word-boundary precision)', () => {
    expect(isOk(checkNoModuleSystem('const s = "rate the importance";'))).toBe(true);
  });

  it.each([
    'import { x } from "y";',
    'const m = require("fs");',
    'const p = process.env.HOME;',
    'import("dynamic");',
    'import fs from "node:fs";',
  ])('rejects module-system / Node usage: %s', (source) => {
    expect(errorMessage(checkNoModuleSystem(source))).toMatch(/self-contained/);
  });
});

describe('checkSandboxPurity', () => {
  it('accepts an artefact free of runtime schema/result libraries', () => {
    expect(isOk(checkSandboxPurity(validArtefact))).toBe(true);
  });

  it.each(['z.strictObject({})', 'safeParse(value)', 'ZodError', '@oaknational/result'])(
    'rejects a bundle that smuggled %s',
    (token) => {
      expect(errorMessage(checkSandboxPurity(`const leak = "${token}";`))).toMatch(/purity/i);
    },
  );
});

describe('checkWithinHarnessSizeCap', () => {
  it('accepts an artefact under the harness script cap', () => {
    expect(isOk(checkWithinHarnessSizeCap(validArtefact))).toBe(true);
  });

  it('rejects an artefact over the cap, naming both sizes', () => {
    expect(errorMessage(checkWithinHarnessSizeCap('x'.repeat(524_289)))).toMatch(/524288/);
  });
});

describe('buildHarnessWrapSource (the exact source the harness compiles)', () => {
  it('strips the meta export and wraps the body as an async function over the sandbox globals', () => {
    const wrapped = buildHarnessWrapSource(validArtefact);
    expect(
      wrapped.startsWith('async function harnessBody(agent, parallel, phase, log, args) {'),
    ).toBe(true);
    expect(wrapped).not.toContain('export const meta');
    expect(wrapped).toContain('return await main();');
    expect(wrapped.trimEnd().endsWith('}')).toBe(true);
  });
});

describe('checkCompilesUnderHarness (validator injected — the real parser runs at build time)', () => {
  it('passes the wrap source to the validator and accepts when it accepts', () => {
    const seen: string[] = [];
    const recording: SyntaxValidator = (wrapSource) => {
      seen.push(wrapSource);
      return ok(undefined);
    };
    expect(isOk(checkCompilesUnderHarness(validArtefact, recording))).toBe(true);
    expect(seen).toEqual([buildHarnessWrapSource(validArtefact)]);
  });

  it('translates a validator rejection into a typed contract failure', () => {
    const rejecting: SyntaxValidator = () => err(new Error('Unexpected token'));
    expect(errorMessage(checkCompilesUnderHarness(validArtefact, rejecting))).toMatch(/compile/i);
  });
});

describe('checkHarnessArtefactContract', () => {
  const acceptAll: SyntaxValidator = () => ok(undefined);

  it('passes the valid artefact through every check', () => {
    expect(isOk(checkHarnessArtefactContract(validArtefact, acceptAll))).toBe(true);
  });

  it('aggregates every violation into one error', () => {
    const doublyBroken = `var x = Date.now();\n${validArtefact.replace('return await main();', '')}`;
    const result = checkHarnessArtefactContract(doublyBroken, acceptAll);
    expect(isErr(result)).toBe(true);
    const message = errorMessage(result);
    expect(message).toMatch(/meta/);
    expect(message).toMatch(/forbidden/i);
    expect(message).toMatch(/return await main/);
  });
});

describe('checkSeededArtefactShape (data may contain anything; code rules stay on the unseeded tier)', () => {
  const acceptAll: SyntaxValidator = () => ok(undefined);
  const seeded = validArtefact.replace(
    'async function main() {',
    'var RUN_DATA = {"leaves":[{"quote":"we read process.env and z.strictObject via node:fs"}]};\nasync function main() {',
  );

  it('accepts a seeded artefact whose run data carries verbatim code-like corpus quotes', () => {
    // The full contract MUST reject this content in code position…
    expect(isErr(checkHarnessArtefactContract(seeded, acceptAll))).toBe(true);
    // …while the seeded shape tier accepts it: quotes are data, and the executable
    // surface was already checked on the unseeded emission.
    expect(isOk(checkSeededArtefactShape(seeded, acceptAll))).toBe(true);
  });

  it('still rejects a seeded artefact with a broken shape', () => {
    expect(
      errorMessage(checkSeededArtefactShape(seeded.replace('return await main();', ''), acceptAll)),
    ).toMatch(/return await main/);
  });
});
