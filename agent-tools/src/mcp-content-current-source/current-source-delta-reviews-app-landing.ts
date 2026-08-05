/**
 * Reviewed post-baseline semantic deltas — Landing-page and widget governed sources (the MCP-128 React rebuild era).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 */
import {
  DELETED_SOURCE,
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_LANDING_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/design-system-refs.ts':
    excluded(
      'db743e3bd9e6062ec741e3756133c91034bde439e85b3dc8369e92efe60308c3',
      IMPLEMENTATION_ONLY,
    ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/landing-page-document.tsx':
    reviewed('7b911a1ae13a5a064e6d2c47dd50604240b4701a60993dd211dad68b0a392f8e', ['C341', 'C353']),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx': reviewed(
    '41131eb68390a2714e3da4f94a176533998e8bd9d2985d5f1e56c7282f81f337',
    ['C343', 'C344', 'C345', 'C346', 'C347', 'C348', 'C349', 'C350', 'C351', 'C352'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/resources-section.tsx':
    reviewed('eeb707b5df366897049e0599b65abb41cdacec4e102a4a6b37687fa7094088c5', [
      'C357',
      'C360',
      'C361',
    ]),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/site-chrome.tsx': excluded(
    '112bc8e8fa31768b6a90496e4ff5e60d51e6b85758700d9f9c843cafb342a735',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx': reviewed(
    'df1dc60bea02eb3c0ff243c7a3dcee632610adaf2c241e2f9531a2e33fb49d7a',
    ['C357', 'C362', 'C363', 'C364', 'C365', 'C366', 'C367', 'C368'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/create-snippet.ts': reviewed(
    '24c94ac7e14c6f998b84db525cf1f0a656ebb8a0269d25fc002722741b0a3359',
    ['C354'],
  ),
  // MCP-351: the bake now calls the shared served-origin module; the derived
  // view-props values are unchanged.
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/derive-view-props.ts': reviewed(
    '3e93b0bec4ebcd8beba7c1cad86199ccd37e58af0858e47e9e89c35bad2cbbfa',
    ['C369'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/index.ts': excluded(
    '5440a4e6a5395f51973cd475d8fcaf65d75fcb8d2eff0590aa36d4f179192fe4',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.tsx': excluded(
    'c8ae88ca78a96601ac77e78b4b969141026496b3bc57ad64c6ead3151ba11207',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/resolve-canonical-url.ts': excluded(
    'f7677fe63b8f9c48949e694a344be5fb7330c0a00e614093e7794c4edee66dbc',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/landing-page/view-props.ts': excluded(
    '937dcd100db80d18463b6f3b8bf2aa6f6c78bc7693d5ef4fd7778bfa2c466fef',
    IMPLEMENTATION_ONLY,
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
