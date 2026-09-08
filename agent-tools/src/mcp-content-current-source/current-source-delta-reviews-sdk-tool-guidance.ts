/**
 * Reviewed post-baseline semantic deltas — Curriculum-SDK tool guidance and
 * ontology data (`tool-guidance-data.ts`, `tool-guidance-workflows.ts`,
 * `ontology-data.ts`), including the stated-statements refactor of
 * get-prior-knowledge-graph and the sources it rewrote (MCP-671).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries. Split from
 * `current-source-delta-reviews-sdk.ts` when these entries took that map
 * over the file-size gate.
 */
import { reviewed, type CurrentSourceDeltaReview } from './current-source-delta-review-helpers.js';

export const SDK_TOOL_GUIDANCE_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // The stated-statements refactor: get-prior-knowledge-graph now serves
  // each anchor unit's stated prior-knowledge statements, not the
  // thread-adjacency subgraph; the depth input (C249) retired via lineage.
  // The progression guidance, workflow, and ontology pointers rewrote with
  // it (C020, C045, C290; C023's tools arrays are byte-identical).
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts': reviewed(
    '1924e8dee287092e097a13bf40ac46647f38ee69e8fd683c777c7e2a23854ba8',
    ['C246', 'C247', 'C248', 'C250', 'C251'],
  ),
  // Thread sequences in curriculum order (2026-09-03): the progression
  // category's whenToUse (C020), the track-progression workflow (C045),
  // and the ontology's thread characteristics (C292) state per-subject runs
  // in Oak's curriculum order; every other row in these files is unchanged.
  'packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts': reviewed(
    '3e375b40e0afcce67103094b24f0dbe17f4954781d1f7587b990aef37a7e4e1f',
    [
      'C011',
      'C012',
      'C013',
      'C014',
      'C015',
      'C016',
      'C017',
      'C018',
      'C019',
      'C020',
      'C021',
      'C022',
      'C023',
      'C024',
      'C025',
      'C026',
      'C027',
      'C028',
      'C029',
      'C030',
      'C031',
      'C032',
      'C033',
      'C034',
      'C035',
      'C036',
      'C037',
      'C038',
      'C039',
    ],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts': reviewed(
    '46c8064eaa522dd44bba9ce13d25360712e9819fbafe003fb49060bb5e9901bb',
    ['C040', 'C041', 'C042', 'C043', 'C044', 'C045', 'C046', 'C047'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts': reviewed(
    '6e9c01298eff9a631a086eb266d0588f3ff20da24d7a510047d4bb2189fa0983',
    [
      'C286',
      'C287',
      'C288',
      'C289',
      'C290',
      'C291',
      'C292',
      'C293',
      'C294',
      'C295',
      'C296',
      'C297',
      'C298',
      'C299',
      'C300',
      'C301',
      'C302',
      'C303',
      'C304',
    ],
  ),
};
