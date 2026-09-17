import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '@oaknational/workspace-config/vitest-e2e';

/**
 * E2E test configuration for agent-tools.
 *
 * TUI E2E tests are in-process and dependency-injected per the repo's
 * testing doctrine. Built-command startup belongs to smoke, not E2E.
 */
export default mergeConfig(baseE2EConfig, {
  test: {
    include: ['e2e-tests/**/*.e2e.test.ts'],
  },
});
