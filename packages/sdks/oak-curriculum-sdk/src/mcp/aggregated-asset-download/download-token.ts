/**
 * HMAC-SHA256 token generation and validation for asset download URLs.
 *
 * Creates short-lived, scoped signatures that authenticate download requests
 * without exposing the Oak API key. The signature covers the lesson slug,
 * asset type, and expiry timestamp — any tampering invalidates it.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Creates an HMAC-SHA256 signature for an asset download.
 *
 * The signature covers `[lesson, type, expiresAt]` (JSON canonical form) so it cannot be reused
 * for different assets or extended beyond the original TTL.
 *
 * @param lesson - Lesson slug
 * @param type - Asset type (e.g. 'worksheet', 'slideDeck')
 * @param expiresAt - Unix timestamp in milliseconds when the signature expires
 * @param secret - Signing secret (derived from OAK_API_KEY via key separation; see ADR-126)
 * @returns Hex-encoded HMAC-SHA256 signature
 */
export function createDownloadSignature(
  lesson: string,
  type: string,
  expiresAt: number,
  secret: string,
): string {
  const payload = JSON.stringify([lesson, type, expiresAt]);
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Derives a signing secret from the Oak API key using HMAC-SHA256 key separation.
 *
 * This ensures the API key is never used directly as an HMAC key. If upstream API
 * logs capture the Bearer header, the signing secret remains safe.
 *
 * @param oakApiKey - The Oak API key to derive from
 * @returns Hex-encoded derived signing secret
 */
export function deriveSigningSecret(oakApiKey: string): string {
  return createHmac('sha256', oakApiKey).update('asset-download-signing').digest('hex');
}

/**
 * Validates an HMAC-SHA256 signature and checks expiry.
 *
 * Uses `timingSafeEqual` to prevent timing attacks on the signature comparison.
 *
 * @param lesson - Lesson slug from the request
 * @param type - Asset type from the request
 * @param signature - Hex-encoded signature from the request
 * @param expiresAt - Expiry timestamp from the request
 * @param secret - Signing secret (must match the one used to create the signature)
 * @param nowMs - Current time in milliseconds (injected for testability)
 * @returns Validation result with `valid: true` or `valid: false` with reason
 */
export function validateDownloadSignature(
  lesson: string,
  type: string,
  signature: string,
  expiresAt: number,
  secret: string,
  nowMs: number,
): { readonly valid: true } | { readonly valid: false; readonly reason: string } {
  if (nowMs >= expiresAt) {
    return { valid: false, reason: 'Download link has expired' };
  }

  const expected = createDownloadSignature(lesson, type, expiresAt, secret);

  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (sigBuffer.length !== expectedBuffer.length) {
    return { valid: false, reason: 'Invalid signature' };
  }

  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Invalid signature' };
  }

  return { valid: true };
}
