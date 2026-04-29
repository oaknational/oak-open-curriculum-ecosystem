# Phase 0 — Live-Reference Ledger (practice-core-surface-retirement)

**Generated**: 2026-04-29 by Nebulous Illuminating Satellite
**Owning plan**:
[`practice-core-surface-retirement.plan.md`](practice-core-surface-retirement.plan.md)

## Directory inventory

### `.agent/practice-core/patterns/`

```text
.agent/practice-core/patterns/README.md
```

Contents: README only (no `.gitkeep`, no authored patterns). README is
schema + scope statement (5223 bytes); the four candidate-future-syntheses
named in the README ("strict-types-at-boundaries",
"infrastructure-never-masks-business", "rate-limit-amplification-vectors",
"explicit-DI-over-ambient-state") have not been authored.

**Disposition**: `delete-with-directory`. No salvage required.

### `.agent/practice-context/`

```text
.agent/practice-context/README.md
.agent/practice-context/incoming/.gitkeep
.agent/practice-context/outgoing/README.md
```

- `README.md`: meta-documentation (761 bytes); no substance, only describes
  the surface. Disposition: `delete-with-directory`.
- `incoming/.gitkeep`: zero-byte. Disposition: `delete-with-directory`.
- `outgoing/README.md`: 10216 bytes; contains a "What was removed"
  routing-log of completed retirements with cross-references to where
  substance landed (PDR-005, PDR-007, PDR-009, PDR-010, PDR-012,
  PDR-014, PDR-024, PDR-032, ADR-144, `.agent/reference/`,
  `.agent/research/`). The substance is duplicated in the targets
  cited; the routing-log inventory itself is unique. **Disposition**:
  `salvage-then-delete`. Salvage destination: `.agent/practice-core/CHANGELOG.md`
  appendix or `.agent/memory/operational/archive/practice-context-routing-log-2026-04-29.md`.

### `.agent/practice-core/incoming/`

```text
.agent/practice-core/incoming/.gitkeep
```

Empty (just `.gitkeep`). **Not retired** — incoming/ is preserved per
the retirement plan's non-goals. No action.

## Live-reference classification

The reference scan (`rg` command in plan §Phase 0 Deterministic
validation) returned 308 hits across the repo. Files grouped by
disposition:

### `live-update` (must edit before deletion can land)

Validators / scripts:

- `scripts/validate-fitness-vocabulary.ts`
- `scripts/validate-fitness-vocabulary.unit.test.ts`
- `scripts/validate-practice-fitness.ts`

Practice Core surfaces (Phase 1 scope):

- `.agent/practice-core/practice.md`
- `.agent/practice-core/practice-verification.md`
- `.agent/practice-core/index.md`
- `.agent/practice-core/README.md`
- `.agent/practice-core/decision-records/README.md`
- `.agent/practice-core/decision-records/PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md`
- `.agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md`
- `.agent/practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md`
- `.agent/practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md`
- `.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md`
- `.agent/practice-core/decision-records/PDR-001-location-of-practice-decision-records.md`
- `.agent/practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md`
- `.agent/practice-core/provenance.yml`

Practice / repo navigation (Phase 2 scope):

- `.agent/skills/patterns/SKILL.md`
- `.agent/commands/consolidate-docs.md` (already covered in this pass)
- `.agent/commands/ephemeral-to-permanent-homing.md`
- `.agent/practice-index.md` (verify exists)
- `.agent/README.md`
- `.agent/memory/active/patterns/README.md`
- `.agent/plans/agentic-engineering-enhancements/README.md`
- `.agent/plans/agentic-engineering-enhancements/current/README.md`
- `.agent/plans/agentic-engineering-enhancements/roadmap.md`
- `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
- `.agent/plans/agentic-engineering-enhancements/current/agentic-corpus-discoverability-and-deep-dive-hub.plan.md`
- `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
- `.agent/reference/README.md`

Live ADRs:

- `docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md`
- (potentially) ADR-124 — verify reference shape

### `historical-keep` (preserve as-is)

- `.agent/experience/2026-04-18-seam-definition-precedes-migration.md`
- `.agent/experience/2026-04-17-the-language-that-hides-scope.md`
- `.agent/state/collaboration/shared-comms-log.md`
- `.agent/state/collaboration/active-claims.json` (active claim
  references — these resolve naturally when claims close)
- `.agent/state/collaboration/comms/events/fe4acc7e-coord-pearly-2026-04-29-15-50.json`
  (just-authored coordination event; historical record)
- `.agent/analysis/governance-concepts-and-mechanism-gap-baseline.md`
- `.agent/research/**` (historical research; preserved)
- `.agent/plans/agentic-engineering-enhancements/current/practice-core-surface-retirement.plan.md`
  (this plan itself; references are intentional)

### `delete-with-directory`

- `.agent/practice-core/patterns/README.md` (deleted with the directory)
- `.agent/practice-context/README.md` (deleted with the directory)
- `.agent/practice-context/incoming/.gitkeep` (deleted with the directory)
- `.agent/practice-context/outgoing/README.md` (salvage routing log
  first, then deleted with the directory)

## Acceptance criteria summary

1. ✅ `.agent/practice-core/patterns/` contains only its README.
2. ✅ `.agent/practice-context/` contains only README files and `.gitkeep`.
3. ✅ `.agent/practice-core/incoming/` has no staged material except
   `.gitkeep`.
4. ✅ Every live reference classified (live-update / historical-keep /
   delete-with-directory).
5. ✅ Historical/provenance references preserved unless part of live
   navigation.

Phase 0 complete. Proceeding to Phase 1 (Core doctrine amendments).
