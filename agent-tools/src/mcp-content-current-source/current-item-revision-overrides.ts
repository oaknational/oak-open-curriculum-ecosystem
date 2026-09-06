/**
 * Explicit content-revision verdicts for items whose anchors are overridden
 * in place; relocated items derive their revision from lineage instead.
 */
import { CURRENT_AGGREGATED_ITEM_REVISION_OVERRIDES } from './current-aggregated-item-revision-overrides.js';
import { CURRENT_GENERATED_DESCRIPTION_REVISION_OVERRIDES } from './current-generated-description-anchor-overrides.js';
import { CURRENT_GENERATED_ITEM_REVISION_OVERRIDES } from './current-generated-item-anchor-overrides.js';
import { CURRENT_SPEC_REFRESH_ITEM_REVISION_OVERRIDES } from './current-spec-refresh-item-anchor-overrides.js';
import { CURRENT_MISCONCEPTION_ORDER_ITEM_REVISION_OVERRIDES } from './current-misconception-order-item-anchor-overrides.js';
import { CURRENT_THREAD_PROGRESSIONS_ITEM_REVISION_OVERRIDES } from './current-thread-progressions-item-anchor-overrides.js';

export const CURRENT_ITEM_REVISION_OVERRIDES = {
  ...CURRENT_GENERATED_ITEM_REVISION_OVERRIDES,
  ...CURRENT_GENERATED_DESCRIPTION_REVISION_OVERRIDES,
  ...CURRENT_AGGREGATED_ITEM_REVISION_OVERRIDES,
  ...CURRENT_SPEC_REFRESH_ITEM_REVISION_OVERRIDES,
  C354: 'modified',
  C355: 'modified',
  C313: 'unchanged',
  // MCP-353: C337 and C413 retired with the deleted under-the-hood pointer
  // resource — their revision verdicts now derive from lineage.
  C690: 'unchanged',
  C479: 'modified',
  ...CURRENT_THREAD_PROGRESSIONS_ITEM_REVISION_OVERRIDES,
  ...CURRENT_MISCONCEPTION_ORDER_ITEM_REVISION_OVERRIDES,
} as const;
