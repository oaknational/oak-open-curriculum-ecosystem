import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '@oaknational/workspace-config/vitest-e2e';

/**
 * E2E test configuration for Oak Curriculum SDK Generation
 * Tests that involve real I/O operations (network, filesystem)
 */
export default mergeConfig(baseE2EConfig, {
  // Generation workspace uses all defaults from base E2E config
});
