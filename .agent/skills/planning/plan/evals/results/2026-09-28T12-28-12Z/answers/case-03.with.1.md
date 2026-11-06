# Plan: curriculum API ↔ partner teacher tool integration

**Status: sketch.** This plan doesn't govern any work until the owner ratifies it. There's no repository, so it's written from your statement alone.

## Frame

- **Gap:** Teachers using the partner's tool can't find our lessons by subject.
- **Who it harms:** Those teachers. Three observed sessions and the partner's request record the need, so it's settled and not reopened here.
- **Mechanism:** The tool looks up lessons through our API by subject slug. It can only do that if each tool subject resolves to known slugs and each slug resolves to something the tool can show.
- **Constraint:** The API contract is settled. Lessons are keyed by slug (`biology`, `chemistry`, `physics`, `combined-science`), the schema is versioned, and slugs are never renamed within a major version.
- **Success:** A teacher picks a subject in the tool and gets the right lessons, and every API slug has a defined outcome in the tool. That includes `combined-science`, which has no subject in the tool's taxonomy.

## The unresolved item, and how the plan handles it

The subject-mapping contract is a question about the connection between the two systems, so it belongs to a `specify-connection` pass. It has two parts:

1. **What the mapping must guarantee.** This can be analysed now, without deciding who owns it. Every slug needs a defined outcome in the tool. No lesson can disappear silently. The mapping has to be pinned to the API's major version, because a new major version may rename slugs. `combined-science` is the counterexample at the seam: the API's guarantees don't cover anything the tool's taxonomy expects there.
2. **Who authors and maintains the mapping.** Nobody has ruled on this. The partner says it's the API's job and our team says it's the tool's. **This plan does not decide it**, and it doesn't pick a side by building one party's mapping first. The question goes to someone with authority over both parties as an owner gate.

The ownership dispute covers the whole mapping, including `biology`, `chemistry` and `physics`, which look like they map one-to-one. Nothing built before the ruling commits any mapping as shipped behaviour.

**Choices for the person who rules, not decided here:**
- Who owns the mapping: our API, the tool, or a shared artefact both sides sign off.
- What happens to `combined-science`: split it across the three sciences, map it to a parent "Science" subject, add a subject to the tool's taxonomy, or exclude it explicitly and visibly.

## Owner gate

| Field | Value |
|---|---|
| `awaiting` | A ruling on who owns the subject-mapping contract, from someone with authority over both our team and the partner. That person is not yet identified, and identifying them is the first action. |
| `clears_when` | A recorded ruling names the owning party, and that party decides the `combined-science` outcome. |
| `expires` | 2026-10-12. This is a proposed placeholder; the governing strategic node's `gate_expiry_default` should set it. |
| On expiry | The gate is escalated and presented again. Nothing ships by default, because letting silence count as a decision would effectively rule on the dispute. |

## Delivery nodes (one bounded step each)

**D1. Consumer onboarding and contract conformance.** No blockers; starts now.
- Our work: give the partner access and documentation for the API, and add contract tests that prove the settled guarantees: slugs are keyed as stated, the schema is versioned, and no slug is renamed within a major version.
- The partner's integration pins a major version.
- Acceptance: the contract tests pass in CI (`repo-safe`). The partner confirms they fetched lessons for every slug against the pinned version, and we record the dated observation (`owner-held`).

**D2. Connection specification for the mapping.** Split by dependency.
- Starts now: write down the obligations from part 1 above, including the counterexample and the rule for major-version changes.
- Blocked (`blocking`) on the owner gate: the obligations assigned to the owning party and the `combined-science` rule.
- Acceptance: the obligations are recorded, and every slug has a defined outcome (`repo-safe`, checked against the list of four slugs). The owning party accepts the spec (`owner-held`).

**D3. Implement the mapping.** `depends_on`: D2 (`blocking`).
- The owning party builds the mapping. Which team does this isn't known until the gate clears.
- We add a check that fails when the API has a slug the mapping doesn't cover. This catches the next `combined-science`-style gap before release.
- Acceptance: the mapping-coverage test passes for all four slugs (`repo-safe`).

**D4. End-to-end acceptance with teachers.** `depends_on`: D1 (`blocking`), D3 (`blocking`).
- Acceptance: in an observed session, a teacher finds lessons for each subject in the tool, including wherever `combined-science` content ends up under the ruling. Whoever runs the session records the dated observation (`owner-held`).

**Order:** D1 and the first half of D2 run in parallel now. The gate must clear before the rest of D2, then D3, then D4.

## Out of scope

- Reopening the value case or the API contract.
- Deciding who owns the mapping.
- Any shipped behaviour for `combined-science` before the ruling.
- Changing the API contract, including adding or renaming slugs.

## Next action

Name the person who has authority over both parties and put the ownership question to them. It's the one blocker on the critical path.
