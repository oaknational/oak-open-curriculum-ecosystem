#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Vercel runs this script as the ignoreCommand BEFORE pnpm install, so it
// must depend on Node built-ins only. Inline semver parsing covers the §10
// truth-table semantics: a strict X.Y.Z (with optional prerelease + build
// metadata per semver §2) and a `lte` comparison that follows semver §11
// precedence rules. Build-metadata is ignored in precedence per the spec.
//
// @see ../../../../packages/core/build-metadata/src/semver.ts —
// canonical npm-`semver`-backed implementation. The two implementations
// MUST stay byte-equivalent on the regex pattern and behaviour-equivalent
// on validity + ≤ comparison; the parity test at
// `packages/core/build-metadata/tests/semver-parity.test.ts` is the
// anti-drift gate.
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function parseSemver(version) {
  const match = SEMVER_PATTERN.exec(version);
  if (!match) {
    return null;
  }
  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ? prerelease.split('.') : [],
  };
}

function isValidSemver(version) {
  return parseSemver(version) !== null;
}

function comparePrereleaseIdentifiers(a, b) {
  const aIsNumeric = /^\d+$/.test(a);
  const bIsNumeric = /^\d+$/.test(b);
  if (aIsNumeric && bIsNumeric) {
    const aNumber = Number(a);
    const bNumber = Number(b);
    if (aNumber < bNumber) {
      return -1;
    }
    if (aNumber > bNumber) {
      return 1;
    }
    return 0;
  }
  if (aIsNumeric) {
    return -1;
  }
  if (bIsNumeric) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function comparePrereleaseArrays(a, b) {
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const result = comparePrereleaseIdentifiers(a[index], b[index]);
    if (result !== 0) {
      return result;
    }
  }
  if (a.length < b.length) {
    return -1;
  }
  if (a.length > b.length) {
    return 1;
  }
  return 0;
}

function isLessThanOrEqual(currentVersion, previousVersion) {
  const current = parseSemver(currentVersion);
  const previous = parseSemver(previousVersion);
  if (!current || !previous) {
    return false;
  }
  for (const key of ['major', 'minor', 'patch']) {
    if (current[key] < previous[key]) {
      return true;
    }
    if (current[key] > previous[key]) {
      return false;
    }
  }
  // Major/minor/patch are equal — apply semver §11 prerelease precedence:
  // a version with prerelease has lower precedence than one without.
  if (current.prerelease.length === 0 && previous.prerelease.length === 0) {
    return true;
  }
  if (current.prerelease.length > 0 && previous.prerelease.length === 0) {
    return true;
  }
  if (current.prerelease.length === 0 && previous.prerelease.length > 0) {
    return false;
  }
  return comparePrereleaseArrays(current.prerelease, previous.prerelease) <= 0;
}

function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

// ---------------------------------------------------------------------------
// Trust-boundary input validation for VERCEL_GIT_PREVIOUS_SHA.
// ---------------------------------------------------------------------------

/**
 * Canonical Vercel-emitted git SHA pattern: 40-char lowercase hex (SHA-1).
 * Vercel's documentation describes `VERCEL_GIT_*` variables as
 * pass-through from the upstream provider, which means they are
 * outside Oak's trust boundary; an attacker who controls the upstream
 * (or an attacker on a forked PR build, depending on Vercel's trust
 * model for that case) can place arbitrary bytes here.
 *
 * `git` itself parses leading-`-` argv tokens as flags
 * (`--upload-pack=<cmd>`, `--output=<path>`, `--exec-path=<path>`,
 * `--config <key>=<value>`), several of which can hijack git's own
 * behaviour. Refusing such values at the trust boundary, BEFORE they
 * reach any `execFileSync('git', …)` call, is the primary cure.
 */
const GIT_SHA_PATTERN = /^[0-9a-f]{40}$/;

/**
 * Validate a git SHA at the trust boundary. Returns the value unchanged
 * if it matches the canonical 40-char-lowercase-hex pattern that Vercel
 * emits as `VERCEL_GIT_PREVIOUS_SHA`; returns `null` otherwise.
 *
 * Uppercase hex is rejected even though `git` accepts it case-insensitively
 * — Vercel's emission is lowercase, so any deviation indicates either
 * upstream corruption or an attempted bypass and should be refused at
 * the boundary rather than normalised through.
 *
 * Cites ADR-024 (DI as named capabilities), ADR-078 (DI for
 * testability), ADR-158 (multi-layer security and rate limiting).
 *
 * @param value - candidate value (`unknown`), typically `process.env.VERCEL_GIT_PREVIOUS_SHA`.
 * @returns the value if valid (string), or `null` otherwise.
 */
export function validateGitSha(value) {
  if (typeof value !== 'string') {
    return null;
  }
  return GIT_SHA_PATTERN.test(value) ? value : null;
}

/**
 * Produce an operator-readable reason a candidate value failed
 * `validateGitSha`, *without* echoing any of the candidate's bytes.
 * Used in the trust-boundary diagnostic so a build-log reader can act
 * without the raw value being routed through stderr.
 */
function describeShaValidationFailure(value) {
  if (typeof value !== 'string') {
    return 'non-string-input';
  }
  if (value.length !== 40) {
    return 'wrong-length';
  }
  if (value.startsWith('-')) {
    return 'leading-dash';
  }
  if (/[A-Z]/.test(value)) {
    return 'uppercase-hex';
  }
  if (!/^[0-9a-f]+$/.test(value)) {
    return 'non-hex-characters';
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Defence-in-depth environment + binary location for `git` subprocess execution.
// ---------------------------------------------------------------------------

/**
 * Absolute path to the `git` binary. The script invokes `git` via this
 * absolute path so the subprocess never consults `PATH`, removing the
 * S4036-class binary-substitution attack surface entirely (an attacker
 * who could manipulate `PATH` cannot redirect to a hostile binary because
 * the lookup never happens). On Vercel's Linux runtime and on standard
 * Linux/macOS dev machines, `git` lives at `/usr/bin/git`. If a future
 * runtime ships `git` elsewhere, the e2e contract test
 * (`e2e-tests/vercel-ignore-runtime.e2e.test.ts`) fails first, and
 * `GIT_BINARY` is updated deliberately with the failure evidence
 * recorded in this TSDoc.
 */
const GIT_BINARY = '/usr/bin/git';

/**
 * Build a deliberately scrubbed environment object for `git` subprocess
 * execution. Used by `gitShowFileAtSha` and `gitFetchShallow` when they
 * spawn `git` via `execFileSync`.
 *
 * Posture:
 * - **No PATH** — the capabilities invoke `git` via the absolute
 *   {@link GIT_BINARY} path, so `PATH` is never consulted by the
 *   subprocess. Closes the S4036 binary-substitution surface entirely.
 * - **`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_SYSTEM` pinned to `/dev/null`** —
 *   neutralises any hostile global or system gitconfig that might be
 *   present on the runtime. This is the single highest-leverage hardening
 *   against config-driven exploitation paths.
 * - **`GIT_TERMINAL_PROMPT=0`** — prevents `git` from blocking the
 *   non-interactive build on a credential prompt.
 * - **`HOME` deliberately omitted** — `git` consults `~/.gitconfig` when
 *   `HOME` is set; omitting it removes that surface entirely. The e2e
 *   contract test (`e2e-tests/vercel-ignore-runtime.e2e.test.ts`)
 *   asserts `git show` succeeds against the actual repository under this
 *   env so the omission does not break Vercel-equivalent runtimes.
 * - **All other inherited env keys dropped** — `GIT_SSH_COMMAND`,
 *   `GIT_EXEC_PATH`, `LD_PRELOAD`, etc. are not passed through.
 *
 * Cites ADR-158.
 *
 * @returns the scrubbed environment object as a `Record\<string, string\>`.
 */
export function scrubbedGitEnv() {
  return {
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_TERMINAL_PROMPT: '0',
  };
}

// ---------------------------------------------------------------------------
// Capability-narrow git operations.
// ---------------------------------------------------------------------------

function assertValidatedSha(sha) {
  if (typeof sha !== 'string' || !GIT_SHA_PATTERN.test(sha)) {
    throw new Error('invalid git sha (capability-internal defence-in-depth)');
  }
}

/**
 * Defence-in-depth check on `filePath` for `gitShowFileAtSha`. Today
 * the only caller passes the literal `'package.json'`, so the live
 * injection surface is zero. The check exists to prevent latent
 * vulnerability if the capability is reused with a caller-supplied
 * path: a leading `-` could be reinterpreted by `git` as a flag, and
 * a newline could enable log-injection via the surrounding stderr
 * diagnostic surface.
 */
function assertSafeFilePath(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    throw new Error('invalid filePath (must be a non-empty string)');
  }
  if (filePath.startsWith('-')) {
    throw new Error('invalid filePath (leading "-" is reserved for argv flags)');
  }
  if (/[\r\n]/.test(filePath)) {
    throw new Error('invalid filePath (must not contain newlines)');
  }
}

/**
 * Read `<filePath>` from the git tree at `<sha>` and return its contents
 * as a UTF-8 string. Wraps `git show <sha>:<filePath>`.
 *
 * Defence-in-depth: re-validates `<sha>` against `GIT_SHA_PATTERN` even
 * though the caller is expected to validate at the trust boundary. The
 * subprocess runs with `scrubbedGitEnv()` (see that function's TSDoc for
 * the env posture).
 *
 * Cites ADR-024 (DI as named capabilities — this is one of the two
 * capabilities consumed by `runVercelIgnoreCommand`).
 *
 * @param sha - must be a 40-char lowercase hex string.
 * @param filePath - repository-relative path of the file to read.
 * @param cwd - absolute path of the repository root.
 * @returns the file contents as a UTF-8 string.
 */
export function gitShowFileAtSha(sha, filePath, cwd) {
  assertValidatedSha(sha);
  assertSafeFilePath(filePath);
  return execFileSync(GIT_BINARY, ['show', `${sha}:${filePath}`], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: scrubbedGitEnv(),
  });
}

/**
 * Fetch the git object at `<sha>` from the `origin` remote with depth=1.
 * Wraps `git fetch --depth=1 origin <sha>`.
 *
 * Defence-in-depth: re-validates `<sha>`. The subprocess runs with
 * `scrubbedGitEnv()`.
 *
 * Cites ADR-024.
 *
 * @param sha - must be a 40-char lowercase hex string.
 * @param cwd - absolute path of the repository root.
 * @returns `git fetch` stdout (typically empty) as a UTF-8 string.
 */
export function gitFetchShallow(sha, cwd) {
  assertValidatedSha(sha);
  return execFileSync(GIT_BINARY, ['fetch', '--depth=1', 'origin', sha], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: scrubbedGitEnv(),
  });
}

// ---------------------------------------------------------------------------
// File-read helpers.
// ---------------------------------------------------------------------------

function safeReadCurrentVersion(readFile, packageJsonPath, stderr) {
  let text;
  try {
    text = readFile(packageJsonPath, 'utf8');
  } catch (readError) {
    const readMessage = readError instanceof Error ? readError.message : String(readError);
    stderr.write(
      `Current-version probe: package.json read failed (${readMessage}); treating current as unresolvable.\n`,
    );
    return undefined;
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (parseError) {
    const parseMessage = parseError instanceof Error ? parseError.message : String(parseError);
    stderr.write(
      `Current-version probe: package.json parse failed (${parseMessage}); treating current as unresolvable.\n`,
    );
    return undefined;
  }
  const version = trimToUndefined(parsed.version);
  return version && isValidSemver(version) ? version : undefined;
}

function attemptShowAfterShallowFetch(deps, repositoryRoot, validatedSha) {
  const { gitShowFileAtSha, gitFetchShallow, stderr } = deps;
  try {
    gitFetchShallow(validatedSha, repositoryRoot);
  } catch (fetchError) {
    const fetchMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
    stderr.write(
      `Previous-version probe: shallow fetch failed (${fetchMessage}); treating previous as unset.\n`,
    );
    return undefined;
  }
  try {
    return gitShowFileAtSha(validatedSha, 'package.json', repositoryRoot);
  } catch (retryError) {
    const retryMessage = retryError instanceof Error ? retryError.message : String(retryError);
    stderr.write(
      `Previous-version probe: post-fetch show failed (${retryMessage}); treating previous as unset.\n`,
    );
    return undefined;
  }
}

function readPackageJsonText(deps, repositoryRoot, validatedSha) {
  const { gitShowFileAtSha, stderr } = deps;
  try {
    return gitShowFileAtSha(validatedSha, 'package.json', repositoryRoot);
  } catch (showError) {
    const showMessage = showError instanceof Error ? showError.message : String(showError);
    stderr.write(
      `Previous-version probe: initial show failed (${showMessage}); attempting shallow fetch fallback.\n`,
    );
    return attemptShowAfterShallowFetch(deps, repositoryRoot, validatedSha);
  }
}

function safeReadPreviousVersion(deps, repositoryRoot, validatedSha) {
  if (!validatedSha) {
    return undefined;
  }
  const text = readPackageJsonText(deps, repositoryRoot, validatedSha);
  if (text === undefined) {
    return undefined;
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (parseError) {
    const parseMessage = parseError instanceof Error ? parseError.message : String(parseError);
    deps.stderr.write(
      `Previous-version probe: package.json parse failed (${parseMessage}); treating previous as unset.\n`,
    );
    return undefined;
  }
  const previousVersion = trimToUndefined(parsed.version);
  return previousVersion && isValidSemver(previousVersion) ? previousVersion : undefined;
}

/**
 * Implements the production-build cancellation truth table from
 * ADR-163 §10 (second amendment, 2026-04-24). Consumed by the Vercel
 * `ignoreCommand` wired in this workspace's `vercel.json`; exit `0`
 * cancels, exit `1` continues.
 *
 * Rule (§10 truth table):
 *
 * - `VERCEL_GIT_COMMIT_REF !== 'main'` → continue (no file IO).
 * - `main`, current unresolvable → CANCEL with stderr diagnostic.
 * - `main`, previous unresolvable / unset → continue (no previous to
 *   beat; first build).
 * - `main`, current ≤ previous (semver-precedence) → CANCEL.
 * - `main`, current \> previous → continue.
 *
 * Asymmetry rationale: current unresolvable is a deterministic repo
 * defect under Oak's single-root-package.json topology; previous
 * unresolvable is dominated by transient causes. The first amendment's
 * single fail-open clause is superseded by this asymmetry.
 *
 * Trust-boundary discipline: `env.VERCEL_GIT_PREVIOUS_SHA` is treated
 * as untrusted input from Vercel's upstream-provider pass-through. It
 * is validated against `GIT_SHA_PATTERN` once at the boundary; only
 * the validated value flows into the `gitShowFileAtSha` /
 * `gitFetchShallow` capabilities, which re-validate as defence-in-depth.
 * Hostile values are treated as if previous were unset (continuing the
 * fail-open posture of the truth table) AND emit a stderr diagnostic
 * naming the offending value's length only — attacker-controlled
 * values are never logged raw.
 *
 * Binary-location posture: the git capabilities invoke `git` via the
 * absolute {@link GIT_BINARY} path, so `PATH` is never read by this
 * script and is not part of the data flow into `execFileSync`. The
 * earlier eager PATH-absence precondition (Phase 1 first cut) was
 * removed when {@link scrubbedGitEnv} stopped consulting `PATH` —
 * there is no longer a runtime defect to surface eagerly because the
 * binary location is fixed at module scope.
 *
 * Dependency posture: this script runs as Vercel's `ignoreCommand`,
 * which executes BEFORE `pnpm install`. It MUST therefore depend only
 * on Node built-ins. Semver validation and precedence comparison are
 * inlined above per semver.org §2 / §11.
 *
 * Cites ADR-024 (DI as named capabilities), ADR-078 (DI for
 * testability), ADR-158 (multi-layer security and rate limiting),
 * ADR-163 §10.
 *
 * @param options - options bag carrying the repo root, env, optional
 *   IO streams, and optional git capability overrides for testability.
 *   Required: `repositoryRoot` (absolute path) and `env` (typically
 *   `process.env`). Optional: `stdout` and `stderr` (default to the
 *   process streams), `readFile` (defaults to `readFileSync`),
 *   `gitShowFileAtSha` and `gitFetchShallow` (default to the
 *   production capabilities defined in this module).
 */
export function runVercelIgnoreCommand(options) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const readFile = options.readFile ?? readFileSync;
  const showCapability = options.gitShowFileAtSha ?? gitShowFileAtSha;
  const fetchCapability = options.gitFetchShallow ?? gitFetchShallow;
  const env = options.env;
  const repositoryRoot = options.repositoryRoot;

  if (env.VERCEL_GIT_COMMIT_REF !== 'main') {
    const branchLabel = env.VERCEL_GIT_COMMIT_REF ?? '(unset)';
    stdout.write(
      `Branch is "${branchLabel}", not main; production cancellation gate skipped, build will continue.\n`,
    );
    return { exitCode: 1 };
  }

  const currentVersion = safeReadCurrentVersion(
    readFile,
    path.resolve(repositoryRoot, 'package.json'),
    stderr,
  );
  if (!currentVersion) {
    stderr.write(
      'The current app version could not be determined from the root package.json file. This is a build error; cancelling.\n',
    );
    return { exitCode: 0 };
  }

  // Trust-boundary validation of VERCEL_GIT_PREVIOUS_SHA — see TSDoc above.
  // Diagnostic names length and a reason hint, never the raw value: a
  // 40-char uppercase string would otherwise emit only `length=40` and
  // confuse an operator reading the build log.
  const rawPreviousSha = trimToUndefined(env.VERCEL_GIT_PREVIOUS_SHA);
  let validatedSha;
  if (rawPreviousSha === undefined) {
    validatedSha = undefined;
  } else {
    const checked = validateGitSha(rawPreviousSha);
    if (checked === null) {
      const reason = describeShaValidationFailure(rawPreviousSha);
      stderr.write(
        `VERCEL_GIT_PREVIOUS_SHA failed boundary validation (length=${rawPreviousSha.length}, reason=${reason}); treating previous as unset.\n`,
      );
      validatedSha = undefined;
    } else {
      validatedSha = checked;
    }
  }

  const previousVersion = safeReadPreviousVersion(
    { gitShowFileAtSha: showCapability, gitFetchShallow: fetchCapability, stderr },
    repositoryRoot,
    validatedSha,
  );

  if (previousVersion && isLessThanOrEqual(currentVersion, previousVersion)) {
    stdout.write(
      `Cancelling production build: root package.json version ${currentVersion} did not advance beyond previous deployed version ${previousVersion} (${validatedSha}).\n`,
    );
    return { exitCode: 0 };
  }

  const previousLabel = previousVersion ?? 'unknown (treating as first build)';
  stdout.write(
    `Continuing production build: current=${currentVersion}, previous=${previousLabel}.\n`,
  );
  return { exitCode: 1 };
}

const thisFileUrl = import.meta.url;
const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;
if (thisFileUrl === invokedUrl) {
  const thisDir = path.dirname(fileURLToPath(thisFileUrl));
  const repositoryRoot = path.resolve(thisDir, '../../..');
  const result = runVercelIgnoreCommand({
    repositoryRoot,
    env: process.env,
  });
  process.exit(result.exitCode);
}
