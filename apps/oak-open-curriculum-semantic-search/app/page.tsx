import type { JSX } from 'react';
import SearchPageClient from './ui/client/SearchPageClient';
import { searchAction } from './ui/structured-search.actions';

export default function Page(): JSX.Element {
  return <SearchPageClient searchStructured={searchAction} />;
}
