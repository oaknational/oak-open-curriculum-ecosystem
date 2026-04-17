---
fitness_line_target: 160
fitness_line_limit: 220
fitness_char_limit: 10000
fitness_line_length: 100
split_strategy: "Keep concise — this is Practice broadcast material. Extract historical evolution notes if it grows."
---

# Three-Zone Fitness Functions

> **Origin**: oak-mcp-ecosystem, 2026-03-19 (three-dimension model),
> evolved 2026-04-01 (two-threshold model),
> evolved 2026-04-17 (three-zone scale)
> **Status**: Proven innovation — adopted in the portable Core and
> the live repo-wide validator. See ADR-144 for the current model.

## The Problem

A single `fitness_line_count` ceiling was gameable — reflowing prose
to fewer, wider lines reduced the count without reducing content
volume. Adding `fitness_char_count` and `fitness_line_length` closed
the gaming vector. Splitting line count into target/limit pairs
prevented runaway inflation. But the binary "warning / blocking
violation" model that came with the two-threshold split introduced a
semantic cliff: a one-line overage above the hard limit triggered the
same response as a fifty-line overage. Agents could not distinguish
"address at the next refinement" from "emergency". In practice, live
surfaces drifted into teaching that fitness is "advisory, not a
blocking gate" while the ADR still said "blocking". Three
incompatible teachings lived in the same repo.

## The Solution

Keep the four frontmatter fields. Replace the binary with a four-zone
scale derived from the declared thresholds and a single global ratio,
`CRITICAL_RATIO = 1.5`.

| Zone       | Condition                                                    | Meaning                                       | Required response                                                                                                        |
| ---------- | ------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `healthy`  | count ≤ target (or ≤ hard limit where no target is declared) | Within design envelope                        | None                                                                                                                     |
| `soft`     | target < count ≤ hard limit                                  | Drifting; refinement opportunity              | Consider at the next natural boundary. **Never blocks.**                                                                 |
| `hard`     | hard limit < count ≤ hard limit × `CRITICAL_RATIO`           | Overweight; remediate before the next closure | Remediate before closing the current consolidation cycle. Advisory at routine commit; blocking at consolidation closure. |
| `critical` | count > hard limit × `CRITICAL_RATIO`                        | Loop failure signal                           | Stop routine work. Open a remediation lane. Run the three-question loop-health post-mortem. **Blocking always.**         |

| Frontmatter key       | Threshold | What it guards                                |
| --------------------- | --------- | --------------------------------------------- |
| `fitness_line_target` | Soft      | Content lines — signal to refine              |
| `fitness_line_limit`  | Hard      | Content lines — ceiling (critical at × 1.5)   |
| `fitness_char_limit`  | Hard      | Content characters (critical at × 1.5)        |
| `fitness_line_length` | Hard      | Prose line width, always 100 (critical at 150)|

`soft` zone exists only for line count; char and prose-width metrics
have no target, so they are `healthy`, `hard`, or `critical`. The
overall zone for a file is the worst zone across its declared metrics.

### Exit code semantics

- `--informational` (e.g. `pnpm practice:fitness:informational`,
  `pnpm check`) — always exits 0. Used during routine work so that a
  drifting doc does not halt code changes.
- strict (default, `pnpm practice:fitness`) — exits 1 only on
  `critical`. Used in broad gate sweeps.
- strict + `--strict-hard` — exits 1 on `hard` or `critical`. Used at
  consolidation closure so that `hard`-zone files cannot slip past.

## Why a scale, not a gate

The scale encodes graduated response. The binary model forced the
Practice to either over-escalate (treat a 1-line overage as
emergency) or under-escalate (teach that fitness is advisory). The
scale teaches the expected action per zone, and names `critical` as
the loop-failure diagnostic so the Practice's self-referential
governance has somewhere concrete to fire.

## Adoption Steps

### 1. Add the four frontmatter fields to governed files

Example:

```yaml
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 31500
fitness_line_length: 100
```

Set targets and limits appropriate for each file's role. A ratio of
~1.3× target-to-limit gives reasonable headroom. The `critical`
threshold is derived automatically at `hard limit × 1.5`.

### 2. Reflow prose to the width ceiling

Reflow all prose lines to 100 characters. Excluded from the width
check: YAML frontmatter, fenced code blocks, and table rows (lines
starting with `|`).

### 3. Add the validation script

The companion file `validate-practice-fitness.ts` mirrors the live
zero-dependency validator (`scripts/validate-practice-fitness.mjs`).
Install it as:

```bash
cp validate-practice-fitness.ts scripts/
```

The validator discovers every live markdown file that declares
`fitness_line_target` in frontmatter (excluding archives, backups,
and incoming practice boxes). It classifies each declared metric
into one of four zones and reports the overall zone per file.

### 4. Extend beyond the trinity

Any governed document can carry these fields. Agent-facing and
contributor-facing documents benefit from the same discipline.

### 5. Wire into consolidation

Run the validator during consolidation. Informational mode surfaces
drift early; `--strict-hard` gates merges at closure; the `critical`
zone triggers the loop-health post-mortem (see ADR-144 §Loop
Health) rather than a purely local edit.

## Design Decisions

- **A scale, not two thresholds.** Graduated severity needs graduated
  response. `healthy` / `soft` / `hard` / `critical` teach the
  expected action in each band.
- **One global critical ratio.** Per-file critical overrides invent
  optionality without evidence. When a file's legitimate role
  outgrows its hard limit, raise the hard limit — don't tune the
  ratio.
- **Constants, not formulas.** Target and hard limits are
  independent per-file numbers. The critical ratio is a single
  global constant.
- **Prose-only width check.** Code blocks, tables, and frontmatter
  are excluded — they have natural width constraints and reflowing
  them would damage readability.
- **`critical` is a loop-failure signal, not a routine state.**
  Reaching `critical` means the earlier zones did not fire — a
  post-mortem is required in addition to local remediation. See
  ADR-144 §Loop Health.
