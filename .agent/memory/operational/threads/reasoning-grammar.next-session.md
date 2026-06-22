# Thread: reasoning-grammar

**Purpose**: Actuate a structured-reasoning capability for agents — the portable
grammar-of-thinking reference plus the thin `oak-reason` skill (the outward pair to
`oak-metacognition`'s inward reflection), wired into the metacognition directive,
`oak-plan`, and the start-right core.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Orbit rides Horizon | claude | claude-opus-4-8 | ef8284 | implementer | 2026-06-22 | 2026-06-22 |

## Lane state

- **Owning plan**: approved planning brief (platform-local
  `~/.claude/plans/agree-to-all-but-wise-island.md`); no repo plan authored — the work
  completed in one pass.
- **Current objective**: COMPLETE — landed `3b9836d89`.
- **Current state**:
  - `.agent/reference/grammar-of-thinking.md` — portable reference, re-aimed for the
    agent-as-thinker; listed in the reference README under the PDR-032 gate.
  - `oak-reason` — thin skill, five-move killer subset, points to the grammar for depth;
    adapters generated; `Skill(oak-reason)` permission wired; `skills:check` +
    `portability:check` green.
  - metacognition directive enriched (inward ladder + falsification) and the metacognition
    skill points to `reason`; `oak-plan` gained a "frame the problem, not the solution" step;
    start-right-quick carries a discovery pointer and start-right-thorough a grammar-yardstick
    invocation. `oak-go` unchanged (owner-directed).
  - Reviewed by assumptions-expert, docs-adr-expert, onboarding-expert; the PDR-029 citation
    fix and the metacognition→reason discovery edge were folded. The portability finding was
    rebutted: the reference invokes Practice *memotype* vocabulary, portable across
    Practice-bearing repos (PDR-035) — the same clarification made for PDR-112 this day.
- **Next safe step**: **push** (owner-gated) — branch `docs/planning-and-validation` is ahead
  of origin. After push, retire this thread.
- **Promotion watchlist**: the thin-actuator-over-deep-reference cure (split a large doc into a
  thin firing skill + a deep reference) is a candidate pattern — held in napkin.
