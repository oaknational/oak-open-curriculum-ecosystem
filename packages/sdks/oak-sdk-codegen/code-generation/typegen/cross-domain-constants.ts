/**
 * The published address of the Oak curriculum MCP App widget.
 *
 * Generated at sdk-codegen time so every consumer — the tool definitions
 * advertising `_meta.ui.resourceUri`, the app's served-surface registration
 * key, and the auth public-resource allowlist — derives from this one
 * constant (MCP-187).
 *
 * The address is the same on every build and is a published contract. A
 * client keeps the address from the tool list it was given, so serving a
 * different address in its place breaks every client holding an earlier
 * list, and a published plugin needs a new reviewed version before it sees a
 * new address. Compatible widget changes ship as content behind this address;
 * an incompatible change takes the next version segment (`-v2`). The
 * contract, its evidence, and the procedure for an incompatible change live in
 * ADR-141 (widget URI identity amendment, MCP-489).
 *
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const BASE_WIDGET_URI = 'ui://widget/oak-curriculum-app-v1.html';

/**
 * Per-build widget addresses from releases before the address was fixed that
 * clients may still hold.
 *
 * None of them is served. They sit on the auth public-resource allowlist so
 * that an unauthenticated read of one reaches the server's resource-not-found
 * error rather than an authentication challenge, which would tell the client
 * to sign in and retry the same address. The server sends no instruction to
 * list tools again; recovery is the host's behaviour (ADR-141, widget URI
 * identity amendment, MCP-489).
 *
 * The set is closed: `…-899803c6.html` is release 1.181.1's address, the last
 * per-build address production served, and `…-5ce56c4b.html` is release
 * 1.178.6's, held by a ChatGPT desktop connector on 2026-09-10.
 */
export const RETIRED_WIDGET_URIS: readonly string[] = [
  'ui://widget/oak-curriculum-app-899803c6.html',
  'ui://widget/oak-curriculum-app-5ce56c4b.html',
];

/**
 * Tools that should advertise a widget UI via `_meta.ui.resourceUri`.
 *
 * Only allowlisted **names** emit `_meta.ui.resourceUri` in codegen and in
 * aggregated tool definitions. Other tools must not include `resourceUri`
 * in `_meta.ui` (even if they use `_meta.ui.visibility` for app-only helpers).
 *
 * Tools in this set get `_meta.ui.resourceUri` in their codegen output
 * and in aggregated definitions.
 *
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set([
  'get-curriculum-model',
  'user-search',
]);
