# Transcript

## Files read

- `.agent/skills/domain-craft/ui-design/design-system-usage/SKILL-CANONICAL.md`
- `.agent/skills/domain-craft/ui-design/design-system-usage/references/whats-where.md`
- `packages/design/oak-design-system/oak-theme.js`
- `packages/design/oak-design-system/docs/nextjs-theme-switcher.tsx.txt`
- `packages/design/oak-design-system/DECISIONS.md` (grepped for `DDR-00`/related terms;
  no literal hit, so the DDR numbers cited in the skill are read as pointers to
  concepts explained elsewhere, not literal section headers)
- `packages/design/oak-design-system/README.md`
- `packages/design/oak-design-system/colors_and_type.css` (read in full)
- `packages/design/oak-design-system/components.css` (read in relevant sections:
  layout primitives, buttons, tags, cards, form fields/select, skip-link/visually-hidden,
  the region-contract composition block)
- `packages/design/oak-design-system/oak-icons.css` (read in full)
- `packages/design/oak-design-system/print.css` (read in full)

## Theme set

The skill is explicit and non-negotiable on this: five selectable themes, four
token-bearing (light / dark / system / high-contrast / colour-safe), never a subset —
and `oak-theme.js` (the file that ships as the runtime) hard-codes exactly that list as
`THEMES`. So the theme set wasn't really a design decision to make; it was a value to
read off the vendored file and offer unmodified, labelled the same way the shipped
Next.js reference switcher labels them ("Match device" for `system`, etc.).

## Persistence model

`oak-theme.js` already is the canonical persistence mechanism: `oakTheme.set(name)`
writes `localStorage["oak-theme"]` and sets `data-theme` on `<html>`, and the same
script re-applies the stored value synchronously before first paint on every load (no
flash of the wrong theme), so I embedded it verbatim rather than writing new
persistence logic. The one real decision was the OS-follow default: the vendored
file's own no-choice fallback is "light" (dark/system are opt-in, not the default),
which doesn't satisfy "follows the OS when no preference is expressed." I added a
small page-level bootstrap script, layered on top via the public API, that calls
`oakTheme.set('system')` on first run only when there's no stored choice *and* the OS
isn't already asking for more contrast (that accessibility default has to keep
winning). Using `set()` rather than poking `data-theme` directly onto the DOM keeps
`oakTheme.get()`/`choice()` truthful — matching the library's own stated invariant
that the applied theme must never desync from what those accessors report.

## Verification

Static checks: confirmed every `oak-*` class used in the markup is actually defined
in `components.css`/`colors_and_type.css` (no invented classes — one first draft,
`oak-tag--lemon`, doesn't exist, since the base `.oak-tag` is already lemon by
default; fixed to plain `oak-tag`), checked HTML tag balance, and `node --check`'d all
three inline `<script>` blocks.

Behavioural: served the file over a local HTTP server and drove it with Playwright
(Chromium) to check the actual requirements rather than trust the code by inspection
alone:

- Fresh browser context, OS set to dark, no stored choice → `data-theme` ends up
  `"system"`, `oakTheme.get()` is `"system"`, the select shows "Match device", and the
  computed body background is dark (`rgb(34, 34, 34)`) — confirms OS-follow-by-default.
- Explicitly picking "Dark" persists to `localStorage`; reloading the page (OS still
  light) keeps `data-theme: "dark"` — confirms persistence across reloads and that an
  explicit choice beats the OS default.
- A `prefers-contrast: more` emulation test to confirm the accessibility default
  (auto high-contrast) still wins over my "system" default was inconclusive — this
  particular headless Chromium build didn't actually flip `matchMedia('(prefers-contrast:
  more)')` under Playwright's `contrast` emulation, so that specific interaction is
  verified by code inspection (my bootstrap script checks the same media query
  `oak-theme.js`'s own `auto()` does) rather than empirically.
