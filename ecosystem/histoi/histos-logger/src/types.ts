/**
 * Shared types and utilities for the logger module
 */

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: Record<string, unknown>;
}
