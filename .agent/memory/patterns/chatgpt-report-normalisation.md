---
name: "ChatGPT report normalisation"
use_this_when: "Recovering an LLM-exported report from markdown, DOCX, and PDF copies into durable repo-quality markdown"
category: process
proven_in: >-
  pythonic-algo-approaches clean-up, Oak multi-export report consolidation,
  and architecture reference report normalisation (2026-03-20 to 2026-04-10)
proven_date: 2026-04-10
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

The **chatgpt-report-normalisation** skill defaults to a **new** sibling
`*-clean.md` and leaves any export `.md` untouched on disk (see
`.agent/skills/chatgpt-report-normalisation/SKILL.md`). Promotion into tracked
canon, mutating DOCX/PDF inputs, or in-place repair of raw markdown belongs in
an **explicitly scoped** task outside that default — do not treat those patterns
as interchangeable with the skill’s normal workflow.

In the common paired-export case, the strongest surviving layer is usually:

- the existing markdown for structure and content
- the DOCX (via `pandoc` conversion) for the real external links — the DOCX
  rels file often contains very few URLs in ChatGPT deep-research exports;
  the pandoc conversion is the primary citation recovery surface

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
5. Repair citations by **positional context matching** against the pandoc
   conversion rather than globally remapping. Citation markers like
   `citeturnXviewY` are not stable keys — the same marker string maps to
   different citations at different document positions. For each marker, find
   the preceding text context in the full pandoc text (normalised whitespace,
   not line-by-line) and extract the consecutive citation(s) that follow.
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
   - internal citation markers such as `cite`, `filecite`, and `turn...`
   - Unicode PUA wrapper characters (U+E200 start, U+E202 separator, U+E201
     end) — these are invisible in editors and the Read tool but persist in
     file bytes; use `cat -v` or Python `ord()` to detect them
   - entity/image export markers such as `entity` and `image_group`
   - tracking parameters such as `utm_source=chatgpt.com`
   - generic export metadata where relevant
   - double spaces left by PUA marker removal (except inside code fences)
9. Output path and loss checks (mirror the skill workflow):
   - Emit a **new** sibling `*-clean.md` (separate path). Do not edit the export
     `.md` in place when one exists — full rules in the skill Deliverable and
     Guardrails.
   - Before closing, compare that clean copy’s **structure** (heading outline,
     section order, tables, fences, major lists) to the **primary structural
     baseline** (usually the source `.md`; if there is none, use an agreed
     baseline such as the pre-bibliography `pandoc` body) so nothing was dropped
     or reordered during repair.
   - Run the citation-stripped `strip_citations` + whitespace-normalise drift
     proof between that baseline markdown and `*-clean.md` as in the skill
     workflow step 8 — the outline check does not replace this body-text
     guardrail.
   - Promote into tracked canon only when the task actually includes promotion.
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

14. Optional follow-on (only when the task explicitly asks for verification, not
    part of the core repair-only skill): run an accuracy sweep for unstable
    claims — package versions and release dates, licences, Python-version
    support, product or API behaviour that may have changed. Prefer primary
    sources (official docs, package metadata, repositories). Where a claim is
    brittle, either verify it with an exact date or simplify the wording so it
    ages more gracefully.
15. Strip duplicated raw-URL appendices that some DOCX or PDF conversions emit
    after the real document content.
16. Finish with the validation surface that actually applies to the target doc
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
- Building a citeturn-marker-to-URL lookup table — the same marker string
  maps to different citations at different positions; use positional matching
- Matching line-by-line against pandoc output when pandoc wraps long lines;
  use full-text search with normalised whitespace
- Leaving invisible PUA characters in the clean output
- Treating a dumped PDF URL appendix as authoritative new references without
  comparing it to the DOCX relationship targets
- Rebuilding from a fresh conversion that worsens the document structure when a
  cleaner hand-curated markdown scaffold already exists
- Treating promotion, in-place overwrite of export markdown, and the skill’s
  default new sibling `*-clean.md` output as interchangeable when the task has
  not declared which one is wanted
- Keeping vague, time-sensitive claims such as "recent" or "latest" without
  either verifying them or anchoring them to a concrete date

## When to Apply

Use this whenever a report originates from ChatGPT or another LLM export and
you need to turn it into a repo-quality markdown reference with durable links
and credible citations.
