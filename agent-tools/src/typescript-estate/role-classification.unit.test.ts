import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';
import { describe, expect, it } from 'vitest';

import type { RoleRule } from './config-classification-model.js';
import { createRoleClassifier } from './role-classification.js';

const testRole: RoleRule = {
  role: 'test-spec-support-fixture',
  match: 'all',
  pathRegexes: ['(?:^|/)tests?/'],
};

const roleRules: readonly RoleRule[] = [
  testRole,
  { role: 'generator', match: 'all', pathRegexes: [String.raw`(?:^|/)generate[^/]*\.ts$`] },
  {
    role: 'generated-contract-data-carrier',
    match: 'all',
    provenanceValues: ['generated-confirmed', 'generated-declared-unconfirmed'],
  },
  { role: 'build-time-producer', match: 'all', pathRegexes: ['(?:^|/)build/'] },
  { role: 'cli-hook-operator', match: 'all', pathRegexes: ['(?:^|/)scripts?/'] },
  { role: 'tsx-syntax-source', match: 'all', pathRegexes: [String.raw`\.tsx$`] },
  {
    role: 'api-facade',
    match: 'all',
    pathRegexes: [String.raw`(?:^|/)index\.tsx?$`, String.raw`(?:^|/)public\.tsx?$`],
    sourcePredicates: ['contains-export-declaration'],
  },
  { role: 'config-setup', match: 'all', pathRegexes: [String.raw`\.config\.tsx?$`] },
  { role: 'declaration', match: 'all', pathRegexes: [String.raw`\.d\.ts$`] },
  { role: 'research-evidence-template', match: 'all', pathRegexes: ['^research/'] },
  {
    role: 'implementation-source',
    match: 'all',
    fallback: 'readable-with-no-other-role',
  },
  {
    role: 'unknown',
    match: 'all',
    fallback: 'unreadable-invalid-utf8-or-unsupported-mode',
  },
];

const invalidRoleCases: readonly {
  readonly label: string;
  readonly rules: readonly RoleRule[];
}[] = [
  {
    label: 'an invalid regular expression',
    rules: roleRules.map((rule): RoleRule =>
      rule.role === 'generator' ? { ...rule, pathRegexes: ['['] } : rule,
    ),
  },
  {
    label: 'a duplicate role rule',
    rules: [...roleRules, testRole],
  },
  {
    label: 'a missing role rule',
    rules: roleRules.filter(({ role }) => role !== 'unknown'),
  },
];

function source(text: string) {
  return createSourceFile('fixture.ts', text, ScriptTarget.Latest, true, ScriptKind.TS);
}

describe('role classification', () => {
  it('uses OR within selector families, AND across them, and evaluates every rule', () => {
    const classifier = unwrapOrThrow(createRoleClassifier(roleRules));

    expect(
      classifier.classify({
        path: 'tests/public.tsx',
        provenance: 'generated-confirmed',
        sourceFile: source('export const value = 1;'),
      }),
    ).toEqual([
      'api-facade',
      'generated-contract-data-carrier',
      'test-spec-support-fixture',
      'tsx-syntax-source',
    ]);
  });

  it('recognises only top-level export syntax, including parsed-with-diagnostics source', () => {
    const classifier = unwrapOrThrow(createRoleClassifier(roleRules));

    expect(
      classifier.classify({
        path: 'src/index.ts',
        provenance: 'authored',
        sourceFile: source('export const broken = ;'),
      }),
    ).toEqual(['api-facade']);
    expect(
      classifier.classify({
        path: 'src/index.ts',
        provenance: 'authored',
        sourceFile: source('// export const fake = 1;\nconst text = "export default";'),
      }),
    ).toEqual(['implementation-source']);
  });

  it('uses exactly one readable or unreadable fallback when no selector matches', () => {
    const classifier = unwrapOrThrow(createRoleClassifier(roleRules));

    expect(
      classifier.classify({
        path: 'src/value.ts',
        provenance: 'authored',
        sourceFile: source('const value = 1;'),
      }),
    ).toEqual(['implementation-source']);
    expect(
      classifier.classify({
        path: 'src/index.ts',
        provenance: 'unknown',
        sourceFile: null,
      }),
    ).toEqual(['unknown']);
  });

  it('matches exact case-sensitive paths', () => {
    const classifier = unwrapOrThrow(createRoleClassifier(roleRules));

    expect(
      classifier.classify({
        path: 'Research/note.ts',
        provenance: 'authored',
        sourceFile: source('const note = 1;'),
      }),
    ).toEqual(['implementation-source']);
  });

  it.each(invalidRoleCases)('rejects $label before classification', ({ rules }) => {
    const result = createRoleClassifier(rules);

    expect(unwrapErr(result).code).toBe('CONFIG_INVALID');
  });
});
