# Oak UI Kit

A single, comprehensive reference build of the Oak National Academy product UI, modelled on the live site ([thenational.academy](https://www.thenational.academy/)) and built entirely from this design system's tokens, components and icons.

## Files
- `index.html` — the full homepage composition (open this).
- `shared.js` — primitives wired to the design system: `Icon` (local `assets/icons/*`), `SubjectChip`, `Button` (OakButton states), `Tag` (OakTagFunctional), `Nav`, `Footer`. Derived from the canonical compiled components under `components/` — if they drift, `components/` wins.
- `sections.js` — page sections: `Hero`, `TrustBand`, `SubjectGrid`, `AilaFeature`, `CurriculumFeature`, `PupilFeature`, `QuoteBand`, `Newsletter`.

## What it demonstrates
- **Tokens** — pulls `../../styles.css` (fig-tokens + colors_and_type), so every colour, type ramp and radius is the verified Oak value.
- **Components** — buttons, tags, subject chips, cards, quiz answer states, nav, footer, newsletter form all match the `preview/` component cards.
- **Signature motifs** — thick 2–3px black borders, offset lemon/grey drop-shadows, sentence-case copy, Lexend, pastel decorative panels, hand-drawn underline accent.
- **Voice** — copy follows the brand toolkit: "free, always", "you guide Aila", pupils not students.

## Notes
Icons load from the local `assets/icons/` set (downloaded from Oak's Cloudinary `oak-web-application` cloud); no network dependency. This replaces the earlier separate teacher-website / pupil / Aila kits with one consolidated kit.
