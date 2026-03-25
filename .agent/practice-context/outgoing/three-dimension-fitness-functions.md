# Three-Dimension Fitness Functions

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Status**: Proven innovation — adopted in the portable Core and the live repo-wide validator

## The Problem

The original fitness function used a single dimension: line count
(`fitness_line_count` in YAML frontmatter). This created a perverse
incentive: "tightening" a file to fit under its ceiling could mean
making lines longer — reducing the count while preserving or
increasing actual content volume. The constraint was gameable by
the very mechanism it was supposed to govern.

## The Solution

Three dimensions constrain each file. All three are soft ceilings —
exceeding any triggers tightening, not a hard block.

| Dimension | Frontmatter key | What it guards |
| --------- | --------------- | -------------- |
| Line count | `fitness_line_count` | Structural sprawl — the intuitive "feel" check |
| Character count | `fitness_char_count` | Content volume — cannot be gamed by reflowing |
| Max prose line width | `fitness_line_length` | Readability and diff quality |

**Why all three are needed:**

- **Line count** is the intuitive metric humans relate to — "is this
  still readable in one sitting?"
- **Character count** is the honest constraint — it measures actual
  content volume regardless of line breaks.
- **Prose line width** prevents the gaming mechanism — you cannot
  reduce line count by making lines longer without triggering the
  width ceiling.

**Adoption nuance**:

- The Practice Core trinity files (`practice.md`, `practice-lineage.md`,
  `practice-bootstrap.md`) carry all three dimensions.
- Other documents may declare only `fitness_line_count` when that is the
  appropriate constraint for their role.
- The validator should check **only the dimensions each file declares**.

## Adoption Steps

### 1. Use three dimensions for the trinity, and declare only what other files need

Each of the three Practice Core files should carry all three
ceilings. Example from `practice.md`:

```yaml
fitness_line_count: 400
fitness_char_count: 25000
fitness_line_length: 100
```

Set the ceilings to values appropriate for your repo. The line and
character ceilings should reflect "readable in one sitting" for
their respective roles. A prose line width of 100 is a good default
— it matches common readability guidelines and produces clean diffs.

Outside the trinity, declare only the dimensions the file genuinely
needs. In `oak-mcp-ecosystem`, many governance and onboarding docs
carry `fitness_line_count` only.

### 2. Reflow prose to the width ceiling

Reflow all prose lines in the trinity files to the chosen width
(e.g. 100 characters). Excluded from the width check:

- YAML frontmatter
- Code blocks (fenced with ``` or ~~~)
- Table rows (lines starting with `|`)

### 3. Add the validation script

The companion file `validate-practice-fitness.ts` mirrors the live
zero-dependency validator (`scripts/validate-practice-fitness.mjs`).
Install it as:

```bash
# Copy the TypeScript mirror to your scripts directory
cp validate-practice-fitness.ts scripts/

# Or adapt the live zero-dependency version directly:
# "practice:fitness": "node scripts/validate-practice-fitness.mjs"
# "practice:fitness:informational": "node scripts/validate-practice-fitness.mjs --informational"
```

The live repo implementation uses the `.mjs` version so it can run with
plain Node:

```bash
pnpm practice:fitness
pnpm practice:fitness:informational
```

The validator discovers every **live markdown file** that declares
`fitness_line_count` in frontmatter (excluding archives, backups, and
incoming practice boxes). It checks line count and any extra dimensions
the file declares, reporting a colour-coded pass/fail table.

### 4. Extend beyond the trinity

Any document in the knowledge flow cycle can carry these ceilings.
Agent-facing and contributor-facing documents benefit from the same
discipline, but not every file needs all three dimensions. Only shallow
entry points (root README, quickstart, VISION) are typically exempt.

### 5. Wire into consolidation

The `jc-consolidate-docs` command should check fitness as part of
its pass. `pnpm make` and start-right workflows can run the
informational mode to surface drift early. This is a signal, not a
gate — exceeding a ceiling triggers tightening work, not a hard block.

## Design Decisions

- **Soft ceilings, not hard gates.** The fitness function is a
  governor, not a wall. Creative writing sometimes needs breathing
  room. The signal is "pay attention", not "stop".
- **Prose-only width check.** Code blocks, tables, and frontmatter
  are excluded because they have their own natural width constraints
  and reflowing them would damage readability.
- **Per-file, not aggregate.** Each file carries its own ceilings
  because different files have different roles and natural sizes.
