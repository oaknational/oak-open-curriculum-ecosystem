# Integration plan: curriculum API → partner teacher tool

## 1. Starting point

These are settled, and the plan builds on them without reopening them:

- **Value:** teachers need to find lessons by subject. Three observed sessions and the partner's request both record this.
- **API contract:** lessons are keyed by subject slug. The slugs are `biology`, `chemistry`, `physics` and `combined-science`. The schema is versioned, and a slug is never renamed within a major version.

One question is open: **who owns the mapping from API slugs to the tool's taxonomy.** The partner says our API should define it. Our team says the tool should. Nobody with authority over both sides has ruled. The tool's taxonomy has no combined-science subject, so this isn't abstract: it decides what teachers see for a whole slug.

This plan doesn't settle the ownership question. It sets up a ruling, keeps the work that doesn't depend on it moving, and keeps a de facto owner from appearing just because one side writes code first.

## 2. Get a ruling (critical path)

**2a. Name the decider.** Find the person or body with authority over both the API and the partner relationship, such as a partnership lead, a joint steering contact, or the executives who signed the agreement. If nobody like that exists, raise that first, because every future taxonomy dispute will hit the same wall.

**2b. Send a one-page decision brief** that sets out both positions neutrally. The ruling needs to cover two things.

**Question 1: who owns the mapping?**

| Option | What it means | Cost to us | Cost to partner |
|---|---|---|---|
| **A. The API owns it** | We publish a mapping to the tool's taxonomy, versioned with our schema | Our versioned contract becomes coupled to a taxonomy we don't control. Their taxonomy changes become our releases. | Low |
| **B. The tool owns it** | They consume slugs and map them internally | Low | They need to understand what our slugs mean, especially combined-science |
| **C. Split** | We own and document what each slug means (for example, what combined-science covers). The tool owns placing slugs in its taxonomy. | Documentation only | They do the mapping, with authoritative input from us |

**Question 2: where does combined-science go?** This has to be answered whoever owns the mapping. The options are:

- Show it under several tool subjects (biology, chemistry and physics).
- Add a subject to the tool's taxonomy.
- Map it to one nearest subject, which is lossy.
- Leave it out, so teachers can't find those lessons by subject. That undercuts the value the integration exists to deliver.

This is partly a teaching question, so the decider may want curriculum input.

**2c. My recommendation, as input to the decider and not a ruling:** option C. Our contract is deliberately independent of any one consumer's taxonomy, and option A would tie its versioning to the partner's release cycle. Option C also meets the partner's fair point that only we can say authoritatively what combined-science covers. For question 2, the sessions are about teachers finding lessons, so I'd favour showing combined-science under several subjects over leaving it out.

**2d. Record the ruling** next to the value and contract statements, in the same "settled and written down" form. Include who owns changes when either the taxonomy or the slug set changes.

## 3. Work that can start now

None of this depends on the ruling:

1. **Consume the API by slug.** Build the client, pin it to the current major version, and handle schema versions.
2. **Add contract tests** that check the four slugs exist and are stable within the major version. That turns the "never renamed" guarantee into a check that runs.
3. **Put the mapping behind a swappable layer.** Treat it as a plain slug → tool-subject table that is loaded rather than hard-coded, so it can live on whichever side the ruling picks with little rework.
4. **End-to-end path for the unambiguous slugs.** This assumes the tool has biology, chemistry and physics subjects. The statement only says it lacks combined-science, so confirm this with the partner.
5. **Write down what combined-science means:** which topics and lessons it contains and how they overlap the single sciences. This is needed under every option and is ours to write.
6. **Define acceptance:** a teacher can find the lessons for a given subject, checked against the scenarios from the three observed sessions.

## 4. Work blocked until the ruling

- How combined-science lessons appear in the tool.
- Where the mapping artifact lives, who versions it, and how changes are announced.
- The change process when the tool's taxonomy changes or we add a slug in a new major version.

## 5. Guardrail while it's open

Neither team should ship a mapping as the mapping. If a placeholder is needed to unblock testing, label it provisional in code and docs and keep it out of production. Otherwise whoever ships first wins the ownership argument by default.

## 6. Sequence

1. Name the decider and send the brief (days).
2. Run the work in section 3 in parallel.
3. Once the ruling is recorded, build the combined-science handling and change process on the owning side.
4. Validate against the observed-session scenarios.
5. Launch.

The ruling is the only item on the critical path that engineering can't speed up. Everything else can be ready and waiting for it.
