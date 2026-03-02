/**
 * Error types for host header validation in OAuth metadata endpoints.
 *
 * Extracted from `auth-routes.ts` to keep that module under the line limit.
 */

import { ok, err, type Result } from '@oaknational/result';
import { extractHostname } from './security.js';
import { isAllowedHostname, isValidHostHeader } from './host-header-validation.js';

/**
 * Error types returned by {@link deriveSelfOrigin} when host validation fails.
 */
export type HostValidationError =
  | { readonly type: 'missing_host' }
  | { readonly type: 'invalid_format'; readonly host: string }
  | { readonly type: 'not_allowed'; readonly hostname: string };

/**
 * Converts a {@link HostValidationError} to a human-readable message
 * suitable for 403 response bodies and log output.
 */
export function hostValidationErrorMessage(error: HostValidationError): string {
  switch (error.type) {
    case 'missing_host':
      return 'Cannot generate OAuth metadata: missing host header';
    case 'invalid_format':
      return `Rejected Host header '${error.host}': invalid host header format`;
    case 'not_allowed':
      return `Rejected Host header '${error.hostname}': not in allowed hosts list`;
    default: {
      const exhaustive: never = error;
      return String(exhaustive);
    }
  }
}

/**
 * Returns true if the host string represents a loopback address.
 * Handles `localhost`, `127.0.0.1`, and IPv6 `[::1]` with optional port.
 */
function isLoopbackHost(host: string): boolean {
  const normalizedHost = host.toLowerCase();
  if (normalizedHost.startsWith('[')) {
    return normalizedHost.startsWith('[::1]');
  }
  const colonIdx = normalizedHost.indexOf(':');
  const hostname = colonIdx >= 0 ? normalizedHost.substring(0, colonIdx) : normalizedHost;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Derives the self-origin from a request's Host header after validating
 * it against the allowed hosts list.
 *
 * Uses `http` for loopback addresses, `https` for everything else.
 *
 * @returns `Ok` with the origin string, or `Err` with a {@link HostValidationError}
 */
export function deriveSelfOrigin(
  req: { get(name: string): string | undefined },
  allowedHosts: readonly string[],
): Result<string, HostValidationError> {
  const host = req.get('host');
  if (!host) {
    return err({ type: 'missing_host' });
  }
  if (!isValidHostHeader(host)) {
    return err({ type: 'invalid_format', host });
  }
  const hostname = extractHostname(host).toLowerCase();
  if (!hostname || !isAllowedHostname(hostname, allowedHosts)) {
    return err({ type: 'not_allowed', hostname });
  }
  const protocol = isLoopbackHost(host) ? 'http' : 'https';
  return ok(`${protocol}://${host}`);
}
