import { describe, expect, it } from 'vitest';

import { parseRulesIndex } from './parse-rules-index.js';

const HEADER = [
  '# Rules Index',
  '',
  '| Rule | Classification | Trigger / Loading Signal |',
  '| ---- | -------------- | ------------------------ |',
].join('\n');

function indexWith(...rows: readonly string[]): string {
  return `${HEADER}\n${rows.join('\n')}\n`;
}

describe('parseRulesIndex', () => {
  it('reads a core row as core with no trigger', () => {
    const result = parseRulesIndex(indexWith('| `.agent/rules/compute-dont-hope.md` | core | — |'));
    expect(result).toStrictEqual({
      ok: true,
      value: new Map([['compute-dont-hope', { classification: 'core' }]]),
    });
  });

  it('reads a situational row with its trigger text verbatim, padding stripped', () => {
    const result = parseRulesIndex(
      indexWith(
        '| `.agent/rules/invoke-test-expert.md`      | situational    | surface:test files, vitest and playwright config   |',
      ),
    );
    expect(result).toEqual({
      ok: true,
      value: new Map([
        [
          'invoke-test-expert',
          {
            classification: 'situational',
            trigger: 'surface:test files, vitest and playwright config',
          },
        ],
      ]),
    });
  });

  it('reads a generated row whose trigger is a code span as the bare token', () => {
    const result = parseRulesIndex(
      indexWith('| `.agent/rules/a.md` | situational | `surface:**/*.ts,**/*.tsx` |'),
    );
    expect(result).toStrictEqual({
      ok: true,
      value: new Map([
        ['a', { classification: 'situational', trigger: 'surface:**/*.ts,**/*.tsx' }],
      ]),
    });
  });

  it('ignores every line that is not a rule row', () => {
    const result = parseRulesIndex(
      indexWith('Prose about `.agent/rules/` in general.', '| `.agent/rules/a.md` | core | — |'),
    );
    expect(result).toEqual({ ok: true, value: new Map([['a', { classification: 'core' }]]) });
  });

  it('refuses a row whose classification is outside the closed set', () => {
    const result = parseRulesIndex(indexWith('| `.agent/rules/a.md` | optional | — |'));
    expect(result).toEqual({
      ok: false,
      error: '.agent/rules/a.md: classification must be core or situational, got "optional"',
    });
  });

  it('refuses a situational row with no trigger', () => {
    const result = parseRulesIndex(indexWith('| `.agent/rules/a.md` | situational | — |'));
    expect(result).toEqual({
      ok: false,
      error: '.agent/rules/a.md: a situational rule needs a trigger; the row carries "—"',
    });
  });

  it('refuses a situational row whose trigger cell is empty, as it refuses the em dash', () => {
    const result = parseRulesIndex(indexWith('| `.agent/rules/a.md` | situational |  |'));
    expect(result).toEqual({
      ok: false,
      error: '.agent/rules/a.md: a situational rule needs a trigger; the row carries ""',
    });
  });

  it('refuses a core row that carries a trigger', () => {
    const result = parseRulesIndex(indexWith('| `.agent/rules/a.md` | core | session:team |'));
    expect(result).toEqual({
      ok: false,
      error: '.agent/rules/a.md: a core rule carries no trigger; the row carries "session:team"',
    });
  });

  it('refuses a rule row it cannot parse rather than skipping it', () => {
    const result = parseRulesIndex(indexWith('| `.agent/rules/a.md` | core |'));
    expect(result).toEqual({
      ok: false,
      error: 'unparseable rules-index row: | `.agent/rules/a.md` | core |',
    });
  });

  it('refuses a row with a pipe inside a cell rather than reading past it', () => {
    const result = parseRulesIndex(
      indexWith('| `.agent/rules/a.md` | situational | surface:a | b |'),
    );
    expect(result).toEqual({
      ok: false,
      error: 'unparseable rules-index row: | `.agent/rules/a.md` | situational | surface:a | b |',
    });
  });

  it('refuses a rule listed twice', () => {
    const result = parseRulesIndex(
      indexWith('| `.agent/rules/a.md` | core | — |', '| `.agent/rules/a.md` | core | — |'),
    );
    expect(result).toEqual({ ok: false, error: '.agent/rules/a.md: listed twice in the index' });
  });
});
