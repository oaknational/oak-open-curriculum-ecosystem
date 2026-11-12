import { describe, expect, it } from 'vitest';

import { classifyChangedPaths, describeOffenders, isRecordsPath } from './change-class.js';

/**
 * The records class is the owner's 2026-09-03 ruling as a path predicate: a
 * pull request whose every changed path is documentation or Practice prose
 * merges at checks green. These pins fix which paths count, so the door's
 * most consequential input never drifts by a reader's judgement.
 */

describe('isRecordsPath', () => {
  it('accepts Markdown under the documentation and Practice roots and at the repository root', () => {
    for (const path of [
      '.agent/memory/active/napkin.md',
      '.agent/reports/agentic-engineering/2026-10-10-a-record.md',
      '.agent/practice-core/decision-records/PDR-140-review-response-pricing.md',
      '.agent/skills/coordination-fold/SKILL-CANONICAL.md',
      'docs/editorial/decision-records/007-naming.md',
      'linkedin/profile.md',
      'README.md',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
    ]) {
      expect(isRecordsPath(path), path).toBe(true);
    }
  });

  it('refuses anything that is not Markdown, whatever its directory', () => {
    for (const path of [
      '.claude/settings.json',
      '.agent/practice-core/schemas/operator-profile.schema.json',
      '.husky/pre-push',
      'agent-tools/src/merge-bot/merge.ts',
      'linkedin/src/model/parse.ts',
      'package.json',
      'docs/diagram.mdx',
    ]) {
      expect(isRecordsPath(path), path).toBe(false);
    }
  });

  it('refuses Markdown outside the records roots: workspaces ship it, content renders it', () => {
    for (const path of [
      'agent-tools/README.md',
      'agent-tools/docs/agent-identity.md',
      'jcdotnet/content/about.md',
      '.github/pull_request_template.md',
      'tooling/result/README.md',
    ]) {
      expect(isRecordsPath(path), path).toBe(false);
    }
  });

  it('keeps the root harness entry files and the generated rules index code-class', () => {
    for (const path of ['CLAUDE.md', 'AGENTS.md', 'GEMINI.md', 'skills.md', 'RULES_INDEX.md']) {
      expect(isRecordsPath(path), path).toBe(false);
    }
  });

  it('keeps generated platform adapters code-class, Markdown or not (the ratified path set)', () => {
    for (const path of [
      '.claude/skills/jc-wrap/SKILL.md',
      '.claude/agents/audience-reader.md',
      '.claude/rules/verify-dont-trust.md',
      '.codex/agents/editor.md',
      '.cursor/rules/verify-dont-trust.mdc',
      '.gemini/agents/editor.md',
      '.agents/skills/jc-wrap/SKILL.md',
    ]) {
      expect(isRecordsPath(path), path).toBe(false);
    }
  });

  it('refuses Markdown a hook, a schema or a test reads as an input, even under a records root', () => {
    for (const path of [
      '.agent/hooks/README.md',
      '.agent/scripts/README.md',
      '.agent/setup/notes.md',
      '.agent/skills/some-skill/fixtures/sample.md',
      '.agent/skills/some-skill/tests/case.md',
      '.claude/skills/x/src/template.md',
      'docs/__snapshots__/page.md',
    ]) {
      expect(isRecordsPath(path), path).toBe(false);
    }
  });

  it('refuses a path that escapes or hides a segment', () => {
    for (const path of ['../.agent/memory/napkin.md', '.agent//memory/napkin.md', './README.md']) {
      expect(isRecordsPath(path), path).toBe(false);
    }
  });
});

describe('classifyChangedPaths', () => {
  it('reads a fold of records as records-class and counts its paths', () => {
    expect(
      classifyChangedPaths([
        '.agent/memory/active/napkin.md',
        '.agent/memory/operational/repo-continuity.md',
        'linkedin/profile-replacement.md',
      ]),
    ).toStrictEqual({ kind: 'records', pathCount: 3 });
  });

  it('reads one code path among records as code-class and names only the code paths', () => {
    expect(
      classifyChangedPaths(['.agent/memory/active/napkin.md', '.claude/settings.json']),
    ).toStrictEqual({ kind: 'code', offenders: ['.claude/settings.json'] });
  });

  it('reads an empty change set as code-class: absence of evidence is never prose', () => {
    expect(classifyChangedPaths([])).toStrictEqual({ kind: 'code', offenders: [] });
  });
});

describe('describeOffenders', () => {
  it('names up to five paths and counts the rest', () => {
    const offenders = ['a.ts', 'b.ts', 'c.ts', 'd.ts', 'e.ts', 'f.ts', 'g.ts'];

    expect(describeOffenders(offenders)).toBe('a.ts, b.ts, c.ts, d.ts, e.ts and 2 more');
    expect(describeOffenders(offenders.slice(0, 5))).toBe('a.ts, b.ts, c.ts, d.ts, e.ts');
    expect(describeOffenders(offenders.slice(0, 2))).toBe('a.ts, b.ts');
  });
});
