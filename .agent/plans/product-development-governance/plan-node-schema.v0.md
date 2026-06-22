# `plan` Node-Schema — V0 Specification

**FRAMING UPDATE (2026-06-22, [ADR-200](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)).**
This schema's _structure_ stands and is reused — it is the **plan-layer projection schema**, the form the
**new strategy-aligned plans are authored to** (the V0-bridge in ADR-200 §Consequences). What is
**superseded** is the framing below of V0 as a "pre-survey hypothesis the survey tests against the estate"
(the §0 V0 → survey → V1 conformance loop): there is **no survey-and-conform pass**. The work is a
planning-estate rewrite on a living idea-graph; the "survey" is the **idea-harvest**, and V0 is the form
plans take, not a rubric old plans are scored against. Read ADR-200 first; treat the §0 loop below as
historical context, not the active method.

> **Node-schema #1 of the repo intent graph.** This is the `plan` node-type's
> contract: its frontmatter fields, its orthogonal state model, and its typed
> edges — together with the **shape** of the graph contract it composes into.
>
> **Status: V0 — decision-complete as V0, explicitly pre-survey.** Every
> decision below is stated definitely (no "TBD", no "decide at execution
> time"). V0 is not a draft to be filled in later; it is a **falsifiable
> hypothesis** the [deep plan-estate survey](./future/deep-plan-estate-survey.plan.md)
> tests against the real estate. The survey grounds **V1** by _additively
> refining_ this contract where the estate proves it incomplete. See
> [§0](#0-the-v0--survey--v1-contract).
>
> **Authority.** This spec is delivered by **Stage 1.2** of the
> [repo intent graph plan](./future/repo-intent-graph.plan.md) and consumed by
> the [controlling plan's](./vision-strategy-and-plan-estate.plan.md) **Body 3**
> as its conformance standard (Anchor B). It reconciles
> [PDR-018](../../practice-core/decision-records/PDR-018-planning-discipline.md),
> [ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md),
> the [plan templates](../templates/README.md), and the emergent frontmatter
> reality. The human-facing governance calls (the closed enum _values_ for the
> human-facing axes, the folder collapse, and the default gate-expiry horizon) are
> **owner-signed**: V0 records the settled outcome for each below; the enum
> _members_ remain survey-may-add (additive only).
>
> **This doc is itself a `spec` node-type, not a `plan`** — node-schema #1 does
> not self-govern this file. The `spec` node-type is reserved in the registry
> ([§5](#5-the-graph-contract-shape-it-composes-into)); its own schema is a later
> stage.

---

## 0. The V0 → survey → V1 contract

V0's job is **not to be correct about the estate** — the estate has not been
surveyed yet. V0's job is to be a **definite, complete, checkable shape** so the
survey has something exact to confirm or refute, and so the Stage-1 build has a
contract to transcribe into Zod. A V0 that hedged every field would be useless
as a lens; a V0 that pretended finality would misrepresent its pre-survey
status. The resolution: **state every decision definitely, and annotate each
with its refinement-exposure.** Honesty lives in marking _the axis along which
V1 may grow_, not in leaving V0 vague.

Every decision in this spec carries one of four exposure tags:

| Tag | Meaning | Who changes it, and how |
| --- | --- | --- |
| **LOCKED** | The model/shape. V1 will not change it without re-ratifying the six pillars. | Owner re-ratification only. |
| **SURVEY-MAY-ADD-VALUES** | A closed enum whose _members_ the survey may extend additively (never renumber/reuse). | The Stage-2 survey, additively. |
| **SURVEY-MAY-ADD-FIELDS/EDGES** | The survey may prove a new field or edge is genuinely real in the estate. | The Stage-2 survey, additively. |
| **OWNER-RESERVED** | A governance call the owner has reserved. V0 records its verdict and evidence; the owner signs off. | Owner sign-off (survey-grounded). |

This mirrors the intent-graph plan's "**contract is v1 and additive**" rule and
the strategic-choice IDs' stable/additive/resolvable discipline: a closed Zod
enum the survey adds _members_ to — never an open `string` that re-admits the
drift V0 exists to kill.

**The loop:** V0 (this doc) → the survey reads the estate against V0 (the
observe-mode extractor's output **plus** the reviewed multi-agent qualitative
pass) → V0's gaps and mis-fits become additive refinements → **V1** is ratified
at the close of Stage 2, grounded in what the estate actually contains.

**The survey may challenge a LOCKED decision.** LOCKED means "V1 will not change it without
re-ratifying the six pillars" — it does **not** mean the survey must conform to it silently. If the
estate yields strong evidence against a LOCKED decision, the survey surfaces it as an **owner
re-ratification candidate**, not a suppressed signal. The lens must never hide a real signal to
protect its own model (warning-signals-are-verdicts; the survey brief's "let the estate speak").
This is exactly the kind of finding the survey is _wanted_ to produce.

---

## 1. The `plan` node-type

A **plan** is the node-type that carries _intended work and the durable intent
behind it_: what user-impact outcome is sought (end goal), why the means produce
it (mechanism), and the work itself (means) — per PDR-018. It is the first
node-type built because it also unlocks the plan-estate survey and restructure.

- **Identity.** A plan is one node, identified by a stable slug (`id`). Its file
  is the human-navigable projection; its frontmatter-and-edges are the
  governing truth (dual legibility, Pillar 4). The node is **author-agnostic** —
  it records intended work, not who or what will do it; attribution is via edges
  and external identity, so the contract serves one developer, many agents, a
  single agent, or a developer with minimal agentic support identically (the
  multi-developer transition;
  [§5.5](#55-closing-the-loop--returning-evidence-and-the-multi-developer-transition)).
- **Authority role.** A plan is a _consumer_ of authority, never a source of it.
  It **traces upward** to a strategic choice (→ vision → Oak goal) via
  `serves_strategic_choice`, and **derives from** ADRs/strategy via
  `derives_from`. A plan never holds an authority edge _into_ strategy, vision,
  or an ADR; and a continuity record is never citable as a plan's scope
  authority (Pillar 3).
- **Lifecycle.** A plan's durable state is carried by the orthogonal axes
  ([§3](#3-the-orthogonal-axes-state-model)); its live execution state is
  _projected from Linear_, not stored. Its place in the folder tree _navigates_;
  its metadata _governs_.

`plan` ≈ a Linear **Project** (a goal-bearing body with constituent issues), not
a single epic-issue: strategic choice ≈ Initiative, plan ≈ Project,
workstream/cycle ≈ Issue/sub-issue (Pillar 6 mapping).

---

## 2. Frontmatter contract

The canonical field set for a `plan` node. "Required for" names when the field
is mandatory; an executable plan is the strict case. Reconciliation notes show
what emergent key each field replaces (counts are first-hand over 284
non-archive `*.plan.md` files unless marked _census_).

### 2.1 Identity and human-facing

| Field | Type | Required for | Exposure | Reconciliation |
| --- | --- | --- | --- | --- |
| `id` | `string` (kebab slug, stable) | all | LOCKED | Canonical for emergent `plan_id` (11). The node's graph identity; never renumbered or reused once published. |
| `node_type` | literal `"plan"` | all | LOCKED | New. The registry discriminator that makes this a typed node. **Replaces** the open `type:` free-label (14 distinct values: `executable`, `seed`, `governance-delivery`, `future-strategic-stub`, …). Domain/kind information moves to `kind` ([§3](#3-the-orthogonal-axes-state-model)). |
| `name` | `string` | all | LOCKED | Canonical (ADR-117 §6 mandates `name`; 227 files use it). **Migrate** emergent `title:` (14) → `name`. |
| `overview` | `string` (one line) | all | LOCKED | Keep (ADR-117 §6; 213 files). One-line scope. The end-goal/mechanism/means narrative lives in the **body** (PDR-018), not frontmatter. |

### 2.2 State

The overloaded emergent `status:` field (≈30 distinct first-hand values; 46
_census_ — conflating readiness, lane, execution, disposition, and blocking,
plus emoji and whole-paragraph prose) is **replaced** by three durable axes plus
one projected axis. `lifecycle:` (14, redundant with folder + `kind`) and
`isProject` (107 first-hand / 250 _census_, defined in no doctrine) are
**dropped**.

| Field | Type | Required for | Exposure | Reconciliation |
| --- | --- | --- | --- | --- |
| `kind` | enum `strategic \| executable` | all | model LOCKED; values LOCKED | The honest name for the `future`↔`current` _readiness_ jump. **Replaces** the readiness senses of `status:` (`strategic-brief`, `strategic`, `future-strategic`, `exploration`, …). |
| `disposition` | enum (see [§3.3](#33-terminal-disposition)) | terminal plans only | model LOCKED; values owner-signed (SURVEY-MAY-ADD-VALUES) | **Replaces** the terminal senses of `status:` (`completed`, `complete`, `🟢 COMPLETE`, `superseded`, …). Absent until the plan reaches a terminal state. |
| `gate` | object `{ awaiting, clears_when, expires }` or absent | optional, any | model LOCKED; `awaiting` values owner-signed (SURVEY-MAY-ADD-VALUES); default expiry 30 days | **Replaces** the blocked senses of `status:` (`DRAFT — pending owner approval`, owner-stop strings) — but as an _expiring_ gate, never an open holding state. See [§3.4](#34-gate--an-expiring-block-not-a-holding-state). |

**Execution status is deliberately NOT a durable frontmatter field.** It is
`backlog \| in_progress \| done`, owned by Linear and **projected** via the
`projects_to` edge ([§4](#4-typed-edges)). Storing it in the repo is what
created the `current`↔`active` drift; removing it is what makes the Linear
mapping clean. (LOCKED decision; the value enum is Linear-owned.)

### 2.3 Typed edges (declared in frontmatter, defined in [§4](#4-typed-edges))

| Field | Type | Required for | Exposure |
| --- | --- | --- | --- |
| `serves_strategic_choice` | strategic-choice ID, or `"pending"` | executable (required); strategic (recommended) | LOCKED shape |
| `derives_from` | list of ADR/strategy refs | optional | LOCKED shape |
| `supersedes` / `superseded_by` | plan ref(s) | `superseded_by` required when `disposition: superseded` | LOCKED shape |
| `depends_on` | list of `{ plan, kind: blocking \| beneficial }` | optional | LOCKED shape |
| `thread` | thread slug | recommended | LOCKED shape |
| `projects_to` | external Linear node ref | optional; built in a later stage | LOCKED shape (reserved) |

### 2.4 Kind-specific and housekeeping

| Field | Type | Required for | Exposure | Reconciliation |
| --- | --- | --- | --- | --- |
| `todos` | list of `{ id, content, status: pending \| completed }` | executable | LOCKED | Keep (ADR-117 §6; 750 _census_). Forbidden on `strategic` plans. |
| `promotion_trigger` | `string` | strategic | LOCKED | Keep (ADR-117 §5; 15 _census_). The condition that promotes the plan to executable. Forbidden on `executable` plans. |
| `last_updated` | `string` (ISO date) | all | LOCKED | Keep (32 first-hand). **Folds in** emergent `created`/`date`/`branch` housekeeping drift. |
| `related` | list of refs | optional | LOCKED | Keep, **but narrowed**: `related` is the _untyped, non-authoritative_ "see also". All authority/traceability/dependency relationships use the typed edges above, never `related`. |

### 2.5 Explicitly dropped or deferred emergent keys

| Emergent key | Count | V0 disposition |
| --- | --- | --- |
| `status` | 386 _census_ | **Dropped** — split into `kind` / `disposition` / `gate` / the projected execution axis. |
| `lifecycle` | 14 | **Dropped** — folder + `kind` carry it. |
| `isProject` | 107 / 250 _census_ | **Dropped** — `plan` ≈ Linear Project is universal; the projection is the `projects_to` edge, not a boolean. |
| `type` | 49 _census_ | **Dropped as free-label** — replaced by `node_type` + `kind`. |
| `collection` / `lane` | 30 / 34 _census_ | **Dropped** — folder location is the projection; metadata does not duplicate it. |
| `foundational_adr` / `foundation_alignment` | 17 / 7 _census_ | **Reconciled** → the `derives_from` edge (target: ADR). This is why `derives_from` scored 0 under its own name. |
| `parent_plan` | 14 / 46 _census_ | **SURVEY-MAY-ADD-EDGES** — the survey verifies whether genuine _containment_ exists distinct from `depends_on`/`supersedes`. Not locked in V0 (a present key is not a graph identity). |
| `specialist_reviewer(s)` | 43 / 5 _census_ | **SURVEY-MAY-ADD-FIELDS** — review-provenance, not an edge to another node. The survey decides whether to formalise it as a field. |
| `graph_layer` | 36 _census_ | **Out of contract** — domain-specific metadata for graph-stack plans; not part of the general `plan` node-type. A plan MAY carry domain extension keys outside this contract; the validator ignores them in V0. |

---

## 3. The orthogonal-axes state model

The `future`/`current`/`active` lanes confused because they collapsed two
different questions into one sequence: `future`→`current` is a **readiness**
jump (intent → executable); `current`→`active` is an **execution-state** jump
(queued → in-progress). Modelling state as one nested status is the
**combinatorial trap** the suggestions warned against ("do not collapse status /
lifecycle / execution / evidence state"). V0 models state as **orthogonal axes**,
each a small closed enum.

### 3.1 Kind / readiness — durable, repo `[LOCKED]`

```text
strategic   — intent, not yet executable (no TDD cycles); carries promotion_trigger
executable  — has TDD cycles / workstreams; carries todos
```

The honest name for `future`↔`current`. Locked at two values.

### 3.2 Execution status — live, Linear-projected, NOT stored `[LOCKED decision; Linear-owned values]`

```text
backlog → in_progress → done
```

Where `active` belonged. **Not a durable frontmatter field**: the repo projects
to a Linear Project (the Pillar-6 `projects_to` edge) and Linear owns the live
value. This removes the `current`↔`active` confusion _and_ the drift of a
hand-edited "in-progress" that no one updates.

### 3.3 Terminal disposition

**Durable, repo · model LOCKED · values owner-signed (SURVEY-MAY-ADD-VALUES).**
Present only once the plan reaches a terminal state:

```text
done                    — delivered; acceptance proven
superseded              — replaced; REQUIRES a superseded_by edge to the successor
extracted-and-archived  — partial value mined into permanent docs; archived
cancelled               — won't-do; no successor (owner decision; recoverable from git/archive)
```

The model (a separate terminal axis) is LOCKED. The four value strings are
**owner-signed**, taken directly from the ratified intent-graph plan; the closed
enum _membership_ remains survey-may-add (additive only).

### 3.4 Gate — an expiring block, not a holding state

**Durable, repo · model LOCKED · `awaiting` values owner-signed (SURVEY-MAY-ADD-VALUES).**
There is **no open-ended "paused" state.** The repo's own doctrine
([`no-hedging-vocabulary.md`](../../rules/no-hedging-vocabulary.md)) is explicit:
work is either a live deliverable with _named dependencies and an owner-agreed
gate_, or it is removed by owner decision — there is no indefinite holding
state. A bare `paused` flag fails this twice: it has no intrinsic exit, and it
encodes "no one is working on this right now" — which is _execution status_
(Linear-projected, [§3.2](#32-execution-status--live-linear-projected-not-stored-locked-decision-linear-owned-values)),
not a durable repo fact.

V0 therefore models a block as the doctrine's own two shapes:

- **A named dependency** is a `depends_on` edge with `kind: blocking`
  ([§4](#4-typed-edges)). It auto-clears when the target plan reaches
  `disposition: done`. No expiry needed — the dependency's completion is the
  clearer.
- **An owner/external-decision block** is the `gate` field — present only while a
  plan waits on a decision that no other plan's completion can clear:

```text
gate:                       # absent ⇒ live, not gated
  awaiting: owner-decision | external-input
  clears_when: <string>     # the named condition or owner that resolves it
  expires: <ISO date>       # MANDATORY, absolute; a gate with no expiry is invalid
                            # default horizon: 30 days from creation (owner-signed)
```

The expiry is the structural cure for the indefinite state: a gate **cannot**
outlive its `expires` date silently. The observe-mode extractor
([§5](#5-the-graph-contract-shape-it-composes-into) / Stage 1.4) reports any plan
whose `gate.expires` has passed as drift — _"stale gate, decision required."_
Expiry forces one of: **renew** the gate with a fresh `clears_when` and a new
`expires`; **resolve** it (the decision arrived → remove the gate, the plan is
live); or **dispose** the plan (`disposition: cancelled`). Expiry **never
auto-cancels** — work is removed only by an explicit decision (never-delete-work).

This reuses the repo's established staleness idiom (active-claims
`freshness_seconds`, the commit-queue `expires_at`, the heartbeat 10-minute
retirement rule): durable state that could go stale carries a TTL that forces
re-evaluation. The **default gate-expiry horizon is 30 days** (owner-signed) — a
monthly forced-triage cadence; a gate may set any different absolute `expires`.
The `awaiting` enum values are **owner-signed** and may be extended additively by
the survey.

### 3.5 Migration map — emergent `status:` value → axes

The proof that the axes absorb the real chaos without loss:

| Emergent `status:` value(s) | `kind` | `disposition` | `gate` | execution (Linear) |
| --- | --- | --- | --- | --- |
| `future`, `strategic-brief`, `strategic`, `future-strategic`, `exploration`, `NOT STARTED — strategic brief` | `strategic` | — | — | — |
| `current`, `queued`, `ready-for-execution`, `READY FOR EXECUTION` | `executable` | — | — | `backlog` |
| `active` | `executable` | — | — | `in_progress` |
| `completed`, `complete`, `🟢 COMPLETE` | (last known) | `done` | — | `done` |
| `superseded`, `SUPERSEDED … by X` | (last known) | `superseded` (+ `superseded_by: X`) | — | — |
| blocked on another plan | (last known) | — | — _(use `depends_on` blocking edge)_ | — |
| `DRAFT — pending owner approval`, `🟡 PLANNING` | `strategic` | — | `gate: owner-decision` (+ `expires`) | — |
| `decision-incomplete` | `strategic` | — | `gate: owner-decision` (+ `expires`) | — |
| an owner-stop with no revisit date | — | `cancelled` _(the honest disposition; recoverable)_ | — | — |
| whole-paragraph prose values | — | — | — | prose moves to the **body**; axes carry the state |

### 3.6 Folder collapse — `[owner-signed]`

"Folder navigates, metadata governs." V0's **verdict**: collapse `current/` and
`active/` into one executable home (the `current`↔`active` distinction now lives
in the Linear-projected execution status, not the folder); keep `archive/` for
terminal plans; `future/` holds `kind: strategic`. The collapse is **owner-signed**;
the exact target layout (folder names) is survey-grounded — confirmed at the
restructure once the survey maps which states actually occur.

| `kind` | `disposition` | Folder (verdict) |
| --- | --- | --- |
| `strategic` | — | `future/` |
| `executable` | — | the single collapsed executable home |
| any | terminal (`done` / `superseded` / `extracted-and-archived` / `cancelled`) | `archive/` |

---

## 4. Typed edges

Every relationship is a **typed, directional edge** in one of five families:
**authority · traceability · dependency · evidence · projection**. V0 fully
specifies the edges that touch the `plan` node; the rest of the vocabulary is
shape-only ([§5](#5-the-graph-contract-shape-it-composes-into)). All edge
_shapes_ below are LOCKED; value spaces grow additively.

| Edge | Family | Source → Target | Direction | Cardinality | Required when | Reconciliation |
| --- | --- | --- | --- | --- | --- | --- |
| `serves_strategic_choice` | authority / traceability | `plan` → strategic-choice | up (plan cites choice) | exactly 1 (finest published ID) or `"pending"` | executable plans (required) | New. Resolves against the strategic-choice registry (`APP-*` / `TOOLS-*` / `FRAME-*`, optional `SDK-*`/`SEARCH-*`/`GRAPH-*`/`EEF-*` sub-IDs). Scored 0 in the estate — genuinely new. |
| `derives_from` | authority | `plan` → ADR / strategy doc | up | 0..n | optional | Canonical for emergent `foundational_adr` (17) / `foundation_alignment` (7). |
| `supersedes` | authority | `plan` → `plan` | lateral (this replaces that) | 0..n | optional | Keep (9). |
| `superseded_by` | authority | `plan` → `plan` | lateral (inverse) | 0..1 | **required** when `disposition: superseded` | Keep (2); enforces the successor-named invariant. |
| `depends_on` | dependency | `plan` → `plan` | up (needs) | 0..n, each tagged `blocking \| beneficial` | optional | Keep (12) **and reconcile with PDR-018**: the blocking/beneficial classification becomes a _typed property on the edge_, so a beneficial prerequisite can never silently gate. A `blocking` edge is the durable form of "blocked on another plan" — it clears when the target is `done`. |
| `thread` | traceability | `plan` → thread | up (serves) | 0..1 | recommended | Keep (27); PDR-027 thread association. |
| `projects_to` | projection | `plan` → external Linear Project | outward (repo → service) | 0..1 | optional; **build deferred to a later stage** | New (Pillar 6). The plan≈Project mapping; carries the live execution status. Reserved in V0; the projection is built only when the Linear consumer is live. |
| `realized_by` | evidence / traceability | `plan` (or `todo`) → `product-increment` / commit | down (intent → its realization) | 0..n | optional; target node-types are later stages | New (consumer-driven, surfaced by the DORA-derivation work — [§5.4](#54-delivery-performance-metrics-dora--a-consumer-this-contract-serves)). The join from intent to the commits/increments that realize it — the key that makes change-lead-time and planned-vs-rework attribution a graph traversal rather than a log reconstruction. **The edge is LOCKED; its exact endpoints (`plan` vs `todo`; commit vs `product-increment`) are SURVEY-MAY-REFINE.** |
| `validated_by` | evidence | `strategic-choice` / `product-increment` → user-value evidence | up (evidence returns to intent) | 0..n | optional; closes the user-value loop | New (consumer-driven — [§5.5](#55-closing-the-loop--returning-evidence-and-the-multi-developer-transition)). The returning edge that turns user-centricity from a _link_ into a _loop_: usage / teacher feedback / EEF evidence / Oak-grounded impact attached back to the choice or increment. Target node-types are later stages; **reserved in V0.** |

**Authority invariants the `plan` node participates in** (Pillar 3 — these
become machine checks at warn/enforce):

1. Every `executable` plan resolves `serves_strategic_choice` to a published
   registry ID **or** carries the explicit `"pending"` sentinel (the pending-gate).
2. No `archive/` (terminal) plan is the target of a live `depends_on` edge.
3. No continuity record is citable as a plan's scope authority (a plan's
   authority edges point only at choices, ADRs, strategy, and other plans).
4. Linear never holds an authority edge _into_ intent — `projects_to` is
   outward-only; the repo stays canonical.
5. Every `gate` carries a future `expires`; a gate whose `expires` has passed is
   drift the extractor surfaces for decision ([§3.4](#34-gate--an-expiring-block-not-a-holding-state)).

---

## 5. The graph contract SHAPE it composes into

Node-schema #1 is one node-type in a larger contract whose **shape** is ratified
up front (so a single-node-type first build composes in rather than being
retrofitted), while the **taxonomy is survey-gated**. V0 specifies the `plan`
node and plan-touching edges fully; everything else here is **shape-only**.

### 5.1 Node-type registry — shape

The registry is a list; each entry is `{ name, purpose, authority_role,
schema_ref }`. V0 populates exactly one entry fully:

| Node-type | V0 status |
| --- | --- |
| `plan` | **Fully specified** (this doc). |
| `product`, `product-increment` | **Reserved, role named** — the deployment/release units DORA counts; a `product-increment` is one shipped change and the attachment point for `evidence` edges to external deployment/incident nodes ([§5.4](#54-delivery-performance-metrics-dora--a-consumer-this-contract-serves)). Full schema is a later stage. |
| `spec`, `report`, `adr`, `pdr`, `thread`, `continuity`, `strategy`, `strategic-choice`, `archive`, `external-*` | **Reserved names only** — purpose/authority/schema deferred to Stage 4+, each built observe → warn → enforce, each gated on a live consumer. Not enumerated exhaustively here (no cathedral before the survey). |

### 5.2 Edge vocabulary — shape

Each edge is `{ name, source_types, target_types, direction, cardinality,
family }` where `family ∈ { authority, traceability, dependency, evidence,
projection }`. V0 populates the plan-touching edges ([§4](#4-typed-edges)); other
edges (e.g. evidence edges from `report`/observability nodes, `projects_to` from
non-plan nodes) are reserved and added with their node-types.

### 5.3 Authority model — shape

Authority is a typed, directional, validated property — not prose convention.
The model is: **intent flows down** (Oak goal → vision → strategic choice →
plan), **traceability reads up**, **evidence and execution are projected from
external services and never become authority over intent**. V0 states the five
`plan`-participating invariants ([§4](#4-typed-edges)); the full invariant set
is completed as node-types land.

### 5.4 Delivery-performance metrics (DORA) — a consumer this contract serves

Owner-directed: the planning system is designed so DORA software-delivery metrics
are derivable for both products — **the MCP app** (literal DORA) and **the
Practice / agentic framework** (DORA-shaped; borrow the shape, not the calibrated
bands). This node-schema serves that consumer at three points, **adding no new
primitives**:

- **Throughput state** comes from `projects_to` (Linear execution status
  `backlog → in_progress → done`) — already why execution-status is projected,
  not stored ([§3.2](#32-execution-status--live-linear-projected-not-stored-locked-decision-linear-owned-values)).
- **Deployment/release units** are the reserved `product` / `product-increment`
  node-types ([§5.1](#51-node-type-registry--shape)), joined to external
  deployment/incident evidence via the `evidence` edge family (Vercel/Sentry;
  Pillar 6, outward-only).
- **Planned-vs-rework attribution** — required by change fail rate and rework
  rate — is native: `serves_strategic_choice` + `kind` + `disposition`, joined to
  commits, classify each change as planned work or remediation by graph traversal.

The metrics are a generated projection over this graph (§5.2 evidence edges +
Pillar 1), built later and owner-gated; V0 only ensures the contract _serves_ the
derivation. Detail: the [repo intent graph plan §Delivery-performance metrics](./future/repo-intent-graph.plan.md).

The **join key** from intent to its realization is the `realized_by` edge
([§4](#4-typed-edges)) — without it, lead-time and attribution would be
reconstructed from commit trailers; with it they are a traversal. The
toolchain-observability DORA's logs-based metrics require is **intrinsic here**
because the repo already integrates the developer toolchain: GitHub (the change
axis), Linear (the intent / execution-status axis, via `projects_to`), and Sentry
with OpenTelemetry spans (the runtime / incident axis, span-IDs correlating logs
to traces). Those integrations are the external nodes the `evidence` and
`projects_to` edges point at — the same-repo unity is what makes the join native.

### 5.5 Closing the loop — returning evidence and the multi-developer transition

The DORA work surfaced two further consumers this contract should **serve** (not build); both
reuse the `evidence` family and add no new mechanism:

- **The user-value loop.** `validated_by` ([§4](#4-typed-edges)) returns user-value evidence
  (usage / teacher feedback / EEF evidence / Oak-grounded impact) to `strategic-choice` /
  `product-increment`, turning user-centricity from a traceability _link_ into a closed _loop_; a
  validator flags choices with delivered increments but no returned evidence. This completes the
  value stream the graph otherwise truncates at delivery.
- **Continuous measurement.** Output accuracy (gate-failure + rework-attribution trend),
  cost-per-delivered-value (token / seat telemetry attributed via `realized_by`), and the DORA
  five are all Pillar-1 projections over the graph plus `evidence` edges — **no separate metrics
  stack**. The intent graph, fed by returning evidence, _is_ the continuous-measurement substrate.

Detail and the continuous-measurement gap map:
[repo intent graph plan — Closing the loop](./future/repo-intent-graph.plan.md).

These evidence edges are **populated by an evidence-ingestion layer** — connectors drawing directly
from the sources (Vercel / Sentry / Sonar / GitHub / PostHog), triggers, agentic analysis, and
validated write-back — named as a required, build-deferred actuation layer in the plan ("From
structure to system"). V0 only ensures the contract has the typed edges that layer will populate.

---

## 6. Schema-first / Zod idiom for the later build

V0 is docs. The Stage-1 build (a separate, owner-gated promotion) transcribes it
into a single **Zod** schema — consistent with the repo's schema-first idiom
(`schema-first-execution.md`; types flow from one schema, indexes are
projections, validation is strict). The sketch below is **illustrative, not
normative**: the binding artefact is authored at Stage-1 promotion, over
`graph-core`, surfaced through `repo-validators`/`agent-tools`.

```ts
// ILLUSTRATIVE — the binding schema is built at Stage-1 promotion.
import { z } from "zod";

const StrategicChoiceId = z
  .string()
  .regex(/^(APP|TOOLS|FRAME|SDK|SEARCH|GRAPH|EEF)-\d+[a-z]?$/);

const Disposition = z.enum([
  "done",
  "superseded",
  "extracted-and-archived",
  "cancelled",
]); // values owner-signed (survey-may-add)

const Gate = z.object({
  awaiting: z.enum(["owner-decision", "external-input"]), // owner-signed (survey-may-add)
  clears_when: z.string(), // named condition or owner that resolves it
  expires: z.string(), // MANDATORY absolute ISO date — no open holding state; default horizon 30d
});

const DependsOn = z.object({
  plan: z.string(), // plan id/ref
  kind: z.enum(["blocking", "beneficial"]), // PDR-018, typed on the edge
});

const PlanNodeBase = z.object({
  id: z.string(),
  node_type: z.literal("plan"),
  name: z.string(),
  overview: z.string(),
  serves_strategic_choice: z.union([StrategicChoiceId, z.literal("pending")]),
  derives_from: z.array(z.string()).default([]),
  supersedes: z.array(z.string()).default([]),
  superseded_by: z.string().optional(),
  depends_on: z.array(DependsOn).default([]),
  thread: z.string().optional(),
  projects_to: z.string().optional(), // reserved; built later
  disposition: Disposition.optional(),
  gate: Gate.optional(), // absent ⇒ live, not gated
  related: z.array(z.string()).default([]),
  last_updated: z.string(), // ISO date
});

// kind discriminates the union: executable carries todos; strategic carries promotion_trigger.
const PlanNode = z.discriminatedUnion("kind", [
  PlanNodeBase.extend({
    kind: z.literal("executable"),
    todos: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        status: z.enum(["pending", "completed"]),
      }),
    ),
    // executable plans require a resolved or explicitly-pending choice (invariant 1)
  }),
  PlanNodeBase.extend({
    kind: z.literal("strategic"),
    promotion_trigger: z.string(),
  }),
]);
```

Notes that bind the build: closed enums (never open `string`); `kind` is the
discriminator; execution status is **absent** (projected from Linear, not a
field); `gate.expires` is mandatory (no open holding state); `related` is
untyped see-also, distinct from the typed edges. Refining an enum at V1 means
_adding a member_, never widening to `string`.

---

## 7. Reconciliation summary (the four sources)

| Source | What it contributes to V0 | How V0 reconciles it |
| --- | --- | --- |
| **PDR-018** (planning discipline) | End-goal/mechanism/means; blocking-vs-beneficial prerequisites; DECISION-COMPLETE-is-readiness-gate; ambiguous-verb avoidance. | End-goal/mechanism/means stay in the **body** (not frontmatter). Blocking/beneficial becomes a **typed property on `depends_on`**. "Decision-complete as V0" honours the readiness gate: no "decide at execution time" — V0 states every field definitely and tags refinement-exposure instead. |
| **ADR-117** (templates & hierarchy) | `name`/`overview`/`todos` for executable plans; the four-document hierarchy; `future`→`current`→`active`→`archive`; promotion process. | `name`/`overview`/`todos` kept and made canonical. The lane model is **re-expressed as orthogonal axes** + a folder collapse (Linear owns execution state). Hierarchy discipline is why this spec is a standalone doc the plan _references_. |
| **Plan templates** | The live scaffolds; `isProject: false`; per-todo `status`. | `isProject` **dropped** (subsumed by `projects_to`). Per-todo `status` kept. Templates become a Stage-3 follow-on: regenerate them to emit node-schema-#1 frontmatter. |
| **Emergent reality** (first-hand census) | The actual drift: ≈30+ `status:` values, 14 `type:` values, `lifecycle`, `parent_plan`, `foundational_adr`, `thread`, `depends_on`, `related`, 38/284 plans with no frontmatter at all. | The migration map ([§3.5](#35-migration-map--emergent-status-value--axes)) and the dropped/deferred table ([§2.5](#25-explicitly-dropped-or-deferred-emergent-keys)) absorb every observed key without loss: reconcile (`foundational_adr`→`derives_from`), replace (`status`→axes), drop (`isProject`/`lifecycle`/`collection`), or defer to survey (`parent_plan`/`specialist_reviewer`). |

---

## 8. What V0 explicitly does NOT decide

- **Whether `parent_plan` is a real containment edge** — deferred to the survey.
- **Whether `specialist_reviewer` becomes a formal field** — deferred to the survey.
- **The exact endpoints of `realized_by`** (`plan` vs `todo`; commit vs
  `product-increment`) — the edge is locked, the endpoints are SURVEY-MAY-REFINE.
- **The `validated_by` user-value evidence edge and the cost/accuracy evidence
  edges** — reserved in the vocabulary; their target node-types and the
  evidence-ingestion layer that populates them ([§5.4](#54-delivery-performance-metrics-dora--a-consumer-this-contract-serves)/[§5.5](#55-closing-the-loop--returning-evidence-and-the-multi-developer-transition))
  are a later, owner-gated build, not decided by V0.
- **The full node-type registry and edge vocabulary** — shape only; taxonomy
  survey-gated, built node-type by node-type (no cathedral).
- **The build** — no extractor, no registry, no validator is built by V0. Those
  are Stage 1.3/1.4, promoted separately and owner-gated.
- **Templates regeneration** — a Stage-3 follow-on once V1 is ratified.

---

## 9. Acceptance — how V0 is validated as a lens

V0 succeeds as a lens, not as a finished standard. It is accepted when:

1. **A plan can be classified against it by hand.** Given any existing plan, a
   reader can assign `kind`, `disposition`, `gate`, every edge, and flag every
   non-conforming key — using only this spec. (The migration map and
   dropped/deferred table make this deterministic.)
2. **It is decision-complete.** No field, enum, or edge is left "to decide
   later"; every undecided item is named in [§8](#8-what-v0-explicitly-does-not-decide)
   with its owner/survey resolver.
3. **It composes into the graph contract shape** ([§5](#5-the-graph-contract-shape-it-composes-into))
   without retrofit — node-schema #1 is one entry in the registry, its edges one
   slice of the vocabulary.
4. **The survey can consume it.** The
   [deep-survey brief](./future/deep-plan-estate-survey.plan.md) can read the
   estate against V0 and emit additive refinements → V1.

**Conformance is necessary, not sufficient.** This schema scores a plan's _shape_, not its
_substance_: a fully-conformant plan can still be substantively poor or strategically
ineffective. V0 is the form lens; the survey's substance signals (a content-quality verdict and the
idea-level good/speculative/bad classification, with per-idea salvage) and the restructure's
substance gate judge whether the content is good and the corpus is effective. 100% conformance is the scaffolding the substance work stands on,
never the goal.

When the Stage-2 survey closes, its additive refinements are folded in and the
result is ratified as **V1**.
