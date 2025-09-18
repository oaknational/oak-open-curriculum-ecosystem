'use client';

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

export type RunState = 'idle' | 'running' | 'done' | 'error';

export function useStream(
  url: string,
  method: 'GET' | 'POST' = 'POST',
): { state: RunState; text: string; run: () => Promise<void> } {
  const [state, setState] = useState<RunState>('idle');
  const [text, setText] = useState('');
  const ctrlRef = useRef<AbortController | null>(null);

  async function run(): Promise<void> {
    try {
      prepareRunFor(ctrlRef, setText, setState);
      const res = await startRequestExternal(url, method, ctrlRef.current?.signal);
      await streamOrBufferExternal(res, setText);
      setState(res.ok ? 'done' : 'error');
    } catch (e) {
      setState('error');
      setText(String(e));
    }
  }

  useEffect(() => () => ctrlRef.current?.abort(), []);

  return { state, text, run };
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
): Promise<Response> {
  return fetch(u, { method: m, signal });
}

async function streamOrBufferExternal(res: Response, update: SetText): Promise<void> {
  if (!res.body) {
    update(await res.text());
    return;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    update((t) => t + decoder.decode(value, { stream: true }));
  }
}
