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
  /**
   * Selects the platform's binary shims. Injected so both branches are
   * provable from any host; defaults to `process.platform`.
   */
  readonly platform?: NodeJS.Platform;
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
  platform = process.platform,
}: ResolveHttpDevExecutionPlanOptions): HttpDevExecutionPlan {
  const vite = resolveWorkspaceBinary(workspaceRoot, 'vite', platform);
  const tsx = resolveWorkspaceBinary(workspaceRoot, 'tsx', platform);

  return {
    mode,
    initialWidgetBuild: {
      label: 'initial-widget-build',
      command: vite.command,
      args: [...vite.leadingArgs, 'build', '--config', 'widget/vite.config.ts'],
      cwd: workspaceRoot,
      env: parentEnv,
      output: { kind: 'inherit' },
    },
    widgetWatch: {
      label: 'widget-watch',
      command: vite.command,
      args: [...vite.leadingArgs, 'build', '--config', 'widget/vite.config.ts', '--watch'],
      cwd: workspaceRoot,
      env: parentEnv,
      output: { kind: 'inherit' },
    },
    server: {
      label: 'http-dev-server',
      command: tsx.command,
      // --import @sentry/node/preload: required Node.js ESM hook for Sentry
      // auto-instrumentation. Registers import-in-the-middle loader hooks
      // BEFORE application modules load. See scripts/start-server.sh for
      // the full rationale and Sentry doc references.
      args: [...tsx.leadingArgs, '--import', '@sentry/node/preload', 'src/index.ts'],
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
  delete localEnv.VERCEL_ENV;
  delete localEnv.VERCEL_GIT_COMMIT_REF;
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

/**
 * The module entry each workspace binary exposes, relative to the workspace
 * root. Used on win32 only — see {@link resolveWorkspaceBinary}.
 */
const WORKSPACE_BINARY_ENTRIES = {
  tsx: ['node_modules', 'tsx', 'dist', 'cli.mjs'],
  vite: ['node_modules', 'vite', 'bin', 'vite.js'],
} as const;

/**
 * How to launch a workspace-local binary: the executable to spawn, plus any
 * arguments that must precede the command's own.
 */
interface WorkspaceBinaryInvocation {
  readonly command: string;
  readonly leadingArgs: readonly string[];
}

/**
 * Resolve a launchable invocation for a workspace-local binary.
 *
 * pnpm writes two shims per binary: an extensionless shell script for POSIX
 * and a `.CMD` batch wrapper for Windows. Neither is directly spawnable on
 * win32 — the shell script is not an executable, and Node refuses to spawn
 * `.cmd`/`.bat` without a shell (the CVE-2024-27980 argument-injection fix),
 * which surfaces as `EINVAL`. Rather than reintroduce a shell, win32 launches
 * the binary's own module entry through the running Node — a fixed absolute
 * path by definition. This mirrors the pnpm resolution elsewhere in the
 * estate, which returns a launchable invocation for the same reason.
 *
 * @param platform - injected so both branches are provable from any host.
 */
function resolveWorkspaceBinary(
  workspaceRoot: string,
  binaryName: 'tsx' | 'vite',
  platform: NodeJS.Platform,
): WorkspaceBinaryInvocation {
  if (platform === 'win32') {
    return {
      command: process.execPath,
      leadingArgs: [join(workspaceRoot, ...WORKSPACE_BINARY_ENTRIES[binaryName])],
    };
  }

  return { command: join(workspaceRoot, 'node_modules', '.bin', binaryName), leadingArgs: [] };
}
