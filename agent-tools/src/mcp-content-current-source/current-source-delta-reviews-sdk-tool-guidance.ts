/**
 * Reviewed post-baseline semantic deltas — Curriculum-SDK tool guidance and
 * ontology data (`tool-guidance-data.ts`, `tool-guidance-workflows.ts`,
 * `ontology-data.ts`).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries. Split from
 * `current-source-delta-reviews-sdk.ts` when these entries took that map
 * over the file-size gate.
 */
import { reviewed, type CurrentSourceDeltaReview } from './current-source-delta-review-helpers.js';

export const SDK_TOOL_GUIDANCE_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // Thread sequences in curriculum order (2026-09-03): the progression
  // category's whenToUse (C020), the track-progression workflow (C045),
  // and the ontology's thread characteristics (C292) state per-subject runs
  // in Oak's curriculum order; every other row in these files is unchanged.
  'packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts': reviewed(
    'f46fdf840fcd355ed924e8aec8e601183aaee101470a5067c9786785b196ae63',
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
    'd385d13f89281ed2f4e3b1c7e4ca93614dff2c7ff063c0ae8e078cdb87098224',
    ['C040', 'C041', 'C042', 'C043', 'C044', 'C045', 'C046', 'C047'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts': reviewed(
    '4abc99f16184a2e41a386fbb49ccc8e87c3a08764385e8e36c9338c19795253f',
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
