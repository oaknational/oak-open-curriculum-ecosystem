/**
 * RFC 8707 Resource Parameter Validation.
 *
 * Validates that JWT access tokens have the correct audience claim
 * matching the expected resource URL to prevent token misuse.
 *
 * Part of Phase 2, Sub-Phase 2.4
 */

import { decode as jwtDecode, type JwtPayload } from 'jsonwebtoken';
import type { Logger } from '@oaknational/logger';

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
 * Check if a token appears to be a JWT (3 base64url-encoded parts separated by dots).
 * Returns false for opaque tokens like Clerk's OAuth tokens (oat_...).
 *
 * Note: This is a format check, not cryptographic verification.
 */
function isJwtFormat(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Each part must be a non-empty base64url string
  const base64urlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => part.length > 0 && base64urlRegex.test(part));
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
 * Log JWT structure information (without sensitive data).
 */
function logJWTStructure(logger: Logger, payload: JwtPayload): void {
  logger.debug('JWT decoded', {
    hasAudience: !!payload.aud,
    audienceType: Array.isArray(payload.aud) ? 'array' : 'string',
    audienceCount: Array.isArray(payload.aud) ? payload.aud.length : payload.aud ? 1 : 0,
    issuer: payload.iss,
    expiresAt: payload.exp,
  });
}

/**
 * Log audience validation result.
 */
function logAudienceValidation(
  logger: Logger,
  result: ResourceValidationResult,
  audiences: string[],
  expectedResource: string,
): void {
  if (!result.valid) {
    logger.warn('Audience validation failed', {
      expectedResource,
      actualAudiences: audiences,
      reason: result.reason,
    });
  } else {
    logger.debug('Audience validation succeeded', {
      expectedResource,
      matchedAudience: audiences.find((a) => a === expectedResource),
    });
  }
}

/**
 * Validates that a token's audience claim matches the expected resource.
 *
 * Per RFC 8707 (Resource Indicators for OAuth 2.0), the authorization server
 * should echo the `resource` parameter into the token's `aud` (audience) claim.
 * This function verifies that binding to prevent token misuse across services.
 *
 * **Opaque Token Handling**: Clerk OAuth tokens (`oat_...`) are opaque and cannot
 * be decoded locally. For these tokens, Clerk has already verified the token via
 * their API before this function is called. Since we cannot extract audience claims
 * from opaque tokens, we skip RFC 8707 validation and return valid.
 *
 * **Security Note**: This function only validates the audience claim for JWT tokens.
 * The token itself must be cryptographically verified by Clerk before calling this.
 *
 * @param token - Access token (Bearer token, without 'Bearer ' prefix)
 * @param expectedResource - Expected resource URL (e.g., "https://mcp.example.com/mcp")
 * @param logger - Logger for validation details
 * @returns Validation result with details
 *
 * Opaque tokens (e.g. Clerk's `oat_...`) bypass local audience validation
 * because they have no inspectable claims. The function returns
 * `{ valid: true }` for non-JWT tokens, relying on Clerk's upstream
 * `verifyClerkToken()` to have performed resource binding. If a second
 * OAuth provider is added, this code path must be re-evaluated.
 *
 * @see https://www.rfc-editor.org/rfc/rfc8707.html
 *
 * @example
 * ```typescript
 * const result = validateResourceParameter(token, 'https://mcp.example.com/mcp', logger);
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
  logger: Logger,
): ResourceValidationResult {
  // Check if token is a JWT (3 dot-separated base64url parts)
  // Opaque tokens (e.g., Clerk's oat_...) cannot be decoded locally
  if (!isJwtFormat(token)) {
    logger.debug('Token is opaque (not JWT), skipping RFC 8707 audience validation', {
      tokenPrefix: token.slice(0, 4) + '...',
      expectedResource,
    });
    // **Security assumption**: Opaque tokens have already been verified by
    // Clerk's API via `verifyClerkToken()` at the ingress edge. RFC 8707
    // audience validation requires JWT format with an `aud` claim — opaque
    // tokens have no claims to inspect. We trust that Clerk's verification
    // performs resource binding for opaque tokens. This assumption holds as
    // long as Clerk remains the sole OAuth provider. If a second provider is
    // added, this code path must be re-evaluated.
    return { valid: true };
  }

  try {
    // Decode JWT without verification (already verified by Clerk)
    const decoded = jwtDecode(token, { complete: true });

    if (!decoded || typeof decoded === 'string') {
      logger.warn('JWT decode failed', {
        reason: 'Invalid JWT format',
      });
      return { valid: false, reason: 'Invalid JWT format' };
    }

    const payload = decoded.payload;

    // Type guard: payload should be JwtPayload, not string
    if (typeof payload === 'string') {
      logger.warn('JWT decode failed', {
        reason: 'Invalid JWT payload format',
      });
      return { valid: false, reason: 'Invalid JWT payload format' };
    }

    // Log JWT structure
    logJWTStructure(logger, payload);

    // Extract and validate audiences
    const audiences = getAudiences(payload.aud);
    const result = isResourceInAudiences(audiences, expectedResource);

    // Log validation result
    logAudienceValidation(logger, result, audiences, expectedResource);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn('JWT validation error', {
      error: errorMessage,
    });
    return {
      valid: false,
      reason: `Token decode error: ${errorMessage}`,
    };
  }
}
