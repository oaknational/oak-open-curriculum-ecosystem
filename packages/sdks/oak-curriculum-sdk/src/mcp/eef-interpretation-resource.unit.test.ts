/**
 * Unit tests for the EEF interpretation resource (`eef://interpretation`).
 *
 * The resource is a static `text/markdown` reasoning scaffold (D3) that projects
 * the fixed EEF corpus into three labelled layers. Every expectation is DERIVED
 * from the corpus at test time (no hard-coded counts), so the projection can
 * never silently drift from the strands and attribution that actually exist.
 */

import { describe, expect, it } from 'vitest';

import {
  corpusCaveats,
  corpusMeta,
  EEF_STRAND_IDS,
  strandById,
} from '@oaknational/graph-corpus-sdk/eef-strands';

import {
  EEF_INTERPRETATION_RESOURCE,
  getEefInterpretationMarkdown,
} from './eef-interpretation-resource.js';

describe('EEF_INTERPRETATION_RESOURCE — resource identity', () => {
  it('declares the ratified static markdown resource', () => {
    expect(EEF_INTERPRETATION_RESOURCE.name).toBe('eef-interpretation');
    expect(EEF_INTERPRETATION_RESOURCE.uri).toBe('eef://interpretation');
    expect(EEF_INTERPRETATION_RESOURCE.mimeType).toBe('text/markdown');
    expect(EEF_INTERPRETATION_RESOURCE.title.length).toBeGreaterThan(0);
    expect(EEF_INTERPRETATION_RESOURCE.description.length).toBeGreaterThan(0);
  });
});

describe('getEefInterpretationMarkdown — corpus-cited layer', () => {
  const md = getEefInterpretationMarkdown();

  it('cites the full source attribution including the EEF url and named authors (nothing filtered)', () => {
    expect(md).toContain(corpusMeta.source.organisation);
    // Free access to the source is a trust requirement — the url is present.
    expect(md).toContain(corpusMeta.source.url);
    expect(md).toContain(corpusMeta.licence.attribution_note);
    // Authors are attribution data, not filtered out.
    for (const author of corpusMeta.source.original_authors) {
      expect(md).toContain(author);
    }
  });

  it('cites every corpus caveat verbatim', () => {
    for (const caveat of corpusCaveats) {
      expect(md).toContain(caveat);
    }
  });

  it('indexes every strand with id, name, headline summary, and EEF url', () => {
    for (const id of EEF_STRAND_IDS) {
      const strand = strandById(id);
      expect(md).toContain(strand.id);
      expect(md).toContain(strand.name);
      expect(md).toContain(strand.headline.headline_summary);
      // Each strand's own EEF page is reachable (trust requirement).
      expect(md).toContain(strand.eef_url);
    }
  });

  it('includes the tags of every tagged strand', () => {
    // Build the tag set first (data shaping), then assert unconditionally over it.
    const tags = EEF_STRAND_IDS.flatMap((id) => {
      const strand = strandById(id);
      return 'tags' in strand && strand.tags ? [...strand.tags] : [];
    });
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      expect(md).toContain(tag);
    }
  });
});

describe('getEefInterpretationMarkdown — agent-side and graph-structural layers', () => {
  const md = getEefInterpretationMarkdown();

  it('tags the agent-guidance layer distinctly as non-corpus material', () => {
    expect(md.toLowerCase()).toContain('not eef corpus evidence');
  });

  it('instructs honest reading of sparse curation (tag-absence is not inapplicability)', () => {
    expect(md.toLowerCase()).toContain('not evidence of inapplicability');
  });

  it('names the graph-structural envelope fields the agent navigates', () => {
    for (const field of ['members', 'edges', 'frontier', 'provenance', 'related_strand']) {
      expect(md).toContain(field);
    }
  });

  it('notes that MCP tool names may be prefixed (match by suffix)', () => {
    expect(md).toContain('match tools by their suffix');
  });
});
