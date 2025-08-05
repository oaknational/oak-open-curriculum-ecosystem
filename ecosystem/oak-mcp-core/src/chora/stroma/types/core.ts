/**
 * @fileoverview Core physics - fundamental types for dependency injection
 * @module substrate/types/core
 *
 * These types establish the patterns for how components interact.
 * Zero dependencies - foundational physics.
 */

import type { Logger } from '../contracts/logger.js';
import type { ConfigProvider } from '../contracts/config.js';

/**
 * Base dependencies interface for dependency injection patterns
 * This establishes how systems flow through the organism
 */
export interface Dependencies {
  // Systems are pervasive infrastructure that flow everywhere
  logger?: Logger;
  config?: ConfigProvider;
  events?: unknown; // Will be typed as EventBus contract when available
}

/**
 * Base context type for carrying request-scoped data
 */
export interface Context {
  correlationId?: string;
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}
