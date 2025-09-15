'use client';

import type { JSX } from 'react';
import sc from 'styled-components';
import { useStream } from '../lib/useStream';

const Section = sc.section`
  margin-bottom: ${(p) => p.theme.app.space.lg};
`;
const Main = sc.main`
  max-width: ${(p) => p.theme.app.layout.containerMaxWidth};
  margin: 0 auto;
  padding: ${(p) => p.theme.app.space.md};
`;
const Pre = sc.pre`
  white-space: pre-wrap;
  background: ${(p) => p.theme.app.colors.surfaceEmphasisBg};
  color: inherit;
  padding: ${(p) => p.theme.app.space.sm};
  border-radius: ${(p) => p.theme.app.radii.md};
  margin-top: ${(p) => p.theme.app.space.sm};
`;
const QuickLinks = sc.section`
  margin-top: ${(p) => p.theme.app.space.sm};
  margin-bottom: ${(p) => p.theme.app.space.lg};
`;
const P = sc.p`
  margin-top: ${(p) => p.theme.app.space.sm};
`;

function StreamOutput({ url, method }: { url: string; method?: 'GET' | 'POST' }): JSX.Element {
  const { state, text, run } = useStream(url, method ?? 'POST');
  return (
    <Section>
      <button
        onClick={() => {
          void run();
        }}
        disabled={state === 'running'}
      >
        {state === 'running' ? 'Running…' : 'Run'}
      </button>
      <Pre aria-live="polite">{text || '—'}</Pre>
    </Section>
  );
}

export default function AdminPage(): JSX.Element {
  return (
    <Main>
      <h1>Admin tools</h1>
      <p>Run indexing and rollup tasks. Output streams below each action.</p>
      <QuickLinks>
        <h2>Quick links</h2>
        <P>
          1) <code>/api/admin/index-oak</code> → 2) <code>/api/admin/rebuild-rollup</code> → 3)
          <code> /api/search</code>
        </P>
        <P>
          SDK parity tests: POST <code>/api/sdk/search-lessons</code>, POST
          <code> /api/sdk/search-transcripts</code>
        </P>
      </QuickLinks>

      <h2>Elasticsearch setup</h2>
      <StreamOutput url="/api/admin/elastic-setup" method="POST" />

      <h2>Index Oak content</h2>
      <StreamOutput url="/api/admin/index-oak" method="GET" />

      <h2>Rebuild rollup</h2>
      <StreamOutput url="/api/admin/rebuild-rollup" method="GET" />
    </Main>
  );
}
