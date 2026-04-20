import { describe, expect, it } from 'vitest';
import {
  runSentryReleaseAndDeploy,
  type CliResponse,
  type RunSentryReleaseAndDeployOptions,
} from './sentry-release-and-deploy.js';

// ADR-163 §6 sequence — one orchestrator script invoked by the Vercel Build
// Command. Tests verify per-step posture, preflight gating, and §6.1
// idempotency via the `releases info` probe. Fakes-as-arguments; no
// subprocess spawn; no process.env / process.cwd access.
//
// §6.1 idempotency refinement (pending ADR-163 amendment):
// The orchestrator probes `releases info` BEFORE §6.1. If the release
// already exists, §6.1 and §6.2 are skipped entirely to preserve the
// original commit attribution (re-running set-commits overwrites the
// SHA binding on the existing release).

const VERSION = '1.5.0';
const SHA = 'abcdef1234567';
const ORG_OWNER = 'oaknational';
const REPO_SLUG = 'oak-open-curriculum-ecosystem';
const AUTH_TOKEN = 'sntrys-fake-token';

const SUCCESS: CliResponse = { exitCode: 0, stdout: '', stderr: '' };
const FAILURE: CliResponse = { exitCode: 1, stdout: '', stderr: 'network error' };
const NOT_FOUND: CliResponse = { exitCode: 1, stdout: '', stderr: 'Not found' };

interface RecordedCall {
  readonly kind: 'cli' | 'script';
  readonly argv: readonly string[];
  readonly scriptEnv?: Readonly<Record<string, string>>;
}

interface Fake {
  readonly calls: RecordedCall[];
  readonly execCli: (argv: readonly string[]) => CliResponse;
  readonly execScript: (path: string, scriptEnv: Readonly<Record<string, string>>) => CliResponse;
}

function createFake(responses: readonly CliResponse[]): Fake {
  const calls: RecordedCall[] = [];
  const next = (): CliResponse => {
    const response = responses[calls.length];
    return response ?? SUCCESS;
  };

  return {
    calls,
    execCli: (argv) => {
      const response = next();
      calls.push({ kind: 'cli', argv: [...argv] });
      return response;
    },
    execScript: (path, scriptEnv) => {
      const response = next();
      calls.push({ kind: 'script', argv: [path], scriptEnv: { ...scriptEnv } });
      return response;
    },
  };
}

interface WriteSink {
  write(chunk: string | Uint8Array): boolean;
}

function writableArray(buffer: string[]): WriteSink {
  return {
    write(chunk: string | Uint8Array): boolean {
      buffer.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
      return true;
    },
  };
}

interface TestOptionOverrides {
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly responses?: readonly CliResponse[];
  readonly readFile?: RunSentryReleaseAndDeployOptions['readFile'];
  readonly readdirSync?: RunSentryReleaseAndDeployOptions['readdirSync'];
  readonly existsSync?: RunSentryReleaseAndDeployOptions['existsSync'];
}

interface TestHarness {
  readonly options: RunSentryReleaseAndDeployOptions;
  readonly fake: Fake;
  readonly stdout: string[];
  readonly stderr: string[];
}

function harness(overrides: TestOptionOverrides = {}): TestHarness {
  // By default the release does NOT exist (probe returns NOT_FOUND),
  // so §6.1 + §6.2 run and the full five-step sequence executes.
  const defaultResponses: readonly CliResponse[] = [NOT_FOUND];
  const fake = createFake(overrides.responses ?? defaultResponses);
  const stdout: string[] = [];
  const stderr: string[] = [];
  const options: RunSentryReleaseAndDeployOptions = {
    env: {
      VERCEL_ENV: 'production',
      VERCEL_GIT_COMMIT_REF: 'main',
      VERCEL_GIT_COMMIT_SHA: SHA,
      VERCEL_GIT_REPO_OWNER: ORG_OWNER,
      VERCEL_GIT_REPO_SLUG: REPO_SLUG,
      SENTRY_AUTH_TOKEN: AUTH_TOKEN,
      ...overrides.env,
    },
    repositoryRoot: '/repo',
    appDir: '/repo/apps/oak-curriculum-mcp-streamable-http',
    readFile:
      overrides.readFile ??
      ((path: string) => {
        if (path.endsWith('/repo/package.json')) {
          return JSON.stringify({ version: VERSION });
        }
        throw new Error(`Unexpected readFile: ${path}`);
      }),
    readdirSync: overrides.readdirSync ?? (() => ['server.js', 'server.js.map']),
    existsSync: overrides.existsSync ?? (() => true),
    execCli: fake.execCli,
    execScript: fake.execScript,
    stdout: writableArray(stdout),
    stderr: writableArray(stderr),
  };
  return { options, fake, stdout, stderr };
}

describe('runSentryReleaseAndDeploy — preflight gates (policy-first order)', () => {
  it('skips the full sequence in development when override pair is absent', () => {
    const h = harness({ env: { VERCEL_ENV: 'development' } });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result).toEqual({ exitCode: 0, kind: 'skipped' });
    expect(h.fake.calls).toEqual([]);
  });

  it('aborts when SENTRY_RELEASE_REGISTRATION_OVERRIDE=1 without SENTRY_RELEASE_OVERRIDE', () => {
    const h = harness({
      env: { VERCEL_ENV: 'development', SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1' },
    });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    expect(result.kind).toBe('preflight');
    expect(h.fake.calls).toEqual([]);
  });

  it('policy-skip pre-empts missing auth token (manual/local invocation ergonomics)', () => {
    const h = harness({
      env: { VERCEL_ENV: 'development', SENTRY_AUTH_TOKEN: undefined },
    });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result).toEqual({ exitCode: 0, kind: 'skipped' });
  });

  it('aborts when VERCEL_GIT_COMMIT_SHA is missing (after policy admits registration)', () => {
    const h = harness({ env: { VERCEL_GIT_COMMIT_SHA: undefined } });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    expect(result.kind).toBe('preflight');
  });

  it('aborts when VERCEL_GIT_COMMIT_SHA is malformed', () => {
    const h = harness({ env: { VERCEL_GIT_COMMIT_SHA: 'not-a-sha' } });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    expect(result.kind).toBe('preflight');
  });

  it('aborts when SENTRY_AUTH_TOKEN is missing (after policy admits registration)', () => {
    const h = harness({ env: { SENTRY_AUTH_TOKEN: undefined } });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    expect(result.kind).toBe('preflight');
  });

  it('aborts when dist/ contains no .js.map artefacts', () => {
    const h = harness({ readdirSync: () => ['.DS_Store', '.gitkeep'] });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    expect(result.kind).toBe('preflight');
  });
});

describe('runSentryReleaseAndDeploy — §6.1/§6.2 idempotency via releases-info probe', () => {
  it('probes `releases info` first; on NOT-FOUND runs §6.1 releases new', () => {
    const h = harness();

    runSentryReleaseAndDeploy(h.options);

    const firstCall = h.fake.calls[0];
    expect(firstCall?.argv).toEqual(['releases', 'info', VERSION]);
    const newCall = h.fake.calls.find(
      (c) => c.kind === 'cli' && c.argv[0] === 'releases' && c.argv[1] === 'new',
    );
    expect(newCall?.argv).toEqual(['releases', 'new', VERSION]);
  });

  it('on probe SUCCESS (release exists), skips §6.1 AND §6.2; continues with §6.3+', () => {
    const h = harness({ responses: [SUCCESS, SUCCESS, SUCCESS, SUCCESS] });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result).toEqual({ exitCode: 0, kind: 'success' });
    const argvHeads = h.fake.calls.map((c) => [c.kind, c.argv.slice(0, 2)]);
    expect(argvHeads).toEqual([
      ['cli', ['releases', 'info']],
      ['script', [h.options.appDir + '/scripts/upload-sourcemaps.sh']],
      ['cli', ['releases', 'finalize']],
      ['cli', ['deploys', 'new']],
    ]);
    expect(h.stderr.join('')).toMatch(/already exists/i);
  });

  it('aborts with failedStep=6.1 when releases new fails and release did not pre-exist', () => {
    const h = harness({ responses: [NOT_FOUND, FAILURE] });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    if (result.exitCode === 1) {
      expect(result.kind).toBe('abort_step');
      expect(result.failedStep).toBe('6.1');
    }
  });
});

describe('runSentryReleaseAndDeploy — §6.2 set-commits (WARN+CONTINUE)', () => {
  it('uses derived org/repo from VERCEL_GIT_REPO_OWNER+SLUG', () => {
    const h = harness();

    runSentryReleaseAndDeploy(h.options);

    const setCommits = h.fake.calls.find(
      (c) => c.kind === 'cli' && c.argv[0] === 'releases' && c.argv[1] === 'set-commits',
    );
    expect(setCommits?.argv).toEqual([
      'releases',
      'set-commits',
      VERSION,
      '--commit',
      `${ORG_OWNER}/${REPO_SLUG}@${SHA}`,
    ]);
  });

  it('falls back to monorepo literal when Vercel repo-owner/slug env vars are absent', () => {
    const h = harness({
      env: { VERCEL_GIT_REPO_OWNER: undefined, VERCEL_GIT_REPO_SLUG: undefined },
    });

    runSentryReleaseAndDeploy(h.options);

    const setCommits = h.fake.calls.find(
      (c) => c.kind === 'cli' && c.argv[0] === 'releases' && c.argv[1] === 'set-commits',
    );
    expect(setCommits?.argv).toEqual([
      'releases',
      'set-commits',
      VERSION,
      '--commit',
      `oaknational/oak-open-curriculum-ecosystem@${SHA}`,
    ]);
  });

  it('logs warning and continues when set-commits fails', () => {
    const h = harness({ responses: [NOT_FOUND, SUCCESS, FAILURE, SUCCESS, SUCCESS, SUCCESS] });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(0);
    expect(h.stderr.join('')).toMatch(/step 6\.2/);
  });
});

describe('runSentryReleaseAndDeploy — §6.3+§6.4 upload-sourcemaps.sh (ABORT)', () => {
  it('invokes upload-sourcemaps.sh with RELEASE and SENTRY_AUTH_TOKEN', () => {
    const h = harness();

    runSentryReleaseAndDeploy(h.options);

    const script = h.fake.calls.find((c) => c.kind === 'script');
    expect(script?.argv[0]).toContain('upload-sourcemaps.sh');
    expect(script?.scriptEnv).toMatchObject({
      RELEASE: VERSION,
      SENTRY_AUTH_TOKEN: AUTH_TOKEN,
    });
  });

  it('aborts with failedStep=6.3+6.4 when upload-sourcemaps.sh fails', () => {
    const h = harness({ responses: [NOT_FOUND, SUCCESS, SUCCESS, FAILURE] });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(1);
    if (result.exitCode === 1) {
      expect(result.kind).toBe('abort_step');
      expect(result.failedStep).toBe('6.3+6.4');
    }
  });
});

describe('runSentryReleaseAndDeploy — §6.5 releases finalize (WARN+CONTINUE)', () => {
  it('invokes sentry-cli with [releases, finalize, <version>]', () => {
    const h = harness();

    runSentryReleaseAndDeploy(h.options);

    const finalize = h.fake.calls.find(
      (c) => c.kind === 'cli' && c.argv[0] === 'releases' && c.argv[1] === 'finalize',
    );
    expect(finalize?.argv).toEqual(['releases', 'finalize', VERSION]);
  });

  it('logs warning and continues when finalize fails', () => {
    const h = harness({
      responses: [NOT_FOUND, SUCCESS, SUCCESS, SUCCESS, FAILURE, SUCCESS],
    });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(0);
    expect(h.stderr.join('')).toMatch(/step 6\.5/);
  });
});

describe('runSentryReleaseAndDeploy — §6.6 deploys new (WARN+CONTINUE)', () => {
  it('passes DERIVED_ENV=production when VERCEL_ENV=production and ref=main', () => {
    const h = harness();

    runSentryReleaseAndDeploy(h.options);

    const deploy = h.fake.calls.find((c) => c.kind === 'cli' && c.argv[0] === 'deploys');
    expect(deploy?.argv).toEqual(['deploys', 'new', '--release', VERSION, '-e', 'production']);
  });

  it('passes DERIVED_ENV=preview when VERCEL_ENV=production and ref is non-main', () => {
    const h = harness({ env: { VERCEL_GIT_COMMIT_REF: 'feature/x' } });

    runSentryReleaseAndDeploy(h.options);

    const deploy = h.fake.calls.find((c) => c.kind === 'cli' && c.argv[0] === 'deploys');
    expect(deploy?.argv).toEqual(['deploys', 'new', '--release', VERSION, '-e', 'preview']);
  });

  it('logs warning and continues when deploys new fails', () => {
    const h = harness({
      responses: [NOT_FOUND, SUCCESS, SUCCESS, SUCCESS, SUCCESS, FAILURE],
    });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result.exitCode).toBe(0);
    expect(h.stderr.join('')).toMatch(/step 6\.6/);
  });
});

describe('runSentryReleaseAndDeploy — happy path', () => {
  it('runs probe + all five §6 steps in order on NOT-FOUND probe', () => {
    const h = harness();

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result).toEqual({ exitCode: 0, kind: 'success' });
    const heads = h.fake.calls.map((c) => ({ kind: c.kind, head: c.argv.slice(0, 2) }));
    expect(heads).toEqual([
      { kind: 'cli', head: ['releases', 'info'] },
      { kind: 'cli', head: ['releases', 'new'] },
      { kind: 'cli', head: ['releases', 'set-commits'] },
      { kind: 'script', head: [h.options.appDir + '/scripts/upload-sourcemaps.sh'] },
      { kind: 'cli', head: ['releases', 'finalize'] },
      { kind: 'cli', head: ['deploys', 'new'] },
    ]);
  });

  it('runs the full sequence in development when override pair is set', () => {
    const h = harness({
      env: {
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1',
        SENTRY_RELEASE_OVERRIDE: 'uat-candidate',
      },
    });

    const result = runSentryReleaseAndDeploy(h.options);

    expect(result).toEqual({ exitCode: 0, kind: 'success' });
    expect(h.fake.calls).toHaveLength(6); // probe + 5 steps
  });
});
