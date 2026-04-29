# PDR-007: Promoting PDRs and Universal Patterns to First-Class Core Infrastructure

**Status**: Accepted (amended 2026-04-29)
**Date**: 2026-04-18
**Related**:
[PDR-001](PDR-001-location-of-practice-decision-records.md)
(established the peer directory as provisional; this PDR supersedes
that provisional arrangement in part);
[PDR-002](PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md)
(pedagogical repetition discipline is carried into the new Core
surfaces);
[PDR-005](PDR-005-wholesale-practice-transplantation.md)
(portability gradient vocabulary informs which patterns graduate);
Practice Core trinity (`practice.md`, `practice-lineage.md`,
`practice-bootstrap.md`).

## Context

The Practice Core was defined at the time of PDR-001 as an **eight-file
plasmid trinity package**: three blueprint files (practice, lineage,
bootstrap), a verification companion, two entry points (README, index),
a changelog, and a provenance file. The contract's "eight files" shape
was load-bearing in the early Practice — it anchored portability
("travels as a package"), set the hydration target for receiving repos,
and gave the memotype a compact, inspectable surface.

That shape no longer fits the Practice's grown reality. Three concurrent
observations make the contract's current form untenable:

**Observation 1 — Three overlapping homes for portable substance.**
The Practice now carries portable substance in three separate
directories:

- `.agent/practice-core/` — the eight-file Core.
- `.agent/practice-context/outgoing/` — sender-maintained support
  material, including PDR-shaped topic notes (explorations tier,
  practice-decision-records-peer-directory, practice-core-structural-
  evolution, three-dimension-fitness-functions, etc.) alongside
  genuinely ephemeral exchange notes.
- `.agent/practice-decision-records/` — PDRs, explicitly provisional
  per PDR-001 with stated graduation intent into the Core.

Two of these (outgoing/ and practice-decision-records/) carry substance
that has the same travel requirement as the Core: it must accompany
the Practice into a hydrating repo. Neither is Core. Both exist because
the eight-file contract could not absorb them at the time they emerged.

**Observation 2 — Pattern duplication across homes.** The
`.agent/memory/active/patterns/` directory holds ~70 patterns proven by real
implementation. A subset — roughly a third — is universally applicable
across ecosystems (`findings-route-to-lane-or-rejection`,
`substance-before-fitness`, `ground-before-framing`,
`adr-by-reusability-not-diff-size`, and others). The Pattern Exchange
mechanism in `practice-lineage.md` moves Practice-relevant patterns
into `.agent/practice-context/outgoing/patterns/` to travel alongside
the Core. This creates a second copy of each portable pattern in a
separate directory, with no mechanical link between the two. Pattern
updates diverge. The duplication is not a consequence of natural drift;
it is a consequence of the eight-file contract having no place for
graduated pattern content.

**Observation 3 — PDRs were born provisional.** PDR-001 explicitly
framed `.agent/practice-decision-records/` as "clumsy but functional
for now" with "explicit expectation that stable PDRs eventually
integrate into the Core as refinements." The deferred question was
**how** integration would happen — graduate into trinity prose, or
keep a separate PDR shape. Six PDRs on, the answer is visible: PDR
shape (Context / Decision / Rationale / Consequences) is
structurally distinct from the trinity's expository prose and does not
compress into a Learned Principle or bootstrap template without
losing its decision lineage. PDRs deserve their own Core surface, not
absorption into an existing one.

Underlying cause across all three observations: **the eight-file
contract served its stability purpose and is now a restriction**. The
Practice has grown beyond what a handful of monolithic files can
carry. The contract's invariant was portability (travels as a
package); the count was a stability anchor, not a first principle.
Maintaining the count now forces portable substance into non-Core
directories that must be discovered and integrated separately — the
opposite of what the Core was designed to guarantee.

## Decision

**Redefine the Practice Core contract from "eight files" to "a bounded
package of required files and required directories." Add two
first-class Core directories: `decision-records/` and `patterns/`.
Sharpen `.agent/memory/active/patterns/` and `.agent/practice-context/outgoing/`
to their remaining roles. Fold Pattern Exchange into Core travel.**

### Amendment 2026-04-29 — `patterns/` and `practice-context/` retired

The 2026-04-18 decision introduced `practice-core/patterns/` as a
first-class Core directory for general abstract patterns synthesised
from ≥2 instances. By 2026-04-29 no general patterns had been
authored there: every Practice-governance abstraction matured as a
PDR (or as PDR amendments) instead, and every engineering instance
remained at `.agent/memory/active/patterns/` per PDR-007's own
synthesis-not-move rule. The empty `practice-core/patterns/` directory
was carrying contract weight (it was a "required Core directory" per
the decision) without carrying substance.

The `practice-context/` exchange surface was likewise emptied: every
substantive routing has resolved to a PDR, an ADR, `.agent/reference/`,
or `.agent/research/`; the `outgoing/` README is a routing-log of
completed retirements with no live forward-looking content.

This amendment retires both surfaces from the Core contract:

- **`practice-core/patterns/` is no longer a required Core directory.**
  Practice-governance patterns take the **PDR** shape with
  `pdr_kind: pattern` frontmatter; engineering instances live at
  `.agent/memory/active/patterns/`. There are no Core-pattern
  destinations.
- **`.agent/practice-context/` is retired entirely.** Both `incoming/`
  and `outgoing/` are removed. Inbound Practice exchange uses
  `.agent/practice-core/incoming/` (preserved). Outbound exchange
  routes by substance to PDRs, `.agent/reference/`, or `.agent/research/`
  per PDR-024 §Vital Integration Surfaces.

**Affected sections below**: `### patterns/` (lines 134–175) describes
the retired surface as a Core directory; treat that section as
historical context for the original decision and refer to this
amendment for the current contract. The `### practice-context/outgoing/`
section (line 199) is similarly historical. Other PDR-007 substance
(decision-records as Core, sharpening of memory/active/patterns,
Pattern Exchange folds into Core travel) is unchanged and remains
canonical. PDR-024 (vital integration surfaces) and PDR-014
(consolidation and knowledge flow discipline) carry the corresponding
amendments of the same date.

### The new Core contract

The Practice Core is a directory (`.agent/practice-core/`) containing:

| Surface | Role |
|---|---|
| `practice.md` | Trinity: the **what** — blueprint, artefact map, workflow |
| `practice-lineage.md` | Trinity: the **why** — evolution rules, exchange mechanism |
| `practice-bootstrap.md` | Trinity: the **how-to-bootstrap** — annotated templates |
| `practice-verification.md` | Health check, operational estate, acceptance criteria |
| `README.md` | Entry point (humans) |
| `index.md` | Entry point (agents) |
| `CHANGELOG.md` | Evolution log — repo-tagged summaries |
| `provenance.yml` | Per-file evolution chains for the trinity |
| `decision-records/` | **New** — portable Practice governance (all current PDRs) |
| `patterns/` | **New** — universal graduated patterns (cross-ecosystem, Practice-relevant) |
| `incoming/` | Practice Box — transient receiver for inbound Core packages |

The contract is **the set of surfaces and their roles**, not a file
count. Each surface travels as part of the Core. Receiving repos
hydrate the entire package. The package may grow by explicit decision
(future PDR) when the Practice requires a new first-class surface;
it does not grow by accretion.

### `decision-records/`

Absorbs `.agent/practice-decision-records/` as a first-class Core
subdirectory. All existing PDRs (PDR-001 through PDR-007 on acceptance
of this PDR) move to `.agent/practice-core/decision-records/` with
their numbering, filenames, and cross-references preserved. The PDR
README is updated to reflect the Core-subdirectory arrangement and
moves with them. The `Superseded by <Core section>` status value
anticipated in PDR-001 remains available for future graduations of
individual PDRs into trinity prose; the Core-subdirectory move does
not itself constitute that graduation.

A PDR may have a `pdr_kind: pattern` frontmatter annotation when its
substance is shaped like a pattern (situation-driven guidance) rather
than a governance decision. This allows pattern-shaped portable
content to live with decision-shaped portable content under one
Core surface without forcing a single template. The default shape is
the current PDR template; `pdr_kind` is a variant marker.

### `patterns/`

Holds **general, ecosystem-agnostic abstract patterns** — classes of
process, structure, architecture, or code design stated independently
of any specific toolchain. Example: "In typed systems, always be
strict about types; do not invent types where externally-defined
types exist; unknown only at incoming external boundaries" — the
general form abstracted across the specific TypeScript, Zod, and
JSON-Schema instances that instantiate it.

**Authorship model: synthesis, not migration.** General patterns are
**authored fresh** in `practice-core/patterns/` by synthesising
substance from multiple specific instances. The specific instances
**remain in `.agent/memory/active/patterns/`**; they are not moved or
copied. A general pattern and its specific instances co-exist: the
Core surface holds the abstraction; the repo surface holds the
proofs. This respects the bottom-up flow of pattern knowledge —
instances accumulate first, the general case is synthesised when
the pattern becomes legible.

Classification criterion for what belongs in `practice-core/patterns/`
(all three required):

1. **Ecosystem-agnostic** — stated without dependence on any specific
   language, framework, or toolchain. Concrete examples from
   ecosystems may illustrate the general pattern in the Notes
   section, but the Decision is ecosystem-independent.
2. **Engineering-substance, not Practice-governance** — if the
   substance is about how the Practice itself operates (review,
   planning, consolidation, knowledge-flow discipline), it belongs
   as a PDR in `decision-records/`, not as a pattern. Practice-
   governance patterns ARE decisions about the Practice; they take
   the PDR shape.
3. **Synthesised from ≥2 specific instances** in at least one repo's
   history. A pattern that has only one instance is not yet ready
   for general abstraction — it stays as an instance until others
   accumulate.

Patterns use the existing pattern template (`name`, `use_this_when`,
`category`, `proven_in`, `proven_date`, `barrier` frontmatter), which
carries forward unchanged. `proven_in` for a Core pattern cites the
specific instances it synthesises from.

### `memory/active/patterns/` — specific instances

`.agent/memory/active/patterns/` holds **specific, ecosystem-grounded
instances** of engineering patterns. Each entry is proven in a
concrete context (TypeScript, Zod, Vitest, MCP, etc.) and remains
valuable as instance-level proof — even after a general form is
authored in `practice-core/patterns/`. Instance files gain an
optional `related_pdr` or `related_pattern` frontmatter pointer
linking them to the general abstraction they instantiate.

Specific instances depend on their ecosystem context (toolchain,
language, framework). They do not travel as Core content. Receiving
repos grow their own `memory/active/patterns/` against their own ecosystems.

Patterns that describe **Practice-governance** (review discipline,
planning discipline, knowledge-flow discipline, reviewer authority,
etc.) are **not** pattern-shaped under this contract — they are
decision-shaped and migrate to `decision-records/` as PDRs. The
memory/active/patterns/ entries for those become pointers with
`related_pdr: PDR-NNN` frontmatter while remaining in place as
instance-level proof.

### `practice-context/outgoing/` — ephemeral support only

Sharpened to what its name implies: **transient exchange context**
that accompanies a Core package out of the sender but carries no
substance found nowhere else. Two patterns remain legitimate:

1. **Introduction / framing notes** — short files explaining context
   around an outbound Core (e.g. "this Core includes PDR-007; here
   is how the contract change affects integration").
2. **Transient broadcasts** — notes that will land in a receiver's
   `incoming/`, be integrated, and then expire.

Any file in `outgoing/` whose substance exists nowhere else is a
defect: it must either (a) promote to Core (as a PDR, a pattern, or a
trinity section) or (b) be deleted because it was a staging artefact
that never graduated. PDR-shaped topic notes currently in `outgoing/`
are resolved during migration: delete duplicates, promote what is not
yet captured.

### Pattern Exchange folds into Core travel

The Pattern Exchange section in `practice-lineage.md` currently
describes a separate transport path for portable patterns via
`practice-context/outgoing/patterns/` → receiver's
`practice-context/incoming/patterns/`. That path dissolves. Portable
patterns travel because they are **Core content**, not because a
separate transport mechanism carries them. The Pattern Exchange
section is rewritten to describe graduation into `practice-core/patterns/`
as the canonical flow, with `memory/active/patterns/` as the local candidate
pool and the graduation criterion as the barrier.

## Rationale

Five options were considered for resolving the three-home drift.

**Option A — Keep three homes unchanged.** Accept the duplication
between `outgoing/patterns/` and `memory/active/patterns/`, and the peer-
directory status of `practice-decision-records/`. Rejected: the drift
is already material (multiple pattern duplicates diverging silently),
and PDR-001 named the peer-directory arrangement as provisional
awaiting resolution. Continuing to defer is itself a decision with a
rising cost.

**Option B — Absorb PDRs into `practice-lineage.md` Learned
Principles only.** Rejected for the same reason PDR-001 rejected this
path: Learned Principles are terse rule statements without supersession
chains, decision-lineage fields, or sectional consequences. PDR shape
does not compress into Principle shape without losing substance.

**Option C — Absorb universal patterns into PDRs only (with
`pdr_kind: pattern`); no new Core directory.** Rejected: a decision
shape forced onto pattern-shaped content produces PDR files that read
awkwardly and lose the pattern's use-this-when discoverability. Even
with a `pdr_kind` variant, mixing ~25 patterns into the PDR stream
would obscure the PDR registry's governance focus. Patterns deserve
their own Core surface.

**Option D — Keep Core at eight files; add a ninth "index" file that
enumerates PDRs and patterns without carrying their substance.**
Rejected: an index is a pointer, not substance. The portability
discipline requires substance to travel. An enumeration file would
reproduce the current problem (substance lives elsewhere; only the
pointer travels) under a different name.

**Option E (adopted) — Redefine the Core contract as files + required
directories. Promote PDRs and universal patterns to first-class Core
surfaces.** Satisfies the portability invariant directly: graduated
substance travels as part of the Core. Removes the drift-generating
separation between Core and non-Core portable content. Preserves the
PDR and pattern templates without forcing either onto the other.
Leaves room for future first-class surfaces when they are needed,
without recurring contract negotiations.

Why the contract shape can change: the original "eight files"
framing was a stability choice, not a first principle. The first
principle is **portable substance travels with the Core**. The file
count was a convenient invariant because the Practice was small
enough for everything portable to fit in a handful of files. The
count now excludes substance that meets the travel requirement. When
an invariant starts contradicting the principle it was meant to
serve, the invariant is the part that yields.

## Consequences

### Required

- `.agent/practice-decision-records/` contents move verbatim to
  `.agent/practice-core/decision-records/`. Filenames, numbering,
  and cross-references preserve. The README moves with them.
- `.agent/memory/active/patterns/` is audited against the four-part
  universal-pattern criterion. Matching entries move to
  `.agent/practice-core/patterns/`. Non-matching entries remain in
  `.agent/memory/active/patterns/`.
- `.agent/practice-context/outgoing/` is swept: files whose substance
  exists nowhere else either promote to `decision-records/` or
  `patterns/` (if they meet the graduation criteria) or are deleted
  (if they were staging artefacts that never graduated). The
  `outgoing/patterns/` subdirectory is eliminated; its contents
  either graduated to `practice-core/patterns/` or are removed as
  duplicates of `memory/active/patterns/`.
- The trinity (`practice.md`, `practice-lineage.md`,
  `practice-bootstrap.md`) is edited to describe the new Core
  contract, the two new surfaces, and the folded Pattern Exchange
  flow. Entry points (`README.md`, `index.md`) describe the new
  hydration target. `practice-verification.md` reflects the new
  Bootstrap Checklist surfaces. `CHANGELOG.md` records the contract
  change. `provenance.yml` carries forward unchanged (trinity
  provenance is unaffected by Core surface additions).
- PDR-001 is updated to `Status: Superseded in part by PDR-007` with
  a clarifying note. The peer-directory framing is superseded; the
  decision-shape framing carries forward unchanged. PDR-001 remains
  in place per its own stipulation that superseded PDRs are
  retained as historical provenance.
- The host repo's `.agent/practice-index.md` bridge file updates
  to reflect the new Core paths where it references PDRs or
  patterns.
- Cross-references across `.agent/**/*.md` and (in host repos)
  `docs/**/*.md` sweep to zero stale paths for
  `practice-decision-records/`, `practice-context/outgoing/patterns/`,
  "eight-file", "eight files".

### Forbidden

- Re-establishing a separate pattern-transport surface at
  `practice-context/outgoing/patterns/`. Portable patterns travel
  via Core; the previous mechanism is retired, not parallelled.
- Duplicating substance across `practice-core/patterns/` and
  `practice-core/decision-records/`. The two surfaces hold
  structurally distinct content; pattern-shaped governance uses
  `pdr_kind: pattern` inside `decision-records/`, not a duplicate in
  `patterns/`.
- Duplicating substance across `practice-core/patterns/` and
  `memory/active/patterns/`. Graduation is a move, not a copy. A graduated
  pattern leaves `memory/active/patterns/` when it enters
  `practice-core/patterns/`.
- Expanding the Core contract indefinitely by accretion. A new
  first-class Core surface requires a PDR that names its role and
  graduation criterion.

### Accepted cost

- The Core hydration target grows. Receiving repos see a larger
  initial surface — on the order of the existing trinity plus
  ~7 PDRs plus ~20-30 graduated patterns. Trade-off: substance
  arrives with the Core, not separately, so the receiver does not
  have to discover and integrate multiple peer directories.
- Maintenance of `practice-core/patterns/` is a new recurring
  responsibility. Pattern retirement (when a pattern ceases to
  apply) must be explicit rather than silent. The barrier-to-entry
  discipline must extend to barrier-to-stay — a pattern whose
  `stable: true` assertion becomes false must be retired or
  re-classified.
- Existing cross-repo broadcasts that reference
  `practice-decision-records/` or the Pattern Exchange transport
  pattern become stale. Receiving repos that have already
  integrated from the previous shape may carry legacy references
  until their next Core integration cycle.

### Deferred

- **Retroactive migration of existing host-repo ADRs that encode
  Practice-governance decisions** (remained deferred per PDR-001).
  This PDR does not reopen that question; it addresses only the
  Core-contract shape and the three-homes drift.
- **Per-PDR graduation into trinity prose.** Moving PDRs into
  `practice-core/decision-records/` is a Core-shape change, not
  the per-PDR graduation path envisaged in PDR-001. A PDR whose
  substance naturally refines a trinity section may still graduate
  (with supersession marking) at a future pass; that path is
  unchanged by this PDR.

## Notes

### Self-reference

PDR-007 is itself a decision about where PDRs live. On acceptance, it
is the first file in the `decision-records/` Core surface it
establishes. The self-reference matches PDR-001's pattern: the
meta-question's answer lives in the home the answer creates.

Acceptance of PDR-007 is the acceptance of the new Core contract.
Migration is a mechanical follow-on (classification audit, file
moves, cross-reference sweep, trinity edits). The migration is
executed against an explicit plan that enumerates each change;
owner approval of the plan precedes execution.

### Future integration of PDR-007 itself

Once the new surfaces stabilise across several cross-repo integration
cycles, the framing of "Core contract = files + named directories"
may graduate into `practice-lineage.md` as a Learned Principle on
Core evolution. PDR-007 would then be marked `Superseded in part by
<Core section>` and retained as provenance. The graduation question
is open; the Core-contract change is the current decision.

### Transport and travel

Two mechanisms change together. The Core's **transport** (how the
package arrives: `incoming/` drop, two-way merge, cold-start copy)
is unchanged. The Core's **travel contract** (what counts as part of
the package) is what this PDR redefines. A transported Core package
after this PDR carries more substance per hydration, but the
transport flow — provenance chain, three-part bar, integration
command — is identical to the pre-PDR-007 flow.

### Graduation ladder under the new shape

The knowledge-flow ladder (napkin → distilled → patterns / ADRs /
principles) gains one clarified step at the top:

```text
napkin (ephemeral)
  → distilled (settled, local)
    → memory/patterns (repo-specific patterns)    [local pool]
         → practice-core/patterns (universal)      [graduates on criterion]
    → host ADRs (local architectural decisions)
    → practice-core/decision-records (portable governance) [graduates via PDR]
```

The move into `practice-core/patterns/` is the last step for patterns
before they travel with the Core. The move into
`practice-core/decision-records/` is the first step for decisions
that govern the Practice itself rather than a host repo's product.

### Host-local context (this repo only, not part of the decision)

In the repo where this PDR was authored:

- Existing PDRs to move: PDR-001 through PDR-006 (plus PDR-007
  itself on acceptance).
- Candidate universal patterns (to be classified in the migration
  plan): approximately 20-25 entries from the current ~73-file
  `memory/active/patterns/`, concentrated in the `process` and `agent`
  categories.
- Outgoing files for explicit resolution during migration:
  `explorations-documentation-tier.md`,
  `practice-decision-records-peer-directory.md`,
  `practice-core-structural-evolution.md`,
  `three-dimension-fitness-functions.md`, and the
  `outgoing/patterns/` subdirectory.
- Affected trinity files and entry points are enumerated in the
  migration plan; they are not listed here to preserve this PDR's
  portability.
