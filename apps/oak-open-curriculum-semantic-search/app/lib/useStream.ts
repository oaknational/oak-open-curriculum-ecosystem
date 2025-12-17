'use client';

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

export type RunState = 'idle' | 'running' | 'success' | 'error';

export interface StreamOutcome {
  status: Exclude<RunState, 'idle' | 'running'>;
  finishedAt: Date;
  message?: string;
}

export interface StreamHookResult {
  state: RunState;
  text: string;
  run: () => Promise<void>;
  outcome: StreamOutcome | null;
}

/**
 * Options for the useStream hook.
 */
export interface UseStreamOptions {
  /** HTTP method to use for the request. Defaults to 'POST'. */
  readonly method?: 'GET' | 'POST';
  /** Optional fetch implementation for dependency injection in tests. */
  readonly fetch?: typeof fetch;
}

export function useStream(url: string, options: UseStreamOptions = {}): StreamHookResult {
  const { method = 'POST', fetch: fetchFn = fetch } = options;
  const [state, setState] = useState<RunState>('idle');
  const [text, setText] = useState('');
  const [outcome, setOutcome] = useState<StreamOutcome | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  async function run(): Promise<void> {
    try {
      prepareRunFor(ctrlRef, setText, setState);
      const res = await startRequestExternal(url, method, ctrlRef.current?.signal, fetchFn);
      const output = await streamOrBufferExternal(res, setText);
      const nextState: RunState = res.ok ? 'success' : 'error';
      setState(nextState);
      setOutcome({
        status: nextState,
        finishedAt: new Date(),
        message: summariseOutcome(res, output),
      });
    } catch (e) {
      const message = String(e);
      setState('error');
      setText(message);
      setOutcome({ status: 'error', finishedAt: new Date(), message });
    }
  }

  useEffect(() => () => ctrlRef.current?.abort(), []);

  return { state, text, run, outcome };
}

type SetText = (value: string | ((prev: string) => string)) => void;

function prepareRunFor(
  ctrlRef: { current: AbortController | null },
  setText: Dispatch<SetStateAction<string>>,
  setState: Dispatch<SetStateAction<RunState>>,
): void {
  setText('');
  setState('running');
  ctrlRef.current?.abort();
  ctrlRef.current = new AbortController();
}

async function startRequestExternal(
  u: string,
  m: 'GET' | 'POST',
  signal: AbortSignal | undefined,
  fetchFn: typeof fetch,
): Promise<Response> {
  return fetchFn(u, { method: m, signal });
}

async function streamOrBufferExternal(res: Response, update: SetText): Promise<string> {
  const chunks: string[] = [];
  if (!res.body) {
    const body = await res.text();
    update(body);
    return body;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const decoded = decoder.decode(value, { stream: true });
    chunks.push(decoded);
    update((t) => t + decoded);
  }
  return chunks.join('');
}

function summariseOutcome(res: Response, output: string): string | undefined {
  if (res.ok) {
    return `Completed with status ${res.status}`;
  }
  const normalised = output.trim();
  if (normalised.length > 0) {
    const lines = normalised
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.at(-1);
  }
  return `Request failed (${res.status} ${res.statusText})`;
}
