import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseHttpDevMode, resolveHttpDevExecutionPlan } from './http-dev-contract.js';

describe('parseHttpDevMode', () => {
  it('defaults to dev when no mode is provided', () => {
    expect(parseHttpDevMode(undefined)).toStrictEqual({ ok: true, value: 'dev' });
  });

  it('rejects unsupported modes', () => {
    expect(parseHttpDevMode('broken-mode')).toStrictEqual({
      ok: false,
      error: {
        kind: 'invalid-http-dev-mode',
        input: 'broken-mode',
      },
    });
  });
});

describe('resolveHttpDevExecutionPlan', () => {
  const workspaceRoot = '/workspace/apps/oak-curriculum-mcp-streamable-http';
  const parentEnv = {
    PATH: '/usr/bin',
    SHARED_ENV: 'shared-value',
  };
  const now = new Date(2026, 3, 9, 15, 4, 5);

  it('resolves observe-noauth with canonical commands and tee logging', () => {
    const plan = resolveHttpDevExecutionPlan({
      mode: 'observe-noauth',
      workspaceRoot,
      parentEnv,
      now,
    });

    expect(plan.initialWidgetBuild).toStrictEqual({
      label: 'initial-widget-build',
      command: join(workspaceRoot, 'node_modules', '.bin', 'vite'),
      args: ['build', '--config', 'widget/vite.config.ts'],
      cwd: workspaceRoot,
      env: parentEnv,
      output: { kind: 'inherit' },
    });

    expect(plan.widgetWatch).toStrictEqual({
      label: 'widget-watch',
      command: join(workspaceRoot, 'node_modules', '.bin', 'vite'),
      args: ['build', '--config', 'widget/vite.config.ts', '--watch'],
      cwd: workspaceRoot,
      env: parentEnv,
      output: { kind: 'inherit' },
    });

    expect(plan.server).toStrictEqual({
      label: 'http-dev-server',
      command: join(workspaceRoot, 'node_modules', '.bin', 'tsx'),
      args: ['--import', '@sentry/node/preload', 'src/index.ts'],
      cwd: workspaceRoot,
      env: {
        ...parentEnv,
        ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
        DANGEROUSLY_DISABLE_AUTH: 'true',
        LOG_LEVEL: 'debug',
        SENTRY_MODE: 'off',
      },
      output: {
        kind: 'tee',
        filePath: join(workspaceRoot, '.logs', 'http-dev-noauth-20260409-150405.log'),
      },
    });
  });

  it('resolves standard dev with auth enabled and inherited output', () => {
    const plan = resolveHttpDevExecutionPlan({
      mode: 'dev',
      workspaceRoot,
      parentEnv,
      now,
    });

    expect(plan.server.env).toStrictEqual({
      ...parentEnv,
      ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
      DANGEROUSLY_DISABLE_AUTH: 'false',
      LOG_LEVEL: 'debug',
    });
    expect(plan.server.output).toStrictEqual({ kind: 'inherit' });
  });

  it('does not synthesize deploy release metadata for local UI and a11y startup', () => {
    const plan = resolveHttpDevExecutionPlan({
      mode: 'observe-noauth',
      workspaceRoot,
      parentEnv: {
        ...parentEnv,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
        VERCEL_BRANCH_URL: 'feature.example.vercel.app',
        SENTRY_RELEASE_OVERRIDE: 'inherited-release',
        SENTRY_MODE: 'sentry',
      },
      now,
    });

    expect(plan.server.env.VERCEL_ENV).toBeUndefined();
    expect(plan.server.env.VERCEL_GIT_COMMIT_REF).toBeUndefined();
    expect(plan.server.env.VERCEL_GIT_COMMIT_SHA).toBeUndefined();
    expect(plan.server.env.VERCEL_BRANCH_URL).toBeUndefined();
    expect(plan.server.env.SENTRY_RELEASE_OVERRIDE).toBeUndefined();
    expect(plan.server.env.SENTRY_MODE).toBe('off');
  });
});
