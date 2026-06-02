---
name: "Rules Cross-Platform Generator"
overview: "Generate `.claude`, `.cursor`, `.agents`, and `RULES_INDEX.md` entries from canonical `.agent/rules/*` files so rule forms cannot drift after manual mirroring."
status: future
type: agent-tooling
last_updated: 2026-06-02
isProject: false
---

# Rules Cross-Platform Generator

**Status**: FUTURE strategic brief. Not executable until promoted to `current/`.
**Source**: triggered pending-graduation capture from the 2026-06-01
`rules-have-no-exceptions` and `eef-corpus-grounding` rule-authoring sessions.

## Problem And Intent

Canonical rules live in `.agent/rules/`, but today each rule is manually mirrored
into `.claude/rules/`, `.cursor/rules/*.mdc`, `.agents/rules/`, and
`RULES_INDEX.md`. That manual process already exposed drift: the index text said
"three on-disk forms" while listing four, and the 2026-06-01 rule authoring
session had to hand-update every surface.

The intent is to make the canonical `.agent/rules/*` file the single authored
source and generate all platform forms plus the index row from it.

## End Goal

Adding or changing a rule requires editing one canonical rule file and running a
generator/check pair. The generated forms and `RULES_INDEX.md` cannot silently
drift from the canonical source.

## Mechanism

The generator reads canonical rule frontmatter and body, emits platform-specific
adapter files, and updates the index from the same parsed representation. A
companion check verifies that committed adapter files and index rows match the
generated output.

## Means

- Define the canonical rule metadata contract needed by every generated form.
- Implement a generator in `agent-tools` that writes `.claude`, `.cursor`,
  `.agents`, and `RULES_INDEX.md` surfaces from `.agent/rules/*`.
- Add a check mode for CI/pre-commit that fails on drift without rewriting.
- Backfill existing rules incrementally or in one focused migration slice.
- Update rule-authoring documentation to use the generator instead of hand
  mirroring.

## Boundaries And Non-Goals

- This plan does not change rule substance or decide which rules should exist.
- This plan does not replace platform-specific loader mechanics; it generates
  the files those loaders already read.
- This plan does not broaden always-loaded rule scope. Context-budget decisions
  remain owned by the rules-impact / context-budget work.

## Dependencies

| Dependency | Classification | Why |
| --- | --- | --- |
| Existing canonical `.agent/rules/*` files | blocking | They are the source of truth. |
| Current platform adapter locations | blocking | The generator must preserve current loader targets. |
| `portability:check` / repo validators | beneficial | Useful integration point for drift checking. |

## Strategic Acceptance Criteria

1. A generator command can emit every platform rule form and the index row from
   canonical `.agent/rules/*` input.
2. A check command detects drift without mutating files.
3. Existing platform rule files and `RULES_INDEX.md` are generated or verified
   from the canonical source.
4. Rule-authoring docs no longer instruct agents to hand-mirror the same rule
   across four surfaces.
5. `pending-graduations.md` points here as the durable implementation lane for
   the triggered generator item.

## Risks And Unknowns

- Some platform forms may need metadata that current canonical rules do not
  carry. Cure: add explicit canonical metadata rather than platform-local
  exceptions.
- Generated output could obscure review diffs. Cure: keep generator output
  deterministic and preserve concise file formats.
- Whole-estate backfill could be too large for one slice. Cure: promote with a
  first check-only tranche if needed.

## Promotion Trigger

Promote on owner prioritisation, the next new rule-authoring session, or the
next drift found between a canonical rule and its platform/index forms.

## Execution Note

Execution decisions are finalised only during promotion to `current` or
`active`. This future brief records the durable lane for the already-fired
pending-graduation trigger.
