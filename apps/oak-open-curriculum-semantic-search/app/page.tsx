'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import StructuredSearchComponent from './ui/StructuredSearch';
import NaturalSearchComponent from './ui/NaturalSearch';
import SearchResultsComponent from './ui/SearchResults';
import TabsHeader from './ui/SearchTabHeader';

export default function Page(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'structured' | 'nl'>('structured');
  const setLoading = useState(false)[1];
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<unknown[]>([]);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Hybrid Search</h1>
      <p style={{ marginTop: 0, color: '#555' }}>Structured vs natural language.</p>

      <TabsHeader active={activeTab} setActive={setActiveTab} />

      {activeTab === 'structured' ? (
        <StructuredSearchComponent
          onResults={setResults}
          onError={setError}
          setLoading={setLoading}
        />
      ) : (
        <NaturalSearchComponent onResults={setResults} onError={setError} setLoading={setLoading} />
      )}

      {error ? (
        <p role="alert" style={{ color: 'crimson', marginTop: '1rem' }}>
          {error}
        </p>
      ) : null}

      <SearchResultsComponent results={results} />
    </main>
  );
}
