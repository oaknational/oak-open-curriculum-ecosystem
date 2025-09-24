'use client';

import type { ChangeEventHandler, JSX } from 'react';
import {
  OakBox,
  OakFlex,
  OakFormInput,
  OakLabel,
  OakTypography,
} from '@oaknational/oak-components';

interface LabeledSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: readonly string[];
  includeAny?: boolean;
}

export function LabeledSelect({
  label,
  id,
  value,
  onChange,
  options,
  includeAny,
}: LabeledSelectProps): JSX.Element {
  return (
    <OakFlex $flexDirection="column" $gap="space-between-ssx">
      <OakLabel htmlFor={id} $font="body-3-bold">
        {label}
      </OakLabel>
      <OakBox
        as="select"
        id={id}
        value={value}
        onChange={onChange}
        $pa="inner-padding-s"
        $borderRadius="border-radius-s"
        $ba="border-solid-s"
        $borderColor="border-neutral"
        $background="bg-neutral"
      >
        {includeAny ? <option value="">(any)</option> : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </OakBox>
    </OakFlex>
  );
}

interface LabeledInputProps {
  label: string;
  id: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  min?: number;
  max?: number;
  required?: boolean;
  helperText?: string;
}

export function LabeledInput({
  label,
  id,
  type,
  value,
  onChange,
  min,
  max,
  required,
  helperText,
}: LabeledInputProps): JSX.Element {
  return (
    <OakFlex $flexDirection="column" $gap="space-between-ssx">
      <OakLabel htmlFor={id} $font="body-3-bold">
        {label}
      </OakLabel>
      <OakFormInput
        id={id}
        type={type}
        value={typeof value === 'number' ? String(value) : value}
        suppressHydrationWarning
        min={min}
        max={max}
        required={required}
        onChange={onChange}
        wrapperWidth="100%"
      />
      {helperText ? (
        <OakTypography as="span" $font="body-4" $color="text-subdued">
          {helperText}
        </OakTypography>
      ) : null}
    </OakFlex>
  );
}
