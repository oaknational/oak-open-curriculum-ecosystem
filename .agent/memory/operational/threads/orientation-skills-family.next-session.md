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

## Lane state

- **Owning plan**: [`orientation-and-agentic-ai-literacy.plan.md`](../../../plans/developer-experience/current/orientation-and-agentic-ai-literacy.plan.md) (`current/`, executable).
- **Current objective**: WS1–WS5 complete; WS6 propagation done. Remaining are
  session-close, owner-gated steps: consolidation, plan archive, and push.
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

- **Next safe step**: at session close — run `/oak-consolidate-docs` (graduate
  the promotion watchlist if ripe), archive the plan to completed + index entry,
  and push (owner-gated). The value-rationale (User Stories) is already conserved
  in the primer body/description and PDR-112 Context.
- **Promotion watchlist**: value-conveyance, knowledge-surfaces-are-curated,
  decision-records-record-current-state (prior-session owner corrections, held in
  per-user memory).
