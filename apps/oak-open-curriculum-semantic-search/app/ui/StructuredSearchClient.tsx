'use client';

import type { JSX, FormEvent } from 'react';
import sc from 'styled-components';
import { useActionState, useState } from 'react';
import {
  ScopeField,
  QueryField,
  SubjectField,
  KeyStageField,
  MinLessonsField,
  SizeField,
} from './structured-fields';

type StructuredBody = {
  scope: 'units' | 'lessons';
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
};

export default function StructuredSearchClient({
  action,
  onResultsAction,
  onErrorAction,
  setLoadingAction,
}: {
  action: (input: StructuredBody) => Promise<{ results: unknown[]; error?: string }>;
  onResultsAction: (results: unknown[]) => void;
  onErrorAction: (message: string | null) => void;
  setLoadingAction: (isLoading: boolean) => void;
}): JSX.Element {
  const [structured, setStructured] = useState<StructuredBody>({
    scope: 'units',
    text: '',
    subject: '',
    keyStage: '',
    minLessons: 0,
    size: 10,
  });

  const initial: { error?: string; results: unknown[] } | null = null;
  const [serverState, formAction, pending] = useActionState(
    makeServerReducer(action, () => structured),
    initial,
  );

  const onSubmit = makeOnSubmit(setLoadingAction, onErrorAction, onResultsAction);

  reflectServerState(serverState, pending, {
    onResults: onResultsAction,
    onError: onErrorAction,
    setLoading: setLoadingAction,
  });

  return (
    <StructuredForm
      model={structured}
      onChange={(patch) => setStructured({ ...structured, ...patch })}
      onSubmit={() => {
        onSubmit();
        // submit via server action
        formAction();
      }}
      disabled={pending}
    />
  );
}

function makeServerReducer(
  action: (input: StructuredBody) => Promise<{ results: unknown[]; error?: string }>,
  getModel: () => StructuredBody,
) {
  return async (): Promise<{ error?: string; results: unknown[] }> => {
    const clean = buildStructuredBody(getModel());
    return action(clean);
  };
}

const FormGrid = sc.form`
  display: grid;
  gap: ${(p) => p.theme.app.space.sm};
`;

function StructuredForm({
  model,
  onChange,
  onSubmit,
  disabled,
}: {
  model: StructuredBody;
  onChange: (patch: Partial<StructuredBody>) => void;
  onSubmit: (ev: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <FormGrid
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmit(ev);
      }}
      id="structured-panel"
      role="tabpanel"
      aria-labelledby="structured-tab"
    >
      <ScopeField value={model.scope} onChange={onChange} />
      <QueryField value={model.text} onChange={onChange} />
      <SubjectField value={model.subject ?? ''} onChange={onChange} />
      <KeyStageField value={model.keyStage ?? ''} onChange={onChange} />
      <MinLessonsField value={model.minLessons ?? 0} onChange={onChange} />
      <SizeField value={model.size ?? 10} onChange={onChange} />

      <button type="submit" disabled={disabled}>
        Search
      </button>
    </FormGrid>
  );
}

function buildStructuredBody(s: StructuredBody): StructuredBody {
  return {
    scope: s.scope,
    text: s.text,
    subject: s.subject || undefined,
    keyStage: s.keyStage || undefined,
    minLessons: s.minLessons && s.minLessons > 0 ? s.minLessons : undefined,
    size: s.size && s.size > 0 ? s.size : undefined,
  };
}

function makeOnSubmit(
  setLoading: (b: boolean) => void,
  onError: (m: string | null) => void,
  onResults: (r: unknown[]) => void,
) {
  return (): void => {
    setLoading(true);
    onError(null);
    onResults([]);
  };
}

function reflectServerState(
  serverState: { error?: string; results: unknown[] } | null,
  pending: boolean,
  handlers: {
    onResults: (r: unknown[]) => void;
    onError: (m: string | null) => void;
    setLoading: (b: boolean) => void;
  },
): void {
  if (pending || serverState === null) {
    return;
  }
  if (serverState.error) {
    handlers.onError(serverState.error);
  }
  if (Array.isArray(serverState.results)) {
    handlers.onResults(serverState.results);
  }
  handlers.setLoading(false);
}
