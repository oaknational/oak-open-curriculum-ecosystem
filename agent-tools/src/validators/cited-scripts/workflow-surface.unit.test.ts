import { describe, expect, it } from 'vitest';

import { findMissingFilteredCommands } from './command-surfaces.js';
import type { WorkspaceScripts } from './validate-cited-scripts-helpers.js';
import { workflowSurface } from './workflow-surface.js';

/**
 * A workflow runs only its steps' `run` values, read as YAML reads them, so
 * those are the commands checked for filtered pnpm calls.
 */

const scripts: WorkspaceScripts = {
  root: new Set(['check']),
  bins: new Set(),
  workspaces: new Map([['@example/www', new Set(['test:e2e'])]]),
  directories: new Map(),
};

const PATH = '.github/workflows/ci.yml';

function workflow(...steps: readonly string[]): string {
  return ['jobs:', '  ci:', '    steps:', ...steps].join('\n');
}

describe('workflowSurface', () => {
  it('reads a step name that mentions pnpm as no command', () => {
    const text = workflow('      - name: pnpm --filter @nope/missing check', '        run: echo');
    expect(findMissingFilteredCommands([workflowSurface(PATH, text)], scripts)).toStrictEqual([]);
  });

  it('keeps the two commands a blank line separates in a folded run value', () => {
    const text = workflow(
      '      - run: >-',
      '          echo preparing',
      '',
      '          pnpm --filter @nope/missing',
      '          check',
    );
    const findings = findMissingFilteredCommands([workflowSurface(PATH, text)], scripts);
    expect(findings.map((finding) => [finding.line, finding.reason])).toStrictEqual([
      [5, 'unknown-workspace'],
    ]);
  });

  it('joins a folded run value without a blank line into one command', () => {
    const text = workflow(
      '      - run: >-',
      '          pnpm --filter @nope/missing',
      '          check',
    );
    expect(workflowSurface(PATH, text).lines).toStrictEqual([
      { line: 5, text: 'pnpm --filter @nope/missing check' },
    ]);
  });

  it("numbers a literal run value's lines exactly, joining a continuation", () => {
    const text = workflow(
      '      - run: |',
      '          echo one',
      '          pnpm --filter \\',
      '            @a/b check',
    );
    expect(workflowSurface(PATH, text).lines).toStrictEqual([
      { line: 5, text: 'echo one' },
      { line: 6, text: 'pnpm --filter @a/b check' },
      { line: 8, text: '' },
    ]);
  });

  it('refuses a workflow that is not valid YAML', () => {
    expect(() => workflowSurface(PATH, 'jobs: [')).toThrow(`${PATH} is not valid YAML`);
  });
});
