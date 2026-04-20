# Practice Core Patterns

General, ecosystem-agnostic patterns that travel with the Practice
Core. Each pattern is an abstract class of process, structure,
architecture, or code design — stated independently of any specific
toolchain, language, or framework.

**Scope**: this directory holds **general abstract patterns only**.
Specific, ecosystem-grounded instances live in
`.agent/memory/active/patterns/` and remain there as proof. Patterns here
are authored through **synthesis** from multiple specific
instances — not moved or copied from repo memory.

**Relationship to Practice Decision Records**: patterns that
describe Practice-governance (how the Practice itself operates —
review, planning, consolidation, reviewer authority, etc.) are
**not** pattern-shaped under this Core contract. They are
decision-shaped and live as PDRs in
`../decision-records/`. A pattern here describes a general **class
of engineering solution**; a PDR describes a Practice **decision**.
The shapes differ; the test is whether the substance is engineering
(here) or governance (PDR).

## Authorship Model

General patterns are synthesised when the pattern becomes legible
across multiple specific instances. The workflow:

1. **Instances accumulate** in `.agent/memory/active/patterns/` as concrete
   engineering-level observations proven in specific code.
2. **A general form becomes legible** — the same underlying shape
   appears across instances from different ecosystems, toolchains,
   or problem domains.
3. **The general pattern is authored** here, citing the specific
   instances in its Notes section as proof. The instance files in
   `memory/active/patterns/` gain a `related_pattern: <name>` frontmatter
   pointer linking them to the general form.
4. **Instances remain in `memory/active/patterns/`** — they are not moved
   or copied. Instance-level proof continues to live at the repo
   level even after the general abstraction is authored.

This respects the bottom-up flow of pattern knowledge: instances
first, synthesis later.

## Inclusion Criteria

A pattern belongs here when **all three** hold:

1. **Ecosystem-agnostic** — the pattern is stated without dependence
   on a specific language, framework, or toolchain. Concrete
   examples from specific ecosystems may illustrate the general
   pattern; the Decision itself is ecosystem-independent.
2. **Engineering-substance, not Practice-governance** — the pattern
   is about how to engineer (code, architecture, testing). If the
   substance is about how the Practice itself operates, it is a PDR,
   not a pattern.
3. **Synthesised from ≥2 specific instances** in at least one repo's
   history. A single-instance candidate stays as an instance;
   synthesis happens when a second instance appears.

## Frontmatter Schema

Each pattern here uses the shared pattern frontmatter schema, with
adaptations reflecting the Core-level abstraction:

```yaml
---
name: "General Pattern Name"
use_this_when: "One sentence: the general situation where this pattern applies, stated abstractly"
category: code | architecture | process | testing | agent
synthesised_from:
  - "path/to/instance-1.md in <repo-name>"
  - "path/to/instance-2.md in <repo-name>"
  - "..."
synthesised_date: YYYY-MM-DD
barrier:
  ecosystem_agnostic: true
  engineering_substance: true
  synthesised_from_multiple_instances: true
  stable: true
---
```

Differences from the `memory/active/patterns/` schema:

- `synthesised_from` replaces `proven_in`; lists multiple instance
  sources.
- `synthesised_date` marks when the general form was authored.
- `barrier` fields reflect the Core inclusion criteria rather than
  the local-pattern bar.

## Current State

Population is deliberately gradual. The initial Core release
(2026-04-18) establishes this directory with scope and contract;
general patterns are authored as synthesis events occur. A general
pattern should not be rushed into authorship before legibility
across instances is clear.

At the time of this directory's establishment, no general patterns
have yet been authored. The first candidates for synthesis (when
instance accumulation supports them) include strict-types-at-
boundaries (across multiple TS/Zod/JSON-Schema instances),
infrastructure-never-masks-business (already well-stated in
memory/active/patterns/; candidate for lift-and-abstract), rate-limit-
amplification-vectors (architecture principle), and explicit-DI-over-
ambient-state (architecture principle). Authorship of these awaits
a deliberate synthesis pass that confirms legibility across ≥2
ecosystems.

## Related Surfaces

- **`../decision-records/`** — Practice Decision Records; governance
  decisions including pattern-shaped governance (PDRs with
  `pdr_kind: pattern` frontmatter).
- **`../../memory/active/patterns/`** — Specific, ecosystem-grounded
  instance patterns proven in this repo. Instance files may point
  at their general form here via `related_pattern` frontmatter.
- **`../../practice-context/outgoing/`** — Ephemeral exchange
  context; sharpened under PDR-007 to transient material only.
  Pattern transport is retired by PDR-007: portable patterns travel
  with the Core because they ARE Core content.
