'use client';

import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';

type RunState = 'idle' | 'running' | 'done' | 'error';

function StreamOutput({ url, method }: { url: string; method?: 'GET' | 'POST' }) {
  const [state, setState] = useState<RunState>('idle');
  const [text, setText] = useState('');
  const ctrlRef = useRef<AbortController | null>(null);

  async function run() {
    try {
      setText('');
      setState('running');
      ctrlRef.current?.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      const res = await fetch(url, { method: method ?? 'POST', signal: ctrl.signal });
      if (!res.body) {
        setText(await res.text());
        setState(res.ok ? 'done' : 'error');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      // Use an infinite for-loop to avoid a boolean-constant condition
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

  return (
    <section style={{ marginBottom: 24 }}>
      <button
        onClick={() => {
          void run();
        }}
        disabled={state === 'running'}
      >
        {state === 'running' ? 'Running…' : 'Run'}
      </button>
      <pre
        aria-live="polite"
        style={{
          whiteSpace: 'pre-wrap',
          background: '#111827',
          color: '#e5e7eb',
          padding: 12,
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        {text || '—'}
      </pre>
    </section>
  );
}

export default function AdminPage(): JSX.Element {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1>Admin tools</h1>
      <p>Run indexing and rollup tasks. Output streams below each action.</p>
      <section style={{ marginTop: 12, marginBottom: 24 }}>
        <h2>Quick links</h2>
        <p style={{ marginTop: 8 }}>
          1) <code>/api/admin/index-oak</code> → 2) <code>/api/admin/rebuild-rollup</code> → 3)
          <code> /api/search</code>
        </p>
        <p style={{ marginTop: 8 }}>
          SDK parity tests: POST <code>/api/sdk/search-lessons</code>, POST
          <code> /api/sdk/search-transcripts</code>
        </p>
      </section>

      <h2>Elasticsearch setup</h2>
      <StreamOutput url="/api/admin/elastic-setup" method="POST" />

      <h2>Index Oak content</h2>
      <StreamOutput url="/api/admin/index-oak" method="GET" />

      <h2>Rebuild rollup</h2>
      <StreamOutput url="/api/admin/rebuild-rollup" method="GET" />
    </main>
  );
}
