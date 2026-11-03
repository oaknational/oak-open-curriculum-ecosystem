import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseSubagentDeclaration } from './subagent-declaration.js';

describe('parseSubagentDeclaration', () => {
  it('reads a role of one description as a role with no platform blocks', () => {
    expect(parseSubagentDeclaration('alpha', { description: 'Alpha reviews a.' })).toStrictEqual({
      ok: true,
      value: { kind: 'role', name: 'alpha', description: 'Alpha reviews a.' },
    });
  });

  it('reads a role with platform deviations and a Gemini block of only declared fields', () => {
    const value = {
      description: 'Alpha reviews a.',
      platforms: ['cursor', 'claude', 'codex', 'gemini'],
      claude: { tools: 'inherit', color: 'purple', note: 'Review only.' },
      codex: { effort: 'low', pointerTail: ',\nthen stop.' },
      gemini: { kind: 'local', tools: ['read_file'], temperature: 0.2, max_turns: 5 },
    };
    expect(parseSubagentDeclaration('alpha', value)).toStrictEqual({
      ok: true,
      value: { kind: 'role', name: 'alpha', ...value },
    });
  });

  it('reads a list of variants as a fan-out, each variant whole', () => {
    const variant = {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'High.',
      title: 'Cricket — High',
      cursor: { description: 'Cursor high.', note: 'Cursor prose.' },
      claude: { tools: 'Read', model: 'sonnet', effort: 'high', note: 'Claude prose.' },
    };
    expect(parseSubagentDeclaration('cricket', { variants: [variant] })).toStrictEqual({
      ok: true,
      value: { kind: 'fan-out', name: 'cricket', variants: [variant] },
    });
  });

  it('refuses a key outside the shape, naming the template and the path', () => {
    expect(
      parseSubagentDeclaration('alpha', { description: 'Alpha.', claude: { colour: 'purple' } }),
    ).toStrictEqual({ ok: false, error: 'alpha: claude: Unrecognized key: "colour"' });
    expect(
      parseSubagentDeclaration('cricket', {
        variants: [
          { name: 'cricket-high', platforms: ['claude'], description: 'High.', tone: 'x' },
        ],
      }),
    ).toStrictEqual({ ok: false, error: 'cricket: variants.0: Unrecognized key: "tone"' });
  });

  it('refuses a variant name declared twice, naming the second by its index', () => {
    const variant = { name: 'cricket-high', platforms: ['claude'], description: 'High.' };
    expect(
      parseSubagentDeclaration('cricket', {
        variants: [variant, { ...variant, name: 'cricket-low' }, variant],
      }),
    ).toStrictEqual({
      ok: false,
      error: 'cricket: variants.2.name: "cricket-high" duplicates variants.0',
    });
  });

  it('refuses a variant whose name is not the template name with a suffix', () => {
    expect(
      parseSubagentDeclaration('cricket', {
        variants: [{ name: 'other-high', platforms: ['claude'], description: 'High.' }],
      }),
    ).toStrictEqual({
      ok: false,
      error:
        'cricket: variants: "other-high" is not a variant of cricket (its name does not start with "cricket-")',
    });
  });

  it('refuses a block for a platform the declaration does not list, and a platform listed twice', () => {
    expect(
      parseSubagentDeclaration('alpha', {
        description: 'Alpha.',
        platforms: ['cursor'],
        claude: { color: 'red' },
      }),
    ).toStrictEqual({ ok: false, error: 'alpha: claude: a block for a platform not in platforms' });
    expect(
      parseSubagentDeclaration('alpha', { description: 'Alpha.', platforms: ['claude', 'claude'] }),
    ).toStrictEqual({ ok: false, error: 'alpha: platforms: listed twice' });
    expect(
      parseSubagentDeclaration('cricket', {
        variants: [
          {
            name: 'cricket-high',
            platforms: ['claude'],
            description: 'High.',
            codex: { effort: 'low' },
          },
        ],
      }),
    ).toStrictEqual({
      ok: false,
      error: 'cricket: variants: cricket-high: codex: a block for a platform not in platforms',
    });
  });

  it('refuses a block that is neither a role nor a fan-out, and one that is both', () => {
    expect(parseSubagentDeclaration('alpha', {}).ok).toBe(false);
    expect(parseSubagentDeclaration('alpha', { description: 'Alpha.', variants: [] }).ok).toBe(
      false,
    );
  });

  it('refuses a remote Gemini kind: the estate renders local agents only', () => {
    expect(
      parseSubagentDeclaration('alpha', {
        description: 'Alpha reviews a.',
        gemini: { kind: 'remote' },
      }),
    ).toStrictEqual({ ok: false, error: 'alpha: gemini.kind: Invalid input: expected "local"' });
  });

  it('accepts an explicit empty Gemini tools list, the no-tool configuration (the Gemini CLI inherits every tool when the key is absent)', () => {
    expect(
      parseSubagentDeclaration('alpha', { description: 'Alpha reviews a.', gemini: { tools: [] } }),
    ).toStrictEqual({
      ok: true,
      value: {
        kind: 'role',
        name: 'alpha',
        description: 'Alpha reviews a.',
        gemini: { tools: [] },
      },
    });
  });

  it('reads a Claude turn bound as a positive whole number, refusing zero and a fraction', () => {
    const withTurns = (maxTurns: number) =>
      parseSubagentDeclaration('voter', {
        description: 'Voter judges.',
        claude: { tools: 'none', maxTurns, body: 'system-prompt' },
      });
    expect(withTurns(4)).toMatchObject({ ok: true, value: { claude: { maxTurns: 4 } } });
    for (const refused of [0, 2.5]) {
      expect(unwrapErr(withTurns(refused))).toMatch(/^voter: claude\.maxTurns: /u);
    }
  });

  it('reads a Codex description, the sentence the Codex adapter and its registry block carry in place of the role description', () => {
    expect(
      parseSubagentDeclaration('alpha', {
        description: 'Alpha reviews a.',
        codex: { description: 'Alpha on Codex.' },
      }),
    ).toMatchObject({ ok: true, value: { codex: { description: 'Alpha on Codex.' } } });
  });

  it('reads a Gemini description, the sentence the Gemini adapter carries in place of the role description, refusing one that is not a single line', () => {
    const withGemini = (description: string) =>
      parseSubagentDeclaration('alpha', {
        description: 'Alpha reviews a.',
        gemini: { description },
      });
    expect(withGemini('Alpha on Gemini.')).toMatchObject({
      ok: true,
      value: { gemini: { description: 'Alpha on Gemini.' } },
    });
    expect(unwrapErr(withGemini('Alpha\non Gemini.'))).toMatch(/^alpha: gemini\.description: /u);
  });

  it('refuses a zero-tool Claude block that names a tool, pads the word, keeps a deny list, or keeps the pointer body a no-tools agent cannot follow, naming the field that breaks it', () => {
    const refusal = (claude: Record<string, unknown>) =>
      unwrapErr(parseSubagentDeclaration('voter', { description: 'Voter.', claude }));
    expect(refusal({ tools: 'none, Read', body: 'system-prompt' })).toMatch(
      /^voter: claude\.tools: /u,
    );
    expect(refusal({ tools: ' none ', body: 'system-prompt' })).toMatch(/^voter: claude\.tools: /u);
    expect(refusal({ tools: 'none', disallowedTools: 'Write', body: 'system-prompt' })).toMatch(
      /^voter: claude\.disallowedTools: /u,
    );
    expect(refusal({ tools: 'none' })).toMatch(/^voter: claude\.body: /u);
  });

  it('refuses a zero-tool fan-out variant at its tools: a variant points to its template, which a zero-tool agent cannot read', () => {
    const variant = { name: 'cricket-high', platforms: ['claude'], description: 'High.' };
    expect(
      unwrapErr(
        parseSubagentDeclaration('cricket', {
          variants: [{ ...variant, claude: { tools: 'none' } }],
        }),
      ),
    ).toMatch(/^cricket: variants\.0\.claude\.tools: /u);
  });

  it('refuses a System prompt body without its tools declared, or with a pointer tail or a note, and in a fan-out variant, naming the field that breaks it', () => {
    const refusal = (claude: Record<string, unknown>) =>
      unwrapErr(parseSubagentDeclaration('mapper', { description: 'Mapper.', claude }));
    expect(refusal({ body: 'system-prompt' })).toMatch(/^mapper: claude\.tools: /u);
    expect(refusal({ tools: 'Read', body: 'system-prompt', pointerTail: ', then stop.' })).toMatch(
      /^mapper: claude\.pointerTail: /u,
    );
    expect(refusal({ tools: 'Read', body: 'system-prompt', note: 'Report only.' })).toMatch(
      /^mapper: claude\.note: /u,
    );
    const variant = { name: 'cricket-high', platforms: ['claude'], description: 'High.' };
    expect(
      unwrapErr(
        parseSubagentDeclaration('cricket', {
          variants: [{ ...variant, claude: { tools: 'Read', body: 'system-prompt' } }],
        }),
      ),
    ).toMatch(/^cricket: variants\.0\.claude: .*\bbody\b/u);
  });

  it('refuses a control character in a line field (a NUL in the description), which YAML forbids and the quote rule would write raw, and a carriage return as a line break', () => {
    expect(parseSubagentDeclaration('alpha', { description: 'Alpha\u0000reviews' })).toStrictEqual({
      ok: false,
      error: 'alpha: description: no control characters',
    });
    expect(parseSubagentDeclaration('alpha', { description: 'Alpha\rreviews' })).toStrictEqual({
      ok: false,
      error: 'alpha: description: one line',
    });
  });

  it('refuses a multi-line description, a Gemini temperature out of range and a bad variant name', () => {
    expect(parseSubagentDeclaration('alpha', { description: 'one\ntwo' }).ok).toBe(false);
    expect(
      parseSubagentDeclaration('alpha', { description: 'Alpha.', gemini: { temperature: 3 } }).ok,
    ).toBe(false);
    expect(
      parseSubagentDeclaration('cricket', {
        variants: [{ name: 'Cricket High', platforms: ['claude'], description: 'High.' }],
      }).ok,
    ).toBe(false);
  });
});
