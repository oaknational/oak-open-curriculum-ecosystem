import { describe, expect, it } from 'vitest';

import { declaredExpectedSet, parseExpectValue } from './expect-flag.js';

/**
 * The `--expect` flag's grammar, shared by `pr state` and `merge-bot merge`:
 * a GitHub login per configured reviewer, or the one reserved value `none`,
 * the seat's declaration that this work needs no pull-request review (the
 * owner's word of 2026-10-27).
 */

describe('parseExpectValue', () => {
  it('reads a GitHub login, with or without the app [bot] suffix', () => {
    expect(parseExpectValue('copilot-pull-request-reviewer')).toStrictEqual({
      ok: true,
      value: { kind: 'login', login: 'copilot-pull-request-reviewer' },
    });
    expect(parseExpectValue('el-graphael[bot]')).toStrictEqual({
      ok: true,
      value: { kind: 'login', login: 'el-graphael[bot]' },
    });
  });

  it('reads none as the reserved declaration in any case, never as a login', () => {
    for (const spelling of ['none', 'None', 'NONE']) {
      expect(parseExpectValue(spelling), spelling).toStrictEqual({
        ok: true,
        value: { kind: 'none' },
      });
    }
  });

  it('refuses a blank, flag-shaped or non-login value, naming the flag and the alternative', () => {
    for (const bad of ['', '  ', '$(whoami)', '--json']) {
      const parsed = parseExpectValue(bad);
      expect(parsed.ok, bad).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('--expect');
        expect(parsed.error.message).toContain('none');
      }
    }
  });
});

describe('declaredExpectedSet', () => {
  it('is null when the flag was never given: the set is undeclared and defaults', () => {
    expect(declaredExpectedSet([])).toStrictEqual({ ok: true, value: null });
  });

  it('is the logins, in the order declared', () => {
    expect(
      declaredExpectedSet([
        { kind: 'login', login: 'copilot-pull-request-reviewer' },
        { kind: 'login', login: 'chatgpt-codex-connector' },
      ]),
    ).toStrictEqual({
      ok: true,
      value: ['copilot-pull-request-reviewer', 'chatgpt-codex-connector'],
    });
  });

  it('is EMPTY, and declared, when the one value is none', () => {
    expect(declaredExpectedSet([{ kind: 'none' }])).toStrictEqual({ ok: true, value: [] });
  });

  it('refuses none beside a login in either order: the set is empty or it is not', () => {
    const login = { kind: 'login', login: 'copilot-pull-request-reviewer' } as const;
    for (const values of [
      [{ kind: 'none' } as const, login],
      [login, { kind: 'none' } as const],
    ]) {
      const declared = declaredExpectedSet(values);
      expect(declared.ok).toBe(false);
      if (!declared.ok) {
        expect(declared.error.message).toContain('--expect none');
        expect(declared.error.message).toContain('copilot-pull-request-reviewer');
      }
    }
  });
});
