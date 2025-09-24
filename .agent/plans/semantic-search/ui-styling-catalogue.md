# Semantic Search UI Styling Catalogue

_Last updated: 2025-09-24_

This catalogue tracks the styling status of UI surfaces within the semantic search Next.js app.

## Migrated to Oak Components

- `apps/oak-open-curriculum-semantic-search/app/ui/SearchFacets.tsx` – renders facets using `OakBox`, `OakHeading`, `OakUL`, and `OakSecondaryButton`; no bespoke `styled-components` remain.
- `apps/oak-open-curriculum-semantic-search/app/ui/SearchResults.tsx` – result lists and highlights now use `OakBox`, `OakTypography`, and `OakUL` while retaining sanitised highlight rendering.
- `apps/oak-open-curriculum-semantic-search/app/ui/StructuredSearchClient.tsx` & `app/ui/structured-fields.tsx` – structured search form/grid rebuilt with Oak radio/input components and shared field helpers.
- `apps/oak-open-curriculum-semantic-search/app/ui/NaturalSearch.tsx` – natural language search form migrated to Oak radio/input primitives with shared field helpers.
- `apps/oak-open-curriculum-semantic-search/app/ui/fields.tsx` – general-purpose input/select helpers now wrap Oak components and tokens.

## Outstanding bespoke styling to migrate

- `apps/oak-open-curriculum-semantic-search/app/ui/client/SearchPageClient.tsx:11-116` – layout, sections, headings, and error messages built with custom `styled-components` wrappers.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/SearchTabHeader.tsx:4-41` – bespoke tablist and buttons with manual active styling.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/ThemeSelect.tsx:1-35` – ensure header integration provides Oak layout spacing after the broader header refactor.
- `apps/oak-open-curriculum-semantic-search/app/ui/client/HeaderStyles.tsx:6-52` – header/nav, spacing, and logo styling via `styled-components`.
- `apps/oak-open-curriculum-semantic-search/app/admin/page.tsx:4-74` – admin shell, sections, and streamed output cards using bespoke styling.
- `apps/oak-open-curriculum-semantic-search/app/api/docs/page.tsx:4-53` – API docs page layout, headers, and wrapper built with custom styled components.

Future refactors must update this catalogue whenever a surface is migrated or new bespoke styling is introduced.
