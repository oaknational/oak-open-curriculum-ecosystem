import { join } from 'node:path';
import { err, ok, type Result } from '@oaknational/result';

/**
 * Supported HTTP dev entry modes for the workspace-owned orchestration.
 */
export const HTTP_DEV_MODES = ['dev', 'observe', 'observe-noauth'] as const;

/**
 * Union of supported HTTP dev modes.
 */
export type HttpDevMode = (typeof HTTP_DEV_MODES)[number];

/**
 * Output policy for a spawned development command.
 */
export type CommandOutput =
  | {
      readonly kind: 'inherit';
    }
  | {
      readonly kind: 'tee';
      readonly filePath: string;
    };

/**
 * Fully resolved command contract for one child process in the HTTP dev loop.
 */
export interface HttpDevCommand {
  readonly label: 'initial-widget-build' | 'widget-watch' | 'http-dev-server';
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
  readonly output: CommandOutput;
}

/**
 * Full execution plan for the HTTP dev loop.
 */
export interface HttpDevExecutionPlan {
  readonly mode: HttpDevMode;
  readonly initialWidgetBuild: HttpDevCommand;
  readonly widgetWatch: HttpDevCommand;
  readonly server: HttpDevCommand;
}

/**
 * Error returned when a caller requests an unsupported HTTP dev mode.
 */
export interface InvalidHttpDevModeError {
  readonly kind: 'invalid-http-dev-mode';
  readonly input: string;
}

/**
 * Inputs required to resolve a deterministic execution plan.
 */
export interface ResolveHttpDevExecutionPlanOptions {
  readonly mode: HttpDevMode;
  readonly workspaceRoot: string;
  readonly parentEnv: NodeJS.ProcessEnv;
  readonly now: Date;
}

const LOCAL_ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';

/**
 * Parses a CLI mode argument into a supported HTTP dev mode.
 */
export function parseHttpDevMode(
  input: string | undefined,
): Result<HttpDevMode, InvalidHttpDevModeError> {
  if (input === undefined) {
    return ok('dev');
  }

  if (isHttpDevMode(input)) {
    return ok(input);
  }

  return err({
    kind: 'invalid-http-dev-mode',
    input,
  });
}

/**
 * Resolves the full command plan for the HTTP dev orchestration.
 */
export function resolveHttpDevExecutionPlan({
  mode,
  workspaceRoot,
  parentEnv,
  now,
}: ResolveHttpDevExecutionPlanOptions): HttpDevExecutionPlan {
  return {
    mode,
    initialWidgetBuild: {
      label: 'initial-widget-build',
      command: resolveWorkspaceBinary(workspaceRoot, 'vite'),
      args: ['build', '--config', 'widget/vite.config.ts'],
      cwd: workspaceRoot,
      env: parentEnv,
      output: { kind: 'inherit' },
    },
    widgetWatch: {
      label: 'widget-watch',
      command: resolveWorkspaceBinary(workspaceRoot, 'vite'),
      args: ['build', '--config', 'widget/vite.config.ts', '--watch'],
      cwd: workspaceRoot,
      env: parentEnv,
      output: { kind: 'inherit' },
    },
    server: {
      label: 'http-dev-server',
      command: resolveWorkspaceBinary(workspaceRoot, 'tsx'),
      // --import @sentry/node/preload: required Node.js ESM hook for Sentry
      // auto-instrumentation. Registers import-in-the-middle loader hooks
      // BEFORE application modules load. See scripts/start-server.sh for
      // the full rationale and Sentry doc references.
      args: ['--import', '@sentry/node/preload', 'src/index.ts'],
      cwd: workspaceRoot,
      env: resolveServerEnv(parentEnv, mode),
      output: resolveServerOutput(mode, workspaceRoot, now),
    },
  };
}

/**
 * Formats a local timestamp for `.logs/http-dev-*.log` filenames.
 */
export function formatLogTimestamp(date: Date): string {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
    '-',
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0'),
  ].join('');
}

function isHttpDevMode(input: string): input is HttpDevMode {
  return HTTP_DEV_MODES.some((mode) => mode === input);
}

function resolveServerEnv(parentEnv: NodeJS.ProcessEnv, mode: HttpDevMode): NodeJS.ProcessEnv {
  const localEnv = { ...parentEnv };
  delete localEnv.VERCEL_GIT_COMMIT_SHA;
  delete localEnv.VERCEL_BRANCH_URL;
  delete localEnv.SENTRY_RELEASE_OVERRIDE;

  return {
    ...localEnv,
    ALLOWED_HOSTS: LOCAL_ALLOWED_HOSTS,
    DANGEROUSLY_DISABLE_AUTH: mode === 'observe-noauth' ? 'true' : 'false',
    LOG_LEVEL: 'debug',
    ...(mode === 'observe-noauth' ? { SENTRY_MODE: 'off' } : {}),
  };
}

function resolveServerOutput(mode: HttpDevMode, workspaceRoot: string, now: Date): CommandOutput {
  if (mode === 'dev') {
    return { kind: 'inherit' };
  }

  const fileStem = mode === 'observe-noauth' ? 'http-dev-noauth' : 'http-dev';

  return {
    kind: 'tee',
    filePath: join(workspaceRoot, '.logs', `${fileStem}-${formatLogTimestamp(now)}.log`),
  };
}

function resolveWorkspaceBinary(workspaceRoot: string, binaryName: 'tsx' | 'vite'): string {
  return join(workspaceRoot, 'node_modules', '.bin', binaryName);
}
