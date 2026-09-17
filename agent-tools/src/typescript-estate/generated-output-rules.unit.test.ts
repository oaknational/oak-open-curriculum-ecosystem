import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  findGeneratedOutputRule,
  preflightGeneratedOutputRules,
} from './generated-output-rules.js';
import type { GeneratedOutputRule } from './config-classification-model.js';
import type { TrackedTreeEntry } from './git-snapshot.js';

const regularTreeEntries: readonly TrackedTreeEntry[] = [
  {
    path: 'generators/a.ts',
    treeEntry: { mode: '100644', type: 'blob', object: 'a', size: 10 },
  },
  {
    path: 'generators/z.ts',
    treeEntry: { mode: '100755', type: 'blob', object: 'z', size: 20 },
  },
];

const generatedRule: GeneratedOutputRule = {
  id: 'generated-api',
  pathPrefix: 'packages/api/src/generated/',
  producerEvidence: ['generators/z.ts', 'generators/a.ts'],
};

const preparedGeneratedRule: GeneratedOutputRule = {
  ...generatedRule,
  producerEvidence: ['generators/a.ts', 'generators/z.ts'],
};

const invalidRuleCases: readonly {
  readonly label: string;
  readonly rules: readonly GeneratedOutputRule[];
  readonly treeEntries: readonly TrackedTreeEntry[];
}[] = [
  {
    label: 'a duplicate identifier',
    rules: [generatedRule, { ...generatedRule, pathPrefix: 'packages/other/' }],
    treeEntries: regularTreeEntries,
  },
  {
    label: 'a malformed prefix',
    rules: [{ ...generatedRule, pathPrefix: 'packages/../generated/' }],
    treeEntries: regularTreeEntries,
  },
  {
    label: 'equal or nested prefixes',
    rules: [
      generatedRule,
      { ...generatedRule, id: 'nested', pathPrefix: `${generatedRule.pathPrefix}v2/` },
    ],
    treeEntries: regularTreeEntries,
  },
  {
    label: 'duplicate producer evidence',
    rules: [{ ...generatedRule, producerEvidence: ['generators/a.ts', 'generators/a.ts'] }],
    treeEntries: regularTreeEntries,
  },
  {
    label: 'missing producer evidence',
    rules: [{ ...generatedRule, producerEvidence: ['generators/missing.ts'] }],
    treeEntries: regularTreeEntries,
  },
  {
    label: 'nonregular producer evidence',
    rules: [{ ...generatedRule, producerEvidence: ['generators/a.ts'] }],
    treeEntries: [
      {
        path: 'generators/a.ts',
        treeEntry: { mode: '120000', type: 'blob', object: 'a', size: 10 },
      },
    ],
  },
];

describe('generated-output rule preflight', () => {
  it('normalises producer evidence into exact UTF-16 order', () => {
    const rules = unwrapOrThrow(preflightGeneratedOutputRules([generatedRule], regularTreeEntries));

    expect(rules).toEqual([preparedGeneratedRule]);
  });

  it('matches prepared rules by exact case-sensitive path prefix', () => {
    expect(
      findGeneratedOutputRule([preparedGeneratedRule], 'packages/api/src/generated/model.ts')?.id,
    ).toBe('generated-api');
    expect(
      findGeneratedOutputRule([preparedGeneratedRule], 'packages/api/src/generatedness/model.ts'),
    ).toBeUndefined();
    expect(
      findGeneratedOutputRule([preparedGeneratedRule], 'packages/API/src/generated/model.ts'),
    ).toBeUndefined();
  });

  it.each(invalidRuleCases)('rejects $label before classification', ({ rules, treeEntries }) => {
    const result = preflightGeneratedOutputRules(rules, treeEntries);

    expect(unwrapErr(result).code).toBe('CONFIG_INVALID');
  });
});
