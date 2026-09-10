/**
 * Explicit revision verdicts for aggregated-tool, app, and widget items whose
 * reviewed anchors point at intentionally modified (or added) current
 * fragments. Paired with the reviewed anchors in
 * `current-aggregated-item-anchor-overrides.ts`; composed into
 * `CURRENT_ITEM_REVISION_OVERRIDES` alongside the generated-item and
 * generated-description revision maps.
 */

export const CURRENT_AGGREGATED_ITEM_REVISION_OVERRIDES = {
  // MCP-365: the paragraph landed after this item's routing paragraph; the
  // item's own prose is byte-identical (the baseline anchor merely spanned
  // the literal's closing punctuation), so the truthful verdict is
  // unchanged.
  C055: 'unchanged',
  // MCP-366: the response call survives minus the hint inclusion line.
  C057: 'modified',
  C066: 'modified',
  C067: 'modified',
  C101: 'modified',
  C102: 'modified',
  C120: 'modified',
  C256: 'modified',
  C255: 'modified',
  C237: 'modified',
  C236: 'modified',
  C235: 'modified',
  C164: 'modified',
  C160: 'modified',
  C075: 'modified',
  C138: 'modified',
  C139: 'modified',
  C152: 'modified',
  C153: 'modified',
  C162: 'modified',
  C166: 'modified',
  C173: 'modified',
  C174: 'modified',
  C177: 'modified',
  C222: 'modified',
  C223: 'modified',
  C224: 'modified',
  C231: 'modified',
  C248: 'modified',
  // The stated-statements refactor of get-prior-knowledge-graph.
  C246: 'modified',
  C247: 'modified',
  C250: 'modified',
  C251: 'modified',
  C372: 'modified',
  C374: 'modified',
  C376: 'modified',
  C385: 'modified',
  C391: 'modified',
  C392: 'modified',
  C393: 'modified',
  C463: 'modified',
  C705: 'modified',
  // MCP-351 (carried through the MCP-365 relocation of this map): the PRM
  // resource now composes the shared MCP_RESOURCE_PATH constant.
  C706: 'modified',
  C707: 'modified',
  // MCP-411: the stub-mode registration line lost its metadataRateLimiter
  // middleware with the in-code limiter (ADR-219); the served body is
  // unchanged.
  C708: 'modified',
  C717: 'added',
} as const;
