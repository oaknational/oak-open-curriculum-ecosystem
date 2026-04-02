---
name: "ChatGPT report normalisation"
use_this_when: "Recovering an LLM-exported report from markdown, DOCX, and PDF copies into durable repo-quality markdown"
category: process
proven_in: "pythonic-algo-approaches clean-up plus Oak multi-export report consolidation (2026-03-20 to 2026-04-02)"
proven_date: 2026-04-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Trusting export artefacts, losing real citation links, and preserving stale time-sensitive claims"
  stable: true
---

# ChatGPT Report Normalisation

## Principle

Treat a ChatGPT-exported report as a recovery artefact, not as canonical source
material. Rebuild the canonical markdown from the strongest surviving layer as
a source-faithful clean copy, not as an editorial rewrite or a report about
the document.

## Pattern

1. Default to a source-faithful clean copy.
   Preserve the original wording, section order, list shape, and document
   rhythm unless a repair is needed to restore links, remove export artefacts,
   or fix broken markdown.
2. Prefer the `.docx` over the markdown or PDF when you need to recover links.
   The DOCX relationship targets usually preserve the actual URLs even when the
   markdown only contains internal `turn...` references.
3. Use the existing markdown structure if it is already better than a fresh
   conversion. `pandoc` is useful as a secondary lens for recovering citation
   placement, but its direct conversion may degrade tables, lists, code fences,
   or Mermaid blocks.
4. When local PDF tools are available, inspect the PDF as a real text surface
   rather than treating it as metadata only:
   - `pdfinfo` for provenance and pagination
   - `pdffonts` to distinguish text PDFs from image-based exports
   - `pdftotext` as the primary extraction path
   - `mutool` as a fallback extractor if `pdftotext` damages layout
5. Treat trailing raw-URL dumps from PDFs as a verification layer, not as a
   better bibliography. Compare them against the DOCX relationship targets
   before treating them as genuinely new references.
6. Strip export artefacts explicitly:
   - internal citation markers such as `cite`, `filecite`, and `turn...`
   - tracking parameters such as `utm_source=chatgpt.com`
   - generic export metadata where relevant
7. If you start in an ignored scratch or import area, promote the final
   canonical file into a tracked repo path before calling the task complete.
8. Preserve the original citation rhythm where possible. Swap broken inline
   markers for inline linked citation numbers before escalating to heavier
   editorial structures.
9. When recovered numeric citations come from DOCX or pandoc output, normalise
   them to readable markdown such as `[[12]](https://example.com)` instead of
   leaving heavily escaped link text in the final copy.
10. After automated conversion, restore markdown block boundaries around
    headings, lists, and tables. Also confirm that prose lines such as
    `Sources:` have not been accidentally absorbed into the row stream of a
    preceding table.

11. Run an accuracy sweep for unstable claims:

    - package versions and release dates
    - licences
    - Python-version support
    - product or API behaviour that may have changed

12. For the sweep, prefer primary sources:

    - official docs
    - official package metadata
    - official repositories

13. Where a claim is brittle, either verify it with an exact date or simplify
   the wording so it ages more gracefully.
14. Strip duplicated raw-URL appendices that some DOCX or PDF conversions emit
    after the real document content.
15. Finish with targeted markdown validation so the cleaned document meets repo
   standards as well as content standards.

## Anti-Pattern

- Treating the markdown copy as trustworthy just because it looks structured
- Turning a requested clean copy into a report *about* the document instead of
  preserving the document itself
- Trusting PDF or DOCX export provenance without checking for lingering
  ChatGPT metadata or trackers
- Leaving escaped citation link text, broken block spacing, or duplicate raw
  URL appendices in what is supposed to be the clean copy
- Treating a dumped PDF URL appendix as authoritative new references without
  comparing it to the DOCX relationship targets
- Rebuilding from a fresh conversion that worsens the document structure when a
  cleaner hand-curated markdown scaffold already exists
- Leaving the polished result only in an ignored staging lane instead of
  promoting the tracked canonical copy
- Keeping vague, time-sensitive claims such as "recent" or "latest" without
  either verifying them or anchoring them to a concrete date

## When to Apply

Use this whenever a report originates from ChatGPT or another LLM export and
you need to turn it into a repo-quality markdown reference with durable links
and credible citations.
