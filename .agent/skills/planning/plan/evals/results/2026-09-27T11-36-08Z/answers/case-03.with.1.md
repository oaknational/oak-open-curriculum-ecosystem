I didn't write a file. This repo is empty: there's no `.agent/plans/`, no plan-node schema, no templates and no impact-area registry, so a node written here would be neither valid nor where it belongs. The plan sketch is below. Point me at the repo that holds the plan estate and I'll write it there as a proper node.

## Recommendation: split the plan at the mapping

The subject mapping shouldn't be written into this plan as though it were settled. Who owns it is a question for our owner and the partner, not something an implementer can decide. So the plan separates:

- **Work the mapping doesn't affect.** This can start now.
- **Work that depends on the mapping.** This waits on an owner gate with a fixed expiry date. It doesn't guess an owner.
- **Writing down what the mapping must guarantee.** This can also start now. The ownership argument is hard to settle while nobody has written down what is being owned. Once the obligations are written, the argument becomes "who can meet these?", which is much easier to answer.

One option could make the dispute unnecessary. If the partner's tool shows **our** subject list, taken straight from our API, there's nothing to map. A mapping contract only exists if their tool keeps its own subject list. That trade-off (less work, but the partner gives up their own subject list) is the first thing to put to the owner.

---

## Sketch: delivery node, `status: sketch`

```yaml
---
type: delivery
status: sketch
serves: <strategic node for partner distribution — to confirm>
impact_areas: [<from registry — e.g. curriculum-api, partner-integrations>]
tickets: [<Linear pointer; partner identity, dates, contacts live there>]
depends_on:
  - node: <subject-mapping connection spec>
    kind: blocking        # blocks only the mapping-dependent slices below
owner_gates:
  - id: mapping-ownership
    awaiting: owner decision + partner agreement on (a) whether the partner adopts our subject list as-is, else (b) who maintains the mapping and meets its obligations
    clears_when: the decision is recorded (ADR or signed partner agreement) and cited by this node
    expires: 2026-10-25   # placeholder: set from the strategic node's gate_expiry_default
---
```

**Goal:** teachers using the partner's tool can find our lessons by subject, and every lesson they find really belongs to the subject they picked.

**Problem:**
- **Gap:** our lessons can't be found by subject inside the partner's tool.
- **Who it hurts:** teachers, who can't use our lessons there, and us, because our lessons don't reach them.
- **Constraints:**
  - the API contract is fixed, and this work doesn't change it
  - the partner is outside our control
  - nobody has agreed who owns the mapping

**How it works:** the partner's tool asks our API for lessons filtered by subject, using subject IDs from our API. This only works if the teacher's chosen subject keeps its meaning on the way into our API. Getting the ID format right doesn't guarantee that. For example, if their "Science" becomes one of our subject IDs, it may leave out lessons it should include, or include ones it shouldn't.

**Users and value:**
- **Teachers:** find relevant lessons by subject without leaving the tool they already use.
- **The partner:** gets our curriculum content without building their own copy.
- **Our operators:** see partner traffic against the existing API contract, with no special-case endpoints.

**Acceptance criteria (each with its proof):**
1. Every subject the partner's tool shows resolves to our subject IDs as defined in the recorded mapping decision (identity if they adopt our list). **Proof:** repo-safe, a contract test that runs each partner subject through the mapping into our API and checks the result.
2. No partner subject maps to a lesson set the specification forbids, and subjects with no mapping are handled the way the specification says, never by silently dropping or merging them. **Proof:** repo-safe, adverse-case tests taken from the connection spec.
3. In the partner's production tool, a teacher can pick a subject and get our lessons for it. **Proof:** owner-held. The partner's product owner or a seat named by our owner verifies it, and the dated observation goes on the ticket.
4. A subject added to or removed from either side is noticed and routed to whoever owns the mapping, rather than quietly breaking search. **Proof:** repo-safe if we own detection; owner-held if the partner does. Which one depends on the gate.

**Out of scope:**
- changing the curriculum API contract
- search features beyond filtering by subject
- defining the partner's subject list for them
- deciding the ownership question inside this plan

**Candidate slices (the implementer re-slices at pickup against the round budget):**
1. *Not blocked:* partner access to the existing API (credentials, rate limits, a sandbox), plus a smoke test proving the partner can get lessons by one of our subject IDs.
2. *Not blocked:* specify the mapping seam with `oak-specify-connection`. Cover:
   - what meaning must survive the mapping
   - many-to-one and one-to-many cases
   - unmapped subjects
   - what happens when either subject list changes
   - which obligations fall on each side

   This is the input the ownership decision needs.
3. *Blocked by the gate:* build or adopt the mapping and its contract tests (criteria 1 and 2).
4. *Blocked by the gate:* detect subject-list drift and route it to the owner (criterion 4).
5. *Blocked by the gate:* partner go-live check (criterion 3).

**What to do if the gate expires without a decision:** re-raise it with the owner. The plan doesn't choose an owner on its own, because a default that takes effect on silence would ship a decision nobody made.

## Review dispositions
_(empty ledger)_

---

**Needed from you before this can be ratified:**
1. Where the plan estate lives, and which strategic node this serves (that node sets the gate's expiry).
2. Whether our side is willing to propose "the partner adopts our subject list". That's the cheapest path, and I'd put it forward first.
3. Whether to start slice 2, the mapping specification, now. I'd recommend it: it's work only we can do, and the ownership decision needs it.
