/**
 * Reviewed anchors for app and widget items whose baseline fragments were
 * intentionally modified on latest main, alongside MCP-300's rewrite of the
 * aggregated tools (`current-aggregated-item-anchor-overrides.ts`): the
 * under-the-hood tool, the widget's brand banner and app shell, and the
 * authorisation routes. Anchor strings are verbatim from the current sources;
 * their revision verdicts are in `current-aggregated-item-revision-overrides.ts`.
 */

const APP_ROOT = 'apps/oak-curriculum-mcp-streamable-http';
const UNDER_THE_HOOD = `${APP_ROOT}/src/oak-under-the-hood/oak-under-the-hood-tool.ts`;
const AUTH_ROUTES = `${APP_ROOT}/src/auth-routes.ts`;
const WIDGET_APP = `${APP_ROOT}/widget/src/App.tsx`;
const BRAND_BANNER = `${APP_ROOT}/widget/src/BrandBanner.tsx`;

export const CURRENT_APP_ITEM_ANCHOR_OVERRIDES = {
  // MCP-353: the resource_link title occurrence retired with the pointer;
  // the tool title anchors on its shared declaration.
  C372: {
    [UNDER_THE_HOOD]: ["const OAK_UNDER_THE_HOOD_TOOL_TITLE = 'Oak: Under the Hood';"],
  },
  // MCP-353: openWorldHint flipped false — the result is served entirely from
  // the deployed artefact (§2.F cure).
  C374: {
    [UNDER_THE_HOOD]: ['openWorldHint: false,\n        title: OAK_UNDER_THE_HOOD_TOOL_TITLE,'],
  },
  // MCP-353: the summary reworded from fetch-the-linked-method to
  // served-in-full (the baked shape).
  C376: {
    [UNDER_THE_HOOD]: [
      "'Oak: Under the Hood — the orientation method for this repository (the Oak Open Curriculum '",
    ],
  },
  C385: {
    [WIDGET_APP]: ['<h1 className="visually-hidden">Oak National Academy Curriculum</h1>'],
  },
  // MCP-368: the visible brand text and the separate new-tab hint merged
  // into ONE visually hidden node (the wordmark is the link's only visible
  // content). C391 (the brand name) and C392 (the hint) both live in that
  // merged node now; each keeps its own row.
  C391: {
    [BRAND_BANNER]: [
      '<span className="visually-hidden">Oak National Academy (opens in a new tab)</span>',
    ],
  },
  C392: {
    [BRAND_BANNER]: [
      '<span className="visually-hidden">Oak National Academy (opens in a new tab)</span>',
    ],
  },
  // MCP-368: the acorn became the wide wordmark (design-system asset,
  // injected inner geometry); the anchor pins the JSX root that owns the
  // a11y and theming contract.
  C393: {
    [BRAND_BANNER]: [
      '<svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox={WORDMARK_VIEWBOX}\n      className="oak-brand-banner__logo"\n      dangerouslySetInnerHTML={wordmarkGeometry}\n    />',
    ],
  },
  C705: {
    [AUTH_ROUTES]: ['const servePrm: RequestHandler = (req, res) => {'],
  },
  C717: {
    [WIDGET_APP]: [
      'This service is experimental. It uses Oak National Academy content, but AI can make',
    ],
  },
  // MCP-411: the metadataRateLimiter middleware left with the in-code
  // limiter (ADR-219); the registration lines anchor on their handlers alone.
  C707: {
    [AUTH_ROUTES]: ["app.get('/.well-known/oauth-protected-resource', servePrm);"],
  },
  C708: {
    [AUTH_ROUTES]: ["app.get('/.well-known/mcp-stub-mode', (_req, res) => {"],
  },
  // MCP-351: the published PRM resource now composes the shared
  // MCP_RESOURCE_PATH constant, so it cannot diverge from the RFC 8707
  // expected audience.
  // MCP-655: `authorization_servers` names the upstream authorization
  // server's issuer instead of this origin, so a PRM-following client holds
  // the issuer the authorization response's `iss` carries (RFC 9207 §2.4).
  C706: {
    [AUTH_ROUTES]: [
      'resource: `${selfOrigin}${MCP_RESOURCE_PATH}`,\n      authorization_servers: [upstreamMetadata.issuer],\n      scopes_supported: SCOPES_SUPPORTED,',
    ],
  },
} as const;
