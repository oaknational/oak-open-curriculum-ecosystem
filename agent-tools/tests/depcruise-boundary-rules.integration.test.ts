/**
 * Check-fires proof for the dependency-cruiser boundary rules that
 * enforce the workspace-config isolation and ESM rulings (owner rulings
 * 2026-08-09): `workspace-config-containment`,
 * `workspace-config-no-phantom-deps`, `no-commonjs-require`, and
 * `no-dynamic-import`.
 *
 * The rules AND the enforcement options under test load BY REFERENCE
 * from the real root `.dependency-cruiser.mjs` — never copied — so this
 * suite reddens the moment a rule is renamed, weakened, deleted, or
 * nullified by an options change (effective enforcement is
 * forbidden × options: an options.exclude entry alone once silenced
 * three of the four rules). The cruise runs in-process through the
 * library API — no child processes (testing-strategy §"No process
 * spawning in in-process tests"). Fixtures live in a temp tree laid out
 * under `packages/core/…` so the rules' workspace regexes match;
 * committed fixture files named like real configs would themselves be
 * scanned by the gates they prove (forbidden — see the
 * workspace-config-isolation unit suite header).
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  cruiseFixture,
  makeDepcruiseFixture,
  type DepcruiseFixture,
  type FixtureViolation,
} from './test-helpers/depcruise-fixture.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const RULE_NAMES = [
  'workspace-config-containment',
  'workspace-config-no-phantom-deps',
  'no-commonjs-require',
  'no-dynamic-import',
] as const;

let fixture: DepcruiseFixture;
let violations: readonly FixtureViolation[];

function violationsMatching(input: {
  readonly ruleName: string;
  readonly from: string;
  readonly to?: string;
}): readonly FixtureViolation[] {
  return violations.filter(
    (violation) =>
      violation.ruleName === input.ruleName &&
      violation.ruleSeverity === 'error' &&
      violation.from === input.from &&
      (input.to === undefined || violation.to === input.to),
  );
}

beforeAll(async () => {
  fixture = makeDepcruiseFixture('oak-depcruise-rules-');
  const write = fixture.writeFile;

  // Violating fixtures — one per rule.
  write(
    'packages/core/fixture-a/tsup.config.ts',
    [
      "import { thing } from '../fixture-b/src/thing.js';",
      "import 'not-a-real-package-oak-fixture';",
      'export const config = thing;',
      '',
    ].join('\n'),
  );
  write(
    'packages/core/fixture-a/src/dynamic-site.ts',
    ["export const loaded = import('./target.js');", ''].join('\n'),
  );
  write('packages/core/fixture-a/src/target.js', 'export const target = 1;\n');
  write(
    'packages/core/fixture-a/src/legacy.cjs',
    ["const target = require('./target2.cjs');", 'module.exports = target;', ''].join('\n'),
  );
  write('packages/core/fixture-a/src/target2.cjs', 'module.exports = 2;\n');

  // A resolvable-but-undeclared npm package: the copied-config class the
  // phantom rule exists for. Lives in the fixture's node_modules so the
  // edge must SURVIVE the real options (the exclusion-nullification class).
  write(
    'node_modules/phantom-pkg/package.json',
    JSON.stringify({ name: 'phantom-pkg', main: 'index.js' }),
  );
  write('node_modules/phantom-pkg/index.js', 'export const phantom = 1;\n');
  write(
    'packages/core/fixture-a/vitest.config.ts',
    ["import 'phantom-pkg';", "import '../fixture-b/dist/built.js';", ''].join('\n'),
  );
  write('packages/core/fixture-b/dist/built.js', 'export const built = 1;\n');

  // Compliant fixture — a config whose imports stay inside its workspace.
  write('packages/core/fixture-b/src/thing.js', 'export const thing = 1;\n');
  write(
    'packages/core/fixture-b/tsup.config.ts',
    ["import { thing } from './src/thing.js';", 'export const config = thing;', ''].join('\n'),
  );

  violations = await cruiseFixture({
    repoRoot,
    fixtureDir: fixture.dir,
    ruleNames: RULE_NAMES,
    scanDir: 'packages',
  });
});

afterAll(() => {
  fixture.remove();
});

describe('dependency-cruiser boundary rules (red-proofs against the real config)', () => {
  it('workspace-config-containment fires on a config import that leaves its workspace', () => {
    expect(
      violationsMatching({
        ruleName: 'workspace-config-containment',
        from: 'packages/core/fixture-a/tsup.config.ts',
        to: 'packages/core/fixture-b/src/thing.js',
      }),
    ).toHaveLength(1);
  });

  it('workspace-config-no-phantom-deps fires on an undeclared package specifier', () => {
    expect(
      violationsMatching({
        ruleName: 'workspace-config-no-phantom-deps',
        from: 'packages/core/fixture-a/tsup.config.ts',
        to: 'not-a-real-package-oak-fixture',
      }),
    ).toHaveLength(1);
  });

  it('no-commonjs-require fires on a require() dependency', () => {
    expect(
      violationsMatching({
        ruleName: 'no-commonjs-require',
        from: 'packages/core/fixture-a/src/legacy.cjs',
      }),
    ).toHaveLength(1);
  });

  it('no-dynamic-import fires on a literal dynamic import', () => {
    expect(
      violationsMatching({
        ruleName: 'no-dynamic-import',
        from: 'packages/core/fixture-a/src/dynamic-site.ts',
      }),
    ).toHaveLength(1);
  });

  it('workspace-config-no-phantom-deps survives the real options for a node_modules-resolved undeclared package (the exclusion-nullification class)', () => {
    expect(
      violationsMatching({
        ruleName: 'workspace-config-no-phantom-deps',
        from: 'packages/core/fixture-a/vitest.config.ts',
        to: 'node_modules/phantom-pkg/index.js',
      }),
    ).toHaveLength(1);
  });

  it('workspace-config-containment survives the real options for a relative reach into another workspace’s dist', () => {
    expect(
      violationsMatching({
        ruleName: 'workspace-config-containment',
        from: 'packages/core/fixture-a/vitest.config.ts',
        to: 'packages/core/fixture-b/dist/built.js',
      }),
    ).toHaveLength(1);
  });

  it('stays silent on a config whose imports remain inside its workspace', () => {
    const compliant = violations.filter(
      (violation) => violation.from === 'packages/core/fixture-b/tsup.config.ts',
    );
    expect(compliant).toEqual([]);
  });
});
