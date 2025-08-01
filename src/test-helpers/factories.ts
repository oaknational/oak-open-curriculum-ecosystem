/**
 * Simple test factories for creating mock objects
 * Following testing strategy: simple mocks passed as arguments
 */

import type { Logger } from '../logging/logger.js';
import type { ServerConfig } from '../types/dependencies.js';
import { vi } from 'vitest';

/**
 * Creates a simple mock Logger instance
 */
export function createMockLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

/**
 * Creates server configuration for testing
 */
export function createMockServerConfig(overrides?: Partial<ServerConfig>): ServerConfig {
  return {
    name: 'test-server',
    version: '1.0.0',
    ...overrides,
  };
}
