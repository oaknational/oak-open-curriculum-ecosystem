I followed the `oak-plan` skill. There's no repository, so nothing was written to disk and nothing checked it. Below is the plan as a sketch delivery node, and I've kept it short. It governs no work until an owner ratifies it.

---

## Plan (sketch): Curriculum API → partner teacher tool, lessons by subject

```yaml
type: delivery
status: sketch            # governs no work until ratified
serves: <strategic node for partner integrations — owner to name>
impact_areas: [<from registry — owner to name>]
depends_on:
  - node: subject-mapping connection spec
    kind: blocking        # blocks mapping steps only (see Todos)
owner_gates:
  - id: mapping-ownership
    awaiting: ruling from an authority over both the API and the partner tool
    clears_when: that authority records who owns and defines the slug→taxonomy mapping
    expires: <absolute date — set from the strategic node's gate_expiry_default>
```

### Goal
Teachers using the partner's tool can find our lessons by subject.

### User groups and value
- **Teachers** find lessons under the subject they already think in. This comes from the three observed sessions and the partner's request, so it's settled.
- **The partner's developers** get a stable integration: slugs don't get renamed within a major version.
- **Our API team** has no new obligation beyond the published contract until the mapping is ruled on.

### Mechanism
The API keys lessons by a stable, versioned subject slug. The tool shows lessons under its own subjects. Search by subject works only if each slug resolves to a tool subject, or is deliberately excluded. That resolution is the mapping, and it's the only part of the chain that isn't defined.

### The unresolved seam
**Where it stands.** The partner says the API should define the mapping. Our team says the tool should. Nobody with authority over both has ruled. **This plan doesn't pick a side, and none of its steps quietly decides the question.** That includes:
- where the mapping code lives
- which party publishes the mapping table
- any default treatment of `combined-science`

**What must happen first:**
1. **Check for an existing ruling.** Before the gate counts as an open owner decision, look for something that already settles it: the partnership agreement, the API terms, any integration or data-ownership decision. If one exists, this plan enforces it and the gate goes away.
2. **Get the ruling.** Otherwise the gate goes to whoever holds authority over both sides. If it isn't clear who that is, that's the first thing to escalate.
3. **Specify the connection after the ruling** (`specify-connection`). The owning party defines the mapping, and the spec has to cover at least these cases:
   - **`combined-science` has no matching tool subject.** Options include leaving it out, showing it under several subjects, adding a subject to the tool, or labelling it by the physics/chemistry/biology parts of each lesson. Whichever is chosen decides what teachers see, so it's the ruled party's choice to make.
   - **Leaving it out hides lessons silently.** A teacher searching "Biology" wouldn't see combined-science biology content. The spec must say whether that's acceptable.
   - **The published contract only covers renames.** It says slugs aren't renamed within a major version, but not whether new slugs can appear in a minor version. The mapping needs a defined behaviour for a slug it doesn't recognise.
   - **A major version bump may change slugs.** The spec must say who updates the mapping when that happens, and how.
   - **Even the obvious matches are unsettled.** Mapping `biology` to the tool's Biology looks trivial, but it's still part of the disputed contract until someone rules.

### Acceptance criteria
| # | Criterion | Proof |
|---|---|---|
| 1 | The client consumes the API against a pinned major schema version and rejects responses that don't match the schema | repo-safe: contract tests against the versioned schema |
| 2 | Lessons are fetched by slug for all four published slugs | repo-safe: integration tests using the four slugs |
| 3 | A slug the mapping doesn't recognise produces the behaviour the connection spec defines, never a silent drop | repo-safe: test with a synthetic new slug (only after step 3) |
| 4 | Every published slug either resolves to a tool subject or is excluded by explicit rule, including `combined-science` | repo-safe: exhaustive mapping test over the slug list (only after step 3) |
| 5 | A teacher can find lessons by subject in the tool | owner-held: the partner's product owner verifies in the live tool and records a dated observation where the owner names |
| 6 | The ownership ruling is recorded in a permanent decision record, not only in this plan | owner-held: the ruling authority, recorded where they designate |

### Todos (sliced when someone picks this up)
**Can start now (they depend only on the settled API contract):**
- A. A schema-validating API client pinned to the current major version (AC 1).
- B. Retrieval of lessons by slug, plus the four-slug tests (AC 2).
- C. Take the ownership question to the authority (the gate), starting with the check for an existing ruling.

**Blocked on the ruling, then on the connection spec:**
- D. Write the mapping connection spec, owned by whichever party is ruled to own it.
- E. Implement the mapping on the owning side, with tests for AC 3 and AC 4.
- F. Partner verification in the live tool (AC 5).

### Out of scope
- Deciding who owns the mapping.
- Changing the API's slugs or taxonomy.
- Adding a subject to the tool's taxonomy, unless the spec calls for it and the partner accepts.
- Search features beyond "by subject".

---

**Decisions only an owner can make:**
1. Who has authority over both sides, so they can rule on mapping ownership.
2. The gate's expiry date and the node this plan `serves`.
3. Ratifying this sketch.

If the ruling puts the mapping with the API, D and E come to our team. If it puts it with the tool, we still need to publish the slug list and our versioning behaviour. We don't need to publish anything else for the partner to build D and E.
