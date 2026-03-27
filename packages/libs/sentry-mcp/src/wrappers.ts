import type { McpObservationOptions, MergedMcpObservationKind } from './types.js';

const DEFAULT_CLOCK = (): number => Date.now();

function buildSpanName(kind: MergedMcpObservationKind, name: string): string {
  return `oak.mcp.${kind}.${name}`;
}

async function observeMcpOperation<T>(
  kind: MergedMcpObservationKind,
  name: string,
  run: () => Promise<T> | T,
  options: McpObservationOptions,
): Promise<T> {
  const now = options.now ?? DEFAULT_CLOCK;
  const start = now();

  return await options.runtime.withActiveSpan({
    tracer: options.tracer,
    name: buildSpanName(kind, name),
    attributes: {
      'oak.mcp.kind': kind,
      'oak.mcp.name': name,
    },
    run: async () => {
      const snapshot = options.runtime.getActiveSpanContext();

      try {
        const result = await run();
        options.recorder.record({
          kind,
          name,
          status: 'success',
          durationMs: now() - start,
          service: options.service,
          environment: options.environment,
          release: options.release,
          traceId: snapshot?.traceId,
          spanId: snapshot?.spanId,
        });
        return result;
      } catch (error) {
        options.recorder.record({
          kind,
          name,
          status: 'error',
          durationMs: now() - start,
          service: options.service,
          environment: options.environment,
          release: options.release,
          traceId: snapshot?.traceId,
          spanId: snapshot?.spanId,
        });
        throw error;
      }
    },
  });
}

export function wrapToolHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  options: McpObservationOptions,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> =>
    observeMcpOperation('tool', name, () => handler(...args), options);
}

export function wrapResourceHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  options: McpObservationOptions,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> =>
    observeMcpOperation('resource', name, () => handler(...args), options);
}

export function wrapPromptHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  options: McpObservationOptions,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> =>
    observeMcpOperation('prompt', name, () => handler(...args), options);
}
