'use client';

import type { ChangeEvent, Dispatch, JSX, SetStateAction } from 'react';
import { Fragment } from 'react';
import { OakRadioButton, OakRadioGroup, OakTypography } from '@oaknational/oak-components';
import { LabeledInput, LabeledTextarea } from './fields';
import {
  PhaseField,
  KeyStageField,
  MinLessonsField,
  SubjectField,
  type ChangeStructured,
} from './structured-fields';
import type { NaturalBody, NaturalScopeChoice } from './NaturalSearch.types';
import {
  ALL_SEARCH_SCOPES,
  LESSONS_SCOPE,
  UNITS_SCOPE,
  SEQUENCES_SCOPE,
  MULTI_SCOPE,
} from '../../src/lib/search-scopes';

const NATURAL_SCOPE_VALUES = ALL_SEARCH_SCOPES;

export const NATURAL_SCOPE_OPTIONS: ReadonlyArray<{
  value: NaturalScopeChoice;
  label: string;
}> = [
  { value: 'auto', label: 'Auto (let Oak decide)' },
  ...NATURAL_SCOPE_VALUES.map((scope) => ({
    value: scope,
    label: formatNaturalScopeLabel(scope),
  })),
];

const keyStageScopes = new Set<NaturalScopeChoice>([
  MULTI_SCOPE,
  'auto',
  LESSONS_SCOPE,
  UNITS_SCOPE,
]);
const phaseScopes = new Set<NaturalScopeChoice>([MULTI_SCOPE, 'auto', SEQUENCES_SCOPE]);
const minLessonScopes = new Set<NaturalScopeChoice>([MULTI_SCOPE, 'auto', UNITS_SCOPE]);

export function QueryField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
    <LabeledTextarea
      label="Describe what you need"
      id="natural-query"
      value={nl.q}
      required
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        const next = event.target.value;
        setNl((state) => ({ ...state, q: next }));
      }}
    />
  );
}

export function ScopeField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
    <OakRadioGroup
      name="natural-scope"
      label="Scope"
      value={nl.scope ?? 'auto'}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (!isNaturalScopeChoice(value)) {
          return;
        }
        if (value === 'auto') {
          setNl((state) => ({ ...state, scope: undefined }));
          return;
        }
        setNl((state) => ({ ...state, scope: value }));
      }}
      $gap="space-between-xs"
      $flexWrap="wrap"
    >
      {NATURAL_SCOPE_OPTIONS.map((option) => (
        <OakRadioButton
          key={option.value}
          id={`natural-scope-${option.value}`}
          value={option.value}
          label={option.label}
        />
      ))}
    </OakRadioGroup>
  );
}

export function SizeField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
    <LabeledInput
      label="Size"
      id="natural-size"
      type="number"
      value={nl.size ?? 10}
      min={1}
      max={100}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const n = Number(event.target.value);
        setNl((state) => ({ ...state, size: Number.isFinite(n) && n > 0 ? n : state.size }));
      }}
    />
  );
}

export function NaturalScopeGuidance({ scope }: { scope: NaturalScopeChoice }): JSX.Element | null {
  if (scope !== MULTI_SCOPE && scope !== 'auto') {
    return null;
  }

  return (
    <OakTypography as="p" $font="body-4" $color="text-subdued">
      Filters apply to the categories they control: Subject &amp; Key stage affect units and
      lessons, Phase affects programmes, and Minimum lessons applies to units.
    </OakTypography>
  );
}

export function NaturalFilterFields({
  nl,
  visibility,
  onStructuredChange,
}: {
  nl: NaturalBody;
  visibility: ReturnType<typeof computeFilterVisibility>;
  onStructuredChange: ChangeStructured;
}): JSX.Element {
  const descriptors = [
    {
      key: 'subject',
      visible: visibility.subject,
      render: () => <SubjectField value={nl.subject ?? ''} onChange={onStructuredChange} />,
    },
    {
      key: 'key-stage',
      visible: visibility.keyStage,
      render: () => <KeyStageField value={nl.keyStage ?? ''} onChange={onStructuredChange} />,
    },
    {
      key: 'phase',
      visible: visibility.phase,
      render: () => <PhaseField value={nl.phaseSlug ?? ''} onChange={onStructuredChange} />,
    },
    {
      key: 'min-lessons',
      visible: visibility.minLessons,
      render: () => <MinLessonsField value={nl.minLessons ?? 0} onChange={onStructuredChange} />,
    },
  ];

  return (
    <>
      {descriptors
        .filter((descriptor) => descriptor.visible)
        .map((descriptor) => (
          <Fragment key={descriptor.key}>{descriptor.render()}</Fragment>
        ))}
    </>
  );
}

export function computeFilterVisibility(scope: NaturalScopeChoice): {
  subject: boolean;
  keyStage: boolean;
  phase: boolean;
  minLessons: boolean;
} {
  return {
    subject: true,
    keyStage: keyStageScopes.has(scope),
    phase: phaseScopes.has(scope),
    minLessons: minLessonScopes.has(scope),
  };
}

export function createStructuredPatchUpdater(
  setNl: Dispatch<SetStateAction<NaturalBody>>,
): ChangeStructured {
  return (patch) => {
    setNl((state) => ({
      ...state,
      ...(patch.subject !== undefined ? { subject: patch.subject || undefined } : {}),
      ...(patch.keyStage !== undefined ? { keyStage: patch.keyStage || undefined } : {}),
      ...(patch.phaseSlug !== undefined ? { phaseSlug: patch.phaseSlug || undefined } : {}),
      ...(patch.minLessons !== undefined ? { minLessons: patch.minLessons } : {}),
    }));
  };
}

function isNaturalScopeChoice(value: string): value is NaturalScopeChoice {
  return value === 'auto' || NATURAL_SCOPE_VALUES.some((scope) => scope === value);
}

export function formatNaturalScopeLabel(scope: (typeof ALL_SEARCH_SCOPES)[number]): string {
  if (scope === MULTI_SCOPE) {
    return 'All content';
  }
  if (scope === LESSONS_SCOPE) {
    return 'Lessons';
  }
  if (scope === UNITS_SCOPE) {
    return 'Units';
  }
  return 'Sequences';
}
