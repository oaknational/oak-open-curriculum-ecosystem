---
title: Pending-graduations entry schema + deterministic count fitness metric
status: implemented 2026-06-16 (model evolved — see ADR-144; ready to archive)
collection: agent-tooling
lane: current
authored: 2026-06-16
author: Snapper binds Coral (0beea7)
promoted_from: >-
  the future/ strategic brief authored earlier this session (removed on promotion;
  never landed separately — this executable plan is the single artefact)
governance: ADR-117 (plan architecture), PDR-018 (planning discipline), ADR-144
  (three-zone fitness), PDR-097 (disposition-category report grouping),
  PDR-014 (capture→distil→graduate→enforce)
owner_ratified_2026-06-16:
  - "D1 schema: formalise the inline-bracket [captured: … | status: …] form"
  - "D2: ABOLISH owner-gated entirely — no park-pending-owner status exists; every
     live item is decision-debt and is graduate-or-reject by the lenses; provenance
     and adaptation, not owner-pre-approval, are the safety net for wrong calls"
  - "D3 (count, discrete ceilings): target 0, soft 2, hard 3; critical = beyond hard (4+). Dwell axis added: target 2, soft 4, hard 7 days. All fitness is report-only (ADR-144)."
  - "Framing: repo-learning is a first-class pillar"
todos:
  - id: ws1-schema-adr
    content: "Define the entry schema + status enum (NO owner-gated) and record it in an ADR (or ADR-144 amendment); author the consolidation-doctrine PDR abolishing owner-gated (provenance-over-perfection)."
    status: done
  - id: ws2-conformance-validator
    content: "TDD: schema-conformance validator — conformant entry parses; malformed rejected; an owner-gated status is rejected. Migrate the 3 block-format entries; convert all existing owner-gated entries to pending."
    status: done
    depends_on: [ws1-schema-adr]
  - id: ws3-count-parser
    content: "TDD: deterministic count parser — total live-item count + by-status breakdown over a fixture."
    status: done
    depends_on: [ws1-schema-adr]
  - id: ws4-count-metric
    content: "TDD: three-zone count metric (healthy 0; soft 1–2; hard/critical 3+) at a pure DI seam; frontmatter-declared owner-tunable thresholds (0/1/3/3); generic item-count metric reusable by other buffers."
    status: done
    depends_on: [ws3-count-parser]
  - id: ws5-report
    content: "TDD: report the count + zone + by-status breakdown, grouped per PDR-097."
    status: done
    depends_on: [ws4-count-metric]
  - id: ws6-doctrine-surfaces
    content: "Remove owner-gated from doctrine surfaces: consolidate-docs step 7, the register intro/frontmatter, referencing PDRs/rules, napkin/distilled cautions. Decide-everything-by-lenses; learning over perfection."
    status: done
    depends_on: [ws1-schema-adr]
---

# Pending-graduations entry schema + deterministic count fitness metric

> **Implemented 2026-06-16 (model evolved during implementation).** WS1–WS6 landed.
> The shipped shape, of which **ADR-144 is the source of truth**, evolved from this
> plan's original wording: zones use discrete **ceiling** thresholds (count
> `target 0, soft 2, hard 3`, critical = 4+; a dwell-time axis `target 2, soft 4,
> hard 7` days), and **all fitness output is report-only — a prioritisation signal,
> never a build gate** (the validator always exits 0). The original workstream prose
> below is retained as the planning record; where it says floors / `_limit` /
> `critical = hard` / "gates like a size zone", read the ADR. Ready to archive.

## End goal

A consolidator and the owner see, in the standard fitness report, a **deterministic count
of live pending-graduation items** with a by-status breakdown, and a **three-zone trigger**
(target 0 / soft 1 / hard 3 / critical 3) fires as decision-debt accumulates — so the
register cannot silently re-accumulate into a junk drawer, and repo-learning is treated as
a first-class pillar.

## Mechanism

A parseable per-entry schema → a deterministic count (the sensor) → a three-zone fitness
metric (the alarm) → the report (visibility). This closes the `enforce`-edge feedback loop
(PDR-014) that the napkin's 2026-06-16 lessons named as landing today only as no-op passive
prose. "Decide, don't park" becomes observable pressure.

## The inversion guard (non-negotiable, central)

A count-with-trigger invites the fitness→goal inversion this codebase forbids: lowering the
count by **deleting items without deciding them**. The count is routable ONLY to *deciding*
— graduate or reject, with the substance verified live in its permanent home
(`permanent-doc-is-the-consolidation-record`, `knowledge-preservation-over-fitness-warnings`).
An item leaves the register only via a recorded terminal disposition (`graduated` /
`rejected` / `duplicate`), never by silent removal. The WS2 conformance validator enforces
this. The metric's report text states it. With owner-gated abolished, this guard is the
whole safety model: provenance + adaptation, not perfection.

## Workstreams (TDD cycles; next session expands each Red→Green→Refactor)

- **WS1 — schema + status enum + ADR/PDR.** Canonical entry form
  `[captured: <date> | source: <text> | target: <text> | trigger: <text> | size: <…> | status: <enum>]`.
  Status enum: **live** `{pending, due, overdue}` (all decision-debt); **terminal**
  `{graduated, rejected, duplicate}` (removed on disposition). **No `owner-gated`.** Record the
  schema in an ADR (or ADR-144 amendment) and the owner-gated-abolition + provenance-over-
  perfection doctrine in a PDR. (Schema/doc; the WS2 validator is its executable test.)
- **WS2 — conformance validator + migration.** TDD: a conformant entry parses; a malformed
  entry is rejected; a `status: owner-gated` is rejected. Migrate the 3 block-format
  (`- **captured-date**:`) entries; convert every existing `owner-gated` entry to `pending`
  (they now need deciding). Product: validator wired to the gate tier.
- **WS3 — deterministic count parser.** TDD over a fixture: total live count + by-status
  breakdown. New module under `agent-tools/src/practice-fitness/`.
- **WS4 — three-zone count metric.** TDD at a pure DI seam (inject thresholds + count → zone;
  test the engine, never a pinned owner value per `never-pin-owner-tunable-values`). Zones:
  healthy 0; soft 1–2; hard/critical 3+ (critical coincides with hard per the owner's
  `critical = hard`). Thresholds declared in the register frontmatter
  (`fitness_item_count_target: 0`, `fitness_item_count_soft: 2`, `fitness_item_count_hard: 3`, …), owner-tunable. Prefer a
  generic, frontmatter-declarable item-count metric so `open-questions.md` etc. can adopt it.
- **WS5 — report.** TDD: the fitness output shows count + zone + by-status, grouped per
  PDR-097. Extend `format.ts` / `messages.ts`.
- **WS6 — doctrine-surface owner-gated removal.** Strip owner-gated from: `consolidate-docs`
  step 7 (the "walk owner-gated with the owner" prose), the register intro/frontmatter, any
  referencing PDR/rule, and the napkin/distilled cautions. Replace with decide-everything-by-
  lenses + provenance-over-perfection.

## Acceptance criteria + proof contract

- `ws3`: deterministic count equals an independent hand-count of live entries — proof
  `unit` (fixture) + `value-proxy` (live register).
- `ws4`: the zone engine maps count→{healthy,soft,hard,critical} at the injected thresholds —
  proof `unit` at the DI seam; no pinned threshold value asserted.
- `ws2`: a malformed entry and an `owner-gated` status both fail the validator — proof `unit`;
  the inversion guard (removal requires a recorded terminal disposition) holds.
- `ws5`: report renders count + zone + breakdown — proof `unit` + `value-proxy` (real run).
- `ws6`: `rg owner-gated` over doctrine surfaces returns only historical/archival references —
  proof `non-code`.
- Outcome signal: a later consolidation reads decision-debt at a glance and the count trends
  down **through deciding**, never through silent trimming.

## Sequencing, prerequisites, non-goals

- **Sequencing (PDR-093 consumption chain):** WS1 → WS2/WS3 (need the schema) → WS4 (needs the
  count) → WS5 (needs the metric); WS6 follows WS1. WS4's zone test breaks if WS3's count
  drifts; WS5's report test breaks if WS4 drifts.
- **Prerequisites:** WS1 is `blocking` for all. None `beneficial`-only.
- **Non-goals:** changing graduation *decisions*; auto-deciding entries; replacing line-count
  (it stays for structural/verbosity health — item-count is the new primary decision-debt
  signal); a general workflow engine; parsing free-text fields beyond `status` for the count.
- **Boundary:** internal memory-buffer schema + fitness tooling — NOT the OpenAPI cardinal
  rule (that governs API/SDK data flow); do not mis-apply schema-first there.

## Foundation, reviewers, learning loop

- `principles.md`, `testing-strategy.md` (TDD; test the engine not the value),
  `schema-first-execution.md` (boundary noted above), ADR-144, PDR-097, PDR-014.
- `plan-body-first-principles-check` fires on the schema shape + metric landing path before
  any cycle executes.
- **Readiness reviewers** (before marking DECISION-COMPLETE at execution): `assumptions-expert`
  (proportionality / the inversion-guard adequacy), `config-expert` (fitness-validator config),
  `test-expert` (the DI-seam zone tests), `docs-adr-expert` (the schema ADR + owner-gated-
  abolition PDR + the WS6 doctrine edits).
- **Learning loop / lifecycle:** on completion, run `consolidate-docs`; archive per ADR-117.
