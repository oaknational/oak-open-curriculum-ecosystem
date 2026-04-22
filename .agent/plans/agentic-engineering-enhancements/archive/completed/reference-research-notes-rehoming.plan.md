---
name: Reference / Research-Notes Rehoming
overview: >
  Find proper homes for the ~35 files moved from `.agent/reference/` into
  `.agent/research/notes/` during Session 6 of the memory-feedback thread
  (2026-04-22) when reference/ was reformed as a curated artefact tier.
  Material in `research/notes/` is in transit — each file needs a per-file
  disposition (research/, reference/, executive memory, deep-dive promotion,
  archive, or delete) before the holding bay can be retired.
todos:
  - id: phase-0-context-preservation
    content: "Phase 0: Preserve context. Capture the rationale for the en-bloc move (reference/ tier reformation, not per-file judgement) so future passes know the moves were structural, not editorial."
    status: pending
  - id: phase-1-inventory-and-classify
    content: "Phase 1: Inventory all files under research/notes/, classify each (deep-dive candidate / research-proper / reference candidate / executive-memory candidate / archive / delete), and record disposition in this plan body."
    status: pending
  - id: phase-2-deep-dive-decisions
    content: "Phase 2: Decide on agentic-engineering/ subtree (deep-dives + conversations + consolidation-design). These already exist as deep-dives in the corpus discoverability plan output; decide whether they belong in reference/ under the new definition or stay in research/."
    status: pending
  - id: phase-3-work-to-date-decisions
    content: "Phase 3: Decide on work-to-date/ subtree (5 ecosystem-progress files dated 2026-04-20). Time-bound material — likely candidates for archive once superseded, or for promotion to reports/ if still load-bearing."
    status: pending
  - id: phase-4-host-local-decisions
    content: "Phase 4: Decide on host-local material (platform-notes/, examples/, internal/, prog-frame/, ui/). Each is host-local in nature; decide retain in research/notes/, move to executive memory, or archive."
    status: pending
  - id: phase-5-architecture-research-decisions
    content: "Phase 5: Decide on architecture/ + complex-systems-dynamics/ subtrees (research-heavy, multi-field reviews). Likely belong in research/ proper under thematic subdirs, not in notes/ holding bay."
    status: pending
  - id: phase-6-top-level-doc-decisions
    content: "Phase 6: Decide on top-level docs (history-of-the-practice.md, official-mcp-app-skills.md, platform-adapter-formats.md, practice-validation-scripts.md). Each has distinct lineage — history likely belongs in practice-core/, official-mcp-app-skills.md is a skills-adjacent reference."
    status: pending
  - id: phase-7-update-active-references
    content: "Phase 7: Update active references after each disposition (active surfaces touched: README.md, docs/foundation/README.md, .agent/practice-index.md, .agent/skills/mcp-expert/SKILL.md, .agent/memory/operational/repo-continuity.md, .agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md). Each disposition that moves a file out of research/notes/ MUST follow up with a link refresh."
    status: pending
  - id: phase-8-retire-notes-bay
    content: "Phase 8: Retire research/notes/ once empty. Update research/README.md to remove the notes/ entry. Mark this plan complete and archive."
    status: pending
---

# Reference / Research-Notes Rehoming

## Context

During Session 6 of the `memory-feedback` thread (2026-04-22), the
`.agent/reference/` directory was reformed as a curated artefact tier
under [PDR-032](../../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md).
At that point, `.agent/reference/` had accumulated ~35 files across 13
subdirectories with no consistent definition of what "reference" meant
operationally — material had landed there ad-hoc whenever it didn't
fit ADRs, plans, or research/.

Per the owner stipulation that closed the reformation, **all existing
material in `.agent/reference/` was relocated en bloc** to
`.agent/research/notes/` so the new reference tier could start
empty under its definition. The relocation was **structural, not
editorial** — no per-file judgement was made about whether each item
belonged in `research/` long-term.

This plan finds proper homes for the relocated material.

## Non-goals

- This plan does NOT re-author or refresh content. Each file moves
  to a new home as-is or is archived/deleted; substantive edits are
  out of scope and would need their own plan.
- This plan does NOT define `.agent/reference/`. PDR-032 defines the
  tier; this plan only decides which relocated files (if any) should
  be promoted INTO the new reference tier.
- This plan does NOT re-validate the original landing decisions of
  the relocated material — those decisions are accepted as historical;
  the question is only "where should this live going forward".

## Inventory (snapshot at relocation, 2026-04-22)

Files under `.agent/research/notes/` awaiting disposition:

### Top-level (4 files)
- `history-of-the-practice.md`
- `official-mcp-app-skills.md`
- `platform-adapter-formats.md`
- `practice-validation-scripts.md`

### Subdirectories
- `agentic-engineering/` — 11 files (README, deep-dives × 7, conversations × 1, consolidation-design × 1, top-level workbench note)
- `architecture/` — 3 files (boundary-enforcement, two book references)
- `complex-systems-dynamics/` — 3 files (multi-field-review, dynamic-stability, emergent_stability_summary)
- `examples/` — 1 file (validate-practice-fitness.example.ts)
- `internal/` — 1 file (agent-support-tools-specification.md)
- `platform-notes/` — 1 file (claude-code-hook-activation.md)
- `prog-frame/` — 1 file (agentic-engineering-practice.md)
- `ui/` — 3 files (sprite svgs × 2 + styled-components-in-nextjs.md)
- `work-to-date/` — 5 files (oak-ecosystem-progress-* dated 2026-04-20)

### Holdings README
- `README.md` — old reference inventory (will need replacement once disposition complete)

## Active references that broke at relocation

These were updated to point to `research/notes/` during the
reformation; they remain valid pointers but each one becomes a
follow-up update target as files relocate out of `research/notes/`:

- root `README.md`
- `docs/foundation/README.md`
- `.agent/practice-index.md`
- `.agent/skills/mcp-expert/SKILL.md`
- `.agent/memory/operational/repo-continuity.md`
- `.agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md`

## Trigger

This plan activates when there is owner appetite for a per-file
disposition pass. It is intentionally in `future/` (not `current/`)
because no SLA is imposed on the holding bay — `research/notes/`
can hold material indefinitely without harming the new reference
tier's integrity. The cost of staying in the bay is modest
discoverability degradation, not active rot.

### Scheduled execution: Session 8 of the `memory-feedback` thread

Per the 2026-04-22 Session 7 → Session 8 arc reshape (recorded
under PDR-026 §Deferral-honesty discipline as a named, falsifiable
trade-off):

- **Named constraint**: this rehoming first per-file disposition
  pass is owner-appetite-triggered with no SLA. Conflating it
  with the Session-7 Phase D owner-paced per-file fitness
  disposition pass would either rush both (violates owner-paced
  cadence) or leave both partial (violates "no partial complete"
  discipline).
- **Trade-off**: the staged doctrine-consolidation arc closes one
  session later in exchange for honest, owner-paced cadence on
  each work item.
- **Falsifiability**: a future agent can read the Session 8 close
  and verify that the rehoming first pass landed alongside the
  arc-close DoD criteria (`pnpm practice:fitness --strict-hard`
  exits 0; `/jc-consolidate-docs` returns clean — zero warnings,
  zero errors, zero unnamed deferrals; staged plan to
  `archive/completed/`; `memory-feedback` thread archived;
  `observability-sentry-otel` re-activated).

The Session 8 next-session record at
[`.agent/memory/operational/threads/memory-feedback.next-session.md`](../../../memory/operational/threads/memory-feedback.next-session.md)
§"Session 8 landing target (rehoming first pass + arc close)"
holds the bidirectional pointer back to this plan.

## Done definition

- `research/notes/` is empty and removed from the tree.
- `research/README.md` no longer mentions `notes/`.
- All active references to relocated files point to their new homes.
- This plan is moved to `archive/completed/`.

## Session 8 scope expansion (2026-04-22, owner direction)

Original plan framing was "appetite-shaped, NOT exhaustive — owner names
which subtree(s) get the pass". At Session 8 open the owner expanded the
scope to a **full sweep** with delegated decision authority:

> "sort all of the files out, find appropriate locations. You are allowed
> to make decisions, the mechanisms in the Practice, including the
> sub-agent reviewers, are there to help you make _good_ decisions, and
> to get second opinions, and to reflect on work after the fact to see
> if, on reflection, you think it needs changes."

The expansion names three explicit mechanisms:

1. Agent decisions (delegated authority on placement).
2. Sub-agent reviewer second opinions BEFORE destructive moves.
3. Post-execution reflection by reviewer to surface reconsiderations.

### Constitutional carve-out: reference/ promotions

The owner delegation does NOT override
[PDR-032 §Lightweight process](../../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md),
which requires **owner-vet** for any promotion into `.agent/reference/`.
Per the
[`feel-state-of-completion-preceding-evidence-of-completion`](../../../memory/active/patterns/feel-state-of-completion-preceding-evidence-of-completion.md)
pattern landed at Session 8 open, recipe momentum cannot override a
doctrine-named owner gate. Reference promotions are encoded below as
**promotion proposals**, not as agent-executed moves.

## Proposed dispositions (Session 8, full sweep)

Authoring agent: Merry. Format: source path → disposition → new home →
rationale. Disposition kinds:

- **MOVE**: agent-executed (within delegated authority).
- **PROMOTE TO REFERENCE**: owner-vet required per PDR-032; this row is
  a proposal, not an execution.
- **DELETE**: agent-executed; substance recoverable from git history or
  upstream source.

### Top-level (4 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `history-of-the-practice.md` | MOVE | `.agent/practice-core/practice-history.md` | Living record of practice evolution; sibling to `practice-lineage.md` (the genealogy doc already in `practice-core/`). The two artefacts are read together and currently split across tiers. |
| `official-mcp-app-skills.md` | MOVE | `.agent/skills/mcp-expert/installation-and-integration.md` | Currently referenced by `.agent/skills/mcp-expert/SKILL.md` as installation guidance; co-locate with sole consumer per [PDR-007 §Bounded-package contract](../../../practice-core/decision-records/PDR-007-bounded-package-contract.md). Not evergreen reference (skills install instructions evolve with skill releases). |
| `platform-adapter-formats.md` | PROMOTE TO REFERENCE _(proposal)_ | `.agent/reference/platform-adapter-formats.md` | **Substantiate**: source-of-truth doc for Cursor / Claude / Gemini / Codex adapter formats; substance is platform-stable (formats evolve on platform release cadence, not weekly). **Justify**: read-to-learn workflow is "agent author needs to know how to format an artefact for platform X"; consulted across multiple authoring sessions; no other tier (research/, reports/, practice-core/) fits the "stable cross-platform spec lookup" shape. **Owner-vet**: pending. Failsafe if owner declines: stays in `research/notes/`. |
| `practice-validation-scripts.md` | MOVE | `.agent/practice-core/practice-validation-scripts.md` | Frontmatter explicitly states it documents the validation checks that `practice-lineage.md §Validation` references. Sibling-of-sibling per PDR-007 bounded-package contract. |

### `agentic-engineering/` (11 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `README.md` (the hub) | PROMOTE TO REFERENCE _(proposal)_ | `.agent/reference/agentic-engineering/README.md` | **Substantiate**: index-only routing surface to ADRs 119/124/125/131/150 + `practice.md` + foundation doc; substance lives in canon; this hub navigates it. **Justify**: lane README at `.agent/research/agentic-engineering/README.md:31` already links to `../../reference/agentic-engineering/README.md` as "the hub" — that back-link is currently broken because the hub was relocated en bloc; promotion restores it. Read-to-learn workflow: "where does X concept live in the canon?" **Owner-vet**: pending. Failsafe: stays in `research/notes/agentic-engineering/`. |
| `workbench-agent-operating-topology.md` | MOVE | `.agent/research/agentic-engineering/operating-model-and-platforms/workbench-agent-operating-topology.md` | Topic match: editor-resident agent operating-model and surfaces. Lane already exists with two siblings. |
| `plan-lifecycle-four-stage.md` | MOVE | `.agent/research/agentic-engineering/plan-lifecycle-four-stage.md` (top of lanes dir) | Concept-level plan-lifecycle alternative; cross-lane (touches governance + continuity); top-of-lanes placement matches `cross-lane-direction-survey.md` precedent. |
| `consolidation-design/consolidation-dry-run-2026-04-21.md` | MOVE | `.agent/plans/agentic-engineering-enhancements/archive/completed/consolidation-dry-run-2026-04-21.md` | Frontmatter explicitly says: "this document is the research layer; the plan is the execution layer ... when the staged plan archives, this document moves in parallel". The staged plan archives this session (Phase 5). Co-archive together. |
| `conversations/missing-mechanisms-lack-of-wholes.md` | MOVE | `.agent/experience/2026-04-21-missing-mechanisms-lack-of-wholes.md` | Verbatim conversation transcript preserved as historical record; matches `experience/` convention (date-prefixed reflective texture). |
| `deep-dives/README.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/README.md` | Keep deep-dives grouped (the README inventories all 7 in one place); promote whole `deep-dives/` subdir into the lanes dir as a sibling to the lane folders. Each deep-dive is cross-lane in flavour. |
| `deep-dives/continuity-and-knowledge-flow.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/continuity-and-knowledge-flow.md` | Same: keep grouped under `deep-dives/`. |
| `deep-dives/derived-memory-and-graph-navigation.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/derived-memory-and-graph-navigation.md` | Same. |
| `deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md` | Same. |
| `deep-dives/operating-model-and-topology.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/operating-model-and-topology.md` | Same. |
| `deep-dives/operational-awareness-and-state-surfaces.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md` | Same. |
| `deep-dives/portability-and-platform-surfaces.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/portability-and-platform-surfaces.md` | Same. |
| `deep-dives/reviewer-system-and-review-operations.md` | MOVE | `.agent/research/agentic-engineering/deep-dives/reviewer-system-and-review-operations.md` | Same. |

### `architecture/` (3 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `boundary-enforcement-with-eslint.md` | PROMOTE TO REFERENCE _(proposal)_ | `.agent/reference/boundary-enforcement-with-eslint.md` | **Substantiate**: stable how-to for ESLint boundary enforcement; substance is tool-stable (ESLint boundaries plugin patterns). **Justify**: read-to-learn workflow is "I need to add boundary enforcement to a new package" — consulted multiple times across the architectural-documentation-excellence plan; sits awkwardly in `research/` (it's not investigative, it's prescriptive). **Owner-vet**: pending. Failsafe: MOVE to `.agent/research/developer-experience/boundary-enforcement-with-eslint.md` as sibling to `architectural-enforcement-playbook.md` (already in that subdir). |
| `Fundamentals of Software Architecture.md` | MOVE | `.agent/research/architecture-foundations/fundamentals-of-software-architecture.md` | Long-form synthesis of Richards & Ford. Research-grade. Rename for kebab-case consistency (other research docs are kebab-cased). New `architecture-foundations/` subdir holds both architecture book reviews. |
| `Modern software architecture for long-term excellence.md` | MOVE | `.agent/research/architecture-foundations/modern-software-architecture-for-long-term-excellence.md` | Same — pairs with the other architecture book synthesis under one subdir. Rename for kebab-case. |

### `complex-systems-dynamics/` (3 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `complex-system-dynamics-multi-field-review.md` | MOVE | `.agent/research/complex-systems-dynamics/complex-system-dynamics-multi-field-review.md` | Cited from ADR-018 cluster; long-form research material. Research-grade. New subdir holds the trio. |
| `dynamic-stability-in-complex-systems.md` | MOVE | `.agent/research/complex-systems-dynamics/dynamic-stability-in-complex-systems.md` | Same. |
| `emergent_stability_summary.md` | MOVE (rename) | `.agent/research/complex-systems-dynamics/emergent-stability-summary.md` | Same. Rename underscore → hyphen for consistency. |

### `examples/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `validate-practice-fitness.example.ts` | MOVE | `.agent/practice-core/examples/validate-practice-fitness.example.ts` | TS mirror of live `scripts/validate-practice-fitness.mjs`; PDR-007 bounded-package contract — example belongs alongside the practice doctrine it instantiates. Currently referenced from `outgoing/README.md` as a sample for downstream repos; that pointer becomes `practice-core/examples/`. |

### `internal/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `agent-support-tools-specification.md` | MOVE | `agent-tools/docs/agent-support-tools-specification.md` | System-level spec for agent support tools; references ADRs 058/059/060. Co-locate with consumer (`agent-tools/` workspace) per PDR-007 bounded-package contract. Specification documents next to the workspace they specify; not Practice doctrine. |

### `platform-notes/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `claude-code-hook-activation.md` | MOVE | `.agent/practice-core/examples/claude-code-hook-activation.md` | Live local-implementation note documenting how to activate hooks; "example" semantically — sibling of `validate-practice-fitness.example.ts`. Currently referenced from `outgoing/README.md`; pointer becomes `practice-core/examples/`. |

### `prog-frame/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `agentic-engineering-practice.md` | KEEP IN HOLDING (owner-attention) | `.agent/research/notes/prog-frame/agentic-engineering-practice.md` | Frontmatter: "for internal Oak use only. Do not link from public-facing files." Sensitive personal-progression artefact; needs owner judgement on whether it belongs in `.agent/` at all (vs. a non-tracked location, vs. a staff-private repo). Surfaced for owner attention; held in place pending decision. |

### `ui/` (3 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `sprite.svg` | DELETE | (none) | Upstream Oak-Web-Application sprite sheet; the BrandBanner extraction (`apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`) baked the relevant logo path data into the component. Substance recoverable from upstream `oak-web-application/src/image-data/generated/inline-sprite.svg` and from this repo's git history. No remaining consumer in this tree. |
| `inline-sprite.svg` | DELETE | (none) | Same. |
| `styled-components-in-nextjs.md` | DELETE | (none) | Verbatim copy of Next.js documentation about CSS-in-JS libraries. Drift risk against upstream Next.js docs. Substance recoverable from `https://nextjs.org/docs` and from git history. No remaining consumer. |

### `work-to-date/` (5 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `oak-ecosystem-progress-update-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-progress-update-2026-04-20.md` | Currently referenced from root `README.md` and `docs/foundation/README.md` as "Latest progress update". Active surface. Time-bound — `reports/` tier per PDR-032 (reports are formal, dated, owner-promoted artefacts). |
| `oak-ecosystem-progress-and-direction-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-progress-and-direction-2026-04-20.md` | Same lineage; strategic progress + direction document. |
| `oak-ecosystem-progress-snapshot-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-progress-snapshot-2026-04-20.md` | Same lineage; snapshot variant. |
| `oak-ecosystem-work-to-date-summary-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-work-to-date-summary-2026-04-20.md` | Same lineage; summary variant. |
| `work-to-date-note-2026-04-20.md` | DELETE | (none) | First line is the source prompt that generated the other four (`/jc-start-right-quick Please review the plan surfaces and roadmaps and vision etc, and write a short, multi-paragraph summary document of what work we have done...`). Provenance-only artefact; substance is the prompt itself, recoverable from git history. The four reports it produced carry the load. |

### Holding-bay README + .cursorignore

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `.agent/research/notes/README.md` | DELETE | (none) | Per its own directive: "When this directory is empty, the entry is removed". The bay retires. |
| `.agent/research/notes/.cursorignore` | DELETE | (none) | Holding-bay artefact; if `notes/` is removed, the file goes with it. |

## Counts

- **Agent-executable MOVE**: 22 files
- **Agent-executable DELETE**: 6 files
- **Agent-executable KEEP** (owner-attention surface): 1 file (prog-frame)
- **Owner-vet PROMOTE TO REFERENCE proposals**: 3 files (platform-adapter-formats, agentic-engineering hub README, boundary-enforcement-with-eslint)
- **Bay infrastructure DELETE on retirement**: 2 (README.md, .cursorignore)

## Reviewer second-opinion gate (Session 8) — RAN

Two reviewers ran in parallel against the v1 classification table.
Findings are summarised below; full transcripts available via reviewer
agent IDs `a6b496b0-e109-481a-b76c-890955839af8` (assumptions) and
`01c5bbe9-24db-409c-8b79-93754c6e8877` (architecture-barney).

### assumptions-reviewer findings (BLOCKING)

1. **Live-reference inventory incomplete.** The plan's six-item
   "Active references that broke at relocation" list is missing at
   least: `docs/README.md`,
   `docs/foundation/agentic-engineering-system.md`,
   `.agent/practice-context/outgoing/README.md`,
   `.agent/research/agentic-engineering/README.md`,
   `.agent/research/agentic-engineering/operating-model-and-platforms/README.md`,
   `.agent/plans/architecture-and-infrastructure/current/doc-architecture-phase-b-dependent.plan.md`,
   `.agent/plans/developer-experience/current/directory-complexity-enablement.execution.plan.md`.
   Per-file repo search required before each move.
   → ACCEPTED. Per-file search before each batch.

2. **`work-to-date-note-2026-04-20.md` DELETE needs owner-vet.** Owner-
   authored provenance note describing the brief that produced four
   surviving reports; git recovers bytes, not a discoverable knowledge
   surface.
   → ACCEPTED. Surfaced as owner-attention item below; default deferred
   to delete-on-owner-confirm OR move-to-reports-as-provenance.

### assumptions-reviewer findings (SHOULD-RECONSIDER)

3. The four `practice-core/` moves are not "routine co-location"; each
   adds a NEW surface inside the bounded package per PDR-007.
   → ACCEPTED + ESCALATED to BLOCKING (matches Barney #1, see below).
   All four re-routed away from `practice-core/`.

4. `platform-adapter-formats.md` PROMOTE proposal — the embedded support-
   status matrix is release-sensitive in a way that may make it a
   maintained integration note rather than a slowly-aging reference.
   → ACCEPTED. Owner-vet question sharpened in proposal row.

5. `boundary-enforcement-with-eslint.md` — exactly the
   PDR-032 §Notes "long-form how-to that ages slowly" edge case.
   → ACCEPTED. Owner-vet question explicitly framed as edge-case.

6. Hub README PROMOTE rationale leans too hard on backlink repair.
   → ACCEPTED + ESCALATED to BLOCKING (matches Barney #2). See owner-
   attention item below.

7. Bay retirement timing must be explicitly LAST in the sequence.
   → ACCEPTED. Sequencing made explicit in §Execution sequence.

### assumptions-reviewer findings (NIT)

8. Owner direction "sort all of the files out" supports full
   classification but does not uniquely compel destructive execution
   of every non-gated row.
   → ACCEPTED. Owner-attention items below carry the doubtful rows.

### architecture-reviewer-barney findings (STRUCTURAL-BLOCKER)

1. **`practice-core/` accretion violates PDR-007.** Adding
   `practice-history.md`, `practice-validation-scripts.md`, and
   `practice-core/examples/` (with two files) expands the bounded
   package by accretion. PDR-007: "the package may grow by explicit
   decision (future PDR) when the Practice requires a new first-class
   surface; it does not grow by accretion."
   → ACCEPTED (BLOCKING). All four affected files re-routed:
   `history-of-the-practice.md` → `research/agentic-engineering/`;
   `practice-validation-scripts.md` → `research/developer-experience/`;
   `validate-practice-fitness.example.ts` →
   `research/developer-experience/examples/`;
   `claude-code-hook-activation.md` → `research/developer-experience/`.

2. **One-file `reference/agentic-engineering/` subdir violates
   `reference/`'s own clustering discipline.**
   `.agent/reference/README.md` requires "three or more documents" per
   subdirectory. Promoting only the hub README creates a violating
   one-file cluster AND a two-index split with the lane README at one
   tier higher.
   → ACCEPTED (BLOCKING). Hub PROMOTE proposal withdrawn from v2.
   Surfaced as owner-attention item: option A (collapse hub into lane
   README — agent-executable); option B (defer pending full-cluster
   PROMOTE proposal — owner-vet of bigger set).

### architecture-reviewer-barney findings (SHOULD-RECONSIDER)

3. **Distribute `deep-dives/` into matching lane folders.** Lane
   READMEs already expose per-theme "Feeds" pointers; current
   consumers are the lanes, not a shared bucket. Grouping in
   `deep-dives/` is the more complex shape.
   → ACCEPTED. v2 distributes 6 of 7 deep-dives into matching lanes;
   1 (`operational-awareness-and-state-surfaces.md`) has no clean lane
   match and is surfaced as owner-attention item.

4. **`research/architecture-foundations/` (2 files) below subdir
   threshold.** Not for `complex-systems-dynamics/` (3 files —
   coherent thematic cluster).
   → ACCEPTED. Two book reviews flatten to `research/` root with
   kebab-case names; CSD subdir kept.

5. **`experience/` is not for verbatim transcripts.**
   `.agent/experience/README.md` explicitly forbids treating it as a
   records/notes/documentation store.
   → ACCEPTED. `conversations/missing-mechanisms-lack-of-wholes.md`
   re-routed to `research/agentic-engineering/conversations/`.

### architecture-reviewer-barney findings (NIT)

6. Other moves directionally coherent (skills/, agent-tools/docs/,
   research/agentic-engineering/operating-model-and-platforms/,
   reports/).
   → ACCEPTED (no change required).

## Revised proposed dispositions (v2, post-review)

The v1 table is superseded by v2 below. Same legend (MOVE / PROMOTE TO
REFERENCE _(proposal)_ / DELETE / KEEP). Changes from v1 are flagged
with _(v2 change)_.

### Top-level (4 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `history-of-the-practice.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/history-of-the-practice.md` | v1 was practice-core/ accretion; per PDR-007 + Barney #1, lives in research/ as a Practice-history evidence document. |
| `official-mcp-app-skills.md` | MOVE | `.agent/skills/mcp-expert/installation-and-integration.md` | Co-locate with sole consumer per PDR-007 bounded-package contract; `mcp-expert/SKILL.md` already references it as installation guidance. |
| `platform-adapter-formats.md` | PROMOTE TO REFERENCE _(proposal)_ | `.agent/reference/platform-adapter-formats.md` | **Substantiate**: cross-platform adapter format documentation. **Justify (sharpened per assumptions #4)**: the **stable cross-platform contract sections** are reference-shaped; the **embedded support-status matrix** is release-sensitive and may need separation. **Owner-vet question**: accept whole document as maintained library reference under aging gate, OR accept only stable sections (split needed)? **Failsafe**: stays in `research/notes/`. |
| `practice-validation-scripts.md` | MOVE _(v2 change)_ | `.agent/research/developer-experience/practice-validation-scripts.md` | v1 was practice-core/ accretion; sibling to `architectural-enforcement-playbook.md` already in DX. Documents validation logic; not first-class Core. |

### `agentic-engineering/` (11 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `README.md` (the hub) | **OWNER-ATTENTION** _(v2 change)_ | (see owner-attention §A) | v1 PROMOTE proposal withdrawn per Barney #2 (one-file subdir violates `reference/` clustering). Two paths: option A merge into `research/agentic-engineering/README.md` (agent-executable); option B defer pending full-cluster proposal (owner-vet). |
| `workbench-agent-operating-topology.md` | MOVE | `.agent/research/agentic-engineering/operating-model-and-platforms/workbench-agent-operating-topology.md` | Topic match: editor-resident agent operating model. |
| `plan-lifecycle-four-stage.md` | MOVE | `.agent/research/agentic-engineering/plan-lifecycle-four-stage.md` | Cross-lane; sibling to existing `cross-lane-direction-survey.md`. |
| `consolidation-design/consolidation-dry-run-2026-04-21.md` | MOVE | `.agent/plans/agentic-engineering-enhancements/archive/completed/consolidation-dry-run-2026-04-21.md` | Co-archive with the staged plan when it archives this session. |
| `conversations/missing-mechanisms-lack-of-wholes.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/conversations/missing-mechanisms-lack-of-wholes.md` | v1 was `experience/`; per Barney #5 + experience/README.md, transcripts belong in research as source material, not in experience/ (which is for subjective reflection). |
| `deep-dives/continuity-and-knowledge-flow.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/continuity-and-knowledge-flow.md` | v1 grouped under `deep-dives/`; per Barney #3, distribute into matching lane. |
| `deep-dives/derived-memory-and-graph-navigation.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/derived-memory-and-graph-navigation/derived-memory-and-graph-navigation.md` | Same. Lane already exists. |
| `deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/governance-planes-and-supervision/governance-planes-trust-boundaries-and-runtime-supervision.md` | Same. |
| `deep-dives/operating-model-and-topology.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/operating-model-and-platforms/operating-model-and-topology.md` | Same. |
| `deep-dives/operational-awareness-and-state-surfaces.md` | **OWNER-ATTENTION** _(v2 change)_ | (see owner-attention §B) | No clean lane match — closest candidates are `governance-planes-and-supervision/` (state surfaces ≈ supervision) or `operating-model-and-platforms/` (state surfaces ≈ operating model). |
| `deep-dives/portability-and-platform-surfaces.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/operating-model-and-platforms/portability-and-platform-surfaces.md` | Lane README explicitly covers portability. |
| `deep-dives/reviewer-system-and-review-operations.md` | MOVE _(v2 change)_ | `.agent/research/agentic-engineering/reviewer-systems-and-discoverability/reviewer-system-and-review-operations.md` | Lane match. |
| `deep-dives/README.md` | DELETE _(v2 change)_ | (none) | Inventory function absorbed by per-lane README updates (each lane README adds its newly-resident deep-dive); separate deep-dives index becomes redundant. |

### `architecture/` (3 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `boundary-enforcement-with-eslint.md` | PROMOTE TO REFERENCE _(proposal)_ | `.agent/reference/boundary-enforcement-with-eslint.md` | **Owner-vet question (sharpened per assumptions #5 + Barney NIT)**: is this **curated library reference** (used recurrently as a how-to source) OR **standing research/DX note** (one-off implementation guide)? PDR-032 §Notes calls this out as the named edge case. **Failsafe**: MOVE to `.agent/research/developer-experience/boundary-enforcement-with-eslint.md` as sibling to `architectural-enforcement-playbook.md`. |
| `Fundamentals of Software Architecture.md` | MOVE _(v2 change)_ | `.agent/research/fundamentals-of-software-architecture.md` | v1 created new `architecture-foundations/` subdir for 2 files; per Barney #4, flatten to `research/` root with kebab-case. |
| `Modern software architecture for long-term excellence.md` | MOVE _(v2 change)_ | `.agent/research/modern-software-architecture-for-long-term-excellence.md` | Same. |

### `complex-systems-dynamics/` (3 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `complex-system-dynamics-multi-field-review.md` | MOVE | `.agent/research/complex-systems-dynamics/complex-system-dynamics-multi-field-review.md` | 3 files = at threshold; coherent ADR-018-cited cluster; subdir kept. |
| `dynamic-stability-in-complex-systems.md` | MOVE | `.agent/research/complex-systems-dynamics/dynamic-stability-in-complex-systems.md` | Same. |
| `emergent_stability_summary.md` | MOVE (rename) | `.agent/research/complex-systems-dynamics/emergent-stability-summary.md` | Rename underscore → hyphen for consistency. |

### `examples/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `validate-practice-fitness.example.ts` | MOVE _(v2 change)_ | `.agent/research/developer-experience/examples/validate-practice-fitness.example.ts` | v1 was practice-core/ accretion; per Barney #1, place in DX research lane. The live `scripts/validate-practice-fitness.mjs` is the production version; this `.example.ts` is a TS reference for downstream repos. |

### `internal/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `agent-support-tools-specification.md` | MOVE | `agent-tools/docs/agent-support-tools-specification.md` | Co-locate with consumer workspace per PDR-007. |

### `platform-notes/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `claude-code-hook-activation.md` | MOVE _(v2 change)_ | `.agent/research/developer-experience/claude-code-hook-activation.md` | v1 was practice-core/ accretion; per Barney #1, DX research lane. Implementation note for Claude Code hook activation. |

### `prog-frame/` (1 file)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `agentic-engineering-practice.md` | KEEP IN HOLDING (owner-attention §C) | `.agent/research/notes/prog-frame/agentic-engineering-practice.md` | Internal-Oak-only; sensitive personal-progression artefact; needs owner judgement on whether `.agent/` is the right place. |

### `ui/` (3 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `sprite.svg` | DELETE | (none) | Upstream sprite sheet; relevant logo path data baked into `BrandBanner.tsx`. Recoverable from upstream + git history. |
| `inline-sprite.svg` | DELETE | (none) | Same. |
| `styled-components-in-nextjs.md` | DELETE | (none) | Verbatim Next.js docs copy; drift risk. Recoverable from upstream + git history. |

### `work-to-date/` (5 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `oak-ecosystem-progress-update-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-progress-update-2026-04-20.md` | Active surface; reports/ tier per PDR-032. |
| `oak-ecosystem-progress-and-direction-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-progress-and-direction-2026-04-20.md` | Same. |
| `oak-ecosystem-progress-snapshot-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-progress-snapshot-2026-04-20.md` | Same. |
| `oak-ecosystem-work-to-date-summary-2026-04-20.md` | MOVE | `.agent/reports/oak-ecosystem-work-to-date-summary-2026-04-20.md` | Same. |
| `work-to-date-note-2026-04-20.md` | **OWNER-ATTENTION** _(v2 change)_ | (see owner-attention §D) | v1 was DELETE; per assumptions #2, owner-authored provenance note — needs owner sign-off OR move-to-reports-as-provenance. |

### Bay infrastructure (2 files)

| Source | Disposition | New home | Rationale |
| --- | --- | --- | --- |
| `.agent/research/notes/README.md` | DELETE on retirement | (none) | Per its own directive: "When this directory is empty, the entry is removed." Last step in execution sequence. |
| `.agent/research/notes/.cursorignore` | DELETE on retirement | (none) | Bay artefact. Last step. |

## Counts (v2)

- **Agent-executable MOVE**: 21 files
- **Agent-executable DELETE**: 4 files (3 ui + 1 deep-dives README)
- **Agent-executable KEEP** (held with owner-attention surface): 1 file (prog-frame)
- **Owner-vet PROMOTE TO REFERENCE proposals**: 2 files (platform-adapter-formats, boundary-enforcement-with-eslint) — hub README withdrawn pending owner-attention §A
- **Owner-attention before disposition**: 4 items (hub merge A/B; operational-awareness lane; prog-frame retain; work-to-date-note delete)
- **Bay infrastructure DELETE on retirement**: 2

## Owner-attention items (block execution until resolved)

### §A. Hub README disposition

The Barney structural blocker on one-file `reference/` subdirs forces a
choice. Both options preserve the lane README's intent (canon routing
should be discoverable):

- **Option A (agent-executable)**: merge the hub's "Start Here" canon
  list (ADRs 119/124/125/131/150 + practice.md + practice-index.md +
  agentic-engineering-system.md) into the existing
  `.agent/research/agentic-engineering/README.md` lane README. Repoint
  the lane README's "Related Surfaces" section's broken back-link.
  Single index surface; no `reference/` promotion needed.
- **Option B (owner-vet — PROMOTE proposal)**: defer the hub move
  pending a full-cluster `reference/agentic-engineering/` proposal that
  bundles the hub README + the 7 deep-dives (or some subset) as a 3+
  document evergreen cluster. Requires owner-vet of the cluster
  composition AND each member's reference-criteria.

Default if owner does not pick: A. Cleaner, less new tier surface, no
new owner-vet load.

### §B. Operational-awareness deep-dive lane placement

`deep-dives/operational-awareness-and-state-surfaces.md` has no
unambiguous lane match. Three options:

- **Option 1**: place in `governance-planes-and-supervision/` — state
  surfaces are the substrate that supervision runs on top of.
- **Option 2**: place in `operating-model-and-platforms/` — state
  surfaces are operating-model concerns.
- **Option 3**: keep at `research/agentic-engineering/` top-level (cross-
  lane), like `cross-lane-direction-survey.md`.

Default if owner does not pick: 3 (top-level cross-lane). Preserves
the genuine ambiguity rather than forcing a lane.

### §C. prog-frame disposition

`prog-frame/agentic-engineering-practice.md` is internal-Oak-only,
sensitive personal-progression material. Three options:

- **Option 1**: KEEP in `.agent/research/notes/prog-frame/` (current).
  Bay does not retire fully; one folder remains.
- **Option 2**: MOVE to a private `.gitignore`d location outside `.agent/`.
- **Option 3**: MOVE to a separate staff-private repo entirely.

Default if owner does not pick: 1 (KEEP). Lowest-risk; lets bay carry
this single owner-private subdir until the owner decides.

### §D. work-to-date-note delete OR preserve

`work-to-date-2026-04-20.md` is the source prompt that produced the
four ecosystem reports. Two options:

- **Option 1 (DELETE)**: substance recoverable from git history; the
  four surviving reports carry the load. Provenance loss is acceptable.
- **Option 2 (MOVE-AS-PROVENANCE)**: move to
  `.agent/reports/work-to-date-note-2026-04-20.md` as the provenance
  sibling of the four reports it produced. Frontmatter could note its
  prompt-of-origin role.

Default if owner does not pick: 2 (MOVE-AS-PROVENANCE). Reversibility
discipline favours preservation when uncertain.

## Active references (v2 — broadened per assumptions #1)

Per-file repo search is required before each batch to catch silent
breakage. Known-currently-active surfaces that name `research/notes/`
paths:

- root `README.md`
- `docs/README.md`
- `docs/foundation/README.md`
- `docs/foundation/agentic-engineering-system.md`
- `.agent/practice-index.md`
- `.agent/practice-context/outgoing/README.md`
- `.agent/skills/mcp-expert/SKILL.md`
- `.agent/memory/operational/repo-continuity.md`
- `.agent/research/agentic-engineering/README.md` (broken back-link
  to hub: `../../reference/agentic-engineering/README.md`)
- `.agent/research/agentic-engineering/operating-model-and-platforms/README.md`
- `.agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md`
- `.agent/plans/architecture-and-infrastructure/current/doc-architecture-phase-b-dependent.plan.md`
- `.agent/plans/developer-experience/current/directory-complexity-enablement.execution.plan.md`

Each MOVE batch concludes with `rg "research/notes/<old-subpath>"`
sweeps to catch any consumer not pre-listed above.

## Owner-attention resolution (Session 8, defaults applied)

Owner skipped the structured questions form at Session 8 open, taking
that as a delegation signal under the Session 8 owner direction
("you are allowed to make decisions"). Defaults applied per the
plan-body recommendations:

- **§A Hub README**: **Option A** — merge hub's "Start Here" canon
  list into `.agent/research/agentic-engineering/README.md`; repoint
  the broken back-link. Single index surface; no `reference/`
  promotion. Hub README at `.agent/research/notes/agentic-engineering/README.md`
  is then DELETED after merge.
- **§B operational-awareness lane**: **Option 3** — place at
  `.agent/research/agentic-engineering/operational-awareness-and-state-surfaces.md`
  top-level cross-lane (sibling to `cross-lane-direction-survey.md`).
- **§C prog-frame**: **Option 1** — KEEP in
  `.agent/research/notes/prog-frame/`. Bay does NOT fully retire;
  one folder remains. This is an honest deferral per PDR-026:
  named constraint (sensitive personal-progression artefact requires
  owner judgement on `.agent/` vs private location); evidence (frontmatter
  `for internal Oak use only`); falsifiability (next agent reads bay
  and finds prog-frame still there + this resolution note + the
  unresolved owner question).
- **§D work-to-date-note**: **Option 2** — MOVE to
  `.agent/reports/work-to-date-note-2026-04-20.md` as provenance
  sibling. Reversibility discipline.
- **`platform-adapter-formats.md` PROMOTE**: pending owner-vet.
  Failsafe MOVE applied: `.agent/research/platform-adapter-formats.md`
  (research root). PROMOTE proposal stays open in this plan; PDR-032
  §Substantiate is satisfied by the research home, so a future
  promotion can move it from research/ → reference/ without first
  re-staging.
- **`boundary-enforcement-with-eslint.md` PROMOTE**: pending owner-vet.
  Failsafe MOVE applied:
  `.agent/research/developer-experience/boundary-enforcement-with-eslint.md`
  (sibling to `architectural-enforcement-playbook.md`). Same
  proposal-stays-open posture.

**Falsifiability of these defaults**: a future agent or the owner
can read this resolution block, the v2 dispositions table, and the
final tree state, and verify that (a) each owner-attention item has
a recorded resolution with reasoning, (b) the PROMOTE proposals are
preserved against the failsafe homes (not silently dropped), (c)
the bay carries exactly one folder (prog-frame) plus the README and
.cursorignore that gate it, and (d) the back-link from the lane
README to the hub is repaired (not pointing at a deleted path).

## Execution sequence (v2, with Session 8 resolutions)

1. ~~Owner resolves §A, §B, §C, §D.~~ — Resolved by default-application
   above; owner free to override after execution by re-routing.
2. Execute MOVE/DELETE in batches grouped by destination tier
   (research/, reports/, skills/, agent-tools/docs/, plans/archive/).
   Each batch:
   - per-file `rg` sweep BEFORE move.
   - `git mv` (preserves history).
   - update consumers atomically with the move.
   - per-file `rg` sweep AFTER move (validates no orphaned link).
3. Hub README merge: append "Start Here" canon section to
   `.agent/research/agentic-engineering/README.md`; repoint broken
   back-link in lane README's "Related Surfaces"; DELETE hub README
   from holding bay.
4. Bay-infra: `README.md` + `.cursorignore` REMAIN at bay because
   prog-frame folder remains per §C. Bay does NOT fully retire.
   Plan body acknowledges this honest deferral.
5. Post-execution reflection: docs-adr-reviewer second pass on the
   resulting tree for reconsiderations.

## Done definition (v2 update)

The original Done definition required `research/notes/` empty + bay
README removed + plan archived. v2 honestly defers two of these:

- `research/notes/` is **NOT empty**: prog-frame/ remains pending
  owner §C decision.
- `research/notes/README.md` is **NOT removed**: needed to gate the
  remaining prog-frame/ subdir.
- All MOVE/DELETE rows in v2 dispositions executed (35 of 36 items;
  prog-frame is the held item).
- All active references updated; per-file `rg` sweeps recorded.
- Hub merge into lane README complete; lane README back-link repaired.
- This plan moves to `archive/completed/` once execution is done; the
  prog-frame holding-bay residual is recorded as PDR-026 honest deferral
  with a future-trigger ("owner makes §C decision") that can re-open
  this plan or spawn a new one.

## Execution record (Session 8, 2026-04-22 — completed in-flight)

All v2 MOVE / DELETE / KEEP dispositions executed in batches per the
sequence above. Final landed state:

### Moves (22 files)

**Lane subtree — `agentic-engineering/` (10 files)**

- `agentic-engineering/workbench-agent-operating-topology.md` →
  `research/agentic-engineering/operating-model-and-platforms/`
- `agentic-engineering/plan-lifecycle-four-stage.md` →
  `research/agentic-engineering/`
- `agentic-engineering/conversations/missing-mechanisms-lack-of-wholes.md` →
  `research/agentic-engineering/conversations/`
- `agentic-engineering/deep-dives/operating-model-and-topology.md` →
  `research/agentic-engineering/operating-model-and-platforms/`
- `agentic-engineering/deep-dives/portability-and-platform-surfaces.md` →
  `research/agentic-engineering/operating-model-and-platforms/`
- `agentic-engineering/deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md` →
  `research/agentic-engineering/governance-planes-and-supervision/`
- `agentic-engineering/deep-dives/continuity-and-knowledge-flow.md` →
  `research/agentic-engineering/continuity-memory-and-knowledge-flow/`
- `agentic-engineering/deep-dives/derived-memory-and-graph-navigation.md` →
  `research/agentic-engineering/derived-memory-and-graph-navigation/`
- `agentic-engineering/deep-dives/reviewer-system-and-review-operations.md` →
  `research/agentic-engineering/reviewer-systems-and-discoverability/`
- `agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md` →
  `research/agentic-engineering/` (top-level cross-lane per §B Option 3)

**Top-level files (3)**

- `history-of-the-practice.md` → `research/agentic-engineering/`
- `official-mcp-app-skills.md` →
  `skills/mcp-expert/installation-and-integration.md`
- `practice-validation-scripts.md` →
  `research/developer-experience/practice-validation-scripts.md`
- `platform-adapter-formats.md` → `research/platform-adapter-formats.md`
  (PROMOTE-TO-REFERENCE proposal stays open per §A defaults; see resolution
  block above)

**Architecture subtree (3)**

- `architecture/Fundamentals of Software Architecture.md` →
  `research/fundamentals-of-software-architecture.md`
- `architecture/Modern software architecture for long-term excellence.md` →
  `research/modern-software-architecture-for-long-term-excellence.md`
- `architecture/boundary-enforcement-with-eslint.md` →
  `research/developer-experience/boundary-enforcement-with-eslint.md`
  (PROMOTE-TO-REFERENCE proposal stays open per §B defaults)

**Complex-systems-dynamics subtree (3)**

- `complex-systems-dynamics/complex-system-dynamics-multi-field-review.md` →
  `research/complex-systems-dynamics/`
- `complex-systems-dynamics/dynamic-stability-in-complex-systems.md` →
  `research/complex-systems-dynamics/`
- `complex-systems-dynamics/emergent_stability_summary.md` →
  `research/complex-systems-dynamics/emergent-stability-summary.md`
  (filename normalised to kebab-case)

**Examples / platform-notes / internal (3)**

- `examples/validate-practice-fitness.example.ts` →
  `research/developer-experience/examples/`
- `platform-notes/claude-code-hook-activation.md` →
  `research/developer-experience/`
- `internal/agent-support-tools-specification.md` →
  `agent-tools/docs/agent-support-tools-specification.md`

**work-to-date subtree (5)**

- `work-to-date/oak-ecosystem-progress-update-2026-04-20.md` → `reports/`
- `work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md` → `reports/`
- `work-to-date/oak-ecosystem-progress-snapshot-2026-04-20.md` → `reports/`
- `work-to-date/oak-ecosystem-work-to-date-summary-2026-04-20.md` → `reports/`
- `work-to-date/work-to-date-note-2026-04-20.md` →
  `reports/work-to-date-note-2026-04-20.md` (provenance per §D Option 2)

**`agentic-engineering/consolidation-design/` (1)**

- `consolidation-dry-run-2026-04-21.md` →
  `plans/agentic-engineering-enhancements/archive/completed/`

### Deletes (4 files)

- `agentic-engineering/deep-dives/README.md` (deep-dives README, content
  absorbed into the merged lane README's Topic Map)
- `ui/sprite.svg`, `ui/inline-sprite.svg`, `ui/styled-components-in-nextjs.md`

### Hub merge (executed)

`research/notes/agentic-engineering/README.md` (hub) merged into
`research/agentic-engineering/README.md` (lane), with the broken
`Related Surfaces → ../../reference/agentic-engineering/README.md`
back-link replaced by an in-prose statement that the hub is now part of
the lane README. Hub README then deleted.

### Active reference updates (executed)

Updated to point at new homes:

- `README.md` (root) — progress-update path → `reports/`
- `docs/README.md` — hub label and path → research lanes & hub
- `docs/foundation/README.md` — hub link + progress-update path
- `docs/foundation/agentic-engineering-system.md` — hub link (×2)
- `.agent/practice-index.md` — Agentic Corpus Hub block points at lane
  README; in-transit caveat removed
- `.agent/skills/mcp-expert/SKILL.md` — installation link points at
  co-located `installation-and-integration.md` (×2); in-transit caveat
  removed
- `.agent/practice-context/outgoing/README.md` — `plan-lifecycle-four-stage`
  link refreshed; en-bloc-relocation manifest updated to final destinations
- `.agent/reports/agentic-engineering/deep-dive-syntheses/README.md` —
  promotion-rule wording updated; deep-dives now lane-distributed
- `.agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md`
  — three reference-doc paths refreshed
- `.agent/plans/architecture-and-infrastructure/current/doc-architecture-phase-b-dependent.plan.md`
  — boundary-enforcement-with-eslint path refreshed
- `.agent/plans/agentic-engineering-enhancements/roadmap.md` — hub
  history note appended
- `docs/architecture/architectural-decisions/018-complete-biological-architecture.md`
  — complex-systems-dynamics path refreshed
- `.agent/research/notes/README.md` — bay README rewritten to reflect
  Session-8 residual state (only `prog-frame/` remains; bay does NOT
  fully retire)

### Final bay state

```
.agent/research/notes/
├── .cursorignore
├── README.md  (rewritten; describes residual state)
└── prog-frame/
    └── agentic-engineering-practice.md  (KEEP per §C Option 1)
```

### Open items remaining at end of Session 8

- `prog-frame/` disposition (§C) — owner conversation required.
- `platform-adapter-formats.md` PROMOTE-TO-REFERENCE proposal — owner-vet
  required per PDR-032.
- `boundary-enforcement-with-eslint.md` PROMOTE-TO-REFERENCE proposal —
  owner-vet required per PDR-032.
- Plan archive deferred (per the explicit owner instruction at the close
  of Session 8: "update the plan and all relevant surfaces, then report,
  then stop"). The plan stays in `future/` because three open items
  remain; archival belongs to the next pass that resolves them.
- Post-execution reflective reviewer pass (docs-adr-reviewer / code-
  reviewer) was sequenced for after the executed moves but is honestly
  deferred per the same owner stop-instruction.
