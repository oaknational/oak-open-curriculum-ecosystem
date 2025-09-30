'use client';

import type { JSX } from 'react';
import type { StructuredSearchAction } from '../StructuredSearch';
import type { FixtureMode } from '../../lib/fixture-mode';
import { useSearchController } from './useSearchController';
import { useStructuredFollowUp } from './useStructuredFollowUp';
import { SearchPageLayout } from './SearchPageLayout';

interface SearchPageClientProps {
  readonly searchStructured: StructuredSearchAction;
  readonly initialFixtureMode: FixtureMode;
  readonly showFixtureToggle: boolean;
}

export default function SearchPageClient({
  searchStructured,
  initialFixtureMode,
  showFixtureToggle,
}: SearchPageClientProps): JSX.Element {
  const controller = useSearchController();
  const followUp = useStructuredFollowUp({ searchStructured, controller });

  return (
    <SearchPageLayout
      controller={controller}
      followUp={followUp}
      searchAction={searchStructured}
      initialFixtureMode={initialFixtureMode}
      showFixtureToggle={showFixtureToggle}
    />
  );
}
