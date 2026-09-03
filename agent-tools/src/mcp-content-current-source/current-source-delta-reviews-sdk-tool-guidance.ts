/**
 * Reviewed post-baseline semantic deltas — the stated-statements refactor of
 * get-prior-knowledge-graph and the tool-guidance/ontology sources it
 * rewrote (sharded from current-source-delta-reviews-sdk.ts at the
 * max-lines gate).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries.
 */
import { reviewed, type CurrentSourceDeltaReview } from './current-source-delta-review-helpers.js';

export const SDK_TOOL_GUIDANCE_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // The stated-statements refactor: get-prior-knowledge-graph now serves
  // each anchor unit's stated prior-knowledge statements, not the
  // thread-adjacency subgraph; the depth input (C249) retired via lineage.
  // The progression guidance, workflow, and ontology pointers rewrote with
  // it (C020, C045, C290; C023's tools arrays are byte-identical).
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts': reviewed(
    '090df9fe8ec815cd041dcb2ca7466d727c2de7cae9e9b655add31edc0c33e18a',
    ['C246', 'C247', 'C248', 'C250', 'C251'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts': reviewed(
    '1b2371af946d0dee9889b72837099393af9ba60b3ce78977445cf119ec414fbc',
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
    '28b140a78cc09e38872204f7f5a60894e7b20ffa1a3c3cb6403a19c240c320e5',
    ['C040', 'C041', 'C042', 'C043', 'C044', 'C045', 'C046', 'C047'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts': reviewed(
    '126fddd476820e5a45e58c44529b6893fabbdb34608a8cebe41c4b0c1a0a9f23',
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
