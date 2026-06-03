---
name: "Relative Link Integrity Live-Lanes Validator"
overview: "Add a warning-first validator for relative Markdown links in live `.agent` lanes so broken links cannot accumulate silently outside markdownlint and Prettier coverage."
status: future
type: agent-tooling
last_updated: 2026-06-03
isProject: false
---

# Relative Link Integrity Live-Lanes Validator

**Status**: FUTURE strategic brief. Not executable until promoted to `current/`.
**Source**: 2026-06-02 pending-graduation capture from the scoped t8
link-integrity sweep over the `.agent` estate.

## Problem And Intent

A scoped link-integrity sweep found 14 pre-existing broken relative Markdown
links in live `.agent` lanes. Existing format and lint gates did not catch the
breakage: markdownlint validates Markdown shape, Prettier formats prose, and the
current gate chain does not resolve repository-relative link targets across live
agent docs.

The intent is to add a repo validator that checks relative links in live lanes
before broken references become part of the substrate.

## End Goal

Agents and owners can rely on relative links in live `.agent` documentation,
plans, rules, and memory surfaces. Broken relative links are reported by a
dedicated validator, initially as warnings, then promoted only after the estate
is clean enough for failure enforcement.

## Mechanism

The validator walks live `.agent` Markdown surfaces, resolves relative links
against each source file, and reports targets that do not exist. It excludes
archive lanes and other generated or terminal-history surfaces where historical
broken links may be retained intentionally.

## Means

- Define the live-lane include and exclude set explicitly.
- Parse Markdown links with an existing parser rather than ad hoc regex where
  practical.
- Resolve relative file and anchor-free path targets from the source file's
  directory.
- Report warnings with source path, link text, raw target, and resolved path.
- Wire the command into the repo's validator/gate surface in warning mode first.
- Promote to fail mode only after a separate cleanup pass proves the remaining
  warning set is empty or intentionally exempt.

## Boundaries And Non-Goals

- This plan does not repair every broken link itself; it creates the structural
  detection lane.
- This plan does not validate external HTTP URLs.
- This plan does not rewrite archive history or terminal evidence logs.
- This plan does not broaden markdownlint's role; link resolution belongs in a
  dedicated validator.

## Dependencies

| Dependency | Classification | Why |
| --- | --- | --- |
| Current `.agent` live-lane topology | blocking | The validator must know which surfaces are live. |
| Existing gate and validator conventions | blocking | New validators land warning-first before failure enforcement. |
| Link cleanup evidence from the t8 sweep | beneficial | Supplies initial examples and expected report shape. |

## Strategic Acceptance Criteria

1. A validator command enumerates live `.agent` Markdown files and excludes
   archive or generated history lanes by explicit policy.
2. Relative links are parsed and resolved from each source file's directory.
3. Missing targets produce actionable warnings with source and target detail.
4. The validator is wired into the relevant repo check surface in warning mode.
5. Promotion to failure mode is gated on a clean or intentionally exempt warning
   set.
6. `pending-graduations.md` points here as the durable lane for the
   link-integrity capture.

## Risks And Unknowns

- Historical or intentionally stale references may appear in live files. Cure:
  classify the lane and link role explicitly rather than blanket-failing.
- Anchor validation can expand scope quickly. Cure: start with path existence;
  add anchor checks only after path validation is stable.
- Parser choice may not preserve every Markdown edge case. Cure: prefer an
  existing parser already used in repo tooling if available.

## Promotion Trigger

Promote on owner prioritisation, the next `.agent` link-integrity remediation
pass, or the next broken live-lane relative link that survives existing gates.

## Execution Note

Execution decisions are finalised only during promotion to `current` or
`active`. This future brief records the accepted structural lane for the
pending-graduation item without claiming the validator already exists.
