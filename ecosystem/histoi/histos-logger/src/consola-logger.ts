/**
 * Unified logger implementation using Consola
 * Adapts configuration based on available features
 */

import { createConsola, type ConsolaOptions } from 'consola';
import type { Logger } from '@oaknational/mcp-moria';
import type { LoggerOptions } from './types';
import { levelToNumber } from './types';

export class ConsolaLogger implements Logger {
  private consola: ReturnType<typeof createConsola>;
  private contextData: Record<string, unknown>;

  constructor(
    options?: LoggerOptions & {
      consolaOptions?: Partial<ConsolaOptions>;
    },
  ) {
    // Convert semantic level to numeric if needed
    const numericLevel = options?.level ? levelToNumber(options.level) : 20; // Default to INFO (20)

    // Consola uses 0-5 scale, so we need to map our 0-50 scale
    const consolaLevel = Math.floor(numericLevel / 10);

    this.consola = createConsola({
      level: consolaLevel,
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
