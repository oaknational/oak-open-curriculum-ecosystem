---
pdr_kind: governance
---

# PDR-015: Reviewer Authority and Dispatch Discipline

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(capability shape — this PDR governs authority and dispatch);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(findings routing — this PDR governs how findings are weighted
against each other).

## Context

A mature reviewer system invokes multiple specialists whose findings
may overlap, conflict, or address different layers of the same
artefact. Four recurring failure modes emerge when authority and
dispatch are not codified:

1. **Generalist assumptions override specialist knowledge**. An
   architecture generalist reasons structurally about SDK behaviour
   (coupling, boundaries, failure modes) and produces confident
   conclusions. A domain specialist who knows the SDK's actual
   runtime semantics may disagree. Without explicit authority
   precedence, the generalist's structural framing can override
   the specialist's verified knowledge, producing over-engineered
   or incorrect designs.

2. **Reviewers routed by file scope rather than abstraction layer**.
   Three reviewers reading the same ADR produce overlapping findings
   because they were routed by "which files does this reviewer look
   at" rather than "at what layer of meaning does this reviewer
   look." Domain-semantics, docs/ADR mesh, and code-polish layers
   each produce different findings on the same file; routing by
   file misses two of the three layers.

3. **Reviewer recommendations that widen types or weaken
   constraints are treated as authoritative**. A reviewer flags a
   forbidden construct (correct) and proposes a replacement that
   loses type information (wrong). The developer applies the
   proposed fix because the reviewer cited a valid rule. The
   underlying principle — preserve type information — is
   outweighed by the mechanical application of a forbidden-list.

4. **Reviewers invoked only at code stage**. Specialist reviewers
   can assess design intent before implementation, but are
   typically only invoked after code exists. Architectural issues
   that would have been cheap to correct as design changes become
   expensive to correct as code rewrites.

Underlying cause: reviewer systems scale by adding specialists, but
without explicit authority and dispatch discipline, each specialist's
output is weighted equally by invocation rather than by domain
competence at the question asked.

## Decision

**Domain specialists have final say within their domain. Reviewers
are routed by abstraction layer, not file scope. Reviewer
recommendations that widen types or weaken constraints are always
wrong regardless of the rule cited. Design-intent review precedes
implementation-stage review.**

### Domain specialist authority

When a multi-specialist review involves both architecture generalists
and domain specialists, **the domain specialist's assessment of
domain-specific behaviour takes precedence** over the generalists'
assumptions. Architecture generalists reason structurally — coupling,
boundaries, failure modes — which is correct for structural concerns
but can produce incorrect conclusions about how a specific domain
system (SDK, service, protocol) actually behaves at runtime.

The precedence is scoped: within the domain's specific behaviour, the
specialist wins. On structural concerns that span the domain
(coupling, boundaries between layers), the generalist's lens is
still valid. The precedence applies at the boundary between
"how does X work?" (specialist) and "how should the system
structure around X?" (generalist).

### Route by abstraction layer

When dispatching specialist reviewers on a finishing pass, treat
reviewer scope as **"at what layer of meaning does this reviewer
look"** rather than **"which files does this reviewer read."**

Typical layers:

| Layer | What the reviewer inspects |
|---|---|
| **Domain semantics** | Does the artefact correctly reflect the domain's actual behaviour, contracts, and constraints? |
| **Docs/ADR mesh** | Do the artefacts cross-reference cleanly? Are decisions captured at the right authority level? Are ADRs discoverable from plans and code? |
| **Code/file polish** | Are the individual edits correct, tested, and idiomatic? |
| **Architectural boundary** | Do the edits respect layer topology, dependency direction, and boundary discipline? |

Three reviewers routed by layer on the same artefact produce
disjoint findings. Three reviewers routed by file overlap heavily
and miss entire layers. Route by layer.

### Reviewer widening is always wrong

When a reviewer recommends replacing one type construct, contract,
or constraint with a **wider** one, the recommendation is wrong
regardless of which rule it cites. The underlying principle —
preserve type information, preserve contracts, preserve
constraints — always outweighs the mechanical application of a
forbidden-list rule.

Examples of widening that is always wrong:

- Replacing a specific schema with `unknown` to satisfy a
  "no `Record<string, unknown>`" rule.
- Replacing a type guard with a cast to silence a warning.
- Loosening a validation contract to avoid a failing test.
- Converting a closed-set enum to an open string type to avoid a
  deprecation warning.

The correct response is to find a **narrower** construct that
satisfies the rule, or — if no narrower construct exists — to
reject the rule's application in this case with written rationale
(per PDR-012 routing discipline).

### Review intent, not just implementation

Specialist reviewers are invoked at **two stages**:

- **Design-intent review** — before implementation; the reviewer
  receives a design brief (proposed approach, key decisions,
  considered alternatives) and returns findings about
  architectural soundness, missing considerations, simpler
  approaches.
- **Implementation review** — after code exists; the reviewer
  assesses the code against its plan and the Practice.

Both are required for non-trivial work. Design-intent review is
not a replacement for implementation review; it is a cheaper
earlier opportunity to catch issues that would be expensive to fix
post-code.

## Rationale

**Why domain specialists win on their domain.** Architecture
generalists reason from structural principles that are domain-
independent. A specialist reviews against the domain's actual
runtime behaviour. When structural reasoning predicts X and
specialist knowledge verifies not-X, specialist knowledge wins
because the behaviour is the ground truth. The generalist's lens
is still valuable for the structural concerns that cross the
domain boundary.

**Why abstraction layer beats file scope for routing.** Different
reviewers look at different kinds of question. A file is just a
file; what matters is what question is being asked about it.
Routing by file invites overlap on easy questions (syntax, style)
and misses the harder questions (semantics, mesh, architecture).
Routing by layer guarantees coverage and minimises overlap.

**Why widening is always wrong.** The reason a rule forbids a
construct is almost always about preserving information. A
widening fix satisfies the letter of the rule (the construct is
gone) while violating its spirit (the information it protected is
now lost). The narrower fix — or rejecting the rule's application
— preserves both.

**Why design-intent review is separate from implementation
review.** Design decisions are cheap to change in a brief; they
are expensive to change in code. A specialist who can identify a
wrong design before any code is written saves the cost of the
code's rewrite.

Alternatives rejected:

- **Equal-weighting of reviewer findings.** Produces incorrect
  decisions when a generalist and a specialist disagree on
  domain-specific behaviour.
- **Routing reviewers by file scope.** Overlap on easy questions;
  gaps on hard ones.
- **Accepting widening fixes as valid rule-compliance.** Loses
  type information and contracts; degrades the system over time.
- **Review only at code stage.** Expensive rework; avoidable.

## Consequences

### Required

- Domain specialist authority over domain-specific behaviour is
  explicit in reviewer output and findings registers. Conflicting
  findings between a specialist and a generalist on domain
  behaviour resolve to the specialist's assessment.
- Reviewer dispatch for finishing passes names the abstraction
  layer being covered by each reviewer (domain semantics, docs/ADR
  mesh, code polish, architectural boundary).
- Widening recommendations are rejected at review time with a
  narrower alternative or a written rationale naming the principle
  being upheld (per PDR-012).
- Non-trivial work receives design-intent review before
  implementation begins.

### Forbidden

- Treating generalist architectural reasoning about domain-specific
  behaviour as equal to specialist verification.
- Dispatching reviewers by "which files they touch" on a
  multi-layer finishing pass.
- Accepting type-widening or contract-weakening fixes as
  rule-compliance.
- Skipping design-intent review on work that introduces new data
  sources, integrations, MCP surfaces, cross-workspace boundaries,
  or significant architectural commitments.

### Accepted cost

- Multi-layer dispatch takes more reviewer invocations than single-
  pass. Justified by finding-quality and coverage.
- Domain specialist authority requires that specialists exist and
  are invoked. Capability gaps become visible (per PDR-010).
- Design-intent review adds a stage to complex work. Justified by
  avoided rework.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-015`:

- `.agent/memory/active/patterns/domain-specialist-final-say.md` — Sentry
  canonical alignment plan (2026-04-12); architecture generalists
  made assumptions about Sentry scope behaviour that the Sentry
  specialist corrected against official SDK documentation.
- `.agent/memory/active/patterns/route-reviewers-by-abstraction-layer.md` —
  Sentry OTel integration hygiene closure (2026-04-17); three
  reviewers on the same lane produced disjoint findings when routed
  by layer.
- `.agent/memory/active/patterns/reviewer-widening-is-always-wrong.md` —
  session 2026-04-06; type-reviewer recommended `z.unknown()` to
  satisfy a rule forbidding `Record<string, unknown>`; fix was
  wrong despite valid rule citation.
- `.agent/memory/active/patterns/review-intentions-not-just-code.md` —
  WS3 Phase 4 brand banner; 5 specialist reviewers invoked
  before implementation.
