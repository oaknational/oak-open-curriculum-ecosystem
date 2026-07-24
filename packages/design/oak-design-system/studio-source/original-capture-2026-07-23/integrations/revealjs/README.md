# reveal.js integration

An Oak theme for [reveal.js](https://revealjs.com/) — for code-first slides in the open-curriculum ecosystem. Reveal exposes its whole theme surface as `--r-*` CSS custom properties, so `oak-reveal-theme.css` simply maps them onto the role tokens: slides inherit all four themes, printing, and white-label re-brands (`brand.css`) with no reveal-specific work.

- `oak-reveal-theme.css` — the theme. Load order matters: `reveal.css` → a reveal base theme (**required**; the rules that consume `--r-*` live in reveal's theme layer, not its core) → `colors_and_type.css` (+ `print.css`, + `brand.css` for a re-brand) → this file last so its overrides win.
- `vendor/` — reveal.js 5 vendored for fully offline use (MIT, `vendor/LICENSE`): `reveal.css`, `reveal.js`, and the `simple.css` base theme with its Google Fonts `@import`s stripped (fonts come from the Oak theme). In a real app, `npm install reveal.js` and import from `reveal.js/dist/` instead — same load order.
- `Oak Reveal Deck.html` — minimal sample (four slides, fully offline against `vendor/`).

Rules that carry over: sentence case (`--r-heading-text-transform: none`), the ≥24px projection floor (`--r-main-font-size`), quiet motion (`transition: 'fade'`, `none` under reduced-motion — never convex/zoom), the double focus ring on links.

**`templates/lesson-deck/` stays the canonical deck** — it drives the PPTX/PDF/editing tooling here. This integration is for consumers who author slides as code (or via Quarto/sphinx-revealjs, which accept a custom theme CSS the same way).
