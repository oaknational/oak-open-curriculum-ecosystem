# Wrapped-widget a11y checklist — screen-reader spot-checks per widget class

Adopting an "accessible" headless library (Base UI et al., §5b of consuming-nextjs.md) removes a class of failure, not the obligation — the Radix external audit (35 SR issues, years unfixed) is the proof case. This is the concrete "every build must still" list for wrapped widgets: these are the spot-checks to run with a real screen reader (NVDA/Firefox or VoiceOver/Safari) for a wrapped widget. Running them is an ambition, not a requirement, and is not scheduled (ADR-213, owner gate 3, amended 2026-11-12); no widget ship waits on one. Automated checks (axe) do NOT cover these — they are interaction subtleties.

## Every widget, always

- Double focus ring visible on `:focus-visible` for every focusable part (headless = unstyled = **invisibly focusable by default**); transparent outline intact for forced-colors.
- All states announced AND visible without colour (fill + border + icon + text).
- Reachable and operable by keyboard alone; focus order logical; no traps.
- Library-internal transitions collapse under `data-motion="reduced"` / `prefers-reduced-motion`.
- Works at 400% zoom / 320px width; popups don't clip or escape the viewport.
- Any new colour pairing added to the contrast-audit pair list, probed ×4 themes.

## Dialog / alert dialog

- Opening moves focus into the dialog (to the right element — first field or least-destructive action); SR announces the accessible name.
- Focus is trapped while open; `Esc` closes; closing returns focus to the trigger.
- Background is inert to SR virtual cursor (not just visually scrimmed).

## Menu / dropdown

- Trigger announces expanded/collapsed; arrow keys move through items with announcements; typeahead jumps by letter.
- `Esc` closes and returns focus to trigger; selecting an item announces the action's result if it changes context.

## Combobox / autocomplete / select

- Typing announces filtered-results count (`aria-live` or the library's wiring — verify it actually speaks).
- Arrow keys move the active option with announcement while focus stays in the input (`aria-activedescendant` behaviour).
- Selection is announced; the committed value reads back on re-focus; the label is announced with the input, not lost in the wrapper.
- Required/invalid states announced (`aria-required`, error text via `aria-describedby`).

## Tabs

- Arrow keys move between tabs; the selected tab is announced as selected; panel content reachable with a single `Tab` press from its tab.
- Automatic vs manual activation is deliberate and consistent across the app.

## Toast / status

- Announced without stealing focus (`role="status"` polite for info, `role="alert"` only for errors).
- No time limit on reading: pausable, dismissible, or persistent — learning tasks are never timed out (charter).

## Tooltip / popover

- Content reachable on focus, not just hover; dismissible with `Esc`; never the sole carrier of information required to act.

## Accordion / disclosure

- Trigger is a real `<button>` inside a heading; expanded/collapsed state announced; content in reading order after its trigger.

## Sign-off

A wrapped widget is done when: every check above that needs no screen reader passes (keyboard, focus, visible state, zoom and reflow) · pairings are in the audit · the widget renders correctly in all five themes and forced-colors · reduced motion honoured. A pass with a real screen reader is an ambition, not a requirement (ADR-213, owner gate 3, amended 2026-11-12); when one is run, record the SR/browser pair in the PR, and when none is, say in the PR that announcements were not verified.
