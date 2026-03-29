import { normalizeError, type Logger } from '@oaknational/logger';

import { runSmokeAssertions, type SmokeContext } from './smoke-assertions/index.js';
import type { SmokeSuiteMode } from './smoke-assertions/types.js';
import {
  captureEnvSnapshot,
  DEFAULT_PORT,
  prepareEnvironment,
  restoreEnv,
  teardownEnvironment,
} from './environment.js';
import { createModeLogger, createRootLogger, resolveLogConfig, type LogConfig } from './logging.js';
import type { PreparedEnvironment, SmokeSuiteOptions } from './types.js';

export async function runSmokeSuite(options: SmokeSuiteOptions): Promise<void> {
  const snapshot = captureEnvSnapshot();
  const logConfig = resolveLogConfig();
  const rootLogger = createRootLogger(options.mode);

  let prepared: PreparedEnvironment | undefined;
  let modeLogger = rootLogger;

  try {
    prepared = await prepareEnvironmentWithPortFallback(options, snapshot, rootLogger);

    modeLogger = createModeLogger(rootLogger, options.mode, prepared.baseUrl);
    logPreparation(options.mode, prepared, modeLogger, logConfig);

    const context = buildSmokeContext(options.mode, prepared, modeLogger, logConfig);
    await runSmokeAssertions(context);

    modeLogger.info('Smoke suite completed successfully', {
      baseUrl: prepared.baseUrl,
      mode: options.mode,
      logToFile: logConfig.logToFile,
    });
  } catch (error) {
    const failureLogger = prepared ? modeLogger : rootLogger;
    failureLogger.error('Smoke suite failed', normalizeError(error), {
      mode: options.mode,
      baseUrl: prepared?.baseUrl,
    });
    throw error;
  } finally {
    await teardownEnvironment(prepared, modeLogger, options.mode);
    restoreEnv(snapshot);
  }
}

async function prepareEnvironmentWithPortFallback(
  options: SmokeSuiteOptions,
  snapshot: ReturnType<typeof captureEnvSnapshot>,
  logger: Logger,
): Promise<PreparedEnvironment> {
  const preferredPort = options.port ?? DEFAULT_PORT;
  const allowFallback = options.port === undefined;

  const attempt = async (port: number): Promise<PreparedEnvironment> =>
    prepareEnvironment({
      mode: options.mode,
      port,
      remoteBaseUrl: options.remoteBaseUrl,
      remoteDevToken: options.remoteDevToken,
    });

  try {
    return await attempt(preferredPort);
  } catch (error) {
    if (allowFallback && isPortInUseError(error)) {
      logger.warn('Smoke port already in use, retrying with an ephemeral port', {
        preferredPort,
      });
      restoreEnv(snapshot);
      return await attempt(0);
    }
    throw error;
  }
}

function isPortInUseError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith('PORT CONFLICT: Port ');
}

function logPreparation(
  mode: SmokeSuiteMode,
  preparation: PreparedEnvironment,
  logger: Logger,
  fileConfig: LogConfig,
): void {
  logger.info('Prepared smoke environment', {
    mode,
    baseUrl: preparation.baseUrl,
    devTokenSource: preparation.devTokenSource,
    remoteUrlSource: preparation.remoteUrlSource,
    envFileLoaded: preparation.envLoad.loaded,
    envFilePath: preparation.envLoad.path,
    repoRoot: preparation.envLoad.repoRoot,
    logToFile: fileConfig.logToFile,
    logDirectory: fileConfig.logDirectory,
  });
}

function buildSmokeContext(
  mode: SmokeSuiteMode,
  preparation: PreparedEnvironment,
  logger: Logger,
  logConfig: LogConfig,
): SmokeContext {
  return {
    baseUrl: preparation.baseUrl,
    devToken: preparation.devToken,
    mode,
    logger,
    metadata: {
      devTokenSource: preparation.devTokenSource,
      envFileLoaded: preparation.envLoad.loaded,
      envFilePath: preparation.envLoad.path,
      repoRoot: preparation.envLoad.repoRoot,
      remoteUrlSource: preparation.remoteUrlSource,
    },
    logToFile: logConfig.logToFile,
    logDirectory: logConfig.logDirectory,
    captureAnalysis: logConfig.captureAnalysis,
  };
}
