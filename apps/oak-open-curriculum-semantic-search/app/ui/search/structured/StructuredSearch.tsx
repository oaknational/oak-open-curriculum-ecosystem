import type { JSX } from 'react';
import StructuredSearchClient from './StructuredSearchClient';
import { searchAction } from './structured-search.actions';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';

export type StructuredSearchAction = (
  input: SearchStructuredRequest,
) => Promise<{ result: unknown | null; error?: string }>;

// This file is a Server Component. The actual action is defined in structured-search.actions.ts

export function StructuredSearch(props: {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  onScopeChange?: (scope: SearchStructuredRequest['scope']) => void;
  onSubmitPayload?: (payload: SearchStructuredRequest) => void;
  action?: StructuredSearchAction;
}): JSX.Element {
  return (
    <StructuredSearchClient
      action={props.action ?? searchAction}
      onResultsAction={props.onResults}
      onErrorAction={props.onError}
      setLoadingAction={props.setLoading}
      onScopeChange={props.onScopeChange}
      onSubmitPayload={props.onSubmitPayload}
    />
  );
}

export default StructuredSearch;
