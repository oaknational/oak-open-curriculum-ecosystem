# Agent Experience Review Lens

Operationalises
[PDR-111](../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
(Agent Experience is a first-class Practice optimisation principle) and
[PDR-055](../practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md)
(CLI affordance-set and API-surface-design discipline).

When you design or review work that touches the **agent-facing substrate** — a
coordination CLI (`comms`, `claims`, `commit-queue`, identity), a watcher or
monitor, a comms/claims/state surface, a quality gate, a hook, or a generated
agent artefact — weigh its **agent experience (AX)** impact explicitly. The
substrate is a product whose users are agents; functional correctness alone does
not close substrate work.

## The lens (apply before declaring substrate work done)

1. **Easier or harder to use correctly?** Does the change let an agent invoke or
   consume the surface correctly the first time — discoverable flags, enumerated
   values, full help on failure, defaulted/derived tool-knowable values
   (PDR-055 clauses 7–10)?
2. **Can a correct-looking use corrupt state?** Path resolution, cwd assumptions,
   and write targets are AX-safety surfaces — a green proof line over a wrong-target
   write is the worst AX failure (see friction F-41).
3. **Is any friction it reveals captured?** Per
   [`capture-practice-tool-feedback`](capture-practice-tool-feedback.md) and
   PDR-060, an observed rough edge lands in a durable surface, never chat-only.
4. **Is the cure structural, not per-instance?** Prefer the change that retires a
   cause-class (a conformance guard, a generated invocation, a shared resolver)
   over N per-site patches. An indiscriminate friction count is a set of
   cause-classes, not N independent problems.
5. **Does it leave a drain home?** A captured friction has a routable plan home or
   an explicit deferral; AX debt is not silently accumulated.

This lens is additive to the code-review and architectural lenses; it does not
replace them. It fires on substrate work specifically — it is not a gate on every
edit.

## Related surfaces

- [PDR-111](../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
  — the principle this rule operationalises.
- [`capture-practice-tool-feedback`](capture-practice-tool-feedback.md) — the
  capture half of the loop.

The live AX backlog is the agent-tooling frictions register (under the
agent-tooling plan collection); this rule does not cite it directly, per the
PDR-105 reference-direction invariant (doctrine never cites ephemeral plans).
