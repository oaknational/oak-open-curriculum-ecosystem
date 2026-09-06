/**
 * Reviewed post-baseline semantic deltas — Curriculum-SDK guidance resources
 * (the curated guidance bodies under `src/mcp/guidance-resources/`).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 * Split from `current-source-delta-reviews-sdk.ts` when the MCP-366 entries
 * took that map over the file-size gate.
 */
import {
  excluded,
  reviewed,
  type CurrentSourceDeltaReview,
  TYPE_ONLY,
} from './current-source-delta-review-helpers.js';

export const SDK_GUIDANCE_RESOURCES_DELTA_REVIEWS: Readonly<
  Record<string, CurrentSourceDeltaReview>
> = {
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts': reviewed(
    'f719c1a74b527b70b4954b8224aec1d38ebd343e65910284aa2d30657be1fd86',
    ['A007', 'C183', 'C187', 'C188', 'C202', 'C205', 'C206', 'C207', 'C208', 'C209', 'C334'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/agent-guidance-resources.ts':
    reviewed('b72948f5ade5d279b502b43ae5970439985c3d69fcfdab763f865c4bb6156f3a', ['A009']),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts': reviewed(
    'd49dc9764828029247ba20261bce0c5c3f39b6e552ebe632458fe0fd3f979e16',
    [
      'A008',
      'C184',
      'C188',
      'C192',
      'C195',
      'C196',
      'C203',
      'C204',
      'C205',
      'C206',
      'C208',
      'C335',
    ],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts': reviewed(
    'cee1117cddb526cb4d14a16cd62b34e100cc079c1d174ab1464ab75157bfc571',
    [
      'A006',
      'C182',
      'C192',
      'C193',
      'C194',
      'C201',
      'C205',
      'C206',
      'C207',
      'C208',
      'C209',
      'C333',
    ],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts': reviewed(
    'b41a89cbd25a0a37ea9dd4eff106e940cc6d6c2cb9a8ec737fcbccaa8c29ca35',
    ['A004', 'C180', 'C189', 'C190', 'C199', 'C205', 'C331'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts': reviewed(
    'ebf6b9948792b632393cf950cab97fddd582652fcfa4f95c7ba905d0ec6d6717',
    ['A003', 'C178', 'C185', 'C186', 'C197', 'C205', 'C329'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/guidance-resource-types.ts':
    excluded('76cf0bd8b14bad736906a9874e1f3211993d5759d658d0eb6bf144e026cd1723', TYPE_ONLY),
  'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts': reviewed(
    'f9c4b656d4870ee1c6aa7a0a69ed2c59e942f3791052a374122e7b1b8d6f9c8c',
    ['A005', 'C181', 'C191', 'C192', 'C200', 'C205', 'C332'],
  ),
};
