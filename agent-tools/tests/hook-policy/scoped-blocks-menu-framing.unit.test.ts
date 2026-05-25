import { describe, expect, it } from 'vitest';

import { findAddedScopedBlock } from '../../src/hook-policy/matchers.js';
import type { ScopedContentBlock } from '../../src/hook-policy/types.js';

/**
 * B1 enforcement: menu-framing trip-list for architectural decisions.
 *
 * The cure is named at `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`
 * §"Failure Mode 1: Elaboration Without Re-Asking" and §"Failure Mode 2: Carry-On vs Adopt".
 * Surfacing (a)/(b)/(c) as a peer-option menu "for owner verdict" presupposes that the
 * owner is the right resolver — that framing is itself the failure mode the rule names.
 *
 * The scoped-block trip-list operationalises the rule at the Edit/Write hook layer
 * per `.agent/hooks/policy.json` `preToolUseContent.scoped_blocks`. The three canonical
 * menu-frame phrases (`for owner verdict` / `decision` / `ratification`) each ship as a
 * separate literal scoped_block, citing the rule. ("for owner approval" was considered
 * and rejected at design time — too high a false-positive rate in legitimate governance
 * prose; see assumptions-expert finding 2026-05-25.) This test file exercises the
 * canonical block shape against findAddedScopedBlock — the helper that the hook script
 * wraps — so the substance of the cure has regression coverage.
 */

const sharedIncludePaths = [
  '.agent/practice-core/',
  '.agent/plans/',
  'docs/architecture/',
  'docs/governance/',
  '**/*.plan.md',
] as const;

const sharedExcludePaths = [
  'principles.md',
  'distilled.md',
  'PDR-043',
  'PDR-044',
  'PDR-047',
  'archive/',
  'fixtures/',
  '/tests/',
  '.test.ts',
  're-apply-first-question-at-elaboration-boundaries.md',
] as const;

const sharedCitation =
  're-apply-first-question-at-elaboration-boundaries.md; principles.md §Architectural Excellence Over Expediency';

function buildMenuFrameBlock(phrase: string): ScopedContentBlock {
  return {
    pattern: phrase,
    kind: 'literal',
    include_paths: sharedIncludePaths,
    exclude_paths: sharedExcludePaths,
    citation: sharedCitation,
  };
}

const menuFramePhrases = ['for owner verdict', 'for owner decision', 'for owner ratification'];

describe.each(menuFramePhrases)(
  'findAddedScopedBlock — menu-framing trip-list for %s (B1)',
  (phrase) => {
    const block = buildMenuFrameBlock(phrase);

    it('fires when an agent adds the menu-frame phrase to a plan file', () => {
      expect(
        findAddedScopedBlock(
          `Options: (a) refactor; (b) inline patch; (c) hybrid — ${phrase}.`,
          'Options under discussion.',
          '/repo/.agent/plans/agent-tooling/current/example.plan.md',
          [block],
        ),
      ).toStrictEqual(block);
    });

    it('fires when an agent adds the menu-frame phrase to a PDR draft', () => {
      expect(
        findAddedScopedBlock(
          `Verdict (c) plus partial (a) — ${phrase}.`,
          'Verdict pending.',
          '/repo/.agent/practice-core/decision-records/PDR-XXX-example.md',
          [block],
        ),
      ).toStrictEqual(block);
    });

    it('does not fire on the rule file itself (rule catalogues the phrase it forbids)', () => {
      expect(
        findAddedScopedBlock(
          `The failure-mode framing is "${phrase}" applied to (a)/(b)/(c) menus.`,
          'Old text.',
          '/repo/.agent/rules/re-apply-first-question-at-elaboration-boundaries.md',
          [block],
        ),
      ).toBeNull();
    });

    it('does not fire outside the architectural-doc include scope', () => {
      expect(
        findAddedScopedBlock(`Some code comment ${phrase}.`, 'Old code.', '/repo/src/index.ts', [
          block,
        ]),
      ).toBeNull();
    });

    it('does not fire when the phrase already existed in priorContent', () => {
      expect(
        findAddedScopedBlock(
          `Verdict (c) — ${phrase}.\nMore text added later.`,
          `Verdict (c) — ${phrase}.`,
          '/repo/.agent/plans/example.plan.md',
          [block],
        ),
      ).toBeNull();
    });
  },
);
