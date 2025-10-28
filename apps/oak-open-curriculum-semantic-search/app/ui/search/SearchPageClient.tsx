'use client';

import type { JSX } from 'react';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import type { FixtureMode } from '../../lib/fixture-mode';
import type { SearchLayoutVariant } from './layout/SearchPageLayout';
import { useSearchController } from './hooks/useSearchController';
import { useStructuredFollowUp } from './hooks/useStructuredFollowUp';
import { SearchPageLayout } from './layout/SearchPageLayout';

interface SearchPageClientProps {
  readonly searchStructured: StructuredSearchAction;
  readonly initialFixtureMode: FixtureMode;
  readonly showFixtureToggle: boolean;
  readonly variant?: SearchLayoutVariant;
}

export default function SearchPageClient({
  searchStructured,
  initialFixtureMode,
  showFixtureToggle,
  variant = 'default',
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
      variant={variant}
    />
  );
}
