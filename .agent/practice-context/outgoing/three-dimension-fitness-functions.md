# Two-Threshold Fitness Functions

> **Origin**: oak-mcp-ecosystem, 2026-03-19 (three-dimension model),
> evolved 2026-04-01 (two-threshold model, ADR-144)
> **Status**: Proven innovation — adopted in the portable Core and
> the live repo-wide validator

## The Problem

A single `fitness_line_count` ceiling was gameable — reflowing prose
to fewer, wider lines reduced the count without reducing content
volume. Adding `fitness_char_count` and `fitness_line_length` closed
the gaming vector, but treating all ceilings as soft allowed gradual
inflation. Agents could raise limits without constraint.

## The Solution

Four frontmatter fields govern each tracked file. Line count uses
two thresholds (target and limit); character count and prose width
are hard limits only.

| Frontmatter key       | Threshold | What it guards                       |
| --------------------- | --------- | ------------------------------------ |
| `fitness_line_target` | Soft      | Content lines — signal to refine     |
| `fitness_line_limit`  | Hard      | Content lines — ceiling              |
| `fitness_char_limit`  | Hard      | Content characters — non-adjustable  |
| `fitness_line_length` | Hard      | Prose line width — always 100        |

**Target vs limit:** Exceeding `fitness_line_target` is a warning —
the file needs refinement but work is not blocked. Exceeding
`fitness_line_limit` is blocking — the file must be compressed or
split before merge. Only the user may raise hard limits. Agents may
extend `fitness_line_target` modestly with rationale.

**Why four fields:** The fields form a constraint triangle. Gaming
one dimension (fewer lines via reflowing) triggers another (character
or width limit). The target/limit split prevents runaway inflation.

All governed files carry all four fields. All measure content only
(frontmatter excluded). Width applies to prose only (code blocks,
tables, frontmatter excluded). Only shallow entry points (root
README, quickstart, VISION) are exempt.

## Adoption Steps

### 1. Add four fields to governed files

Example frontmatter:

```yaml
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 31500
fitness_line_length: 100
```

Set targets and limits appropriate for each file's role. A ratio of
~1.3x target-to-limit gives reasonable headroom. Character limits
should reflect realistic content density. A prose width of 100 is
the standard default.

### 2. Reflow prose to the width ceiling

Reflow all prose lines in governed files to 100 characters. Excluded
from the width check: YAML frontmatter, fenced code blocks, and
table rows (lines starting with `|`).

### 3. Add the validation script

The companion file `validate-practice-fitness.ts` mirrors the live
zero-dependency validator (`scripts/validate-practice-fitness.mjs`).
Install it as:

```bash
cp validate-practice-fitness.ts scripts/
```

The validator discovers every live markdown file that declares
`fitness_line_target` in frontmatter (excluding archives, backups,
and incoming practice boxes). It checks all four dimensions, reports
a colour-coded pass/warn/fail table, and exits non-zero only when
hard limits are exceeded.

### 4. Extend beyond the trinity

Any governed document can carry these fields. Agent-facing and
contributor-facing documents benefit from the same discipline.

### 5. Wire into consolidation

Run the validator during consolidation passes. Informational mode
surfaces drift early; strict mode gates merges. Target exceedance
triggers refinement work; limit exceedance blocks the merge.

## Design Decisions

- **Two thresholds, not one.** Separating "signal" (target) from
  "block" (limit) gives agents autonomy to manage content growth
  while preserving a hard stop that requires human approval.
- **Constants, not formulas.** Each file's thresholds are independent
  numbers. The initial calculation (1.3x, etc.) sets starting values;
  after that, values evolve independently.
- **Prose-only width check.** Code blocks, tables, and frontmatter
  are excluded — they have natural width constraints and reflowing
  them would damage readability.
- **Per-file, not aggregate.** Each file carries its own thresholds
  because different files have different roles and natural sizes.
