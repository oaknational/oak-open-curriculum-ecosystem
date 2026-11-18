/**
 * Executable entry for the deploy-config validation gate (MCP-475).
 *
 * @remarks
 * Runs as the `deploy-config-gate` Turbo task the app's `build` task
 * depends on — never cached, so it executes on every build including a
 * same-commit redeploy — and before esbuild and the Sentry build plugin,
 * so an invalid deploy environment fails the build before any release
 * side effect. Composition root: the environment is read once here and
 * handed to {@link runDeployConfigValidation}, which filters it to the
 * validated surface; everything decidable lives behind that seam and is
 * proven by `validate-deploy-config.integration.test.ts` and the
 * orchestration contract test beside it.
 */

import { runDeployConfigValidation } from './validate-deploy-config.js';

process.exitCode = runDeployConfigValidation({
  processEnv: process.env,
  writeOut: (line) => {
    process.stdout.write(`${line}\n`);
  },
  writeErr: (line) => {
    process.stderr.write(`${line}\n`);
  },
});
