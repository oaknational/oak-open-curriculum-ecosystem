import type { ZeroHitResponse } from './zero-hit-dashboard.parse';

/**
 * Shared shape for the zero-hit dashboard hook, mirroring the UI state needed
 * to render refresh controls, loading states, and data panels.
 */
export interface TelemetryState {
  readonly data: ZeroHitResponse | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly refresh: () => Promise<void>;
}

/** Describes a single card rendered in the zero-hit summary grid. */
export interface ZeroHitSummaryCard {
  readonly label: string;
  readonly value: string;
}
