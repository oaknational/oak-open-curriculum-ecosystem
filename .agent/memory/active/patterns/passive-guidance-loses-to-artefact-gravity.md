---
name: Passive Guidance Loses to Artefact Gravity
use_this_when: Designing a guardrail against an agent failure mode — choose between documented-but-not-enforced guidance (passive) and an environmentally-triggered rule, hook, or read-on-entry surface (active); passive guidance alone is a watchlist item, not a guardrail
category: agent
proven_in: .agent/memory/active/napkin.md (three instances, 2026-04-20/21)
proven_date: 2026-04-21
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Installing documented guidance (a register entry, a prose bullet, a non-goal) as the countermeasure to a repeated failure mode, then observing the failure mode continue because the agent in the moment has no firing mechanism forcing the check"
  stable: true
---

## Principle

Guardrails earn their cost only when **environmentally enforced**.
A guardrail that lives only as documented guidance — a register
entry, a prose non-goal, a README paragraph, a skill-file sentence
— is a watchlist item. The agent in the moment is carrying
artefact gravity (the plan body, the prior session's commit,
the migration the plan prescribes), and passive guidance is
insufficient weight on the other side. A guardrail that fires on
a named condition without agent recall is a **tripwire**; a
tripwire converts a continuous decision ("should I remember to
check X?") into a discrete trigger event ("environment fires on
condition; check runs").

## Heath-Brothers Tripwire Framing

Chip and Dan Heath name the mechanism in *Decisive* (ch. 9,
"Prepare to Be Wrong") and *Switch* (ch. 8, "Shape the Path").
A tripwire is a **pre-committed rule** that converts a continuous
decision into a discrete trigger event. The decision to check
"should I apply the first-principles check on this inherited
shape?" is continuous — the agent can always decide not to
bother. A tripwire converts that continuous decision into a
discrete trigger: the environment fires on shape-entry, the
check runs, the decision becomes "what did the check say?"
rather than "should I run the check?"

The Heath-brothers key insight: the trigger event is the
load-bearing part, not the rule content. Well-written guidance
that nobody triggers is passive; poorly-written guidance that
always triggers is still a functional tripwire. The design
priority is **firing cadence**, then rule content.

## Instances

Three instances observed in the 2026-04-20 and 2026-04-21
sessions.

### Instance 1 — Perturbation mechanisms did not fire on the 4th/5th/6th inherited-framing instances

The evening of 2026-04-20 installed three perturbation mechanisms
in response to the first three `inherited-framing-without-first-
principles-check` instances: a first-principles metacognition
prompt, a standing-decision register, and a non-goal re-
ratification ritual. All three landed as documented entries in
the napkin / memory surfaces. By mid-2026-04-21 three further
inherited-framing instances had occurred (the 4th, 5th, and 6th
instances in
[`inherited-framing-without-first-principles-check.md`](inherited-framing-without-first-principles-check.md)).
None of the three perturbation mechanisms fired. Each of the
three further instances was caught by external friction (owner
in-flight review, reading the spec against the directive, cross-
checking vendor docs) — not by the register entries, which
remained passive. The register existed; the agent did not read
it at any decision point where it would have helped.

### Instance 2 — Chat-text next-session opener bypassed the authoritative `next-session-opener.md`

During the 2026-04-21 memory-feedback-plan session, the agent
drafted a chat-text next-session opener written against a newer-
but-stale continuity field rather than reading the canonical
`next-session-opener.md` in operational memory. The authoritative
file existed and was documented as authoritative. The agent did
not list the operational files in the directory before writing;
the chat-text draft overrode the canonical surface because no
environmental trigger fired on "you are about to author next-
session content — list the canonical files first".

### Instance 3 — Chat-text opener restated operational structure despite durable homes existing

Later on 2026-04-21 the same session produced a chat opener that
restated operational structure (grounding order, identity
discipline, context-budget rules, close discipline) in ephemeral
chat text — despite `start-right-quick`, `threads/README.md`,
and the `session-discipline.md` template component already
carrying that content as durable surfaces. The durable homes
existed and were in scope. The output-layer had no tripwire at
"before writing operational guidance in chat / ephemeral
output, is the durable home identified and is this text the
session-unique delta only?" The passive knowledge of where the
durable homes lived did not fire against the gravity of the
request to "write a session opener."

## Anti-pattern

Responding to a repeated failure mode by **documenting** a
countermeasure without **installing a trigger**. The failure
mode continues because the documentation has no firing cadence;
the agent in the moment is carrying artefact gravity and the
document is not in scope at the decision point. Three canonical
shapes of this anti-pattern, all observed in the three instances
above:

- **Register-only countermeasure.** Add an entry to a register
  (watchlist, non-goal, standing-decision list) with no rule,
  hook, or read-trigger binding it to a decision point.
- **Documented-but-not-read.** Authoritative surface exists but
  is not listed in the workflow that would need it; the workflow
  relies on the agent remembering the surface exists.
- **Durable home exists, ephemeral output bypasses it.** Chat /
  prompt / opener text restates durable content because the
  generator of the ephemeral output has no check "is this
  already in a durable home I should point at instead?"

## Countermeasure

For every passive countermeasure considered, ask the
Heath-brothers question: **what is the trigger event?**
If the answer is "the agent should remember to check" — that is
passive guidance and will fail under artefact gravity.

Convert to a tripwire by choosing at least one layer with a
concrete firing cadence:

- **Always-applied rule** (`.agent/rules/*.md` + platform
  adapters in `.cursor/`, `.claude/`, `.codex/`) — loaded on
  every session, checks on action entry.
- **Pre-commit hook / CI gate** — fires on commit or push, cannot
  be bypassed without explicit authorisation.
- **Skill / command invocation** — fires when the workflow is
  run, not when the agent remembers.
- **Read-trigger surface** — a short file that `start-right-quick`
  / `start-right-thorough` names in their grounding order and the
  agent must read before acting.

The **variety-across-layers** principle (from the 2026-04-20
perturbation-mechanism register entry) still applies: install at
least two complementary tripwires so no single failure mode
(forgot to read the rule; pre-commit hook bypassed; skill not
invoked) leaves the agent fully exposed. A single tripwire is
better than none; two complementary tripwires is the design
target.

## Forward References

- **Session 3 Perturbation-Mechanism Bundle PDR** (PDR-NNN,
  pending) — will formalise the three perturbation mechanisms
  and explicitly require at least two environmentally-enforced
  tripwires (Family A) plus memory-taxonomy meta-tripwires
  (Family B). The PDR must be self-applying: it cannot land as
  passive guidance about the danger of passive guidance.
- **Session 4 Family-A tripwire installation** — the staged
  plan session that installs the two complementary Family-A
  layers by default (always-applied rule + standing-decision
  register surface); owner may override.
- **First installed Family-A tripwire**: the always-applied rule
  at [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)
  was front-loaded in Session 1 Task 1.4 of the staged plan to
  cover Sessions 2–3 before the full bundle lands.
- **Related pattern**: [`inherited-framing-without-first-principles-check.md`](inherited-framing-without-first-principles-check.md) —
  the artefact-gravity failure mode this pattern's tripwires are
  installed to counter.
