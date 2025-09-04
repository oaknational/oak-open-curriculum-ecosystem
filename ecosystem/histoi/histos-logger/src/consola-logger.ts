/**
 * Unified logger implementation using Consola
 * Adapts configuration based on available features
 */

import type { ConsolaInstance } from 'consola';
import type { Logger, JsonObject } from '@oaknational/mcp-moria';
import { mergeLogContext, normalizeError } from './pure-functions.js';

export class ConsolaLogger implements Logger {
  private readonly consola: ConsolaInstance;
  private readonly contextData: JsonObject;

  constructor(consola: ConsolaInstance, contextData: JsonObject = {}) {
    this.consola = consola;
    this.contextData = contextData;
  }

  trace(message: string, context?: unknown): void {
    this.consola.trace(message, mergeLogContext(this.contextData, context));
  }

  debug(message: string, context?: unknown): void {
    this.consola.debug(message, mergeLogContext(this.contextData, context));
  }

  info(message: string, context?: unknown): void {
    this.consola.info(message, mergeLogContext(this.contextData, context));
  }

  warn(message: string, context?: unknown): void {
    this.consola.warn(message, mergeLogContext(this.contextData, context));
  }

  error(message: string, error?: unknown, context?: unknown): void {
    const errorObj = error ? normalizeError(error) : undefined;
    this.consola.error(message, errorObj, mergeLogContext(this.contextData, context));
  }

  fatal(message: string, error?: unknown, context?: unknown): void {
    const errorObj = error ? normalizeError(error) : undefined;
    this.consola.fatal(message, errorObj, mergeLogContext(this.contextData, context));
  }

  isLevelEnabled?(level: number): boolean {
    return this.consola.level >= level;
  }

  child?(context: JsonObject): Logger {
    return new ConsolaLogger(this.consola, mergeLogContext(this.contextData, context));
  }
}
