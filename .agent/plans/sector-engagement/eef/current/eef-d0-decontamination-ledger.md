# EEF D0 — Estate Decontamination Ledger

**Captured**: 2026-05-30, by Opalescent Transiting Prism (`claude-code`,
session `73491c`), executing D0 of
[`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md).

**Purpose**: record every decontamination hit across the EEF plan estate and
non-plan documentation, with its disposition, so D0's "decontaminate EEF plans
and docs" deliverable is auditable and complete. This file is also the working
provenance for the **withdrawal of ADR-175** (the permanent provenance is the
git commit that deletes the record and removes its inbound references; the ADR
README's `Withdrawn` lifecycle entry carries the durable convention).

## The discarded tokens

D0 corrects the known-vs-unknown data doctrine. The tokens that are no longer
valid as **current-truth** framing for the EEF corpus:

- `data-export-must-be-unknown`, `no-unknown-data-export`, "must export …
  `unknown`" — the two erroneous validator rules (and the validator itself).
- a Zod loader / Zod validation / "schema drift" check **over the EEF corpus**
  (the corpus is a fully-known `as const` constant; Zod over known data is type
  destruction, not validation).
- a **freshness gate / ADR-175** over the corpus (a stale-data automated gate
  over repo-held known data; ADR-175 withdrawn).
- `gate-1a` / `gate-1b` as a **live** delivery contract (superseded by the
  impact-led D0–D7 plan).

## Disposition rule

The discriminator per hit is **current-truth framing vs historical record**:

- **Current-truth** (this is how the system works / what is live now) →
  **correct or remove**. Existence is not correctness; in remediation the
  default verb is replace.
- **Historical record** (this is what we used to do / what was preserved /
  what was diagnosed as wrong) → **preserve**
  (`knowledge-preservation-over-fitness-warnings`). Stripping it destroys the
  record.

Scope boundaries (per the plan): EEF **code** tokens are covered by the later
D-step that deletes their files (D2/D5/D6); `gate-1a/1b` in **non-EEF** graph
plans is owned by `graph-estate-consolidation`; `archive/`, comms logs, and
memory archives are history-retained and untouched.

## Ledger — LIVE corrections landed in D0 (Commit 2)

| Target | Hit | Disposition |
|---|---|---|
| `docs/architecture/architectural-decisions/038-compilation-time-revolution.md` | doctrine scoped to OpenAPI-derived files only | **Generalised** in a dated Amendment Log: the compile-time-known `as const` discipline applies to any fully-known constant incl. repo-held corpora; houses the external≠unknown vocabulary contrast; cites the `unknown-is-type-destruction` rule as linchpin (ADR-034 as the ADR it operationalises), ADR-153 (predicate), ADR-028 (corroborating). EEF corpus named as worked instance. |
| `…/157-multi-source-open-education-integration.md` | Typing Discipline EEF bullet (both Zod sentences); Trade-offs Zod sentence; Related ADR-175 link; Status Amendment Note ADR-175 "binding" paragraph | **Corrected** to `as const` derivation pointing at ADR-038; **both ADR-175 refs removed**. Whole ADR NOT marked superseded (correct — still Proposed). |
| `…/173-graph-stack-topology.md` | "Zod loader" / "Zod-validated loader" in **four** locations (l.50 amendment summary, l.246 First-wave intro, l.258 First-wave item, l.320 Consequences) | **Corrected** to typed direct-load / `as const` derivation. NB: the plan enumerated three + the ADR-157 cross-ref; the **l.246 intro instance was an additional, un-enumerated hit** caught by recomputing the full estate. The ADR-157 §Typing Discipline cross-ref now points at corrected content and remains consistent. |
| `…/architectural-decisions/README.md` | ADR-175 Index entry (l.226–229); ADR-175 Key-Decisions entry (l.284); lifecycle vocabulary | Index + Key-Decisions entries **removed** (no dangling links). **`Withdrawn` added** to the lifecycle vocabulary as a general status (file deleted, number retired and never reused, gaps indicate a withdrawal, rationale recoverable from version control, no tombstone kept). |
| `docs/architecture/README.md` | ADR-175 index entry (l.75) | **Removed.** |
| `docs/governance/sonar-disposition-policy.md` | "MUST export … typed `unknown` … checked by the `validate-external-data-files` repo-validator" (cpd class, l.357); "Contract enforced by the `validate-external-data-files` repo-validator" (Block 2, l.450) | **Corrected**: the `.external-data.ts` contract is pure-data (provenance docstring + no exported logic; types derived from the `as const` data, never `unknown`), kept by review when the snapshot changes — not an automated gate. Consistent with the Commit 1 change to `sonar-project.properties`. |
| `.agent/plans/sector-engagement/eef/README.md` | frame presented the quarantined `eef-evidence-corpus`/`eef-delivery-restructure`/`eef-first-feature` estate as CURRENT (4 dangling `current/` links); 2 dangling ADR-175 links + withdrawn freshness framing; gate-1a current-truth; 5-increment table deep-linked into volatile non-EEF plans; 3 dead `exploring-open-education-resources/` deep-links | **Frame rewritten** (`replace-dont-bridge`): leads with the one live plan, links only to EEF-owned artefacts + stable directories, ADR-175 removed, freshness-gate framing withdrawn, gate-1a current-truth removed. Stable content preserved verbatim (Why, Scope, Snapshot-validation history, Credits, Foundation Documents). |
| `.agent/plans/sector-engagement/eef/reference/conservation-map.md` | historical preservation map of a since-superseded restructure | **Preserved** (`knowledge-preservation`); added a one-line "historical record (do not action)" note at top. Its gate-1a/Zod content is the historical record, not current-truth — **not stripped**. |
| `.agent/memory/operational/repo-continuity.md` | "expunge the two erroneous external-data validator rules" (l.175–176) | **Corrected** to the validator-deletion + D0-in-execution current-truth. |
| `.agent/memory/operational/threads/eef.next-session.md` | EXECUTION UPDATE banner | Already current-truth-accurate (updated earlier this session). Superseded history below the banner = history-retained, untouched. |
| `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts` | provenance docstring tail carried a live `gate-1b refresh script` reference (a superseded list-era delivery contract); the prior session decontaminated the header but missed this line. Found by the 2026-05-31 intent-vs-letter audit. | **Corrected** the `gate-1b` line to a clean forward-looking refresh note. D0 owns this file (its data-file-cleanup step makes it pure data with a clean provenance docstring); deferring a known live contamination to D2 is exactly what the Non-Goals forbid. The neighbouring "Direction" note (loader still Zod-parses, under active removal — accurate current-truth) was kept. Lands in the code commit. |
| `.agent/plans/sector-engagement/roadmap.md` | named in §Estate Decontamination (plan l.399) as a D0 direct-correction surface | **Swept; zero hits** against any discarded token (`gate-1a`/`gate-1b`, `ADR-175`, freshness, Zod-over-corpus, `data-export-must-be-unknown`). No edit required — recorded so the named surface has an explicit disposition. |

## Covered by a later D-step (NOT D0)

| Token / artefact | Covered by |
|---|---|
| `freshness.ts` (incl. its 2 ADR-175 code comments), `checkFreshness`, `DEFAULT_THRESHOLD_DAYS` | **D5** (freshness/loader/cap removal) |
| `loader.ts` (incl. its 2 ADR-175 code comments), Zod parse at load | **D2/D5/D6** (typed direct-load; loader removal) |
| `index.ts` docstring (ADR-175 freshness-gate line; Zod-loader framing) | **D5** (co-lands with the freshness/loader deletion — the docstring is accurate while that code still exists) |
| `strand-schema.ts` (`EefStrandSchema`/`EefToolkitSchema`), `school-context.ts` Zod | **D2** (re-home `EefStrand`); **D5** (physical schema deletion co-lands with loader) |
| `gate-1a`/`gate-1b` framing in **surviving** EEF SDK code comments (e.g. `types.ts` l.2 "gate-1a delivery", `freshness.ts` l.20 "gate-1b refresh script") | corrected by the deliverable that rewrites/deletes each file (**D2/D4/D5/D6**) per the plan's §Estate Decontamination; most sit in files D5/D6 delete outright. NB: the corpus file's `gate-1b` line was the exception — D0 owned that file's edit, so it was corrected in D0 (above), not deferred. |

These are **code** comments/symbols, not markdown links — they reference
"ADR-175" in prose but do not link to the deleted file, so they trip no
link-integrity gate. They are deleted with their files in the named D-step.

## Out of scope (other owners)

- `gate-1a`/`gate-1b` in **non-EEF** graph plans (`graph-mvp-arc`,
  `graph-portfolio-index`, `graph-combinatorial-arc`,
  `connecting-oak-resources/*`) → owned by `graph-estate-consolidation`.
- Dangling links to **moved non-EEF locations**
  (`exploring-open-education-resources/`, deep-links into non-EEF plan files) →
  not EEF's remit; the EEF README no longer deep-links them.

## History-retained (NOT touched)

`archive/` (incl. `eef-evidence-corpus`, `eef-delivery-restructure`,
`eef-first-feature`, the graph-tooling-rebuild design docs),
`shared-comms-log.md`, `closed-claims.archive.json`, comms JSON,
napkin/distilled memory, CHANGELOG.

## Verification (2026-05-30)

- ADR-175 markdown links across the repo (excl. `archive/`): **zero**.
- "Zod" in ADR-038/157/173: every remaining hit is OAK-API Zod codegen or the
  new known-vs-unknown doctrine/prohibition text — **no EEF-corpus-Zod
  current-truth**.
- `validate-external-data-files` outside the plan/continuity/history: **zero**.
- `pnpm markdownlint-check:root` (repo-wide): **exit 0**.
- Adversarial review (3 dimensions — docs-adr-expert + decontamination
  completeness + doctrine accuracy): **completeness PASS (zero misses);
  doctrine + docs-adr PASS-with-nits.** Two doctrine nits in the new text were
  grounded against the code/ADRs and fixed: (1) the ADR-038 worked-instance was
  reworded so it no longer reads as a claim that the whole corpus is already
  `typeof`-typed — the canonical `EefStrand` is still `z.infer` until D2, the
  foundation module is the exemplar, and the rest migrates; (2) the imprecise
  "key-narrowing" wording was replaced with ADR-153's actual constant-type-
  predicate (`value is T`) vocabulary.
- Remaining D0 acceptance (owner-gated): full `pnpm check` green, then the
  Commit 1 and Commit 2 commit.

### Intent-vs-letter audit (2026-05-31, owner-requested)

A 4-dimension adversarial audit (letter / intent / conservation-reflex /
cross-session coherence) compared D0's intent to the work across both sessions.
**Verdict: intent substantially met** — the gate was greened by DELETION (not by
retyping the corpus to `unknown`), the corpus is typed by derivation, and the
doctrine is coherent across the ADR estate. It found, and this pass closed, the
residue of one root cause — the owner's validator-deletion reshape was recorded
only in the EXECUTION STATUS note and not propagated:

- **Shipped-code `gate-1b` contamination** in `eef-toolkit.external-data.ts`
  (provenance docstring tail) — **corrected** (row above).
- **Plan staleness** — the "keep two rules" / "validator unit tests" framing left
  live in Ratified Decision 3, the frontmatter step (7), the "Do — validator
  expunge" step, and the "Done when" acceptance criterion + Proof line — the
  EXECUTION STATUS enumeration was extended to name all of them, an inline
  supersession marker added to Decision 3 and the "Do — validator expunge" step,
  and the false acceptance criterion + Proof line corrected in place.
- **Ledger completeness** — the `sector-engagement/roadmap.md` swept-clean
  disposition was added (row above).

## Observations for follow-on (NOT actioned in D0 — out of scope)

- **ADR-173 §"Notes for future revision" / "Open questions" are stale** (the ADR
  is already Accepted 2026-05-11 but the section reads "Before promotion to
  Accepted"). Pre-existing, unrelated to the EEF doctrine; a doc-tidy pass
  should resolve or delete it.
- **ADR-171 is missing from the `architectural-decisions/README.md` index** (and
  ADR-170 is absent — possibly an earlier withdrawal). Pre-existing, non-EEF;
  the new `Withdrawn` lifecycle entry is the correct record if 170 was withdrawn.
- **Live non-EEF plans still deep-link the moved EEF plans** (e.g.
  `sdk-and-mcp-enhancements/active/README.md` → `eef-evidence-corpus.plan.md`,
  now in `archive/`). Those dangling links are owned by their own threads /
  `graph-estate-consolidation`, not EEF D0.
