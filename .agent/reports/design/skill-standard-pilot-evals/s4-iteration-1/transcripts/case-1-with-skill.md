# Transcript: files read

## Required skills (read in full, before building)

- `.agent/skills/domain-craft/ui-design/ui-visual-design/SKILL-CANONICAL.md`
- `.agent/skills/domain-craft/ui-design/ui-visual-design/references/craft-fundamentals.md`
- `.agent/skills/domain-craft/ui-design/design-system-usage/SKILL-CANONICAL.md`

## Design system (read-only)

- `packages/design/oak-design-system/README.md`
- `packages/design/oak-design-system/brand.css` (primitives/roles overview
  section, and the "composition surface" / region-contract section in
  full)
- `packages/design/oak-design-system/brand_voice.txt` (opening voice
  principles)
- `packages/design/oak-design-system/components.css` (read in full via
  several ranged passes: token block, layout primitives, links/icons,
  buttons/tags/cards/chips, form fields, accordion/disclosure/table/empty
  state, authoring blocks, and the region-contract implementation at the
  end of the file)
- `packages/design/oak-design-system/colors_and_type.css` (read in full via
  several ranged passes: primitive palette, semantic role tokens per
  theme, type classes, scoped native-element defaults)
- `packages/design/oak-design-system/studio-source/preview/composition-regions.html`
- `packages/design/oak-design-system/studio-source/ui_kits/oak/index.html`
- `packages/design/oak-design-system/studio-source/ui_kits/oak/sections.js`
  (head only, to see the Hero section's structure)
- `packages/design/oak-design-system/studio-source/preview/download-card.html`
- `packages/design/oak-design-system/studio-source/preview/breadcrumbs.html`
- `packages/design/oak-design-system/studio-source/preview/tiles.html`
- `packages/design/oak-design-system/studio-source/preview/card.html`
- `packages/design/oak-design-system/studio-source/preview/authoring-blocks.html`
- Directory listing of `packages/design/oak-design-system/assets/icons/`
  to inventory real, shippable icon names before referencing any in markup

## Reasoning

I read both visual-design references first because the task is a hierarchy/
composition problem, not a token-lookup problem — the skill's "one primary
element, ranked not weighted, position/size/weight before colour" framing
directly shaped which of the five sections got the accent shadow, which got
a smaller heading class, and which got demoted into a quiet tone band. I
then read design-system-usage and the region-contract material
(`brand.css`, `composition-regions.html`, `components.css`'s `[data-page]`
blocks) because the skill mandates building any full page on
`.oak-canvas`/`.oak-main`/`[data-region]`, and the shipped `[data-page="unit"]`
map turned out to be shaped for a unit-*browsing* page (facets + results)
rather than a single unit's landing page — I needed to see that map in full
before concluding it didn't fit and minting a new `unit-landing` type
instead of forcing content into a mismatched shape. The preview specimen
files (`card.html`, `tiles.html`, `download-card.html`, `breadcrumbs.html`)
are flagged in the system's own README as visual specimens using primitive
tokens, not copy sources, so I read them for layout ideas only and rebuilt
every piece from the real `oak-*` component classes and semantic tokens in
`components.css`/`colors_and_type.css` rather than pasting their markup.
`authoring-blocks.html` supplied the real `oak-key-learning-points` pattern
used in the unit-summary section. I also read the icon directory listing so
every `<img src="assets/icons/...">` in the page references an icon that
actually exists in the shipped set, rather than a guessed filename.
