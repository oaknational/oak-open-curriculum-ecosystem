import { type ConformanceSuite } from './types.js';

/**
 * Parsed CLI state for the `agent-tools mcp-conformance` bin — extracted
 * here with its validator so the pure validation contract is testable
 * without importing the self-executing bin module.
 */
export interface CliState {
  help: boolean;
  unattended: boolean;
  seed: boolean;
  drive: boolean;
  compat: boolean;
  target: string | undefined;
  suites: ConformanceSuite[];
  credentialsFile: string | undefined;
  reportDir: string | undefined;
  baselineDir: string | undefined;
  packOut: string | undefined;
  preambleFile: string | undefined;
  suiteErrors: string[];
}

/**
 * The drive operation's rules (MCP-303): drive enumerates the tool surface
 * from the server itself, so the suite/mode vocabulary of the verdict and
 * seed operations does not apply to it — and the pack flags apply only to
 * it.
 */
function validateDriveUsage(state: CliState): string | undefined {
  if (!state.drive) {
    if (state.packOut !== undefined) {
      return '--pack-out is only meaningful with --drive (the reviewer pack is a drive-run projection)';
    }
    if (state.preambleFile !== undefined) {
      return '--preamble-file is only meaningful with --drive (the reviewer pack is a drive-run projection)';
    }
    return undefined;
  }
  if (state.seed) {
    return '--drive and --seed are different operations — pick one';
  }
  if (state.suites.length > 0) {
    return '--drive enumerates the tool surface from the server itself — drop --suite';
  }
  if (state.unattended) {
    return '--drive has no unattended mode (tool calls need the authed surface) — drop --unattended';
  }
  if (state.baselineDir !== undefined) {
    return '--baseline-dir belongs to the baseline-verdict operation — the drive derives from the live surface; drop the flag';
  }
  return undefined;
}

/**
 * The compat operation's rules. Compat evaluates the served tool surface
 * against a host catalogue, so the suites' vocabulary does not apply to it —
 * and unlike the suites it has no unattended plan at all, because it cannot
 * reach the tool list without the authed surface. It DOES take
 * `--credentials-file` (that is how it reaches the surface). It takes no
 * `--seed`: seeding authors a suite baseline, and compat keeps no baseline —
 * accepting the flag would silently ignore it.
 */
function validateCompatUsage(state: CliState): string | undefined {
  if (!state.compat) {
    return undefined;
  }
  if (state.drive) {
    return '--compat and --drive are different operations — pick one';
  }
  if (state.suites.length > 0) {
    return '--compat evaluates the served surface against the host catalogue — drop --suite';
  }
  if (state.unattended) {
    return '--compat has no unattended mode (reading the tool surface needs the authed surface) — drop --unattended';
  }
  if (state.seed) {
    return '--compat keeps no baseline to seed — drop --seed';
  }
  if (state.baselineDir !== undefined) {
    return '--compat keeps no baseline to read — drop --baseline-dir';
  }
  return undefined;
}

/**
 * A credentialed run against a cleartext target puts the access token on the
 * wire. Loopback is exempt — local capture against a dev server is the
 * documented workflow, and those bytes never leave the machine.
 *
 * Lives in the COMMON checks because the exposure is credential-scoped, not
 * operation-scoped: drive and the authed suites carry the same token as
 * compat. (Review found the earlier compat-only placement left
 * `--drive --credentials-file` against `http://` unrefused.) The caller has
 * already established the target parses as an http(s) URL.
 */
function validateTransportSecurity(parsedTarget: URL, state: CliState): string | undefined {
  if (state.credentialsFile === undefined || parsedTarget.protocol === 'https:') {
    return undefined;
  }
  const loopback = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(parsedTarget.hostname);
  return loopback
    ? undefined
    : '--credentials-file with a non-https --target would send the token in clear — use https (loopback targets are exempt)';
}

/**
 * The credentials-file rules, separated from the structural checks: the
 * unattended plan is credential-free, and the oauth suite never consumes
 * credentials (its argv carries no --credentials-file; the suite drives
 * its own DCR flow), so an oauth-only invocation with the flag would
 * silently drop it — refuse loudly instead. Mixed suite sets keep the
 * flag: protocol/apps consume it.
 */
function validateCredentialsUsage(state: CliState): string | undefined {
  if (state.credentialsFile === undefined) {
    return undefined;
  }
  if (state.unattended) {
    return '--unattended forbids --credentials-file (the unattended plan is credential-free by definition)';
  }
  if (state.suites.length > 0 && state.suites.every((suite) => suite === 'oauth')) {
    return '--credentials-file is not consumed by the oauth suite — drop the flag, or include a suite that uses it (protocol | apps)';
  }
  return undefined;
}

/** The checks every operation shares: suite parsing, duplicates, target. */
function validateCommonUsage(state: CliState): string | undefined {
  if (state.suiteErrors.length > 0) {
    return state.suiteErrors.join('; ');
  }
  const duplicates = [...new Set(state.suites.filter((s, i) => state.suites.indexOf(s) !== i))];
  if (duplicates.length > 0) {
    return `duplicate --suite value(s): ${duplicates.join(', ')} — each suite runs once and writes one <suite>.json raw report`;
  }
  if (state.target === undefined || state.target.trim() === '') {
    return '--target is required';
  }
  return validateTarget(state.target, state);
}

/**
 * The target checks, in dependency order: it must parse, it must be http(s),
 * it must carry no credential, and a credentialed run must not put the token
 * on a cleartext wire.
 *
 * FAILS CLOSED on a target that does not parse or is not http(s), for every
 * operation. Every operation hands the target to `mcpjam --url`, which speaks
 * HTTP — there is no legitimate non-URL or non-http(s) target — and a
 * validator that waves through what it cannot inspect is no validator: review
 * showed the earlier fail-open let a scheme-typo target smuggle `?token=` past
 * every guard, and a `user:secret@host` target parse as protocol `user:`.
 * Refusing both classes outright deletes the residual the emit sites'
 * redaction previously had to justify itself against.
 */
function validateTarget(target: string, state: CliState): string | undefined {
  const parsed = URL.parse(target);
  if (parsed === null) {
    return '--target must be a valid http(s) URL — this target does not parse as a URL';
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return `--target must be an http(s) URL — got protocol ${JSON.stringify(parsed.protocol)}`;
  }
  if (parsed.username !== '' || parsed.password !== '') {
    return '--target must not embed credentials (user:password@) — the target is echoed into reports; pass credentials via --credentials-file';
  }
  if (TARGET_CREDENTIAL_PARAM_PATTERN.test(target)) {
    return '--target must not carry credentials in its query or fragment (access_token, token, code, …) — the target is echoed into reports; pass credentials via --credentials-file';
  }
  return validateTransportSecurity(parsed, state);
}

/**
 * Credential-parameter names scanned for over the RAW target string, not the
 * parsed structure: review showed a fragment carrying its own `?`
 * (`#/cb?code=…`, the SPA OAuth-callback shape) makes `URLSearchParams` read
 * the key as `/cb?code` and slip a structural check. A raw scan cannot be
 * misled by structure.
 *
 * Deliberately BROADER than the redactor's key set in `bounded-excerpt.ts`:
 * this pattern REJECTS a target rather than masking display text, so `token`
 * and bare `code` are safe to name here (no legitimate Oak target carries
 * them as parameters) even though the redactor omits them to avoid masking
 * error/status codes. A target that authenticates via `?api_key=` in its
 * URL — some third-party MCP hosts do — is refused by design; this CLI
 * targets Oak's own surface.
 */
const TARGET_CREDENTIAL_PARAM_PATTERN =
  /\b(?:access_token|refresh_token|client_secret|id_token|code|code_verifier|token|api_key|apikey|accessToken|refreshToken|clientSecret|idToken|codeVerifier)=/iu;

/**
 * Validates the scanned CLI state, returning the bare refusal reason (no
 * usage text — the bin appends its help text at the print site) or
 * undefined when the state is runnable.
 */
export function validateCliState(state: CliState): string | undefined {
  const commonRefusal = validateCommonUsage(state);
  if (commonRefusal !== undefined) {
    return commonRefusal;
  }
  const compatRefusal = validateCompatUsage(state);
  if (compatRefusal !== undefined) {
    return compatRefusal;
  }
  const driveRefusal = validateDriveUsage(state);
  if (driveRefusal !== undefined) {
    return driveRefusal;
  }
  // Drive and compat consume credentials directly; the suites' rules
  // (unattended-forbids, oauth-only-drops) are not their rules.
  return state.drive || state.compat ? undefined : validateCredentialsUsage(state);
}
