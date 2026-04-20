# Outgoing Practice Context — Ephemeral Exchange Only

**Updated 2026-04-18 under PDR-007.** This directory is sharpened to
**ephemeral exchange context only**. Substance has four proper
homes:

- **Portable Practice governance** (decisions about how the Practice
  itself operates) → `.agent/practice-core/decision-records/` (PDRs).
- **General abstract patterns** (ecosystem-agnostic engineering
  patterns) → `.agent/practice-core/patterns/`.
- **Host-local reference material** (ecosystem-specific examples,
  platform-specific notes, scripts) → `.agent/reference/`.
- **Ephemeral exchange context** (transient sender→receiver notes
  that expire after integration) → here.

Files whose substance lives nowhere else are **defects** under
PDR-007: they must either promote to one of the three substantive
homes, or be deleted as staging artefacts.

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

### Repo-Targeted Packs

| Path | Purpose |
| ---- | ------- |
| `agent-collaboration/` | Focused write-back from OOCE's 2026-04-05 integration of incoming `agent-collaboration` notes; captures the strongest gate/workspace-adoption signals and outgoing-pack hygiene feedback |

### Future-PDR Candidates (substance not yet captured; drafting pending)

Each file here has substance that warrants a PDR but is not yet
drafted. The file remains as staged material; the named PDR slot is
reserved for when drafting happens.

| File | Reserved PDR | Substance shape |
| ---- | ------------ | --------------- |
| `three-dimension-fitness-functions.md` | PDR-026 (Three-Zone Fitness Model) | Fitness-zone discipline; CRITICAL_RATIO; loop-health diagnostic |
| `cross-repo-transfer-operations.md` | PDR-027 (Transfer Operations) | Operational lessons for cross-repo Practice transfers |
| `seeding-protocol-guidance.md` | PDR-027 (candidate to merge with transfer ops) | Seeding-bundle composition; sender-side discipline |
| `two-way-merge-methodology.md` | PDR-028 (Core Integration Mechanics) | Two-way merge; ancestor tracking; divergence reconciliation |
| `practice-maturity-framework.md` | PDR-029 (Practice Maturity Diagnostic) | Four-level depth-vs-scope model |

*Reservations shifted +1 on 2026-04-19 when PDR-025 Quality-Gate
Dismissal Discipline landed from a consolidation pass. The four
slots remain open pending drafting.*

### Future-Pattern Candidates (pattern-shaped; need frontmatter addition to graduate)

Substance is pattern-shaped and ecosystem-agnostic; awaits
frontmatter reshape for graduation to `practice-core/patterns/`.
Until graduated, remains here as staged material.

| File | Target | Pending |
| ---- | ------ | ------- |
| `reviewer-gateway-operations.md` | `practice-core/patterns/` | Pattern frontmatter; reshape to use-this-when format |
| `production-reviewer-scaling.md` | `practice-core/patterns/` | Pattern frontmatter; reshape |
| `plan-lifecycle-four-stage.md` | `practice-core/patterns/` | Pattern frontmatter; reshape |

### Genuinely Ephemeral Exchange

Transient material whose expiry is part of its design. Stays here
until the associated exchange round completes.

| File | Purpose |
| ---- | ------- |
| `design-token-governance-for-self-contained-ui.md` | Domain-specific (UI tokens) — short-lived cross-repo exchange context |
| `starter-templates.md` | Minimum-viable-reviewer templates as starter material for new repos |
| `health-probe-and-policy-spine.md` | Operational exchange note; domain-specific; not yet matured into pattern |

## What was removed 2026-04-18 (under PDR-007)

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

Files moved to `.agent/reference/` (host-local, not exchange):

- `claude-code-hook-activation.md` → `.agent/reference/platform-notes/`
- `validation-scripts.md` → `.agent/reference/practice-validation-scripts.md`
- `validate-practice-fitness.ts` → `.agent/reference/examples/validate-practice-fitness.example.ts`
- `platform-adapter-reference.md` → `.agent/reference/platform-adapter-formats.md`

File absorbed into permanent documentation:

- `pattern-schema-for-discoverability.md` — richer frontmatter
  schema now lives in
  `.agent/practice-core/patterns/README.md` §Frontmatter Schema.
