/**
 * Behaviour tests for the bounded headline view (C).
 *
 * `evidenceForMoveHeadlines` projects each member to its headline shape while
 * preserving the rest of the envelope — proven against the full `evidenceForMove`
 * result, never asserted in isolation. Types are proven by `type-check`, not here
 * (testing-strategy.md §"Do not test types").
 */

import { describe, expect, it } from 'vitest';

import { evidenceForMove } from './eef-evidence.js';
import { evidenceForMoveHeadlines } from './eef-headline-view.js';

describe('evidenceForMoveHeadlines — bounded headline projection (C)', () => {
  it('projects members to the headline shape, dropping the deep evidence fields', () => {
    const env = evidenceForMoveHeadlines({ phase: 'primary' });
    expect(env.members.length).toBeGreaterThan(0);
    for (const member of env.members) {
      // All six headline (Pick) fields survive the projection.
      expect(typeof member.id).toBe('string');
      expect(typeof member.name).toBe('string');
      expect(typeof member.slug).toBe('string');
      expect(typeof member.eef_url).toBe('string');
      expect(member.headline).toBeDefined();
      expect(member.tags.length).toBeGreaterThan(0);
      // Deep evidence fields are dropped — the agent drills via inspect-strand.
      expect('key_findings' in member).toBe(false);
      expect('effectiveness' in member).toBe(false);
      expect('school_context_relevance' in member).toBe(false);
    }
  });

  it('preserves answerType, edges, frontier, and provenance — only the member depth differs', () => {
    const full = evidenceForMove({ priority: 'closing_disadvantage_gap' });
    const headline = evidenceForMoveHeadlines({ priority: 'closing_disadvantage_gap' });
    expect(headline.answerType).toBe(full.answerType);
    expect(headline.edges).toEqual(full.edges);
    expect(headline.frontier).toEqual(full.frontier);
    expect(headline.provenance).toEqual(full.provenance);
    expect(headline.members.map((member) => member.id)).toEqual(
      full.members.map((member) => member.id),
    );
  });
});
