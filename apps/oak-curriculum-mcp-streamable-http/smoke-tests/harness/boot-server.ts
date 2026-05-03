/**
 * Production wirings for the harness's boot seam.
 *
 * @remarks
 * Two factories are exported:
 *
 * 1. {@link createInProcessBootServer} — boots the app in-process via
 *    `loadRuntimeConfig` + `createHttpObservability` + `createApp` +
 *    `app.listen`. Used by the four `local-*` modes; the listen
 *    callback fires after `runBootstrapPhase` completes per
 *    ADR-143/ADR-160 ordering, so `/healthz` and `/mcp` are ready
 *    when the harness moves into the test phase.
 * 2. {@link createRemoteBootServer} — does NOT boot anything; reads
 *    the remote base URL from the mode's injected env and resolves
 *    immediately to a `listening`-shaped {@link BootOutcome} so the
 *    same orchestrator path works for client-side smoke runs against
 *    an externally-running server. The "listening" naming becomes a
 *    semantic stretch (the harness has not bound a socket), but it
 *    keeps the {@link BootServer} discriminator clean and avoids
 *    branching the orchestrator on mode kind.
 *
 * The injected env is passed verbatim to `loadRuntimeConfig`
 * (in-process) or read for the remote URL (remote) — no
 * `process.env` access, no global mutation. Listen errors and
 * synchronous throws are translated through the pure classifiers in
 * `./boot-outcome.ts`.
 *
 * @packageDocumentation
 */

import type { Server } from 'node:http';
import { createApp } from '../../src/application.js';
import { WIDGET_HTML_CONTENT } from '../../src/generated/widget-html-content.js';
import {
  createHttpObservability,
  describeHttpObservabilityError,
} from '../../src/observability/http-observability.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import {
  EPHEMERAL_PORT,
  LOOPBACK_HOST,
  closeSmokeServer,
  isValidAddress,
} from '../server-lifecycle.js';
import {
  crashedOutcome,
  envErrorOutcome,
  listeningOutcome,
  timeoutOutcome,
} from './boot-outcome.js';
import type { BootOutcome, BootServer, Clock } from './types.js';

/**
 * Dependencies for {@link createInProcessBootServer}.
 *
 * @remarks
 * Production wiring uses `Date.now`. Integration tests covering this
 * module's listen-error paths can inject a deterministic clock; the
 * harness orchestration tests rely on a fully-faked {@link BootServer}
 * and never reach this implementation.
 */
export interface InProcessBootServerDeps {
  readonly clock: Clock;
}

/**
 * Builds a {@link BootServer} bound to the production createApp+listen
 * surface.
 *
 * @remarks
 * The returned function MUST NOT be invoked concurrently for the same
 * port — the underlying `app.listen` mutates module-level state in
 * Express. The harness orchestrator runs one mode at a time, so the
 * single-active-server invariant holds.
 */
export function createInProcessBootServer(deps: InProcessBootServerDeps): BootServer {
  return async (env, signal): Promise<BootOutcome> => {
    const startedAt = deps.clock();

    if (signal.aborted) {
      return timeoutOutcome(deps.clock() - startedAt);
    }

    const configResult = loadRuntimeConfig({ processEnv: env, startDir: process.cwd() });
    if (!configResult.ok) {
      return envErrorOutcome(configResult.error.message);
    }

    const observabilityResult = createHttpObservability(configResult.value);
    if (!observabilityResult.ok) {
      return envErrorOutcome(describeHttpObservabilityError(observabilityResult.error));
    }

    let app: Awaited<ReturnType<typeof createApp>>;
    try {
      app = await createApp({
        runtimeConfig: configResult.value,
        observability: observabilityResult.value,
        getWidgetHtml: () => WIDGET_HTML_CONTENT,
      });
    } catch (error) {
      return crashedOutcome(error);
    }

    return await listenOnce(app, signal, startedAt, deps.clock);
  };
}

/**
 * Builds a {@link BootServer} that resolves to a `listening` outcome
 * using a base URL read from the mode-injected env.
 *
 * @remarks
 * Used by the `remote` smoke mode where there is no local server to
 * bind — the smoke run targets an externally-hosted MCP server. The
 * mode's env-builder MUST place the URL at the expected key (see
 * {@link RemoteBootServerDeps.envKey}); the factory fails fast with
 * an `env-error` outcome when the value is missing or empty so
 * misconfiguration surfaces deterministically.
 *
 * The cleanup callback is a no-op — the harness did not start
 * anything to tear down. The orchestrator still invokes it for
 * lifecycle uniformity.
 */
export function createRemoteBootServer(deps: RemoteBootServerDeps): BootServer {
  return async (env): Promise<BootOutcome> => {
    const value = env[deps.envKey];
    if (typeof value !== 'string' || value.length === 0) {
      return envErrorOutcome(
        `Remote smoke mode requires ${deps.envKey} to be set in the mode env-builder output.`,
      );
    }
    return listeningOutcome(value, (): Promise<void> => Promise.resolve());
  };
}

/**
 * Dependencies for {@link createRemoteBootServer}.
 *
 * @remarks
 * `envKey` names the env variable that carries the remote MCP server
 * URL — typically `SMOKE_REMOTE_BASE_URL`. The factory itself does
 * not hardcode the key so different remote modes (e.g. preview vs
 * production smoke) can use distinct keys without duplicating the
 * factory.
 */
export interface RemoteBootServerDeps {
  readonly envKey: string;
}

async function listenOnce(
  app: Awaited<ReturnType<typeof createApp>>,
  signal: AbortSignal,
  startedAt: number,
  clock: Clock,
): Promise<BootOutcome> {
  return await new Promise<BootOutcome>((resolve) => {
    const server: Server = app.listen(EPHEMERAL_PORT, LOOPBACK_HOST, () => {
      const address = server.address();
      if (!isValidAddress(address, EPHEMERAL_PORT)) {
        void closeSmokeServer(server);
        resolve(crashedOutcome(new Error('Smoke server failed to bind to an ephemeral port')));
        return;
      }
      const baseUrl = `http://${address.address}:${String(address.port)}`;
      resolve(
        listeningOutcome(baseUrl, async (): Promise<void> => {
          await closeSmokeServer(server);
        }),
      );
    });

    const onAbort = (): void => {
      if (server.listening) {
        void closeSmokeServer(server);
      }
      resolve(timeoutOutcome(clock() - startedAt));
    };
    signal.addEventListener('abort', onAbort, { once: true });

    server.on('error', (error: NodeJS.ErrnoException) => {
      resolve(crashedOutcome(error));
    });
  });
}
