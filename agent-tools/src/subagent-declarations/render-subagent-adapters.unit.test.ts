import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { renderSubagentAdapters } from './render-subagent-adapters.js';
import type { FanOutDeclaration, RoleDeclaration } from './subagent-declaration.js';

/**
 * The adapter generator (closure item 6, 2b-ii): every declaration renders its Cursor,
 * Claude, Codex and Gemini adapters byte for byte in the estate's one shape
 * (`standard-adapter-body.ts`), a role from the defaults it does not deviate from, a variant
 * exactly as declared. The shapes here are synthetic; the estate's own files are the live
 * proof (75 of 86 unchanged, the eleven normalised ones on record).
 */

const ALPHA: RoleDeclaration = {
  kind: 'role',
  name: 'alpha',
  description: "Alpha reviews a: it's thorough.",
};

const CURSOR_ALPHA = [
  '---',
  'name: alpha',
  'description: "Alpha reviews a: it\'s thorough."',
  'readonly: true',
  '---',
  '',
  '# Alpha',
  '',
  '**All file paths in this document are relative to the repository root.**',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Cursor adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '',
].join('\n');

const CLAUDE_ALPHA = [
  '---',
  'name: alpha',
  'description: "Alpha reviews a: it\'s thorough."',
  'tools: Read, Grep, Glob, Bash',
  'disallowedTools: Write, Edit',
  'permissionMode: plan',
  '---',
  '',
  '# Alpha',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Claude Code adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '',
].join('\n');

const CODEX_ALPHA = [
  'name = "alpha"',
  'description = "Alpha reviews a: it\'s thorough."',
  'model_reasoning_effort = "high"',
  'sandbox_mode = "read-only"',
  'approval_policy = "never"',
  '',
  'developer_instructions = """',
  'Read and follow `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Codex adapter. The canonical reviewer instructions live in',
  'the template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '"""',
  '',
].join('\n');

/** A role deviating on two of its three platforms. */
const PROSE: RoleDeclaration = {
  kind: 'role',
  name: 'prose',
  description: 'Prose craft.',
  claude: {
    tools: 'inherit',
    disallowedTools: 'Write, Edit, NotebookEdit',
    color: 'purple',
    note: 'Review and report only. Do not modify files. The calling agent executes any\nrewrite you recommend.',
  },
  codex: {
    model: 'gpt-x',
    effort: 'low',
    pointerTail: ' Then stop.',
    note: 'Codex prose note.',
  },
};

const CLAUDE_PROSE = [
  '---',
  'name: prose',
  "description: 'Prose craft.'",
  'disallowedTools: Write, Edit, NotebookEdit',
  'color: purple',
  'permissionMode: plan',
  '---',
  '',
  '# Prose',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/prose.md`.',
  '',
  'Review and report only. Do not modify files. The calling agent executes any',
  'rewrite you recommend.',
  '',
].join('\n');

const CODEX_PROSE = [
  'name = "prose"',
  'description = "Prose craft."',
  'model = "gpt-x"',
  'model_reasoning_effort = "low"',
  'sandbox_mode = "read-only"',
  'approval_policy = "never"',
  '',
  'developer_instructions = """',
  'Read and follow `.agent/sub-agents/templates/prose.md` Then stop.',
  '',
  'Codex prose note.',
  '"""',
  '',
].join('\n');

const GEMINI_ALPHA = [
  '---',
  'name: alpha',
  'description: "Alpha reviews a: it\'s thorough."',
  'tools:',
  '  - read_file',
  '  - list_directory',
  '  - glob',
  '  - grep_search',
  '---',
  '',
  '# Alpha',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Gemini CLI adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '',
].join('\n');

const CRICKET: FanOutDeclaration = {
  kind: 'fan-out',
  name: 'cricket',
  variants: [
    {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'Fast high-effort check.',
      title: 'Cricket — High Effort',
      cursor: {
        description: 'Cursor adapter for the high-effort role.',
        note: 'That template is the canonical role definition.\nNever explore the repository.',
      },
      claude: {
        tools: 'Read',
        disallowedTools: 'Write, Edit, Bash, Grep, Glob',
        color: 'green',
        model: 'sonnet',
        effort: 'high',
        note: 'Judge and report from the supplied context.',
      },
    },
  ],
};

const CURSOR_CRICKET_HIGH = [
  '---',
  'name: cricket-high',
  "description: 'Cursor adapter for the high-effort role.'",
  'readonly: true',
  '---',
  '',
  '# Cricket — High Effort',
  '',
  '**All file paths in this document are relative to the repository root.**',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/cricket.md`.',
  '',
  'That template is the canonical role definition.',
  'Never explore the repository.',
  '',
].join('\n');

const CLAUDE_CRICKET_HIGH = [
  '---',
  'name: cricket-high',
  "description: 'Fast high-effort check.'",
  'tools: Read',
  'disallowedTools: Write, Edit, Bash, Grep, Glob',
  'color: green',
  'model: sonnet',
  'effort: high',
  '---',
  '',
  '# Cricket — High Effort',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/cricket.md`.',
  '',
  'Judge and report from the supplied context.',
  '',
].join('\n');

const VOTER_PROMPT = 'You are a voter. You have no tools —\njudge only from the supplied evidence.';

/** A zero-tool role whose Claude body names its template's System prompt block, turn-bounded. */
const VOTER_UNREAD: RoleDeclaration = {
  kind: 'role',
  name: 'voter',
  description: 'Voter judges one candidate.',
  platforms: ['cursor', 'claude'],
  claude: { tools: 'none', maxTurns: 4, body: 'system-prompt' },
};

/** The same role with the block the reader carries from its template. */
const VOTER: RoleDeclaration = { ...VOTER_UNREAD, systemPrompt: VOTER_PROMPT };

function textsOf(declarations: readonly (RoleDeclaration | FanOutDeclaration)[]) {
  const rendered = renderSubagentAdapters(declarations);
  expect(rendered.ok).toBe(true);
  return new Map(rendered.ok ? rendered.value.map((entry) => [entry.path, entry.text]) : []);
}

describe('renderSubagentAdapters', () => {
  it('renders a standard role on the four surfaces from the defaults, an apostrophe putting the description in double quotes as the formatter keeps it', () => {
    const texts = textsOf([ALPHA]);
    expect([...texts.keys()]).toStrictEqual([
      '.cursor/agents/alpha.md',
      '.claude/agents/alpha.md',
      '.codex/agents/alpha.toml',
      '.gemini/agents/alpha.md',
    ]);
    expect(texts.get('.gemini/agents/alpha.md')).toBe(GEMINI_ALPHA);
    expect(texts.get('.cursor/agents/alpha.md')).toBe(CURSOR_ALPHA);
    expect(texts.get('.claude/agents/alpha.md')).toBe(CLAUDE_ALPHA);
    expect(texts.get('.codex/agents/alpha.toml')).toBe(CODEX_ALPHA);
  });

  it('renders a role with its deviations: inherited tools omitted, a colour before the permission mode, a Codex model, a pointer tail and a note in place of the closing', () => {
    const texts = textsOf([PROSE]);
    expect([...texts.keys()]).toStrictEqual([
      '.cursor/agents/prose.md',
      '.claude/agents/prose.md',
      '.codex/agents/prose.toml',
      '.gemini/agents/prose.md',
    ]);
    expect(texts.get('.claude/agents/prose.md')).toBe(CLAUDE_PROSE);
    expect(texts.get('.codex/agents/prose.toml')).toBe(CODEX_PROSE);
  });

  it('renders a fan-out as its variants, each exactly as declared: its own title, description per platform, fields in the measured order, no defaults filled', () => {
    const texts = textsOf([CRICKET]);
    expect([...texts.keys()]).toStrictEqual([
      '.cursor/agents/cricket-high.md',
      '.claude/agents/cricket-high.md',
    ]);
    expect(texts.get('.cursor/agents/cricket-high.md')).toBe(CURSOR_CRICKET_HIGH);
    expect(texts.get('.claude/agents/cricket-high.md')).toBe(CLAUDE_CRICKET_HIGH);
  });

  it('quotes a description as the formatter keeps it: single quotes with the apostrophe doubled when a double quote is present, else double quotes for an apostrophe, else single', () => {
    const line = (description: string): string | undefined =>
      textsOf([{ ...ALPHA, platforms: ['cursor'], description }])
        .get('.cursor/agents/alpha.md')
        ?.split('\n')[2];
    expect(line('Plain.')).toBe("description: 'Plain.'");
    expect(line('Says "hi".')).toBe(`description: 'Says "hi".'`);
    expect(line(`It's`)).toBe(`description: "It's"`);
    expect(line(`It's "so".`)).toBe(`description: 'It''s "so".'`);
    expect(line(`It's 'so' "x".`)).toBe(`description: 'It''s ''so'' "x".'`);
    expect(line(String.raw`C:\it's`)).toBe(String.raw`description: "C:\\it's"`);
  });

  it("renders a zero-tool role's Claude adapter with the null-value tools field, the turn bound, and the System prompt block inline in place of the pointer, no default filled; its Cursor adapter still points to the template", () => {
    const texts = textsOf([VOTER]);
    const claude = texts.get('.claude/agents/voter.md');
    expect(claude).toContain(`tools:\nmaxTurns: 4\n---\n\n${VOTER_PROMPT}\n`);
    expect(claude).toContain('templates/voter.md');
    const cursor = texts.get('.cursor/agents/voter.md');
    expect(cursor).toContain('templates/voter.md');
    expect(cursor).not.toContain(VOTER_PROMPT);
  });

  it('refuses a Claude body naming the System prompt block when the declaration carries no System prompt text', () => {
    expect(unwrapErr(renderSubagentAdapters([VOTER_UNREAD]))).toMatch(
      /^\.claude\/agents\/voter\.md: /u,
    );
  });

  it('renders a Codex description on the Codex adapter and nowhere else', () => {
    const texts = textsOf([{ ...ALPHA, codex: { description: 'Alpha on Codex.' } }]);
    const codex = texts.get('.codex/agents/alpha.toml');
    expect(codex).toContain('Alpha on Codex.');
    expect(codex).not.toContain(ALPHA.description);
    expect(texts.get('.cursor/agents/alpha.md')).toContain(ALPHA.description);
    const unsafe: RoleDeclaration = { ...ALPHA, codex: { description: 'Says "hi".' } };
    expect(unwrapErr(renderSubagentAdapters([unsafe]))).toMatch(/^\.codex\/agents\/alpha\.toml: /u);
  });

  it('renders a Gemini description on the Gemini adapter and nowhere else', () => {
    const texts = textsOf([{ ...ALPHA, gemini: { description: 'Alpha on Gemini.' } }]);
    const gemini = texts.get('.gemini/agents/alpha.md');
    expect(gemini).toContain('Alpha on Gemini.');
    expect(gemini).not.toContain(ALPHA.description);
    for (const path of [
      '.cursor/agents/alpha.md',
      '.claude/agents/alpha.md',
      '.codex/agents/alpha.toml',
    ]) {
      expect(texts.get(path)).toContain(ALPHA.description);
    }
  });

  it('renders a System prompt body with a declared tool list exactly as declared: its tools, its deny list and its turn bound, no permission mode filled', () => {
    const mapper: RoleDeclaration = {
      kind: 'role',
      name: 'mapper',
      description: 'Mapper reads one window.',
      platforms: ['claude'],
      claude: {
        tools: 'Read',
        disallowedTools: 'Bash, Write, Edit',
        maxTurns: 16,
        body: 'system-prompt',
      },
      systemPrompt: 'Read is your only tool.',
    };
    expect(textsOf([mapper]).get('.claude/agents/mapper.md')).toContain(
      'tools: Read\ndisallowedTools: Bash, Write, Edit\nmaxTurns: 16\n---',
    );
  });

  it('a variant inheriting tools carries no tools line', () => {
    const inheriting: FanOutDeclaration = {
      ...CRICKET,
      variants: [{ ...CRICKET.variants[0], claude: { tools: 'inherit', color: 'green' } }],
    };
    expect(textsOf([inheriting]).get('.claude/agents/cricket-high.md')).toContain(
      "description: 'Fast high-effort check.'\ncolor: green\n---",
    );
  });

  it("refuses a pointer tail carrying a backtick, which the reader takes for the path's delimiter, before any projection returns", () => {
    const ticked: RoleDeclaration = { ...ALPHA, claude: { pointerTail: ' see `x`.' } };
    expect(renderSubagentAdapters([ticked])).toStrictEqual({
      ok: false,
      error:
        ".claude/agents/alpha.md: the pointer tail carries a backtick, which the reader takes for the path's delimiter; refusing to render it",
    });
  });

  it('refuses a Codex instructions block a TOML multi-line basic string cannot carry verbatim: a triple quote or a backslash in the note', () => {
    const tripled: RoleDeclaration = { ...ALPHA, codex: { note: 'Ends with """ here.' } };
    expect(renderSubagentAdapters([tripled])).toStrictEqual({
      ok: false,
      error:
        '.codex/agents/alpha.toml: the instructions prose carries a backslash, a triple quote or a control character the TOML block cannot carry verbatim; refusing to render it',
    });
    const slashed: RoleDeclaration = { ...ALPHA, codex: { pointerTail: String.raw` \ then.` } };
    expect(renderSubagentAdapters([slashed]).ok).toBe(false);
  });

  it('serialises every Claude field value as a YAML scalar: plain where YAML reads it plain, else quoted by the measured rule (a comment marker, a mapping separator, a leading indicator)', () => {
    const fields = (claude: RoleDeclaration['claude']): string | undefined =>
      textsOf([{ ...ALPHA, platforms: ['claude'], claude }])
        .get('.claude/agents/alpha.md')
        ?.split('\n---\n')[0];
    expect(fields({ tools: 'foo # bar', color: 'a: b', model: '- x', effort: 'high' })).toBe(
      [
        '---',
        'name: alpha',
        'description: "Alpha reviews a: it\'s thorough."',
        "tools: 'foo # bar'",
        'disallowedTools: Write, Edit',
        "color: 'a: b'",
        'permissionMode: plan',
        "model: '- x'",
        'effort: high',
      ].join('\n'),
    );
  });

  it('refuses a name two declarations render (a role and a fan-out variant), so --fix never writes one path twice', () => {
    const clash: RoleDeclaration = { ...ALPHA, name: 'cricket-high' };
    expect(renderSubagentAdapters([CRICKET, clash])).toStrictEqual({
      ok: false,
      error:
        'cricket-high: rendered by more than one declaration (a role and a fan-out variant, or two fan-outs); refusing to render the sub-agent adapters',
    });
  });

  it("renders the declared Gemini fields in the reference's order (kind, tools as a block list, model, temperature, max_turns, timeout_mins), a role without a tools list filling the read-only default, and no Gemini adapter for a role whose platforms leave it out", () => {
    const declared: RoleDeclaration = {
      ...ALPHA,
      description: 'Alpha reviews a.',
      gemini: {
        kind: 'local',
        tools: ['read_file', 'grep_search'],
        model: 'gemini-3-flash-preview',
        temperature: 0.2,
        max_turns: 10,
        timeout_mins: 5,
      },
    };
    expect(textsOf([declared]).get('.gemini/agents/alpha.md')?.split('\n---\n')[0]).toBe(
      [
        '---',
        'name: alpha',
        "description: 'Alpha reviews a.'",
        'kind: local',
        'tools:',
        '  - read_file',
        '  - grep_search',
        'model: gemini-3-flash-preview',
        'temperature: 0.2',
        'max_turns: 10',
        'timeout_mins: 5',
      ].join('\n'),
    );
    // A wildcard or a model YAML would not read plain goes through the scalar rule.
    const wild: RoleDeclaration = {
      ...ALPHA,
      description: 'Alpha.',
      gemini: { tools: ['*', 'mcp_*'], model: 'a: b' },
    };
    expect(textsOf([wild]).get('.gemini/agents/alpha.md')).toContain(
      "tools:\n  - '*'\n  - mcp_*\nmodel: 'a: b'\n---",
    );
    const without: RoleDeclaration = { ...ALPHA, platforms: ['cursor', 'claude', 'codex'] };
    expect([...textsOf([without]).keys()]).toStrictEqual([
      '.cursor/agents/alpha.md',
      '.claude/agents/alpha.md',
      '.codex/agents/alpha.toml',
    ]);
  });

  it("refuses a Gemini adapter whose declared tools are the empty list, naming why: this estate's adapter body is the pointer to the template, which a no-tools agent cannot read", () => {
    const noTools: RoleDeclaration = { ...ALPHA, gemini: { tools: [] } };
    expect(renderSubagentAdapters([noTools])).toStrictEqual({
      ok: false,
      error:
        ".gemini/agents/alpha.md: the declaration's Gemini tools are the empty list, and this estate's adapter body is the pointer to the template, which a no-tools agent cannot read; leave gemini out of the role's platforms, or wait for the inlined-body form; refusing to render it",
    });
  });

  it('renders declarations in name order whatever order they arrive in', () => {
    const texts = textsOf([PROSE, ALPHA]);
    expect([...texts.keys()][0]).toBe('.cursor/agents/alpha.md');
  });

  it('refuses a Codex description a TOML basic string cannot carry verbatim, naming the adapter, and renders nothing', () => {
    const quoted: RoleDeclaration = { ...ALPHA, description: 'Alpha says "hi".' };
    expect(renderSubagentAdapters([quoted])).toStrictEqual({
      ok: false,
      error:
        '.codex/agents/alpha.toml: the description carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it',
    });
    const escaped: RoleDeclaration = { ...ALPHA, description: String.raw`Alpha \ slash.` };
    expect(renderSubagentAdapters([escaped]).ok).toBe(false);
  });
});
