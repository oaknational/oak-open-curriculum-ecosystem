/**
 * Reviewed current-source anchors for audit items whose immutable baseline
 * fragment was intentionally modified or relocated.
 *
 * Retained items use immutable baseline fragments. Entries here are explicit
 * semantic hand-offs; changing one is a compliance review act.
 */
import { CURRENT_AGGREGATED_ITEM_ANCHOR_OVERRIDES } from './current-aggregated-item-anchor-overrides.js';
import { CURRENT_GENERATED_DESCRIPTION_ANCHOR_OVERRIDES } from './current-generated-description-anchor-overrides.js';
import { CURRENT_GENERATED_ITEM_ANCHOR_OVERRIDES } from './current-generated-item-anchor-overrides.js';
import { CURRENT_GUIDANCE_ITEM_ANCHOR_OVERRIDES } from './current-guidance-item-anchor-overrides.js';
import { CURRENT_REGISTRATION_ITEM_ANCHOR_OVERRIDES } from './current-registration-item-anchor-overrides.js';
import { CURRENT_SPEC_REFRESH_ITEM_ANCHOR_OVERRIDES } from './current-spec-refresh-item-anchor-overrides.js';
import { CURRENT_MISCONCEPTION_ORDER_ITEM_ANCHOR_OVERRIDES } from './current-misconception-order-item-anchor-overrides.js';
import { CURRENT_THREAD_PROGRESSIONS_ITEM_ANCHOR_OVERRIDES } from './current-thread-progressions-item-anchor-overrides.js';
import { CURRENT_PRIOR_KNOWLEDGE_ITEM_ANCHOR_OVERRIDES } from './current-prior-knowledge-item-anchor-overrides.js';

const SERVED_ORIGIN = 'apps/oak-curriculum-mcp-streamable-http/src/served-origin.ts';
const AI_DOC = 'packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc.ts';
type AnchorOverrides = Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>;

export const CURRENT_ITEM_ANCHOR_OVERRIDES: AnchorOverrides = {
  ...CURRENT_GENERATED_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_GENERATED_DESCRIPTION_ANCHOR_OVERRIDES,
  ...CURRENT_AGGREGATED_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_PRIOR_KNOWLEDGE_ITEM_ANCHOR_OVERRIDES,
  /**
   * The landing page's canonical-URL resolution, promoted to `served-origin.ts`
   * by MCP-351. It is the sole survivor of the landing-page override group,
   * which had its own module until 2026-08-20; the page went and every other
   * row in that module retired with it, so the one row that outlived the page
   * lives here rather than in a module named for a surface that no longer
   * exists.
   */
  C355: {
    [SERVED_ORIGIN]: ['export function resolveServedMcpUrl(inputs: ServedOriginInputs): string {'],
  },
  /**
   * The AI reference's section-heading map, hoisted from inside
   * `renderSections` to the module-level `KIND_HEADINGS` and `pluraliseKind`
   * (2026-11-02, the analyser lane); the labels and the fallback plural are
   * the same, so the headings the doc renders are unchanged.
   */
  C484: {
    [AI_DOC]: [
      "const KIND_HEADINGS: Readonly<Record<string, string>> = {\n  Class: 'Classes',\n  'Type alias': 'Type Aliases',\n  Variable: 'Variables',\n  Function: 'Functions',\n  Interface: 'Interfaces',\n  Enum: 'Enums',\n  Namespace: 'Namespaces',\n  Reference: 'References',\n};\n\n/** The section heading for a reflection kind; an unlisted kind takes a regular plural. */\nfunction pluraliseKind(kind: string): string {\n  return KIND_HEADINGS[kind] ?? (kind.endsWith('s') ? kind : `${kind}s`);\n}",
    ],
  },
  ...CURRENT_GUIDANCE_ITEM_ANCHOR_OVERRIDES,
  C313: {
    'packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts': [
      "type DocumentedErrorCode = 'RESOURCE_NOT_FOUND' | 'AUTHENTICATION_REQUIRED' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR'",
      "type UpstreamErrorCode = 'UPSTREAM_SERVER_ERROR' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR'",
    ],
  },
  ...CURRENT_THREAD_PROGRESSIONS_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_MISCONCEPTION_ORDER_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_REGISTRATION_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_SPEC_REFRESH_ITEM_ANCHOR_OVERRIDES,
  // MCP-353: C413 (the under-the-hood public-allowlist row) retired with the
  // deleted resource — no current anchor; the retirement rides the lineage.
  // MCP-489: the widget address is one fixed published value, the same on
  // every build.
  C479: {
    'packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts': [
      "export const BASE_WIDGET_URI = 'ui://widget/oak-curriculum-app-v1.html';",
    ],
  },
};
