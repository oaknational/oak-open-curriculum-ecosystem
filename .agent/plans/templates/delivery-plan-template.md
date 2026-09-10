# Delivery-plan template

One step of a lane, authored by its implementer at pickup. One page.
Copy, fill, delete the guidance. Born `sketch`; the plan governs no
work until its ratification stamp is complete. The frontmatter is
metadata; the narrative (goal, mechanism, acceptance) lives in the body
(PDR-018).

```markdown
---
id: <kebab-slug, stable forever>
node_type: delivery
name: <Human name>
overview: <One line: what this step delivers.>
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: <strategic node id>
impact_areas:
  - <area from impact-areas.md>
tickets:
  - <Linear issue ID, e.g. MCP-000 — optional, always (2026-08-07
    amendment); a thin visibility pointer when the operator's tracker
    holds the work — execution state lives there, never here>
depends_on: []
# depends_on:
#   - plan: <plan-id>
#     kind: blocking | beneficial
owner_gates: []
# owner_gates:
#   - awaiting: owner-decision | external-input
#     clears_when: <the named condition or person that resolves it>
#     expires: <YYYY-MM-DD — absolute, mandatory; horizon inherits from
#       the governing strategic node's gate_expiry_default>
last_updated: <YYYY-MM-DD>
---

# <Name>

## Goal

<What is true when this lands that is not true now — one short
paragraph.>

## User groups and value

<Who experiences or consumes this outcome, and what each group gets, in
experience terms. Innovation work may declare offered or hypothesised
value with an honest claim boundary — proving a pre-existing need is not
required. Where genuinely nobody experiences the outcome directly, say
so in one line and name where the value routes.>

## Mechanism

<How, briefly. Mechanism only: anything internal rides the linked
ticket.>

## Acceptance criteria (each with a proof — required)

Each criterion names its proof and the proof's evidence class:

- `repo-safe` — provable inside the repository (a test, a validator, a
  CI check); cite the instrument.
- `owner-held` — provable only with owner-held access (a production
  console, an external dashboard); name who verifies and where the
  verification is recorded.

## Todos (optional; proofs on todos optional)

<Slices, each a single-story PR carrying its round-budget class
(PDR-132: default ≤2 review rounds; name the budget if it differs and
why).>

## Out of scope

<Explicit. What a reasonable reader might assume is included but is
not, each with one clause of why.>
```

At completion — acceptance criteria proven — the plan moves to
`archive/` with `status: archived`.
