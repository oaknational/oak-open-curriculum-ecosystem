import { describe, expect, it } from 'vitest';
import { Linter } from '@typescript-eslint/utils/ts-eslint';
import type { TSESLint } from '@typescript-eslint/utils';
import { strict } from './strict.js';

/**
 * Behavioural tests for the strict config exported by
 * `@oaknational/eslint-plugin-standards`.
 *
 * @remarks
 * These tests describe a system state: applying the strict config to a
 * fixture string MUST surface specific lint errors when the fixture contains
 * named pathogen patterns. They exist to guarantee the structural enforcement
 * surface PDR-044 (Memetic Immune System) names as innate immunity, paired
 * with PDR-038 §2026-05-04 amendment which classifies un-enforced doctrine
 * at maturity as a net liability.
 *
 * Per `principles.md` §Code Quality (no skipped tests) and §Testing —
 * skipping mechanisms (`it.skip`, `describe.skip`, `it.only`,
 * `describe.only`, `it.todo`, `xit`, `xdescribe`) are forbidden outright.
 * The vitest plugin rules `vitest/no-disabled-tests` and
 * `vitest/no-focused-tests` enforce this at the lint surface.
 *
 * Worked example: a regression on this surface would silently allow a
 * future commit to reintroduce `it.skip(...)` six months after the binary
 * deletion of the existing skipped tests. See plan
 * `.agent/plans/agentic-engineering-enhancements/current/doctrine-enforcement-quick-wins.plan.md`
 * §Issue 1.
 */

const linter = new Linter({ configType: 'flat' });

/**
 * Type-information-requiring rules that the strict config inherits from
 * `tseslint.configs.strict` and the recommended config. Linting an
 * in-memory fixture cannot supply parser services without spawning a
 * TypeScript project, which the testing-strategy directive forbids in
 * unit tests (`testing-strategy.md` § No process spawning in in-process
 * tests). The override below disables only those typed rules so the
 * parser-free run still produces faithful coverage of the syntactic
 * rules under test.
 */
const TYPED_RULES_OFF = {
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-deprecated': 'off',
  '@typescript-eslint/consistent-return': 'off',
  '@typescript-eslint/consistent-type-exports': 'off',
  'sonarjs/no-alphabetical-sort': 'off',
  'sonarjs/void-use': 'off',
} as const;

const TYPED_RULES_OVERRIDE: TSESLint.FlatConfig.Config = {
  rules: TYPED_RULES_OFF,
};

interface LintResult {
  readonly ruleIds: readonly string[];
  readonly messages: readonly TSESLint.Linter.LintMessage[];
}

function lint(code: string, filename: string): LintResult {
  const config: TSESLint.FlatConfig.ConfigArray = [...strict, TYPED_RULES_OVERRIDE];
  const messages = linter.verify(code, config, {
    filename,
  });

  const ruleIds = messages
    .map((message) => message.ruleId)
    .filter((value): value is string => value !== null && value !== undefined);

  return { ruleIds, messages };
}

describe('@oaknational/eslint-plugin-standards strict config: vitest test-disabling pathogens', () => {
  it('reports vitest/no-disabled-tests for it.skip(...)', () => {
    const code = [
      "import { describe, it } from 'vitest';",
      "describe('suite', () => {",
      "  it.skip('skipped case', () => {});",
      '});',
      'export {};',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).toContain('vitest/no-disabled-tests');
  });

  it('reports vitest/no-disabled-tests for describe.skip(...)', () => {
    const code = [
      "import { describe, it } from 'vitest';",
      "describe.skip('skipped suite', () => {",
      "  it('case', () => {});",
      '});',
      'export {};',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).toContain('vitest/no-disabled-tests');
  });

  it('reports vitest/no-focused-tests for it.only(...)', () => {
    const code = [
      "import { describe, it } from 'vitest';",
      "describe('suite', () => {",
      "  it.only('focused case', () => {});",
      '});',
      'export {};',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).toContain('vitest/no-focused-tests');
  });

  it('reports vitest/no-focused-tests for describe.only(...)', () => {
    const code = [
      "import { describe, it } from 'vitest';",
      "describe.only('focused suite', () => {",
      "  it('case', () => {});",
      '});',
      'export {};',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).toContain('vitest/no-focused-tests');
  });

  it('does not report vitest test-disabling rules for an ordinary it(...) call', () => {
    const code = [
      "import { describe, it } from 'vitest';",
      "describe('suite', () => {",
      "  it('case', () => {});",
      '});',
      'export {};',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).not.toContain('vitest/no-disabled-tests');
    expect(ruleIds).not.toContain('vitest/no-focused-tests');
  });
});

/**
 * @typescript-eslint/ban-ts-comment with `'ts-expect-error':
 * 'allow-with-description'` is the standard structural surface for the
 * principle that escape hatches must carry a substantive justification,
 * never a bare suppression. The strict config also documents a
 * `minimumDescriptionLength` so trivial annotations ("TODO", "fix") do
 * not satisfy the gate. Per `principles.md` § Compiler Time Types and
 * Runtime Validation (no type-information destruction; substantive
 * rationale required for any preserved widening), and per the WS2
 * acceptance criteria of the doctrine-enforcement-quick-wins plan
 * (§Issue 2), bare `@ts-expect-error` MUST error and a descriptively
 * annotated `@ts-expect-error` with a substantive note MUST pass.
 *
 * The companion custom rule `@oaknational/no-eslint-disable` continues
 * to ban bare `@ts-expect-error`, `@ts-ignore`, and `@ts-nocheck`. It
 * is loosened in this same workstream to permit
 * `@ts-expect-error -- <substantive description>` since the
 * `ban-ts-comment` rule then enforces the substantive-rationale
 * contract structurally with `minimumDescriptionLength`. Two-rule
 * defence is intentional: the custom rule covers the universal "no
 * bare suppression" gate, the typescript-eslint rule encodes the
 * description-length contract that the broader ecosystem expects.
 */
describe('@oaknational/eslint-plugin-standards strict config: TS-suppression directives', () => {
  it('reports an error for bare @ts-expect-error', () => {
    const code = [
      '// @ts-expect-error',
      'const value: number = "string";',
      'export { value };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).toContain('@typescript-eslint/ban-ts-comment');
  });

  it('reports an error for @ts-expect-error with a too-short description', () => {
    const code = [
      '// @ts-expect-error: fix',
      'const value: number = "string";',
      'export { value };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).toContain('@typescript-eslint/ban-ts-comment');
  });

  it('does not report ban-ts-comment for @ts-expect-error with a substantive description', () => {
    const code = [
      '// @ts-expect-error: temporary widening for upstream library mismatch',
      'const value: number = "string";',
      'export { value };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).not.toContain('@typescript-eslint/ban-ts-comment');
  });

  it('does not flag @ts-expect-error with a substantive description under any rule', () => {
    const code = [
      '// @ts-expect-error: temporary widening for upstream library mismatch',
      'const value: number = "string";',
      'export { value };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).not.toContain('@typescript-eslint/ban-ts-comment');
    expect(ruleIds).not.toContain('@oaknational/no-eslint-disable');
  });

  it('continues to ban @ts-ignore unconditionally via the custom no-eslint-disable rule', () => {
    const code = [
      '// @ts-ignore -- whatever',
      'const value: number = "string";',
      'export { value };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).toContain('@oaknational/no-eslint-disable');
  });

  it('continues to ban @ts-nocheck unconditionally via the custom no-eslint-disable rule', () => {
    const code = ['// @ts-nocheck', 'const value: number = "string";', 'export { value };'].join(
      '\n',
    );

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).toContain('@oaknational/no-eslint-disable');
  });
});

/**
 * Behavioural tests guaranteeing `@oaknational/no-real-io-in-tests` fires
 * across the strict config surface for `*.test.ts` files outside the
 * structural allowlist. The companion rule's own `RuleTester` cases exercise
 * the rule logic in isolation; these tests describe the system state that
 * matters at the config-activation boundary: the rule is wired in the shared
 * `recommended` config (which `strict` composes), and therefore every
 * workspace inheriting these standards gains the same structural guard
 * against new real IO entering tests. Severity is intentionally not asserted
 * here: severity moves through `warn` (development phase) and `error` (post-
 * stabilisation) by separate, deliberate decisions; these tests check that
 * the rule fires at all, which is the load-bearing config-activation invariant.
 *
 * Anchors: ADR-078 (dependency injection for testability); the rule code at
 * `../rules/no-real-io-in-tests.ts`; `.agent/rules/test-immediate-fails.md`
 * referenced by the rule's `messageId` strings.
 */
describe('@oaknational/eslint-plugin-standards strict config: no-real-io-in-tests activation', () => {
  it('reports @oaknational/no-real-io-in-tests for static fs imports in *.test.ts', () => {
    const code = [
      "import { readFileSync } from 'node:fs';",
      "const contents = readFileSync('whatever', 'utf8');",
      'export { contents };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).toContain('@oaknational/no-real-io-in-tests');
  });

  it('reports @oaknational/no-real-io-in-tests for process.env access in *.test.ts', () => {
    const code = ['const apiKey = process.env.API_KEY;', 'export { apiKey };'].join('\n');

    const { ruleIds } = lint(code, 'fixture.test.ts');

    expect(ruleIds).toContain('@oaknational/no-real-io-in-tests');
  });

  it('does not report @oaknational/no-real-io-in-tests on non-test files', () => {
    const code = [
      "import { readFileSync } from 'node:fs';",
      "const contents = readFileSync('whatever', 'utf8');",
      'export { contents };',
    ].join('\n');

    const { ruleIds } = lint(code, 'fixture.ts');

    expect(ruleIds).not.toContain('@oaknational/no-real-io-in-tests');
  });

  it('does not report @oaknational/no-real-io-in-tests on structurally allowlisted test-helpers paths', () => {
    const code = [
      "import { readFileSync } from 'node:fs';",
      "const contents = readFileSync('whatever', 'utf8');",
      'export { contents };',
    ].join('\n');

    const { ruleIds } = lint(code, 'apps/x/src/test-helpers/loader.test.ts');

    expect(ruleIds).not.toContain('@oaknational/no-real-io-in-tests');
  });
});
