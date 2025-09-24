import type { JSX } from 'react';
import StructuredSearchClient from './StructuredSearchClient';
import { searchAction } from './structured-search.actions';

// This file is a Server Component. The actual action is defined in structured-search.actions.ts

export function StructuredSearch(props: {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}): JSX.Element {
  return (
    <StructuredSearchClient
      action={searchAction}
      onResultsAction={props.onResults}
      onErrorAction={props.onError}
      setLoadingAction={props.setLoading}
    />
  );
}

export default StructuredSearch;
