'use client';

import type { JSX } from 'react';
import { RedocStandalone } from 'redoc';

export default function ApiDocsPage(): JSX.Element {
  const specUrl = '/api/openapi.json';
  return (
    <main style={{ padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Oak Curriculum Search API</h1>
        <p style={{ margin: '6px 0 0', color: '#4b5563' }}>
          OpenAPI schema:{' '}
          <a
            href={specUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            {specUrl}
          </a>
        </p>
      </header>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        <RedocStandalone
          specUrl={specUrl}
          options={{
            hideDownloadButton: false,
            expandResponses: 'all',
            jsonSampleExpandLevel: 'all',
            pathInMiddlePanel: true,
          }}
        />
      </div>
    </main>
  );
}
