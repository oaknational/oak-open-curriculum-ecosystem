import { describe, expect, it } from 'vitest';

import { findAddedScopedBlock } from '../../src/hook-policy/matchers.js';
import type { ScopedContentBlockGroup } from '../../src/hook-policy/types.js';

/**
 * Indefinite-deferral trip-list: deferral-to-nowhere vocabulary on doctrine
 * and operational-memory surfaces (owner-directed 2026-06-10).
 *
 * The cure is named at `.agent/rules/no-hedging-vocabulary.md`
 * §"Indefinite-Deferral Vocabulary": work is either a live deliverable with
 * named dependencies and an owner-agreed gate, or it is removed by owner
 * decision — there is no unagreed holding state.
 *
 * The group ships as `kind: regex` with word-boundary patterns — NOT literal
 * substrings — because live identity tables carry agent display names that
 * CONTAIN family members ("Sparking Melting Magma" contains a parking
 * substring); literal matching would block every edit of those tables. The
 * group deliberately does NOT set `excludes_inline_code`: a backticked family
 * member on a data-shaped line (a plan deliverables-table row) would
 * otherwise dodge the block. Fenced code blocks remain skipped by the
 * scanner's fence handling. This test file exercises the canonical group
 * shape against findAddedScopedBlock — the helper the hook script wraps —
 * mirroring the sibling menu-framing regression test.
 */

const canonicalPatterns = [
  String.raw`\bparked\b`,
  String.raw`\bparking\b`,
  String.raw`\bpark (?:it|this|that|for now)\b`,
  String.raw`\bshelv(?:e|ed|ing)\b`,
  String.raw`\bmothball\w*\b`,
  String.raw`\bback[- ]?burner\w*\b`,
  String.raw`\bon hold\b`,
  String.raw`\bput a pin in\b`,
  String.raw`\bicebox\w*\b`,
  String.raw`\binto the long grass\b`,
] as const;

const group: ScopedContentBlockGroup = {
  concept: 'indefinite-deferral',
  kind: 'regex',
  patterns: canonicalPatterns,
  include_paths: [
    '.agent/practice-core/',
    '.agent/plans/',
    '.agent/reports/',
    '.agent/memory/operational/',
    'docs/architecture/',
    'docs/governance/',
    '**/*.plan.md',
  ],
  exclude_paths: [
    'principles.md',
    'distilled.md',
    'PDR-043',
    'PDR-044',
    'PDR-047',
    'no-hedging-vocabulary.md',
    'archive/',
    'fixtures/',
    '/tests/',
    '.test.ts',
  ],
  citation:
    'no-hedging-vocabulary.md §Indefinite-deferral vocabulary; principles.md §Strict and Complete',
  reappraisal:
    'Work is either a live deliverable with named dependencies and an owner-agreed gate, or it is removed by owner decision — there is no indefinite holding state. Name the gate and the decision, or delete the item.',
};

const planPath = '/repo/.agent/plans/agent-tooling/current/example.plan.md';

describe('findAddedScopedBlock — indefinite-deferral trip-list', () => {
  it('fires when a deferral word is added to a plan file', () => {
    const result = findAddedScopedBlock(
      'This work item is parked.\nThe rest proceeds.',
      'The rest proceeds.',
      planPath,
      [group],
    );
    expect(result?.group).toBe(group);
    expect(result?.matchedText.toLowerCase()).toBe('parked');
  });

  it('fires on longer deferral phrasings via unanchored substring search ("park it for now")', () => {
    // The regex is scanned with exec() over each line — a match anywhere in
    // the line fires, so the "park it" prefix inside "park it for now" trips
    // without the pattern needing to cover the whole phrase.
    const result = findAddedScopedBlock(
      'We will park it for now and revisit later.',
      'We will decide at the gate.',
      planPath,
      [group],
    );
    expect(result?.group).toBe(group);
    expect(result?.matchedText.toLowerCase()).toBe('park it');
  });

  it('fires on a backticked family member in a data-shaped table row (no inline-code exclusion)', () => {
    const result = findAddedScopedBlock(
      '| item | `parked` |\n| --- | --- |',
      '| item | live |\n| --- | --- |',
      planPath,
      [group],
    );
    expect(result?.group).toBe(group);
    expect(result?.matchedText.toLowerCase()).toBe('parked');
  });

  it('does not fire on agent display names containing a family substring ("Sparking")', () => {
    expect(
      findAddedScopedBlock(
        '| `Sparking Melting Magma` | `claude` | role | 2026-05-22 |',
        'Old identity table.',
        '/repo/.agent/memory/operational/threads/example.next-session.md',
        [group],
      ),
    ).toBeNull();
  });

  it('fires on operational-memory surfaces (scope is wider than the literal trip-list)', () => {
    const result = findAddedScopedBlock(
      'The topology question is on hold.',
      'The topology question is held by owner decision (2026-05-09).',
      '/repo/.agent/memory/operational/repo-continuity.md',
      [group],
    );
    expect(result?.group).toBe(group);
    expect(result?.matchedText.toLowerCase()).toBe('on hold');
  });

  it('does not fire when the vocabulary already existed in priorContent (added-only semantics)', () => {
    expect(
      findAddedScopedBlock(
        'The lane was parked on the trigger.\nNew unrelated sentence.',
        'The lane was parked on the trigger.',
        planPath,
        [group],
      ),
    ).toBeNull();
  });

  it('does not fire inside fenced code blocks', () => {
    expect(
      findAddedScopedBlock(
        '```text\nparked\n```\nLive prose without the vocabulary.',
        'Old text.',
        planPath,
        [group],
      ),
    ).toBeNull();
  });

  it('does not fire on the cataloguing rule file (out of include scope; the exclude entry is prophylactic)', () => {
    // `.agent/rules/` matches no include path, so this is protected by the
    // include gate; the canonical `no-hedging-vocabulary.md` exclude entry
    // guards only against a future include-widening, mirroring the
    // expediency group's principles.md/distilled.md convention.
    expect(
      findAddedScopedBlock(
        'The family includes parked and siblings.',
        'Old text.',
        '/repo/.agent/rules/no-hedging-vocabulary.md',
        [group],
      ),
    ).toBeNull();
  });

  it('exclude wins over a matching include (archive/ under an included plan scope)', () => {
    // This path IS in scope twice over (`.agent/plans/` substring and the
    // `**/*.plan.md` suffix), so the null verdict genuinely exercises the
    // `archive/` exclusion taking precedence.
    expect(
      findAddedScopedBlock(
        'The lane was parked on the trigger (historical record).',
        'Old archived text.',
        '/repo/.agent/plans/agent-tooling/archive/old.plan.md',
        [group],
      ),
    ).toBeNull();
  });

  it('does not fire outside the include scope', () => {
    expect(
      findAddedScopedBlock('// parked TODO marker', 'Old code.', '/repo/src/index.ts', [group]),
    ).toBeNull();
  });
});
