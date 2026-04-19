---
name: chatgpt-report-normalisation
classification: passive
description: >-
  Recover ChatGPT-, deep-research-, or other LLM-exported reports from paired
  markdown, DOCX, and PDF copies into source-faithful clean markdown by
  copying content as faithfully as possible, repairing structure, and using the
  DOCX to repair real links.
---

# ChatGPT Report Normalisation

## Goal

Turn a report exported from ChatGPT, deep research, or another LLM into
source-faithful clean markdown that the repo can keep, review, and trust,
either in tracked canon or in an explicitly agreed repair lane.

Default to a **source-faithful clean copy**: preserve the original wording,
section order, and document shape unless a repair is required to restore links,
remove export artefacts, or fix broken markdown.

The intent is to **copy the report content as faithfully as possible** into
durable markdown. This is not editorial work, not summarising work, not a
rewrite, and not a synthesis task.

When both `.md` and `.docx` copies exist, the default protocol is:

- use the existing markdown file as the **primary source for structure and
  content**
- use the DOCX as the **primary source for recovering real hyperlink targets**
- use pandoc or PDF extraction only as secondary diagnostic lenses

This skill is for **repair**, not editorial rewrite or summary generation.

## Use This Skill When

- The user provides paired `.md`, `.docx`, or `.pdf` copies of the same report
- The markdown contains `cite`, `filecite`, `turn...`, or other internal
  export markers
- The DOCX appears to preserve live links that the markdown has lost
- The report currently sits in a scratch or import lane and needs either a
  clean sibling copy there or a later promotion into tracked canon

## First Principle

Treat the export as a recovery artefact, not as canonical source material.

Read `.agent/memory/patterns/chatgpt-report-normalisation.md` before making
structural decisions or choosing a rebuild strategy.

## Deliverable

- Keep the existing markdown scaffold unless it is genuinely broken beyond
  repair.
- Copy the source content as faithfully as possible.
- Preserve title, section order, wording, list shape, tables, and examples.
- Treat the markdown as the authority for paragraphing, headings, list rhythm,
  Mermaid/code fences, and comparison-table shape.
- Treat the DOCX as the authority for the real external URLs hidden behind
  broken export markers.
- **Always write to a new sibling clean file (`*-clean.md`).** The clean
  markdown is a **separate output path** created for this repair pass: do not
  rename the source file into the clean name, do not edit the source markdown
  in place, and do not replace an existing `*-clean.md` unless the task
  explicitly says to refresh that artefact.
- **Never overwrite the source markdown.**
- Limit changes to faithful-copy repair work: citation-link recovery,
  export-artefact removal, broken markdown repair, deduplicating obvious export
  junk, and light formatting cleanup.
- Render references using the **inline anchor + thematic `## References`
  table** convention (workflow step 6): inline citations become
  `[[N]](#ref-N)` and the bibliography lives at the bottom of the file
  grouped by source family.
- **The clean file contains the report and its references table only.** The
  citation-set audit (workflow step 7) is recorded in the agent's napkin,
  not embedded in the clean output. The clean file should read as a faithful
  copy of the report; meta-information about the recovery pass does not
  belong inside it.
- The deliverable from this skill is the clean copy itself, not a report about
  the document.

## Workflow

1. Inventory the available copies.
   - When a paired `.md` and `.docx` both exist, treat the markdown as the
     read-only structural source scaffold.
   - Prefer the `.docx` for hyperlink recovery, not for rewriting the text.
   - Prefer the existing markdown if its structure is already better than a
     fresh conversion.
   - Use the PDF only as a verification surface for missing or ambiguous
     fragments; do not let PDF extraction re-drive structure or section order.

2. Inspect the strong layers with local tools.
   - `textutil -convert txt -stdout report.docx` for visible text
   - `unzip -p report.docx word/_rels/document.xml.rels` for hyperlink targets.
     For ChatGPT deep-research exports the `_rels` file lists the **canonical
     citation URL set** — empirically (Sentry/PostHog 2026-04-19) it agrees
     with the PDF link annotations and the ChatGPT Sources panel exactly. Use
     it as the URL-set authority and as a sanity check against pandoc.
   - `pandoc report.docx -t gfm` as the **canonical positional layer** for
     ChatGPT exports — this converts the DOCX body into markdown with
     numbered `[[N]](URL)` citation links at the correct text positions, so
     it tells you **where** each citation belongs in the prose. The URL set
     pandoc emits should be a subset of (and in healthy cases, equal to)
     the DOCX `_rels` set after deduplication.
   - If `pandoc` emits a trailing horizontal-rule or raw-URL bibliography
     dump, treat only the body before that dump as the usable citation surface
     unless a link is uniquely recoverable there
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

   **Critical: Unicode Private Use Area encoding.** ChatGPT exports wrap
   citation markers in invisible Unicode PUA characters:
   - `U+E200` — start of citation block
   - `U+E202` — separator between individual turn references
   - `U+E201` — end of citation block

   These characters are **invisible** in most editors, terminals, and the Read
   tool. A line that appears as `citeturn4view0turn2view0` is actually
   `\ue200cite\ue202turn4view0\ue202turn2view0\ue201`. Standard text grep
   for `citeturn` will fail. Use `cat -v` or `python3 -c "print(hex(ord(c)))"
   inspection to detect them, or match on the PUA range
   `[\ue200-\ue2ff]` in regex.

3. Choose the canonical editing target.
   - The editing target is a **new** source-faithful clean sibling copy
     (`*-clean.md`) on disk, not a mutating pass over the export markdown.
   - In the normal paired-export case, always preserve the original markdown
     untouched and write repairs into the sibling clean file.
   - Keep the markdown's section order, paragraphing, tables, lists, Mermaid
     blocks, and local prose rhythm whenever they are already readable.
   - Use the DOCX relationship table and, if needed, pandoc output as a lookup
     layer for recovering which real URL belongs behind each broken marker in
     the markdown.
   - If the repo already has a readable markdown scaffold under
     `.agent/research/`, `.agent/reference/`, or another tracked doc estate,
     use it as the structural source and emit a sibling clean copy.
   - If the current copy sits in an ignored staging lane, keep source inputs
     untouched and write the clean sibling copy in the same lane unless the
     task explicitly requests promotion.
   - Do not replace a better hand-edited structure with a worse direct
     conversion.
   - Do not promote a DOCX-first or pandoc-first rebuild over an existing
     markdown scaffold just because the conversion surfaces more links.

4. Remove export artefacts explicitly.
   - Delete internal citation markers such as `cite`, `filecite`, and
     `turn...`
   - Replace or remove `entity` markers as plain visible text
   - Remove `image_group` and similar non-markdown export artefacts
   - Strip tracking parameters such as `utm_source=chatgpt.com`
   - Remove generic export metadata unless it is useful provenance

5. Restore attribution in durable markdown form.
   - Repair citations **in the existing markdown scaffold**, not in a fresh
     conversion.
   - Preserve the document's existing citation rhythm where possible.
   - Replace each broken marker with the specific recovered link that belongs
     at that point in the markdown.
   - Replace broken inline markers with inline linked citation numbers before
     escalating to heavier editorial structures.
   - **Citation markers are not stable keys.** The same `citeturn4view0`
     marker can appear at multiple document positions mapping to completely
     different numbered citations. Do not build a marker-to-URL lookup table.
     Use **positional matching**: for each marker, find the preceding text
     context in the pandoc conversion and extract the citation(s) that follow
     that context.
   - **Use full-text search, not line-by-line matching.** Pandoc wraps long
     paragraphs and list items across multiple lines, so the context you need
     may span pandoc line breaks. Join or normalise whitespace in the pandoc
     text before searching.
   - **A single citation block can map to multiple consecutive citations.**
     Some `citeturnXturnYturnZ` blocks correspond to grouped citations like
     `[[6]](url1)[[7]](url2)` in the pandoc output. Extract all consecutive
     citations at each matched position, not just the first.
   - When recovered numeric citations come from DOCX or pandoc output,
     normalise them to readable markdown such as `[[12]](https://example.com)`
     rather than leaving heavily escaped link text in the final copy.
   - If pandoc or a DOCX conversion attaches a recovered URL directly to a
     visible entity name instead of the broken citation-marker position, treat
     that link as suspect. Keep the entity text plain unless the source truly
     supports inline linking there.
   - Do not globally remap the whole document's citations from pandoc output if
     the markdown already has a stable local citation rhythm.
   - Do not attach broad bundles of recovered links to one sentence just
     because they were adjacent in the DOCX export.
   - Do not add new citations to previously uncited prose unless needed to
     repair a broken citation.
   - Prefer local relative links for repo artefacts
   - Use direct site URLs for external sources, de-noised and stable

6. Render references as a deduplicated table at the end of the clean file.

   The default output convention is **inline anchor links + a thematically
   grouped `## References` section**, not full URLs sprinkled inline.
   Recipe:

   - Walk the recovered inline citations in document order. Build an ordered
     map of unique URLs (after `utm_*` stripping), assigning the **first**
     occurrence the next ref number `N`.
   - Replace each inline citation with `[[N]](#ref-N)` so the same URL at
     three positions reuses the same number — the reader can see reuse.
   - Append a `## References` section at the bottom of the clean file with
     thematic subsections grouping refs by source family (e.g. *Sentry
     product documentation*, *PostHog pricing*, *Third-party reviews &
     community*). Each entry is a single line:
     `- <a id="ref-N"></a>**[N]** <https://full.url/>`.
   - Do **not** add a `### Recovery notes` block, diagnostic counts, or any
     other meta-commentary about the recovery pass to the clean file. The
     clean file is a faithful copy of the report; the audit lives only in
     the agent napkin (step 7).
   - Theme groups are content-driven: pick obvious source families for the
     report at hand. Order groups so the report's primary subject leads.
     Within a group, sort by ref number (which preserves first-occurrence
     order in the prose).
   - Do not invent titles, authors, or dates that are not present in the
     source. URL alone is honest; titles require an explicit verification
     pass which is out of scope for the repair-only skill.
   - This convention applies whether the inputs gave many distinct URLs or
     few — heavy reuse is itself information, and the bibliography makes it
     visible.

7. Audit the citation set and record the diagnostic in the agent napkin.

   Before closing, run a citation-set audit and record it in
   `.agent/memory/napkin.md` (today's session entry). This is required
   tooling hygiene, not part of the deliverable: the clean file stays a
   faithful copy of the report; the audit is agent-side meta-information
   that helps the next normalisation pass detect anomalies quickly.

   Diagnostic counts to record:

   - count of `turn…` (or equivalent internal-search) refs in the source
     markdown, plus unique count — these are the model's internal
     search-result identifiers, not citations in their own right
   - count of citation blocks at distinct prose positions in the source
     markdown
   - count of unique external URLs in the DOCX `_rels`
     (`unzip -p ... word/_rels/document.xml.rels`)
   - count of unique URI annotations in the PDF if a PDF is present
     (extract via `pypdf` annotations, ignoring obvious export-branding
     footer links such as `https://chatgpt.com/?utm_src=deep-research-pdf`)
   - count of numbered citations the body emitted, and how many unique
     URLs they map to after deduplication

   For ChatGPT deep-research exports, the empirically established
   relationship across multiple normalisation passes is:

   - the source-markdown `turn…` set is the **wide search funnel** — sites
     consulted during research; this number is typically much larger than
     the citation set
   - the DOCX `_rels` URL set, the PDF annotation URI set (minus
     export-branding footer links), and the ChatGPT Sources panel for the
     conversation **all agree** on the **selected citation set** — the
     supporting-evidence / further-reading list
   - so the URL count is **not a recovery ceiling representing loss**; it
     is the canonical citation set the model chose. The funnel from many
     `turn…` refs down to fewer cited URLs is the source's editorial
     selection step, not a pandoc or DOCX rendering bug

   In the napkin entry, state the four counts and one sentence on whether
   the three citation surfaces agree. **Disagreement** between DOCX `_rels`,
   PDF annotations, and Sources panel is the real signal worth surfacing
   and acting on — not the funnel ratio. If they all agree, record that
   agreement plainly so the next pass starts with a known-good baseline.

8. Keep the repair faithful; do not run an editorial or factual sweep.
   - Normalisation is a repair task, not an analysis pass.
   - If factual updates are needed, raise a follow-on task explicitly.

9. Finish with a short editorial pass.
   - Preserve tables, code fences, Mermaid blocks, and list structure
   - Restore markdown block boundaries around headings, lists, and tables after
     automated conversion; pandoc-style exports often collapse these and make a
     clean copy look broken
   - Ensure narrative lines such as `Sources:` do not get absorbed into the row
     stream of a preceding table
   - **Clean up double spaces** left by PUA marker removal — stripping
     `\ue200...\ue201` blocks often leaves double spaces at the replacement
     boundary (but do not collapse intentional indentation inside code fences
     or Mermaid blocks)
   - Match repo conventions such as British spelling when they apply
   - Do not rewrite claims for freshness; preserve source wording.
   - Summarise unresolved repair ambiguities rather than hiding uncertainty.

10. Run local validation on the final markdown.
   - Use the repo-appropriate markdown validation surface for the edited file
     or files. If the target doc estate intentionally excludes markdownlint,
     use structural validation instead of forcing it.
   - **Structural parity vs the structural baseline:** before the automated drift
     proof, compare the **new** `*-clean.md` to the **primary structural source**.
     When a source `.md` exists, that baseline is the original markdown
     scaffold: same heading sequence and depth (ATX `#` lines), same overall
     section order, and no missing or merged tables, lists, code fences, or
     Mermaid blocks relative to what you started from. When **no** source `.md`
     exists, agree an explicit baseline first (for example the pre-bibliography
     `pandoc` body) and apply the same outline checks against that baseline.
     Use a side-by-side outline diff or extracted heading lists if that makes
     gaps obvious. Structural repair is allowed only where the baseline was
     already broken; otherwise mismatches mean content was lost or reordered and
     must be fixed before closing.
   - Grep for leftover `cite`, `filecite`, `turn...`, and
     `utm_source=chatgpt.com` markers when the export started noisy
   - Scan for remaining PUA characters (U+E200 to U+E2FF range) — these are
     invisible to normal grep and the Read tool but remain in file bytes
   - Apply the same normalisation function to both files for drift proof:
     `strip_citations(text)` removes PUA citation blocks/marker artefacts from
     the baseline markdown and removes `[[N]](URL)` citations from clean markdown.
     Then normalise whitespace and confirm the two texts are
     character-identical. Treat this drift proof as the **body-text** loss check
     after citation normalisation; it does not replace the structural outline
     comparison above.

## Validation

Before closing the task, confirm:

- No `cite`, `filecite`, or `turn...` markers remain
- No `utm_source=chatgpt.com` trackers remain
- No Unicode PUA characters remain (U+E200 to U+E2FF range)
- No duplicated raw-URL appendix from DOCX or PDF export artefacts remains
- No double spaces from marker removal remain (except inside code/Mermaid
  fences)
- Every footnote used in the body is defined
- Tables are still real markdown tables, and adjacent prose has not been
  accidentally pulled into them
- Citations are mechanically sound: each repair sits at the intended
  export-marker position, there are no obvious misattached links or giant
  citation bundles, and unresolved placement is visible in the clean copy
  rather than silently guessed
- Inline citations use the `[[N]](#ref-N)` anchor form and every `N` resolves
  to a single `<a id="ref-N"></a>` entry in the `## References` section
- The clean file contains the report and its thematic `## References` section
  only — no `### Recovery notes` block, no diagnostic counts, no other
  meta-commentary about the recovery pass
- The citation-set audit (source-`turn…`, DOCX `_rels`, PDF annotation, and
  body-emit counts, plus a one-line statement about whether the three
  citation surfaces agree) is recorded in `.agent/memory/napkin.md` for the
  current session
- Structural parity confirmed against the agreed baseline (normally the source
  `.md` scaffold): heading outline, section order, and block-level shape
  (tables, fenced code and Mermaid blocks, major list structures) match except
  where the baseline was already irreparably broken and that scope was agreed
- Text identity confirmed: baseline markdown (source `.md` when present, or the
  agreed markdown stand-in for drift proof) and `*-clean.md` pass the same
  strip/normalise comparison and are character-identical
- The cleaned output was written to a **new** sibling `*-clean.md` file while
  keeping the original markdown unchanged

## Guardrails

- Do not mistake a repair task for a rewrite task.
- Do not summarise, condense, paraphrase, or otherwise editorialise content
  that can be copied faithfully from the source.
- Do not treat the DOCX as the canonical text when a workable markdown scaffold
  already exists.
- Do not let pandoc output override a stronger existing markdown structure.
- Do not trust the markdown copy just because it looks structured.
- Do not turn the clean-copy task into a report or synthesis about the
  document.
- Do not trust the DOCX or PDF provenance without checking for lingering LLM
  artefacts.
- Do not rebuild citation numbering globally from heuristics if local
  marker-by-marker repair is possible.
- Do not describe the funnel from many `turn…` refs down to fewer cited
  URLs as "loss" or as a "recovery ceiling". For ChatGPT deep-research
  exports, the DOCX `_rels` URL set, the PDF annotation URI set, and the
  ChatGPT Sources panel agree on the canonical citation set; the wider
  `turn…` set is the model's internal search funnel and was never the
  citation set. Treat disagreement between those three surfaces as the
  real signal, not the funnel ratio.
- Do not invent titles, dates, or source descriptions for the references
  section that are not present in the inputs. Bare URLs are honest.
- Do not leave full external URLs sprinkled inline in the prose when the
  references-table convention applies — the inline form is `[[N]](#ref-N)`
  and full URLs live in the `## References` section.
- Do not embed the citation-set audit, diagnostic counts, or any
  `### Recovery notes` block inside the clean file. The clean file is a
  faithful copy of the report plus its references table; the audit is
  agent-side meta-information that belongs in the napkin only.
- Do not build a marker-string-to-URL lookup table — the same `citeturn`
  marker string maps to different citations at different document positions.
  Always use positional context matching against the pandoc conversion.
- Do not match citations line-by-line against pandoc output — pandoc wraps
  long lines, so the same paragraph or list item may span multiple pandoc
  lines. Use full-text or paragraph-level matching with normalised whitespace.
- Do not treat a PDF's dumped raw-URL appendix as authoritative new references
  until you confirm they are not just line-break or truncation variants of
  links already recoverable from the DOCX.
- Do not leave a detached references dump if inline attribution would make the
  document clearer.
- Do not introduce GitHub blob links when a repo-local path is the canonical
  target.
- Always emit a **new** sibling `*-clean.md` output (separate path). When an
  export `.md` exists, never overwrite it in place. Compare the clean file’s
  structure to the agreed baseline before finishing, and leave DOCX/PDF inputs
  unchanged unless the task explicitly allows mutating them.

## Escalate

If link recovery or citation placement is still ambiguous after comparing the
markdown, DOCX, and PDF, say so explicitly and preserve the uncertainty in the
final document.
