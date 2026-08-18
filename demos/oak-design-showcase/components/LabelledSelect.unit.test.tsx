import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LabelledSelect } from './LabelledSelect';

const OPTIONS = ['alpha', 'beta', 'gamma'];
const LABELS = { alpha: 'Alpha', beta: 'Beta', gamma: 'Gamma' };

describe('LabelledSelect', () => {
  it('offers every supplied option through a labelled select', () => {
    render(
      <LabelledSelect
        id="probe"
        label="Probe"
        value="alpha"
        options={OPTIONS}
        labels={LABELS}
        onChange={() => undefined}
      />,
    );
    const select = screen.getByRole('combobox', { name: 'Probe' });
    expect(select.querySelectorAll('option')).toHaveLength(OPTIONS.length);
  });

  it('reports a choice through the callback with the option value', () => {
    let chosen: string | undefined;
    render(
      <LabelledSelect
        id="probe"
        label="Probe"
        value="alpha"
        options={OPTIONS}
        labels={LABELS}
        onChange={(value) => {
          chosen = value;
        }}
      />,
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Probe' }), {
      target: { value: 'gamma' },
    });
    expect(chosen).toBe('gamma');
  });
});

describe('LabelledSelect placeholder', () => {
  it('shows the placeholder for the empty no-knowledge sentinel without making it choosable', () => {
    render(
      <LabelledSelect
        id="probe"
        label="Probe"
        value=""
        options={OPTIONS}
        labels={LABELS}
        placeholderLabel="—"
        onChange={() => undefined}
      />,
    );
    const select = screen.getByRole('combobox', { name: 'Probe' });
    expect(select).toHaveProperty('value', '');
    const placeholder = select.querySelector('option[value=""]');
    expect(placeholder?.textContent).toBe('—');
    expect(placeholder?.hasAttribute('disabled')).toBe(true);
  });
});
