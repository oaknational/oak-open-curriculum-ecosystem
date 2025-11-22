/**
 * RFC 8707 Resource Parameter Validation.
 *
 * Validates that JWT access tokens have the correct audience claim
 * matching the expected resource URL to prevent token misuse.
 *
 * Part of Phase 2, Sub-Phase 2.4
 */

import { decode as jwtDecode } from 'jsonwebtoken';

/**
 * Result of resource parameter validation.
 */
export interface ResourceValidationResult {
  /**
   * Whether the token's audience matches the expected resource.
   */
  readonly valid: boolean;

  /**
   * Human-readable reason for validation failure (if applicable).
   */
  readonly reason?: string;
}

/**
 * Extract audiences from JWT payload.
 */
function getAudiences(aud: string | string[] | undefined): string[] {
  return Array.isArray(aud) ? aud : aud ? [aud] : [];
}

/**
 * Check if expected resource is in audience list.
 */
function isResourceInAudiences(
  audiences: string[],
  expectedResource: string,
): ResourceValidationResult {
  if (audiences.includes(expectedResource)) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: `Token audience mismatch. Expected: ${expectedResource}, Got: ${audiences.join(', ') || '(none)'}`,
  };
}

/**
 * Validates that a JWT token's audience claim matches the expected resource.
 *
 * Per RFC 8707 (Resource Indicators for OAuth 2.0), the authorization server
 * should echo the `resource` parameter into the token's `aud` (audience) claim.
 * This function verifies that binding to prevent token misuse across services.
 *
 * **Security Note**: This function only validates the audience claim. The token
 * itself must be cryptographically verified by Clerk before calling this function.
 *
 * @param token - JWT access token (Bearer token, without 'Bearer ' prefix)
 * @param expectedResource - Expected resource URL (e.g., "https://mcp.example.com/mcp")
 * @returns Validation result with details
 *
 * @see https://www.rfc-editor.org/rfc/rfc8707.html
 *
 * @example
 * ```typescript
 * const result = validateResourceParameter(token, 'https://mcp.example.com/mcp');
 * if (!result.valid) {
 *   console.error('Token validation failed:', result.reason);
 *   return res.status(401).json({ error: result.reason });
 * }
 * ```
 *
 * @public
 */
export function validateResourceParameter(
  token: string,
  expectedResource: string,
): ResourceValidationResult {
  try {
    // Decode JWT without verification (already verified by Clerk)
    const decoded = jwtDecode(token, { complete: true });

    if (!decoded || typeof decoded === 'string') {
      return { valid: false, reason: 'Invalid JWT format' };
    }

    const payload = decoded.payload;

    // Type guard: payload should be JwtPayload, not string
    if (typeof payload === 'string') {
      return { valid: false, reason: 'Invalid JWT payload format' };
    }

    // Extract and validate audiences
    const audiences = getAudiences(payload.aud);
    return isResourceInAudiences(audiences, expectedResource);
  } catch (error) {
    return {
      valid: false,
      reason: `Token decode error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
