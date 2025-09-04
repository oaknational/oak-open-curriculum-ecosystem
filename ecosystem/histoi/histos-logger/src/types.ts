/**
 * Shared types and utilities for the logger module
 */

import type { LogLevel } from './log-levels.js';
import type { JsonObject } from '@oaknational/mcp-moria';

export type { LogLevel };

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: JsonObject;
}
