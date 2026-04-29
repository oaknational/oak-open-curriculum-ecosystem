import { describe, expect, it } from 'vitest';

import { findStaleScriptInvocations } from './check-stale-script-invocations-helpers.js';

describe('findStaleScriptInvocations', () => {
  it('returns no findings for files with no node-scripts patterns', () => {
    const files = [
      { path: 'docs/guide.md', content: 'Run `pnpm exec tsx scripts/foo.ts` from root.' },
      { path: '.github/workflows/ci.yml', content: 'run: pnpm exec tsx scripts/bar.ts' },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([]);
  });

  it('flags `node scripts/<name>.mjs` invocation in a workflow YAML', () => {
    const files = [
      {
        path: '.github/workflows/ci.yml',
        content: '      - name: Foo\n        run: node scripts/foo.mjs >> "$GITHUB_STEP_SUMMARY"\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([
      {
        path: '.github/workflows/ci.yml',
        line: 2,
        match: 'node scripts/foo.mjs',
      },
    ]);
  });

  it('flags `node scripts/<name>.ts` invocation in markdown prose', () => {
    const files = [
      {
        path: 'docs/engineering/guide.md',
        content: 'Bad form: run `node scripts/example.ts` directly.\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([
      {
        path: 'docs/engineering/guide.md',
        line: 1,
        match: 'node scripts/example.ts',
      },
    ]);
  });

  it('flags `node scripts/<name>.js` invocation in app docs', () => {
    const files = [
      {
        path: 'apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md',
        content: 'Step: `node scripts/embed-widget-html.js`\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([
      {
        path: 'apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md',
        line: 1,
        match: 'node scripts/embed-widget-html.js',
      },
    ]);
  });

  it('reports the line number for findings on later lines', () => {
    const files = [
      {
        path: 'docs/guide.md',
        content: 'line one\nline two\nrun: node scripts/foo.mjs\nline four\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([
      {
        path: 'docs/guide.md',
        line: 3,
        match: 'node scripts/foo.mjs',
      },
    ]);
  });

  it('reports multiple findings within the same file', () => {
    const files = [
      {
        path: '.github/workflows/ci.yml',
        content: 'run: node scripts/a.mjs\nrun: node scripts/b.mjs\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([
      { path: '.github/workflows/ci.yml', line: 1, match: 'node scripts/a.mjs' },
      { path: '.github/workflows/ci.yml', line: 2, match: 'node scripts/b.mjs' },
    ]);
  });

  it('does not flag npx, pnpm exec, or bare scripts/ references that lack the node prefix', () => {
    const files = [
      {
        path: 'docs/guide.md',
        content:
          'Run `pnpm exec tsx scripts/foo.ts`.\nOr `npx tsx scripts/foo.ts`.\nMentioning `scripts/foo.ts` alone.\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([]);
  });

  it('does not flag node invocations targeting non-scripts/ paths', () => {
    const files = [
      {
        path: 'docs/guide.md',
        content: 'Run `node dist/cli.js`.\nOr `node ./build/index.mjs`.\n',
      },
    ];

    expect(findStaleScriptInvocations(files)).toStrictEqual([]);
  });

  it('does not flag invocations inside markdown comparing-old-vs-new prose patterns when the file path is allowlisted', () => {
    const files = [
      {
        path: '.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md',
        content: 'The drift was `node scripts/foo.mjs`; we replaced it with the canonical form.\n',
      },
    ];

    expect(findStaleScriptInvocations(files, { allowlistedPaths: [files[0].path] })).toStrictEqual(
      [],
    );
  });

  it('still flags un-allowlisted plan files when allowlist is configured', () => {
    const files = [
      {
        path: '.agent/plans/architecture-and-infrastructure/current/some-other.plan.md',
        content: 'A `node scripts/foo.mjs` reference here.\n',
      },
    ];

    expect(
      findStaleScriptInvocations(files, {
        allowlistedPaths: [
          '.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md',
        ],
      }),
    ).toStrictEqual([
      {
        path: '.agent/plans/architecture-and-infrastructure/current/some-other.plan.md',
        line: 1,
        match: 'node scripts/foo.mjs',
      },
    ]);
  });
});
