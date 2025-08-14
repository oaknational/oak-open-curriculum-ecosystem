/**
 * Shared types and utilities for the logger module
 */

import type { LogLevel } from './log-levels.js';

export type { LogLevel };

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: Record<string, unknown>;
}
