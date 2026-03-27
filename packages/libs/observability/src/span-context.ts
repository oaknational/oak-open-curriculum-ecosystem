/**
 * Provider-neutral OpenTelemetry API helpers.
 */

import {
  context,
  trace,
  SpanStatusCode,
  type Attributes,
  type Context,
  type Tracer,
} from '@opentelemetry/api';
import type { ActiveSpanContextSnapshot, SpanAttributes } from './types.js';

/**
 * Reads the currently-active span context, if one exists.
 *
 * @param activeContext - Optional OpenTelemetry context override
 * @returns Active span snapshot or `undefined`
 */
export function getActiveSpanContextSnapshot(
  activeContext: Context = context.active(),
): ActiveSpanContextSnapshot | undefined {
  const activeSpan = trace.getSpan(activeContext);

  if (!activeSpan) {
    return undefined;
  }

  const spanContext = activeSpan.spanContext();

  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
  };
}

/**
 * Options for executing work inside a manual span.
 */
export interface WithActiveSpanOptions<T> {
  readonly tracer: Tracer | undefined;
  readonly name: string;
  readonly attributes?: SpanAttributes;
  readonly run: () => Promise<T> | T;
}

function toOtelAttributes(attributes: SpanAttributes | undefined): Attributes | undefined {
  return attributes;
}

/**
 * Executes work inside a manual span when a tracer is available.
 *
 * If no tracer is provided, the callback runs unchanged.
 *
 * @param options - Manual span execution options
 * @returns The callback result
 */
export async function withActiveSpan<T>(options: WithActiveSpanOptions<T>): Promise<T> {
  if (!options.tracer) {
    return await options.run();
  }

  return await options.tracer.startActiveSpan(options.name, async (span) => {
    const attributes = toOtelAttributes(options.attributes);

    if (attributes) {
      span.setAttributes(attributes);
    }

    try {
      const result = await options.run();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(
        error instanceof Error ? error : { name: 'Error', message: String(error) },
      );
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
