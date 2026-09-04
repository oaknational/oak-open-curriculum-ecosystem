/**
 * Explicit content-revision verdicts for items whose anchors are overridden
 * in place; relocated items derive their revision from lineage instead.
 */
import { CURRENT_AGGREGATED_ITEM_REVISION_OVERRIDES } from './current-aggregated-item-revision-overrides.js';
import { CURRENT_GENERATED_DESCRIPTION_REVISION_OVERRIDES } from './current-generated-description-anchor-overrides.js';
import { CURRENT_GENERATED_ITEM_REVISION_OVERRIDES } from './current-generated-item-anchor-overrides.js';
import { CURRENT_SPEC_REFRESH_ITEM_REVISION_OVERRIDES } from './current-spec-refresh-item-anchor-overrides.js';

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
  // get-prior-knowledge-graph now serves stated prior-knowledge statements,
  // not the thread-adjacency subgraph; the progression guidance rewritten.
  C020: 'modified',
  // The six tools arrays themselves are byte-identical; only the baseline
  // anchor spanning the surrounding toolCategories literal broke.
  C023: 'unchanged',
  // trackProgression step 3 rewritten for the stated-statements contract.
  C045: 'modified',
  // relatedResources prior-knowledge pointer rewritten likewise.
  C290: 'modified',
  // Server-instructions sequencing sentence rewritten likewise.
  C054: 'modified',
  // Cross-tool pointers (thread-progressions, search) rewritten likewise.
  C253: 'modified',
} as const;
