/**
 * GENERATED FILE - DO NOT EDIT
 *
 * OAuth scopes supported by this MCP server.
 * Generated from mcp-security-policy.ts at sdk-codegen time.
 *
 * To modify supported scopes, update DEFAULT_AUTH_SCHEME in:
 * code-generation/mcp-security-policy.ts
 *
 * Then run: pnpm sdk-codegen
 *
 * @see {@link file://./../../../../../code-generation/mcp-security-policy.ts}
 * @see {@link file://./../../../../../code-generation/typegen/mcp-tools/parts/generate-scopes-supported-file.ts}
 *
 * @remarks
 * Runtime imports this constant to construct RFC 9728 protected resource metadata.
 * Generator reads security policy and emits this constant during sdk-codegen.
 */

export const SCOPES_SUPPORTED = ['email'] as const;

/**
 * Type representing the supported OAuth scopes.
 */
export type ScopesSupported = typeof SCOPES_SUPPORTED;
