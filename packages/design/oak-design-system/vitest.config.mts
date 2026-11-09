import { mergeConfig } from 'vitest/config';

import { baseTestConfig } from '@oaknational/workspace-config/vitest';

/**
 * The theme runtime is a browser pre-paint script (document.documentElement,
 * localStorage, matchMedia), so this workspace overrides the base config's
 * node environment with happy-dom — the estate's DOM-test environment
 * (demos/oak-design-showcase/vitest.config.ts is the precedent). Includes and
 * the mandatory e2e exclusion are inherited unchanged.
 *
 * Category note (testing-strategy.md §Test Types): this workspace's suites
 * are INTEGRATION-class by behaviour shape — the system under test (the
 * emitted dist/oak-theme.js) is evaluated inside the test process against
 * injected fakes, or compared byte-for-byte with the committed copy. They
 * are not smoke tests: smoke invokes the artefact exactly as production
 * does, with no fakes and no feature assertions. They are named
 * *.integration.test.ts; the include below is scoped to exactly that
 * category so the taxonomy's one-category-per-config rule holds.
 */
export default mergeConfig(baseTestConfig, {
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.integration.test.ts'],
  },
});
