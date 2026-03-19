# Practice Seeding Protocol Suggestions

> **Date**: 2026-03-19
> **Source**: Final cross-repo reflection after integrating oak into
> `pine-scripts` and preparing the two repos to continue separately
> **Status**: Analysis note only

This note focuses on oak's role as a **source substrate for future Practice
seedings** into other repos. It is not about preserving oak as a disappearing
repo. The question here is: what should oak improve so future receiving repos
get better transfers with less ambiguity and less inert installation risk?

## Main Suggestion

Oak should explicitly support **multiple transfer modes**, not treat all
cross-repo exchange as one thing.

The `pine-scripts` work surfaced at least two materially different modes:

- **Hydration / seeding**
  - goal: install a living local Practice in a new repo
- **Preservation / migration**
  - goal: retain source knowledge during repo separation, deletion, or
    divergence

The overlap is real, but the operating questions are different. A single
implicit transfer model makes it too easy to bring the wrong expectations to
the receiving repo.

## Suggestions for Oak as a Seeding Source

### 1. Define a canonical seeding bundle, not just a collection of useful files

The source repo currently has the right material, but not yet an explicit
"these are the things a new repo should receive first" definition.

For hydration / seeding, the canonical bundle likely includes:

- Practice Core
- operational directives, rules, commands, and prompts
- sub-agent architecture and thin platform adapters
- outgoing support pack
- a small set of memory / pattern material that prevents predictable mistakes

The lesson from `pine-scripts` is that the transfer succeeds best when the
bundle is thought of as a system, not a pile of markdown.

### 2. Add activation checks to the seeding protocol

The strongest lesson from the integration is that a seeded Practice can be
structurally complete but operationally inert.

Oak should likely teach a short post-seeding verification pass that asks:

- is metacognition deep enough to expose shallow work?
- do the operational directives carry intent, not just mechanics?
- are the platform adapters genuinely thin?
- is the receiving repo treating Practice files as infrastructure?

This would push the protocol from "copy the right files" towards
"confirm the system actually activates".

### 3. Separate source snapshot from local canon earlier

One recurring ambiguity was whether imported material had already become local
authority simply because it existed in the receiving repo.

Oak should probably recommend a clearer three-state model for seeded material:

1. **received**
2. **promoted into local canon**
3. **rejected / deleted**

That would make the promotion boundary explicit and reduce the risk of a
permanent "shadow layer" of half-adopted infrastructure.

### 4. Teach receivers to compare same-named collections, not assume equivalence

The `pine-scripts` work showed that identical directory names can conceal
meaningful divergence. `practice-core/` was the clearest example.

Oak should likely make this a standard seeding warning:

- if the receiving repo already has a local collection with the same name,
  compare it directly
- do not assume "already present" means "equivalent"
- preserve or diff source snapshots deliberately when divergence matters

### 5. Promote templates, distilled memory, and code-patterns earlier in the source story

These artefacts are easy to overlook during transfer because they sit outside
the most obvious "core" folders. But they are some of the most reusable pieces
of source-state knowledge.

For future seedings, oak may want to elevate these from "nice extras" to
"important optional amplifiers", especially once the receiving repo is mature
enough to benefit from them.

### 6. Canonical-first needs stronger transfer support

The canonical-first model is correct, but the integration work reinforced that
it is not self-enforcing during seeding:

- receivers can still edit adapters directly
- wrappers can drift
- missing platform parity can survive for too long

For oak as a seed source, this suggests that transfer guidance should include:

- explicit parity checks
- thin-adapter validation
- possibly eventual generation support once the roster shape stabilises

### 7. Preserve the bidirectional model explicitly

Oak is no longer just the source of Practice. It is a source substrate inside a
feedback loop.

That matters because it changes how oak should read incoming notes from seeded
repos: not as ad-hoc commentary, but as field evidence about portability,
activation, and maturity.

If oak wants to support the wider Practice ecosystem well, that bidirectional
model should probably be named and embraced explicitly.

## Condensed Recommendation

If only one source-level improvement is made, it should be this:

**create an explicit Practice seeding protocol that defines the bundle, the
activation checks, and the promotion boundary.**

That would give future receiving repos a better start while preserving oak's
role as the most mature source substrate in the ecosystem.
