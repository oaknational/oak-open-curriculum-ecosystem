# Thread: orientation-skills-family

**Purpose**: Design and build the human-facing teaching-surface family — the
portable agentic-AI-literacy primer (lead-in) plus the existing repo-bound
orientation lenses (`explain-repo`, `onboard-me`) — across the portability seam
defined by PDR-112.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Bora lifts Downdraft | claude | claude-opus-4-8 | 5120ef | planner → implementer | 2026-06-22 | 2026-06-22 |
| Orbit rides Horizon | claude | claude-opus-4-8 | ef8284 | implementer | 2026-06-22 | 2026-06-22 |
| Skipper tracks Reef | claude-code | claude-opus-4-8[1m] | 87a7bb | planner — authored the orientation-lens unification plan (owner-directed); did not implement | 2026-06-23 | 2026-06-23 |
| Zenith lifts Firmament | claude-code | claude-opus-4-8[1m] | 5c2f1b | implementer — executed the orientation-lens unification (WS0–WS6); folded two mid-execution owner directions | 2026-06-23 | 2026-06-23 |

## Lane state

- **Owning plan**: [`orientation-lens-unification.plan.md`](../../../plans/developer-experience/current/orientation-lens-unification.plan.md) (`current/`, queued — the family-unification work). Superseded predecessor: [`orientation-and-agentic-ai-literacy.plan.md`](../../../plans-old-archive/developer-experience/archive/completed/orientation-and-agentic-ai-literacy.plan.md) (the primer + seam build, completed).
- **Current objective**: WS1–WS6 complete; committed `5b3453d41`. Consolidation
  (three watchlist lessons promoted to `distilled.md`) and plan archive done this
  session. Only push remains (owner-gated); the thread may retire after push.
- **Current state** (one commit pending at time of writing):
  - **WS1** — primer authored as the owned, host-free skill
    `working-with-agentic-ai`
    (`.agent/skills/working-with-agentic-ai/SKILL-CANONICAL.md`,
    `classification: passive`); adapters generated (`.claude`/`.agents`);
    `skills:check` + `portability:check` green; skill-permission entry wired in
    `.claude/settings.json`. Leakage verified by judgment (deterministic
    validator owner-released): no phenotype, the Practice memotype invoked only
    as a footing example, single abstract hand-off edge.
  - **WS2** — family wired: AGENT.md §Orientation Requests names the family and
    routes "new to agentic AI" → primer (opt-in prelude); onboard-me Branch F
    suggests the primer as a prelude; explain-repo carries a one-line aside;
    CONTRIBUTING points new-to-agentic-AI readers at the primer and records the
    host-side stance (the Practice *enables* heavy agentic delegation but does
    not *require* it — assistant-led work is equally supported). No duplicated
    teaching content.
  - **WS3** — onboarding-expert persona walk: PASS (ledger below); no unserved
    reader, so no owner-gated new surface.
  - **WS4** — gates green: markdownlint 0, `skills:check`, `portability:check`,
    `format:root` unchanged. (The `repo-validators` broken-link count is
    pre-existing repo-wide; none in this change set.)
  - **WS5** — adversarial panel (docs-adr-expert, assumptions-expert,
    architecture-expert-fred) plus the WS3 onboarding-expert. All actionable
    findings fixed: five stale dropped-validator references reconciled across the
    plan; PDR-112 §Required gained a seeding precondition (a host wires at least
    one continuation behind the edge before seeding the lead-in).
  - **Doctrine** — PDR-112 clarified as current-state: host *phenotype* is
    forbidden in the lead-in body; the Practice *memotype* (incl. vocabulary) is
    portable substance and may be invoked (PDR-035 grounding). Plan WS1
    acceptance / Work / cycle-dependencies aligned to judgment-based leak review.

## WS3 disposition ledger

| Persona | Verdict | Evidence |
| --- | --- | --- |
| New to working with agentic AI | served-by-primer | Footing from zero repo knowledge; reaches the single abstract edge; AGENT.md routes the intent to the primer, then forwards into onboard-me |
| Experienced, new to this repo/Practice | served-by-existing-surface | Primer is opt-in and declinable; "onboard me" / "explain this repo" land on their lenses with no primer detour |
| Experienced, hunting a specific detail | served-by-existing-surface | explain-repo (no-interaction briefing) + onboard-me Branch F's four addressable Practice questions; the primer body is topic-sectioned |

## Deferred follow-ups (not blocking; out of this plan's scope)

- **`metadata.owned` doctrine-vs-implementation drift**: PDR-051 §Validation /
  ADR-125 item 5 say owned skills carry `metadata.owned: true`, but the live
  discriminator is `skills-lock.json` absence; existing owned skills
  (`napkin`, `working-with-graphs`) also lack the flag. Repo-wide reconciliation
  for docs-adr-expert — do not patch per-skill (inconsistent treatment of peers).
- **Adapter H1 title-casing** ("Working With Agentic Ai"): generator-owned
  cosmetic; fix in the generator repo-wide if desired (never hand-edit adapters).

## Propagation note

The primer is a propagation candidate: it travels to other Practice-bearing repos
by transplantation/seeding (PDR-005), gated on the host having wired a
continuation behind the edge (PDR-112 §Required). PDR-112 (the *pattern*)
graduates into `practice-lineage.md` only after it hydrates across more than one
repo (PDR-112 §Graduation intent) — single-instance now, so not graduated.

- **REOPENED (owner-directed, 2026-06-23)**: the family is being unified — the two
  repo-bound lenses (`explain-repo`, `onboard-me`) become ONE intent-discerning lens
  with delivery mode (specific answer / area overview / guided tour) as a discerned
  variable; setup stays distinct and go-ahead-gated; the `working-with-agentic-ai`
  primer is unchanged; **PDR-112 is NOT amended** (host instantiation is phenotype,
  recorded in a host ADR + AGENT.md). Design owner-confirmed.
- **UNIFICATION IMPLEMENTED (Zenith lifts Firmament, 2026-06-23) — push-pending (owner-gated).**
  WS0–WS6 executed against
  [`orientation-lens-unification.plan.md`](../../../plans/developer-experience/current/orientation-lens-unification.plan.md).
  Outcome: ONE intent-discerning lens `/oak-explain` (`.agent/skills/explain/`); delivery mode
  (specific answer / area overview / guided tour) is a discerned variable; setup distinct +
  go-ahead-gated; `working-with-agentic-ai` primer + PDR-112 seam unchanged (PDR-112 NOT amended).
  Host decision recorded in
  [`ADR-202`](../../../../docs/architecture/architectural-decisions/202-orientation-as-one-intent-discerning-lens.md).
  AGENT.md §Orientation Requests rewritten to route every intent to the one lens (primer leads in via
  the edge → lens). Real-time onboarding-expert review (READY-WITH-FIXES) verified first-hand and folded.
  Gates green: `skills:check`, `portability:check`, `markdownlint` 0, `format`.
  - **Two owner directions mid-execution superseded the plan's letter** (owner direction is a stream):
    1. **Lens name = `/oak-explain`** (owner chose this over the plan default `onboard-me` and the
       `orient` option).
    2. **Clean break, no compatibility layers** (`replace-dont-bridge`) — the plan's aliasing /
       "no dangling slash command" approach is RETIRED; old skills (`onboard-me`, `explain-repo`)
       deleted, slash commands removed not aliased, every live reference migrated.
    3. **Minimise unique info in the skill** — the six architectural invariants moved to a new
       **README §Architectural invariants** block; the skill points to it (no baked repo facts).
  - **Live owner walkthrough DONE (2026-06-23)** — three `/oak-explain` runs
    (engineer, CEO persona, meta probe). Drove three refinements the simulations
    missed: (1) progressive disclosure — added a "Delivery grain" discipline and
    fixed two mode descriptions that invited walls of text; (2) scope accuracy —
    added a "Scope, accurately" guard (this repo is ONE of Oak's AI efforts, puts
    Oak *into* third-party AI assistants; not "how Oak does AI"); (3) positioning —
    a generic boundary added to `VISION.md` (no product named; owner decision).
  - **Remaining**: commit (one coherent docs-and-skills commit); push (owner-gated);
    consolidation/handoff + memory at close.
  - The prior session's primer/seam commit (`5b3453d41`) also remains push-pending (owner-gated).
- **Promotion watchlist**: DONE — value-conveyance, knowledge-surfaces-are-curated,
  and decision-records-record-current-state were promoted from the per-user buffer
  to `distilled.md` this session (2026-06-22), each flagged with its graduation
  candidate target (rule / PDR-clause). A future first-hand consolidation graduates
  them to rules/PDRs.
