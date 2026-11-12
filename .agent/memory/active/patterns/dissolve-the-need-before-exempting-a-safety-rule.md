---
name: "Dissolve the Need Before Exempting a Safety Rule"
polarity: pattern
use_this_when: "A fix appears to require an exemption from a hard safety rule (never-use-git-to-remove-work, the verify-skip flag, a destructive-op guard) — before self-ratifying or escalating the exemption, seek a redesign that dissolves the need for the dangerous operation entirely."
category: process
layer: general
proven_in: "agent-tools spawn-flow T1 — orphan-worktree-on-build-failure (2026-06-28); the never-use-git-to-remove-work exemption it seemed to need was dissolved by an idempotent-retry redesign"
proven_date: 2026-06-28
adjacent: ".agent/rules/never-use-git-to-remove-work.md and .agent/rules/rules-have-no-exceptions.md (the safety rules this protects); the cowpath anti-pattern (this is its constructive inverse — redesign so the constraint never binds, instead of designing around it)"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reflexively self-ratifying or escalating a safety-rule exemption when a redesign would have removed the need for the dangerous operation."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: when a fix seems to need a
> dangerous operation, redesign so the dangerous operation is never needed.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Dissolve the Need Before Exempting a Safety Rule

When a fix appears to need an exemption from a **hard safety rule** — a
`never-use-git-to-remove-work` removal, the verify-skip flag, any destructive or
guarded operation — there are three tempting moves and one correct one. The
tempting moves are: **self-ratify** the exemption ("this case is fine"),
**reflexively escalate** it to the owner ("may I have an exemption?"), or
**design around** the constraint (the cowpath). The correct move is to **ask
what redesign dissolves the need for the dangerous operation at all** — apply
lens-4 (*would the system changing make this problem disappear?*) before
reaching for the exemption.

## Pattern

1. A fix seems to require touching a hard safety rule.
2. **Do not** self-ratify, escalate, or build around it yet.
3. Ask: *what design makes the dangerous operation unnecessary?* The safety rule
   is the forcing function — it tells you the operation is dangerous, so the
   better design avoids it, not exempts it.
4. If a no-removal / no-bypass redesign is clean, take it — the exemption
   evaporates and there is nothing to escalate.
5. Escalate the exemption to the owner **only** if no-removal genuinely is not
   clean. Then the escalation is real, not reflexive.

## Worked instance

The spawn-flow's T1 finding: `agent spawn` could leave an **orphaned worktree if
the build failed** mid-spawn. Atomic rollback (remove the just-created worktree)
read as the obvious cure — but `git worktree remove` is a removal, so it seemed
to need a narrow `never-use-git-to-remove-work` exemption. The Director declined
to self-ratify and reframed: **dissolve the need.** An **idempotent-retry**
design — probe `git worktree list`, then resume the existing worktree's build
instead of removing and recreating — needs no removal at all, AND is better UX
(a retry "just works"). The exemption was never needed; no owner escalation
fired.

## Why it generalises

A hard safety rule exists because the operation it guards is genuinely
dangerous. An exemption keeps the danger and adds a judgement call ("this case
is safe") that the rule exists precisely to remove. A redesign that dissolves
the need keeps the rule's protection AND removes the danger — strictly better.
This is the **constructive inverse of the cowpath**: the cowpath designs *around*
a constraint (preserving the awkward shape); this designs so the constraint
*never binds*. It is lens-4 — "would the system changing dissolve this problem?"
— applied at the moment an exemption looks necessary.

## When the exemption is still right

Sometimes no-removal genuinely is not clean — the redesign is disproportionate,
or the danger is irreducible. Then the exemption is a real owner decision, not a
reflex. The discipline is *order*: seek the dissolving redesign **first**; reach
for the exemption only when it survives that search. An exemption reached for
before the redesign search is the failure mode this pattern names.

## Adjacent

- [`never-use-git-to-remove-work`](../../../rules/never-use-git-to-remove-work.md)
  and [`rules-have-no-exceptions`](../../../rules/rules-have-no-exceptions.md) —
  the safety rules this protects; the redesign keeps them intact.
- [`no-verify-requires-fresh-authorisation`](../../../rules/no-verify-requires-fresh-authorisation.md)
  — the same shape: dissolve the need to skip the gate (fix the gate input)
  before asking to bypass it.
- The cowpath anti-pattern (per-user memory `feedback_cowpath_anti_pattern`) —
  this is its constructive inverse.
- [`the-frame-was-the-fix`](the-frame-was-the-fix.md) — a kindred lens move of
  opposite polarity: that anti-pattern warns against reaching for the
  obvious/mechanical surface fix; this pattern names the constructive move the
  same instinct should reach for instead when the surface fix is a safety-rule
  exemption.
