import type { RuntimeConfig } from '../../src/runtime-config.js';

export function createMockRuntimeConfig(overrides?: Partial<RuntimeConfig>): RuntimeConfig {
  return {
    env: {
      OAK_API_KEY: 'mock-oak-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_mock',
      CLERK_SECRET_KEY: 'sk_test_mock',
      LOG_LEVEL: 'error',
      NODE_ENV: 'test',
      ...overrides?.env,
    },
    dangerouslyDisableAuth: false,
    useStubTools: false,
    version: '0.0.0-test',
    vercelHostnames: [],
    ...overrides,
  };
}

export const mockClerkExpressImplementation = (): {
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => void;
  requireAuth: () => (_req: unknown, _res: unknown, next: () => void) => void;
  getAuth: () => { isAuthenticated: boolean; toAuth: () => Record<string, unknown> };
} => {
  return {
    clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
      next();
    },
    requireAuth: () => (_req: unknown, _res: unknown, next: () => void) => {
      next();
    },
    getAuth: () => ({
      isAuthenticated: false,
      toAuth: () => ({}),
    }),
  };
};
