# Ephemeral-to-Permanent Homing

**Shared workflow partial.** Not a slash command. Referenced by
[`session-handoff`](session-handoff.md) (session-scoped sweep, especially
platform-specific entry points) and [`consolidate-docs`](consolidate-docs.md)
(thread-scoped deep sweep across napkin, distilled.md, plans, platform
memory).

This file is the canonical methodology for moving content out of ephemeral
surfaces and into permanent homes. Both the lightweight session closeout
flow and the deep convergence flow defer to this document so the homing
discipline stays single-sourced.

## Cardinal Rule: Plans, Memory, and Entry Points Are Not Documentation

Three classes of surface accumulate content that does not belong there:

1. **Plans** — execution instructions. A completed plan MUST be safe to
   delete at any point. If documentation exists ONLY in a plan, it is at
   risk. Extract before marking complete.
2. **Memory surfaces** (`napkin.md`, `distilled.md`, platform-specific
   memory) — staging surfaces for capture and refinement. Settled content
   belongs in permanent docs (ADRs, governance, READMEs, TSDoc) or in
   `.agent/practice-core/` if it is portable Practice substance.
3. **Platform-specific entry points** (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`,
   plus any analogous `.codex/AGENTS.md`, `.cursor/`-rooted entry, or
   future-platform equivalent) — these MUST contain ONLY a pointer to the
   canonical agent directive at `.agent/directives/AGENT.md` (or the host's
   canonical equivalent). Any additional content is **drift**: instructions,
   facts, or preferences that an agent or user added directly to the entry
   point instead of routing them through the canonical surfaces. Drift in
   entry points is particularly insidious because every platform reads its
   own entry point first; a fact that lives only in `AGENTS.md` is invisible
   to Claude, and vice versa. The rule: **entry points point; they do not
   carry**.

## Destinations table

Match the substance shape to the home. Most session-captured drift fits one
of these:

| Substance shape                                                | Destination                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Host-repo architectural decisions                              | ADRs in `docs/architecture/architectural-decisions/`                            |
| Practice-governance decisions (review/planning/etc.)           | PDRs in `.agent/practice-core/decision-records/` (portable; travels with Core)  |
| General abstract engineering patterns (ecosystem-agnostic)     | PDR with `pdr_kind: pattern` in `.agent/practice-core/decision-records/` (per PDR-007 amendment 2026-04-29; Core `patterns/` directory retired) |
| Specific engineering pattern instances (ecosystem-grounded)    | `.agent/memory/active/patterns/` (repo-local; primary pattern home)             |
| System behaviour documentation                                 | READMEs in the relevant workspace                                               |
| Technical reference (data shapes, APIs, edge cases)            | TSDoc in source files or workspace READMEs                                      |
| Operator runbooks, deployment context, on-call material        | `docs/operations/*.md` (host-local operations docs)                             |
| Cross-session refined rules not yet at permanent stature       | `.agent/memory/active/distilled.md` (staging only; graduates further later)     |
| Repo-wide canonical rules / principles                         | `.agent/directives/principles.md` or rule files at `.agent/rules/`              |
| Always-applied agent operational rules                         | `.agent/rules/*.md` with platform adapters at `.cursor/rules/`, `.claude/rules/` |
| Subjective experience (texture, what work was like)            | `.agent/experience/<date>-<slug>.md`                                            |
| Patterns/gotchas not yet stable enough to graduate             | `.agent/memory/active/distilled.md` (short-term staging only)                   |
| Inbound Practice exchange (incoming sender→this-repo)          | `.agent/practice-core/incoming/` (transient; integrate per PDR-007 / PDR-024 then clear) |
| Outbound Practice exchange substance (durable, by shape)       | Routes to PDRs / `.agent/reference/` / `.agent/research/` per PDR-024 amendment 2026-04-29 (Practice Context outbound surface retired) |

If a piece of drift content does not match any of these shapes, the
question to ask is not "where do I force it?" but **"is this useful
enough to keep?"** Per the user's standing direction: *all content must
be moved to permanent homes or, if not useful, removed*. Removal is a
valid outcome.

## Methodology

For each piece of drift content identified by the calling workflow:

1. **Classify** the substance shape (what is it — an architectural
   decision? a workspace fact? an operator note? a stable preference? a
   one-off observation?).
2. **Match** to a destination using the table above. If two destinations
   apply, prefer the more permanent one (ADR over distilled, README over
   napkin).
3. **Verify the destination is real**. Open the candidate destination
   file. Confirm the section exists and that the content is not already
   covered there (avoid duplication; a duplicate disposition is a strip,
   not a move).
4. **Surface to the owner** if the move is non-trivial (creates a new
   ADR, restructures an existing doc, renames a rule, touches the
   trinity, etc.). Owner approval is the default; silent moves are
   reserved for pure duplicate-strip dispositions.
5. **Move** — copy the content into the destination, sharpening for the
   destination's voice and scope. Then **strip** from the source surface
   so no two homes carry the same substance.
6. **Cross-link** if the destination benefits from a back-pointer (e.g. a
   workspace README pointing into the canonical observability doc).

## Special category: platform-specific entry points

When sweeping `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, or any analogous
platform entry point:

- **Expected shape**: heading + one line referencing
  `.agent/directives/AGENT.md`. Nothing else.
- **Any other content is drift**. Apply the methodology above.
- **Do NOT delete drift content without homing it first** unless it is a
  pure duplicate of canonical content already present in `AGENT.md` or
  another permanent home. The user's standing direction is *find proper
  homes first*.
- **After homing**, reduce the entry point to its canonical pointer
  shape. The reduction is the visible signal that the sweep happened.

## Deferral-honesty discipline

Homing routinely surfaces dispositions that the owner defers (a candidate
that is not promoted now, a destination that needs to be created later, a
content piece left in distilled.md pending stability). Every deferral
recorded by this methodology MUST satisfy
[PDR-026 §Deferral-honesty discipline](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline):
a named constraint (clock, cost, dependency, owner veto) or a named
priority trade-off, plus evidence, plus falsifiability. Convenience
phrasings — *"budget consumed"*, *"out of scope"*, *"for later"*,
*"next session"*, *"ran out of time"* — are not acceptable.

## Related

- [`session-handoff`](session-handoff.md) — session-scoped caller; sweeps
  the session's drift surfaces (especially platform entry points).
- [`consolidate-docs`](consolidate-docs.md) — thread-scoped caller; sweeps
  the cross-session drift surfaces (napkin, distilled.md, completed
  plans, platform memory) at deep convergence time.
- [PDR-011 Continuity Surfaces and the Surprise Pipeline](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
  — the `capture → distil → graduate → enforce` pipeline this homing
  methodology operationalises at the graduate edge.
- [PDR-014 Consolidation and Knowledge Flow Discipline](../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
  — the discipline this methodology serves.
- [`.agent/rules/documentation-hygiene.md`](../rules/documentation-hygiene.md)
  — the always-applied rule tier counterpart (TSDoc presence, attribution
  on adoption, misleading-docs detection).
