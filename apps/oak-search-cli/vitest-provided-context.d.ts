import 'vitest';
import type { SearchCliSmokeEnv } from './smoke-test-env.js';

declare module 'vitest' {
  interface ProvidedContext {
    readonly searchCliSmokeEnv: SearchCliSmokeEnv;
    /**
     * Error message from deferred env validation.
     *
     * Defined when `loadSmokeTestEnv` returned `err` at config-load time;
     * `undefined` when validation succeeded. Setup file checks this and
     * throws to fail the run with a clear message. See
     * `vitest.smoke.config.ts` for the deferral rationale.
     */
    readonly searchCliSmokeEnvLoadError: string | undefined;
  }
}
