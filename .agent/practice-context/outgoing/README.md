# Outgoing Practice Context — Ephemeral Exchange Only

**Updated 2026-04-22 under PDR-007 + PDR-032.** This directory is
sharpened to **ephemeral exchange context only**. Substance has
five proper homes:

- **Portable Practice governance** (decisions about how the Practice
  itself operates) → `.agent/practice-core/decision-records/` (PDRs).
- **General abstract patterns** (ecosystem-agnostic engineering
  patterns) → `.agent/practice-core/patterns/`.
- **Curated library material** (owner-vetted, evergreen,
  read-to-learn) → `.agent/reference/` per
  [PDR-032](../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md)
  (substantiate / justify / owner-vet gate).
- **Exploratory or synthesis material** (the default landing tier
  for fresh content not promoted to reference) → `.agent/research/`.
- **Ephemeral exchange context** (transient sender→receiver notes
  that expire after integration) → here.

Files whose substance lives nowhere else are **defects** under
PDR-007: they must promote to one of the substantive homes (per
the routing rule in
[PDR-014 §Graduation-target routing](../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)),
or be deleted as staging artefacts.

## What belongs here

Two patterns are legitimate:

1. **Introduction / framing notes** — short files explaining context
   around an outbound Core package (e.g. "this Core includes
   PDR-007; here is how the contract change affects integration").
2. **Repo-targeted write-back packs** — notes from a specific
   integration round that will land in a receiver's `incoming/`,
   be integrated, and then expire.

## Structure

- Flat files at this level for transient broadcasts.
- Repo-targeted subdirectories (with their own `README.md`) for
  write-back packs specific to one source repo or one exchange
  round.

## Current Outgoing Set

### Pattern-shaped candidates awaiting graduation

The following files are pattern-shaped and ecosystem-agnostic;
substance awaits frontmatter reshape for graduation to
`practice-core/patterns/`. Until graduated, they remain here as
staged material. **Disposition decision deferred to Session 7
dedicated pattern-graduation pass** (named trigger captured in
the `memory-feedback` next-session record).

| File | Target | Pending |
| ---- | ------ | ------- |
| `reviewer-gateway-operations.md` | `practice-core/patterns/` | Pattern frontmatter; reshape to use-this-when format |
| `production-reviewer-scaling.md` | `practice-core/patterns/` | Pattern frontmatter; reshape |
| `plan-lifecycle-four-stage.md` | `practice-core/patterns/` | Pattern frontmatter; reshape |
| `practice-maturity-framework.md` | `practice-core/patterns/` | Pattern frontmatter; reshape (Four-level depth-vs-scope model) |
| `two-way-merge-methodology.md` | `practice-core/patterns/` | Pattern frontmatter; reshape (Two-way merge; ancestor tracking) |

## What was removed 2026-04-22 (Session 6 closing arc, Phase C
outgoing triage)

### Batch 1 — substance absorbed elsewhere; deleted

- `three-dimension-fitness-functions.md` — substance covered by
  ADR-144, the repo-wide validator, and `practice-bootstrap.md`.
- `agent-collaboration/` (subdirectory + 3 files) — focused
  write-back from OOCE's 2026-04-05 integration round; round
  complete, exchange concluded.

### Batch 4 — substance absorbed into Practice Core PDR amendment

- `cross-repo-transfer-operations.md` — source-side transfer
  discipline absorbed into PDR-005 §Source-side preservation and
  seeding (amended Session 6, 2026-04-22).
- `seeding-protocol-guidance.md` — seeding-pack composition
  absorbed into PDR-005 §Source-side preservation and seeding.

### Batch 2 — promoted to `.agent/reference/` under PDR-032

The following three files were promoted into the curated library
tier per the PDR-032 substantiate / justify / owner-vet gate:

- `design-token-governance-for-self-contained-ui.md` →
  `.agent/reference/design-token-governance-for-self-contained-ui.md`
- `starter-templates.md` →
  `.agent/reference/starter-templates.md`
- `health-probe-and-policy-spine.md` →
  `.agent/reference/health-probe-and-policy-spine.md`

Promotion justifications are recorded in
[`.agent/reference/README.md`](../../reference/README.md) §Current
contents.

## What was removed earlier (2026-04-18 under PDR-007)

Files whose substance has been captured in Core and therefore no
longer live here:

- Substance absorbed by PDR-004 (`explorations-documentation-tier`),
  PDR-007 (`practice-core-structural-evolution`,
  `practice-decision-records-peer-directory`), PDR-009
  (`cross-platform-surface-integration-guide`), PDR-010
  (`assumption-auditing-meta-level-capability`,
  `frontend-review-cluster-pattern`), PDR-011
  (`continuity-handoff-and-surprise-pipeline`,
  `handover-prompts-vs-session-skills`) — all deleted.
- `architectural-excellence-and-layer-topology` — self-declared
  substance already in `practice-lineage.md` — deleted.
- `unknown-is-type-destruction` — rule already exists in
  `.agent/rules/` — deleted.
- `reviewer-system-guide` — substance absorbed by PDR-009 (three-
  layer architecture) + PDR-010 (triplet / classification / modes)
  — deleted.
- `platform-config-is-infrastructure` — duplicate of
  `memory/active/patterns/platform-config-is-infrastructure.md` which in
  turn has substance in PDR-009 — deleted here.
- `outgoing/patterns/` subdirectory — entire subdirectory deleted
  under PDR-007 (Pattern Exchange folds into Core travel; portable
  patterns travel because they are Core content, not via a
  separate transport surface).

Files moved to `.agent/reference/` (host-local, not exchange) on
2026-04-18 — these were subsequently relocated en bloc to
`.agent/research/notes/` during the 2026-04-22 reformation of
`reference/` per PDR-032; per-file disposition under the
[reference-research-notes-rehoming plan](../../plans/agentic-engineering-enhancements/future/reference-research-notes-rehoming.plan.md):

- `claude-code-hook-activation.md` → `.agent/research/notes/platform-notes/`
- `validation-scripts.md` → `.agent/research/notes/practice-validation-scripts.md`
- `validate-practice-fitness.ts` → `.agent/research/notes/examples/validate-practice-fitness.example.ts`
- `platform-adapter-reference.md` → `.agent/research/notes/platform-adapter-formats.md`

File absorbed into permanent documentation:

- `pattern-schema-for-discoverability.md` — richer frontmatter
  schema now lives in
  `.agent/practice-core/patterns/README.md` §Frontmatter Schema.
