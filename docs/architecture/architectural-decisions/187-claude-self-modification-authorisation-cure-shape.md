# ADR-187: Claude Self-Modification Authorisation Cure-Shape (C2 + C5 + C4)

**Status**: Accepted 2026-05-25
**Date**: 2026-05-25
**Related**:
[PDR-079](../../../.agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability distinction — this ADR is authored under
PDR-079's repo-bound classification: the authz substrate, the
verdict matrix, and the named cure-shape combination are
host-repo-specific phenotype, not portable doctrine; the portable
principle behind the cure-shape — _"agent self-modification of a
shared trust surface MUST proceed through an authorisation
mechanism the trust principal can audit"_ — could later be
extracted to a PDR if the pattern recurs across host repos);
[ADR-183](183-comms-event-tag-namespace-substrate.md) (comms-event
tag namespace substrate — Re-ratification trigger A below uses
this substrate's `behaviour-note` / `failure-mode` channels to
surface platform-engagement responses; the substrate is the
recording surface, not the authority);
[ADR-186](186-comms-event-heartbeat-lifecycle-substrate.md) (heartbeat
substrate — sibling substrate ADR; both this ADR and ADR-186 are
phenotypes of portable PDR doctrine, mounted on the same comms-event
substrate, governing orthogonal lifecycle dimensions).

## Context

Multi-agent operation in this repository surfaced a recurring
authorisation question: **when a Claude agent's substantive work
requires writing to `.claude/...` files** (settings, hooks, slash
commands, agent definitions, anything that modifies the agent's own
runtime configuration or other agents' runtime configuration), **what
is the authorisation mechanism that gates the write?**

The question is structurally distinct from ordinary repo edits.
Ordinary edits touch product code or documentation under shared
governance; `.claude/...` edits modify the substrate that determines
how the next agent will behave. The trust principal for that
substrate is the repository owner; the modifying principal is an
agent the owner has invoked but has not pre-authorised for arbitrary
substrate change.

Without a designated authorisation mechanism, the failure modes are:

- **Rubber-stamp cascade**: agent proposes; owner approves
  reflexively; effective owner authority degrades to noise.
- **Silent gates**: gitleaks-style rules that fire non-
  deterministically; rule retirement creates silent bypass.
- **Tribal knowledge**: each agent rediscovers the constraint;
  no canonical record; new agents stall on the question.
- **Indefinite tolerance**: agent broadcasts the constraint;
  no follow-up; the broadcast becomes folklore; next session
  proceeds as if no constraint existed.

The five-shape cure-space (C1-C5) was enumerated in the
Charcoal+Wilma analysis surfaced during the M1 Safe Pause cycle.
The owner-verdict on the cure-shape combination was received via
Director Seaworthy tick #2 (2026-05-23 19:28:47Z, owner-direct
2026-05-24 R1.5: _"Author it now"_).

This ADR codifies the verdict as the repo-bound architectural
decision-of-record.

## Decision

### The cure-shape combination ratified

**Three of the five enumerated cure-shapes are adopted as a
combination; two are explicitly rejected:**

| Cure-shape                                                                            | Verdict                     | Operative state                             | Rationale                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| C1 — owner-touch rubber-stamp                                                         | **REJECTED**                | n/a                                         | Rubber-stamp cascade + organisational SPOF; 4-Director carry as empirical evidence of indefinite tolerance under this shape.                                                                                                                           |
| C2 — scoped trust grants per session-context with explicit owner authorisation events | **ADOPTED (deferred)**      | Platform-deferred (target shape, near-term) | SAFE-WITH-CONDITIONS; requires platform-level binding of the trust grant to prevent forgery. Trigger: see C2-deferred trigger below.                                                                                                                   |
| C3 — silent gitleaks-style violation surface                                          | **REJECTED**                | n/a                                         | Gate fires non-deterministically; rule retirement creates silent bypass; no positive authorisation event, only a negative blocker that decays.                                                                                                         |
| C4 — owner-direct-only path for self-mod when neither C2 nor C5 applies               | **ADOPTED (in-effect-now)** | **In-effect-now (operative)**               | SAFE-WITH-CONDITIONS; carries the contract until C2 or C5 lands. Operative-state: the agent halts, broadcasts the proposed self-mod with rationale, and waits for explicit owner authorisation in the same session-context before executing the write. |
| C5 — platform-level binding self-modification authorisation primitive                 | **ADOPTED (deferred)**      | Platform-deferred (target shape, long-term) | SAFE; cleanest substrate-shape; depends on a future Anthropic-platform capability. Trigger: see C5-deferred trigger below.                                                                                                                             |

### Operative-state distinction (load-bearing)

This decision is **not** "C2 + C5 + C4 are equivalent and any may
apply at any time." The three adopted cure-shapes occupy distinct
operative states and the distinction is binding:

- **In-effect-now (the contract that governs today)**: **C4 only.**
  Until C2 or C5 lands platform-side, every Claude self-mod write to
  `.claude/...` substrate proceeds through the C4 owner-direct path.
  The agent stops, surfaces, and waits for owner authorisation.
- **Platform-deferred (the target shape, awaiting platform support)**:
  **C2 + C5.** When the Anthropic platform supports either scoped
  session-context trust grants (C2) or binding self-mod authz
  primitives (C5), the operative state shifts and C4 retires for
  the substrates the new mechanism covers.
- **Explicitly rejected**: C1 + C3. The two rejected shapes MUST
  NOT be re-introduced as alternatives without a fresh ratification
  cycle citing new evidence that supersedes the rejection
  rationales above.

### C2-deferred trigger

C2 (scoped trust grants per session-context) becomes operative for
the substrate it covers **when the Anthropic platform supports
binding self-mod authz at the session-context boundary**. Until
that platform capability lands, C2 is the named target shape but
the operative path remains C4. The trigger is platform-side;
no in-repo action makes C2 operative.

### C5-deferred trigger

C5 (platform-level binding primitive) becomes operative **when
the Anthropic platform ships a self-modification authorisation
primitive that an external trust principal can audit**. C5 is the
long-term target shape; its trigger is platform-side and may
arrive independently of C2's trigger, before it, or after it.

### Platform-engagement vehicle

The platform-side dependency for both C2 and C5 currently has **no
named engagement vehicle in this repository**. This is a
load-bearing gap, not an architectural oversight: the cure-shape
combination is internally complete (C4 carries the contract), but
the deferred triggers cannot fire absent an Anthropic-side
engagement track. **Action assigned**: repository owner opens an
engagement vehicle (a documented Anthropic-side issue, a feedback
channel, a contact, a feature request, or equivalent) and records
the vehicle's pointer in a follow-on amendment to this ADR. Until
that vehicle exists, the C2 + C5 deferral risks decaying into
"named but unrouted" — which is the C1 failure mode reappearing
one layer up.

**Recurring-surfacing cadence (to prevent the named gap from
becoming silent tolerance)**: absence of a named vehicle SHALL be
surfaced in `.agent/memory/operational/repo-continuity.md` under
§"Open Owner-Decision Items" until landed, and reviewed at every
quarterly continuity-cycle sweep. The recurring signal converts
"named owner-action" into a fitness pressure that compounds with
each cycle the gap remains open — preventing the C1-at-one-layer-up
regression that "named but unrouted = indefinite tolerance" would
otherwise produce.

### Multi-part handshake framing

C2 and C5 are filed as a **sequenced pair**, not as independent
deferrals: the platform-engagement vehicle SHOULD pursue both
shapes through the same engagement track, treating them as a
multi-part handshake (C2 lands first as near-term enabling
primitive; C5 lands second as the long-term substrate). The
engagement track MUST reserve the right to evaluate any
C6-shaped counter-proposal from Anthropic on its merits without
treating the C2+C5 sequence as a closed verdict; the verdict
matrix is the current best shape, not a contract with the platform.

### 5-shape closure framing

The 5-shape cure-space (C1-C5) is treated as **complete based on
the Charcoal+Wilma analysis surfaced during the M1 Safe Pause
cycle**. Surfacing a previously-unenumerated cure-shape (C6, C7,
etc.) supersedes this ratification on its merits — a new shape
that addresses the same failure modes more cleanly is a legitimate
re-ratification trigger (see triggers below). The 5-shape
enumeration is not a permanent closure; it is the current
analysis-of-record.

### Re-ratification triggers (when this decision must be re-opened)

This decision SHALL be re-opened — through a fresh ratification
cycle, not silently — when any of the following fires:

- **A — Anthropic platform response**: the platform ships a
  capability that lands C2, lands C5, or proposes a C6-shaped
  counter to either, OR explicitly declines the engagement.
- **B — Owner direction**: the repository owner explicitly amends
  the cure-shape combination.
- **C — Substrate-pointer-pattern v3 cure with schema amendment**:
  a future structural cure for the substrate-pointer-pattern named
  in `.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md`
  changes the comms-event or claim-state schema in a way that
  intersects with C5's substrate-as-API contract (see below).
- **D — Cursor availability shift**: if the owner's response
  latency on the C4 path materially shifts (e.g. > 4 hours C4
  unavailability becomes a routine pattern in a team session),
  the C4 contract's "synchronous owner-direct path" assumption
  weakens and the team escalates to the owner for a new operative-
  state direction (typically: pause the in-flight agents OR
  authorise a longer C4 deadline OR shift to a different cure-
  shape). **Fallback default action when escalation itself is
  blocked by owner-unavailability**: the in-flight agent's
  substantive work pauses, the agent broadcasts pause-state to
  the team, and authorisation MUST NOT be silently widened (no
  silent timeout-to-approval; no implicit "carry on"). The
  denial-of-service condition (work stalls) is preferred to the
  unauthorised-write condition (silent self-mod under stale
  authorisation assumption).
- **E — Cumulative C4-tax**: if the per-rolling-30-day rate of
  C4 surfacings to the owner crosses an owner-set threshold, OR
  the owner observes self-stamp-quality degradation (rubber-stamp
  reflex returning despite C4's surface-discipline), the team
  surfaces the cumulative-tax signal to the owner and a fresh
  ratification cycle re-evaluates whether the platform-deferred
  triggers (A) need active engagement-track intervention, whether
  the C4 surface-shape itself needs amendment, or whether a
  reduced-scope C2 stopgap should be authored as an in-repo
  interim. Trigger D handles the _acute_ availability case;
  trigger E handles the _cumulative_ attention-tax that would
  otherwise re-create the C1 rubber-stamp failure mode along a
  different decay path.

### Substrate-as-API schema-versioning reserve (C5 surface)

**Conditional framing**: _if_ C5 binds to substrate-emitted comms
events and recorded claims as the platform-side audit surface
(which is the most plausible shape given the current substrate
design but is not yet confirmed against any actual Anthropic
specification), _then_ the comms-event and claim-state substrates
at `.agent/state/collaboration/` become part of the Anthropic
classifier-API contract surface — the platform binds authz to
events the substrate emits and claims the substrate records. **In
that conditional world**, schema-stability becomes an obligation
that does not exist under C4: critical amendments to these
substrates after C5 lands MUST carry a coordination clause naming
the platform-side classifier impact (the amendment broadcasts the
schema change to the engagement-vehicle inbox before landing).

**Substrate authentication and integrity requirement (C5-only)**:
when C5 lands, substrate writes that influence authz outcomes MUST
be authenticated to a specific agent identity (`(agent_name,
session_id_prefix, platform, model)` per PDR-027 + PDR-076a) and
integrity-checked. The substrate becomes a security-relevant
interface; ordinary repo-governance write semantics no longer
suffice. Adversarial substrate manipulation (crafted comms events,
forged claim entries) becomes an attack surface against platform
authz decisions. The reserve activates this clause alongside the
schema-stability obligation.

This reserve is held in escrow for activation when C5's deferred
trigger fires; the exact coordination-clause content + audit-
authentication mechanism are drafted concurrent with C5
ratification, not in advance. Until then, the substrates evolve
under ordinary repo governance.

### Change authority

Change authority over this ADR's substance is:

- **Owner direction**: unconditional; the cure-shape combination,
  the rejected shapes, the deferred triggers, and the re-
  ratification triggers may all be amended by direct owner
  direction.
- **Director-coauthored amendment**: if the substrate-pointer-pattern
  v3 cure (re-ratification trigger C) lands a schema amendment that
  intersects this ADR's substrate-as-API reserve, a coauthored
  amendment between the agent landing the cure and the Director
  in the same session is required.
- **Platform-engagement-track owner**: amendments triggered by
  Anthropic response (re-ratification trigger A) are coauthored by
  the agent absorbing the response and the owner's named
  platform-engagement-track contact.

### Upstream alternative explicitly noted

The "agent-authored staging file + human-script-promotes" pipeline
(agent writes proposed `.claude/...` change to a staging file under
a non-`.claude/` path; a human-invoked script promotes the staging
file into `.claude/...`) was raised as a candidate during the
analysis. **It is structurally equivalent to C1** (the human-script
invocation is the owner-touch step), and is rejected on the same
rationale: rubber-stamp cascade + indefinite-tolerance failure
mode under repeated promotion. Recording this here to spare future
agents the re-derivation.

### Citation discipline line (for cross-substrate references)

Substrate-to-substrate citations in this ADR's amendments and in
downstream cure-shape implementations use **comms-event identifiers
(UUIDs)** for substrate cross-references and **commit SHAs** for
git-landing references. The rule:

- _"event-id for substrate; SHA-prefix for git-landing"_

Codified here for the WS-8 substrate; a follow-on amendment to
`.agent/rules/sha-prefix-in-collaboration-content.md` should pick
up the line and apply it repo-wide. The amendment is named as a
follow-on, not as part of this ADR's substance.

## Mechanism

### The C4 in-effect-now contract (operational discipline)

When a Claude agent's substantive work requires writing to a
`.claude/...` file:

1. **Halt**: the agent does not write the file. Substantive work
   blocks at the boundary.
2. **Surface**: the agent broadcasts the proposed change with
   inline rationale — what file, what diff, why the change is
   needed for the substantive work in flight, **and the trigger
   source** (user direction; comms event id; tool result; sub-agent
   transcript). The trigger-source citation is load-bearing: it
   lets the owner evaluate whether the request originates from a
   trustworthy source rather than from adversarial input (a
   prompt-injection from a tool result, a corrupted comms event,
   a malicious sub-agent transcript). A surface without
   trigger-source citation is a confused-deputy surface — the
   owner SHOULD refuse and request the provenance before
   authorising. The broadcast is a `directed` comms event to the
   owner OR a `narrative` broadcast if the owner's attention is
   already on the session.
3. **Wait**: the agent waits for explicit owner authorisation in
   the same session-context. Implicit authorisation (silence,
   "carry on" without naming the file) is NOT sufficient — the
   owner must name the substantive change as authorised.
4. **Execute on authorisation OR route elsewhere**: on owner
   authorisation, the agent writes the file and broadcasts the
   landing. On owner refusal or owner-routing to a different cure-
   shape, the agent abandons or re-shapes the substantive work as
   directed.

The mechanism is verified at execution time, not at planning time:
an ADR or plan may **describe** a substantive `.claude/...` change
without owner-auth (the description is documentation); the
**execution** of the change requires owner-auth.

### The C2 target contract (when platform support lands)

**Grant-dimension enumeration (required for any C2-shaped platform
proposal)**: any platform-shipped grant primitive MUST specify
each of the following dimensions before the C2 contract activates:

- **(a) Subject set**: file-pattern OR explicit path-set the
  grant covers (e.g. `.claude/settings.json`, OR
  `.claude/hooks/*.mjs`, OR an enumerated list).
- **(b) Operation set**: which write operations the grant covers
  (create, modify, delete; partial subsets are permitted).
- **(c) Purpose binding**: a human-readable purpose statement the
  agent's substantive work MUST stay within (e.g. "adding allowed
  MCP servers"; out-of-purpose writes within the file-pattern
  revert to C4).
- **(d) Session-context binding**: the grant is bound to the
  agent's specific `(agent_name, session_id_prefix, platform,
model)` identity tuple per PDR-027 + PDR-076a; cross-session
  reuse is structurally prevented.
- **(e) Expiry and revocation semantics**: explicit TTL OR a
  revocation event the owner can issue mid-session; silent
  grant-persistence-across-sessions is forbidden.

**Forgery-resistance criteria (required for any C2-shaped
platform proposal)**: the grant MUST satisfy each of:

- **(i)** Grant issuance occurs outside the agent's writable
  surface (the agent cannot author or modify its own grant).
- **(ii)** Grant verification is platform-side, not agent-side
  (the platform enforces; the agent presents but does not
  evaluate).
- **(iii)** Grant identifier is cryptographically bound to the
  session-context the platform attests (a stolen grant identifier
  alone does not authorise; the session-context must match).
- **(iv)** Replay across sessions is structurally prevented (a
  past-session grant cannot be reactivated in a new session
  without owner re-authorisation).

**Operational sequence under C2** (once a platform proposal meets
the dimension + forgery-resistance criteria):

1. The session-context carries a grant per the dimensions above,
   authored by the owner at session-open or per-direction.
2. The agent's substantive work either falls within the grant
   (proceed; emit a per-grant-exercise comms event — see audit
   requirement below) or falls outside (revert to C4 — halt and
   surface).
3. The grant is platform-bound; the agent cannot forge or expand
   it. The owner can revoke or amend mid-session.

**Audit surface requirement (C2-specific)**: each per-grant
exercise (each write performed under the grant, not just the
grant issuance) MUST emit a `directed` or `narrative` comms event
to the substrate naming (a) the file written, (b) the diff
landed, (c) the grant identifier under which the write was
authorised. Silent in-grant writes are forbidden: a scoped grant
without per-exercise audit collapses to a "silent-write window"
and reproduces the C3 failure mode (silent writes with no
positive authorisation event).

### The C5 target contract (when long-term platform substrate lands)

When Anthropic ships the binding self-mod authz primitive:

1. The platform itself gates `.claude/...` writes against the
   audited authz policy; the agent's substantive work cannot
   bypass.
2. The trust principal (owner or owner's delegate) sets the policy;
   the platform enforces.
3. The comms-event substrate becomes the audit surface (see
   §Substrate-as-API schema-versioning reserve above).

### Operational caveats (load-bearing additions)

**Mixed-tenant impact disclosure (C4 surface, all cure-shapes)**:
many `.claude/...` files have fleet-wide impact — a change to
`.claude/settings.json` or `.claude/hooks/*` affects every agent
in subsequent sessions on this repo, not just the proposing
agent. The C4 surface step (and equivalently any C2 grant
exercise or future C5 mechanism) MUST stratify the proposed
change's impact radius in the surfaced rationale:

- **Per-agent-local impact**: the change only affects the
  proposing agent's behaviour (rare for `.claude/...` files).
- **Fleet-wide impact**: the change affects all agents that
  consume the file in subsequent sessions on this repo. This
  is the default classification for any `.claude/settings.json`,
  `.claude/hooks/*.mjs`, `.claude/agents/*`, `.claude/skills/*`,
  or `.claude/rules/*` modification.
- **Cross-platform impact**: the change affects more than one
  platform's agent surface (e.g. a shared `.agent/...` file that
  multiple platform-specific adapters resolve to).

A fleet-wide change carries a stronger consent expectation than a
per-agent-local change; the owner authorising under C4 (or
issuing a grant under C2) needs the impact-radius information to
calibrate the authorisation appropriately.

**Owner-bottleneck under team-size growth (C4 capacity model)**:
the C4 synchronous-owner-direct path does not scale freely with
team size. As N concurrent agents grows, the per-session C4
surfacing rate compounds and the owner becomes a coordination
bottleneck (re-ratification trigger D names the acute case >4hr;
trigger E names the cumulative rolling-30-day case). At
team-shape transitions (3-agent team becoming 5+, or 5-agent
becoming 10+), the team SHOULD surface the projected C4 load to
the owner before scaling — either to gate the team-size increase
on C2 landing first, or to make the capacity trade-off explicit
under continued C4. The capacity decision is owner's; the
discipline is that the team does not silently grow into a C4
bottleneck and discover the failure mode under load.

**Operational-security assumption (owner-channel integrity)**:
the C4 contract assumes the owner's authorisation channel
(chat session, comms-event surface, signed direction) is
integrity-protected — if the owner's account, session, or signing
key is compromised, the C4 path becomes the attack vector
(adversary authors `.claude/...` writes that the compromised
owner-channel approves). This ADR does NOT prescribe owner-channel
hardening (out of scope; that is platform-level and
deployment-level discipline), but the assumption is named
explicitly so future security amendments can target it. The same
assumption transitively applies to C2 (grant issuance requires
owner-channel integrity) and to C5 (the platform's authz binding
requires platform-level integrity assumptions that the substrate
inherits).

### Migration discipline (across operative-state transitions)

When a deferred trigger fires (C2 lands platform-side, or C5
lands, or a C6 counter-proposal lands), the operative-state
transition is a separate ratification cycle, not a silent shift:

- The agent observing the platform-side capability authoring the
  re-ratification surfaces (a fresh ADR amendment or a new ADR).
- The amendment names the new operative state, the substrates
  the new mechanism covers, and the C4 retirement scope (which
  substrates continue under C4 versus which migrate).
- Until the amendment lands, C4 remains the operative path even
  if the platform capability is technically available.

## Consequences

### What this enables

- A canonical doctrine surface for the `.claude/...` self-mod
  question; new agents reach the C4 contract immediately and don't
  re-derive.
- A named operative-state distinction prevents the "C2+C5+C4
  ratified" framing from collapsing into "any path applies" —
  C4 is currently load-bearing, the others are aspirational.
- An explicit re-ratification trigger set with named conditions
  prevents the decision from drifting silently as platform context
  shifts.
- A platform-engagement-vehicle action assigned to the owner
  prevents the C2/C5 deferral from decaying into indefinite
  tolerance (the C1 failure mode at one layer up).
- A schema-versioning reserve for C5's substrate-as-API contract
  prevents future substrate amendments from silently breaking the
  platform-side classifier when C5 eventually lands.

### What this costs

- C4 carries an owner-time cost on every `.claude/...` change. The
  cost is the price of safety; the rejected C1 / C3 shapes traded
  safety for owner-time reduction.
- The deferred-triggers framing requires future agents to read the
  re-ratification triggers section before assuming the operative
  state has shifted. The state-thresholds table above is the
  fast-read reference.
- The platform-engagement-vehicle gap is a real coupling cost
  until the owner opens a vehicle. Naming it explicitly is the
  cure shape that prevents the gap from being silently tolerated.
- The substrate-as-API reserve creates a schema-versioning
  obligation that doesn't fire until C5 lands. Authors of future
  substrate amendments need to read this ADR before amending the
  comms-event or claim-state schemas, to anticipate when the
  reserve activates.

### What this forbids

- C1 and C3 MUST NOT be re-introduced as the **primary**
  authorisation cure-shape without a fresh ratification cycle
  citing new evidence superseding the rejection rationales
  (rubber-stamp cascade for C1; non-deterministic gate decay
  for C3).
  - **C3-as-defence-in-depth scope clarification**: a
    negative-blocker of C3 shape (e.g. a gitleaks-style rule
    that fires on a `.claude/...` write outside any active
    authorisation) MAY be retained as defence-in-depth
    alongside the adopted positive-authorisation cure-shape
    (C4, eventually C2 or C5). The rejection of C3 is of C3
    _as the primary authorisation mechanism_, not as a
    belt-and-braces layer. A C3-shaped negative blocker that
    fires when no C4 / C2 / C5 authorisation is in scope is a
    useful additional surface and does not collapse to the
    failure modes the C3 rejection rationale named.
- The C4 contract's "halt + surface + wait" sequence MUST NOT be
  silently shortened (e.g. "implicit authorisation from silence
  after N minutes"). Implicit authorisation re-creates the C1
  failure mode.
- Future amendments to this ADR MUST preserve the operative-state
  distinction structure (three explicit sections: in-effect,
  platform-deferred, rejected) rather than collapsing the verdict
  into one combined claim.

## Validation

Deterministic validation per the parent plan's Cycle 8a acceptance
criteria:

1. This file exists at the path
   `docs/architecture/architectural-decisions/187-claude-self-modification-authorisation-cure-shape.md`.
2. The C2 + C5 + C4 cure-shape combination is explicit;
   `grep -cE "C2|C5|C4"` returns ≥ 1 against this file.
3. The C5 migration trigger (the "binding self-mod authz" /
   "platform-level" language) is named; `grep -c "binding
self-mod authz\|platform-level"` returns ≥ 1.
4. PDR-079 is cited in §Related;
   `grep -c "PDR-079"` returns ≥ 1.
5. The ADR index at
   `docs/architecture/architectural-decisions/README.md` includes
   the ADR-187 entry.
6. `pnpm check` passes.

## Notes

### Build-vs-Buy attestation

No third-party vendor is touched by this ADR. The substrate is
this repository's own `.claude/` configuration surface and the
comms-event stream this repository owns; the cited Anthropic
platform capability is a future-state expectation, not a current
vendor integration. Per the parent plan's §Preflight, ADR-187
carries the explicit Build-vs-Buy attestation: **no third-party
vendor touched by this ADR**.

### Origin and authorship history

The cure-shape combination and the architectural conditions were
authored by Lanternlit (Window 2 / WS-8 ratification lane) per
owner-direct R1.5 (_"Author it NOW"_) on 2026-05-24. The
in-flight authoring did not land before Lanternlit retired; the
WS-8 lane was carried forward via R2 absorption to
`post-m1-attestation-tidy-up.plan.md` Cycle 8a, and this ADR is
the landing artefact for that absorption.

The verdict matrix referenced in the broadcast title convention
(comms event id `1e2c83eb`) was the source verdict surfaced by
Director Seaworthy tick #2 (2026-05-23 19:28:47Z).

### Forward consumers

The cleaner substrate-filter for downstream tooling looking for
self-mod-authorisation events: `kind='directed' AND subject ~
'self-mod' AND tags includes 'authorisation'` (where the tag is
a candidate addition to ADR-183's namespace; not yet ratified,
and not a precondition for this ADR).

The follow-on amendments named in §Citation discipline (extending
`.agent/rules/sha-prefix-in-collaboration-content.md`) and in
§Substrate-as-API schema-versioning reserve (the coordination
clause when C5 lands) are tracked as future-work items, not
preconditions for this ADR's Acceptance.
