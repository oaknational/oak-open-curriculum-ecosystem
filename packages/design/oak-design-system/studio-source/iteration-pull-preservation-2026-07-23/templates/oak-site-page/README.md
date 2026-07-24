# Oak site page — template notes

Preview/authoring copy lives here as a Design Component; consuming repos
are **TypeScript (Next.js)**, so treat this file as the reference markup
to port, not code to ship:

- `class` → `className`; inline `style="a:b;c:d"` strings → typed style
  objects (`style={{ a: 'b' }}` — `var(--token)` values carry over as-is).
- Keep the class names and tokens verbatim — they are the published
  `@oaknational/oak-design-system` CSS; import `styles.css` once at app
  level instead of the `ds-base.js` loader (see
  `guidelines/docs/consuming-nextjs.md` for the canonical setup).
- `assets/logo.svg` and `assets/header-underline.svg` ship with the
  template; in OWA these resolve from Cloudinary/oak-components instead.
- Icons are the real Oak set hotlinked from OWA's Cloudinary account
  (`res.cloudinary.com/oak-web-application`), exactly as OWA serves them —
  a network dependency (same posture as KNOWN-ISSUES #3); consumers who
  need offline should bundle them locally or use `OakIcon` in-app.
- Sections are deliberately independent — delete whole `<section>`/band
  blocks you don't need; spacing comes from each section's own
  margin/padding (the `.oak-main` region grid keeps `gap: 0`).
- Every template folder also ships `theme-control.js` (masthead theme
  select → root `data-theme`, persisted) and `theme-enhancements.css` — a
  TEMPORARY token overlay applied after the bundle (see
  `explorations/dark-theme-token-review.md`); delete both overlay wiring
  lines in `ds-base.js` and the file itself once the token changes land
  upstream via /design-sync.
