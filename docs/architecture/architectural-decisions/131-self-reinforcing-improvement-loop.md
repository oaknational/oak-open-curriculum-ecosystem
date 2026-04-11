# ADR-131: Self-Reinforcing Improvement Loop

**Status**: Accepted
**Date**: 2026-03-08
**Related**: [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-124 (Practice Propagation Model)](124-practice-propagation-model.md), [ADR-144 (Two-Threshold Fitness Model)](144-two-threshold-fitness-model.md), [How the Agentic Engineering System Works](../../foundation/agentic-engineering-system.md) (human-readable engineering narrative)

## Context

ADR-119 names the Practice's recursive self-improvement property and
points to `practice.md` for mechanism detail. ADR-124 specifies how
the Practice travels between repos. `practice.md`
(`.agent/practice-core/practice.md`) documents the Knowledge Flow —
the five-stage cycle, fitness governors, and feedback properties — as
operational guidance. `practice-lineage.md` names the "self-applicable"
property alongside the related "self-replicating" property.

What is not recorded in any of these is: (a) the full map of
mechanism-to-mechanism interactions that form the closed circuit, (b)
the role of the `consolidate-docs` command
(`.agent/commands/consolidate-docs.md`) as the convergence point where
intra-repo graduation, inter-repo integration, and fitness regulation
all meet, and (c) the practical impact of the loop — enabling agentic
engineering speed and optionality without sacrificing quality.

## Decision

### The Improvement Loop Is a Deliberate Architectural Pattern

The Practice contains a closed improvement loop. The stages, fitness
governors, and audience progression are documented in `practice.md`
§The Knowledge Flow. This ADR records two additional architectural
properties: the interaction map and the self-referential quality.

### Interaction Points Between Mechanisms

The Knowledge Flow stages do not operate in isolation. The cycle
diagram in `practice.md` §The Knowledge Flow shows the stage
progression; the table below maps the full set of interactions between
artefacts and mechanisms, including edges that are implicit in the
existing operational documentation:

| From              | To                        | Interaction                                                                                                                            |
| ----------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Napkin            | Distilled                 | Distillation extracts high-signal content                                                                                              |
| Distilled         | Permanent docs            | Consolidation graduates settled entries                                                                                                |
| Distilled         | Practice-core             | Meta-principles graduate to Learned Principles                                                                                         |
| Permanent docs    | Rules                     | Principles become enforceable rule extractions                                                                                         |
| Rules             | Work                      | Governed work generates new learning                                                                                                   |
| Work              | Napkin                    | Mistakes and discoveries are captured continuously                                                                                     |
| Practice box      | Practice-core             | Integration flow merges incoming material (ADR-124)                                                                                    |
| Practice-core     | Practice box (other repo) | Plasmid exchange carries evolved files (ADR-124)                                                                                       |
| Experience files  | Distilled/permanent docs  | Consolidation extracts matured technical patterns                                                                                      |
| Code patterns     | Work                      | Proven abstractions inform implementation                                                                                              |
| Fitness functions | All stages                | Governors trigger distillation, graduation, tightening (see [ADR-144](144-two-threshold-fitness-model.md) for the two-threshold model) |

### Consolidate-Docs as the Convergence Point

The `consolidate-docs` command (`.agent/commands/consolidate-docs.md`)
is where the intra-repo loop, the inter-repo loop, and the fitness
regulation system all converge in a single workflow. It drives
graduation (ephemeral to permanent), processes the practice box
(inter-repo integration via ADR-124), checks fitness ceilings across
all governed documents, and extracts code patterns — four distinct
convergence roles in one command.

Without consolidation, the loop stalls at refinement: distilled
knowledge accumulates but never becomes permanent documentation and
never evolves the Practice itself.

### The Self-Referential Property

`practice-lineage.md` names this as "self-applicable" — the rules that
enforce the Practice are themselves subject to the same evolution
process. The diagnostic implications:

- If the **napkin** stops capturing mistakes about the loop itself,
  the capture stage has degraded
- If **distillation** cannot extract patterns about distillation
  quality, the refinement stage is too narrow
- If **consolidation** never graduates insights about consolidation
  (such as this ADR), the graduation stage has stalled
- If **rules about rule creation** cannot be refined through the same
  loop (e.g. "if a behaviour must be automatic, it needs a rule, not
  just a skill"), the enforcement stage is exempt from its own
  governance

These are diagnostic signals. If any of them holds, a link in the loop
is broken.

### Inter-Repo Dimension

The intra-repo loop extends across repositories via plasmid exchange
(ADR-124). The architectural consequence: different contexts
stress-test the Practice in ways a single repo cannot. A short-lived
POC discovers that the minimum viable roster is three reviewers, not
fourteen. A production repo discovers that fitness functions need to
extend beyond the trinity files. These discoveries travel back as
evolved practice-core files and are integrated during consolidation.

The loop is therefore self-replicating: a receiving repo inherits the
mechanism that produces rules, not just the rules themselves.

## Consequences

### Positive

- The interaction map makes the full circuit visible, aiding diagnosis
  when a link in the loop degrades silently
- The consolidation convergence point is named, clarifying why skipping
  consolidation has disproportionate impact
- The self-referential diagnostic signals provide a concrete checklist
  for assessing loop health
- The impact is explicit: the loop enables agentic engineering at speed
  and with optionality, without sacrificing quality, while minimising
  the loss of visibility that comes from delegating to agents

### Negative

- The inter-repo loop has been exercised across four repos
  (oak-mcp-ecosystem, cloudinary-icon-ingest-poc, new-cv, castr)
  with eight provenance entries; the pattern is validated but
  adoption beyond the originating developer is not yet proven

### Neutral

- This ADR records architectural properties not captured by the
  existing operational documentation. The operational detail remains
  in `practice.md` (`.agent/practice-core/practice.md`) §The
  Knowledge Flow and the consolidate-docs command
  (`.agent/commands/consolidate-docs.md`), which contains the
  distillation protocol inline
