import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

/**
 * E2E test configuration for Oak Curriculum SDK
 * Tests that involve real I/O operations (network, filesystem)
 */
export default mergeConfig(baseE2EConfig, {
  // SDK uses all defaults from base E2E config
});
