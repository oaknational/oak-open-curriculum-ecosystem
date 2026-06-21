---
provenance: provenance.yml
fitness_line_target: 680
fitness_line_limit: 830
fitness_char_limit: 48500
fitness_line_length: 100
---

# Practice Lineage

This is the canonical **lineage** document: the git-like record of how this repo's Practice has
branched, merged, transplanted, and evolved across contexts — the narrative companion to
`provenance.yml`, which carries the per-file evolution chains. Its single purpose is to record and
explain the **mechanism of that evolution**: how the Practice arrives in a repo (branching), how
instances exchange learning (merging), how a fully-grown Practice moves wholesale (transplanting),
and how the provenance chain keeps the journey legible.

It is deliberately **not** two things it once accreted:

- **Not a principles store.** Principles discovered through Practice evolution live in their homes
  by intent — portable Practice-governance in the `decision-records/` PDRs, engineering
  imperatives in `principles.md`, always-fire behaviour in the rules. The lineage records *that
  the Practice evolved*, not the doctrine the evolution produced.
- **Not a propagation template.** What the Practice *is* lives in `practice.md`; *how to build,
  hydrate, and verify* one lives in `practice-bootstrap.md` and `practice-verification.md`. This
  file references those rather than duplicating them.

When propagating the Practice to another repo, copy the full Core package — the trinity
(`practice.md`, this file, `practice-bootstrap.md`), the verification companion
(`practice-verification.md`), the entry points (`README.md`, `index.md`), the changelog
(`CHANGELOG.md`), the provenance file (`provenance.yml`), and the `decision-records/` directory
that travels with the Core per
[PDR-007](decision-records/PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md). The package
contract and the self-containment rule (no host ADR numbers, paths, entity names, or SHAs in Core
content) are specified in [practice.md §Plasmid Exchange](practice.md#plasmid-exchange); this file
records how exchange and propagation actually move the lineage forward.

## Provenance

Per-file provenance chains live in `provenance.yml`, which travels with the Core package. Each file
has its own chain because the files may have evolved independently in early history. Each entry
records:

| Field     | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `id`      | UUID v4 identifying this entry. Unique across all chains.                                |
| `repo`    | Repository name.                                                                       |
| `date`    | Date this iteration was created or last evolved.                                       |
| `purpose` | What the Practice is being used for — tells receiving repos what shaped this evolution. |

The chain tracks origin (first entry), evolution (last `repo` differs →
new learnings), and context (`purpose` describes what shaped the
evolution). Evolving repos append new entries to `provenance.yml`.

A plasmid needs a **provenance chain, not just an origin.** A single origin entry records where the
Practice began but not how it changed; the chain is what makes the evolution legible — each entry
a commit in the lineage's history. And provenance is **storytelling, not credit**: the chain records
the knowledge journey, not ownership. Every repo that shaped the evolution appears because the work
is collaborative, not competitive (`provenance.yml` carries this in its `attribution` field).

**Caveat**: a later entry does not imply superiority across all dimensions. Repos evolve
independently; always compare content, not position, when integrating incoming material.

## Adaptation Levels

The Practice adapts to the scope of its context — this is one axis of how it evolves across repos.

**POC (days to weeks)**: Inline agents. Simplified gates. No layered composition, no ADR
infrastructure, no full learning loop. Metacognition and napkin retained. 3 agents: code-expert,
test-expert, type-expert.

**Production (months to years)**: Layered agent architecture. Full specialist roster. Learning loop
(napkin -> distilled -> rules). ADR infrastructure. Full quality gate sequence.

## Practice Maturity

Adaptation levels describe *scope*; maturity levels describe *depth*. A Production-scope
installation can be at Level 1. Use these to diagnose Practice health at any point in its evolution.

| Level | Name                  | Signals                                                    | Failure mode                        |
| ----- | --------------------- | ---------------------------------------------------------- | ----------------------------------- |
| 1     | **Structural**        | Files present, references resolve                          | Looks right, nothing works          |
| 2     | **Operational**       | Directives have depth, sub-agents function                 | Works but doesn't self-correct      |
| 3     | **Self-Correcting**   | Metacognition genuine, consolidation catches drift          | Corrects but doesn't evolve         |
| 4     | **Evolving**          | Lineage captures principles, context processed             | Evolves without selection pressure   |

Target **Level 3** before declaring integration complete.

## How the Practice Evolves

Most session learnings go into the napkin. That is the default.

The Practice itself changes only when a learning is **structural**. The bar:

1. **Validated by real work?** Speculation doesn't clear the bar.
2. **Would its absence cause a recurring mistake?** If it's "nice to know," it stays in the napkin.
3. **Stable?** If you expect it to change again soon, it's not ready. The Practice is a ratchet, not
   a pendulum.

The `consolidate-docs` workflow includes a step to consider Practice evolution. That is the
natural trigger point. The flow is **self-applicable**: the rules are subject to the same evolution
process they govern, and a change to them must clear this same three-part bar.

## Fitness Functions

The three-part bar governs what enters but not cumulative growth. Without
fitness limits, files bloat — compounded by plasmid exchange adding content
across repos. Fitness governance is therefore part of the evolution mechanism: it is what keeps an
evolving, cross-repo-merging Practice from accreting without bound.

### Thresholds (Three-Zone Model)

Four fitness fields govern each tracked file. All measure content only
(frontmatter excluded). Width applies to prose only (code blocks, tables,
frontmatter excluded).

| Frontmatter key       | Threshold | What it guards                                                        |
| --------------------- | --------- | --------------------------------------------------------------------- |
| `fitness_line_target` | Soft      | Content lines — signal to refine; agents may extend modestly          |
| `fitness_line_limit`  | Hard      | Content lines — structural response signal, not a learning veto       |
| `fitness_char_limit`  | Hard      | Content characters — honest volume (ungameable)                       |
| `fitness_line_length` | Hard      | Prose line width — readability and diff quality; always 100           |

Metrics land in `healthy`/`soft`/`hard`/`critical` where `critical` =
`hard limit × 1.5`. All zones are signals. `hard` and `critical` require
structural response and may stop routine cleanup, but they must not suppress
capture, distillation, graduation, or preservation of understanding. Only
the user raises hard limits. All governed files carry all four fields;
shallow entry points (README, quickstart, VISION) are exempt.

### Growth Governance

**Provenance** (`provenance.yml`) is unconstrained: the per-file evolution chains grow with each
repo visit but live in a separate metadata file, outside the content-line budget. This is the one
deliberate exception — the evolution record's own data must be free to accumulate.

### Tightening Process

When a file exceeds its ceiling: graduate mature content to its correct home, merge genuinely
overlapping material, remove spent examples — preserving coverage. The cure routes pressure
structurally (graduate, split by responsibility, or owner-approved limit change), never by
compressing or dropping understanding to hit a number. Present tightened versions to the user
before committing.

## Plasmid Exchange

The Practice is not hierarchical. Each repo carries its own Practice instance, adapted to its own
context; instances branch from and merge back into one another. The package contract (which files
travel) and the self-containment rule are in
[practice.md §Plasmid Exchange](practice.md#plasmid-exchange). What follows is the **merge
mechanism**: how an instance receives and integrates learning from a sibling.

The previous `.agent/practice-context/` peer companion ephemeral exchange surface was retired
2026-04-29 (PDR-007 amendment); inbound substance now arrives via `decision-records/incoming/` and
outbound substance routes by shape per PDR-024.

### The Practice Box

Every repo with a Practice has a canonical location for incoming material:
**`.agent/practice-core/incoming/`** (the Practice Box). This directory is normally empty (with a
`.gitkeep`). When Practice Core files arrive from another repo, they are placed here, and checked at
two points: **session start** (via `start-right-quick`, alerting the user) and **consolidation**
(via `consolidate-docs`, performing the full integration flow below).

### Integration Flow

When Practice Core files appear in the Practice Box:

1. **Check the provenance chain.** Read `provenance.yml`. If the last entry's `repo` for any file
   differs from the local repo name, the file has been evolved elsewhere and may carry new
   learnings. If the last entry matches the local repo, there is nothing new to integrate.
2. **Read it.** Read the changelog for a summary of what changed since the last provenance entry
   matching the local repo. Then read the full files to understand
   what they learned and why. The `purpose` field in each provenance
   entry tells you what kind of work shaped the evolution — use this
   to assess relevance to the local context.
3. **Compare at the concept level** — not file-by-file. The incoming
   Practice may express the same concepts under different names,
   structures, or artefacts. Ask: does it reveal principles that the
   local Practice implements implicitly but hasn't named? Does the
   local Practice already have the concept but with different
   mechanics? What is genuinely new substance versus what is a
   different encoding of something already understood?
4. **Apply the same bar.** Does the incoming learning meet the structural-change criteria for *this*
   repo? (Validated by real work? Prevents recurring mistakes? Stable?)
5. **Propose changes** to the user. Be specific: which files across the Practice would change and
   why.
6. **On approval, apply.** Update Practice, Lineage, rules, skills, commands, or directives as
   warranted.
7. **Record what was taken** in the napkin (for traceability, not attribution).
8. **Audit cohesion.** Check that all Practice Core files are internally consistent — no
   contradictions, no stale descriptions, no missing cross-references — that
   `.agent/practice-index.md` links resolve, that broader Practice files (directives, rules,
   skills, commands) align with the updated Core, and that operational surfaces (memory sinks,
   continuity host, hook estate, the
   bridge's truthfulness, activation-parity) hold. See
   [practice-verification.md](practice-verification.md) for the full audit.
9. **Clear transient exchange material.** Remove the incoming files
   from `.agent/practice-core/decision-records/incoming/`. The
   integration is complete.

If nothing clears the bar, record that in the napkin too — the
incoming material was reviewed and found not applicable to this
context. That is a valid outcome.

**Two-way merge**: when the local Practice has also evolved since the
last common ancestor, start from the incoming files (they carry
cumulative evolution as a coherent whole) and merge local additions
back. Verify by diffing backup against result. Fitness checks are
mandatory — two-way merges frequently push files over their ceilings.

### Pattern and Decision Travel

Under PDR-007 (with its 2026-04-29 amendment), portable patterns and
portable Practice-governance decisions travel **as Core content** in
PDR form. The previous `.agent/practice-core/patterns/` Core directory
and `practice-context/outgoing/patterns/` transport route are both
retired.

**Universal patterns** travel as PDRs in
`.agent/practice-core/decision-records/` with `pdr_kind: pattern`
frontmatter. They are ecosystem-agnostic abstractions synthesised
from multiple specific instances.

**Specific instances** live in `.agent/memory/active/patterns/` and
remain local (they are the proof that supports the general
abstraction).

**Practice Decision Records (PDRs)** live in
`.agent/practice-core/decision-records/` and travel with the Core
package. Pattern-shaped governance (reviewer discipline, planning
discipline, knowledge-flow discipline, etc.) takes ordinary PDR
shape; ecosystem-agnostic engineering patterns take PDR shape with
`pdr_kind: pattern`.

The graduation ladder:

```text
napkin (ephemeral)
  → distilled (settled, local)
    → memory/patterns (repo-specific pattern instances)
         → practice-core/decision-records [PDR with pdr_kind: pattern]
                                          (general abstraction via synthesis)
    → host ADRs (local architectural decisions)
    → practice-core/decision-records (portable Practice governance) [PDRs]
```

A universal pattern is **authored fresh** as a PDR with
`pdr_kind: pattern` when instance accumulation makes the general
form legible; the instances remain as proof. A governance PDR is
**authored fresh** in `practice-core/decision-records/` when a
Practice-governance decision needs to travel; its instance patterns
(if any) remain in `memory/active/patterns/` with
`related_pdr: PDR-NNN` frontmatter. All PDRs use the template
documented in `practice-core/decision-records/README.md`.

## How the Practice Arrives in a New Repo

A new lineage begins when the Practice arrives in a repo by one of three paths — these are the
branching and transplanting events the provenance chain records.

**Effort heuristic**: in the first real migration, roughly a third of Practice files were fully
portable (zero edits), a third needed selective editing (universal core with domain-specific
sections to remove), and a third needed complete rewrite or deletion. The mixed tier is the most
labour-intensive — it requires line-by-line judgement about what is universal and what is local.
Budget accordingly.

### Three genesis scenarios

1. **Cold-start hydration** — Core arrives in a Practice-free repo; the
   hydrating agent grows a Practice from the bootstrap templates. See
   [practice-bootstrap.md](practice-bootstrap.md) for the step-by-step.
2. **Plasmid integration** — Core arrives via
   `.agent/practice-core/incoming/` in a Practice-bearing repo; the
   receiving Practice absorbs concepts via §Integration Flow above.
3. **Wholesale transplantation** — a fully-hydrated applied Practice
   from a source repo is transplanted into a Practice-free destination.
   Governed by [PDR-005](decision-records/PDR-005-wholesale-practice-transplantation.md);
   requires a classification-first transplant manifest (as an
   exploration per PDR-004) and a four-audit close (foreign-antigen,
   completeness, cohesion, manifest-closure). The transplant manifest
   survives in the destination's history as the reasoning trail for the
   destination's initial Practice shape.

Know which scenario applies before beginning; the process differs
materially across the three. The build, hydration, and verification procedures for each live in
[practice-bootstrap.md](practice-bootstrap.md) and
[practice-verification.md](practice-verification.md) — this file records *which* branching event
occurred and *why*, not the step-by-step of carrying it out.
