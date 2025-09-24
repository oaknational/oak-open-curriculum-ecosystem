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
      setModel((current) => {
        if (patch.scope && patch.scope !== current.scope) {
          onScopeChange?.(patch.scope);
        }
        return { ...current, ...patch };
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
    onSubmitPayload?.(payload);
    setLoadingAction(true);
    onErrorAction(null);
    onResultsAction(null);

    startTransition(() => {
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
    if (pending || serverState === null) {
      return;
    }

    if (serverState.error) {
      onErrorAction(serverState.error);
    } else {
      onErrorAction(null);
      onResultsAction(serverState.result ?? null);
    }
    setLoadingAction(false);
  }, [pending, serverState, onErrorAction, onResultsAction, setLoadingAction]);
}

function createInitialModel(): StructuredBody {
  return {
    scope: 'units',
    text: '',
    subject: '',
    keyStage: '',
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
  value?: string,
): void {
  if (value) {
    target[key] = value;
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
