/**
 * Esbuild composition root for `@oaknational/oak-curriculum-mcp-streamable-http`.
 *
 * @remarks
 * Reads `process.env`, asks the two app-local pure factories for the
 * canonical build options + the Sentry plugin's registration intent,
 * then invokes `esbuild.build`. This file is the ONE place in the MCP
 * app where Vercel's build-time env crosses the boundary into the
 * build pipeline; both factories accept env (or env-derived literals)
 * as parameters so the policy logic stays test-driven (see
 * `build-scripts/sentry-build-plugin.unit.test.ts` and
 * `build-scripts/esbuild-config.unit.test.ts`).
 *
 * The Sentry plugin must be the LAST plugin in the array per Sentry
 * docs. Runs on Vercel via `tsx esbuild.config.ts` (the `build`
 * script in `package.json`); locally too, since `tsx` is already a
 * workspace devDependency.
 *
 * The composition root snapshots env-vars at the boundary (one explicit
 * field-by-field projection per {@link SentryBuildEnvironment}) so
 * subsequent env mutations cannot affect re-evaluation and tests
 * remain deterministic.
 *
 * @packageDocumentation
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin';
import { build, type BuildOptions, type Plugin } from 'esbuild';
import {
  buildBuildInfo,
  serialiseBuildInfo,
  type ResolvedRelease,
} from '@oaknational/build-metadata';
import {
  assertBuiltServerDefaultExport,
  assertNoEsbuildWarnings,
} from './build-scripts/build-output-contract.js';
import {
  MCP_DEPLOY_ENTRY_POINTS,
  MCP_SUPPORT_ENTRY_POINTS,
  createMcpEsbuildOptions,
} from './build-scripts/esbuild-config.js';
import { createSentryBuildEnvironment } from './build-scripts/sentry-build-environment.js';
import {
  createSentryBuildPlugin,
  type ResolvedBuildTimeGitSha,
  type SentryBuildEnvironment,
  type SentryBuildPluginIdentity,
  type SentryBuildPluginInputs,
} from './build-scripts/sentry-build-plugin.js';

const IDENTITY: SentryBuildPluginIdentity = {
  org: 'oak-national-academy',
  project: 'oak-open-curriculum-mcp',
  repoSlug: 'oaknational/oak-open-curriculum-ecosystem',
};

// Snapshot the build-time env at the boundary. `createSentryBuildEnvironment`
// keeps the app build identity as the canonical version fact, then projects it
// into the Sentry release surface.
const envResult = createSentryBuildEnvironment(process.env);

if (!envResult.ok) {
  throw new Error(
    `[esbuild.config] Sentry build environment error: ${JSON.stringify(envResult.error)}`,
  );
}

const env: SentryBuildEnvironment = envResult.value;

const intent = createSentryBuildPlugin(env, IDENTITY);

if (!intent.ok) {
  // Vital-identity error per the §Truth Tables fail-policy.
  // Thrown rather than `process.exit(1)` so Vercel's build log captures
  // the helpful message + stack from the resolver. Some error variants
  // (the ObservabilityConfigError arm) lack a `.message` field; print
  // the whole discriminator so the operator gets enough context to act
  // in either case.
  throw new Error(
    `[esbuild.config] Sentry build-plugin intent error: ${JSON.stringify(intent.error)}`,
  );
}

const supportBuildOptions = createMcpEsbuildOptions(MCP_SUPPORT_ENTRY_POINTS);
const deployBuildOptions = createMcpEsbuildOptions(MCP_DEPLOY_ENTRY_POINTS);
const outdir = deployBuildOptions.outdir ?? supportBuildOptions.outdir ?? 'dist';

async function persistBuildInfo(
  release: ResolvedRelease,
  gitSha: ResolvedBuildTimeGitSha | undefined,
): Promise<void> {
  const info = buildBuildInfo({
    release,
    gitSha: gitSha?.value,
    branch: env.VERCEL_GIT_COMMIT_REF,
    now: new Date(),
  });
  await mkdir(outdir, { recursive: true });
  await writeFile(path.join(outdir, 'build-info.json'), serialiseBuildInfo(info));
  console.log(
    `[esbuild.config] build-info written: release=${info.release} env=${info.environment} source=${info.releaseSource}`,
  );
}

function buildPluginArray(inputs: SentryBuildPluginInputs): Plugin[] {
  // `sentryEsbuildPlugin`'s declared return type is `any` in
  // `@sentry/esbuild-plugin@5.x`; we narrow at this seam so the
  // composition root's `plugins` array stays `Plugin[]` and the rest
  // of esbuild's option typing carries through.
  const plugin: Plugin = sentryEsbuildPlugin({
    org: inputs.org,
    project: inputs.project,
    authToken: inputs.authToken,
    release: {
      name: inputs.release.name,
      finalize: true,
      setCommits: {
        auto: false,
        commit: inputs.release.setCommits.commit,
        repo: inputs.release.setCommits.repo,
      },
      deploy: { env: inputs.release.deploy.env },
    },
    sourcemaps: {
      filesToDeleteAfterUpload: [...inputs.sourcemaps.filesToDeleteAfterUpload],
    },
    telemetry: inputs.telemetry,
  });
  return [plugin];
}

async function assertServerEntryContract(): Promise<void> {
  const serverBundleSource = await readFile(path.join(outdir, 'server.js'), 'utf8');
  assertBuiltServerDefaultExport(serverBundleSource);
}

async function buildAndAssert(options: BuildOptions): Promise<void> {
  const result = await build(options);
  assertNoEsbuildWarnings(result.warnings);
}

async function buildSupportArtefacts(): Promise<void> {
  await buildAndAssert(supportBuildOptions);
}

async function buildDeployArtefact(options: BuildOptions): Promise<void> {
  await buildAndAssert(options);
  await assertServerEntryContract();
}

switch (intent.value.kind) {
  case 'disabled': {
    // Registration policy decided this build does not register a
    // release (e.g. local dev without override pair). No release was
    // resolved → no build-info to persist; no plugin to wire.
    console.log(`[esbuild.config] Sentry plugin skipped: ${intent.value.reason}`);
    await buildSupportArtefacts();
    await buildDeployArtefact(deployBuildOptions);
    break;
  }
  case 'skipped': {
    // Optional vendor config (SENTRY_AUTH_TOKEN) missing on a non-
    // production build. Persist build-info for downstream debugging,
    // log the warn line, omit the plugin so the build still produces
    // an artefact.
    await persistBuildInfo(intent.value.release, intent.value.gitSha);
    console.warn(
      `[esbuild.config] Sentry plugin skipped: ${intent.value.reason} ` +
        '(non-production build proceeding without release registration; ' +
        'set SENTRY_AUTH_TOKEN to enable upload).',
    );
    await buildSupportArtefacts();
    await buildDeployArtefact(deployBuildOptions);
    break;
  }
  case 'configured': {
    await persistBuildInfo(intent.value.release, intent.value.gitSha);
    const { inputs } = intent.value;
    console.log(
      `[esbuild.config] Sentry plugin enabled: release=${inputs.release.name} env=${inputs.release.deploy.env}`,
    );
    await buildSupportArtefacts();
    await buildDeployArtefact({ ...deployBuildOptions, plugins: buildPluginArray(inputs) });
    break;
  }
}
