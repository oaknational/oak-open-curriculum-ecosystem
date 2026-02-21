/**
 * GENERATED FILE - DO NOT EDIT
 *
 * OAuth scopes supported by this MCP server.
 * Generated from mcp-security-policy.ts at type-gen time.
 *
 * To modify supported scopes, update DEFAULT_AUTH_SCHEME in:
 * type-gen/mcp-security-policy.ts
 *
 * Then run: pnpm type-gen
 *
 * @see {@link file://./../../../../../type-gen/mcp-security-policy.ts}
 * @see {@link file://./../../../../../type-gen/typegen/mcp-tools/parts/generate-scopes-supported-file.ts}
 *
 * @remarks
 * Runtime imports this constant to construct RFC 9728 protected resource metadata.
 * Generator reads security policy and emits this constant during type-gen.
 */

export const SCOPES_SUPPORTED = ['email'] as const;

/**
 * Type representing the supported OAuth scopes.
 */
export type ScopesSupported = typeof SCOPES_SUPPORTED;
