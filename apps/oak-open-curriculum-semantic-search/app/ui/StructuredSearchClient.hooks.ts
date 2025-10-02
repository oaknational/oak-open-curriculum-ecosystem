'use client';

import { useActionState, useCallback, useEffect, useState, useTransition } from 'react';
import type { StructuredBody } from './structured-search.shared';

export interface StructuredHandlers {
  model: StructuredBody;
  pending: boolean;
  handleChange: (patch: Partial<StructuredBody>) => void;
  handleSubmit: () => void;
}

export function useStructuredSearchHandlers(props: {
  action: (input: StructuredBody) => Promise<{ result: unknown | null; error?: string }>;
  onResultsAction: (result: unknown | null) => void;
  onErrorAction: (message: string | null) => void;
  setLoadingAction: (isLoading: boolean) => void;
  onScopeChange?: (scope: StructuredBody['scope']) => void;
  onSubmitPayload?: (payload: StructuredBody) => void;
}): StructuredHandlers {
  const {
    action,
    onResultsAction,
    onErrorAction,
    setLoadingAction,
    onScopeChange,
    onSubmitPayload,
  } = props;
  console.debug('[StructuredSearchClient] handlers initialising');

  const { model, updateModel } = useStructuredModel(onScopeChange);
  const { pending, submit } = useStructuredSubmit({
    action,
    model,
    onResultsAction,
    onErrorAction,
    setLoadingAction,
    onSubmitPayload,
  });

  return {
    model,
    pending,
    handleChange: updateModel,
    handleSubmit: submit,
  };
}

function useStructuredModel(onScopeChange?: (scope: StructuredBody['scope']) => void) {
  const [model, setModel] = useState<StructuredBody>(createInitialModel);

  const updateModel = useCallback(
    (patch: Partial<StructuredBody>) => {
      console.debug('[StructuredSearchClient] updateModel invoked', { patch });
      setModel((current) => {
        if (patch.scope && patch.scope !== current.scope) {
          console.debug('[StructuredSearchClient] scope changing', {
            previous: current.scope,
            next: patch.scope,
          });
          onScopeChange?.(patch.scope);
        }
        const nextModel = { ...current, ...patch };
        console.debug('[StructuredSearchClient] model updated', {
          nextModel,
        });
        return nextModel;
      });
    },
    [onScopeChange],
  );

  return { model, updateModel };
}

function useStructuredSubmit(params: {
  action: (input: StructuredBody) => Promise<{ result: unknown | null; error?: string }>;
  model: StructuredBody;
  onResultsAction: (result: unknown | null) => void;
  onErrorAction: (message: string | null) => void;
  setLoadingAction: (isLoading: boolean) => void;
  onSubmitPayload?: (payload: StructuredBody) => void;
}) {
  const { action, model, onResultsAction, onErrorAction, setLoadingAction, onSubmitPayload } =
    params;
  const initial: { error?: string; result: unknown | null } | null = null;
  const [serverState, formAction, pending] = useActionState(
    makeServerReducer(action, () => model),
    initial,
  );
  const [, startTransition] = useTransition();

  useStructuredServerStateEffect({
    pending,
    serverState,
    onErrorAction,
    onResultsAction,
    setLoadingAction,
  });

  const submit = useCallback(() => {
    const payload = buildStructuredBody(model);
    console.debug('[StructuredSearchClient] submit triggered', { payload });
    onSubmitPayload?.(payload);
    setLoadingAction(true);
    onErrorAction(null);
    onResultsAction(null);

    startTransition(() => {
      console.debug('[StructuredSearchClient] startTransition dispatching submit');
      formAction();
    });
  }, [
    formAction,
    model,
    onSubmitPayload,
    onErrorAction,
    onResultsAction,
    setLoadingAction,
    startTransition,
  ]);

  return { pending, submit };
}

function useStructuredServerStateEffect(params: {
  pending: boolean;
  serverState: { error?: string; result: unknown | null } | null;
  onErrorAction: (message: string | null) => void;
  onResultsAction: (result: unknown | null) => void;
  setLoadingAction: (isLoading: boolean) => void;
}): void {
  const { pending, serverState, onErrorAction, onResultsAction, setLoadingAction } = params;

  useEffect(() => {
    console.debug('[StructuredSearchClient] server state effect tick', {
      pending,
      hasServerState: serverState !== null,
    });
    if (pending || serverState === null) {
      return;
    }

    if (serverState.error) {
      console.debug('[StructuredSearchClient] server reported error', {
        error: serverState.error,
      });
      onErrorAction(serverState.error);
    } else {
      console.debug('[StructuredSearchClient] server reported success', {
        result: serverState.result,
      });
      onErrorAction(null);
      onResultsAction(serverState.result ?? null);
    }
    setLoadingAction(false);
    console.debug('[StructuredSearchClient] loading state cleared');
  }, [pending, serverState, onErrorAction, onResultsAction, setLoadingAction]);
}

function createInitialModel(): StructuredBody {
  return {
    scope: 'units',
    text: '',
    minLessons: 0,
    size: 10,
    includeFacets: true,
  };
}

function buildStructuredBody(model: StructuredBody): StructuredBody {
  const body: StructuredBody = {
    scope: model.scope,
    text: model.text,
    includeFacets: model.includeFacets ?? true,
  };

  assignOptionalString(body, 'subject', model.subject);
  assignOptionalString(body, 'keyStage', model.keyStage);
  assignOptionalPositive(body, 'minLessons', model.minLessons);
  assignOptionalPositive(body, 'size', model.size);
  assignOptionalString(body, 'phaseSlug', model.phaseSlug);

  return body;
}

function assignOptionalString<K extends 'subject' | 'keyStage' | 'phaseSlug'>(
  target: StructuredBody,
  key: K,
  value: StructuredBody[K],
): void {
  if (typeof value === 'string' && value.length > 0) {
    target[key] = value;
  } else {
    delete target[key];
  }
}

function assignOptionalPositive<K extends 'minLessons' | 'size'>(
  target: StructuredBody,
  key: K,
  value?: number,
): void {
  if (typeof value === 'number' && value > 0) {
    target[key] = value;
  }
}

function makeServerReducer(
  action: (input: StructuredBody) => Promise<{ result: unknown | null; error?: string }>,
  getModel: () => StructuredBody,
) {
  return async (): Promise<{ error?: string; result: unknown | null }> => {
    const clean = buildStructuredBody(getModel());
    return action(clean);
  };
}
