import { beforeAll, describe, expect, it } from 'vitest';
import { HTTP_ENV_KEYS } from '../src/env.js';
import { resolveBuildTaskGraph, type TurboDryRunTask } from './helpers/turbo-task-graph.js';

const APP = '@oaknational/oak-curriculum-mcp-streamable-http';
const GATE_TASK = `${APP}#deploy-config-gate`;
const BUILD_TASK = `${APP}#build`;

/**
 * The orchestration half of the deploy-config plan's acceptance criterion 1:
 * the production build entrypoint invokes the gate as an always-executed
 * step outside the cached build task. Read from Turbo's own resolution of
 * the graph, not from the config text, so what is asserted is what runs.
 * Homed in the e2e tier because asking Turbo means running it — a real
 * child process, which the testing strategy keeps out of the in-process
 * suites.
 */
describe('deploy-config gate — always executed, never cached, on the build path', () => {
  let graph: ReadonlyMap<string, TurboDryRunTask>;

  beforeAll(() => {
    graph = resolveBuildTaskGraph();
  });

  it('is a task of its own that the build task depends on', () => {
    const gate = graph.get(GATE_TASK);
    const build = graph.get(BUILD_TASK);

    expect(gate?.command).toContain('run-validate-deploy-config');
    expect(build?.dependencies).toContain(GATE_TASK);
  });

  it('is also the first step of the workspace build script, for a build that never enters Turbo', () => {
    // Vercel's default build invokes the workspace's `build` script; whether
    // that enters the Turbo graph is a dashboard setting the tree cannot see.
    // So the script itself runs the gate before esbuild, and the task above
    // covers the cached-replay path the script alone cannot.
    const command = graph.get(BUILD_TASK)?.command ?? '';

    expect(command.indexOf('deploy-config-gate')).toBeGreaterThanOrEqual(0);
    expect(command.indexOf('deploy-config-gate')).toBeLessThan(
      command.indexOf('esbuild.config.ts'),
    );
  });

  it('runs after the workspace packages the runtime-config composition imports are built', () => {
    // The gate imports the server's runtime-config module, which imports
    // workspace packages resolved from their built output; without this
    // dependency a cold runner executes the gate before those builds and
    // fails on a missing module (measured on the fork's first CI run).
    const gate = graph.get(GATE_TASK);

    expect(gate?.resolvedTaskDefinition.dependsOn).toContain('^build');
    expect(gate?.dependencies).toContain('@oaknational/env-resolution#build');
    expect(gate?.dependencies).toContain('@oaknational/sentry-node#build');
  });

  it('is never cached, so a same-commit redeploy still runs it', () => {
    const gate = graph.get(GATE_TASK);
    const build = graph.get(BUILD_TASK);

    expect(gate?.resolvedTaskDefinition.cache).toBe(false);
    expect(build?.resolvedTaskDefinition.dependsOn).toContain('deploy-config-gate');
  });

  it('passes exactly the validated surface through, in lockstep with the env schema', () => {
    const passedThrough = new Set(
      graph.get(GATE_TASK)?.resolvedTaskDefinition.passThroughEnv ?? [],
    );

    for (const key of HTTP_ENV_KEYS) {
      expect(passedThrough, `${key} must be passed through to the gate`).toContain(key);
    }
    expect(passedThrough).not.toContain('SENTRY_AUTH_TOKEN');
  });
});
