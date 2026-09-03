# Runbook-plan template

A repeatable operational procedure (a production promotion, a
migration, a recurring ceremony). Long-lived; procedure changes return
it to `sketch` for re-ratification. Copy, fill, delete the guidance.

```markdown
---
id: <kebab-slug, stable forever>
node_type: runbook
name: <Human name>
overview: <One line: what this procedure does and to what.>
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: <strategic node id — omit only for standing estate procedures>
impact_areas:
  - <area from impact-areas.md>
tickets: []
depends_on: []
owner_gates: []
last_updated: <YYYY-MM-DD>
---

# <Name>

## When to run

<The trigger or cadence.>

## User groups and value

<Who runs this and who benefits when it runs, in experience terms —
usually one or two lines for a runbook. Where the value routes
elsewhere (a system, a downstream consumer), name it.>

## Preconditions

<What must already be true before step 1 — each item checkable, with
the check named.>

## Steps

<Numbered. Each step names WHO executes it — `agent` or `owner-held`.
An owner-held step surfaces as a visible owner card at the moment it
becomes actionable, never an ambient queue item — and names the
verification that proves it happened.>

## Verification

<How the end state is confirmed, with the instrument named.>

## Rollback

<The path back from every step that changes shared state. A step with
no rollback is named as such, with the owner's explicit acceptance
dated.>
```
