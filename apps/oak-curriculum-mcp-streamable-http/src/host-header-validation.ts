/**
 * Converts a host allow-list pattern into an anchored regex.
 * Supports simple `*` wildcards.
 */
function hostPatternToRegex(pattern: string): RegExp {
  const regexPattern = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '[a-z0-9.-]*') + '$';
  return new RegExp(regexPattern);
}

/**
 * Returns true when a hostname matches one of the allow-list entries.
 * Supports exact entries and simple wildcard entries (`*.example.com`).
 */
export function isAllowedHostname(hostname: string, allowedHosts: readonly string[]): boolean {
  for (const rawAllowedHost of allowedHosts) {
    const allowedHost = rawAllowedHost.trim().toLowerCase();
    if (!allowedHost) {
      continue;
    }
    if (allowedHost.includes('*')) {
      if (hostPatternToRegex(allowedHost).test(hostname)) {
        return true;
      }
      continue;
    }
    if (allowedHost === hostname) {
      return true;
    }
  }
  return false;
}

function hasForbiddenHostCharacters(host: string): boolean {
  return (
    host.includes('@') ||
    host.includes('/') ||
    host.includes('?') ||
    host.includes('#') ||
    host.includes(' ')
  );
}

function isValidBracketedHost(host: string): boolean {
  return /^\[[0-9a-fA-F:.]+\](?::\d+)?$/.test(host);
}

function isValidPlainHost(host: string): boolean {
  const match = /^([A-Za-z0-9.-]+)(?::\d+)?$/.exec(host);
  if (!match) {
    return false;
  }
  const hostname = match[1];
  if (hostname.startsWith('.') || hostname.endsWith('.') || hostname.includes('..')) {
    return false;
  }
  const labels = hostname.split('.');
  if (labels.some((label) => label.length === 0)) {
    return false;
  }
  return labels.every((label) => /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label));
}

/**
 * Returns true when a Host header value is in a safe canonical format.
 */
export function isValidHostHeader(host: string): boolean {
  // Reject userinfo, path, query, fragments, and whitespace in Host header.
  if (hasForbiddenHostCharacters(host)) {
    return false;
  }
  if (host.startsWith('[')) {
    return isValidBracketedHost(host);
  }
  return isValidPlainHost(host);
}
