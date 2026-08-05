const LANDING_ROOT = 'apps/oak-curriculum-mcp-streamable-http/src/landing-page';
const LANDING_COMPONENTS = `${LANDING_ROOT}/components`;
const LANDING_DOCUMENT = `${LANDING_COMPONENTS}/landing-page-document.tsx`;
const PAGE_SECTIONS = `${LANDING_COMPONENTS}/page-sections.tsx`;
const RESOURCES_SECTION = `${LANDING_COMPONENTS}/resources-section.tsx`;
const TOOLS_SECTION = `${LANDING_COMPONENTS}/tools-section.tsx`;
const DERIVE_VIEW_PROPS = `${LANDING_ROOT}/derive-view-props.ts`;
const SERVED_ORIGIN = 'apps/oak-curriculum-mcp-streamable-http/src/served-origin.ts';

/**
 * Reviewed anchors whose current source is the MCP app landing page — the
 * MCP-128 React rebuild. Anchor strings are verbatim from the current
 * components; rows whose baseline snippet survived the rebuild word-for-word
 * carry no override and anchor on the baseline snippet directly.
 */
export const CURRENT_LANDING_ITEM_ANCHOR_OVERRIDES = {
  C341: {
    [LANDING_DOCUMENT]: ["const PAGE_TITLE = 'Oak Curriculum MCP (HTTP)';"],
  },
  C343: {
    [PAGE_SECTIONS]: ['Public Beta'],
  },
  C345: {
    [PAGE_SECTIONS]: ['Status: ok • Route: <code>/mcp</code> • Auth: OAuth 2.1'],
  },
  C346: {
    [PAGE_SECTIONS]: ['Connect the Oak Curriculum MCP to your AI assistant'],
  },
  C347: {
    [PAGE_SECTIONS]: ['Add this to your MCP client configuration:'],
  },
  C348: {
    [PAGE_SECTIONS]: ['aria-label="JSON configuration snippet"'],
  },
  C344: {
    [PAGE_SECTIONS]: ['Designed for teachers, this service connects your AI assistant to Oak'],
  },
  C349: {
    [PAGE_SECTIONS]: ['You will be prompted to sign in with your Oak account.'],
  },
  C350: {
    [PAGE_SECTIONS]: ['<h2 className="oak-heading-5">Documentation</h2>'],
  },
  C351: {
    [PAGE_SECTIONS]: [
      'For details about the underlying curriculum data, see the',
      'Oak Curriculum API documentation',
    ],
  },
  C352: {
    [PAGE_SECTIONS]: ['Browse the MCP server implementation:', 'code on GitHub'],
  },
  C353: {
    [LANDING_DOCUMENT]: ['<meta name="app-version" content={appVersion} />'],
  },
  C354: {
    [`${LANDING_ROOT}/create-snippet.ts`]: [
      '"mcpServers": {\n    "oak-curriculum": {\n      "type": "http",',
    ],
  },
  C355: {
    [SERVED_ORIGIN]: ['export function resolveServedMcpUrl(inputs: ServedOriginInputs): string {'],
  },
  C357: {
    [RESOURCES_SECTION]: ['Resources ({resources.length})'],
    [TOOLS_SECTION]: ['Tools ({aggregatedTools.length + generatedTools.length})'],
  },
  C360: {
    [RESOURCES_SECTION]: ['Resources available via MCP resources/read:'],
  },
  C361: {
    [RESOURCES_SECTION]: ['<span className="resource-title">{resource.title}</span>'],
  },
  C362: {
    [TOOLS_SECTION]: ['The following tools are available via the MCP protocol:'],
  },
  C363: {
    [TOOLS_SECTION]: ['<h3 className="tool-group-label">Curriculum tools</h3>'],
  },
  C364: {
    [TOOLS_SECTION]: ['Higher-level tools that combine multiple API calls'],
  },
  C365: {
    [TOOLS_SECTION]: ['<h3 className="tool-group-label muted">API pass-through</h3>'],
  },
  C366: {
    [TOOLS_SECTION]: ['Individual Oak Curriculum API endpoints'],
  },
  C367: {
    [TOOLS_SECTION]: ['How to use<span className="oak-visually-hidden"> {tool.name}</span>'],
  },
  C368: {
    [TOOLS_SECTION]: ['<details className="oak-disclosure tool-item">'],
  },
  C369: {
    [DERIVE_VIEW_PROPS]: ['export const AGGREGATED_TOOL_ORDER: readonly AggregatedToolName[] = ['],
  },
} as const;
