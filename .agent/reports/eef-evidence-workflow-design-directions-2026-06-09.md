# EEF Evidence Workflow — Design Directions Analysis

**Date**: 2026-06-09
**Author session**: Incandescent Smouldering Brazier (claude / Opus 4.8)
**Branch**: `assess/evidence_workflows`
**Status**: Analysis — names decisions and directions; does not make them. **No
plan authored.** This is the discussion follow-on to the
[live value assessment](eef-evidence-workflow-live-value-assessment-2026-06-09.md).

## Update — ADR-194 accepted; A-ii resolved (2026-06-09, later same day)

Two resolutions postdate the analysis below and supersede it where they conflict.

### Product direction crystallised and refined → ADR-194 (Accepted)

Point 4 was authored as
[ADR-194: Teacher-as-Expert Product Boundary](../../docs/architecture/architectural-decisions/194-teacher-as-expert-product-boundary.md)
(Accepted 2026-06-09), with ADR-191 reframed as its server-side engineering
corollary, and propagated to VISION, the curriculum-tools playbook, and the ADR
index. The principle was then **refined on the correct axis**: the boundary is
**decision authority, not initiation**. Presenting evidenced options and
trade-offs — proactively or on request — is informing and is encouraged; what is
forbidden is **making the pedagogical decision that belongs to the teacher**
(instruction, a single prescribed course, a ranking collapsed into a verdict). The
teacher is the pedagogical expert and the authority on what should happen. The
earlier "pedagogical approaches only on explicit request" framing is **withdrawn**
— it constrained the wrong axis (who asks) instead of the real one (who decides).

### A-ii does not survive as a standalone deliverable — it dissolves

Examined under ADR-194, the "A-ii Oak→EEF bridge" is **not a peer deliverable to
the graph work**; it decomposes, and every piece is already owned:

| Half of "the bridge" | Owned by | Note |
| --- | --- | --- |
| Retrieval — bounded misconceptions / prerequisites / keywords for a lesson or unit | `graph-tools-value-redesign` (now unblocked) | The substantive next graph work; it rewrites the very tools A-ii would have touched. |
| Evidence — self-describing, bounded EEF strands | the EEF tool + A-i + C | EEF-tool-local; sets the patterns the redesign then adopts. |
| Connecting reasoning — signal → move → evidence, the teacher deciding | the **agent** (ADR-191/194) + guidance (interpretation resource, ADR-058, process exemplars) | Where the "bridge" happens at runtime. |
| (Optional) a durable authored EEF↔curriculum relationship as **data** | `oak-misconceptions-graph-features §2` + the ontology crosswalk | The only legitimate bridge artefact — data, not request-time reasoning (the ADR-191 carve-out). Demand-gated. |

A standalone A-ii build would either duplicate the redesign or cross the ADR-194
line (a soft situation→strand crosswalk). **Resolution: retire A-ii as a separate
deliverable; promote the graph redesign; run A-i + C on the EEF tool (in progress
this session); leave the connecting reasoning to the agent + guidance.** This
supersedes the "A-ii composes over the redesign" framing in §Point 1 and §Point 3
below.

## Framing: the four points are one structure

The four owner points are not independent items — they form a dependency chain,
and that ordering is the main analytical finding:

- **Point 4 (product direction) is the generator** — the principle that draws the
  line.
- **Point 2 (deterministic transform vs AI analysis) is that exact line** the
  product principle draws.
- **Point 1 (A-i / A-ii / C) must each sit on the correct side** of that line.
- **Point 3 (the graph estate) is the substrate** A-ii composes over and that
  A-i / C set patterns for.

So the resolution order is **4 → 2 → 1 → 3**, not numeric order. The key
consequence: the product direction is the first thing to settle, and it is a
**principle (an ADR), not an executable plan**.

The candidate shorthand for the four surface options, carried from the assessment:

- **A-i** — a schema-driven "answer type / meaning" field on the EEF evidence
  envelope (self-describing epistemic status).
- **A-ii** — derived pedagogical-signal naming on Oak curriculum content (the
  Oak → EEF bridge).
- **A-iii** — worked Oak → EEF exemplars + strengthened workflow prompt (guidance
  scaffold).
- **C** — a bounded verbosity / `detail` projection on `evidence-for-move`.

## Point 4 — the core product direction (the keystone)

The principle already exists **scattered** but has no durable home: as R7 in the
EEF integration strategy ("decision-support, not automatic policy"), as a VISION
non-goal, and — for the server only — as
[ADR-191](../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md)
(deterministic data; the agent is the only reasoner). ADR-191 itself records that
the principle "had no durable home … which is why a two-month-old brief could sit
in the read-order describing the opposite architecture without contradiction" —
the same gap, one level up.

The precise principle, faithful to the owner's words:

> **Teacher-as-expert product boundary.** Oak's curriculum and evidence surfaces
> support teachers with information, resources, and evidence. They never tell a
> teacher how to do their job. The teacher is the driving expert; the system and
> the agent inform — they do not instruct or decide. Pedagogical approaches are
> surfaced only when the teacher explicitly asks, and even then as evidenced
> options with caveats and attribution for the teacher to weigh, never as a
> recommendation, ranking, or instruction. Doing the teacher's pedagogical work
> for them is the failure mode this boundary exists to prevent.

Relationship to existing doctrine:

- **ADR-191 is the *engineering corollary*** — the server-side expression ("no
  server-side ranking, scoring, recommendation, or situation→item mapping"). The
  product principle is broader: it also binds the **agent and the guidance** (the
  agent must not volunteer "how to teach"), which ADR-191 does not reach.
- The product principle is the **generator** ADR-191 was derived from but never
  named.

**Recommended home**: a new first-class product-direction ADR (next free number is
194; ADR-191 reframed as "the engineering corollary of ADR-194"), cross-linked
from VISION's Non-Goals. It is the test every surface change below must pass, so
it is settled **before** any A-i / A-ii / C work, and it is a `docs-adr-expert` +
owner-ratification item — not authored unilaterally.

## Point 2 — A-iii and the deterministic / analysis boundary

The owner's concern that A-iii blurs deterministic data transform and AI analysis
is correct, and point 4 resolves it. The boundary **is** the line the product
principle draws:

- **Deterministic side (data — allowed):** naming *what is present in the data*.
  "This lesson record contains these misconceptions." "This unit has these
  prerequisite units." "This strand has insufficient evidence / is debunked."
  Pure projection. **A-i and A-ii live here — but only if they strictly name
  what is present.**
- **Analysis side (agent-only, at runtime — never baked):** inferring *what to
  do*. "This misconception is a feedback opportunity." "Use the feedback strand
  here." That is pedagogical analysis. It must never be baked into data **or**
  into guidance-as-content; the agent does it at runtime, transparently, per
  ADR-191 — and only on a teacher's explicit ask, per point 4.

**Consequence for A-iii**: it survives **only as *process* exemplars, never as
*content* mappings.** A worked example that models the discipline (surface signal
→ name the move → present evidenced options with caveats and attribution → teacher
decides) is deterministic-side and is fine — the interpretation resource already
carries faithful/unfaithful examples of this shape. A worked example that
hard-codes a specific *signal → strand inference* crosses the line: it bakes
pedagogical judgement into authoritative-looking content (the blur), and violates
point 4. **A-iii is therefore not a build; it is a guidance-discipline
clarification governed by the product principle.** The boundary the owner felt is
real, and it is precisely "inform (name what is present) vs instruct (infer what
to do)."

## Point 1 — A-i, A-ii, C "in current scope", with one grounded correction

- **A-i and C are clean.** Both are EEF-tool-local — `get-eef-evidence` and the
  `EefEvidenceEnvelope` interface in
  `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-evidence.ts` — both sit on
  the deterministic side, and C needs only to coordinate with
  `eef-tool-metric-filter-inputs` (same input schema). No collision.
- **A-ii is not independent — grounding changed the picture.** A-ii would touch
  `aggregated-misconception-graph.ts` and `aggregated-prior-knowledge-graph.ts` —
  the exact tools that `graph-tools-value-redesign` rewrites onto the substrate —
  and its intent overlaps `oak-misconceptions-graph-features §2` (EEF cross-corpus
  composition), which already homes the misconception ↔ EEF bridge. Building A-ii
  standalone now, on tools about to be rewritten, would collide with both. A-ii
  stays in scope as **intent**, but its **execution composes over the redesigned
  bounded tools** (the bridge layer sits on top), rather than preceding the
  redesign.

So the honest shape of "current scope" is: **A-i + C ready now; A-ii sequenced
with the graph redesign.**

## Point 3 — the future graph plans, characterised

Two distinct kinds of "graph" (per the knowledge-graph-integration README's
terminology note):

### (a) Bulk-derived JSON graphs

Misconception, prior-knowledge, thread-progressions, keywords — the whole-corpus
dumps confirmed unqueryable in the assessment.

| Plan | Lane | What it is | Status |
| --- | --- | --- | --- |
| `graph-tools-value-redesign` | future | **The central one.** Redesigns all four whole-corpus tools onto `graph-corpus-sdk` — bounded, anchored retrieval; kills the flood. One bulk graph surfaced as views; defines the heterogeneous node/edge model. ADR-191-aligned. | **Unblocked now** — trigger was "EEF D6 landed + D7 green"; both met. Promotable. |
| `eef-revalidate-on-new-graph-tools` | future (EEF) | Re-runs the EEF value path once the curriculum tools are redesigned. | Downstream; the redesign is its single upstream. |
| `oak-misconceptions-graph-features` | future | §1 (bounded subgraph) **folded into the redesign**; §2 (EEF cross-corpus — the misconception ↔ EEF bridge), §3 (free-text topic resolution), §4 (extended contexts) remain. | §2–§4 gated on redesign + D7. **§2 is where A-ii's bridge already partly lives.** |
| `eef-tool-metric-filter-inputs` | future (EEF) | Exact-value headline-metric filters on `get-eef-evidence`. | Trigger D7 green + observed usage; touches the same input schema as C. |

### (b) Formal Oak Curriculum Ontology

Separate repo, W3C / RDF, consumed as a pinned TTL release. Disjoint identity from
the bulk data (only *threads* join, on slug); cross-source lesson/unit work is
blocked on an upstream `curric:slug` bridge. Surfaces: `oak-kg-threads-surface`
(lead candidate), `nc-knowledge-taxonomy-surface`, `cross-source-journeys`, plus a
backlog (schema browser, IRI traverser, lesson / programme surfaces). All gated on
the substrate Threads adapter (`graph-stack` WS4.2). **Out of this work's path.**

### Substrate / estate

`active/graph-stack.plan.md` (the graph workspaces: `graph-core`, `graph-ingest`,
`graph-project`, `graph-corpus-sdk`) and `current/graph-estate-consolidation.plan.md`
(master cleanup; owns the Judgement-call-4 that authored the redesign).

### Synergy verdict

The graph plans benefit from this work, and the relationship is precise:

- **A-i and C are cross-cutting patterns the redesign should adopt.** The EEF tool
  is already the reference for "queryable subgraph + frontier"; A-i / C make it
  the reference for "self-describing meaning + bounded verbosity." This work
  *feeds* the redesign — it sets the patterns the redesign applies to the four
  curriculum tools at scale.
- **A-ii composes over the redesign**, overlapping `misconceptions-graph-features
  §2`.
- The clean dependency chain: **product principle (point 4) → A-i + C on the EEF
  tool (set the patterns) → graph redesign (now unblocked) as substrate → A-ii as
  the bridge layer on top.**

## Where this leaves us

No plan authored. The four points resolve to one move: **settle the product
direction (point 4) as an ADR first** — it is the generator that draws point 2's
line and governs how A-i / A-ii / C are built. A-i + C are clean and ready behind
it; A-ii sequences with the now-unblocked graph redesign.

**Proposed next step**: draft the product-direction ADR (194) — the principle text
above, with ADR-191 reframed as its engineering corollary and a VISION cross-link
— for owner review. It is the keystone everything else hangs off, and a far
smaller, sharper artefact than a plan.

## Grounding

- Live EEF surface exercised on `oak-prod` 2026-06-09 (see the companion
  assessment).
- Plans read first-hand:
  `graph-tools-value-redesign.plan.md`, `oak-misconceptions-graph-features.plan.md`,
  `eef-tool-metric-filter-inputs.plan.md`, `eef-standalone-evidence-workflows.plan.md`,
  `evidence-integration-strategy.md`, the EEF and knowledge-graph-integration
  READMEs.
- ADRs read first-hand:
  [ADR-191](../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md);
  [VISION](../../VISION.md).
- Code landing paths anchored:
  `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-evidence.ts`
  (`EefEvidenceEnvelope`); `packages/sdks/oak-curriculum-sdk/src/mcp/`
  (`aggregated-eef-evidence.ts`, `aggregated-misconception-graph.ts`,
  `aggregated-prior-knowledge-graph.ts`, `eef-interpretation-resource.ts`,
  `universal-tools/`).
