import { createHash, randomBytes } from 'node:crypto';

/**
 * Convert random bytes to a base64url string for Clerk identifiers.
 */
export function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/=+/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Generate PKCE verifier and challenge pair.
 */
export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = toBase64Url(randomBytes(32));
  const challenge = toBase64Url(createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

/**
 * Generate a deterministic email/local identifier for automated flows.
 */
export function createAutomationIdentifier(prefix: string, entropyBytes = 5): string {
  return `${prefix}-${Date.now().toString(36)}-${toBase64Url(randomBytes(entropyBytes))}`;
}
