# UI Style Audit (apps/oak-open-curriculum-semantic-search)

Scope: Inline styles, color literals, spacing, radii, and other visual constants to migrate to theme tokens per M0.

## Findings (by file)

- app/layout.tsx
  - header wrapper: borderBottom `#e5e7eb`, padding, flex layout, gap
  - links: margin-left `1rem`
  - image: display `block`
  - viewport meta colors: rgb(190 242 189), #0b1021
- app/page.tsx
  - main: maxWidth 900, margin `0 auto`, padding `1rem`
  - h1: marginBottom `0.5rem`
  - p: marginTop 0, color `#555`
  - alert p: color `crimson`, marginTop `1rem`
- app/ui/SearchTabHeader.tsx
  - background rgba(0,0,0,0.06) (now themed component; background to move to token)
- app/ui/StructuredSearch.tsx
  - form: grid layout, gap `0.5rem`
- app/ui/NaturalSearch.tsx
  - form: grid layout, gap `0.5rem`
- app/ui/ThemeSelect.tsx
  - container: marginLeft `auto`
  - label: marginRight 6
- app/ui/SearchResults.tsx
  - li: border `#ddd`, padding `0.5rem`, borderRadius 4
  - meta div: color `#666`, fontSize 12
  - ul: marginTop `0.5rem`
  - outer section: marginTop `1.25rem`
  - ul container: listStyle none, padding 0, grid gap `0.5rem`
- app/admin/page.tsx
  - sections: margins (24, 12, 8px), main container layout/padding
  - pre: background `#111827`, color `#e5e7eb`, borderRadius 8
- app/api/docs/page.tsx
  - main/header paddings/margins, h1 fontSize 22, margins, link underline
  - container: border `#e5e7eb`, borderRadius 8

## Tokenization plan

- colors.app:
  - headerBorder: was `#e5e7eb` (light), `#1f2937` (dark)
  - borderSubtle: was `#ddd` (light), `#374151` (dark)
  - textMuted: was `#666` (light), `#9ca3af` (dark)
  - errorText: was `crimson` (light), `#ef4444` (dark)
  - pageNote: include `#555` (light) and dark variant
  - docsNote: include `#4b5563` (light) and dark variant
  - surfaceEmphasisBg: rgba fallback for tab active state (derive from theme)
- space.app: xs/sm/md/lg/xl already mapped to 0.25/0.5/0.75/1/1.25rem
- radii.app: sm 4px, md 6–8px (map 8px usages)

## Migrations (next edits)

- Replace inline styles in: layout.tsx, page.tsx, ThemeSelect.tsx, StructuredSearch.tsx, NaturalSearch.tsx, SearchResults.tsx, admin/page.tsx, api/docs/page.tsx with styled components consuming tokens.
- Add tokens: pageNote, docsNote, surfaceEmphasisBg, radius.md=8px.
- Move viewport themeColor rgb/hex values behind tokens if used in UI (leave meta as-is for now).

## Notes

- Keep semantics/aria intact. Visual parity first; design refinements follow in M1/M2.
