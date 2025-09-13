'use client';

import { useEffect, useRef, useState } from 'react';

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
      setText('');
      setState('running');
      ctrlRef.current?.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      const res = await fetch(url, { method, signal: ctrl.signal });
      if (!res.body) {
        setText(await res.text());
        setState(res.ok ? 'done' : 'error');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((t) => t + decoder.decode(value, { stream: true }));
      }
      setState(res.ok ? 'done' : 'error');
    } catch (e) {
      setState('error');
      setText(String(e));
    }
  }

  useEffect(() => () => ctrlRef.current?.abort(), []);

  return { state, text, run };
}
