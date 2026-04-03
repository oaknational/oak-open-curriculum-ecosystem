---
name: "ChatGPT report normalisation"
use_this_when: "Recovering an LLM-exported report from markdown, DOCX, and PDF copies into durable repo-quality markdown"
category: process
proven_in: >-
  pythonic-algo-approaches clean-up plus Oak multi-export report
  consolidation (2026-03-20 to 2026-04-03)
proven_date: 2026-04-03
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

The job is faithful-copy repair: preserve and reproduce the source content as
closely as possible while repairing structure and restoring working links.

The output contract must also be explicit: decide whether the task is an
in-place repair, a sibling clean copy, or a promotion into tracked canon
before editing.

In the common paired-export case, the strongest surviving layer is usually:

- the existing markdown for structure and content
- the DOCX relationship targets for the real external links

## Pattern

1. Default to a source-faithful clean copy.
   Preserve the original wording, section order, list shape, and document
   rhythm unless a repair is needed to restore links, remove export artefacts,
   or fix broken markdown.
2. Use the existing markdown as the default editing scaffold for structure and
   content whenever it is already readable.
3. Prefer the `.docx` over the markdown or PDF when you need to recover links.
   The DOCX relationship targets usually preserve the actual URLs even when the
   markdown only contains internal `turn...` references.
4. Use the existing markdown structure if it is already better than a fresh
   conversion. `pandoc` is useful as a secondary lens for recovering citation
   placement, but its direct conversion may degrade tables, lists, code fences,
   or Mermaid blocks. If a `pandoc` conversion appends a trailing
   horizontal-rule or raw-URL bibliography dump, treat only the pre-dump body
   as the usable citation surface unless a link is uniquely recoverable there.
5. Repair citations marker-by-marker inside the markdown scaffold instead of
   globally remapping the document from pandoc output.
6. When local PDF tools are available, inspect the PDF as a real text surface
   rather than treating it as metadata only:
   - `pdfinfo` for provenance and pagination
   - `pdffonts` to distinguish text PDFs from image-based exports
   - `pdftotext` as the primary extraction path
   - `mutool` as a fallback extractor if `pdftotext` damages layout
7. Treat trailing raw-URL dumps from PDFs as a verification layer, not as a
   better bibliography. Compare them against the DOCX relationship targets
   before treating them as genuinely new references.
8. Strip export artefacts explicitly:
   - internal citation markers such as `cite`, `filecite`, and `turn...`
   - entity/image export markers such as `entity` and `image_group`
   - tracking parameters such as `utm_source=chatgpt.com`
   - generic export metadata where relevant
9. Make the output contract explicit before editing:
   - overwrite the raw markdown only if that is the agreed landing pattern
   - use a sibling clean copy (for example `*-clean.md`) when raw imports must
     remain intact or re-importable
   - promote into tracked canon only when the task actually includes promotion
10. Preserve the original citation rhythm where possible. Swap broken inline
   markers for inline linked citation numbers before escalating to heavier
   editorial structures.
11. When recovered numeric citations come from DOCX or pandoc output, normalise
   them to readable markdown such as `[[12]](https://example.com)` instead of
   leaving heavily escaped link text in the final copy. If a DOCX or `pandoc`
   conversion attaches a recovered URL to a visible entity name instead of the
   citation-marker position, treat that inline link as suspect and keep the
   entity text plain unless the source clearly supports it.
12. Do not let DOCX-first or pandoc-first conversions overrule a better
    markdown scaffold merely because they surface more URLs.
13. After automated conversion, restore markdown block boundaries around
    headings, lists, and tables. Also confirm that prose lines such as
    `Sources:` have not been accidentally absorbed into the row stream of a
    preceding table.

14. Run an accuracy sweep for unstable claims:

    - package versions and release dates
    - licences
    - Python-version support
    - product or API behaviour that may have changed

15. For the sweep, prefer primary sources:

    - official docs
    - official package metadata
    - official repositories

16. Where a claim is brittle, either verify it with an exact date or simplify
   the wording so it ages more gracefully.
17. Strip duplicated raw-URL appendices that some DOCX or PDF conversions emit
    after the real document content.
18. Finish with the validation surface that actually applies to the target doc
    estate. If the repo deliberately excludes that estate from markdownlint,
    use grep- and structure-based validation instead of forcing linting.

## Anti-Pattern

- Treating the markdown copy as trustworthy just because it looks structured
- Using the DOCX or pandoc output as the main prose source when the existing
  markdown already has the right document shape
- Turning a requested clean copy into a report *about* the document instead of
  preserving the document itself
- Summarising, condensing, or stylistically rewriting text that should simply
  be copied faithfully from the source
- Trusting PDF or DOCX export provenance without checking for lingering
  ChatGPT metadata or trackers
- Leaving escaped citation link text, broken block spacing, or duplicate raw
  URL appendices in what is supposed to be the clean copy
- Globally reassigning citations from heuristic matching and ending up with
  giant citation bundles or misattached links
- Treating a dumped PDF URL appendix as authoritative new references without
  comparing it to the DOCX relationship targets
- Rebuilding from a fresh conversion that worsens the document structure when a
  cleaner hand-curated markdown scaffold already exists
- Treating promotion, in-place overwrite, and sibling clean-copy output as
  interchangeable when the task has not declared which one is wanted
- Keeping vague, time-sensitive claims such as "recent" or "latest" without
  either verifying them or anchoring them to a concrete date

## When to Apply

Use this whenever a report originates from ChatGPT or another LLM export and
you need to turn it into a repo-quality markdown reference with durable links
and credible citations.
