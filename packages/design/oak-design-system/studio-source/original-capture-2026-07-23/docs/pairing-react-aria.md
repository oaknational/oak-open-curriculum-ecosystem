# Pairing guide — React Aria Components (`react-aria-components`) · conformance depth + dates

Adobe's headless library: the deepest screen-reader-tested implementation (40+ WAI-ARIA patterns, ~30 SR/browser combos) and the only credible accessible **DatePicker / date-range / locale-aware number** story. Not the Oak default (owner preference + higher per-component ceremony — DECISIONS "Behaviour-library direction") but a documented, supported pairing: reach for it when a product needs date/time widgets, deep i18n, or contractual WAI-ARIA conformance on a specific surface. Apache 2.0. Use the **Components** API (`react-aria-components`, stable since 2024), not the raw hooks, unless you need custom markup control. Pin the version at adoption and record it here. Shared obligations: `wrapped-widget-a11y-checklist.md`.

## Install & shape

```bash
pnpm add react-aria-components   # pin; record here and in the PR
```

Client components; import per component (tree-shakes). It's fine to run **alongside Base UI in one app** if scoped by capability: Base UI for menus/combobox/dialog, React Aria only for the date/number widgets — don't duplicate a widget class across both.

## Where our rules land

React Aria Components expose state as **`data-*` attributes** on rendered elements AND as render-prop values — prefer the data-attributes so styling stays in CSS with tokens:

| Our rule | React Aria hook |
|---|---|
| Double focus ring | `[data-focus-visible]` (their normalised flag — more reliable across inputs than raw `:focus-visible`); style it with `--focus-outline`/`--focus-ring` exactly as native |
| State never colour alone | `[data-selected]`, `[data-pressed]`, `[data-invalid]`, `[data-disabled]`, `[data-unavailable]` (calendar) — pair with border/icon/text |
| Motion axis | All transitions are yours; use the motion verbs |
| Forms | `TextField`/`DateField` wire label + `aria-describedby` + `FieldError`; feed errors through their `isInvalid`/`errorMessage` props, styled as `.oak-field` errors |
| Reading age / labels | Their components need accessible names passed in — `aria-label` is NOT a substitute for a visible `<Label>`; always render the label part |

## Worked example — Oak-tokened DateField

```tsx
'use client';
import { DateField, DateInput, DateSegment, Label, FieldError } from 'react-aria-components';

export function LessonDateField() {
  return (
    <DateField className="oak-field" granularity="day">
      <Label className="oak-field__label">Lesson date</Label>
      <DateInput className="oak-field__input ra-dateinput">
        {(segment) => <DateSegment segment={segment} className="ra-seg" />}
      </DateInput>
      <FieldError className="oak-field__error" />
    </DateField>
  );
}
```

```css
:root { --ra-seg-pad: var(--space-2) var(--space-4); --ra-seg-focus-bg: var(--color-accent-subtle); }
.ra-dateinput { display: flex; gap: var(--space-2); min-height: var(--size-target); align-items: center; }
.ra-dateinput[data-focus-within] { outline: var(--focus-outline); outline-offset: var(--focus-outline-offset); box-shadow: var(--focus-ring); }
.ra-seg { padding: var(--ra-seg-pad); color: var(--text-primary); border-radius: var(--radius-control); }
.ra-seg[data-focused] { background: var(--ra-seg-focus-bg); outline: var(--focus-outline); outline-offset: calc(-1 * var(--focus-outline-offset)); }
.ra-seg[data-placeholder] { color: var(--text-subdued); }
.ra-seg[data-invalid] { color: var(--text-error); text-decoration: underline wavy; } /* colour + decoration */
```

Done-criteria: segments announce role/value with a real SR; keyboard steps segments and spins values; the `--ra-seg-focus-bg`/`--text-primary` pairing is in the contrast audit ×4 themes; invalid state visible without colour.

## Gotchas

- i18n is a feature AND a dependency: components format via the app locale (`I18nProvider`) — set `en-GB` explicitly or dates render US-style.
- Their internal focus normalisation means raw `:focus-visible` sometimes misses — use their `[data-focus-visible]`/`[data-focused]` attributes.
- Heavier than Base UI per widget; keep its scope to the widgets that earn it.
