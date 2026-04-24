/**
 * Branch-URL label parser for the release-name resolver.
 *
 * @remarks Extracted from `release-internals.ts` to keep each module
 * under the workspace `max-lines: 250` budget. Pure functions only;
 * exhaustive coverage comes from the public `resolveRelease` tests
 * via the preview and development derivation branches.
 *
 * @packageDocumentation
 */

import type { ReleaseError } from './release-types.js';

const IPV4_LITERAL_RE = /^\d{1,3}(\.\d{1,3}){3}$/u;

/**
 * Parse a `VERCEL_BRANCH_URL` hostname's leftmost label.
 *
 * @remarks Uses the `URL` constructor for parsing so scheme-only
 * strings, port suffixes, userinfo, and IP-literal hosts are handled
 * by the standard library rather than brittle string-split heuristics.
 * Returns the validated label string on success, or a structured
 * {@link ReleaseError} on failure.
 *
 * Validation rejects: malformed URLs (constructor throw), empty
 * hostnames, IPv4 dotted quads, IPv6 literals (bracketed form), and
 * labels that fail {@link isValidReleaseName}.
 */
export function parseBranchUrlLabel(
  branchUrl: string,
  isValidReleaseName: (value: string) => boolean,
): string | ReleaseError {
  let hostname: string;
  try {
    hostname = new URL(branchUrl).hostname;
  } catch {
    return {
      kind: 'missing_branch_url_in_preview',
      message:
        `Cannot parse VERCEL_BRANCH_URL "${branchUrl}" as a URL. ` +
        'Expected an absolute URL with a scheme and host (e.g. https://host).',
    };
  }

  if (hostname.length === 0) {
    return {
      kind: 'missing_branch_url_in_preview',
      message:
        `VERCEL_BRANCH_URL "${branchUrl}" has no hostname. ` +
        'Expected an absolute URL with a host label.',
    };
  }

  if (isIpLiteralHost(hostname)) {
    return {
      kind: 'missing_branch_url_in_preview',
      message:
        `VERCEL_BRANCH_URL hostname "${hostname}" is an IP literal. ` +
        'Expected a named host (the Vercel branch deploy URL).',
    };
  }

  const label = hostname.split('.')[0] ?? '';

  if (!isValidReleaseName(label)) {
    return {
      kind: 'missing_branch_url_in_preview',
      message:
        `VERCEL_BRANCH_URL hostname "${hostname}" leftmost label "${label}" ` +
        'is not a valid Sentry release name (empty, too long, or contains ' +
        'disallowed characters).',
    };
  }

  return label;
}

function isIpLiteralHost(hostname: string): boolean {
  // URL constructor wraps IPv6 hostnames in brackets; IPv4 appears as
  // dotted quads.
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    return true;
  }

  return IPV4_LITERAL_RE.test(hostname);
}
