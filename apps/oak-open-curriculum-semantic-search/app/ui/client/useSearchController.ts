'use client';

import { useCallback, useMemo, useState } from 'react';

export type SearchController = {
  results: unknown[];
  error: string | null;
  loading: boolean;
  onStart: () => void;
  onSuccess: (results: unknown[]) => void;
  onError: (message: string) => void;
};

export function useSearchController(): SearchController {
  const [results, setResults] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onStart = useCallback(() => {
    setLoading(true);
    setError(null);
    setResults([]);
  }, []);

  const onSuccess = useCallback((next: unknown[]) => {
    setResults(next);
    setLoading(false);
  }, []);

  const onError = useCallback((message: string) => {
    setError(message);
    setLoading(false);
  }, []);

  return useMemo(
    () => ({ results, error, loading, onStart, onSuccess, onError }),
    [results, error, loading, onStart, onSuccess, onError],
  );
}
