/**
 * MCP security scheme types.
 *
 * These types define the security metadata emitted in tool descriptors
 * and consumed by runtime authorization logic.
 *
 * @remarks
 * Security schemes determine a tool's per-tool OAuth scope requirement:
 * - NoAuthScheme: no per-tool scope check (the HTTP transport still
 *   requires a bearer token for every tool call)
 * - OAuth2Scheme: Tool requires OAuth 2.1 authentication with the listed scopes
 *
 * The SecurityScheme union type allows tools to specify their auth requirements.
 */

/**
 * Union of supported security scheme type literals.
 */
export type SecuritySchemeType = 'noauth' | 'oauth2';

/**
 * Constant for the noauth security scheme type.
 *
 * Use this constant instead of the magic string 'noauth' for type-safe
 * comparisons when determining whether a tool carries a per-tool scope
 * requirement.
 *
 * @example
 * ```typescript
 * const requiresAuth = scheme.type !== NOAUTH_SCHEME_TYPE;
 * ```
 */
export const NOAUTH_SCHEME_TYPE = 'noauth' as const satisfies SecuritySchemeType;

/**
 * No per-tool OAuth scope requirement.
 *
 * Tools with this scheme skip the per-tool scope check; the HTTP transport
 * still requires a bearer token for every tool call. Typically used for
 * metadata or discovery tools with no scope-gated content.
 *
 * @example
 * ```typescript
 * const scheme: NoAuthScheme = { type: 'noauth' };
 * ```
 */
export interface NoAuthScheme {
  readonly type: 'noauth';
}

/**
 * OAuth 2.1 authentication required.
 *
 * Tools with this scheme require a valid OAuth 2.1 Bearer token.
 * Scopes define the required permissions.
 *
 * @example
 * ```typescript
 * const scheme: OAuth2Scheme = {
 *   type: 'oauth2',
 *   scopes: ['email']
 * };
 * ```
 */
export interface OAuth2Scheme {
  readonly type: 'oauth2';
  readonly scopes?: readonly string[];
}

/**
 * Union of all supported security schemes.
 *
 * This discriminated union allows type-safe handling of different
 * authentication requirements. Use the `type` field to narrow.
 *
 * @example
 * ```typescript
 * function requiresAuth(scheme: SecurityScheme): boolean {
 *   return scheme.type === 'oauth2';
 * }
 * ```
 */
export type SecurityScheme = NoAuthScheme | OAuth2Scheme;
