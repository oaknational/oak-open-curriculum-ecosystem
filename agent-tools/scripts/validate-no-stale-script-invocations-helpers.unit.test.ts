import { describe, expect, it } from 'vitest';

import { findStaleScriptInvocations } from './validate-no-stale-script-invocations-helpers.js';

describe('findStaleScriptInvocations', () => {
  it('returns no findings when content uses workspace-owned commands', () => {
    const files = [
      { path: 'docs/guide.md', content: 'Run `pnpm agent-tools:repo-check profile`.' },
      { path: '.github/workflows/ci.yml', content: 'run: pnpm subagents:check' },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([]);
  });

  it.each([
    {
      label: '`.mjs` extension',
      content: 'run: node scripts/foo.mjs',
      expected: 'node scripts/foo.mjs',
    },
    {
      label: '`.ts` extension',
      content: 'run: node scripts/foo.ts',
      expected: 'node scripts/foo.ts',
    },
    {
      label: '`.js` extension',
      content: 'run: node scripts/foo.js',
      expected: 'node scripts/foo.js',
    },
  ])('flags `node scripts/<name>` invocations: $label', ({ content, expected }) => {
    expect(findStaleScriptInvocations([{ path: 'somewhere.md', content }])).toStrictEqual([
      { path: 'somewhere.md', line: 1, match: expected },
    ]);
  });

  it('reports the 1-based line number for findings on later lines', () => {
    const content = 'line one\nline two\nrun: node scripts/foo.mjs\nline four\n';

    expect(findStaleScriptInvocations([{ path: 'docs/guide.md', content }])).toStrictEqual([
      { path: 'docs/guide.md', line: 3, match: 'node scripts/foo.mjs' },
    ]);
  });

  it('reports each match separately when multiple appear on a single line', () => {
    const content = 'old: node scripts/a.mjs / new: node scripts/b.ts\n';

    expect(findStaleScriptInvocations([{ path: 'docs/guide.md', content }])).toStrictEqual([
      { path: 'docs/guide.md', line: 1, match: 'node scripts/a.mjs' },
      { path: 'docs/guide.md', line: 1, match: 'node scripts/b.ts' },
    ]);
  });

  it('reports each match separately when multiple appear across lines in a single file', () => {
    const content = 'run: node scripts/a.mjs\nrun: node scripts/b.mjs\n';

    expect(
      findStaleScriptInvocations([{ path: '.github/workflows/ci.yml', content }]),
    ).toStrictEqual([
      { path: '.github/workflows/ci.yml', line: 1, match: 'node scripts/a.mjs' },
      { path: '.github/workflows/ci.yml', line: 2, match: 'node scripts/b.mjs' },
    ]);
  });

  it.each([
    {
      content: 'run: npx tsx scripts/foo.ts',
      expected: 'npx tsx scripts/foo.ts',
    },
    {
      content: 'run: pnpm dlx tsx scripts/foo.ts',
      expected: 'pnpm dlx tsx scripts/foo.ts',
    },
  ])('flags retired root-script invocation forms: $expected', ({ content, expected }) => {
    expect(findStaleScriptInvocations([{ path: 'docs/guide.md', content }])).toStrictEqual([
      { path: 'docs/guide.md', line: 1, match: expected },
    ]);
  });

  it('does not flag bare or package-local `scripts/` references', () => {
    const content = 'Mentioning `scripts/foo.ts` alone.\nRun package-local `./scripts/foo.sh`.\n';

    expect(findStaleScriptInvocations([{ path: 'docs/guide.md', content }])).toStrictEqual([]);
  });

  it('does not flag `node` invocations targeting paths outside `scripts/`', () => {
    const content = 'Run `node dist/cli.js`.\nOr `node ./build/index.mjs`.\n';

    expect(findStaleScriptInvocations([{ path: 'docs/guide.md', content }])).toStrictEqual([]);
  });

  it('skips files whose path is in the allowlist', () => {
    const allowlistedPath =
      '.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md';

    expect(
      findStaleScriptInvocations(
        [
          {
            path: allowlistedPath,
            content:
              'The drift was `node scripts/foo.mjs`; we replaced it with the canonical form.\n',
          },
        ],
        { allowlistedPaths: [allowlistedPath] },
      ),
    ).toStrictEqual([]);
  });

  it('still flags files whose path is not in the allowlist when an allowlist is configured', () => {
    expect(
      findStaleScriptInvocations(
        [
          {
            path: '.agent/plans/architecture-and-infrastructure/current/some-other.plan.md',
            content: 'A `node scripts/foo.mjs` reference here.\n',
          },
        ],
        {
          allowlistedPaths: [
            '.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md',
          ],
        },
      ),
    ).toStrictEqual([
      {
        path: '.agent/plans/architecture-and-infrastructure/current/some-other.plan.md',
        line: 1,
        match: 'node scripts/foo.mjs',
      },
    ]);
  });
});
