/**
 * Bounded, labelled excerpts of child-process streams for embedding in
 * failure reasons (MCP-189), and the credential redactor every emit path
 * reaches for. A LEAF module by design: it depends on nothing, so the
 * evidence gates, the spawn seam, and the CLI orchestrators can all import
 * it without any edge back into outcome composition.
 */
const EXCERPT_MAX_CHARS = 2000;

/**
 * A labelled, bounded excerpt of a child-process stream. Empty content
 * yields an empty string; truncation is always EXPLICIT — the marker
 * names the trimmed length, "truncated from N trimmed chars" — because a
 * silently-shortened diagnostic would be the lossy twin of the evidence
 * destruction the verbatim-retention contract exists to prevent. These
 * excerpts are DIAGNOSTICS riding a failure reason, never a substitute
 * for retained evidence artefacts.
 */
export function boundedExcerpt(label: string, content: string): string {
  const trimmed = redactCredentials(content.trim());
  if (trimmed === '') {
    return '';
  }
  const body =
    trimmed.length <= EXCERPT_MAX_CHARS
      ? trimmed
      : `${trimmed.slice(0, EXCERPT_MAX_CHARS)} … (truncated from ${String(trimmed.length)} trimmed chars)`;
  return ` — ${label}: ${body}`;
}

/**
 * Failure reasons ride onto STDOUT and into CI job logs, where the retention
 * layer's owner-only 0600 discipline does not reach — so credential shapes
 * are stripped before any of that text is composed.
 *
 * EXPORTED because excerpts are not the only path. A parsed vendor error
 * envelope reaches a failure reason without passing through `boundedExcerpt`,
 * and went unredacted until review caught it: every caller that puts vendor
 * text into a reason redacts it here. Treating this as "the single choke
 * point" was the mistake — it is the single redactor, and callers must reach
 * for it.
 *
 * The pattern set started from the vendor's own `redactSensitiveString`
 * (bundled in `@mcpjam/sdk@2.4.0` `dist/index.js`, a `src/redaction.ts`
 * section marker above it), kept local rather than imported: a dozen lines do
 * not justify an `@mcpjam/sdk` edge into agent-tools. It deviates from the
 * vendor's set where review proved the vendor wrong or short — each deviation
 * documented at its pattern. The one key deliberately ABSENT is bare `code`:
 * masking it would hide the vendor error codes and exit/status codes this
 * wrapper exists to display. `cli-validation.ts` keeps a deliberately broader
 * name list for REFUSING a target (it can name `code` and `token` because it
 * rejects rather than masks) — the two differ on purpose.
 *
 * RULE ORDER IS LOAD-BEARING: the key=value rule runs before the scheme rule,
 * so `Bearer access_token=SECRET` is already masked when the scheme rule's
 * token class (which admits `_`) reaches it. The vendor orders these the
 * other way and guards with a negative lookahead — which wrongly exempts a
 * padded base64 token (`Bearer c3VwZXJzZWNyZXQ=` is letters-then-`=`, so the
 * lookahead fires on the token itself and the value leaks). Ordering needs no
 * lookahead and has no such hole.
 *
 * THIS FILTER IS A DELIBERATELY INCOMPLETE BACKUP, AND THAT IS A DECISION
 * (owner, 2026-08-21). The gate is the structural layer: `cli-validation.ts`
 * refuses credential-bearing, unparseable, and non-http(s) targets outright,
 * and every disk artefact is written owner-only. This redactor only softens
 * what a VENDOR might echo into display text, and a pattern list over
 * arbitrary text can always be beaten by one more shape — three review
 * rounds each found one. The invariant it does promise is mechanical and
 * tested: every name below masks in EVERY form (header line, key=value,
 * JSON field) because all three rules derive from the same two lists.
 * Findings outside that invariant (novel names, novel forms) are accepted
 * residuals, not defects — extend the lists when a real capture shows a
 * real shape, and otherwise leave it alone.
 */

/**
 * Names whose VALUES are credentials wherever they appear as `name=value` or
 * as a JSON field. Bare `code` is deliberately absent — masking it would hide
 * the vendor error codes and exit/status codes this wrapper exists to show.
 */
export const CREDENTIAL_PARAM_NAMES = [
  'access_token',
  'refresh_token',
  'client_secret',
  'id_token',
  'code_verifier',
  'accessToken',
  'refreshToken',
  'clientSecret',
  'idToken',
  'codeVerifier',
  'api_key',
  'apikey',
] as const;

/** Header names whose whole line (or JSON field value) is a credential. */
export const CREDENTIAL_HEADER_NAMES = [
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'api-key',
  'x-api-key',
  'x-auth-token',
] as const;

// All three rules are BUILT from the lists above, so a name added to a list
// is masked in every form at once — the "added to one rule, forgot its
// sibling" defect class (three occurrences across three review rounds) is
// unwritable now. Names are [a-z_-] only, so no regex escaping is needed.
const HEADER_ALT = CREDENTIAL_HEADER_NAMES.join('|');
const PARAM_ALT = CREDENTIAL_PARAM_NAMES.join('|');
const JSON_KEY_ALT = [...CREDENTIAL_PARAM_NAMES, ...CREDENTIAL_HEADER_NAMES].join('|');

const HEADER_LINE_RULE = new RegExp(String.raw`\b(${HEADER_ALT})\s*:\s*[^\r\n]*`, 'giu');
const KEY_VALUE_RULE = new RegExp(String.raw`\b(${PARAM_ALT})=[^&\s]+`, 'giu');
// The JSON value class excludes newlines (the vendor's does not): an
// unbalanced quote in a truncated stream would otherwise let one match
// swallow the following diagnostic lines without a marker. The closing quote
// is optional for the same case, so the truncated fragment is still masked
// up to the line end rather than left in clear.
const JSON_FIELD_RULE = new RegExp(
  String.raw`(["']?(?:${JSON_KEY_ALT})["']?\s*:\s*["'])[^"'\r\n]*(["']?)`,
  'giu',
);

export function redactCredentials(content: string): string {
  return (
    content
      // URL userinfo (`scheme://user:pass@host`). Not in the vendor's set.
      // Defence in depth behind the validator's refusal of userinfo targets:
      // vendor-echoed text never went through the validator at all.
      .replaceAll(/(\/\/)[^/\s@]+@/gu, '$1[redacted]@')
      .replaceAll(HEADER_LINE_RULE, '$1: [redacted]')
      // Runs BEFORE the scheme rule — see the header comment.
      .replaceAll(KEY_VALUE_RULE, '$1=[redacted]')
      // Bare `Bearer <token>` outside any header line — the vendor's scope,
      // kept: `Bearer` is not an English word, so it cannot collide with
      // prose. Bare `Basic`/`DPoP` were tried and reverted (2026-08-21):
      // `basic` ate the next word of ordinary diagnostics ("Basic auth
      // failed" → "Basic [redacted] failed"). Those schemes on a header line
      // are still masked whole; their bare forms are accepted residuals. The
      // token class is lowercase-only because the `i` flag covers case;
      // `$1` preserves the original spelling.
      .replaceAll(/\b(bearer)\s+[a-z0-9\-._~+/]+=*/giu, '$1 [redacted]')
      .replaceAll(JSON_FIELD_RULE, '$1[redacted]$2')
  );
}
