import { describe, expect, it } from 'vitest';

import { CitationsSchema } from '../../citation-shape.js';
import { EEF_ATTRIBUTION } from '../../../source-attribution.js';
import type { EvidenceCorpusSpanConfig, ExploreSpanAttrs } from '../../telemetry.js';
import { runEefExploreTool } from './execution.js';

// Within the 180-day freshness window of the snapshot (meta.last_updated
// 2026-04-02), injected so the freshness gate never reads the system clock.
const FRESH_NOW = new Date('2026-05-01T00:00:00.000Z');
const STALE_NOW = new Date('2027-01-01T00:00:00.000Z');

function asArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

describe('runEefExploreTool (real EEF corpus)', () => {
  it('returns a structurally-cited evidence subgraph for a lesson context', () => {
    const result = runEefExploreTool(
      {
        subject: 'science',
        keyStage: 'KS2',
        topic: 'photosynthesis',
        focus: 'metacognition_and_self_regulation',
      },
      { now: FRESH_NOW },
    );

    expect(result.isError).not.toBe(true);
    const sc = result.structuredContent;
    expect(sc).toBeDefined();
    // Envelope provenance: attribution once per response, data version present.
    expect(sc).toMatchObject({
      status: 'ok',
      attribution: { source: EEF_ATTRIBUTION.source },
    });
    expect(typeof sc?.data_version).toBe('string');
    // Citations satisfy the structural discipline (non-empty tuple, each with
    // non-empty caveats + valid eef_url) — asserted via the real schema.
    expect(CitationsSchema.safeParse(sc?.citations).success).toBe(true);
    // The subgraph topology is the response.
    expect(asArray(sc?.nodes).length).toBeGreaterThan(0);
    expect(Array.isArray(sc?.edges)).toBe(true);
  });

  it('records an evidence_corpus.explore span with the seed context', () => {
    let captured: EvidenceCorpusSpanConfig<ExploreSpanAttrs> | undefined;
    const result = runEefExploreTool(
      { subject: 'maths', keyStage: 'EYFS', topic: 'counting' },
      {
        now: FRESH_NOW,
        recordSpan: (config) => {
          captured = config;
        },
      },
    );

    expect(result.isError).not.toBe(true);
    expect(captured).toMatchObject({
      name: 'evidence_corpus.explore',
      attrs: {
        phase: 'early_years',
        subject: 'maths',
        key_stage: 'EYFS',
      },
    });
    expect(typeof captured?.attrs.result_count).toBe('number');
    expect(typeof captured?.attrs.latency_ms).toBe('number');
    // No focus passed → the optional attr is absent, not null.
    expect(captured?.attrs.focus).toBeUndefined();
  });

  it('narrows to a relevant, tightly-projected subgraph for a focused context', () => {
    const result = runEefExploreTool(
      { subject: 'maths', keyStage: 'KS2', topic: 'fractions', focus: 'improving_maths' },
      { now: FRESH_NOW },
    );

    expect(result.isError).not.toBe(true);
    const nodes = asArray(result.structuredContent?.nodes);
    expect(nodes.length).toBeGreaterThan(0);

    // The emitted nodes are projected (tight): `eef_url` lives in the citation
    // envelope, and `definition_short` replaces the full definition.
    const [firstNode] = nodes;
    if (firstNode === null || typeof firstNode !== 'object') {
      throw new Error('expected at least one projected node object');
    }
    expect('eef_url' in firstNode).toBe(false);
    expect('definition_short' in firstNode).toBe(true);
    expect('effectiveness' in firstNode).toBe(false);
  });

  it('keeps the whole CallToolResult within the 10k-token output budget (worst case)', () => {
    // Worst case for response size: a context that matches no strand by
    // relevance, so selection falls back to the whole corpus (all 30 strands).
    // `teacher_retention` is a valid EEF priority that no strand carries, so it
    // forces the degenerate fallback — the largest response the tool can emit.
    const result = runEefExploreTool(
      {
        subject: 'general',
        keyStage: 'KS3',
        topic: 'whole curriculum',
        focus: 'teacher_retention',
      },
      { now: FRESH_NOW },
    );
    expect(result.isError).not.toBe(true);

    // Measure the ENTIRE serialized result (structuredContent + the content[]
    // JSON mirror + citations + edges + envelope) via the standard
    // ~4-characters-per-token proxy. Worked estimate at landing: the all-30
    // worst case, capped to 12 strands with key_findings dropped, measures
    // ~7,859 tokens — ~21% headroom under the 10k budget.
    const approxTokens = Math.ceil(JSON.stringify(result).length / 4);
    expect(approxTokens).toBeLessThan(10_000);
  });

  it('fails closed (tool error, no span) when the corpus is stale', () => {
    let captured: EvidenceCorpusSpanConfig<ExploreSpanAttrs> | undefined;
    const result = runEefExploreTool(
      { subject: 'science', keyStage: 'KS3', topic: 'forces' },
      {
        now: STALE_NOW,
        recordSpan: (config) => {
          captured = config;
        },
      },
    );

    expect(result.isError).toBe(true);
    expect(captured).toBeUndefined();
  });
});
