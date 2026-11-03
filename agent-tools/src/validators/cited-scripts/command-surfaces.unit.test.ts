import { describe, expect, it } from 'vitest';

import {
  findMissingFilteredCommands,
  linesOfCommandFile,
  scriptLinesOfManifest,
} from './command-surfaces.js';
import type { WorkspaceScripts } from './validate-cited-scripts-helpers.js';

/**
 * The commands a gate runs (package.json scripts, the git hooks, CI
 * workflow steps), read for filtered pnpm calls. A filter that names no
 * workspace makes pnpm exit 0 without running anything, so every such call
 * must name a real workspace and a script that workspace defines.
 */

const scripts: WorkspaceScripts = {
  root: new Set(['check']),
  bins: new Set(),
  workspaces: new Map([
    ['@example/www', new Set(['test:e2e'])],
    ['@example/agent-tools', new Set(['repo-check'])],
  ]),
  directories: new Map(),
};

function surface(...lines: readonly string[]): {
  readonly path: string;
  readonly lines: ReturnType<typeof linesOfCommandFile>;
} {
  return { path: '.husky/pre-push', lines: linesOfCommandFile(lines.join('\n')) };
}

describe('linesOfCommandFile', () => {
  it('numbers every line from one', () => {
    expect(linesOfCommandFile('a\nb')).toStrictEqual([
      { line: 1, text: 'a' },
      { line: 2, text: 'b' },
    ]);
  });

  it('joins a backslash continuation into one command, numbered by its first line', () => {
    expect(linesOfCommandFile('x\npnpm --filter \\\n  @a/b check\ny')).toStrictEqual([
      { line: 1, text: 'x' },
      { line: 2, text: 'pnpm --filter @a/b check' },
      { line: 4, text: 'y' },
    ]);
  });
});

describe('scriptLinesOfManifest', () => {
  it('reads each script with the line it is declared on', () => {
    const manifest = [
      '{',
      '  "name": "@example/root",',
      '  "scripts": {',
      '    "e2e": "pnpm --filter @example/www test:e2e",',
      '    "types": "tsc"',
      '  }',
      '}',
    ].join('\n');

    expect(scriptLinesOfManifest(manifest)).toStrictEqual([
      { line: 4, text: 'pnpm --filter @example/www test:e2e' },
      { line: 5, text: 'tsc' },
    ]);
  });

  it('numbers a script by its own line, not an earlier key of the same name', () => {
    const manifest = [
      '{',
      '  "config": { "e2e": "headless" },',
      '  "scripts": {',
      '    "e2e": "pnpm --filter @example/www test:e2e"',
      '  }',
      '}',
    ].join('\n');

    expect(scriptLinesOfManifest(manifest)).toStrictEqual([
      { line: 4, text: 'pnpm --filter @example/www test:e2e' },
    ]);
  });

  it('reads nothing from a manifest without scripts', () => {
    expect(scriptLinesOfManifest('{ "name": "x" }')).toStrictEqual([]);
  });
});

describe('findMissingFilteredCommands', () => {
  it('passes a filtered call that names a real workspace and script, a semicolon included', () => {
    expect(
      findMissingFilteredCommands(
        [surface('if ! pnpm --filter @example/www test:e2e; then')],
        scripts,
      ),
    ).toStrictEqual([]);
  });

  it('reports a filter that names no workspace, where it is', () => {
    const findings = findMissingFilteredCommands(
      [surface('', '        run: pnpm --filter @example/wwwx test:e2e')],
      scripts,
    );

    expect(findings).toStrictEqual([
      {
        path: '.husky/pre-push',
        line: 2,
        match: 'pnpm --filter @example/wwwx test:e2e',
        scriptName: 'test:e2e',
        scope: '@example/wwwx',
        reason: 'unknown-workspace',
      },
    ]);
  });

  it('reports a script the filtered workspace does not define', () => {
    const findings = findMissingFilteredCommands(
      [surface('pnpm --filter @example/agent-tools gate-slot run pnpm check')],
      scripts,
    );

    expect(findings.map((finding) => [finding.scriptName, finding.reason])).toStrictEqual([
      ['gate-slot', 'missing-script'],
    ]);
  });

  it('reports a missing script that a semicolon closes, named without the semicolon', () => {
    const findings = findMissingFilteredCommands(
      [surface('if ! pnpm --filter @example/agent-tools nope; then')],
      scripts,
    );

    expect(findings.map((finding) => [finding.match, finding.reason])).toStrictEqual([
      ['pnpm --filter @example/agent-tools nope', 'missing-script'],
    ]);
  });

  it('reports a filtered built-in whose filter names no workspace, and passes a real one', () => {
    const findings = findMissingFilteredCommands(
      [
        surface(
          'pnpm --filter @nope/missing exec playwright install',
          'pnpm --filter @example/www exec playwright install',
        ),
      ],
      scripts,
    );

    expect(findings.map((finding) => [finding.line, finding.reason])).toStrictEqual([
      [1, 'unknown-workspace'],
    ]);
  });

  it('reports a filter that names no workspace when a separator touches the script', () => {
    const findings = findMissingFilteredCommands(
      [surface('pnpm --filter @nope/missing check&&echo done')],
      scripts,
    );

    expect(findings.map((finding) => [finding.scriptName, finding.reason])).toStrictEqual([
      ['check', 'unknown-workspace'],
    ]);
  });

  it('reports a filtered call split across continued lines', () => {
    const findings = findMissingFilteredCommands(
      [surface('pnpm --filter \\', '  @nope/missing check')],
      scripts,
    );

    expect(findings.map((finding) => [finding.line, finding.reason])).toStrictEqual([
      [1, 'unknown-workspace'],
    ]);
  });

  it.each([
    { name: 'an unfiltered call, whose scope depends on where it runs', line: 'pnpm nope' },
    { name: 'a comment', line: '# pnpm --filter @nope/missing run-me' },
    { name: 'an echoed hint', line: `echo "Run 'pnpm --filter @nope/missing run-me'"` },
    { name: 'an unquoted echoed hint', line: 'echo pnpm --filter @nope/missing run-me' },
    { name: 'a printed hint', line: String.raw`printf "%s\n" pnpm --filter @nope/missing run-me` },
    {
      name: 'a separator inside an echoed string',
      line: 'echo "done && pnpm --filter @nope/missing check"',
    },
    {
      name: 'a quoted filter that names a workspace',
      line: 'pnpm --filter "@example/www" test:e2e',
    },
    {
      name: 'a hint that time -p prints',
      line: 'time -p echo pnpm --filter @nope/missing check',
    },
    {
      name: 'a hint a condition prints',
      line: 'if echo pnpm --filter @nope/missing check; then true; fi',
    },
    {
      name: 'a single-quoted command substitution, which prints as written',
      line: "echo '$(pnpm --filter @nope/missing check)'",
    },
    {
      name: 'single-quoted backticks, which print as written',
      line: "echo '`pnpm --filter @nope/missing check`'",
    },
    {
      name: 'a quoted filter in backticks inside double quotes that names a workspace',
      line: 'echo "`pnpm --filter \\"@example/www\\" test:e2e`"',
    },
    {
      name: 'a filter a backtick substitution computes',
      line: 'pnpm --filter `node scripts/ws.mjs` check',
    },
    {
      name: 'a filter a quoted command substitution computes',
      line: 'pnpm --filter "$(jq -r .name package.json)" check',
    },
    {
      name: 'printed text after a substitution whose backticks hold a parenthesis',
      line: 'echo "$(echo `echo )`) pnpm --filter @nope/missing check"',
    },
    {
      name: 'printed text after a substitution that holds a parameter expansion',
      line: 'echo "$(echo ${fallback:-none}) pnpm --filter @nope/missing check"',
    },
    {
      name: 'printed words after an unquoted command substitution',
      line: 'echo $(true) pnpm --filter @nope/missing check',
    },
    {
      name: 'an escaped backtick, which is a literal character',
      line: String.raw`echo \`pnpm --filter @nope/missing check\``,
    },
  ])('ignores $name', ({ line }) => {
    expect(findMissingFilteredCommands([surface(line)], scripts)).toStrictEqual([]);
  });
});

describe('findMissingFilteredCommands on shell syntax', () => {
  it.each([
    { name: 'a quoted filter', line: "pnpm --filter '@nope/missing' check" },
    { name: 'a call run by sh -c', line: "sh -c 'pnpm --filter @nope/missing check'" },
    { name: 'a call run by bash -c', line: 'bash -c "pnpm --filter @nope/missing check"' },
    { name: 'a call run by zsh -c', line: "zsh -c 'pnpm --filter @nope/missing check'" },
    { name: 'a call run by bash -lc', line: "bash -lc 'pnpm --filter @nope/missing check'" },
    { name: 'a call run by sh -e -c', line: 'sh -e -c "pnpm --filter @nope/missing check"' },
    {
      name: 'a shell call that time -p runs',
      line: "time -p bash -c 'pnpm --filter @nope/missing check'",
    },
    {
      name: 'a shell call a condition runs',
      line: "if bash -c 'pnpm --filter @nope/missing check'; then echo ok; fi",
    },
    {
      name: 'a call a then branch runs',
      line: 'if true; then pnpm --filter @nope/missing check; fi',
    },
    { name: 'a call after a quoted #', line: "echo '#' && pnpm --filter @nope/missing check" },
    { name: 'a call after an assignment', line: 'CI=1 pnpm --filter @nope/missing check' },
    { name: 'a call in backticks', line: 'echo `pnpm --filter @nope/missing check`' },
    {
      name: 'a call in backticks inside double quotes',
      line: 'echo "`pnpm --filter @nope/missing check`"',
    },
    {
      name: 'a call in a command substitution inside double quotes',
      line: 'VERSION="$(pnpm --filter @nope/missing check)"',
    },
    {
      name: 'a call in a nested command substitution inside double quotes',
      line: 'echo "$(echo "$(pnpm --filter @nope/missing check)")"',
    },
    {
      name: 'a call in an unquoted command substitution that echo prints',
      line: 'echo $(pnpm --filter @nope/missing check)',
    },
    {
      name: 'a call after a subshell in a double-quoted command substitution',
      line: 'echo "$( (true) && pnpm --filter @nope/missing check)"',
    },
    {
      name: 'a call in a substitution that the outer shell runs for sh -c',
      line: 'bash -c "echo $(pnpm --filter @nope/missing check)"',
    },
    {
      name: 'a call in backticks that the outer shell runs for sh -c',
      line: 'bash -c "echo `pnpm --filter @nope/missing check`"',
    },
    {
      name: 'a call after an escaped parenthesis in a double-quoted command substitution',
      line: String.raw`echo "$(echo \) && pnpm --filter @nope/missing check)"`,
    },
    {
      name: 'a call after backticks holding a parenthesis in a double-quoted command substitution',
      line: 'echo "$(echo `echo )` && pnpm --filter @nope/missing check)"',
    },
    {
      name: 'a call after a parameter expansion holding a parenthesis in a command substitution',
      line: 'echo "$(echo ${fallback:-)} && pnpm --filter @nope/missing check)"',
    },
    {
      name: 'a call in an unquoted command substitution after an assignment',
      line: 'VERSION=$(pnpm --filter @nope/missing check)',
    },
    {
      name: 'a call after a quoted parenthesis in a double-quoted command substitution',
      line: `echo "$(echo ')' && pnpm --filter @nope/missing check)"`,
    },
  ])('reports $name', ({ line }) => {
    const findings = findMissingFilteredCommands([surface(line)], scripts);

    expect(findings.map((finding) => [finding.scriptName, finding.reason])).toStrictEqual([
      ['check', 'unknown-workspace'],
    ]);
  });
});
