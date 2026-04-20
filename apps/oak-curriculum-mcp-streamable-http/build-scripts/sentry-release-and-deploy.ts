/**
 * Sentry release + commits + deploy linkage orchestrator (ADR-163 §6).
 *
 * Runs exactly once per Vercel deployment creation, invoked by the
 * `build:vercel` npm script from the Vercel Build Command. Registers a
 * Sentry release, links commits, uploads source maps, finalises the
 * release, and emits a deploy-event — with per-step abort/warn posture
 * per §6.1–§6.6.
 *
 * @remarks Three-file module:
 * - `sentry-release-and-deploy-types.ts` — shared types (this module
 *   re-exports the public surface).
 * - `sentry-release-and-deploy-preflight.ts` — validation + probe.
 * - `sentry-release-and-deploy-cli.ts` — CLI composition root (real IO).
 *
 * Dependency flow is strictly one-way (no cycles): types ← preflight ←
 * orchestrator ← cli. All IO is injected via
 * {@link RunSentryReleaseAndDeployOptions}; tests pass fakes-as-arguments;
 * no subprocess spawn, no network, no process.env / process.cwd in test code.
 *
 * §6.1 idempotency refinement (pending ADR-163 amendment): the preflight
 * probes `sentry-cli releases info <version>` to detect whether the
 * release already exists (common on Vercel manual redeploys of the
 * same commit). If it exists, we SKIP both `releases new` (§6.1) and
 * `set-commits` (§6.2) to preserve the original commit attribution —
 * re-running `set-commits` on an existing release OVERWRITES the SHA
 * binding and orphans prior attribution. This matches ADR-163 §5
 * intent (semver is the immutable release identity; one release ↔ many
 * deploys) but deviates from §6.1's literal "abort on failure".
 */

import path from 'node:path';
import { runPreflight, type PreflightContext } from './sentry-release-and-deploy-preflight.js';
import type {
  CliResponse,
  OrchestratorResult,
  RunSentryReleaseAndDeployOptions,
} from './sentry-release-and-deploy-types.js';

export type {
  CliResponse,
  OrchestratorResult,
  OrchestratorWriteSink,
  RunSentryReleaseAndDeployOptions,
} from './sentry-release-and-deploy-types.js';

type StepPosture = 'abort' | 'warn';

interface CliStep {
  readonly id: string;
  readonly kind: 'cli';
  readonly posture: StepPosture;
  readonly argv: readonly string[];
}

interface ScriptStep {
  readonly id: string;
  readonly kind: 'script';
  readonly posture: StepPosture;
  readonly path: string;
  readonly scriptEnv: Readonly<Record<string, string>>;
}

type Step = CliStep | ScriptStep;

function buildSteps(
  options: RunSentryReleaseAndDeployOptions,
  context: PreflightContext,
): readonly Step[] {
  const { version, sha, authToken, derivedEnv, orgRepo, releaseAlreadyExists } = context;
  const steps: Step[] = [];

  if (!releaseAlreadyExists) {
    steps.push(
      { id: '6.1', kind: 'cli', posture: 'abort', argv: ['releases', 'new', version] },
      {
        id: '6.2',
        kind: 'cli',
        posture: 'warn',
        argv: ['releases', 'set-commits', version, '--commit', `${orgRepo}@${sha}`],
      },
    );
  }

  steps.push(
    {
      id: '6.3+6.4',
      kind: 'script',
      posture: 'abort',
      path: path.join(options.appDir, 'scripts', 'upload-sourcemaps.sh'),
      scriptEnv: { RELEASE: version, SENTRY_AUTH_TOKEN: authToken },
    },
    { id: '6.5', kind: 'cli', posture: 'warn', argv: ['releases', 'finalize', version] },
    {
      id: '6.6',
      kind: 'cli',
      posture: 'warn',
      argv: ['deploys', 'new', '--release', version, '-e', derivedEnv],
    },
  );

  return steps;
}

function runStep(step: Step, options: RunSentryReleaseAndDeployOptions): CliResponse {
  return step.kind === 'cli'
    ? options.execCli(step.argv)
    : options.execScript(step.path, step.scriptEnv);
}

function handleStepResponse(
  step: Step,
  response: CliResponse,
  options: RunSentryReleaseAndDeployOptions,
): OrchestratorResult | null {
  if (response.exitCode === 0) {
    return null;
  }

  if (step.posture === 'abort') {
    return {
      exitCode: 1,
      kind: 'abort_step',
      failedStep: step.id,
      reason: response.stderr || `step ${step.id} failed`,
    };
  }

  options.stderr.write(
    `[sentry-release] WARN step ${step.id} (${response.stderr.trim() || 'non-zero exit'}); continuing\n`,
  );
  return null;
}

function runSteps(
  steps: readonly Step[],
  options: RunSentryReleaseAndDeployOptions,
): OrchestratorResult {
  for (const step of steps) {
    const abort = handleStepResponse(step, runStep(step, options), options);
    if (abort) {
      return abort;
    }
  }
  return { exitCode: 0, kind: 'success' };
}

/** Orchestrator entry point. See module-level TSDoc. */
export function runSentryReleaseAndDeploy(
  options: RunSentryReleaseAndDeployOptions,
): OrchestratorResult {
  const preflightResult = runPreflight(options);
  if (!preflightResult.ok) {
    return preflightResult.error;
  }
  return runSteps(buildSteps(options, preflightResult.value), options);
}
