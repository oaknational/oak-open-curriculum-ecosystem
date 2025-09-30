# Semantic Search UI Styling Catalogue

_Last updated: 2025-09-24_

This catalogue tracks the styling status of UI surfaces within the semantic search Next.js app.

## Migrated to Oak Components

- `apps/oak-open-curriculum-semantic-search/app/ui/SearchFacets.tsx` – renders facets using `OakBox`, `OakHeading`, `OakUL`, and `OakSecondaryButton`; no bespoke `styled-components` remain.
- `apps/oak-open-curriculum-semantic-search/app/ui/SearchResults.tsx` – result lists and highlights now use `OakBox`, `OakTypography`, and `OakUL` while retaining sanitised highlight rendering.
- `apps/oak-open-curriculum-semantic-search/app/ui/StructuredSearchClient.tsx` & `app/ui/structured-fields.tsx` – structured search form/grid rebuilt with Oak radio/input components and shared field helpers.
- `apps/oak-open-curriculum-semantic-search/app/ui/NaturalSearch.tsx` – natural language search form migrated to Oak radio/input primitives with shared field helpers.
- `apps/oak-open-curriculum-semantic-search/app/ui/fields.tsx` – general-purpose input/select helpers now wrap Oak components and tokens.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/HeaderStyles.tsx` – header/nav rebuilt with `OakFlex`, Oak spacing tokens, and Oak logo imagery.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/SearchPageClient.tsx` – main layout, error messaging, and headings expressed with `OakBox`/`OakTypography` tokens.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/SearchTabHeader.tsx` – structured/NL mode toggle uses `OakButtonAsRadioGroup` and Oak secondary radio buttons.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/ThemeSelect.tsx` – theme picker now wraps Oak radio group/button components with token-controlled spacing.
- `apps/oak-open-curriculum-semantic-search/app/admin/page.tsx` – admin console rebuilt with Oak layout/typography primitives and Oak buttons for stream triggers.
- `apps/oak-open-curriculum-semantic-search/app/api/docs/page.tsx` – API docs shell migrated to Oak layout/typography tokens with Redoc embedded inside an Oak bordered container.

## Outstanding bespoke styling to migrate

_(None – all tracked surfaces now use Oak Components/tokens.)_

Future refactors must update this catalogue whenever a surface is migrated or new bespoke styling is introduced.
