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

import { RELEASE_ERROR_KINDS, type ReleaseError } from './release-types.js';

const IPV4_LITERAL_RE = /^\d{1,3}(\.\d{1,3}){3}$/u;
const SCHEME_DELIMITER = '://';

/**
 * Parse a `VERCEL_BRANCH_URL` hostname's leftmost label.
 *
 * @remarks `VERCEL_BRANCH_URL` is documented as a hostname only — no
 * scheme. See
 * https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL
 * — "The domain name of a Generated Deployment URL". A scheme is
 * therefore prepended internally so the standard `URL` constructor
 * can normalise port suffixes, userinfo, and IP-literal hosts; the
 * scheme is never trusted to come from the input. A scheme-prefixed
 * input is rejected explicitly because it indicates a misconfigured
 * caller and would otherwise produce a corrupted leftmost label
 * (e.g. `https://example.com` would yield label `https`).
 *
 * Returns the validated label string on success, or a structured
 * {@link ReleaseError} on failure.
 *
 * Validation rejects: scheme-prefixed inputs, malformed hostnames
 * (URL constructor throw), empty hostnames, IPv4 dotted quads, IPv6
 * literals (bracketed form), and labels that fail
 * {@link isValidReleaseName}.
 */
export function parseBranchUrlLabel(
  branchUrl: string,
  isValidReleaseName: (value: string) => boolean,
): string | ReleaseError {
  const hostnameResult = extractHostnameFromBranchUrl(branchUrl);
  if (typeof hostnameResult !== 'string') {
    return hostnameResult;
  }

  const label = hostnameResult.split('.')[0] ?? '';

  if (!isValidReleaseName(label)) {
    return {
      kind: RELEASE_ERROR_KINDS.missing_branch_url_in_preview,
      message:
        `VERCEL_BRANCH_URL hostname "${hostnameResult}" leftmost label "${label}" ` +
        'is not a valid Sentry release name (empty, too long, or contains ' +
        'disallowed characters).',
    };
  }

  return label;
}

function extractHostnameFromBranchUrl(branchUrl: string): string | ReleaseError {
  if (branchUrl.includes(SCHEME_DELIMITER)) {
    return {
      kind: RELEASE_ERROR_KINDS.missing_branch_url_in_preview,
      message:
        `VERCEL_BRANCH_URL "${branchUrl}" must be a hostname, not a full URL. ` +
        'Vercel populates this without a scheme — e.g. ' +
        '"feat-x-poc-oak.vercel.thenational.academy". ' +
        'See https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL.',
    };
  }

  let hostname: string;
  try {
    hostname = new URL(`https://${branchUrl}`).hostname;
  } catch {
    return {
      kind: RELEASE_ERROR_KINDS.missing_branch_url_in_preview,
      message:
        `Cannot parse VERCEL_BRANCH_URL "${branchUrl}" as a hostname. ` +
        'Expected a Vercel-style domain name (no scheme).',
    };
  }

  if (hostname.length === 0) {
    return {
      kind: RELEASE_ERROR_KINDS.missing_branch_url_in_preview,
      message:
        `VERCEL_BRANCH_URL "${branchUrl}" has no hostname. ` + 'Expected a non-empty domain label.',
    };
  }

  if (isIpLiteralHost(hostname)) {
    return {
      kind: RELEASE_ERROR_KINDS.missing_branch_url_in_preview,
      message:
        `VERCEL_BRANCH_URL hostname "${hostname}" is an IP literal. ` +
        'Expected a named host (the Vercel branch deploy URL).',
    };
  }

  return hostname;
}

function isIpLiteralHost(hostname: string): boolean {
  // URL constructor wraps IPv6 hostnames in brackets; IPv4 appears as
  // dotted quads.
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    return true;
  }

  return IPV4_LITERAL_RE.test(hostname);
}
