import type { Tracer } from '@opentelemetry/api';
import type { ActiveSpanContextSnapshot, WithActiveSpanOptions } from '@oaknational/observability';

export type MergedMcpObservationKind = 'tool' | 'resource' | 'prompt';
export type MergedMcpObservationStatus = 'success' | 'error';

export interface MergedMcpObservation {
  readonly kind: MergedMcpObservationKind;
  readonly name: string;
  readonly status: MergedMcpObservationStatus;
  readonly durationMs: number;
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly traceId?: string;
  readonly spanId?: string;
}

export interface McpObservationRecorder {
  record(observation: MergedMcpObservation): void;
}

export interface McpObservationRuntime {
  readonly getActiveSpanContext: () => ActiveSpanContextSnapshot | undefined;
  withActiveSpan<T>(options: WithActiveSpanOptions<T>): Promise<T>;
}

export interface McpObservationOptions {
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly recorder: McpObservationRecorder;
  readonly runtime: McpObservationRuntime;
  readonly tracer?: Tracer;
  readonly now?: () => number;
  readonly recordInputs?: false;
  readonly recordOutputs?: false;
}
