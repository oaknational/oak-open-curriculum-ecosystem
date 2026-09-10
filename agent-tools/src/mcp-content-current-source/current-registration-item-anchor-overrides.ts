/**
 * Reviewed current-source anchors for the resource-registration audit items.
 *
 * Entries here are explicit semantic hand-offs; changing one is a compliance
 * review act. Split from `current-item-anchor-overrides.ts` when the MCP-337
 * relocations took the composed record over the file-size gate.
 */

const RESOURCE_REGISTRATIONS =
  'apps/oak-curriculum-mcp-streamable-http/src/resource-registrations.ts';
const MCP_AUTH_RESPONSES =
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts';
const OAUTH_PROXY_UPSTREAM =
  'apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts';
const AUTH_ROUTES = 'apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts';

export const CURRENT_REGISTRATION_ITEM_ANCHOR_OVERRIDES: Readonly<
  Record<string, Readonly<Record<string, readonly string[]>>>
> = {
  // MCP-337: the per-resource registration bodies extracted verbatim from
  // register-resources.ts to resource-registrations.ts; each relocated row
  // re-anchors on the same content at its new home.
  C336: {
    [RESOURCE_REGISTRATIONS]: [
      '  server.registerResource(name, uri, metadata, () => {\n    const content = getDocumentationContent(uri);\n    return {\n      contents: [\n        {\n          uri,\n          mimeType: resource.mimeType,\n          text: content ?? `# ${resource.title}\\n\\nContent not found.`,\n        },\n      ],\n    };\n  });',
    ],
  },
  // MCP-241: registration names promoted to shared consts; the pinned
  // identities live in the exported declarations (revision 'unchanged').
  // MCP-353: C337–C340 (the under-the-hood pointer resource) retired with the
  // resource itself — no current anchors; the retirement rides the lineage.
  C690: {
    'apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts': [
      "export const WIDGET_RESOURCE_NAME = 'Oak Curriculum App';",
      'registerAppResource(\n    server,\n    WIDGET_RESOURCE_NAME,\n    WIDGET_URI,',
    ],
  },
  // MCP-351: the auth response senders extracted verbatim from mcp-auth.ts to
  // mcp-auth-responses.ts (the middleware file split at its line limit); each
  // relocated row re-anchors on the same body at its new home, now exported.
  C395: {
    [MCP_AUTH_RESPONSES]: [
      'export function sendMissingAuthResponse(res: Response, prmUrl: string): void {',
      '\'WWW-Authenticate\': `Bearer resource_metadata="${prmUrl}"`',
    ],
  },
  C396: {
    [MCP_AUTH_RESPONSES]: [
      'export function sendInvalidFormatResponse(res: Response, prmUrl: string): void {',
      "message: 'Invalid Authorization header format.',",
    ],
  },
  C397: {
    [MCP_AUTH_RESPONSES]: [
      'export function sendVerificationFailedResponse(res: Response, prmUrl: string): void {',
      'error_description="Token verification failed"',
    ],
  },
  // MCP-351 review round: this sender's challenge text changed as well as
  // moving. `error_description` was the interpolated `reason` — which carries
  // the token's decoded `aud` — and is now a fixed constant, so no
  // client-influenced text reaches the header. The agent-facing string the
  // row governs is therefore the constant's value.
  C398: {
    [MCP_AUTH_RESPONSES]: [
      'export function sendInvalidResourceResponse(res: Response, prmUrl: string, reason: string): void {',
      'error_description="${AUDIENCE_MISMATCH_DESCRIPTION}"',
    ],
  },
  C400: {
    [MCP_AUTH_RESPONSES]: ["res.status(403).json({ error: 'Forbidden' });"],
  },
  // MCP-345: the AS metadata rewrite takes the advertised scopes and states
  // them as scopes_supported, so the served document names the PRM's set
  // rather than the upstream list; the route passes SCOPES_SUPPORTED.
  C408: {
    [OAUTH_PROXY_UPSTREAM]: [
      'export function rewriteAuthServerMetadata(\n  upstreamMetadata: UpstreamAuthServerMetadata,\n  localOrigin: string,\n  advertisedScopes: readonly string[],\n): UpstreamAuthServerMetadata {',
      'registration_endpoint: `${localOrigin}/oauth/register`,\n    scopes_supported: [...advertisedScopes],',
    ],
  },
  C707: {
    [AUTH_ROUTES]: [
      'res.json(rewriteAuthServerMetadata(upstreamMetadata, originResult.value, SCOPES_SUPPORTED));',
    ],
  },
};
