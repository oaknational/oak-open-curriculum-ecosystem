'use client';

import type { ChangeEvent, Dispatch, JSX, SetStateAction } from 'react';
import { Fragment } from 'react';
import { OakRadioButton, OakRadioGroup, OakTypography } from '@oaknational/oak-components';
import { LabeledInput } from './fields';
import {
  PhaseField,
  KeyStageField,
  MinLessonsField,
  SubjectField,
  type ChangeStructured,
} from './structured-fields';
import type { NaturalBody, NaturalScopeChoice } from './NaturalSearch.types';

export const NATURAL_SCOPE_OPTIONS: ReadonlyArray<{
  value: NaturalScopeChoice;
  label: string;
}> = [
  { value: 'auto', label: 'Auto (let Oak decide)' },
  { value: 'units', label: 'Units' },
  { value: 'lessons', label: 'Lessons' },
  { value: 'sequences', label: 'Sequences' },
  { value: 'all', label: 'All content' },
];

const keyStageScopes = new Set<NaturalScopeChoice>(['all', 'auto', 'lessons', 'units']);
const phaseScopes = new Set<NaturalScopeChoice>(['all', 'auto', 'sequences']);
const minLessonScopes = new Set<NaturalScopeChoice>(['all', 'auto', 'units']);

export function QueryField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
    <LabeledInput
      label="Query"
      id="natural-query"
      type="text"
      value={nl.q}
      required
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
  if (scope !== 'all' && scope !== 'auto') {
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
  return (
    value === 'auto' ||
    value === 'units' ||
    value === 'lessons' ||
    value === 'sequences' ||
    value === 'all'
  );
}
