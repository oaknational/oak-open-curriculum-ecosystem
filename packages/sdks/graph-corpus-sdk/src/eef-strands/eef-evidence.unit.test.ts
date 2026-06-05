/**
 * Unit tests for the EEF evidence binding operations over the REAL corpus.
 *
 * `inspectStrand` (by-id) and `evidenceForMove` (axis/explicit selectors) both
 * produce the uniform evidence envelope (members + member-induced edges +
 * binding-derived frontier + provenance). The two share a single subgraph core,
 * so `inspectStrand(id)` and `evidenceForMove({ strandIds: [id] })` are the same
 * envelope at cardinality one — proven below, not just asserted.
 *
 * Axis reachability is asserted by DERIVATION (the scr-present set computed from
 * the corpus at test time), never a hard-coded count.
 */

import { describe, expect, it } from 'vitest';

import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import { evidenceForMove, inspectStrand } from './eef-evidence.js';
import { strandAxisIndex } from './raw-domains.js';

const byLocale = (a: string, b: string): number => a.localeCompare(b);

describe('inspectStrand — single-strand evidence envelope', () => {
  it('returns the strand as the sole member, no member edges, and its related strands as frontier', () => {
    const envelope = inspectStrand('eef-tl-feedback');
    expect(envelope.members.map((strand) => strand.id)).toEqual(['eef-tl-feedback']);
    // Depth-0 single root: no edge has both endpoints in a one-member set.
    expect(envelope.edges).toEqual([]);
    expect([...envelope.frontier].sort(byLocale)).toEqual([
      'eef-tl-mastery-learning',
      'eef-tl-metacognition-and-self-regulation',
    ]);
  });

  it('returns a floor-only strand with its floor payload and an empty frontier', () => {
    const envelope = inspectStrand('eef-tl-repeating-a-year');
    expect(envelope.members.map((strand) => strand.id)).toEqual(['eef-tl-repeating-a-year']);
    expect(envelope.frontier).toEqual([]);
    const [strand] = envelope.members;
    // Floor fields present; richer fields honestly omitted (never fabricated).
    expect(strand?.headline.impact_months).toBe(-2);
    expect(strand !== undefined && 'school_context_relevance' in strand).toBe(false);
  });

  it('derives a non-empty frontier from the sole related strand (setting-and-streaming anchor)', () => {
    const envelope = inspectStrand('eef-tl-setting-and-streaming');
    expect(envelope.frontier).toEqual(['eef-tl-within-class-attainment-grouping']);
  });

  it('carries provenance once with source/licence/caveats, excluding data_version and last_updated', () => {
    const { provenance } = inspectStrand('eef-tl-feedback');
    expect(provenance.source.organisation).toBe('Education Endowment Foundation');
    expect(provenance.licence.url).toBeDefined();
    expect(provenance.caveats.length).toBeGreaterThan(0);
    expect('data_version' in provenance).toBe(false);
    expect('last_updated' in provenance).toBe(false);
  });
});

describe('evidenceForMove — axis-resolved evidence envelope', () => {
  it('resolves a phase selector to scr-bearing strands relevant to that phase', () => {
    const envelope = evidenceForMove({ phase: 'primary' });
    expect(envelope.members.length).toBeGreaterThan(0);
    // Every resolved member is in the axis index and carries the selected phase.
    for (const member of envelope.members) {
      expect(strandAxisIndex.get(member.id)?.phases.includes('primary')).toBe(true);
    }
  });

  it('matches strands on ALL provided axes (phase AND key stage)', () => {
    const envelope = evidenceForMove({ phase: 'secondary', keyStage: 'KS4' });
    expect(envelope.members.length).toBeGreaterThan(0);
    for (const member of envelope.members) {
      const axis = strandAxisIndex.get(member.id);
      expect(axis?.phases.includes('secondary')).toBe(true);
      expect(axis?.keyStages.includes('KS4')).toBe(true);
    }
  });

  it('reaches exactly the school_context_relevance-present strands by axis (derived, not hard-coded)', () => {
    const scrStrandIds = EEF_TOOLKIT_DATA.strands
      .filter((strand) => 'school_context_relevance' in strand)
      .map((strand) => strand.id)
      .sort(byLocale);
    const axisKeys = [...strandAxisIndex.keys()].sort(byLocale);
    expect(axisKeys).toEqual(scrStrandIds);
  });

  it('does not reach a floor-only strand by axis (only by id)', () => {
    expect(strandAxisIndex.has('eef-tl-repeating-a-year')).toBe(false);
  });

  it('returns the same envelope as inspectStrand at cardinality one', () => {
    expect(evidenceForMove({ strandIds: ['eef-tl-feedback'] })).toEqual(
      inspectStrand('eef-tl-feedback'),
    );
  });

  it('returns an empty envelope for an empty selector set (honest insufficiency)', () => {
    const envelope = evidenceForMove({});
    expect(envelope.members).toEqual([]);
    expect(envelope.edges).toEqual([]);
    expect(envelope.frontier).toEqual([]);
  });
});
