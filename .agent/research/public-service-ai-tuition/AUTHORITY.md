# Authority and status (OCE-side)

This file is authored in this repository and is not part of the imported collection. It states
what the collection's location confers, records the owner's rulings that bear on it, and lists
every delta between the imported bytes and the files in this directory. The collection's README
and chapters are the author's record and keep their source bytes except as listed below.

## What placement confers

- The collection is imported research under ADR-226: a faithful public projection of an
  externally completed record. Placement in `.agent/research/` confers no ratification of the
  work programme chapter 13 proposes, of the kernel-and-profile architecture chapter 01 files
  under its governing constraints, or of any direction the README calls settled; strategy
  authority lives in `docs/strategy/`, plan authority in `.agent/plans/`.
- Two dated reviews qualify the collection and are the record of its known corrections: the
  author-lineage review
  [`pr-66-review-2026-09-06.md`](../../reports/public-service-ai-tuition/pr-66-review-2026-09-06.md)
  (R1 to R7) and the independent review
  [`pr-66-independent-review-2026-09-06.md`](../../reports/public-service-ai-tuition/pr-66-independent-review-2026-09-06.md)
  (F1 to F9, with the mapping of R1 to R7: five accepted, two narrower than published, none
  refuted). Read the affected passages with those qualifications.
- Supersession pointer (R4): chapter 08 Appendix G preserves the 29 August Eve investigation; its
  successor in this repository is
  [`eve-mcp-agentic-chat-experience-2026-08-30.md`](../innovation-kit/eve-mcp-agentic-chat-experience-2026-08-30.md),
  which reframes that experiment as one member of a portfolio.
- Reading route (F9): chapter 13 links every substantive chapter except 05 (inclusion and human
  service) and 06 (state, rights and context); a builder following chapter 13's routes reaches
  the access, safeguarding and rights conditions only through those two chapters.

## Owner rulings that bear on the collection (2026-09-07)

- The historical probe runner follows the standing policy (ADR-226 clause 4 and the
  TypeScript-only rule): "Apply the standing policy", with no research-record exemption class.
  Applied as reduction to data; see the deltas below.
- The nine `oaknational` repositories the collection permalinks into are all public (read once at
  the owner's permission; `oak-dspy-mcq-eval` is archived), so every permalink stays live under
  ADR-226 clause 2; the 26 unpinned links remain a pinning concern for the source.
- The directions the README calls settled are proposals, not ratified (owner ruling 2026-09-07
  ~13:2xZ on the Director's card, verbatim option "No, they are proposals"; posted on PR 66 as
  comment 5571197335). Nothing in the collection is ratified by its own README; every direction,
  including those labelled settled, is tested against this estate's ratified structure
  (principles, ADRs, PDRs, rules). Chapter 12 §14's own grading (relayed continuity excerpts) was
  the correct reading of the sources. The sites that carry the flat wording, for the author's
  source: README:24; 01:15–16; 03:194; 04:363; 07:326 and 07:354; 09:3; 12:29–35; 13:3.

## Second-pass pointers (substance review, 2026-09-07)

The substance review (Cricket weaves Burrow, f8f302) is posted on PR 66 as reviews 5132463698
and 5132534231 and recorded in the independent review's "Second pass" section. Its claims about
this repository were tested at the `engraph` tip SHA:6e9d67216. Pointers a reader needs beside the
chapters:

- Supersession (chapter 13 §5, 08:126 and Appendix J1, the EEF renderers): true at the
  collection's later pin SHA:f1a14284; superseded at SHA:6e9d67216 by PR #58, which lands the two
  pure renderers and the file-set function under
  `packages/sdks/graph-corpus-sdk/src/eef-strands/` (`eef-strand-markdown.ts`,
  `eef-corpus-reference-markdown.ts`, `eef-markdown-files.ts` and their tests). EEF registration
  in the HTTP app stays dormant.
- Supersession (13:27 and 12:31, registry publication as a "distribution choice, conditional on
  consumer need"): overtaken on this line by
  [ADR-227](../../../docs/architecture/architectural-decisions/227-oak-product-in-its-own-repository.md)
  (accepted 2026-09-03), which makes publishing on the `@oaknational` scope an obligation of the
  extraction lane; `.releaserc.mjs` still reads `npmPublish: false`, as chapter 07's B21 states.
- Standing (08:168, 08:124 and Appendix B, "Oak application extraction is top priority in the Oak
  fork, not necessarily Engraph"): the strategy index at the tip
  ([`docs/strategy/README.md`](../../../docs/strategy/README.md)) states extraction as this
  repository's current first structural priority at the owner's 2026-09-03 word, recorded in
  ADR-227; the collection's reading is a relayed owner-context excerpt.
- Chapter 08's engineering claims: every one re-checked at the tip holds (the P1–P11 probe
  statements by zero drift on the runner-loaded paths from SHA:31e76a72; the audit's counts,
  boundaries and register claims by direct reads); one wording slip in Appendix J1 (four
  `.gitignore` lines were added, of which one contains `/visitors/`). The full table is in the
  report.

## Current-state pointers (2026-09-08)

The dated
[`oak-curriculum-infrastructure-delta-2026-09-08.md`](../../reports/public-service-ai-tuition/oak-curriculum-infrastructure-delta-2026-09-08.md)
qualifies current use of chapter 08's historical Oak/OCE observations without changing its
source bytes. Upstream OCE `1.178.6` restores authored order at the
`get-thread-progressions` boundary; Engraph's default branch was at `1.178.5` when the
report was written and incorporated `1.178.6` through the sync named in the report's
reopening addendum (9 September 2026) and `1.181.1`, which corrects the
misconception-graph consumer, through the sync named in the 10 September 2026 addendum;
synthetic prerequisite-labelled edges and a reproducible retained bulk input remain open. The sync to `1.185.0`
(20 September 2026) changed neither surface: its only edits to the two graph end-to-end checks
remove a landing-page option the application no longer takes. Oak Curriculum API `0.11.1` separately fixes
Combined Science validation in the external API repository. Read the report for the exact
version identities, evidence limits and reopening triggers.

## Deltas from the imported bytes

Imported at PR 66 head `2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa`. The collection's files are
byte-identical to that revision except:

| File | Imported blob | Delta | Why |
| --- | --- | --- | --- |
| `assets/oce-core-graphs-atoms-probes-2026-09-06.mjs` | `795808186a4c215909aee2fa7994803d63302612` | removed as an executable; its exact text is preserved as [`assets/oce-core-graphs-atoms-probes-2026-09-06.md`](assets/oce-core-graphs-atoms-probes-2026-09-06.md) | ADR-226 clause 4 and the TypeScript-only rule; owner ruling 2026-09-07 |
| `README.md` | `75b33edf1e960205abc2eb5b93989b7bad6a7187` | the assets-table row for the runner links the listing and names it a listing | the link must resolve (the markdown-links gate) |
| `08-oce-audit-and-engineering-findings.md` | `f16705455d1f91a2ffa49f7c3bad382d6f6c3d26` | §7's "original runner" link points at the listing; the fenced rerun command is unchanged | the link must resolve; the command is the historical instruction the listing explains |

Everything else in this directory is the imported byte. A later revision of the source collection
enters as a new import, never by editing these files in place.
