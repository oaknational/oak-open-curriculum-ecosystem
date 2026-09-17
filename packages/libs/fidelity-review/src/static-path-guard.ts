/*
 * Pure path-resolution guards for the demo apps' static export servers — a
 * leaf module (no IO, no module-init side effects) so the traversal and
 * decode guards' behaviour tests import exactly what they describe. These
 * are security-critical path/IO guards: per consolidate-at-second-consumer
 * they live here, once, and every app server imports them. Each app keeps
 * its own server (single-root or overlay) on top of these decisions.
 */
import path from 'node:path';

/** Decode a raw request URL to its query-stripped path, or undefined on a
 *  malformed percent-escape or an embedded NUL. This runs inside an http
 *  request listener — a throw there kills the run raw, outside any runTool
 *  process boundary — so malformed input is a 404 decision, never an
 *  exception. The NUL check keeps the module's contract honest for every
 *  caller: a decoded `%00` survives resolution but makes fs.statSync /
 *  createReadStream throw ERR_INVALID_ARG_VALUE, so it must die here. */
export function decodeUrlPath(rawUrl: string): string | undefined {
  const queryIdx = rawUrl.indexOf('?');
  const encoded = queryIdx === -1 ? rawUrl : rawUrl.slice(0, queryIdx);
  try {
    const decoded = decodeURIComponent(encoded);
    return decoded.includes('\0') ? undefined : decoded;
  } catch {
    return undefined;
  }
}

/**
 * Resolve a request URL to a filesystem path inside `rootDir`, or undefined
 * when the request is malformed, the root is not absolute, or the request
 * escapes the root. Pure decision: canonicalise FIRST (resolve() normalises
 * any ../ segments), then validate with a sep-suffixed prefix check — which
 * also rejects sibling directories that share `rootDir` as a string prefix.
 * No filesystem access here — CONTAINMENT IS LEXICAL: a symlink inside the
 * root that points outside it will be followed by whatever serves the
 * resolved path. The demo export roots are local, tool-generated trees, so
 * this module does not pay a realpath round-trip; a consumer serving a root
 * that can contain untrusted symlinks must add an fs.realpathSync
 * containment check after resolution.
 */
export function resolveWithinRoot(rootDir: string, rawUrl: string): string | undefined {
  // An absolute root is the caller's contract (the same refusal shape as
  // dev-server's demoDir): silently anchoring a relative root at the cwd
  // would make the guard's answer depend on ambient state.
  if (!path.isAbsolute(rootDir)) {
    return undefined;
  }
  const urlPath = decodeUrlPath(rawUrl);
  if (!urlPath?.startsWith('/')) {
    // Undefined (malformed) — or a non-origin-form target: absolute-form
    // ('http://…'), authority-form, and asterisk-form targets would
    // otherwise resolve to nonsense in-root paths via dot-segment
    // collapse rather than being refused.
    return undefined;
  }
  // Canonicalise the root before resolving AND checking: the guard judges
  // canonical paths, never the caller's spelling — a trailing separator on
  // `rootDir` would otherwise build a double-separator prefix that rejects
  // every in-root file.
  const canonicalRoot = path.resolve(rootDir);
  const resolved = path.resolve(canonicalRoot, `.${urlPath}`);
  return resolved.startsWith(canonicalRoot + path.sep) ? resolved : undefined;
}
