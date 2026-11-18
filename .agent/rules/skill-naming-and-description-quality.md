---
classification: situational
description: Every skill needs a semantically useful name and a description optimised for discovery, applicability determination (use-when and do-not-use-when), and best/bad-practice examples — apply when creating, renaming, or editing any skill or its description.
trigger: ceremony:skill-authoring — Creating/renaming/editing any skill or its description; vendoring gate
---

# Skill Naming and Description Quality

Every skill carries a semantically useful name and a high-quality
description optimised for three things: discovery, determining
applicability, and best-practice/bad-practice examples. Owner rule,
verbatim substance, 2026-08-02.

The description is not documentation garnish — it is the routing
surface. At summon time the harness shows the model nothing but names
and descriptions, so the description alone decides whether the right
skill fires and the wrong one stays quiet. A weak description is a
routing defect with the same standing as a broken link.

## Trigger

Fires whenever a skill is created, renamed, or its description edited
or reviewed — repo-authored canonicals first, and at the vendoring gate
for external skills (a vendored skill with an unusable description is
a routing defect to record, not silently accept).

## The bar

- **Name**: semantically useful — it says what the skill does or
  governs, not how it is implemented; lowercase-hyphen; matches its
  directory (the open Agent Skills convention the adapter tier
  emits to).
- **Description, three optimisation targets**:
  1. **Discovery** — the phrases a session would actually think when
     the skill applies (task words, trigger conditions, named
     surfaces), so the skill is findable at the moment of need.
  2. **Determining applicability** — explicit use-when AND
     do-not-use-when clauses, so near-miss situations route away
     instead of misfiring (the corpus's strongest examples already do
     this; it becomes the floor, not the ceiling).
  3. **Best-practice/bad-practice examples** — the description names
     or points at concrete worked examples of doing it right and the
     named failure shapes of doing it wrong, so a reader can
     calibrate before loading the body.
- The body carries the full examples; the description carries enough
  of them to route and calibrate. Length obeys the open-spec bound
  (≤1024 characters) and earns its tokens — the description corpus is
  a priced, always-loaded context surface.

## Scope: all three lever corpora (owner rulings, 2026-08-02)

The contract binds SKILLS, RULES, and SUBAGENTS alike — "they are all
aspects of an underlying descriptive framework" (owner verbatim).
Every agentic lever exposes a name and a description to the one
constant consumer, the what-applies-now routing decision: a rule's
declared description and trigger (rendered into RULES_INDEX and its
platform adapters), and
a subagent's description (the high-stakes case — proactive
auto-dispatch clauses fire from it), are routing surfaces exactly as
a skill description is. All carry the same three optimisation
targets. The corpus-wide rule-description backfill sequences AFTER
the owner ratifies the core/situational reclassification sweep, so
descriptions are written once against final classes; description
collision measurement runs as a UNION across all three corpora (one
router reads them all), in the commissioned evals pilot's scope.

## Application

- New skills and renames meet the bar at landing (the landing
  decision procedure checks it).
- The existing corpus converges by deliberate backfill, worst-first
  by routing traffic — not by drive-by edits: description changes are
  routing changes and get reviewed as such.
- Measurement: trigger-evaluation suites (the commissioned evals
  pilot) are how description quality is scored against reality;
  until they exist, review is the check.
