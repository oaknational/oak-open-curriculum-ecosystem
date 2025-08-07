/**
 * Edge/Browser implementation of the Logger interface
 * Lightweight logging using console with minimal overhead
 */

import type { Logger } from '@oaknational/mcp-moria';

export class EdgeLogger implements Logger {
  private level: number;
  private name?: string;
  private contextData: Record<string, unknown>;

  private static readonly LEVELS = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  };

  constructor(options?: { level?: number; name?: string; context?: Record<string, unknown> }) {
    this.level = options?.level ?? 2; // Default to info
    this.name = options?.name;
    this.contextData = options?.context ?? {};
  }

  trace(message: string, context?: unknown): void {
    if (this.level <= EdgeLogger.LEVELS.trace) {
      this.log('trace', message, context);
    }
  }

  debug(message: string, context?: unknown): void {
    if (this.level <= EdgeLogger.LEVELS.debug) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: unknown): void {
    if (this.level <= EdgeLogger.LEVELS.info) {
      this.log('info', message, context);
    }
  }

  warn(message: string, context?: unknown): void {
    if (this.level <= EdgeLogger.LEVELS.warn) {
      this.log('warn', message, context);
    }
  }

  error(message: string, error?: unknown, context?: unknown): void {
    if (this.level <= EdgeLogger.LEVELS.error) {
      this.log('error', message, context, error);
    }
  }

  fatal(message: string, error?: unknown, context?: unknown): void {
    if (this.level <= EdgeLogger.LEVELS.fatal) {
      this.log('error', `[FATAL] ${message}`, context, error);
    }
  }

  isLevelEnabled(level: number): boolean {
    return level >= this.level;
  }

  child(context: Record<string, unknown>): Logger {
    return new EdgeLogger({
      level: this.level,
      name: this.name,
      context: { ...this.contextData, ...context },
    });
  }

  private log(
    level: keyof typeof EdgeLogger.LEVELS,
    message: string,
    context?: unknown,
    error?: unknown,
  ): void {
    const prefix = this.name ? `[${this.name}]` : '';
    const fullMessage = `${prefix} ${message}`.trim();

    const logData: unknown[] = [fullMessage];

    if (error !== undefined) {
      // For error/fatal, the error comes second, then context
      logData.push(error);
    }

    const mergedContext = this.mergeContext(context);
    if (Object.keys(mergedContext).length > 0) {
      logData.push(mergedContext);
    }

    // Type-safe console methods
    const logMethod = this.getLogMethod(level);
    logMethod(...logData);
  }

  private getLogMethod(level: keyof typeof EdgeLogger.LEVELS): (...args: unknown[]) => void {
    switch (level) {
      case 'trace':
      case 'debug':
        return console.debug.bind(console);
      case 'info':
        return console.info.bind(console);
      case 'warn':
        return console.warn.bind(console);
      case 'error':
      case 'fatal':
        return console.error.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  private mergeContext(context?: unknown): Record<string, unknown> {
    if (!context) return this.contextData;
    if (typeof context === 'object' && !Array.isArray(context)) {
      return { ...this.contextData, ...(context as Record<string, unknown>) };
    }
    return { ...this.contextData, value: context };
  }
}

export function createEdgeLogger(options?: {
  level?: number;
  name?: string;
  context?: Record<string, unknown>;
}): Logger {
  return new EdgeLogger(options);
}
