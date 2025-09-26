'use client';

import type { JSX, ChangeEvent } from 'react';
import { OakRadioButton, OakRadioGroup } from '@oaknational/oak-components';
import { LabeledInput, LabeledSelect } from './fields';
import { KEY_STAGES, SUBJECTS } from '../../src/adapters/sdk-guards';
import type { StructuredBody } from './structured-search.shared';

export type ChangeStructured = (update: Partial<StructuredBody>) => void;

const STRUCTURED_SCOPE_OPTIONS: ReadonlyArray<{ value: StructuredBody['scope']; label: string }> = [
  { value: 'units', label: 'Units' },
  { value: 'lessons', label: 'Lessons' },
  { value: 'sequences', label: 'Sequences' },
];

export function ScopeField({
  value,
  onChange,
}: {
  value: StructuredBody['scope'];
  onChange: ChangeStructured;
}): JSX.Element {
  return (
    <OakRadioGroup
      name="structured-scope"
      label="Scope"
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const next = STRUCTURED_SCOPE_OPTIONS.find((option) => option.value === event.target.value);
        if (next) {
          onChange({ scope: next.value });
        }
      }}
      $gap="space-between-xs"
      $flexWrap="wrap"
    >
      {STRUCTURED_SCOPE_OPTIONS.map((option) => (
        <OakRadioButton
          key={option.value}
          id={`structured-scope-${option.value}`}
          value={option.value}
          label={option.label}
        />
      ))}
    </OakRadioGroup>
  );
}

export function QueryField({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeStructured;
}): JSX.Element {
  return (
    <LabeledInput
      label="Query"
      id="structured-query"
      type="text"
      value={value}
      required
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onChange({ text: e.target.value });
      }}
    />
  );
}

export function SubjectField({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeStructured;
}): JSX.Element {
  return (
    <LabeledSelect
      label="Subject"
      id="structured-subject"
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        onChange({ subject: e.target.value });
      }}
      options={SUBJECTS}
      includeAny
    />
  );
}

export function KeyStageField({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeStructured;
}): JSX.Element {
  return (
    <LabeledSelect
      label="Key Stage"
      id="structured-ks"
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        onChange({ keyStage: e.target.value });
      }}
      options={KEY_STAGES}
      includeAny
    />
  );
}

export function MinLessonsField({
  value,
  onChange,
}: {
  value: number;
  onChange: ChangeStructured;
}): JSX.Element {
  return (
    <LabeledInput
      label="Minimum lessons (units only)"
      id="structured-minlessons"
      type="number"
      value={value}
      min={0}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onChange({ minLessons: Number(e.target.value) });
      }}
    />
  );
}

export function SizeField({
  value,
  onChange,
}: {
  value: number;
  onChange: ChangeStructured;
}): JSX.Element {
  return (
    <LabeledInput
      label="Size"
      id="structured-size"
      type="number"
      value={value}
      min={1}
      max={100}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onChange({ size: Number(e.target.value) });
      }}
    />
  );
}
