/**
 * Shared types and utilities for the logger module
 */

import type { LogLevel } from './log-levels';
import type { JsonObject } from '@oaknational/mcp-core';

export type { LogLevel };

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: JsonObject;
}
