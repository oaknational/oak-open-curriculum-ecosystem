# Owner Attention Is Gated At Action-Moments

Operationalises
[PDR-056 (Inter-Agent Collaboration Protocol)](../practice-core/decision-records/PDR-056-inter-agent-collaboration-protocol.md)
and composes with
[`follow-agent-collaboration-practice.md`](follow-agent-collaboration-practice.md)
§"Inter-Agent Comms Is First-Class And Parallel-Default" + the
all-channels-as-canonical-truth principle.

**Provisional status (2026-05-22)**: this rule is a **deliberate experiment**
in operationalising an observation about owner attention. Owner direction
at promotion: *"if the framing is useful let's try it, if it doesn't work
we can always change it"*. The rule is in force; agents should apply it.
If it produces friction in practice (false-negatives where owners wanted
to be interrupted earlier, false-positives where action-moment
observability cost more than it saved), capture the friction and route
back through the graduation pipeline for amendment or retirement.

## Observation

Owner attention is gated at **action-moments**, not reasoning-moments.

- **Action-moments** are points where the choice becomes irreversible or
  expensive-to-reverse: commit, push, send, alter shared state (active
  claims, queue intents, comms events that other agents will read),
  external API calls, owner-class architectural decisions.
- **Reasoning-moments** are points where the agent is deliberating: reading
  code, planning, dispatching reviewers, implementing, running gates,
  staging.

Owners review at the moment-of-irreversibility, not at the moments-of-deliberation.
This is the empirical pattern observed across multiple sessions, ratified
into rule form under owner direction 2026-05-22.

## Rule (the prescriptive corollary)

**Structure work to minimise owner interrupts at non-action-moments AND
maximise owner observability at action-moments.**

### Minimise non-action interrupts

Do NOT use `AskUserQuestion` (or other owner-interrupt mechanism) for:

- Reasoning-moment questions ("which approach is better?" without an
  action gated on the answer).
- Information-gathering ("what does this codebase do?" when the agent
  has the tools to find out).
- Confirmation of already-clear instructions ("are you sure you want me
  to do X?" when X is already directed).
- Multiple-choice menus where the agent has analysed and has a verdict
  (use `present-verdicts-not-menus.md` instead).

Reserve `AskUserQuestion` for action-moments: the agent is about to do
something irreversible-or-expensive, and the owner's decision genuinely
changes the action. The question's options should be ACTION CHOICES, not
opinion polling.

### Maximise action-moment observability

When the agent IS at an action-moment, make it observable:

- **Pre-action announcement**: state in text what you are about to do
  before doing it (per the existing user-facing text guidance in the
  default system prompt).
- **Action-moment surfacing**: surface the irreversibility explicitly —
  *"about to commit X / push Y / send Z to peer agent A"* — so the owner
  sees it coming and can intervene if needed.
- **`AskUserQuestion` shape**: when used at an action-moment, the options
  are action choices with stated trade-offs; the default option is named
  if the agent has a verdict.

### Evidence that refutes an owner-approved premise is an action-moment

When reviewer findings, a data fingerprint, or your own analysis refute a premise
the owner has already approved, the design is at an owner-class action-moment:
re-surface the corrected evidence and let the owner decide again. Do **not**
silently reshape the design around the new evidence — that overrides an owner
decision while disguised as a reasoning-moment. Re-surfacing is not
re-litigating: state the refuted premise, the evidence that refutes it, and the
corrected option, then let the owner re-decide.

### What this rule does NOT govern

- Mid-session feedback the owner volunteers — owners may intervene at
  reasoning-moments too; that is their prerogative. The rule governs
  what the AGENT initiates, not what the owner volunteers.
- Sub-agent (reviewer) dispatches — those are agent-to-agent, not
  agent-to-owner.
- Inter-peer comms — those have their own observability discipline (see
  `agent-state-observable.md`).

## Why this rule exists

Without the rule, agents default to one of two failure modes:

1. **Over-interrupting**: asking owner for reasoning-moment confirmation
   the agent should make itself, wasting owner attention on non-action
   decisions.
2. **Under-surfacing**: taking action-moments silently (committing,
   pushing, sending) without giving the owner an observable moment to
   redirect, producing surprised owner interventions after the fact.

The rule names the boundary explicitly: action-moments need owner
observability; reasoning-moments do not.

## Worked instances

- **Action-moment, well-handled (2026-05-22, Mistbound)**: Citation.source
  field question — code-expert surfaced an owner-class architectural
  decision (drop vs keep vs reference). Agent used `AskUserQuestion` with
  three concrete action choices and a stated verdict (Option A
  recommended). Owner picked Option A. Action-moment was observable; the
  question was at the moment-of-irreversibility (about to write the field
  shape).
- **Action-moment, owner-redirected (2026-05-22, Mistbound)**: commit-queue
  commit attempt — agent was about to land t12. Owner intervened to
  redirect commit to Stormbound. Action-moment WAS observable (Bash tool
  call surfaced the command); owner exercised redirect at the moment-of-
  irreversibility. The rule worked.
- **Action-moment, owner-redirected (2026-05-22, Mistbound)**: pnpm check
  attempt — agent was about to run the gate. Owner intervened with
  check-singleton-per-window invariant. Same pattern.
- **Evidence-refuted premise, re-surfaced (2026-05-11, deciduous-twining-dew)**:
  reviewer evidence refuted an owner-approved premise. The healthy move was to
  re-surface the corrected evidence for owner re-decision rather than silently
  reshaping the design — the design change was an owner-class action-moment, not a
  reasoning-moment the agent could absorb on its own authority.

## Source attribution

Promoted 2026-05-22 (owner-directed experiment) from `.agent/memory/active/napkin.md`
2026-05-22 reflection §"Insight (9th)". Observation source: Mistbound
Slipping Night session of 2026-05-22 — three action-moment owner
interventions, zero reasoning-moment interventions, across one full
substantive cycle (t12-citation-shape) plus the session handoff.

## Cross-references

- Composes with [`present-verdicts-not-menus.md`](present-verdicts-not-menus.md)
  — when an action-moment AskUserQuestion is appropriate, the options are
  verdicts-with-rationale, not opinion menus.
- Composes with [`agent-state-observable.md`](agent-state-observable.md)
  — owner observability at action-moments is one application of the
  broader "agent state that affects others must be observable" principle.
- Composes with [`no-analysis-responsibility-passback`](no-analysis-responsibility-passback.md)
  (if exists; see memory `feedback_no_responsibility_passback`) — agents
  analyse and present verdicts at action-moments, never pass analysis
  responsibility back to owner via reasoning-moment questions.
