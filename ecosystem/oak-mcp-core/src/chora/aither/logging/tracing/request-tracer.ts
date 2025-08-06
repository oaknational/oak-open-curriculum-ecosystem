/**
 * @fileoverview RequestTracer class for managing trace context
 * @module @oak-mcp-core/logging/tracing
 */

import type { ContextStorage } from '../../errors/context-storage.js';
import { createContextStorage } from '../../errors/context-storage.js';
import type { TraceContext, RequestTracingOptions } from './types.js';
import {
  generateRequestId,
  generateSpanId,
  createTraceContext,
  createSpanContext,
  shouldSample,
} from './utils-index.js';

/**
 * Request tracer for managing trace context lifecycle
 */
export class RequestTracer {
  private readonly storage: ContextStorage<TraceContext>;
  private readonly options: Required<RequestTracingOptions>;

  constructor(options: RequestTracingOptions = {}) {
    this.storage = createContextStorage<TraceContext>('tracer');
    this.options = {
      enabled: options.enabled ?? true,
      sampleRate: options.sampleRate ?? 1.0,
      requestIdPrefix: options.requestIdPrefix ?? 'req',
      extractHeaders: options.extractHeaders ?? true,
      propagateHeaders: options.propagateHeaders ?? true,
      logTraceInfo: options.logTraceInfo ?? true,
    };
  }

  /**
   * Type guard to check if context is a full TraceContext
   * @param context - Context to check
   * @returns True if context is a full TraceContext
   */
  private isFullTraceContext(
    context: TraceContext | Partial<TraceContext>,
  ): context is TraceContext {
    return 'requestId' in context && typeof context.requestId === 'string';
  }

  /**
   * Get current trace context
   * @returns Current trace context or undefined
   */
  getContext(): TraceContext | undefined {
    if (!this.options.enabled) {
      return undefined;
    }
    return this.storage.getStore();
  }

  /**
   * Run a function with a new trace context
   * @param context - Trace context or creation options
   * @param fn - Function to run
   * @returns Function result
   */
  runWithContext<T>(context: TraceContext | Partial<TraceContext>, fn: () => T): T {
    if (!this.options.enabled) {
      return fn();
    }

    // Create full context if partial
    const fullContext: TraceContext = this.isFullTraceContext(context)
      ? context
      : createTraceContext({
          ...context,
          requestId: context.requestId ?? generateRequestId(this.options.requestIdPrefix),
        });

    // Check sampling
    if (!shouldSample(this.options.sampleRate)) {
      return fn();
    }

    return this.storage.run(fullContext, fn);
  }

  /**
   * Run an async function with a new trace context
   * @param context - Trace context or creation options
   * @param fn - Async function to run
   * @returns Promise with function result
   */
  async runWithContextAsync<T>(
    context: TraceContext | Partial<TraceContext>,
    fn: () => Promise<T>,
  ): Promise<T> {
    if (!this.options.enabled) {
      return fn();
    }

    // Create full context if partial
    const fullContext: TraceContext = this.isFullTraceContext(context)
      ? context
      : createTraceContext({
          ...context,
          requestId: context.requestId ?? generateRequestId(this.options.requestIdPrefix),
        });

    // Check sampling
    if (!shouldSample(this.options.sampleRate)) {
      return fn();
    }

    return this.storage.run(fullContext, fn);
  }

  /**
   * Create a child span
   * @param fn - Function to run in child span
   * @returns Function result
   */
  span<T>(fn: (spanContext: TraceContext) => T): T {
    const parent = this.getContext();
    if (!parent) {
      // No parent context, run without span
      return fn(createTraceContext({ spanId: generateSpanId() }));
    }

    const spanContext = createSpanContext(parent);
    return this.storage.run(spanContext, () => fn(spanContext));
  }

  /**
   * Create an async child span
   * @param fn - Async function to run in child span
   * @returns Promise with function result
   */
  async spanAsync<T>(fn: (spanContext: TraceContext) => Promise<T>): Promise<T> {
    const parent = this.getContext();
    if (!parent) {
      // No parent context, run without span
      return fn(createTraceContext({ spanId: generateSpanId() }));
    }

    const spanContext = createSpanContext(parent);
    return this.storage.run(spanContext, () => fn(spanContext));
  }

  /**
   * Update current trace context
   * @param updates - Context updates
   * Note: In genotype, context updates are not supported mid-trace
   */
  updateContext(_updates: Partial<TraceContext>): void {
    // ContextStorage doesn't support updating context mid-execution
    // Updates should be done at trace creation or in phenotype with AsyncLocalStorage
    console.warn(
      `Updating trace context mid-execution requires AsyncLocalStorage. Ignoring: ${JSON.stringify(_updates)}`,
    );
  }

  /**
   * Clear current trace context
   * Note: Context automatically clears when run() completes
   */
  clearContext(): void {
    // ContextStorage doesn't have disable method
    // Context automatically clears when run() completes
  }

  /**
   * Check if tracing is enabled
   * @returns True if tracing is enabled
   */
  isEnabled(): boolean {
    return this.options.enabled;
  }

  /**
   * Get tracing options
   * @returns Current tracing options
   */
  getOptions(): Readonly<Required<RequestTracingOptions>> {
    return { ...this.options };
  }
}
