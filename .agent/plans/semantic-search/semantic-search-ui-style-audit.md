# UI Style & Token Audit (apps/oak-open-curriculum-semantic-search)

Scope: Track and eliminate raw styling across current and forthcoming UI surfaces (search results, sequences, suggestions, facets, admin telemetry) so everything consumes the theme bridge tokens and Oak Components.

---

## Existing findings (must confirm and clear)

- `app/layout.tsx`: header border, padding, link spacing, image display, meta theme colours still hard-coded.
- `app/page.tsx`: container width, margins, paragraph colours, alert text colour, section spacing.
- `app/ui/client/HeaderStyles.tsx`: ensure background/hover/focus use tokens instead of rgba literals.
- `app/ui/StructuredSearch.tsx` & `app/ui/NaturalSearch.tsx`: grid gaps, label spacing, input widths.
- `app/ui/SearchResults.tsx`: list borders, paddings, meta text colour/size, highlight chips, section spacing.
- `app/ui/client/ThemeSelect.tsx`: auto margin, label spacing.
- `app/admin/page.tsx`: section spacing, background colours for code blocks/logs, border radii.
- `app/api/docs/page.tsx`: paddings, font sizes, border colours.

---

## Upcoming components to audit (alignment deliverables)

- `app/ui/SequencesResults.tsx` (or equivalent): card background, border, topic chips, canonical URL links.
- `app/ui/FacetChips.tsx` / `FacetPanel.tsx`: chip backgrounds, selected state, label spacing.
- `app/ui/SuggestionList.tsx`: dropdown container shadow, backdrop, hover/active states.
- `app/ui/SearchSummary.tsx`: zero-hit banner colours, typography.
- `app/ui/admin/StatusPanel.tsx`: progress bars, metric tiles, error callouts.
- `app/ui/admin/VersionBadge.tsx`: border/background.
- Any Oak Component overrides (Buttons, Inputs, Tabs) must map to semantic tokens, not inline style overrides.

---

## Tokenisation plan

### colours (`theme.app.colours`)

- `border.header`, `border.subtle`, `text.muted`, `text.error` – already defined; confirm usage.
- Add: `surface.card`, `surface.dropdown`, `surface.adminPanel`, `surface.zeroHit`, `surface.facet.selected`.
- Add: `text.link`, `text.zeroHit`, `text.metric`, `icon.success/error/warning`.

### spacing (`theme.app.space`)

- Ensure sequences cards, suggestion list items, facet chips use defined scale (`xs` → `xl`).
- Introduce `xxl` if admin metrics require larger gaps.

### radii (`theme.app.radii`)

- Add `lg` (12px) for cards/dropdowns if Oak tokens lack equivalent.
- Map chips/buttons to existing radii to maintain consistency.

### shadows (`theme.app.shadows`)

- Define `dropdown`, `panel`, `focus` shadows for suggestion list and admin tiles.

### motion/opacity (`theme.app.motion`)

- Provide reduced-motion friendly transitions for dropdown fade/slide.
- Add focus outlines tokens to avoid hard-coded `outline` styles.

---

## Migration checklist

1. Replace raw values listed above with semantic tokens; remove remaining `style` props.
2. Audit new components introduced by alignment work (sequences, facets, suggestions, admin telemetry) immediately after they land; update this document with findings during PR review.
3. Verify Theme Bridge exports cover added tokens; augment `app/ui/themes/tokens.ts` and associated light/dark maps.
4. Update tests to assert token usage where practical (e.g., snapshot CSS vars for dropdown/facet states).
5. Coordinate with documentation plan to mention token additions when relevant (README/design notes).

---

## Notes

- Maintain parity between light and dark tokens; no placeholder “same as light” values.
- Log token additions in GO review entries to avoid drift.
- If Oak Components expose built-in theming for new surfaces, prefer their tokens and map to our semantic layer rather than introducing bespoke values.
