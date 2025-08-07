/**
 * Unified logger implementation using Consola
 * Adapts configuration based on available features
 */

import { createConsola, type ConsolaOptions } from 'consola';
import type { Logger } from '@oaknational/mcp-moria';

export class ConsolaLogger implements Logger {
  private consola: ReturnType<typeof createConsola>;
  private contextData: Record<string, unknown>;

  constructor(options?: {
    level?: number;
    name?: string;
    context?: Record<string, unknown>;
    consolaOptions?: Partial<ConsolaOptions>;
  }) {
    this.consola = createConsola({
      level: options?.level ?? 3,
      ...options?.consolaOptions,
    });

    if (options?.name) {
      this.consola = this.consola.withTag(options.name);
    }

    this.contextData = options?.context ?? {};
  }

  trace(message: string, context?: unknown): void {
    this.consola.trace(message, this.mergeContext(context));
  }

  debug(message: string, context?: unknown): void {
    this.consola.debug(message, this.mergeContext(context));
  }

  info(message: string, context?: unknown): void {
    this.consola.info(message, this.mergeContext(context));
  }

  warn(message: string, context?: unknown): void {
    this.consola.warn(message, this.mergeContext(context));
  }

  error(message: string, error?: unknown, context?: unknown): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.consola.error(message, errorObj, this.mergeContext(context));
  }

  fatal(message: string, error?: unknown, context?: unknown): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.consola.fatal(message, errorObj, this.mergeContext(context));
  }

  isLevelEnabled?(level: number): boolean {
    return this.consola.level >= level;
  }

  child?(context: Record<string, unknown>): Logger {
    return new ConsolaLogger({
      level: this.consola.level,
      context: { ...this.contextData, ...context },
    });
  }

  private mergeContext(context?: unknown): Record<string, unknown> {
    if (!context) return this.contextData;
    if (typeof context === 'object' && !Array.isArray(context)) {
      return { ...this.contextData, ...(context as Record<string, unknown>) };
    }
    return { ...this.contextData, value: context };
  }
}

/**
 * Creates a logger with Node.js-specific features if available
 */
export async function createLoggerWithNodeFeatures(options?: {
  level?: number;
  name?: string;
  context?: Record<string, unknown>;
}): Promise<Logger> {
  // Check if we have Node.js fs APIs for file transports
  try {
    await import('node:fs');
    // We have fs available - we could add file transports here if needed
    // For now, just use richer formatting options
    return new ConsolaLogger({
      ...options,
      consolaOptions: {
        formatOptions: {
          colors: true,
          compact: false,
          date: true,
        },
      },
    });
  } catch {
    // No fs available, use basic console transport
    return new ConsolaLogger(options);
  }
}

/**
 * Creates a basic logger for edge environments
 */
export function createBasicLogger(options?: {
  level?: number;
  name?: string;
  context?: Record<string, unknown>;
}): Logger {
  return new ConsolaLogger(options);
}
