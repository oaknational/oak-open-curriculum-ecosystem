/**
 * Simple test factories for creating mock objects
 * Following testing strategy: simple mocks passed as arguments
 */

import type { Logger } from '../aither/logging/logger-interface.js';
import type { ServerConfig } from '../phaneron/config/environment.js';
import { vi } from 'vitest';

/**
 * Creates a simple mock Logger instance
 */
export function createMockLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn().mockReturnThis(),
    isLevelEnabled: vi.fn().mockReturnValue(true),
    setLevel: vi.fn(),
    getLevel: vi.fn().mockReturnValue(20), // INFO level
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
