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
 * Replaces the bespoke L-7 sourcemap-injection orchestrator
 * (`build-scripts/sentry-release-and-deploy*.ts`,
 * `scripts/upload-sourcemaps.sh`) deleted in §L-8 WS2.3. The vendor's
 * first-party `@sentry/esbuild-plugin` now performs every step that
 * orchestrator wired through `sentry-cli` (release registration,
 * source-map upload, deploy event emission, Debug ID injection) per
 * ADR-163 §6 (amended by §L-8 WS3.1: outcome statement, not bespoke
 * mechanism).
 *
 * §L-8 Correction (2026-04-23): four-arm branch on intent kind +
 * `dist/build-info.json` persistence + warn-vs-throw fail-policy
 * split. The `f9d5b0d2` shape exited 1 on every error kind, treating
 * an absent optional `SENTRY_AUTH_TOKEN` as fatal even on credential-
 * less rehearsals (3rd-instance-pending of
 * `passive-guidance-loses-to-artefact-gravity`). Fail-policy now:
 * vital-identity errors throw with the resolver's helpful message;
 * optional-vendor-config-missing logs a `Sentry plugin skipped` line
 * and continues so artefacts still emit.
 *
 * Runs on Vercel via `tsx esbuild.config.ts` (the `build` script in
 * `package.json`); locally too, since `tsx` is already a workspace
 * devDependency. The Sentry plugin must be the LAST plugin in the
 * array per Sentry docs.
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
  type ResolvedBuildTimeRelease,
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
import {
  createSentryBuildPlugin,
  type SentryBuildEnvironment,
  type SentryBuildPluginIdentity,
  type SentryBuildPluginInputs,
} from './build-scripts/sentry-build-plugin.js';

const IDENTITY: SentryBuildPluginIdentity = {
  org: 'oak-national-academy',
  project: 'oak-open-curriculum-mcp',
  repoSlug: 'oaknational/oak-open-curriculum-ecosystem',
};

// Vercel + local build env crosses the boundary here. `process.env`
// already satisfies the typed build-environment surface, so the
// composition root can stay assertion-free.
const env: SentryBuildEnvironment = process.env;

const intent = createSentryBuildPlugin(env, IDENTITY);

if (!intent.ok) {
  // Vital-identity error per the L-8 Correction `Corrected fail-policy`
  // table. Thrown rather than `process.exit(1)` so Vercel's build log
  // captures the helpful message + stack from the resolver. Some error
  // variants (the ObservabilityConfigError arm) lack a `.message`
  // field; print the whole discriminator so the operator gets enough
  // context to act in either case.
  throw new Error(
    `[esbuild.config] Sentry build-plugin intent error: ${JSON.stringify(intent.error)}`,
  );
}

const supportBuildOptions = createMcpEsbuildOptions(MCP_SUPPORT_ENTRY_POINTS);
const deployBuildOptions = createMcpEsbuildOptions(MCP_DEPLOY_ENTRY_POINTS);
const outdir = deployBuildOptions.outdir ?? supportBuildOptions.outdir ?? 'dist';

async function persistBuildInfo(release: ResolvedBuildTimeRelease): Promise<void> {
  const info = buildBuildInfo({
    release,
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
    await persistBuildInfo(intent.value.release);
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
    await persistBuildInfo(intent.value.release);
    const { inputs } = intent.value;
    console.log(
      `[esbuild.config] Sentry plugin enabled: release=${inputs.release.name} env=${inputs.release.deploy.env}`,
    );
    await buildSupportArtefacts();
    await buildDeployArtefact({ ...deployBuildOptions, plugins: buildPluginArray(inputs) });
    break;
  }
}
