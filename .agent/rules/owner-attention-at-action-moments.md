---
classification: core
description: Owner attention is gated at action-moments, not reasoning-moments. Minimise non-action interrupts, maximise action-moment observability. Provisional experiment 2026-05-22.
---

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

### Owner-facing lists are re-derived at every boundary, never carried

An "items that are yours" list carried across closeouts becomes an ambient
queue: labels that were once true ride as invariants, and a wrong answer
inherited from a peer's handover arrives as a question with the carrying
seat as its author (2026-09-06: four of ten carried items came back as
corrections — "that is why I already decided, and told you"; "does not need
my sign off"; "does that sound like the right answer to you?"; "this is
already policy, it does NOT require anything from me"). At every boundary
the list is rebuilt from nothing, and each candidate passes three tests or
leaves: (1) it is constitutively the owner's — the decision lenses fail AND
no owner word already answers it, his rulings searched first; (2) policy
does not already answer it — if it does, it is an action, done; (3) the
proposed answer is itself right — a "dismiss / close / defer" verb is a
tell, since signals clear by fixing, landing, routing with a home or
refuting with evidence, never by being made to go away. A peer's handover
list is input to the tests, never their output.

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
- **Notify at the action moment; presence is evidenced, never inferred.**
  At a genuine owner-action moment (a PR fully green and merge-ready
  awaiting the code-owner, a blocker needing a decision, a long task
  finished), send the notification. Treat the owner as present only when
  a *recent actual owner message* exists — monitor ticks, CI events, task
  notifications, and the agent's own output are never presence evidence.
- **When the owner has said they are away, a card is a hold, not a
  notification.** The owner's word (2026-09-08 21:1xZ, verbatim): "stop
  doing things that need approval, I am not here, you will get yourself
  stuck and do no useful work for ten hours." A blocking ask raised into an
  absent owner's session holds the seat until the owner happens past the
  terminal; record the question with its facts and the seat's proposed
  answer on the Director's channel or the PR for the owner's next action
  moment, take the next slice under the standing rulings, and never treat
  the answer as owed before they return (a card raised at bedtime was
  answered "we will discuss this tomorrow", 2026-09-08). Blocking asks stay
  cards (§below): an absent owner is the case where the card waits for
  their return, so nothing blocks on it meanwhile.
  A card's answer can arrive days later (one raised 2026-09-17 ~20:2xZ was
  answered on 2026-09-19), and every time-bound assumption in the seat's plan
  expires in between: a branch's 24-hour lifetime, a claim's freshness, a
  watcher's cap. The pause notice written beside the card names each such
  edge and what the resume does first if it has passed.
  When in doubt at a real action moment, err toward notifying: a needed
  notification that lands beats one suppressed on a guessed presence
  signal. (Worked failure 2026-07-01: a merge-ready push for PR #291 was
  suppressed on "they're clearly watching" inferred from monitor ticks
  and the agent's own hold-messages; the owner was away, and the one
  notification that would have pulled them back never fired.)

### Design iterations show the owner rendered pixels, not artefact paths

UI design work keeps the owner in the loop with the render itself (owner
standing directive, 2026-07-23): at each design iteration worth a look — a
new candidate, a significant restyle, a theme pass — open the rendered page
in a Chrome tab (local file with resolvable stylesheet href, dev server, or
preview URL) and tell the owner what to look at. Design decisions are
visual; artefact paths and prose descriptions leave the owner unable to
exercise his glance, and a render published only to an agent-side sync
surface is not "shown". The render IS the visible surface for design
decisions, and this applies to any UI-shipping lane.

The cadence is the owner's too (2026-08-13): "design work needs continual
review, because otherwise the wrong thing is worked on and time is wasted …
frequent and tight feedback loops are the essence of modern best practice."
A seat that runs tight loops between agents (review fleets, expert chains)
while deferring the one loop that validates direction, the owner seeing
pixels, to an internal finish line has inverted the practice. Plan design
work so the owner sees rendered pages at each structural milestone, the
first look at the skeleton and never after "done"; and write every
owner-facing report in outcome language (pages, pixels, what changed for a
viewer), because internal codenames, bundle numbers and ledger sections
carry no meaning outside the session and read as "nothing is happening"
even when work is intense (owner, same day: "You say you are running
something to go, I don't know what that means, but whatever it means,
nothing is actually happening").

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

An answer the owner gave on a premise that changed within minutes is asked again with the new
premise. It is neither overridden nor obeyed blind.

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

## Blocking asks are ALWAYS cards (owner verbatim, seventh escalation)

Any request that BLOCKS on owner input is delivered as a visible card
(AskUserQuestion), never as prose the owner must notice. The mechanical
tell: any "holding for your word" line WITHOUT a live card is the failure —
a question alive only in prose is invisible at the moment it matters. This
was the owner's SEVENTH escalation of the same defect before it was
promoted here from buffer memory (2026-07-31); treat prose-blocking as a
zero-tolerance shape.

The escalations that followed (eight by 2026-08-12: "please give me decisions
as cards, always") fix the mechanics:

- **The trigger is mechanical.** A turn whose text carries a question mark
  aimed at the owner, or the words "your call", "want me to", "shall I",
  "say the word", ends in a card carrying that question instead. A question
  already asked in prose is still uncarded; re-asking in prose compounds the
  failure. The scope is CHOICES, not only decisions: any turn laying two paths
  before the owner is a card, however reversible the paths.
- **Gates are decision states.** Waiting-for-review, a merge word, a
  ratification of a presented plan, a design sign-off: each is a card in the
  turn it becomes the owner's, and every later turn that would restate
  "standing by" re-fires the card. A heartbeat label or closing line reading
  "blocked on owner" without a live card is the tell.
- **Owner-run actions are carded too.** An action only the owner can safely
  run (risk-class git on the primary, re-auth, a held branch deletion) is a
  card the moment it exists, typically "Run now" with the exact command to
  type via `!` versus "Leave for later". "Non-blocking" does not downgrade a
  card to prose: urgency is the owner's call, visibility is the seat's.
- **Cards are self-contained.** The card renders apart from the chat; the
  what, the why and the trade-off go inside the question text and option
  descriptions, never "given the explanation above". Prose may elaborate; the
  card stands alone.
- **The lenses decide WHAT reaches the owner; the card only formats HOW**
  (owner, 2026-07-25: "don't use up my time with questions you have not put
  through the decision matrix"). A question is carded only when it survives
  the decision lenses or is constitutively the owner's; "irreversible" is not
  a survival criterion, because the safety rules demand conservation proof
  before the analysis and then the disposition is forced. Execution
  permission is separate: a risk-class step stays owner-run even when the
  decision is settled, and that card presents the command, never the
  question of whether.
- **More than four questions are successive cards**, never a prose overflow;
  an open-ended question still travels as a card with candidate options plus
  free text.

## An owner ask binds at its first utterance

A fourth-time owner ask means the first record did not BIND (owner,
2026-08-10: "for some of them it is the fourth time I have asked for
something, I don't want there to have to be a fifth"). The asks WERE
recorded — as prose in chat, plan narrative, even the napkin — and prose
records decay into "routable at your word" phrasing that silently
re-attaches an owner gate the owner already discharged: a skills-grouping
ruling given with "no debate" was "still not grouped" three days later; a
standing merge policy already recorded was re-gated on owner clicks the
same day it was cited. Recorded is not executed; the record must carry WHO
acts and WHEN or every reader re-derives caution and waits. At the FIRST
ask, convert: an execution ask becomes a routable lane marked READY with
its route moment named, needing no further word; a policy ask becomes the
gating rule or validator that fires at the decision point; an owner ruling
is never left as narrative only. At every freeze or handoff, sweep the
owner's words against this test — any "at the owner's word" phrasing where
the word already exists is a defect.

## Cross-references

- Composes with [`present-verdicts-not-menus.md`](present-verdicts-not-menus.md)
  — when an action-moment AskUserQuestion is appropriate, the options are
  verdicts-with-rationale, not opinion menus.
- Composes with [`agent-state-observable.md`](agent-state-observable.md)
  — owner observability at action-moments is one application of the
  broader "agent state that affects others must be observable" principle.
- Composes with [`present-verdicts-not-menus.md`](present-verdicts-not-menus.md)
  — agents analyse and present verdicts at action-moments, never pass
  analysis responsibility back to the owner via reasoning-moment questions.
