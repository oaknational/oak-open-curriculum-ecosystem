/**
 * Unit tests for large-payload scoping hints on the hand-authored aggregated
 * tool descriptions.
 *
 * browse-curriculum (unfiltered ~204 KB) and search at broad scope
 * (scope=sequences ~75 KB) overflowed a host's per-result token cap in the
 * 2026-06-23 local UAT with nothing in their descriptions telling the agent to
 * narrow first. These tests assert each carries a hint that names its real
 * narrowing, phrased consistently with the generated-tool note (WS1 cycle 1.1).
 * explore-topic and get-keyword-graph already self-describe their bounds, so a
 * regression guard checks explore keeps documenting its top-5 bound.
 */

import { describe, expect, it } from 'vitest';
import { BROWSE_TOOL_DEF } from './aggregated-browse/tool-definition.js';
import { EXPLORE_TOOL_DEF } from './aggregated-explore/tool-definition.js';
import { SEARCH_TOOL_DEF } from './aggregated-search/tool-definition.js';

const LARGE_PAYLOAD_MARKER = 'large payload at broad scope';

describe('aggregated tool large-payload scoping hints', () => {
  it('browse-curriculum names subject/keyStage narrowing for the unfiltered call', () => {
    expect(BROWSE_TOOL_DEF.description).toContain(LARGE_PAYLOAD_MARKER);
    expect(BROWSE_TOOL_DEF.description).toContain('`subject`');
    expect(BROWSE_TOOL_DEF.description).toContain('`keyStage`');
  });

  it('search names size/from paging for broad scopes', () => {
    expect(SEARCH_TOOL_DEF.description).toContain(LARGE_PAYLOAD_MARKER);
    expect(SEARCH_TOOL_DEF.description).toContain('`size`');
    expect(SEARCH_TOOL_DEF.description).toContain('`from`');
  });

  it('explore-topic keeps documenting its bounded top-5 result set', () => {
    expect(EXPLORE_TOOL_DEF.description).toContain('top 5');
  });
});
