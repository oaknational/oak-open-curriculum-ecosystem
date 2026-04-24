import 'vitest';
import type { SearchCliSmokeEnv } from './smoke-test-env.js';

declare module 'vitest' {
  interface ProvidedContext {
    readonly searchCliSmokeEnv: SearchCliSmokeEnv;
  }
}
