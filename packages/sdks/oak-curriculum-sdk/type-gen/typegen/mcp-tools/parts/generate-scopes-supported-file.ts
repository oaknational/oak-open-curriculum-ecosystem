import { getScopesSupported } from '../../../mcp-security-policy.js';

const BANNER = `/**
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
 */`;

/**
 * Generates the scopes-supported.ts file containing OAuth scopes metadata.
 *
 * This generator reads from the MCP security policy and emits a constant
 * that runtime code can import to serve RFC 9728 protected resource metadata.
 *
 * @returns TypeScript source code for scopes-supported.ts
 *
 * @remarks
 * This is a schema-first execution pattern: generator emits data, runtime imports data.
 * The generated constant is consumed by runtime to construct OAuth metadata responses.
 */
export function generateScopesSupportedFile(): string {
  const scopes = getScopesSupported();
  const scopesLiteral = `[${scopes.map((s) => `'${s}'`).join(', ')}]`;

  return [
    BANNER,
    '',
    `export const SCOPES_SUPPORTED = ${scopesLiteral} as const;`,
    '',
    '/**',
    ' * Type representing the supported OAuth scopes.',
    ' */',
    'export type ScopesSupported = typeof SCOPES_SUPPORTED;',
    '',
  ].join('\n');
}
