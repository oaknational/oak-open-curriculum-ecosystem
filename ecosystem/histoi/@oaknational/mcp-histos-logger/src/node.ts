/**
 * Node.js implementation of the Logger interface
 * Full-featured logging with rich formatting and file output support
 */

import { createConsola } from 'consola';
import type { Logger } from '@oaknational/mcp-moria';

export class NodeLogger implements Logger {
  private consola: ReturnType<typeof createConsola>;
  private contextData: Record<string, unknown>;

  constructor(options?: { level?: number; name?: string; context?: Record<string, unknown> }) {
    this.consola = createConsola({
      level: options?.level ?? 3,
      formatOptions: {
        colors: true,
        compact: false,
        date: true,
      },
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

  isLevelEnabled(level: number): boolean {
    return this.consola.level >= level;
  }

  child(context: Record<string, unknown>): Logger {
    return new NodeLogger({
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

export function createNodeLogger(options?: {
  level?: number;
  name?: string;
  context?: Record<string, unknown>;
}): Logger {
  return new NodeLogger(options);
}
