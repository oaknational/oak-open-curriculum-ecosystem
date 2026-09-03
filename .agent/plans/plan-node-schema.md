# Plan-node schema — the planning-estate contract

**Status: sketch.** The *structure* this document transcribes was
owner-ratified on 2026-07-22 (planning sitting, part 1; decisions
register D23). This transcription itself is born-sketch and awaits the
owner's ratification glance via its pull request — the same discipline
it defines. Authored fresh from the ratified decisions (a redo, not an
iteration of the prior V0 specification).

## The governing principle

The repository carries **intent and mechanism**: why a piece of work
exists, how it is done, what proves it done, and who ratified it.
Everything that moves with the schedule lives in Linear and is pointed
at, never mirrored. The sorting test, owner-stated: **if it moves when
the schedule moves, it lives in Linear; if it only moves when the
product moves, it lives in the repository.**

Two consequences are load-bearing:

- **Execution state is never a durable repository field.** A plan's
  backlog/in-progress/done state belongs to its Linear ticket, reached
  through the `tickets` edge. Storing it here is what created the
  historical drift this schema replaces.
- **Milestones are a Linear projection, not a plan type.** A milestone
  is a **named, observable state of the product** (the same move as the
  estate's test-describes-a-system-state doctrine); blockers are the
  dependency edges between states. Linear owns the milestone entities;
  the repository's strategic node maps the release definition to its
  delivery plans and points at them.

## Node types

| `node_type` | Carries | Lifespan |
| --- | --- | --- |
| `strategic` | The outcome, the bet it serves, what success looks like, and the tempo of its subtree. No implementation detail. | Long-lived, few in number |
| `delivery` | One step of a lane: goal, mechanism, acceptance criteria with proofs, its Linear ticket. Authored by its implementer at pickup. | Short-lived; archived at completion |
| `runbook` | A repeatable operational procedure: preconditions, steps with executors, verification, rollback. | Long-lived; re-ratified on change |

## Common frontmatter

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | kebab slug, stable forever | all | Never renumbered or reused |
| `node_type` | `strategic \| delivery \| runbook` | all | Closed enum |
| `name` | string | all | Human name |
| `overview` | string, one line | all | What this node is for |
| `status` | `sketch \| ratified \| superseded \| archived` | all | **Ratification state only** — see below |
| `ratified_by` | string | when `status: ratified` | Who gave the word |
| `ratified_date` | ISO date | when `status: ratified` | When |
| `ratified_where` | string | when `status: ratified` | A resolvable pointer to where the word lives (register entry, ticket comment, dated sitting record) |
| `serves` | node or choice id | strategic + delivery; optional runbook | Exactly one edge up: strategic → a published strategic-choice ID; delivery/runbook → a strategic node id |
| `impact_areas` | list from the registry | all | Which product areas this plan changes — [`impact-areas.md`](impact-areas.md), closed and additive |
| `tickets` | list of Linear issue IDs | optional, always (see the 2026-08-07 plan-validity amendment below) | Visibility metadata only — when Oak's Linear tracks the work, the linkage projects it there; validity never depends on it |
| `depends_on` | list of `{ plan, kind: blocking \| beneficial }` | optional | A `blocking` edge clears when its target archives |
| `owner_gates` | list of `{ awaiting, clears_when, expires }` | optional | See gates below |
| `superseded_by` | node id | when `status: superseded` | No plan leaves the estate without naming its successor |
| `gate_expiry_default` | day-scale ISO-8601 duration (`PnD`) | strategic only | The tempo this node sets for its subtree |
| `last_updated` | ISO date | all | Housekeeping |

All enums are **closed and additive**: new members are added
deliberately, in a reviewed change; no field ever widens to a free
string.

## The status axis and the ratification stamp

Every plan is **born `sketch`** and remains a sketch — however green
its checks — until it carries a complete ratification stamp:
`ratified_by` + `ratified_date` + `ratified_where`. Executed is not
ratified; the stamp records that the owner has seen and blessed the
plan's shape, and `ratified_where` makes the word traceable.

Transitions:

- `sketch → ratified` — the stamp is complete.
- `ratified → sketch` — a **scope change** returns the plan to sketch
  until re-ratified; smaller amendments are made in place with dated
  notes (the decisions-register discipline).
- `ratified → superseded` — replaced; `superseded_by` names the
  successor.
- `→ archived` — terminal: a delivery plan completes (its acceptance
  criteria are proven) and moves to the `archive/` directory (created
  with its first member), or an abandoned sketch is archived with a
  one-line disposition note.

## Owner gates — expiring, never open-ended

A gate records that a plan waits on a decision no other plan's
completion can clear:

- `awaiting` — `owner-decision | external-input` (closed, additive).
- `clears_when` — the named condition or person that resolves it.
- `expires` — an **absolute date, mandatory**. A gate with no expiry is
  invalid; an expired gate is surfaced as drift demanding a decision
  (renew, resolve, or archive the plan) — expiry never auto-cancels
  anything.

**The default expiry horizon is strategy-scoped data, not a schema
constant.** The governing strategic node sets the tempo for its subtree
via `gate_expiry_default`; a plan whose gate omits its own horizon
inherits it down the `serves` edge. Absent any setting, the fallback is
**P21D**. (The current release strategic node sets **P3D**, matching
its delivery timescales — that fact lives in the node, not here.)

## Per-type contracts

Common to **every** plan type (owner ruling 2026-08-31): the body names
its **user groups and value** — who experiences or consumes the outcome
and what each group gets, in experience terms; the plan skill carries
the full requirement, including the innovation clause (offered or
hypothesised value with an honest claim boundary satisfies it — advance
need-proof is not required) and the one-line routing form for outcomes
nobody experiences directly. The three authoring templates each carry
the matching section. The requirement binds plans authored or
materially amended from the ruling date onward; the pre-existing estate
is not retroactively invalidated — each earlier plan gains the section
at its next material amendment, never by bulk retrofit (the
dated-amendment discipline above).

### Strategic

The why and the what: the outcome sought, the bet it rests on, what
success looks like, and the tempo (`gate_expiry_default`). It carries
**no implementation detail** and no todos. Its delivery plans declare
`serves: <this-id>` — enumerate them by search, never by a hand-kept
list.

### Delivery

One **step of a lane**, never the lane itself. The lane — the unit of
work one seat holds, bounded by its coherence surface plus the intent
that spans it — is defined in PDR-117 (dated amendment 2026-07-24); a
lane spans one or more delivery plans and tickets, which project it
onto the plan estate and the schedule. The body carries (PDR-018:
narrative in the body, never frontmatter):

- **Goal** — what is true when this lands that is not true now.
- **User groups and value** — the common requirement above, in full.
- **Mechanism** — how, briefly.
- **Acceptance criteria — each with a proof, required.** A proof names
  its evidence class: `repo-safe` (a test, validator, or CI check —
  cite the instrument) or `owner-held` (an external console or
  dashboard — name who verifies and where it is recorded).
- **Todos — optional; proofs on todos optional.** (The owner-resolved
  middle reading: verification cost lands where the claim matters.)
- **Out of scope** — explicit.

### Runbook

A repeatable procedure: **preconditions** (each checkable, check
named), **steps** (numbered, each naming its executor — `agent` or
`owner-held`, an owner-held step surfacing as a visible owner card at
the moment it becomes actionable), **verification**, and **rollback**
(a step with no rollback is named as such, with dated owner
acceptance). Procedure changes re-ratify.

## Sensitivity by construction

Plans are public-repository artefacts: they carry **mechanism only**,
and anything internal rides the linked Linear ticket. The estate
validator grep-guards known-sensitive vocabulary as a tripwire. The
inverse holds for vision and strategy documents: they carry Oak's
public-domain strategy richly, while the internal implementation detail
of Oak's strategy stays on internal surfaces.

## Enforcement

The estate validator (re-cut to this contract in its own lane,
red-first) refuses: an incomplete ratification stamp on a `ratified`
plan; open-enum drift; an `impact_areas` entry absent from the
registry; a gate without an
absolute expiry; `superseded` without `superseded_by`; and an empty corpus
(zero plans is a failure, never a vacuous green).

**Gate-expiry drift (dated amendment 2026-07-31, owner-ruled)**: expired
owner gates on live plans (`sketch`, `ratified`) are surfaced by a
dedicated NON-BLOCKING instrument, `check-plan-gate-drift` (run as
`pnpm plan-gates:check`; an in-repo session-open hook shim projects the
alert into sessions on platforms where the operator has registered it),
which repeats persistently, with resolution instructions, until the
gate rows change. It never blocks commits or CI; the conformance
validator above stays a deterministic function of repo content, with no
clock input.

**Dated amendment (2026-08-07, owner-ruled): plan validity is
repo-internal.** The owner's verbatim ruling: "Work does NOT require a
Linear ticket to be valid, that would tie the repo validity to the
existence of Linear, and how would that work for a different checkout
in a different org? It wouldn't." This supersedes the 2026-07-31
delivery-ticket amendment and its derived-anchoring mechanism entirely
(git history holds the superseded text): no validator obligation may
depend on the presence of records in an external service, however the
obligation is derived. `tickets` is optional visibility metadata at
every status and in every subtree. Ticket-linkage discipline for work
Oak's Linear tracks is operator PRACTICE (thin pointer tickets, PR
linkage — Linear is a visibility surface, the repo is the record,
owner rulings 2026-08-07), carried by working habit and review, never
by repo conformance.

## Relationship to ADR-200 (dated 2026-07-22)

This schema is the deliberately thinner successor of the V0
plan-node-schema bridge under ADR-200 (intent as a living idea graph).
The graph cathedral — the node-type registry, evidence edges, and the
delivery-metrics projection — is **deferred, not deleted**: nothing
here contradicts it, and nothing here builds it speculatively. The
doctrine reconciliation (an ADR superseding the prior lane model and
recording this relationship) is authored during the estate redo.
