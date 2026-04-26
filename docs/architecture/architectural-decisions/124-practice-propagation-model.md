# ADR-124: Practice Propagation Model

**Status**: Accepted
**Date**: 2026-03-02
**Related**: [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md)

## Context

ADR-119 established that the Practice is "conceived as a transferable
pattern that can be adopted in other repositories." The initial
propagation mechanism used three files — `practice.md` (the what),
`practice-lineage.md` (the why), and `practice-bootstrap.md` (the
how) — collectively called the "plasmid trinity."

Real-world propagation between repositories revealed three problems:

1. **No entry point for either audience.** A human receiving the
   trinity files had to read `practice-lineage.md` §Growing a
   Practice to understand what to do — there was no human-friendly
   "start here." An agent had to piece together orientation from
   multiple files, with the index file sending them back to the
   README and vice versa.

2. **External links break on arrival.** `practice.md` contained 18
   navigable markdown links to files outside `practice-core/` —
   directives, ADRs, commands, skills. These resolve in the origin
   repo but break the moment the files travel to a new one. The
   practice guide looked correct but silently misdirected.

3. **Rich contextual links are valuable.** Simply converting
   external links to code-formatted text solves portability but
   loses navigability. An agent working in a hydrated repo needs
   clickable links to the local directives and ADRs, not just
   path strings.

## Decision

### Practice Core Package

The Practice travels as a package in `.agent/practice-core/`:

| File                       | Audience | Role                                                                     |
| -------------------------- | -------- | ------------------------------------------------------------------------ |
| `practice.md`              | Agents   | Blueprint: artefact map, workflow, three-layer model (the **what**)      |
| `practice-lineage.md`      | Agents   | Blueprint: principles, evolution rules, exchange mechanism (the **why**) |
| `practice-bootstrap.md`    | Agents   | Blueprint: annotated templates for every artefact type (the **how**)     |
| `practice-verification.md` | Agents   | Verification checklist for hydration and operational fitness             |
| `README.md`                | Humans   | Entry point: context and hydration how-to                                |
| `index.md`                 | Agents   | Operational orientation and cold-start instructions                      |
| `CHANGELOG.md`             | Both     | Evolution log for Practice Core changes                                  |
| `provenance.yml`           | Both     | Per-file provenance chain                                                |

The package also requires `decision-records/`, `patterns/`, and
`incoming/`. The three trinity files carry YAML provenance frontmatter
and evolve between repos. Entry points orient the two audiences
receiving the Practice; verification, changelog, provenance, and
required directories make the package operational rather than merely
descriptive.

### Self-Containment Rule

Practice-core files may reference each other freely but must not
contain navigable markdown links to files outside `practice-core/`,
with one exception: `../practice-index.md` (see below). All other
external paths appear as code-formatted text (e.g.
`.agent/directives/AGENT.md`) to describe what should exist or
where artefacts live after hydration.

This is recorded as a Learned Principle in `practice-lineage.md`.

### Practice-Index Bridge

Each repo creates `.agent/practice-index.md` during hydration —
the one file that bridges the portable core and the local repo's
artefacts. Practice-core links to it via `../practice-index.md`.

The practice-index carries navigable links to the local repo's:

- **Directives** — `AGENT.md`, `principles.md`, etc.
- **Architectural decisions** — ADRs referenced by `practice.md`
- **Tools and workflows** — commands, skills, rules
- **Artefact directories** — `.agent/`, `.cursor/`, `docs/`
- **Live coordination state** — collaboration-state directories such as
  shared logs, active claims, closed claim history, and decision threads

The format is specified by `practice-bootstrap.md` with a template
and required sections. The practice-index is NOT part of the
travelling package — it stays in the repo. Each repo's instance
carries links to that repo's actual files.

### Boundary Contract

|                | Portable (travels)               | Local (stays)                  |
| -------------- | -------------------------------- | ------------------------------ |
| **Files**      | Practice Core package            | `.agent/practice-index.md`     |
| **Links**      | Only to each other + the bridge  | To the repo's actual artefacts |
| **Created by** | Origin repo or prior propagation | Hydration step 8               |

## Consequences

### Positive

- Practice-core is genuinely self-contained and portable — no
  silent link breakage on arrival
- Humans have a clear, approachable entry point ("create dir,
  drop files, ask your agent")
- Agents have a self-contained operational document that handles
  every scenario (day-to-day, cold start, misplaced files)
- Rich contextual links are preserved via the practice-index
  bridge, not lost to portability constraints
- The bridge pattern (dependency injection for documentation)
  means each repo adapts the portable core to its own structure
  without editing the core
- Self-containment is mechanically verifiable: a script in
  `practice-lineage.md` strips code fences and greps for
  external links

### Negative

- The travelling package is larger than the original trinity,
  increasing the surface area for propagation
- The practice-index is an additional file that must be created
  during hydration and kept in sync as the repo evolves
- The self-containment rule means `practice.md` is slightly
  less navigable when read in the origin repo (code-formatted
  paths instead of clickable links); the practice-index
  compensates

### Neutral

- The "plasmid trinity" name is preserved for the three core
  blueprint files. The broader travelling package is called the
  "Practice Core package."
- Existing repos that adopted the trinity need to create a
  practice-index and may need to update practice-core links
  on their next consolidation pass
