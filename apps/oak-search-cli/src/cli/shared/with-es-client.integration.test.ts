/**
 * Integration tests for the `withEsClient` resource lifecycle wrapper.
 *
 * @remarks
 * Verifies that ES client cleanup, structured error logging, and exit
 * code signalling work correctly under success, handler-throw, and
 * cleanup-throw scenarios.
 *
 * All dependencies are injected as simple fakes (ADR-078).
 */
import { describe, it, expect, vi } from 'vitest';
import { withEsClient } from './with-es-client.js';

/** Minimal fake ES client satisfying the close contract. */
function createFakeEsClient(closeImpl?: () => Promise<void>) {
  return { close: vi.fn(closeImpl ?? (() => Promise.resolve())) };
}

/** Minimal fake logger satisfying the Logger interface. */
function createFakeLogger() {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  };
}

/** Minimal fake deps for withEsClient. */
function createFakeDeps(overrides?: { logger?: ReturnType<typeof createFakeLogger> }) {
  return {
    logger: overrides?.logger ?? createFakeLogger(),
    printError: vi.fn(),
    setExitCode: vi.fn(),
  };
}

describe('withEsClient', () => {
  it('calls esClient.close() after a successful handler', async () => {
    const esClient = createFakeEsClient();
    const deps = createFakeDeps();

    await withEsClient(
      esClient,
      async () => {
        // success — no-op
      },
      deps,
    );

    expect(esClient.close).toHaveBeenCalledOnce();
  });

  it('calls esClient.close() when the handler throws', async () => {
    const esClient = createFakeEsClient();
    const deps = createFakeDeps();

    await withEsClient(
      esClient,
      async () => {
        throw new Error('handler boom');
      },
      deps,
    );

    expect(esClient.close).toHaveBeenCalledOnce();
  });

  it('logs structurally when the handler throws', async () => {
    const esClient = createFakeEsClient();
    const logger = createFakeLogger();
    const deps = createFakeDeps({ logger });
    const error = new Error('handler boom');

    await withEsClient(
      esClient,
      async () => {
        throw error;
      },
      deps,
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Command failed',
      expect.objectContaining({
        name: 'Error',
        message: 'handler boom',
      }),
    );
  });

  it('calls printError with the error message when the handler throws', async () => {
    const esClient = createFakeEsClient();
    const deps = createFakeDeps();

    await withEsClient(
      esClient,
      async () => {
        throw new Error('handler boom');
      },
      deps,
    );

    expect(deps.printError).toHaveBeenCalledWith('handler boom');
  });

  it('calls printError with String(error) for non-Error throws', async () => {
    const esClient = createFakeEsClient();
    const deps = createFakeDeps();

    await withEsClient(
      esClient,
      async () => {
        throw 'string error';
      },
      deps,
    );

    expect(deps.printError).toHaveBeenCalledWith('string error');
  });

  it('calls setExitCode(1) when the handler throws', async () => {
    const esClient = createFakeEsClient();
    const deps = createFakeDeps();

    await withEsClient(
      esClient,
      async () => {
        throw new Error('handler boom');
      },
      deps,
    );

    expect(deps.setExitCode).toHaveBeenCalledWith(1);
  });

  it('does not call setExitCode on success', async () => {
    const esClient = createFakeEsClient();
    const deps = createFakeDeps();

    await withEsClient(
      esClient,
      async () => {
        // success
      },
      deps,
    );

    expect(deps.setExitCode).not.toHaveBeenCalled();
  });

  it('logs a warning when esClient.close() throws', async () => {
    const closeError = new Error('close boom');
    const esClient = createFakeEsClient(() => Promise.reject(closeError));
    const logger = createFakeLogger();
    const deps = createFakeDeps({ logger });

    await withEsClient(
      esClient,
      async () => {
        // success — cleanup will fail
      },
      deps,
    );

    const warnContext: unknown = logger.warn.mock.calls[0]?.[1];

    expect(logger.warn).toHaveBeenCalledWith('ES client close failed', expect.anything());
    expect(warnContext).toMatchObject({
      error: {
        name: 'Error',
        message: 'close boom',
      },
    });
  });

  it('does not re-throw when esClient.close() throws', async () => {
    const esClient = createFakeEsClient(() => Promise.reject(new Error('close boom')));
    const deps = createFakeDeps();

    // Should not throw
    await withEsClient(
      esClient,
      async () => {
        /* intentionally empty — tests that close() errors do not propagate */
      },
      deps,
    );
  });
});
