import { describe, expect, it } from 'vitest';

import {
  extractScriptCitations,
  findMissingScriptCitations,
  type WorkspaceScripts,
} from './validate-cited-scripts-helpers.js';

const scripts: WorkspaceScripts = {
  root: new Set(['check', 'build', 'test', 'agent-tools:agent-identity']),
  bins: new Set(['tsx']),
  workspaces: new Map([
    ['@example/www', new Set(['test:e2e', 'logo:statusline'])],
    ['@example/agent-tools', new Set(['validate-markdown-links'])],
  ]),
  directories: new Map([
    ['apps/www', '@example/www'],
    ['tools/agent', '@example/agent-tools'],
  ]),
};

describe('extractScriptCitations', () => {
  it('reads every line of a fenced block and only code spans outside it', () => {
    const content = [
      'Prose mentioning pnpm workspaces is not a command.',
      'Run `pnpm check` first.',
      '```bash',
      'pnpm build   # makes changes',
      'pnpm test',
      '```',
      'and pnpm outdated in prose is ignored too.',
    ].join('\n');

    expect(extractScriptCitations(content).map((c) => [c.line, c.scriptName])).toStrictEqual([
      [2, 'check'],
      [4, 'build'],
      [5, 'test'],
    ]);
  });

  it('carries the --filter target and skips run and pass-through flags', () => {
    const content = [
      '`pnpm --filter @example/www test:e2e`',
      '`pnpm -F @example/agent-tools run validate-markdown-links`',
      '`pnpm --filter=@example/www logo:statusline`',
      '`pnpm -s agent-tools:agent-identity --format display`',
    ].join('\n');

    expect(
      extractScriptCitations(content).map((c) => [c.scriptName, c.workspaceFilter]),
    ).toStrictEqual([
      ['test:e2e', '@example/www'],
      ['validate-markdown-links', '@example/agent-tools'],
      ['logo:statusline', '@example/www'],
      ['agent-tools:agent-identity', undefined],
    ]);
  });

  it.each([
    ['a pnpm built-in', '`pnpm install --frozen-lockfile`'],
    ['pnpm exec', '`pnpm exec tsx scripts/foo.ts`'],
    ['pnpm dlx', '`pnpm dlx create-thing`'],
    ['a placeholder name', '`pnpm <script>`'],
    ['a directory switch', '`pnpm -C example build`'],
    ['a recursive run', '`pnpm -r build`'],
    ['a path filter', '`pnpm --filter ./example build`'],
    ['a glob filter', '`pnpm --filter "@example/*" build`'],
    ['a placeholder filter', '`pnpm --filter <workspace> type-check`'],
    ['a bare pnpm at the end of a command', '`corepack enable pnpm`'],
    ['a colon-terminated word from quoted prose', '`"Lane <name> pnpm check: green"`'],
    ['a pnpm mention inside a shell comment', '```sh\n# the pnpm banner goes to stderr\n```'],
  ])('omits %s rather than guessing', (_label, content) => {
    expect(extractScriptCitations(content)).toStrictEqual([]);
  });

  it('reads a fenced command up to its trailing comment only', () => {
    const content = '```sh\npnpm check # then pnpm imaginary\n```';

    expect(extractScriptCitations(content).map((c) => c.scriptName)).toStrictEqual(['check']);
  });

  it('stops at a shell terminator and finds a second command after it', () => {
    const content = '`pnpm --filter @example/www && pnpm check`';

    expect(extractScriptCitations(content).map((c) => c.scriptName)).toStrictEqual(['check']);
  });

  it('carries the directory a cd line in the same fenced block made current', () => {
    const content = [
      '```sh',
      'cd ./tools/agent/',
      'pnpm exec vitest run',
      'pnpm check',
      'cd src && pnpm build',
      'cd ../../..',
      'pnpm test',
      '```',
      '`pnpm check`',
    ].join('\n');

    expect(
      extractScriptCitations(content).map((c) => [c.scriptName, c.workingDirectory]),
    ).toStrictEqual([
      ['check', 'tools/agent'],
      ['build', 'tools/agent/src'],
      ['test', undefined],
      ['check', undefined],
    ]);
  });

  it('a cd on one line of a block does not reach the next block or an inline span', () => {
    const content = ['```sh', 'cd tools/agent', '```', '```sh', 'pnpm check', '```'].join('\n');

    expect(extractScriptCitations(content).map((c) => c.workingDirectory)).toStrictEqual([
      undefined,
    ]);
  });

  it.each([
    ['a variable', 'cd "$ROOT"'],
    ['a placeholder', 'cd <workspace>'],
    ['an absolute path', 'cd /tmp/work'],
    ['a climb out of the repository', 'cd ../elsewhere'],
    ['no target', 'cd'],
  ])('omits what follows a cd to %s rather than guessing', (_label, cdLine) => {
    const content = ['```sh', cdLine, 'pnpm check', 'cd tools/agent', 'pnpm check', '```'].join(
      '\n',
    );

    expect(extractScriptCitations(content)).toStrictEqual([]);
  });

  it('reports the command text and line of each citation', () => {
    const content = '```sh\n\n  pnpm run build --force\n```';

    expect(extractScriptCitations(content)).toStrictEqual([
      { line: 3, match: 'pnpm run build', scriptName: 'build' },
    ]);
  });
});

describe('findMissingScriptCitations', () => {
  it('returns no findings when every citation resolves', () => {
    const files = [
      {
        path: 'docs/a.md',
        content: 'Run `pnpm check` then `pnpm --filter @example/www test:e2e`.',
      },
    ];

    expect(findMissingScriptCitations(files, scripts)).toStrictEqual([]);
  });

  it('reports a root citation of a script the root does not define', () => {
    const files = [{ path: '.agent/skills/x.md', content: '```bash\npnpm sdk-codegen\n```' }];

    expect(findMissingScriptCitations(files, scripts)).toStrictEqual([
      {
        path: '.agent/skills/x.md',
        line: 2,
        match: 'pnpm sdk-codegen',
        scriptName: 'sdk-codegen',
        scope: 'root',
        reason: 'missing-script',
      },
    ]);
  });

  it('reports a workspace citation of a script that workspace does not define', () => {
    const files = [{ path: 'docs/a.md', content: '`pnpm --filter @example/www test:widget`' }];

    expect(
      findMissingScriptCitations(files, scripts).map((f) => [f.scope, f.reason]),
    ).toStrictEqual([['@example/www', 'missing-script']]);
  });

  it('resolves a bare citation after a cd against the workspace containing that directory', () => {
    const files = [
      {
        path: 'docs/a.md',
        content: '```sh\ncd tools/agent/src\npnpm validate-markdown-links\npnpm check\n```',
      },
    ];

    expect(
      findMissingScriptCitations(files, scripts).map((f) => [f.line, f.scope, f.reason]),
    ).toStrictEqual([[4, '@example/agent-tools', 'missing-script']]);
  });

  it('resolves a root-installed executable from the root and from a workspace directory', () => {
    const files = [
      { path: 'docs/a.md', content: '`pnpm tsx x.ts`\n```sh\ncd tools/agent\npnpm tsx x.ts\n```' },
    ];

    expect(findMissingScriptCitations(files, scripts)).toStrictEqual([]);
  });

  it('resolves a bare citation after a cd into no workspace against the root, as pnpm does', () => {
    const files = [{ path: 'docs/a.md', content: '```sh\ncd docs\npnpm check\npnpm nope\n```' }];

    expect(
      findMissingScriptCitations(files, scripts).map((f) => [f.scriptName, f.scope]),
    ).toStrictEqual([['nope', 'root']]);
  });

  it('reports a filter that names no workspace', () => {
    const files = [{ path: 'docs/a.md', content: '`pnpm --filter @example/widget build`' }];

    expect(
      findMissingScriptCitations(files, scripts).map((f) => [f.scope, f.reason]),
    ).toStrictEqual([['@example/widget', 'unknown-workspace']]);
  });
});
