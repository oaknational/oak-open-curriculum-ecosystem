/**
 * Reviewed post-baseline semantic deltas — retired landing-page sources and
 * the widget's governed sources.
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 *
 * The landing page itself was removed on 2026-08-20 (owner instruction:
 * `mcp.thenational.academy` is the MCP server and nothing else), so every
 * landing entry here is now a `DELETED_SOURCE` tombstone carrying its
 * baseline-content hash. The React-era component files that were ADDED after
 * the baseline carry no entry at all: added-then-deleted files leave the
 * baseline diff entirely, so a review key for one would be an orphan the
 * membership check rejects.
 */
import {
  DELETED_SOURCE,
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_LANDING_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/create-snippet.ts': excluded(
    '99d81650fd174e889196cc299b26425d57ea49bf66b5232c119aac67b052a043',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/index.ts': excluded(
    '5d95221119ef9b2601ae67767705d38a7c191730bc2d805ea9da9afd7a088e35',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/resolve-canonical-url.ts': excluded(
    'f7677fe63b8f9c48949e694a344be5fb7330c0a00e614093e7794c4edee66dbc',
    DELETED_SOURCE,
  ),
  // MCP-434: safe-area insets moved from inline padding to composed
  // custom properties; the governed text nodes (disclaimer, hidden h1,
  // banner) are unchanged — the cited items re-anchor as before.
  'apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx': reviewed(
    'e97d9235f16ef00617f41b112f7ebacada3c0220501bfa3bfd7a399c4d4405c0',
    ['C384', 'C385', 'C386', 'C387', 'C717'],
  ),
  // MCP-434: styling plumbing only — host inset numbers formatted as CSS
  // custom properties; carries no agent-facing or user-facing content.
  'apps/oak-curriculum-mcp-streamable-http/widget/src/safe-area-insets.ts': excluded(
    '8b943346bfb2511ba5fa233ed81777fd223d8cfac742e8b676d03cb046442314',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-368: the acorn + visible text became the wide wordmark (design
  // system asset via ?raw, injected inner geometry) with a single
  // visually-hidden node carrying the whole accessible name. C391 (brand
  // name) and C392 (new-tab hint) both re-anchor on that merged node;
  // C393 re-anchors on the wordmark's JSX root.
  'apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx': reviewed(
    '906d3077e30467c25c9080385224ae2cb82cf834982a17ff24d160d907ce1510',
    ['C390', 'C391', 'C392', 'C393'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/escape-html.ts': excluded(
    'f4dbbd62ae39c1018ec810ef9698445bf2c5c78a0d39b1c81c585373e619c663',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/html-head.ts': excluded(
    'edefaa2ef5b38a9f3167effc49cb55f00669120e3cc37fe206558a0820915139',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts': excluded(
    'eb97915aaa773f6c4c9e8479a53164f1ba180654d279e1c1cb6bc1f9dc68a0bf',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-prompts-section.ts': excluded(
    '6fcc3747e3faacbfe0f9d03bd7f3ee98b309bba41a504a4b3c53d7d303eecc6b',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-resources-section.ts': excluded(
    'b48528cbedd07ccb18126f06d4e3ee12e8ca1699499d7e3f1661a99d6d964b13',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts': excluded(
    '3a6ba89621a192db8ce522c825cad1a197015f22f55b50c57911efbb57ffb761',
    DELETED_SOURCE,
  ),
};
