---
pdr_kind: governance
---

# PDR-015: Reviewer Authority and Dispatch Discipline

**Status**: Accepted (amended 2026-04-21)
**Date**: 2026-04-18 (amended 2026-04-21 — dispatch discipline
extended in two ways: (a) friction-ratchet trigger — accumulated
friction on a single topic within a session escalates to
`assumptions-reviewer` for solution-class review; (b) reviewer
phase alignment — the existing design-intent + implementation
two-stage model extended explicitly to three phases (plan-time,
mid-cycle, close) so that reviewers fire at the lifecycle moment
where their findings are cheapest to act on. Underlying authority
precedence, layer-routing, widening-is-wrong, and review-intent
substance unchanged.)
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(capability shape — this PDR governs authority and dispatch);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(findings routing — this PDR governs how findings are weighted
against each other).

## Amendment Log

- **2026-04-26 amendment — parallel reviewer dispatch and structural-
  then-pre-landing review phasing (Frolicking Toast / claude-code /
  claude-opus-4-7-1m; agentic-engineering-enhancements thread;
  consolidation graduation pass).** Two dispatch-discipline
  refinements promoted from observed evidence:

  1. **Parallel reviewer dispatch is the default for substantive
     plans.** For plans introducing new architectural surfaces
     (directories, schemas, lifecycle mechanisms) and for substantive
     code-shaping commits, dispatch reviewers in parallel rather than
     sequentially. Different reviewer roles see different things —
     adversarial structural reviewers (Wilma family) catch boundary,
     threat-model, and lifecycle gaps; pre-landing reviewers
     (`docs-adr-reviewer`, `assumptions-reviewer`) catch substance-
     level errors that survive structural review (broken paths
     inherited from imprecise plan-body glosses; markdownlint
     violations; unobservable tripwires); vendor-specialist reviewers
     catch vendor-contract violations that in-house reviewers
     structurally cannot.

     Empirical evidence: WS1 of the multi-agent collaboration
     protocol (2026-04-25) used four parallel lenses to produce four
     orthogonal finding sets; sequential dispatch would have been
     ~4× slower for the same outcome. The 2026-04-26 Tier 2
     fingerprinting commit ran code-reviewer + sentry-reviewer +
     test-reviewer in parallel; sentry-reviewer caught a MAJOR
     vendor-contract violation that the other two passed with only
     NIT/MINOR findings.

  2. **Two-phase review for substantive plans: structural review
     shapes the design; pre-landing review validates the
     implementation faithfully embodies the design.** The existing
     three-phase lifecycle alignment (plan-time / mid-cycle / close,
     2026-04-21 amendment) layers on top of this two-phase review-
     class distinction:
     - Structural review (Wilma family, architecture-reviewer-*)
       fires at plan-time and at major inflection points; its lens
       is "is the boundary right?" / "is the threat model right?"
     - Pre-landing review (`code-reviewer`, `test-reviewer`,
       `docs-adr-reviewer`, `assumptions-reviewer`, vendor
       specialists) fires at close; its lens is "does the
       implementation faithfully embody the design that structural
       review approved?" Pre-landing review can find substance-
       level errors that survived structural review (broken
       citations, vendor-contract violations, missing test
       coverage) and that no other phase will catch.

     Skipping either review class leaves a structural gap — running
     pre-landing review without prior structural shaping invites
     mechanical absorption of findings against an unsound design
     (the very failure the 2026-04-25 assumption-challenge amendment
     names); running structural review without later pre-landing
     review ships designs whose implementation may diverge silently.

  No semantic weakening of any existing rule. The amendments codify
  what 2026-04-25 WS1 and 2026-04-26 Tier 2 evidence already
  demonstrated. Cross-references added to PDR-033 (vendor-doc
  review for unknown unknowns), which makes vendor-specialist
  reviewers a routine member of the parallel dispatch set when
  third-party platforms are involved.

- **2026-04-25 amendment — assumption-challenge / discussion-before-
  absorption gate (Fresh Prince / claude-code / claude-opus-4-7-1m;
  agentic-engineering-enhancements thread; owner-ratified during
  pending-graduations promotion pass after WS0+WS1+WS2 of the
  multi-agent collaboration protocol landed).** When an adversarial-
  class reviewer (Wilma family, `assumptions-reviewer`, or any
  reviewer whose lens is "what is wrong with this design" rather
  than "how can this design be improved") surfaces BLOCKING
  findings on a plan body or design, the agent MUST dispatch an
  **owner-led discussion about whether the design's central claim
  is right** BEFORE mechanically absorbing each finding as a
  binding work item. Some findings dissolve under reframing rather
  than requiring hardening; some are false because the reviewer's
  assumed frame does not match the actual frame; and absorbing
  every BLOCKING finding mechanically can produce a worse outcome
  than reframing the design.

  Two recorded instances:
  1. 2026-04-23 review-cascade spiral — three reviewers escalating
     against a plan body without claim-level assumption challenge;
     the eventual fix was a re-framing of the central claim, not
     the absorption of any individual reviewer finding.
  2. 2026-04-25 Wilma adversarial review of the multi-agent
     collaboration plan — BLOCKING findings about
     "lock"/"refusal"/"enforcement" dissolved when the central
     claim was reframed from enforcement to advisory. Mechanically
     absorbing the findings would have produced an enforcement-
     shaped protocol; the reframe replaced them with a
     fundamentally different design.

  New §Assumption-challenge gate before absorbing adversarial-
  review findings section in the Decision area names the gate.
  Cross-references PDR-029 v2 amendment (advisory firing, not
  mechanical enforcement) which lands in the same pass: the
  assumption-challenge gate is a reviewer-discipline statement of
  the same broader principle that PDR-029's tripwire-firing
  doctrine names mechanism-side. Together they describe a
  Practice that prefers reframing to mechanical hardening when
  the underlying claim may be wrong.

- **2026-04-21** (Accepted): two dispatch-discipline extensions
  landed. **(a) Friction-ratchet trigger.** When three or more
  distinct friction signals accumulate on a single topic within a
  session (a friction signal is any of: a hook failure, a reviewer
  rejection, an owner correction, a quality-gate breach, a
  retracted plan-body section, a missing-evidence finding), the
  agent MUST escalate to `assumptions-reviewer` for a
  solution-class review of the topic, rather than continuing to
  apply local fixes. The third signal is the trigger — at that
  point the local-fix lens has demonstrably failed, and the
  question is whether the underlying assumption set is wrong.
  Counter resets at session boundary. **(b) Reviewer phases
  aligned to lifecycle.** The existing two-stage model
  (design-intent and implementation review) is extended explicitly
  to three named phases: **plan-time** (reviewer fires on the plan
  body before plan exit, against assumptions and structural
  soundness — see also PDR-031 for the build-vs-buy attestation
  this phase enforces); **mid-cycle** (reviewer fires at major
  inflection points within execution — phase boundaries, surface
  introductions, risk thresholds reached — to catch
  framing-outlives-the-plan failures before they compound); and
  **close** (reviewer fires on the landed change, against
  cumulative quality and Practice fit). Each phase has a
  characteristic reviewer set and characteristic findings; missing
  a phase is a dispatch-discipline failure. The two-stage shape
  remains valid for trivial work; the three-phase shape is
  required for non-trivial work. Captured originally in the
  retracted standing-decisions register entries
  `friction-ratchet-counter-3-plus-signals-escalates-to-
  assumptions-reviewer` and
  `reviewer-phases-aligned-plan-time-mid-cycle-close`; graduated
  to this PDR in 2026-04-21 Session 5 per the decomposition arc.

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

### Reviewer phases aligned to lifecycle (2026-04-21 amendment)

The two-stage model above is extended explicitly to **three named
phases** for non-trivial work, each with characteristic reviewers
and characteristic findings:

| Phase | When it fires | Characteristic reviewers | Characteristic findings |
|---|---|---|---|
| **Plan-time** | Before exiting planning mode | `assumptions-reviewer`, the domain-specialist most relevant to the proposed work, structural reviewers (`architecture-reviewer-*`) | Missing assumptions, unjustified scope, missing build-vs-buy attestation (PDR-031), plan-body framing risks |
| **Mid-cycle** | At major inflection points within execution (phase boundaries, surface introductions, risk thresholds reached, accumulated friction) | The domain-specialist for the current phase; `assumptions-reviewer` if friction-ratchet has fired | Framing-outlives-the-plan failures, drift between plan body and execution, missed mid-execution simplification opportunities |
| **Close** | On the landed change, before the close summary | Multi-layer dispatch per §Route by abstraction layer (domain semantics, docs/ADR mesh, code/file polish, architectural boundary) | Cumulative quality issues, Practice-fit, doc-mesh integrity, missed amendments to durable surfaces |

Each phase has its own dispatch decision; missing a phase is a
dispatch-discipline failure for non-trivial work. Trivial work
may compress into the design-intent + implementation two-stage
shape; the three-phase shape is required when any of: the change
crosses a workspace boundary; the change introduces a new
durable surface (rule, PDR, ADR, principle); the change is a
multi-session thread landing.

The plan-time phase is the cheapest moment to catch
mistakes-of-framing; the mid-cycle phase is the cheapest moment
to catch framing-drift; the close phase is the cheapest moment
to catch doc-mesh and Practice-fit issues. None of the three
phases substitutes for the others.

### Friction-ratchet trigger (2026-04-21 amendment)

When **three or more distinct friction signals accumulate on a
single topic within a session**, the agent MUST escalate to
`assumptions-reviewer` for a **solution-class review** of the
topic, rather than continuing to apply local fixes.

A **friction signal** on a topic is any of:

- A pre-commit, pre-push, or CI hook failure caused by work on
  the topic.
- A reviewer (sub-agent or owner) rejection of work on the topic.
- An owner correction redirecting work on the topic.
- A quality-gate breach (lint, type-check, test, fitness)
  attributable to the topic.
- A retracted plan-body section on the topic.
- A reviewer-flagged missing-evidence finding on the topic.

The **third** distinct signal is the trigger: at that point the
local-fix lens has demonstrably failed, and the question is no
longer "how do I fix this signal" but "is the assumption set
underlying my approach to this topic wrong." `assumptions-reviewer`
returns a solution-class assessment; the agent then either
re-frames the topic per the reviewer's findings or surfaces the
disagreement to the owner.

Counter scope: per topic, per session. The counter resets at
session boundary; cross-session friction accumulation is captured
separately via the `repo-continuity.md` Due/Pending register.
Counter granularity: signals on logically the same topic count
together (e.g. three lint failures on the same surface = three
signals; three failures on three independent surfaces = one each
on three topics).

The trigger is not a soft suggestion; the third signal **is** the
escalation. Continuing to apply local fixes past the third signal
is a dispatch-discipline failure.

### Assumption-challenge gate before absorbing adversarial-review findings (2026-04-25 amendment)

When an **adversarial-class reviewer** (Wilma family,
`assumptions-reviewer`, or any reviewer whose lens is *"what is
wrong with this design"* rather than *"how can this design be
improved"*) surfaces **BLOCKING findings** on a plan body or
design, the agent MUST run an **assumption-challenge gate**
before mechanically absorbing each finding as a binding work
item.

The gate has two steps:

1. **Re-state the central claim of the design in one sentence.**
   The claim is the load-bearing assertion the design exists to
   prove or to enable.
2. **Dispatch an owner-led discussion**: do the BLOCKING
   findings hold against the central claim as stated, or do they
   hold only against a different framing the reviewer assumed?
   If the latter, the design needs a reframe, not a finding-by-
   finding absorption.

Three outcomes:

- **Findings hold under the claim** — absorb them as binding
  work items per the existing reviewer-finding-routing
  discipline (PDR-012); the design's central claim is sound and
  the findings represent genuine gaps.
- **Findings hold only under a different framing** — reframe
  the design and discard the findings whose force was
  framing-dependent; the reframe is the absorption.
- **Discussion does not converge** — escalate to owner via the
  named owner-question channel (`AskUserQuestion`); the owner
  is the final tiebreaker on which framing the design should
  carry.

The gate fires per adversarial-class review, not per finding.
Friendly-class reviewers (`docs-adr-reviewer`,
`code-reviewer`, etc.) whose lens is improvement-not-rejection
do not require the gate; their findings absorb directly.

Why the gate exists: adversarial reviews surface findings that
are *correct against an assumed frame* but where the assumed
frame is contestable. Mechanically absorbing every BLOCKING
finding can produce a hardened version of a design whose central
claim was wrong — *the-frame-was-the-fix* pattern, in PDR-015's
territory rather than at design-time. The gate names the
reviewer-discipline statement of the same principle that PDR-029
v2 names mechanism-side: the Practice prefers reframing to
mechanical hardening when the underlying claim may be wrong.

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
- Non-trivial work receives reviewers at all three lifecycle
  phases (plan-time, mid-cycle, close) per §Reviewer phases
  aligned to lifecycle.
- Three accumulated friction signals on a single topic in a
  session escalate to `assumptions-reviewer` for solution-class
  review per §Friction-ratchet trigger.

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
- Skipping the mid-cycle phase on non-trivial work; the
  characteristic finding (framing-outlives-the-plan) is missed.
- Continuing to apply local fixes past the third friction signal
  on a single topic without escalating to `assumptions-reviewer`.

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
