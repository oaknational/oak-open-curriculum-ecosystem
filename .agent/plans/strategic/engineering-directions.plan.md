---
id: engineering-directions
node_type: strategic
name: "Engineering directions — the owner's broad-direction register"
overview: "The owner's standing engineering directions as first-class, discoverable records — each with its maturity, falsifier, consumers, prior art, and promotion trigger — so direction lives in the estate, not in anyone's active memory."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-09-03
ratified_where: >-
  In-session owner decision card at the MCP-673 implementing seat (Chinook seeks Cloud,
  661556), 2026-09-03 ~12:0xZ, answer verbatim "Ratify the shape and all five triggers"; recorded on PR #959 and in the
  estate-coordination thread record's entry of the same day.
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-09-03
---

# Engineering directions — the owner's broad-direction register

> "We have some really amazing reports and research, and currently
> they just sit there linked to by indexes, there are no hubs that
> allow them to be discovered by what they offer or enable, no way to
> start with intended impact and value and discover prior art — that
> is what is bothering me, I know it is there, but other contributors,
> humans, agents, can't read my mind… I am a bit tired from holding it
> all in active memory, I would like it to be externalised and stable
> and discoverable."
>
> — the owner, 2026-08-06, commissioning this node. That word is this
> node's charter: direction externalised, stable, discoverable.

## What this node is

The register of the owner's standing broad engineering directions —
the layer between the strategy streams (`docs/strategy/`) and the
binding surfaces (plans, ADRs, PDRs, rules). A direction here is
owner-stated intent that has not yet graduated into a binding form.
Each entry carries: the direction in the owner's words, its maturity,
its falsifier, the lanes it bears on today, its prior art, and its
promotion trigger — the named act that graduates it into an ADR, PDR,
rule, eval, or plan.

Two boundaries, both structural:

- **Nothing here binds.** `principles.md` admits no non-binding text
  (evidence conserved 2026-08-06 in the capability-floor shaping
  record's axis-2 addendum), so directions draft HERE and graduate
  THERE — or into ADRs/PDRs/rules — only via their promotion
  triggers. A seat citing this node cites intent, not obligation.
- **Nothing here duplicates a charter that exists.** Where a direction
  is already chartered (D1 below), this register points and scopes the
  residual instead of restating.

## The directions

### D1 — Everything is a graph

**Owner's words**: "everything is a graph" — expressing the whole repo
as a graph; the deployed system and its third-party connections
(Linear, GitHub, Sentry, PostHog, Vercel) as a graph; the public repo
and the private service as two distinguished conceptual spaces,
privacy preserved.

**Maturity**: substantially chartered. The repo-knowledge half is
ratified as
[planning-and-intent-estate](./planning-and-intent-estate.plan.md)
with its doctrine pair (PDR-134, ADR-221). **Residual direction**: the
deployed-SYSTEM graph — runtime surfaces and third-party joins — and
the structural distinction between the public-repo space and the
private-service space. Prior art beyond the charter: MCP-319 (graph
tools, live), MCP-14 (knowledge-graph spike preservation), MCP-46
(every live node names its observer), MCP-504 (two-zone correlation
contract — the privacy seam already sketched), and the conserved June
prior art
[deferred-work map](../../reports/agentic-engineering/agent-operability-deferred-work-map-conserved-2026-08-06.md).

**Falsifier**: a knowledge or system artifact class that resists
graph addressing at reasonable cost — found honestly, it bounds the
direction rather than breaking it.

**Promotion trigger**: the system-graph residual becomes a body in the
planning-and-intent execution (or a sibling delivery node) at owner
word; the privacy split lands as an ADR when the first system-graph
artifact is built.

### D2 — Anything that changes agent behaviour has an eval

**Owner's words**: "anything that changes agent behaviour has an
eval."

**Maturity**: nearest to binding — the estate converged on this from
three independent sides in one week: R8 live-fire acceptance
([agent-tools operational requirements](../../../docs/engineering/agent-tools-operational-requirements.md)),
the oracle-independence finding (the witness can certify its own
shared mistake — capability-floor debate, ratified), and the
orthogonal-coverage observation (three-plus disjoint defect sets from
distinct analytical registers; three dated data points held for the
deferred retrospective). MCP-386 (review gates fail closed) is the
same instinct in ticket form.

**Falsifier**: a behaviour-changing class where an eval is
demonstrably not worth its cost — must be named per class, never
assumed.

**Promotion trigger**: the `new-rule-vs-pdr-clause` decision, then the
binding form LANDS WITH ITS VALIDATOR in the same change (structure
over vigilance). This is the register's first candidate to graduate.

### D3 — A framework for authority and intent

**Owner's words**: "we need to establish a framework for authority and
intent."

**Maturity**: researched, undispositioned. The corpus exists and is
merged:
[authority-transition capability proposals](../../reports/agentic-engineering/authority-transition-capability-proposals-and-experimental-design-2026-08-02.md)
(explicitly non-doctrine; acceptance and rejection equally valid
outcomes). Adjacent live practice: PDR-117 (Director/Implementer),
PDR-133 (liveness classes), the owner-directs-through-director
routing, and today's counterpoint episode (designation external,
authority carried by the record, not the seat).

**Falsifier**: each proposal document carries its own assumption
falsifiers and kill conditions — the disposition pass exercises them.

**Promotion trigger**: the single-seat review-and-disposition pass
(shaped 2026-08-06 in the
[attention map](../../reports/agentic-engineering/estate-sources-attention-map-2026-08-06.md)):
one seat, the two practice-facing documents, a per-principle
accept/revise/reject record — accepted principles route to PDRs.

### D4 — The Practice can forget; learning runs at three speeds

**Owner's words**: "we need to enable the Practice to forget, and that
goes hand in hand with slow learning and fast learning and instant
learning."

**Maturity**: researched, undispositioned — and half-built without its
name. The corpus:
[governed forgetting and temporally governed authority](../../reports/agentic-engineering/governed-forgetting-and-temporally-governed-authority-2026-08-02.md)
("the past has standing, not sovereignty") with its
[foundational cross-disciplinary report](../../reports/cognitive-structure/governed-forgetting-research-foundational-research-report-and-programme.md).
The three speeds already exist as machinery: instant — napkin and
memory captured at occurrence; fast — consolidation and graduation
passes; slow — the PDR/rule corpus and the ratchet validators. The
missing arm is governed forgetting: today the estate only accretes
(125 open frictions, a continuity file at 4.5× its own fitness limit,
151 handoffs with no retention policy — all measured 2026-08-06).

**Falsifier**: a forgetting act that loses something the estate later
needed — which is why the corpus's standing-not-sovereignty contract
(demote authority, keep evidence) is the shape, never deletion-first.

**Promotion trigger**: the same disposition pass as D3 (one seat, one
sitting, both corpora); accepted principles route to a PDR naming the
three speeds and the forgetting contract, with the first forgetting
surfaces chosen from the measured accretion list above.

### D5 — Knowledge is discoverable by what it offers, not only by where it sits

**Owner's words**: the charter quote above — hubs, start with intended
impact and value, discover prior art.

**Maturity**: the problem is measured, the cure direction is named in
the graph charter. The measurement: answering "what do we have?"
(2026-08-06) took a seven-agent survey fleet plus a three-page ticket
census — a manual execution of exactly the projection this direction
wants standing. The charter's own words already promise it:
"projections answer the questions the estate's directory sprawl
cannot."

**Falsifier**: a capability/impact projection that is built and then
not used to find prior art at design time — usage, not existence, is
the success signal.

**Promotion trigger**: named as an early projection in the
planning-and-intent execution — plausibly the FIRST projection, since
it is the one the owner reached for and could not find. Design briefs
gain a prior-art-search first line (already in the doctrine queue
awaiting its `new-rule-vs-pdr-clause` decision) as the consuming
practice.

## Consumption

Seats read this register at planning time alongside the strategy
streams. When work touches a direction's area, the direction is cited
as intent and its promotion trigger is checked — if the work would
graduate the direction, the graduation is proposed in the same change,
never silently. The register is owner-edited at will; agents append
candidate directions only at owner word.

## Gate

Owner ratification of this register's shape and of each direction's
promotion trigger. Until ratified this node is a sketch that binds
nothing and blocks nothing.
