import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../../vitest.e2e.config.base';

/**
 * E2E test configuration for Oak Curriculum SDK Generation
 * Tests that involve real I/O operations (network, filesystem)
 */
export default mergeConfig(baseE2EConfig, {
  // Generation workspace uses all defaults from base E2E config
});
