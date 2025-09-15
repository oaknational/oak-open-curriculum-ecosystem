'use client';
import type { JSX } from 'react';
import { useSearchController } from './useSearchController';
import { StructuredSearch } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';

export default function SearchPageClient(): JSX.Element {
  const ctrl = useSearchController();

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Hybrid Search</h1>
      <p style={{ marginTop: 0 }}>Structured and natural language side by side.</p>

      <section aria-labelledby="structured-heading" style={{ marginBottom: '1rem' }}>
        <h2 id="structured-heading">Structured</h2>
        <StructuredSearch
          onResults={ctrl.onSuccess}
          onError={(m) => ctrl.onError(m ?? 'Unknown error')}
          setLoading={(v) => (v ? ctrl.onStart() : undefined)}
        />
      </section>

      <section aria-labelledby="nl-heading" style={{ marginBottom: '1rem' }}>
        <h2 id="nl-heading">Natural language</h2>
        <NaturalSearchComponent
          onResults={(r) => ctrl.onSuccess(Array.isArray(r) ? r : [])}
          onError={(m) => ctrl.onError(typeof m === 'string' ? m : 'Unknown error')}
          setLoading={(v) => (v ? ctrl.onStart() : undefined)}
        />
      </section>

      {ctrl.error ? (
        <p role="alert" style={{ color: 'crimson', marginTop: '1rem' }}>
          {ctrl.error}
        </p>
      ) : null}

      <SearchResultsComponent results={ctrl.results} />
    </main>
  );
}
