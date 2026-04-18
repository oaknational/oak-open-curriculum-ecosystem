# PDR-006: Dev Tooling Per Ecosystem — Leading-Edge Reference Repos

**Status**: Accepted
**Date**: 2026-04-18
**Related**: [PDR-001](PDR-001-location-of-practice-decision-records.md)
(numbering convention);
[PDR-004](PDR-004-explorations-as-durable-design-space-tier.md)
(explorations as the vehicle for surveying a new ecosystem before
adopting a stack).

## Context

The Practice is stack-agnostic at the conceptual level: the principles,
knowledge flow, exchange mechanism, and governance structure translate
across languages and ecosystems. The templates in `practice-bootstrap.md`
use TypeScript/Node.js as concrete examples and name the adaptation
obligation (`*.unit.test.ts` becomes `*_test.go`, `test_*.py`, etc.).

At the dev-tooling level, the Practice has been less explicit. When a
receiving repo hydrates into a language or ecosystem the hydrating
agent has not previously worked with, the agent has had three options:

1. Infer a reasonable stack from general knowledge (risk: the inference
   reflects the agent's training data rather than the Practice
   network's validated choices).
2. Survey the web for current best practice (risk: volatile; lacks the
   specific integration decisions that a working stack requires).
3. Ask the owner (cost: interrupts the flow; the owner may not recall
   details of a stack they set up in a different repo months ago).

None of these options gives the hydrating agent access to a **validated
working reference** for the target ecosystem. The Practice network
has already made these decisions — but the decisions live in whichever
repo pushed each ecosystem forward first, and discovery is by word of
mouth.

Concretely, as of the authoring of this PDR:

- **TypeScript / Node.js**: one repo in the network carries the
  validated leading-edge stack (pnpm + Turborepo monorepo; TypeScript
  strict + schema-first codegen; Vitest with unit/integration/E2E
  tiers; ESLint with custom boundary rules; markdownlint; knip;
  depcruise; Prettier; Sentry + OpenTelemetry; Vercel deployment).
- **Python**: one repo in the network carries the validated leading-
  edge stack.
- **Rust**: no leading-edge reference yet.
- **Cross-ecosystem tooling** (SQL, infrastructure-as-code, container
  orchestration, shell scripting): no shared convention yet. Each
  leading-edge repo has made local decisions that have not been
  reconciled across the network.

Without a convention, a new Rust repo hydrating the Practice has no
way to pick up the Practice network's validated stack choices. The
hydrating agent either re-derives the same ground the network has
already covered elsewhere (expensive) or improvises (risky).

## Decision

Each programming language or ecosystem in the Practice network has
**one named leading-edge reference repo** whose dev-tooling stack is
authoritative for that ecosystem. Hydration into an ecosystem consults
that reference repo before making tooling choices.

### The leading-edge convention

A **leading-edge reference repo** is a repo in the Practice network
that:

1. Carries a production-grade, validated working stack for its
   ecosystem (not a toy project, not an exploration).
2. Has an up-to-date Practice instance — the tooling choices are
   documented, discoverable, and aligned with the Practice's
   principles (strict and complete, quality gates blocking, schema-
   first, etc.).
3. Is explicitly nominated as leading-edge for that ecosystem by the
   Practice network's owner.

The leading-edge status is **not permanent**. When another repo in
the network advances the ecosystem's stack (adopts a new pattern
that supersedes the reference), the reference designation migrates.
Both repos continue to exist; only the designation moves. The
superseded reference retains historical value as the evolution
record.

### Ecosystem coverage

Ecosystems are identified at a granularity that matches stack
cohesion:

- **Languages**: TypeScript/Node.js, Python, Rust, Go, etc. Each
  language carries its own leading-edge designation.
- **Cross-cutting ecosystems** that have their own stack cohesion
  independent of language: SQL tooling (migration tools, query
  builders, schema management), infrastructure-as-code (Terraform,
  Pulumi, CDK, etc.), container orchestration (Docker, Kubernetes
  manifests, Helm charts), shell tooling (Bash discipline, POSIX
  compliance, test harnesses for shell scripts).
- **Platform / deployment ecosystems** where the choice meaningfully
  constrains the stack: Vercel, AWS, Cloudflare, GCP.

Not every ecosystem needs a leading-edge reference immediately. The
PDR establishes the convention; population of references is
incremental and owner-driven.

### Discoverability

Each leading-edge reference repo SHOULD carry a
`docs/dev-tooling.md` (or equivalent — name and location may adapt,
but the content is stable) naming:

1. The ecosystem the repo leads (language and any cross-cutting
   concerns it covers).
2. The primary tooling choices (package manager, test framework,
   linter, formatter, type-checker, build system, boundary
   enforcement, documentation pipeline, quality-gate aggregator).
3. The integration decisions (how the tools compose; where their
   configs live; how they interact with the Practice's quality
   gates).
4. A changelog of stack-level decisions (new tools adopted; old
   tools retired; version-pinning choices and their rationale).
5. A pointer to the ADRs, explorations, and PDRs that informed the
   stack choices — the reasoning trail.

The hydrating agent in a new repo's ecosystem reads this document
first, then adapts.

### Nomination and supersession

A repo becomes leading-edge for an ecosystem by **explicit
nomination** — the owner declares it. Absence of nomination is not
implicit elevation; unnamed repos are not leading-edge.

A repo loses leading-edge status when (a) another repo is nominated
for the same ecosystem, (b) the repo itself is retired, or (c) the
ecosystem itself is retired. Loss is explicit, not silent.

### Gaps

Ecosystems without a named leading-edge reference are explicitly
**gaps** in the Practice network's coverage. Gaps are not failures —
they indicate the network has not yet pushed hard in that
ecosystem. A new repo hydrating into a gap ecosystem should:

1. Survey the web for current best practice in that ecosystem.
2. Produce an exploration document recording the stack-decision
   rationale with citations.
3. Request owner nomination if the resulting stack seems
   leading-edge-worthy for the network; decline nomination if the
   repo is too domain-specific to serve as a general reference.

## Rationale

Four reasons this convention is worth codifying.

1. **Validated working stacks are hard-won.** Each production-grade
   stack represents many decisions that survived integration testing,
   dependency conflicts, version bumps, and real operational use. The
   Practice network has already paid the cost of deriving these
   stacks. Naming the leading-edge reference repos makes the paid
   cost reusable across hydrations.

2. **Agent inference is not a substitute.** A hydrating agent's
   stack inference draws on training data that is older than the
   network's current best practice and does not reflect the
   network's specific integration decisions. Hydration should consume
   the network's validated choices, not regenerate them.

3. **Gaps become visible.** An explicit "Rust reference: not yet
   nominated" is actionable — it says the next Rust-repo-in-the-
   network is a candidate. An implicit gap (no convention to record
   the state) is invisible until someone hits it.

4. **Network-wide coherence improves over time.** When a reference
   repo adopts a new pattern, that pattern propagates to the next
   hydration. The network's stack decisions converge rather than
   fragment.

## Consequences

**Required**:

- Every leading-edge reference repo MUST carry a
  `docs/dev-tooling.md` (or discoverable equivalent) documenting the
  stack and its rationale.
- Hydrating agents MUST consult the relevant leading-edge reference
  before making stack choices in a named ecosystem. "I know a good
  default" is not acceptable when a validated reference exists.
- New leading-edge nominations MUST be explicit — recorded in the
  network's nomination registry (see Notes for host-local
  implementation).
- A leading-edge repo that falls behind or regresses on its stack
  SHOULD have its nomination revoked rather than silently retained;
  stale references are worse than missing ones.

**Forbidden**:

- Implicit leading-edge designation. A repo that has "the best stack
  the owner has seen" is not leading-edge until explicitly nominated.
- Silent supersession. When a new reference is nominated for an
  ecosystem, the transition is recorded explicitly so hydration
  history traces correctly.
- Treating cross-cutting ecosystems as subordinate to a specific
  language's reference. SQL tooling is not "whatever the TypeScript
  reference uses"; it has its own stack concerns and deserves its
  own reference (or an explicit shared-with-X mapping).

**Accepted cost**:

- Maintaining `docs/dev-tooling.md` in each reference repo is
  recurring work. This is justified by the hydration payoff: the doc
  is the interface between the network's validated choices and the
  next repo that needs them.
- Nomination and supersession are owner-gated. This creates a small
  friction cost but prevents unmaintained references from accruing.

## Notes

### Host-local context (this repo only, not part of the decision)

At the time of authoring, the owner's Practice network has the
following leading-edge state:

| Ecosystem | Leading-edge repo | Status |
|-----------|-------------------|--------|
| TypeScript / Node.js | `oak-open-curriculum-ecosystem` (this repo) | Current |
| Python | `~/code/personal/algo-experiments` | Current |
| Rust | (none) | Gap — waiting for first Rust repo in the network |
| SQL tooling | (none) | Gap — decisions currently distributed across leading-edge repos |
| Infrastructure-as-code | (none) | Gap — Vercel-specific deploy config currently lives in this repo |
| Container / orchestration | (none) | Gap |
| Shell / POSIX tooling | (none) | Gap |
| Vercel deployment pipeline | `oak-open-curriculum-ecosystem` (this repo) | Current; incidentally carried |

Gaps named above should be treated as candidates for exploration
during the next relevant repo hydration.

### Hydration-of-this-PDR-across-the-network

For this PDR to have effect in the owner's Practice network:

1. Each currently-leading-edge repo should add a `docs/dev-tooling.md`
   (or equivalent) if one does not already exist.
2. The cross-repo nomination registry can live in any host-repo
   surface the owner prefers — this repo's `practice-index.md`,
   a dedicated directory, or a network-level README outside any
   single repo.
3. When a new Rust or IaC or SQL-leading repo is nominated, its
   hydration should produce the `docs/dev-tooling.md` before the
   nomination is considered settled.

### Relationship to Practice Core adaptation guidance

`practice-bootstrap.md § Before You Begin: Ecosystem Survey`
instructs hydrating agents to "survey the existing repo: language(s),
test/lint/build stack, package manager, quality standards, and
existing Practice infrastructure." This PDR extends that survey:
once the ecosystem is identified, consult the leading-edge reference
repo for that ecosystem's validated stack before choosing tools. The
survey and the reference consultation are complementary — survey
finds what is locally present; reference finds what the network has
validated elsewhere.

### When a repo sits across multiple ecosystems

A polyglot repo (TypeScript front-end + Python data pipeline +
Terraform infrastructure) consults multiple leading-edge references,
one per ecosystem. The references are independent; adopting the
TypeScript stack from one reference does not constrain the Terraform
stack chosen from another.

### Graduation intent

This PDR is portable Practice governance. If the leading-edge
convention stabilises across several nominations and supersessions,
the convention's substance (gradient of portability for dev tooling;
nomination discipline; gap visibility) may graduate into
`practice-lineage.md` as a Learned Principle and
`practice-bootstrap.md` as an Ecosystem Survey extension. The PDR
itself would then become historical, retained as the provenance
record of when and why the convention was established.
