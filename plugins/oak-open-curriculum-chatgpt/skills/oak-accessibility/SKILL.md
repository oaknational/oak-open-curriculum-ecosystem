---
name: oak-accessibility
description: >-
  Make ANY artefact meet WCAG 2.2 AA — the accessibility floor for everything,
  Oak-branded or not — and audit existing artefacts against it. Use when creating
  or reviewing documents, slide decks, web pages, PDFs, video, audio, or
  quizzes/interactive content for accessibility: "make this accessible", "is this
  WCAG 2.2 AA", "audit accessibility", "add alt text", "add captions or a
  transcript", "check colour contrast", "fix heading structure or reading order",
  "is this keyboard accessible", "are the tap targets big enough". Covers text
  alternatives, structure and reading order, colour and contrast (AA 4.5:1, with
  Oak's AAA 7:1 as an additive bar where the Oak brand applies), keyboard and
  target size, captions and transcripts, plain language, resize and reflow, and
  the WCAG 2.2 additions. Distinct from the educational "accessible" principle
  in oak-curriculum-principles (SEND/inclusive teaching) — this is
  technical/digital accessibility.
license: Accessibility guidance synthesised from WCAG 2.2 (W3C). See references/sources.md.
metadata:
  author: Oak National Academy
  version: '0.1.1'
---

# Oak National Academy: Accessibility

This skill is the single source of truth for the **digital accessibility** of any artefact — documents, slide decks, web pages, PDFs, video, audio, and quizzes — whether or not it carries the Oak brand. It exists so that whenever an agent creates or reviews an artefact, it is held to a clear, consistent standard rather than each skill reinventing one.

## The standard: WCAG 2.2 AA is the floor

**Every artefact must meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) at Level AA — Oak-branded or not.** That is the minimum, not the aspiration.

- **AA is the floor.** If you can't confirm a criterion is met, treat it as not met and fix it.
- **AAA where Oak requires it.** Oak goes beyond AA in places — most notably **colour contrast at 7:1** (an AAA threshold) per the brand. Apply the higher bar where Oak's brand or this skill says so; don't drop to AA "because AA allows it".
- **WCAG 2.2 specifically** — not 2.1. The 2.2 additions matter for interactive output (target size, focus visibility, dragging alternatives, redundant entry, accessible help/authentication). See `references/wcag-2-2-aa.md`.

## Two senses of "accessible" — don't conflate them

Oak cares about two different things that share a word:

- **Digital/technical accessibility (this skill).** Can _everyone_, including disabled users and assistive-technology users, perceive and operate the artefact? Measured against WCAG 2.2 AA.
- **Educational/inclusive accessibility (`oak-curriculum-principles`, principle 6).** Can _all pupils_, especially those with SEND, access the same ambitious content? Achieved through low-floor/high-ceiling design, scaffolding, dual coding.

They reinforce each other but are not the same check. A lesson can be brilliantly scaffolded (educationally accessible) and still fail WCAG (poor contrast, no captions, images with no alt text). **Apply both.** This skill covers the first; pair it with `oak-curriculum-principles` for the second.

## How to use this skill

Apply the floor below to everything. When you reach a specific artefact, load the matching reference — don't load everything up front.

- **The criteria themselves** (what AA requires, the 2.2 additions, what Oak takes to AAA) → `references/wcag-2-2-aa.md`
- **Documents, slide decks, PDFs** (Docs/Word, Slides/PowerPoint, exported PDFs) → `references/documents-and-decks.md`
- **Web pages and interactive content** (HTML, forms, quizzes, anything clickable) → `references/web-and-interactive.md`
- **Video, audio, animation, GIFs** → `references/media.md`
- **Finishing a piece** → run `assets/accessibility-checklist.md` before sign-off.

## The floor — these hold for every artefact

1. **Text alternatives.** Every image, icon, chart, or diagram that carries meaning has concise, accurate alt text; purely decorative images are marked decorative (empty alt). Don't put information only in an image of text.
2. **Structure and reading order.** Use real headings in order (one H1, then H2/H3 — never skipped for visual size), real lists and tables (with header cells), and a logical reading order that matches the visual order.
3. **Don't rely on colour alone.** Never use colour as the only way to convey meaning, state, or "correct/incorrect" — pair it with text, shape, or a label. (WCAG 1.4.1)
4. **Contrast.** Text meets at least **4.5:1** (3:1 for large text ≥24px/19px-bold and for UI components/graphics). **Oak's target is 7:1** where the brand applies.
5. **Keyboard and target size.** Anything interactive works by keyboard alone, has a visible focus indicator, and gives pointer targets of at least **24×24 CSS px** (WCAG 2.2 2.5.8).
6. **Captions and transcripts.** Video has synchronised captions; audio has a transcript; meaningful animation/GIFs have a text equivalent and **must not flash** more than 3×/second.
7. **Plain language.** Write so the content is as readable as the subject allows. (WCAG 3.1)
8. **Resize and reflow.** Content stays usable at 200% zoom and reflows to a single column at 320px width; never disable zoom.

When a tool can't express a feature (e.g. a slide tool with no real "heading" role), get as close as the format allows and **note the residual limitation** rather than claiming full conformance.

## How it pairs with the other skills

- **`oak-curriculum-principles`** holds the _educational_ "accessible" principle — the complementary, non-WCAG sense above.

## References and assets

- `references/wcag-2-2-aa.md` — the AA success criteria that matter for Oak's output, the WCAG 2.2 additions, and the AAA items Oak adopts.
- `references/documents-and-decks.md` — checklists for documents, slide decks, and PDFs.
- `references/web-and-interactive.md` — web pages, forms, and quizzes/interactive content.
- `references/media.md` — video, audio, animation, and GIFs.
- `references/sources.md` — WCAG 2.2 and supporting standards; attribution.
- `assets/accessibility-checklist.md` — one-page pre-publish checklist by artefact type.
