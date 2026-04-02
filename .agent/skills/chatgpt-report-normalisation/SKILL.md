---
name: chatgpt-report-normalisation
classification: passive
description: >-
  Recover ChatGPT-, deep-research-, or other LLM-exported reports from
  markdown, DOCX, and PDF copies into source-faithful clean markdown with real
  links, stripped artefacts, and minimal editorial change.
---

# ChatGPT Report Normalisation

## Goal

Turn a report exported from ChatGPT, deep research, or another LLM into
canonical markdown that the repo can keep, review, and trust.

Default to a **source-faithful clean copy**: preserve the original wording,
section order, and document shape unless a repair is required to restore links,
remove export artefacts, or fix broken markdown.

## Use This Skill When

- The user provides paired `.md`, `.docx`, or `.pdf` copies of the same report
- The markdown contains `cite`, `filecite`, `turn...`, or other internal
  export markers
- The DOCX appears to preserve live links that the markdown has lost
- The document contains time-sensitive claims that need an accuracy sweep
- The report currently sits in a scratch or import lane and needs promotion to
  tracked canon

## First Principle

Treat the export as a recovery artefact, not as canonical source material.

Read `.agent/memory/patterns/chatgpt-report-normalisation.md` before making
structural decisions or choosing a rebuild strategy.

## Deliverable

- Preserve title, section order, wording, list shape, tables, and examples.
- Limit changes to citation-link recovery, export-artefact removal, broken
  markdown repair, deduplicating obvious export junk, and light formatting
  cleanup.
- The deliverable from this skill is the clean copy itself, not a report about
  the document.

## Workflow

1. Inventory the available copies.
   - Prefer the `.docx` for hyperlink recovery.
   - Prefer the existing markdown if its structure is already better than a
     fresh conversion.
   - Use the PDF as a tie-breaker for pagination, formatting, or missing text.

2. Inspect the strong layers with local tools.
   - `textutil -convert txt -stdout report.docx` for visible text
   - `unzip -p report.docx word/_rels/document.xml.rels` for hyperlink targets
   - `pandoc report.docx -t gfm` as a secondary lens for citation placement and
     footnote hints
   - `pdfinfo report.pdf` for page count and export provenance
   - `pdffonts report.pdf` to tell a text PDF from an image-heavy export
   - `pdftotext report.pdf -` for the primary PDF text surface
   - `mutool draw -F txt -o - report.pdf` as a fallback extractor when
     `pdftotext` breaks layout or drops text
   - If CLI PDF extractors are unavailable, optional Python helpers such as
     `pypdf`, `pdfplumber`, or `PyMuPDF` can help with page-level comparison.
     For portability, install them in a dedicated virtual environment and run
     scripts with that interpreter explicitly; do not rely on system-level
     Python packages being present.
   - Treat dumped raw URLs from a PDF as a verification layer, not as a better
     bibliography. Compare them against the DOCX relationship targets before
     claiming they add genuinely new references.

3. Choose the canonical editing target.
   - The editing target is the source-faithful clean copy.
   - If the repo already has a readable markdown scaffold under
     `.agent/research/`, `.agent/reference/`, or another tracked doc estate,
     clean and upgrade it in place.
   - If the current copy sits in an ignored staging lane, use it as working
     scratch and promote the final markdown into a tracked path before closing
     the task.
   - Do not replace a better hand-edited structure with a worse direct
     conversion.

4. Remove export artefacts explicitly.
   - Delete internal citation markers such as `cite`, `filecite`, and
     `turn...`
   - Strip tracking parameters such as `utm_source=chatgpt.com`
   - Remove generic export metadata unless it is useful provenance

5. Restore attribution in durable markdown form.
   - Preserve the document's existing citation rhythm where possible.
   - Replace broken inline markers with inline linked citation numbers before
     escalating to heavier editorial structures.
   - When recovered numeric citations come from DOCX or pandoc output,
     normalise them to readable markdown such as `[[12]](https://example.com)`
     rather than leaving heavily escaped link text in the final copy.
   - Prefer local relative links for repo artefacts
   - Use direct site URLs for external sources, de-noised and stable

6. Sweep unstable claims before calling the document canonical.
   - Versions, release dates, licences, Python support, API behaviour, pricing,
     or policy claims
   - Verify against primary sources first: official docs, official package
     metadata, and official repositories
   - Anchor brittle claims to exact dates or rewrite them to age more
     gracefully

7. Finish with a short editorial pass.
   - Preserve tables, code fences, Mermaid blocks, and list structure
   - Restore markdown block boundaries around headings, lists, and tables after
     automated conversion; pandoc-style exports often collapse these and make a
     clean copy look broken
   - Ensure narrative lines such as `Sources:` do not get absorbed into the row
     stream of a preceding table
   - Match repo conventions such as British spelling when they apply
   - Add a dated accuracy note when you perform a sweep
   - Summarise unresolved gaps rather than hiding uncertainty

8. Run local validation on the final markdown.
   - `pnpm exec markdownlint path/to/file.md` for the edited file or files
   - Grep for leftover `cite`, `filecite`, `turn...`, and
     `utm_source=chatgpt.com` markers when the export started noisy

## Validation

Before closing the task, confirm:

- No `cite`, `filecite`, or `turn...` markers remain
- No `utm_source=chatgpt.com` trackers remain
- No duplicated raw-URL appendix from DOCX or PDF export artefacts remains
- Every footnote used in the body is defined
- Tables are still real markdown tables, and adjacent prose has not been
  accidentally pulled into them
- The references support the claims they are attached to
- Time-sensitive claims were either verified or softened
- The final canonical file lives in a tracked repo location, not only in
  ignored scratch space

## Guardrails

- Do not trust the markdown copy just because it looks structured.
- Do not turn the clean-copy task into a report or synthesis about the
  document.
- Do not trust the DOCX or PDF provenance without checking for lingering LLM
  artefacts.
- Do not treat a PDF's dumped raw-URL appendix as authoritative new references
  until you confirm they are not just line-break or truncation variants of
  links already recoverable from the DOCX.
- Do not leave a detached references dump if inline attribution would make the
  document clearer.
- Do not introduce GitHub blob links when a repo-local path is the canonical
  target.
- Do not call an ignored staging copy "finished" if the tracked canonical file
  still contains the old export artefacts.

## Escalate

If link recovery or citation placement is still ambiguous after comparing the
markdown, DOCX, and PDF, say so explicitly and preserve the uncertainty in the
final document.
