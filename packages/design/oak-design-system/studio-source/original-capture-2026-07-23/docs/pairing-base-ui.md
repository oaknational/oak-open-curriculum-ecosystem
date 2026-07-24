# Pairing guide — Base UI (`@base-ui/react`) · the default

The default behaviour library for Oak consumers (consuming-nextjs.md §5b; DECISIONS "Behaviour-library direction"). MIT; from the Radix/Floating UI/Material UI authors, maintained by MUI. Written against **v1.3** — v1.x point releases change behaviour (1.3: Checkbox/Switch unchecked form submission, Tabs `keepMounted`); read release notes on every bump and re-run the checklist on upgraded widgets. Shared obligations: `wrapped-widget-a11y-checklist.md`. Verify part/prop names against your pinned version's docs.

## Install & shape

```bash
pnpm add @base-ui/react   # pin the minor; record it here and in the PR
```

Per-part imports (`@base-ui/react/combobox`, `/menu`, `/dialog`, …). Components are **client components** (`'use client'` in the wrapper file); keep them leaf-level so pages stay server-rendered. Popups render through `<Portal>` — our tokens are `:root`-scoped so portalled content inherits them; if a tenant scopes overrides below root, mount the portal container inside that scope.

## Where our rules land

Base UI parts render real elements and expose state as **`data-*` attributes** — style with plain CSS/classes, no render-prop ceremony:

| Our rule | Base UI hook |
|---|---|
| Double focus ring | `:focus-visible` on the rendered part (real DOM focus for inputs/triggers); `[data-highlighted]` for virtual focus in listboxes/menus — style BOTH (virtual focus never fires `:focus-visible`) |
| State never colour alone | `[data-selected]`, `[data-checked]`, `[data-disabled]`, `[data-invalid]` — pair each with border/icon/text changes |
| Motion axis | Popup open/close transitions are yours (CSS on `[data-open]`/`[data-starting-style]`/`[data-ending-style]`) — use the motion verbs so `data-motion="reduced"` collapses them |
| Semantic HTML | Parts default to the right elements; use the `render` prop only to substitute a MORE semantic element, never a `<div>` |
| Forms | `Field`/`Fieldset` parts wire `label`/`aria-describedby`/error text — use them rather than re-wiring |

## Worked example

The Oak-tokened Combobox in consuming-nextjs.md **§7b** is the canonical example (tier-3 tokens, focus ring on input + highlighted item, selected = fill+border+tick).

## Gotchas

- An unstyled part is **invisibly focusable** — the focus ring is your first line of CSS, not polish.
- `Select`/`Combobox` form submission semantics changed across v1.x — test the submitted `FormData`, not just the UI.
- Don't stack it with Radix in one app; they solve the same layer (Radix is legacy-only here).
- No date/time pickers — that's the React Aria doc's territory (`pairing-react-aria.md`).
