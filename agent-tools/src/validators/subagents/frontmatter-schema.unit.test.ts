import { describe, expect, it } from 'vitest';

import { FRONTMATTER_SOURCES, validateFrontmatter } from './frontmatter-schema.js';

describe('validateFrontmatter — Claude wrappers', () => {
  const validClaude = {
    name: 'assumptions-expert',
    description: 'Meta-level plan specialist.',
    tools: 'Read, Grep, Glob',
    disallowedTools: 'Write, Edit',
    model: 'opus',
    color: 'orange',
    permissionMode: 'plan',
  };

  it('passes a valid Claude wrapper frontmatter', () => {
    expect(validateFrontmatter('claude', '.claude/agents/x.md', validClaude)).toStrictEqual([]);
  });

  it('rejects an invalid colour (amber)', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      color: 'amber',
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.join('\n')).toContain('color');
  });

  it('rejects an unknown frontmatter field (closed schema catches typos)', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      bogusField: true,
    });
    expect(issues.join('\n')).toContain('bogusField');
  });

  it('rejects an invalid model value', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      model: 'gpt-5',
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it('rejects an invalid permissionMode value', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      permissionMode: 'yolo',
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it('passes when model is omitted (inherit policy — invoker controls)', () => {
    const noModel = {
      name: 'assumptions-expert',
      description: 'Meta-level plan specialist.',
      tools: 'Read, Grep, Glob',
      disallowedTools: 'Write, Edit',
      color: 'orange',
      permissionMode: 'plan',
    };
    expect(validateFrontmatter('claude', '.claude/agents/x.md', noModel)).toStrictEqual([]);
  });

  it('rejects a wrapper missing the required name field', () => {
    const noName = { description: 'Meta-level plan specialist.', model: 'opus' };
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', noName);
    expect(issues.join('\n')).toContain('name');
  });

  it('accepts the current optional fields the old template omitted', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      skills: ['code-review'],
      isolation: 'worktree',
      effort: 'high',
      memory: 'project',
      background: true,
      maxTurns: 12,
    });
    expect(issues).toStrictEqual([]);
  });

  it('accepts a full Claude model id', () => {
    expect(
      validateFrontmatter('claude', '.claude/agents/x.md', {
        ...validClaude,
        model: 'claude-opus-4-8',
      }),
    ).toStrictEqual([]);
  });

  it('accepts a null tools value (the probe-verified zero-tools shape)', () => {
    expect(
      validateFrontmatter('claude', '.claude/agents/x.md', {
        name: 'corpus-voter',
        description: 'Single-turn no-tools adversary voter.',
        tools: null,
        maxTurns: 4,
      }),
    ).toStrictEqual([]);
  });

  it('rejects an empty tools array (it falls back to inherit-all, not zero tools)', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      tools: [],
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.join('\n')).toContain('tools');
  });

  it('rejects an empty disallowedTools array (a meaningless deny list)', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      disallowedTools: [],
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.join('\n')).toContain('disallowedTools');
  });

  it('rejects a null disallowedTools value (null is a tools-only spelling)', () => {
    const issues = validateFrontmatter('claude', '.claude/agents/x.md', {
      ...validClaude,
      disallowedTools: null,
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.join('\n')).toContain('disallowedTools');
  });
});

describe('validateFrontmatter — Cursor wrappers', () => {
  const validCursor = {
    name: 'assumptions-expert',
    description: 'Meta-level plan specialist.',
    readonly: true,
  };

  it('passes a valid Cursor wrapper with no model (inherit)', () => {
    expect(validateFrontmatter('cursor', '.cursor/agents/x.md', validCursor)).toStrictEqual([]);
  });

  it('rejects a tools field (Cursor subagents have no tools field)', () => {
    const issues = validateFrontmatter('cursor', '.cursor/agents/x.md', {
      ...validCursor,
      tools: 'Read, Grep',
    });
    expect(issues.join('\n')).toContain('tools');
  });

  it('rejects a color field (not a Cursor frontmatter field)', () => {
    const issues = validateFrontmatter('cursor', '.cursor/agents/x.md', {
      ...validCursor,
      color: 'orange',
    });
    expect(issues.join('\n')).toContain('color');
  });

  it('rejects model: auto (not a valid Cursor model value)', () => {
    const issues = validateFrontmatter('cursor', '.cursor/agents/x.md', {
      ...validCursor,
      model: 'auto',
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it('accepts an explicit specific model id and is_background', () => {
    expect(
      validateFrontmatter('cursor', '.cursor/agents/x.md', {
        ...validCursor,
        model: 'composer-2',
        is_background: true,
      }),
    ).toStrictEqual([]);
  });
});

describe('FRONTMATTER_SOURCES — reconcile anchor', () => {
  it('records an official-doc URL and a last-verified date for each platform', () => {
    for (const platform of ['claude', 'cursor'] as const) {
      expect(FRONTMATTER_SOURCES[platform].url).toMatch(/^https:\/\//);
      expect(FRONTMATTER_SOURCES[platform].lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
