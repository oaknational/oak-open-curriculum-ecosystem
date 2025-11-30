/**
 * MCP security scheme types.
 *
 * These types define the security metadata emitted in tool descriptors
 * and consumed by runtime authorization logic.
 *
 * @remarks
 * Security schemes determine whether a tool requires OAuth authentication:
 * - NoAuthScheme: Tool is publicly accessible
 * - OAuth2Scheme: Tool requires OAuth 2.1 authentication
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
 * comparisons when determining if a tool requires authentication.
 *
 * @example
 * ```typescript
 * const requiresAuth = scheme.type !== NOAUTH_SCHEME_TYPE;
 * ```
 */
export const NOAUTH_SCHEME_TYPE = 'noauth' as const satisfies SecuritySchemeType;

/**
 * No authentication required.
 *
 * Tools with this scheme can be called without a Bearer token.
 * Typically used for public metadata or discovery endpoints.
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
 *   scopes: ['openid', 'email']
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
