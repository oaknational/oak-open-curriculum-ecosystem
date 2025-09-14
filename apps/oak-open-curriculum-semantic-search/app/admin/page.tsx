'use client';

import type { JSX } from 'react';
import { useStream } from '../lib/useStream';

function StreamOutput({ url, method }: { url: string; method?: 'GET' | 'POST' }): JSX.Element {
  const { state, text, run } = useStream(url, method ?? 'POST');
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
