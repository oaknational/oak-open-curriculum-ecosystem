---
name: The Frame Was the Fix
use_this_when: Reaching for the obvious / mechanical / enforcement-shaped tool to address a failure mode (locks, refusals, mechanical gates, hardening against review findings); or absorbing reviewer findings as binding work-items by default; or feeling that fixing the visible surface will close the issue
category: process
proven_in: .agent/experience/ (six cross-experience instances across five sessions in five days, 2026-04-21 through 2026-04-25; cross-experience scan during 2026-04-25 Jazzy consolidate-docs reached the conclusion; 2026-04-25 Jiggly Pebble consolidate-docs reached the same conclusion adding a frame-held variant)
proven_date: 2026-04-25
related_pdr: PDR-015
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reaching for a surface fix (mechanism, enforcement, hardening) when the underlying failure mode is a wrong frame; absorbing reviewer findings mechanically without first asking whether the design's central claim is the right claim; producing a worse outcome than reframing would have produced"
  stable: true
---

## Principle

The most expensive failure mode in design and review work is **fixing
the wrong thing**. The shape: agent observes a problem; agent reaches
for the obvious / mechanical / enforcement-shaped tool to address it;
external feedback (owner, reviewer, parallel agent's experience)
arrives as a *question* that exposes the framing rather than a
correction that fixes the surface; agent reframes; the original
"fix the surface" work dissolves.

The reframing was the actual fix. The surface work that the agent had
been preparing to do was load-bearing on the wrong claim.

## Failure shape (canonical statement)

Agent reaches for *mechanism* (a lock, an enforcement gate, a hardened
rule, a mechanical refusal) to address a failure mode. The mechanism
*feels tractable*: it can be designed, implemented, tested, gated.
External feedback arrives as a question — *"is this the right shape
for what you're building?"* The question is read first as a
correction (something to harden against). On reflection, it is
evidence about the design, not about the surface. The frame the agent
was operating under is wrong; the surface fix would entrench the
wrong frame.

Reframing-before-hardening dissolves several findings at once.
Hardening-before-reframing produces a more elaborate version of the
wrong thing.

## Recorded instances

| Date | Agent | Frame that was wrong | Reframe |
|---|---|---|---|
| 2026-04-21 | Pippin | Reviewer found the gaps once; absorb findings, harden | Multi-reviewer dispatch surfaces *different* gap classes; phase the reviewers |
| 2026-04-22 | Jazzy | Plan was the conversation; conversation was finished | Plan was a *snapshot* of conversation; the conversation continued past the plan |
| 2026-04-22 | (rule installed) | Rule needed sub-agent dispatch to test itself | Rule tested itself by being applied at install time |
| 2026-04-23 | (three reviewers) | Ambitious plan needed more sections | Plan needed structural collapse — three reviewers agreed |
| 2026-04-24 | Frodo | Evasion was a bug to call out | Evasion was a *shape* (named pattern of breadth-as-evasion) |
| 2026-04-24 | Pippin | Review findings were binding work-items | Review findings were *evidence about the design*; some dissolve under reframing |
| 2026-04-25 | Jazzy | Locks were the mechanism for parallel-agent coordination | Knowledge surfaces, not locks — agents are reasoning peers, not constrained subjects |
| 2026-04-25 | Jiggly Pebble | (frame already correct) | Frame inherited cleanly from prior session; surface-fix loop short-circuited entirely |

(Eight instances; the 2026-04-25 Jiggly Pebble entry is a *frame-held*
or *frame-travels* variant of the pattern — when the prior session's
reframing is inherited cleanly by a different identity, the
correction loop is short-circuited entirely. The work proceeds at
the corrected frame from session-open without re-litigation.)

## Discipline

When you observe yourself reaching for the obvious / mechanical /
enforcement-shaped tool, **pause and ask**:

- Is the failure mode this tool addresses the *real* failure mode, or
  am I addressing a symptom?
- Is the central claim of the design I am building right? Would a
  question challenging the central claim dissolve the work I am about
  to do?
- Has external feedback recently arrived as a question? Did I read it
  as a correction by default?

When external feedback arrives as a question (especially from owner,
adversarial reviewer, or parallel-agent experience):

- Treat it as **evidence about the design** before treating it as a
  binding work-item.
- Reframing-before-hardening dissolves more findings than
  hardening-before-reframing. The discipline is: ask first whether
  the central claim is right, *then* harden against the findings that
  remain.
- If the central claim is right, harden as the findings demand. If
  the central claim is wrong, the findings may dissolve under
  reframing — that is the higher-leverage move.

When you inherit a frame that has already been corrected by a prior
session (the *frame-held* variant):

- Read the prior session's reframing artefacts (experience file, plan
  body, ADR/PDR amendments) cold before re-engaging the work.
- Check whether your initial framing matches the corrected frame. If
  it does, proceed at the corrected frame from the start; do not
  re-litigate.
- The owner's "cold start" direction (when given) is an explicit
  signal to honour the corrected frame as inherited authority.

## What this pattern does *not* mean

- It does **not** mean reviewer findings are routinely "wrong frame"
  to dismiss. Most reviewer findings are real and need addressing.
  The discipline is to *first ask* whether the central claim is right,
  *then* address the findings that survive the question.
- It does **not** mean enforcement is always the wrong shape.
  Enforcement is right when the constrained-subject framing is right
  (e.g. compile-time type checking, build gates). It is wrong when
  the reasoning-peer framing is right (e.g. agent-to-agent
  coordination per the multi-agent collaboration directive).
- It does **not** authorise rejecting feedback you find inconvenient.
  The pattern works only when the reframing is genuine — when the
  central claim really is wrong. Bad-faith reframing to avoid hard
  work is the inverse failure mode (and is itself a frame-was-wrong
  candidate at meta-level).

## Forward-looking application

When you observe an instance of this pattern in a session:

- Capture as a structured surprise in
  [`napkin.md`](../napkin.md) with date, agent, frame-that-was-wrong,
  reframe, and what surface work dissolved.
- Note whether external feedback arrived as a question or as a
  correction; this is the diagnostic signal.
- If the reframing is substantial enough to motivate a doctrine
  change, surface as an ADR/PDR candidate per the standard
  consolidate-docs step 7a path.

## Related surfaces

- [PDR-015](../../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md)
  — reviewer authority and dispatch; the assumption-challenge gate
  candidate (pending in the register) is a sibling to this pattern (the
  doctrine adjacent to this pattern; the assumption-challenge gate
  is the *active* form, this pattern is the *recognise-the-shape*
  form).
- Sibling pattern candidate (pending in register):
  *discussion-before-absorption gate per adversarial-review output*
  — the active form of this pattern, applied specifically to
  Wilma-class adversarial review cycles.
- [`agent-collaboration.md`](../../../directives/agent-collaboration.md)
  §Knowledge and Communication, Not Mechanical Refusals — the
  multi-agent application: when agents are reasoning peers,
  enforcement-shape tools are routed around at the cost of
  architectural excellence.
- [`feel-state-of-completion-preceding-evidence-of-completion.md`](feel-state-of-completion-preceding-evidence-of-completion.md)
  — adjacent process pattern with a similar shape (the agent's
  internal feel as a substitute for an external loop the doctrine
  names as load-bearing). The patterns share the discipline of
  *pause and check the mechanism before the report*.
