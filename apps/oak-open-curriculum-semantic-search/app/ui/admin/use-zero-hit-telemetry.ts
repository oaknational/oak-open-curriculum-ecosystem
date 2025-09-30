import { useCallback, useEffect, useState } from 'react';
import type { TelemetryState } from './ZeroHitDashboard.types';
import { parseZeroHitResponse } from './zero-hit-dashboard.parse';

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Polls the zero-hit telemetry API and exposes dashboard-friendly state, while
 * handling transient network failures with a lightweight error message.
 */
export function useZeroHitTelemetry(): TelemetryState {
  const [data, setData] = useState<TelemetryState['data']>(null);
  const [loading, setLoading] = useState<TelemetryState['loading']>(false);
  const [error, setError] = useState<TelemetryState['error']>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/observability/zero-hit', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = parseZeroHitResponse(await response.json());

      if (!payload) {
        throw new Error('Unexpected payload received');
      }

      setData(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load telemetry data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      void refresh();
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(timer);
    };
  }, [refresh]);

  return { data, loading, error, refresh };
}

export type { TelemetryState };
