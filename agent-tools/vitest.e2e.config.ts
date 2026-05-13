import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../vitest.e2e.config.base';

/**
 * E2E test configuration for agent-tools.
 *
 * TUI E2E tests are in-process and dependency-injected per the repo's
 * testing doctrine. Built-command startup belongs to smoke, not E2E.
 */
export default mergeConfig(baseE2EConfig, {
  test: {
    passWithNoTests: false,
    include: ['e2e-tests/**/*.e2e.test.ts'],
  },
});
