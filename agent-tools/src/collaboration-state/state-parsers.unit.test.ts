import { describe, expect, it } from 'vitest';

import { parseClosedClaimsArchive, parseCollaborationRegistry } from './state-parsers.js';

describe('parseCollaborationRegistry', () => {
  it('rejects a non-JSON file (e.g. a markdown file mistakenly passed to --active) with an actionable boundary error naming --active', () => {
    // A markdown file begins with `---` (YAML frontmatter); JSON.parse reads `-`
    // as the start of a number and fails with the position-only V8 message
    // "No number after minus sign in JSON at position 1" — which gives the
    // caller no clue they passed the wrong file. The boundary must explain it.
    const markdown = '---\nfitness_line_target: 400\n---\n\n# Repo Continuity\n';

    expect(() => parseCollaborationRegistry(markdown)).toThrow(
      /active-claims registry[\s\S]*--active[\s\S]*not valid JSON/,
    );
  });

  it('parses a valid empty registry', () => {
    const registry = parseCollaborationRegistry(
      JSON.stringify({ schema_version: '1.3.0', commit_queue: [], claims: [] }),
    );

    expect(registry.claims).toEqual([]);
    expect(registry.commit_queue).toEqual([]);
  });
});

describe('parseClosedClaimsArchive', () => {
  it('rejects a non-JSON file with an actionable boundary error naming --closed', () => {
    expect(() => parseClosedClaimsArchive('not json at all')).toThrow(
      /closed-claims archive[\s\S]*--closed[\s\S]*not valid JSON/,
    );
  });
});
