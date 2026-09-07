# Accessibility: documents, slide decks, and PDFs

For Google Docs/Word documents, Google Slides/PowerPoint decks, and anything exported to PDF.
These are the formats most Oak resources ship in, and the ones where structure is most often faked
with visual styling instead of real semantics.

## Documents (Docs / Word)

- **Headings.** Use the built-in heading styles (Heading 1, 2, 3…) in order — never bold large text
  standing in for a heading. One document title (H1), then nested H2/H3. This drives the navigation
  pane and screen-reader outline.
- **Lists.** Use real bulleted/numbered lists, not lines starting with "-" or manual numbers.
- **Tables.** Data tables only (not for layout). Set a **header row** (and header column where
  relevant); keep them simple — no merged/split cells where avoidable; no blank cells used as
  spacing.
- **Alt text.** Add alt text to every meaningful image, chart, and diagram; mark decorative images
  decorative. Describe the _information_, not "image of…".
- **Links.** Link text describes the destination ("Download the KS3 unit overview"), never the bare
  URL or "click here".
- **Colour & contrast.** Don't signal meaning by colour alone; body text ≥ 4.5:1 (Oak target 7:1).
- **Reading order.** Content flows top-to-bottom in the order it should be read; avoid text boxes
  that float out of sequence.
- **Language.** Set the document language so screen readers pronounce it correctly.
- **Don't put text in images.** Real, selectable text — not a screenshot of text.

## Slide decks (Slides / PowerPoint)

Decks are the hardest format to make accessible; be deliberate.

- **Unique, meaningful slide titles** on every slide (use the title placeholder, even if hidden) —
  they're the screen-reader landmark for moving between slides.
- **Reading order.** Set/verify the order in which objects are announced; it must match the visual
  order. Slide tools default to creation order, which is often wrong.
- **Use layouts/placeholders**, not free-floating text boxes, so structure is exposed.
- **Alt text** on images, icons, and SmartArt/diagrams; decorative → marked decorative.
- **Contrast on busy backgrounds.** Text over photos/colour blocks still needs 4.5:1 (Oak 7:1);
  add a solid panel behind text if needed.
- **Font size.** Generous sizes for projection; don't rely on colour to distinguish content.
- **One idea per slide; don't overload** — this is both a WCAG cognitive consideration and the
  educational "accessible" principle (see `oak-curriculum-principles`).
- **Embedded video/audio** must carry captions/transcripts — see `references/media.md`.

## PDFs (exported)

- Export from a **properly structured** source (tagged headings, alt text, reading order) — a PDF is
  only as accessible as the document it came from. Use "export as tagged PDF".
- Confirm the PDF is **tagged**, has a **document title** and **language** set, and a logical tag
  tree; run the tool's accessibility checker before publishing.
- Avoid scanned-image PDFs; if unavoidable, OCR them and check the text layer.

## Before sign-off

Run the authoring tool's built-in accessibility checker (Docs/Word/Slides/PowerPoint/Acrobat all
have one) and clear its errors, then run `assets/accessibility-checklist.md`. The automated checker
catches structure/alt-text gaps but not contrast judgement or reading order — check those by hand.
