import type { McpObservationOptions, MergedMcpObservationKind } from './types.js';

const DEFAULT_CLOCK = (): number => Date.now();

function buildSpanName(kind: MergedMcpObservationKind, name: string): string {
  return `oak.mcp.${kind}.${name}`;
}

function safeRecord(
  options: McpObservationOptions,
  observation: Parameters<McpObservationOptions['recorder']['record']>[0],
): void {
  try {
    options.recorder.record(observation);
  } catch {
    // Recorder failures must never mask handler errors or turn successes into throws.
  }
}

async function observeMcpOperation<T>(
  kind: MergedMcpObservationKind,
  name: string,
  run: () => Promise<T> | T,
  options: McpObservationOptions,
): Promise<Awaited<T>> {
  const now = options.now ?? DEFAULT_CLOCK;
  const start = now();

  return await options.runtime.withActiveSpan({
    tracer: options.tracer,
    name: buildSpanName(kind, name),
    attributes: { 'oak.mcp.kind': kind, 'oak.mcp.name': name },
    run: async () => {
      const snapshot = options.runtime.getActiveSpanContext();
      const base = {
        kind,
        name,
        service: options.service,
        environment: options.environment,
        release: options.release,
        traceId: snapshot?.traceId,
        spanId: snapshot?.spanId,
      };

      try {
        const result = await run();
        safeRecord(options, { ...base, status: 'success', durationMs: now() - start });
        return result;
      } catch (error) {
        safeRecord(options, { ...base, status: 'error', durationMs: now() - start });
        throw error;
      }
    },
  });
}

export function wrapToolHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  options: McpObservationOptions,
): (...args: TArgs) => Promise<Awaited<TResult>> {
  return async (...args: TArgs): Promise<Awaited<TResult>> =>
    observeMcpOperation('tool', name, () => handler(...args), options);
}

export function wrapResourceHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  options: McpObservationOptions,
): (...args: TArgs) => Promise<Awaited<TResult>> {
  return async (...args: TArgs): Promise<Awaited<TResult>> =>
    observeMcpOperation('resource', name, () => handler(...args), options);
}

export function wrapPromptHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  options: McpObservationOptions,
): (...args: TArgs) => Promise<Awaited<TResult>> {
  return async (...args: TArgs): Promise<Awaited<TResult>> =>
    observeMcpOperation('prompt', name, () => handler(...args), options);
}
