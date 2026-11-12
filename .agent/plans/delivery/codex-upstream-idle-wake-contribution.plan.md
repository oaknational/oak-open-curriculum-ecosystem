---
id: codex-upstream-idle-wake-contribution
node_type: delivery
name: "Speculative: idle wake as an upstream Codex contribution, and the native-loop question"
overview: "Owner-commissioned speculative exploration of contributing an atomic, capability-scoped wake-on-idle API to the upstream Codex codebase — replacing the ruled-out pinned native extension — and of whether that surface would enable Codex-native loop functionality similar to Claude Code's."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-01
---

# Speculative: idle wake as an upstream Codex contribution, and the native-loop question

**Standing and scope, stated first.** This plan is SPECULATIVE by owner
commission (2026-08-01): the owner ruled against carrying a pinned native
Codex extension (disproportionate maintenance for the benefit — see the
rulings section of
the `codex-app-server-idle-wake` sketch, archived at
`.agent/plans/delivery/archive/codex-app-server-idle-wake.plan.md`) and
commissioned exactly this exploration in its place — "open a speculative
plan to explore doing this work as a PR into the Codex codebase, and also
consider if this would enable a Codex native 'loop' functionality similar
to Claude's. The goal for this work becomes creating the speculative plan,
and then it is done." **The creation of this document discharges that
commission.** No implementation, upstream issue, fork, or contribution
work proceeds from here without fresh owner word.

## The problem an upstream API would solve

A sole Codex team seat cannot become active on a relevant external event
(a canonical comms event) without a user prompt, a foreground poll, or a
second seat. The deferred sibling plan proved the mechanism need
first-hand against codex-rs 0.146.0:

- Codex's `try_start_turn_if_idle` reservation is the natural atomicity
  seam: it rejects active turns, Plan-mode work, and internal pending
  triggers.
- The seam's gap: it does not atomically prioritise a simultaneous
  external TUI/app-server submission — a wake could race a genuine user
  request. The sibling plan's answer was a user-priority submission
  generation/barrier held for the wake turn's full lifetime.
- Without a supported surface, all of that lives in a native extension
  compiled against Codex internals — the exact shape the owner ruled out.

## What the upstream contribution would propose

A capability-scoped, atomic wake API on the app-server surface, owned and
maintained upstream:

1. **`turn/start_if_idle`** (or equivalent): an atomic reservation that
   starts a bounded turn only at a provable idle boundary, carrying an
   opaque correlation token, and rejecting (queuing at the caller's
   option) when the seat is active, in Plan mode, or holds pending
   internal work.
2. **User-priority fence as API semantics, not caller discipline**: any
   concurrent user submission (TUI or app-server) wins; the woken turn
   aborts before its input or settings can leak into the user's turn.
   This is the design contribution — the seam exists but its priority
   semantics are today unspecified upstream.
3. **Capability scoping**: the wake caller supplies the turn's tool and
   settings envelope; the API refuses envelopes wider than the caller's
   declared scope, so a wake turn is confined by construction rather than
   by prompt.

Contribution shape: an upstream issue/RFC first (the API's semantics are
the substance; code is small once agreed), then a PR against codex-rs's
app-server protocol layer. Effort is dominated by design review latency,
not implementation size. Risks, honestly: OpenAI may decline or already
have an internal equivalent in flight; protocol-layer review cycles are
slow; acceptance timelines are outside Oak's control. Mitigation is the
shape of the ask itself — a minimal, generally-useful primitive (many
multi-agent frameworks want wake-on-idle) rather than an Oak-shaped hook.

## Would this enable Codex-native loop functionality?

Plausibly yes — and that is the stronger upstream pitch. Claude Code's
loop mechanism is: a scheduled wakeup re-invokes the session with a
carried prompt; the session self-paces by choosing the next delay; user
input always pre-empts. Decomposed, that is three primitives:

1. a **timer source** (schedule a future wake with a carried prompt);
2. an **idle-boundary turn start** that cannot trample user activity —
   exactly primitive 1+2 of the API above;
3. a **re-arm surface** the model can call from inside the turn.

The wake API supplies (2) wholesale. (1) and (3) are thin once (2)
exists: a timer is just another wake caller, and re-arm is the same
scheduling call issued from within a turn. So the contribution is best
framed upstream not as "let Oak's coordinator wake a seat" but as "the
primitive under self-pacing agent loops, external-event wake, and cron
prompts alike" — one API, three widely-wanted behaviours. The loop
framing also answers the capability-scoping question naturally: a loop's
envelope is whatever the arming turn held, no wider.

## What this plan is not

- Not a commitment to contribute, an upstream issue, or any code — fresh
  owner word gates every step beyond this document.
- Not a revival of the pinned native extension in any form; that ruling
  stands.
- Not a change to today's working degraded paths (relay child + bounded
  foreground polling), which continue regardless.

## If commissioned later, the first three steps

1. Search the upstream codex repository and issue tracker first-hand for
   existing wake/loop/scheduling proposals or in-flight equivalents
   (capability questions from original sources, at time of use — the
   0.146.0 facts above are dated and must be re-verified against the
   then-current release).
2. Draft the RFC/issue text around the three-primitive framing, with the
   user-priority fence semantics as the design centrepiece.
3. Card the owner with the RFC draft and the contribution's expected
   review-latency cost before anything is posted publicly.
