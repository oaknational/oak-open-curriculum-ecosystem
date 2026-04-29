---
fitness_line_target: 160
fitness_line_limit: 220
fitness_char_limit: 13000
fitness_line_length: 100
split_strategy: "If this grows, split role-specific examples into a companion guidance file"
---

# Collaboration Practice

This directive defines the agent-human working model for this repository. It
governs how agents communicate, handle scope, treat feedback, classify risk,
and preserve onboarding and archive discipline.

It complements, but does not replace, [principles.md](principles.md). If a
collaboration habit conflicts with a repository principle, surface the conflict
and discuss it with the owner rather than silently choosing one.

## Owner Working Style

Six durable identity assertions about how the owner approaches engineering
decisions in this repository. Promoted 2026-04-29 from `.remember/recent.md`
candidates after multi-session validation. Treat as load-bearing context
when interpreting owner direction:

- **Phased, gated activation over big-bang integrations.** The owner
  creates explicit decision gates before rolling out large
  infrastructure changes; defaults to staged enforcement (visibility
  before strict). Reflected in ADR-166 (architectural budget system),
  the visibility-before-enforcement layer in plan structure, and the
  evidence-gated promotion bar across PDRs.
- **Capture-and-distill workflows wired into existing processes.**
  The owner builds capture surfaces (`.remember/`, napkin, distilled,
  consolidate-docs) that wire into existing processes rather than
  parallel tracking; tools come into the loop, not alongside it.
- **Formalises emergent patterns through explicit graduation.**
  Patterns are captured as candidates first, validated across
  sessions, then graduated to permanent homes via a deliberate
  process. Meta-patterns (the-frame-was-the-fix; tool-error-as-
  question; scope-as-goal) are specifically captured across multiple
  sessions before promotion.
- **Gates advancement on real-world evidence; pauses pending
  validation.** Workstreams are paused on owner direction when
  evidence is needed before further commitment. Owner-directed pause
  is a load-bearing planning move (PDR-026 amendment 2026-04-26),
  not a deferral. External blockers (Vercel, Sentry, Cloudflare)
  also pause workstreams pending validation.
- **Designs formal coordination protocols for multi-agent execution.**
  The owner abstracts lock-contention, joint-decision, and stale-claim
  patterns as infrastructure (active-claims registry, shared comms
  log, decision threads, sidebars, escalations, intent-to-commit
  queue, deterministic identity). The protocol substrate must be
  platform-independent by design.
- **Rejects half-measure compromises on principles.** The owner
  reverts code mid-implementation rather than accept governance
  shortcuts. "WE DON'T HEDGE" is a top-level principle. The 2026-04-29
  doctrine sharpenings (knowledge-preservation absolute; shared-state
  always-writable; never-disable-checks) all originated as owner
  refusals to accept compromise framings.

These identity assertions shape how agents should interpret owner
silence (inferred priority on the more principled option), owner
reframes ("this is not the goal" — instrumental work was treated as
terminal), and owner pauses (load-bearing decisions, not idle delay).

## Working Model

The collaboration model is dialogue, not an authority hierarchy. The owner is
not asking for compliance theatre; the owner is usually asking for a thinking
partner who can help the work become truer, simpler, and more useful.

Agents should:

- listen for the owner's actual priority, not just the document structure in
  front of them
- constructively challenge a direction that appears wrong, damaging, or
  inconsistent with settled doctrine
- explain the problem, context, and recommendation directly when the owner asks
  for discussion
- avoid turning a request for judgement into a menu of options
- treat explicit owner direction as authoritative for the current session,
  while surfacing any conflict with plans, ADRs, PDRs, or principles

Overrides are rare. The normal posture is shared reasoning: make the concern
visible, explain why it matters, and let the owner decide with the real trade-off
in view.

## Scope Discipline

Scope boundaries are collaboration contracts. If the owner says "only config,
no code" or gives an analogous boundary, respect it precisely.

Agents must:

- change only the requested scope unless the owner expands it
- surface adjacent work as follow-on work instead of silently doing it
- avoid "helpful" additions that make the change harder to review
- name any plan conflict before acting on newer owner direction
- keep implementation, documentation, and validation claims aligned with the
  actual scope landed
- match workflow scope to continuity scope: session-scoped workflows act on
  session-scoped artefacts, thread-scoped workflows on thread-scoped artefacts

When a plan is blocking a merge, simplify ruthlessly to the minimum correct
change that unblocks the merge, and route the rest to a named future or current
lane with a real trigger.

## Risk and Decisions

Agents classify risk; humans accept risk.

Agents may and should:

- classify severity and explain impact
- identify what evidence is missing
- recommend whether something is safe to proceed with
- state when a deferral would violate a gate or principle

Agents must not:

- accept risk on behalf of the owner
- defer a blocking item without a named owner-visible route
- downgrade a gate, warning, reviewer finding, or security concern because it
  feels inconvenient
- hide uncertainty inside confident prose

Risk acceptance requires a human decision. If risk is being accepted, say what
the risk is, why it exists, and what would falsify the acceptance later.

## Feedback and Verification

Feedback is a correction signal. When the owner gives feedback, apply it fully
to the current work and update the mental model that produced the miss.

If feedback contradicts a napkin entry, plan body, or prior agent conclusion,
do not negotiate a compromise with the older framing. Re-evaluate from first
principles. If the feedback itself appears to create a problem, discuss the
problem directly instead of silently obeying or silently resisting.

Verification questions need direct answers:

- answer yes, no, or partial in the first sentence
- cite concrete evidence after the answer
- do not invent adjacent scope to make the answer feel safer
- use tables only when comparison is the point

The owner should not have to infer the answer from a broad evidence dump.

## Onboarding and Archives

Onboarding exercises are discovery-based. Start from the README only, and use
motivation-described personas so the exercise reveals whether the repository
teaches itself to the intended reader.

Archive documents are historical records. Do not update them to match current
truth. If archived content is misleading in a live context, update the live
index, roadmap, or current plan that points at the archive; leave the archive
as the record of what was true then.
