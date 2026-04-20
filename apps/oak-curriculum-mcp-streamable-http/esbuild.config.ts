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
 * Runs on Vercel via `tsx esbuild.config.ts` (the `build` script in
 * `package.json`); locally too, since `tsx` is already a workspace
 * devDependency. The Sentry plugin must be the LAST plugin in the
 * array per Sentry docs.
 *
 * @packageDocumentation
 */

import { build } from 'esbuild';
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin';
import { createMcpEsbuildOptions } from './build-scripts/esbuild-config.js';
import {
  createSentryBuildPlugin,
  type SentryBuildEnvironment,
  type SentryBuildPluginIdentity,
} from './build-scripts/sentry-build-plugin.js';

const IDENTITY: SentryBuildPluginIdentity = {
  org: 'oak-national-academy',
  project: 'oak-open-curriculum-mcp',
  repoSlug: 'oaknational/oak-open-curriculum-ecosystem',
};

// Vercel + local build env crosses the boundary here. The
// SentryBuildEnvironment cast is the documented composition-root seam
// — every downstream consumer takes typed input.
const env = process.env as unknown as SentryBuildEnvironment;

const intent = createSentryBuildPlugin(env, IDENTITY);

if (!intent.ok) {
  console.error('[esbuild.config] Sentry build-plugin intent error:', intent.error);
  process.exit(1);
}

const baseOptions = createMcpEsbuildOptions();

if (intent.value.kind === 'disabled') {
  console.log(`[esbuild.config] Sentry plugin skipped: ${intent.value.reason}`);
  await build(baseOptions);
} else {
  const { inputs } = intent.value;
  console.log(
    `[esbuild.config] Sentry plugin enabled: release=${inputs.release.name} env=${inputs.release.deploy.env}`,
  );
  await build({
    ...baseOptions,
    plugins: [
      sentryEsbuildPlugin({
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
      }),
    ],
  });
}
