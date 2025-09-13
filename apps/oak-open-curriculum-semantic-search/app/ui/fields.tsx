'use client';

import type { JSX } from 'react';

interface LabeledSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (_value: string) => void;
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
    <label>
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {includeAny ? <option value="">(any)</option> : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

interface LabeledInputProps {
  label: string;
  id: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (_value: string | number) => void;
  min?: number;
  max?: number;
  required?: boolean;
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
}: LabeledInputProps): JSX.Element {
  return (
    <label>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        required={required}
        onChange={(e) => {
          onChange(type === 'number' ? Number(e.target.value) : e.target.value);
        }}
      />
    </label>
  );
}
