'use client';
import type { JSX } from 'react';
import sc from 'styled-components';
import { useSearchController } from './useSearchController';
import { StructuredSearch } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';
import { SearchFacets } from '../SearchFacets';

const Main = sc.main`
  max-width: ${(p) => p.theme.app.layout.containerMaxWidth};
  margin: 0 auto;
  padding: ${(p) => p.theme.app.space.lg};
`;
const H1 = sc.h1`
  margin-bottom: ${(p) => p.theme.app.space.sm};
`;
const P = sc.p`
  margin-top: 0;
`;
const Section = sc.section`
  margin-bottom: ${(p) => p.theme.app.space.lg};
`;
const ErrorP = sc.p`
  color: ${(p) => p.theme.app.colors.errorText};
  margin-top: ${(p) => p.theme.app.space.lg};
`;

export default function SearchPageClient(): JSX.Element {
  const ctrl = useSearchController();

  return (
    <Main>
      <H1>Hybrid Search</H1>
      <P>Structured and natural language side by side.</P>

      <Section aria-labelledby="structured-heading">
        <h2 id="structured-heading">Structured</h2>
        <StructuredSearch
          onResults={ctrl.onSuccess}
          onError={(m) => ctrl.onError(m ?? 'Unknown error')}
          setLoading={(v) => (v ? ctrl.onStart() : undefined)}
        />
      </Section>

      <SearchFacets facets={ctrl.facets} />

      <Section aria-labelledby="nl-heading">
        <h2 id="nl-heading">Natural language</h2>
        <NaturalSearchComponent
          onResults={(r) => ctrl.onSuccess(Array.isArray(r) ? r : [])}
          onError={(m) => ctrl.onError(typeof m === 'string' ? m : 'Unknown error')}
          setLoading={(v) => (v ? ctrl.onStart() : undefined)}
        />
      </Section>

      {ctrl.error ? <ErrorP role="alert">{ctrl.error}</ErrorP> : null}

      <SearchResultsComponent results={ctrl.results} meta={ctrl.meta} />
    </Main>
  );
}
