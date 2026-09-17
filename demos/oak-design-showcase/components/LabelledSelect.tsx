/**
 * The one labelled-select view the switchboard composes three times — the
 * kit's shipped switcher markup (label.oak-body-3 + select.oak-select in a
 * cluster), props-only. `placeholderLabel` renders a disabled, hidden
 * option shown only while `value` is '' — the PRE-HYDRATION no-knowledge
 * state (the shell shows an em dash because it cannot know a returning
 * user's persisted choice). The no-CHOICE state needs no placeholder: it
 * is the selectable "Identity default" option (DDR-003 dated amendment
 * 2026-08-11), so the live control always holds a real value and every
 * first click on a different option fires a change event.
 *
 * The disabled-placeholder shape depends on React emitting `selected=""`
 * on the value-matching option even when that option is `disabled hidden`
 * (verified against react-dom 19's SSR): HTML's own default-selectedness
 * rule skips disabled options, so without React's marking a placeholder
 * whose siblings are also unselectable would render BLANK. Moving to
 * `defaultValue` or an uncontrolled select reintroduces that blank.
 */
import type { ReactElement } from 'react';

export interface LabelledSelectProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly options: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly placeholderLabel?: string;
  /** Pre-hydration placeholder state: same geometry, not yet interactive. */
  readonly disabled?: boolean;
  readonly onChange: (value: string) => void;
}

export function LabelledSelect({
  id,
  label,
  value,
  options,
  labels,
  placeholderLabel,
  disabled,
  onChange,
}: LabelledSelectProps): ReactElement {
  return (
    <div className="oak-cluster oak-cluster--s">
      <label className="oak-body-3" htmlFor={id}>
        {label}
      </label>
      <select
        className="oak-select"
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      >
        {placeholderLabel !== undefined && (
          <option value="" disabled hidden>
            {placeholderLabel}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}
