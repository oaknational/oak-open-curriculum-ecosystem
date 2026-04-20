/**
 * Preflight validation for the Sentry release-and-deploy orchestrator.
 *
 * @remarks Ordered policy-first so a legal "skipped" decision can
 * short-circuit before credential checks (helpful for manual/local
 * invocations). All validators return `Result<T, OrchestratorResult>`
 * for uniform composition in {@link runPreflight}.
 */

import { err, ok, type Result } from '@oaknational/result';
import path from 'node:path';
import {
  resolveSentryEnvironment,
  resolveSentryRegistrationPolicy,
  type SentryConfigEnvironment,
} from '@oaknational/sentry-node';
import type {
  OrchestratorResult,
  RunSentryReleaseAndDeployOptions,
} from './sentry-release-and-deploy-types.js';

const SHA_PATTERN = /^[0-9a-f]{7,40}$/iu;
const DEFAULT_ORG_REPO = 'oaknational/oak-open-curriculum-ecosystem';

export interface PreflightContext {
  readonly version: string;
  readonly sha: string;
  readonly authToken: string;
  readonly derivedEnv: string;
  readonly orgRepo: string;
  readonly releaseAlreadyExists: boolean;
}

function preflightError(reason: string): OrchestratorResult {
  return { exitCode: 1, kind: 'preflight', reason };
}

function sentryEnvInput(options: RunSentryReleaseAndDeployOptions): SentryConfigEnvironment {
  return {
    VERCEL_ENV: options.env.VERCEL_ENV,
    VERCEL_GIT_COMMIT_REF: options.env.VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_SHA: options.env.VERCEL_GIT_COMMIT_SHA,
    SENTRY_RELEASE_OVERRIDE: options.env.SENTRY_RELEASE_OVERRIDE,
    SENTRY_RELEASE_REGISTRATION_OVERRIDE: options.env.SENTRY_RELEASE_REGISTRATION_OVERRIDE,
    SENTRY_ENVIRONMENT_OVERRIDE: options.env.SENTRY_ENVIRONMENT_OVERRIDE,
  };
}

function readVersion(
  options: RunSentryReleaseAndDeployOptions,
): Result<string, OrchestratorResult> {
  try {
    const contents = options.readFile(path.join(options.repositoryRoot, 'package.json'));
    const parsed: unknown = JSON.parse(contents);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      typeof parsed.version === 'string' &&
      parsed.version.length > 0
    ) {
      return ok(parsed.version);
    }
  } catch {
    // fall through to err
  }
  return err(preflightError('Unable to read semver from root package.json'));
}

function distIsNonEmpty(options: RunSentryReleaseAndDeployOptions): boolean {
  const distPath = path.join(options.appDir, 'dist');
  if (!options.existsSync(distPath)) {
    return false;
  }
  // Require at least one source-map artefact — stray `.DS_Store` or
  // `.gitkeep` must not pass the gate.
  return options.readdirSync(distPath).some((name) => name.endsWith('.js.map'));
}

function validateSha(
  env: Readonly<Record<string, string | undefined>>,
): Result<string, OrchestratorResult> {
  const sha = env.VERCEL_GIT_COMMIT_SHA?.trim();
  if (!sha || !SHA_PATTERN.test(sha)) {
    return err(preflightError('VERCEL_GIT_COMMIT_SHA missing or malformed'));
  }
  return ok(sha);
}

function validateAuthToken(
  env: Readonly<Record<string, string | undefined>>,
): Result<string, OrchestratorResult> {
  const authToken = env.SENTRY_AUTH_TOKEN?.trim();
  if (!authToken) {
    return err(preflightError('SENTRY_AUTH_TOKEN missing'));
  }
  return ok(authToken);
}

function validateRegistrationPolicy(
  options: RunSentryReleaseAndDeployOptions,
): Result<{ readonly derivedEnv: string }, OrchestratorResult> {
  const policyResult = resolveSentryRegistrationPolicy(sentryEnvInput(options));
  if (!policyResult.ok) {
    return err(preflightError(`registration-policy: ${policyResult.error.kind}`));
  }

  if (!policyResult.value.registerRelease) {
    options.stdout.write(
      '[sentry-release] skipped: registerRelease=false (per ADR-163 §3 policy)\n',
    );
    return err({ exitCode: 0, kind: 'skipped' });
  }

  if (policyResult.value.warning) {
    options.stderr.write(`[sentry-release] warning: ${policyResult.value.warning}\n`);
  }

  return ok({ derivedEnv: resolveSentryEnvironment(sentryEnvInput(options)).value });
}

function validateBuildArtefacts(
  options: RunSentryReleaseAndDeployOptions,
): Result<string, OrchestratorResult> {
  const versionResult = readVersion(options);
  if (!versionResult.ok) {
    return versionResult;
  }

  if (!distIsNonEmpty(options)) {
    return err(preflightError('dist/ is missing, empty, or contains no .js.map artefacts'));
  }

  return ok(versionResult.value);
}

/**
 * Derive org/repo slug from Vercel env vars, falling back to the monorepo
 * literal. Must match the repo configured in Sentry's GitHub integration —
 * a mismatch silently loses commit attribution. Prefer Vercel-injected
 * values so forks and renamed repos work without a code change.
 */
function resolveOrgRepo(env: Readonly<Record<string, string | undefined>>): string {
  const owner = env.VERCEL_GIT_REPO_OWNER?.trim();
  const slug = env.VERCEL_GIT_REPO_SLUG?.trim();
  if (owner && slug) {
    return `${owner}/${slug}`;
  }
  return DEFAULT_ORG_REPO;
}

function probeReleaseExists(version: string, options: RunSentryReleaseAndDeployOptions): boolean {
  const response = options.execCli(['releases', 'info', version]);
  return response.exitCode === 0;
}

/**
 * Preflight composer (policy → sha → auth → artefacts → probe).
 *
 * Policy runs first so a manual/local invocation that would legally
 * skip doesn't abort on a missing auth token.
 */
export function runPreflight(
  options: RunSentryReleaseAndDeployOptions,
): Result<PreflightContext, OrchestratorResult> {
  const policyResult = validateRegistrationPolicy(options);
  if (!policyResult.ok) {
    return policyResult;
  }

  const shaResult = validateSha(options.env);
  if (!shaResult.ok) {
    return shaResult;
  }

  const authTokenResult = validateAuthToken(options.env);
  if (!authTokenResult.ok) {
    return authTokenResult;
  }

  const artefactsResult = validateBuildArtefacts(options);
  if (!artefactsResult.ok) {
    return artefactsResult;
  }

  const releaseAlreadyExists = probeReleaseExists(artefactsResult.value, options);
  if (releaseAlreadyExists) {
    options.stderr.write(
      `[sentry-release] release ${artefactsResult.value} already exists; skipping §6.1 (releases new) and §6.2 (set-commits) to preserve original commit attribution\n`,
    );
  }

  return ok({
    version: artefactsResult.value,
    sha: shaResult.value,
    authToken: authTokenResult.value,
    derivedEnv: policyResult.value.derivedEnv,
    orgRepo: resolveOrgRepo(options.env),
    releaseAlreadyExists,
  });
}
