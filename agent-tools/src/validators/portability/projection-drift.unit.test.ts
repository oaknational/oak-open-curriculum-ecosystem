import { describe, expect, it } from 'vitest';

import { diffProjections } from './projection-drift.js';

const expected = [
  { path: 'RULES_INDEX.md', text: 'index\n' },
  { path: '.cursor/rules/a.mdc', text: 'a-cursor\n' },
  { path: '.claude/rules/a.md', text: 'a-claude\n' },
  { path: '.agents/rules/a.md', text: 'a-agents\n' },
];

describe('diffProjections', () => {
  it('reports nothing when every projection is present and byte-identical', () => {
    const actual = new Map(expected.map((projection) => [projection.path, projection.text]));
    expect(diffProjections(expected, actual)).toEqual({ missing: [], drifted: [], stale: [] });
  });

  it('reports a projection that is absent as missing', () => {
    const actual = new Map(
      expected.slice(0, 3).map((projection) => [projection.path, projection.text]),
    );
    expect(diffProjections(expected, actual).missing).toEqual(['.agents/rules/a.md']);
  });

  it('reports a projection whose bytes differ as drifted', () => {
    const actual = new Map(expected.map((projection) => [projection.path, projection.text]));
    actual.set('.cursor/rules/a.mdc', 'a-cursor edited by hand\n');
    expect(diffProjections(expected, actual).drifted).toEqual(['.cursor/rules/a.mdc']);
  });

  it('reports a file on a projection surface with no declaration behind it as stale', () => {
    const actual = new Map(expected.map((projection) => [projection.path, projection.text]));
    actual.set('.cursor/rules/gone.mdc', 'orphan\n');
    actual.set('.claude/rules/gone.md', 'orphan\n');
    expect(diffProjections(expected, actual).stale).toEqual([
      '.claude/rules/gone.md',
      '.cursor/rules/gone.mdc',
    ]);
  });
});
