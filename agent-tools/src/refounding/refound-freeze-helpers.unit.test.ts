import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildDenominator,
  buildGitleaksDirArgs,
  findEscapingMatches,
  frozenRelPath,
  mapSourcesToFrozen,
  resolveCopySink,
  validateOutDirChoice,
} from './refound-freeze-helpers.js';

describe('frozenRelPath', () => {
  it('strips exactly one leading .agent/ segment', () => {
    expect(frozenRelPath('.agent/plans/x.md')).toBe('plans/x.md');
    expect(frozenRelPath('.agent/milestones/m.md')).toBe('milestones/m.md');
  });

  it('leaves paths outside .agent/ unchanged', () => {
    expect(frozenRelPath('docs/x.md')).toBe('docs/x.md');
  });
});

describe('mapSourcesToFrozen', () => {
  it('maps each source to its mirrored frozen path', () => {
    const result = mapSourcesToFrozen(['.agent/plans/x.md', '.agent/proposals/p.md']);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.get('.agent/plans/x.md')).toBe('plans/x.md');
      expect(result.value.get('.agent/proposals/p.md')).toBe('proposals/p.md');
    }
  });

  it('refuses when two sources collide onto one frozen path', () => {
    const result = mapSourcesToFrozen(['.agent/plans/x.md', 'plans/x.md']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('collide');
    }
  });
});

describe('buildDenominator', () => {
  const stat = (statPath: string, bytes: number, lines: number) => ({
    path: statPath,
    bytes,
    sha256: 'a'.repeat(64),
    lines,
    inventoryMode: 'lines' as const,
  });

  it('sums the totals and records the generating rule', () => {
    const denominator = buildDenominator({
      freezeRuleVersion: 1,
      ratifiedBy: 'g1.md',
      files: [stat('plans/b.md', 10, 2), stat('plans/a.md', 5, 1)],
    });
    expect(denominator.totals).toEqual({ files: 2, lines: 3, bytes: 15 });
    expect(denominator.generatedFrom).toEqual({ freezeRuleVersion: 1, ratifiedBy: 'g1.md' });
  });

  it('sorts by UTF-16 code units, where locale order disagrees', () => {
    // 'plans/B.md' precedes 'plans/a.md' by code units ('B' is 0x42, 'a' is
    // 0x61); localeCompare orders lowercase first. A localeCompare
    // regression flips this expectation.
    const denominator = buildDenominator({
      freezeRuleVersion: 1,
      ratifiedBy: 'g1.md',
      files: [stat('plans/a.md', 1, 1), stat('plans/B.md', 1, 1)],
    });
    expect(denominator.files.map((f) => f.path)).toEqual(['plans/B.md', 'plans/a.md']);
  });
});

describe('findEscapingMatches', () => {
  it('flags absolute matches and matches containing a .. segment', () => {
    expect(
      findEscapingMatches(['plans/a.md', '../escape/leak.md', '/etc/passwd', 'a/../b.md']),
    ).toEqual(['../escape/leak.md', '/etc/passwd', 'a/../b.md']);
  });

  it('passes ordinary repo-relative paths through untouched', () => {
    expect(findEscapingMatches(['plans/a.md', 'proposals/p.md'])).toEqual([]);
  });
});

describe('resolveCopySink', () => {
  // Production passes an already-resolved host-absolute frozen root; the
  // fixture derives the same host form so the sink and the containment check
  // agree on every platform.
  const frozenRoot = path.resolve('/repo/out/archive/frozen-v1');

  it('resolves an ordinary frozen path inside the tree', () => {
    const sink = resolveCopySink(frozenRoot, 'plans/a.md');
    expect(sink.ok).toBe(true);
    if (sink.ok) {
      expect(sink.value).toBe(path.join(frozenRoot, 'plans', 'a.md'));
    }
  });

  it('refuses a crafted traversal that escapes the frozen tree', () => {
    const sink = resolveCopySink(frozenRoot, '../../../../etc/passwd');
    expect(sink.ok).toBe(false);
    if (!sink.ok) {
      expect(sink.error.message).toContain('escapes the frozen tree');
    }
    expect(resolveCopySink(frozenRoot, '/etc/passwd').ok).toBe(false);
    expect(resolveCopySink(frozenRoot, '.').ok).toBe(false);
  });
});

describe('validateOutDirChoice', () => {
  it('refuses the repository root itself', () => {
    const verdict = validateOutDirChoice('/repo', '/repo');
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.error.message).toContain('repository root');
    }
  });

  it('refuses any path inside .git', () => {
    // The product joins `.git` with host separators; the fixtures derive the
    // same host form so the containment comparison holds on every platform.
    expect(validateOutDirChoice('/repo', path.join('/repo', '.git')).ok).toBe(false);
    const verdict = validateOutDirChoice('/repo', path.join('/repo', '.git', 'hooks'));
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.error.message).toContain('.git');
    }
  });

  it('accepts an ordinary in-repo artefact home', () => {
    expect(validateOutDirChoice('/repo', '/repo/.agent/plans-refounding').ok).toBe(true);
  });
});

describe('buildGitleaksDirArgs', () => {
  it('builds the empirically verified single-path dir invocation', () => {
    expect(buildGitleaksDirArgs('.agent/plans/a.md')).toEqual([
      'dir',
      '.agent/plans/a.md',
      '--config',
      '.gitleaks.toml',
      '--no-banner',
      '--redact=100',
      '--exit-code',
      '99',
      '--log-level',
      'error',
    ]);
  });
});
