# Three-Dimension Fitness Functions

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Status**: Proven innovation — adopted and validated in the trinity files

## The Problem

The original fitness function used a single dimension: line count
(`fitness_ceiling` in YAML frontmatter). This created a perverse
incentive: "tightening" a file to fit under its ceiling could mean
making lines longer — reducing the count while preserving or
increasing actual content volume. The constraint was gameable by
the very mechanism it was supposed to govern.

## The Solution

Three dimensions constrain each file. All three are soft ceilings —
exceeding any triggers tightening, not a hard block.

| Dimension | Frontmatter key | What it guards |
| --------- | --------------- | -------------- |
| Line count | `fitness_ceiling` | Structural sprawl — the intuitive "feel" check |
| Character count | `fitness_ceiling_chars` | Content volume — cannot be gamed by reflowing |
| Max prose line width | `fitness_max_prose_line` | Readability and diff quality |

**Why all three are needed:**

- **Line count** is the intuitive metric humans relate to — "is this
  still readable in one sitting?"
- **Character count** is the honest constraint — it measures actual
  content volume regardless of line breaks.
- **Prose line width** prevents the gaming mechanism — you cannot
  reduce line count by making lines longer without triggering the
  width ceiling.

## Adoption Steps

### 1. Add frontmatter to the trinity files

Each of the three Practice Core files should carry all three
ceilings. Example from `practice.md`:

```yaml
fitness_ceiling: 400
fitness_ceiling_chars: 25000
fitness_max_prose_line: 100
```

Set the ceilings to values appropriate for your repo. The line and
character ceilings should reflect "readable in one sitting" for
their respective roles. A prose line width of 100 is a good default
— it matches common readability guidelines and produces clean diffs.

### 2. Reflow prose to the width ceiling

Reflow all prose lines in the trinity files to the chosen width
(e.g. 100 characters). Excluded from the width check:

- YAML frontmatter
- Code blocks (fenced with ``` or ~~~)
- Table rows (lines starting with `|`)

### 3. Add the validation script

The companion file `validate-practice-fitness.ts` is a
self-contained TypeScript script. Install it as:

```bash
# Copy to your scripts directory
cp validate-practice-fitness.ts scripts/

# Add to package.json
# "practice:fitness": "tsx scripts/validate-practice-fitness.ts"
```

Run with `tsx` (no compilation step needed):

```bash
pnpm practice:fitness
```

The script reads the frontmatter from each trinity file and checks
all three dimensions, reporting a colour-coded pass/fail table.

### 4. Extend beyond the trinity

Any document in the knowledge flow cycle can carry these ceilings.
Agent-facing and contributor-facing documents benefit from the same
three-dimension constraint. Only shallow entry points (root README,
quickstart, VISION) are typically exempt.

### 5. Wire into consolidation

The `jc-consolidate-docs` command should check fitness as part of
its pass. This is a signal, not a gate — exceeding a ceiling
triggers tightening work, not a hard block.

## Design Decisions

- **Soft ceilings, not hard gates.** The fitness function is a
  governor, not a wall. Creative writing sometimes needs breathing
  room. The signal is "pay attention", not "stop".
- **Prose-only width check.** Code blocks, tables, and frontmatter
  are excluded because they have their own natural width constraints
  and reflowing them would damage readability.
- **Per-file, not aggregate.** Each file carries its own ceilings
  because different files have different roles and natural sizes.
