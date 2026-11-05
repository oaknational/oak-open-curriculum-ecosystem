import { describe, expect, it } from 'vitest';

import type { FamilyManifest } from './family-conformance-manifest.js';
import {
  checkCiFanIn,
  checkCompilerFlags,
  checkFormatter,
  checkHooks,
  checkPackageManager,
  readRootPackage,
  type HookBodies,
} from './family-conformance-tree-helpers.js';

/**
 * Fixtures mirror the real shapes: hook bodies as bytes on both sides, a CI
 * workflow with a fan-in job whose `needs` lists the other jobs, a
 * `tsconfig.base.json` document, the root file names present, and a
 * `packageManager` field.
 */
const encoder = new TextEncoder();

function bodies(live: Record<string, string>, family: Record<string, string>): HookBodies {
  const toMap = (record: Record<string, string>): ReadonlyMap<string, Uint8Array> =>
    new Map(Object.entries(record).map(([name, text]) => [name, encoder.encode(text)]));
  return { live: toMap(live), family: toMap(family) };
}

const CI: FamilyManifest['ci'] = {
  workflow: '.github/workflows/ci.yml',
  fan_in_job: 'run-quality-gates',
};

const COVERING_WORKFLOW = `
name: CI
jobs:
  secret-scan:
    runs-on: ubuntu-latest
  install:
    runs-on: ubuntu-latest
  build:
    needs: install
  run-quality-gates:
    needs:
      - secret-scan
      - install
      - build
    if: always()
`;

const FLAGS: FamilyManifest['compiler_base_flags'] = {
  strict: true,
  allowUnreachableCode: false,
  erasableSyntaxOnly: true,
};

const FORMATTER: FamilyManifest['formatter'] = {
  config_file: 'prettier.config.ts',
  forbidden: ['.prettierrc', '.prettierrc.json'],
};

const PACKAGE_MANAGER: FamilyManifest['package_manager'] = { name: 'pnpm', major: 12 };

describe('checkHooks', () => {
  it('reports no drift when every hook is byte-identical on both sides', () => {
    const hooks = bodies({ 'pre-commit': 'a\n' }, { 'pre-commit': 'a\n' });

    expect(checkHooks(['pre-commit'], hooks)).toEqual([]);
  });

  it('reports a missing family copy', () => {
    const drifts = checkHooks(['pre-push'], bodies({ 'pre-push': 'a' }, {}));

    expect(drifts).toHaveLength(1);
    expect(drifts[0]?.message).toContain('family copy');
  });

  it('reports a missing live hook', () => {
    const drifts = checkHooks(['pre-push'], bodies({}, { 'pre-push': 'a' }));

    expect(drifts[0]?.message).toContain('.husky/pre-push is missing');
  });

  it('reports a body that differs by one byte', () => {
    const drifts = checkHooks(['pre-push'], bodies({ 'pre-push': 'a\n' }, { 'pre-push': 'b\n' }));

    expect(drifts[0]?.area).toBe('hook');
    expect(drifts[0]?.message).toContain('differs');
  });
});

describe('checkCiFanIn', () => {
  it('reports no drift when the fan-in needs every other job', () => {
    expect(checkCiFanIn(CI, COVERING_WORKFLOW)).toEqual([]);
  });

  it('reports a missing workflow', () => {
    expect(checkCiFanIn(CI, undefined)[0]?.message).toContain('is missing');
  });

  it('reports a missing fan-in job', () => {
    const without = COVERING_WORKFLOW.replace('run-quality-gates:', 'other-job:');

    expect(checkCiFanIn(CI, without)[0]?.message).toContain('no job `run-quality-gates`');
  });

  it('names every job the fan-in does not need', () => {
    const extra = `${COVERING_WORKFLOW}  windows-basic:\n    runs-on: windows-latest\n`;

    const drifts = checkCiFanIn(CI, extra);

    expect(drifts).toHaveLength(1);
    expect(drifts[0]?.message).toContain('does not need `windows-basic`');
  });

  it('reports a fan-in that does not run under always(), which would skip on a failed prerequisite', () => {
    const conditional = COVERING_WORKFLOW.replace('    if: always()\n', '');
    const [onlyDrift, ...rest] = checkCiFanIn(CI, conditional);

    expect(rest).toEqual([]);
    expect(onlyDrift?.message).toBe(
      '.github/workflows/ci.yml job `run-quality-gates` must run under `if: always()` so a failed prerequisite still reports; found no condition',
    );
  });

  it('reads a scalar needs as one job', () => {
    const scalar = `
jobs:
  install: {}
  run-quality-gates:
    needs: install
    if: always()
`;

    expect(checkCiFanIn(CI, scalar)).toEqual([]);
  });
});

describe('checkCompilerFlags', () => {
  it('reports no drift when every flag holds its value', () => {
    const tsconfig = {
      compilerOptions: { strict: true, allowUnreachableCode: false, erasableSyntaxOnly: true },
    };

    expect(checkCompilerFlags(FLAGS, tsconfig)).toEqual([]);
  });

  it('reports a flag with another value and a flag that is absent', () => {
    const tsconfig = { compilerOptions: { strict: false, erasableSyntaxOnly: true } };

    const drifts = checkCompilerFlags(FLAGS, tsconfig);

    expect(drifts.map((entry) => entry.message)).toEqual([
      'tsconfig.base.json compilerOptions.strict is false; the family requires true',
      'tsconfig.base.json compilerOptions.allowUnreachableCode is undefined; the family requires false',
    ]);
  });

  it('reports a document without compilerOptions', () => {
    expect(checkCompilerFlags(FLAGS, { extends: 'x' })[0]?.message).toContain('no compilerOptions');
  });
});

describe('checkFormatter', () => {
  it('reports no drift when the config is present and no forbidden file is', () => {
    expect(checkFormatter(FORMATTER, new Set(['prettier.config.ts']))).toEqual([]);
  });

  it('reports a missing config file and a present forbidden file', () => {
    const drifts = checkFormatter(FORMATTER, new Set(['.prettierrc.json']));

    expect(drifts.map((entry) => entry.message)).toEqual([
      'prettier.config.ts is missing at the root',
      ".prettierrc.json is present at the root; the family's one formatter configuration is prettier.config.ts",
    ]);
  });
});

describe('readRootPackage', () => {
  it('reads the string script bodies and the packageManager field as written', () => {
    expect(
      readRootPackage({
        scripts: { check: 'pnpm check:all', build: 'turbo run build', broken: 7 },
        packageManager: 'pnpm@12.4.2+sha512.abc',
      }),
    ).toEqual({
      ok: true,
      value: {
        scripts: { check: 'pnpm check:all', build: 'turbo run build' },
        packageManager: 'pnpm@12.4.2+sha512.abc',
      },
    });
  });

  it('reports a document without a scripts map', () => {
    const reading = readRootPackage({ name: 'estate' });
    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toBe('package.json has no scripts map');
    }
  });
});

describe('checkPackageManager', () => {
  it('reports no drift at the family major', () => {
    expect(checkPackageManager(PACKAGE_MANAGER, 'pnpm@12.4.2+sha512.abc')).toEqual([]);
  });

  it('reports a missing field', () => {
    expect(checkPackageManager(PACKAGE_MANAGER, undefined)[0]?.message).toContain(
      'no packageManager',
    );
  });

  it('reports an unparsable field', () => {
    expect(checkPackageManager(PACKAGE_MANAGER, 'pnpm')[0]?.message).toContain('is not <name>@');
  });

  it('reports another manager and another major', () => {
    expect(checkPackageManager(PACKAGE_MANAGER, 'npm@12.0.0')[0]?.message).toContain(
      'requires pnpm@12.x',
    );
    expect(checkPackageManager(PACKAGE_MANAGER, 'pnpm@11.9.0')[0]?.message).toContain(
      'requires pnpm@12.x',
    );
  });
});
