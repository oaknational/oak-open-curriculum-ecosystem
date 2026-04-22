---
name: "Architectural Documentation Excellence Synthesis"
overview: >
  Multi-part report, gap analysis, and improvement plan synthesising the
  repository's internal documentation architecture against external research
  on long-term architectural excellence (FOSA, cloud well-architected
  frameworks, Team Topologies, SRE, evolutionary architecture). Identifies
  what we do well, what the research reveals as gaps, and proposes concrete
  improvements that can be promoted to executable plans.
todos:
  - id: quality-attribute-register
    content: "Create an explicit quality attribute register with ranked priorities and measurable targets"
    status: pending
  - id: fitness-function-framing
    content: "Re-frame existing quality gates as architectural fitness functions with ADR"
    status: pending
  - id: trade-off-framework
    content: "Add trade-off navigation guidance to principles.md for quality attribute tensions"
    status: pending
  - id: operability-practice
    content: "Create operability practice document consolidating SLO, observability, and reliability guidance"
    status: pending
  - id: visual-architecture
    content: "Add C4 context and container diagrams to docs/architecture/"
    status: pending
  - id: eslint-boundary-enhancement
    content: "Evaluate import-x patterns from reference doc against existing oak-eslint rules"
    status: pending
  - id: practice-core-integration
    content: "Integrate applicable research concepts into Practice Core for cross-repo propagation"
    status: pending
  - id: documentation-deduplication
    content: "Resolve identified duplication between principles.md, AGENT.md, and governance docs"
    status: pending
---

# Architectural Documentation Excellence Synthesis

**Created**: 2026-04-10
**Status**: Current — all items queued for execution
**Scope**: Documentation architecture, architectural principles, and governance
**Requested by**: Jim (multi-part report, analysis, and improvement plan)

---

## Part 1: Internal Documentation Review

### What We Have

The repository contains **247+ documents** across a deliberate multi-layer
architecture:

| Layer | Location | Count | Role |
|-------|----------|-------|------|
| Foundation directives | `.agent/directives/` | 7 | Authoritative principles and operational context |
| Enforcement rules | `.agent/rules/` | 25 | Specific enforcement requirements |
| Practice Core | `.agent/practice-core/` | 8 | Portable framework for cross-repo propagation |
| Governance docs | `docs/governance/` | 11 | Elaborated practice documents |
| ADRs | `docs/architecture/architectural-decisions/` | 157 | Architectural source of truth |
| Architecture guides | `docs/architecture/` | 6 | Pattern and structure explanations |
| Foundation/strategy | `docs/foundation/` | 5 | Vision, onboarding, strategic overview |
| Engineering | `docs/engineering/` | 7+ | Build system, CI, testing, release |
| Operations | `docs/operations/` | 4 | Runtime support and debugging |
| Domain | `docs/domain/` | 2 | Curriculum structure and data variances |

### Strengths

**1. ADR-driven governance is exceptional.** 157 ADRs spanning 2+ years of
architectural evolution. The research literature (Nygard, UK GDS guidance,
FOSA) recommends ADRs as the primary governance mechanism — this repo has
adopted that more thoroughly than most enterprise codebases.

**2. Fitness functions exist, even if not labelled as such.** The quality gate
taxonomy (9 layers from formatting through specialist review to accessibility
audit) is effectively a comprehensive architectural fitness function system:

- ESLint custom rules (`@oaknational/eslint-plugin-standards`) enforce
  workspace boundaries, layer direction, and file-count limits
- `knip` catches dead code and unused exports
- `dependency-cruiser` catches circular dependencies and layer violations
- Type-checking enforces compile-time contracts
- Specialist sub-agent reviewers audit architectural compliance
- Playwright + axe-core enforces accessibility as a blocking gate

This is more comprehensive than most implementations of "fitness
function-driven development" described in the research.

**3. Schema-first as Cardinal Rule is stronger than "contract-first."** The
research discusses contract-first and API-first approaches; this repo's Cardinal
Rule goes further — a single OpenAPI schema is the single source of truth for
ALL types, with code generation as the enforcement mechanism. This is a genuine
innovation that the research doesn't fully capture.

**4. Type safety discipline exceeds industry practice.** The prohibition of type
assertions (`as`, `any`, `!`), the "unknown is type destruction" principle, and
the requirement for compile-time type flow from schema to consumer — this goes
well beyond what FOSA or the cloud frameworks discuss.

**5. The Practice Core propagation model is genuinely novel.** The "plasmid
exchange" metaphor for cross-repo practice propagation has no direct analogue in
the research literature. It's a form of evolutionary architecture applied to
governance itself.

**6. Self-reinforcing documentation system.** Rules, principles, reviewers,
quality gates, and documentation all reinforce each other. This creates a
feedback loop that the research identifies as essential but rarely sees
implemented this thoroughly.

### Weaknesses and Improvement Opportunities

**W1. Content duplication across layers.**

`principles.md` (the authoritative source) and `AGENT.md` duplicate several
concepts — the Cardinal Rule appears in both, quality gate listings appear in
both, and the architectural model is restated. `development-practice.md` in
governance also restates design principles and error handling rules that are
authoritative in `principles.md`.

*Impact*: When principles evolve, multiple documents must be updated. Drift
between copies creates confusion about which version is authoritative.

*Recommendation*: `AGENT.md` should reference principles, not restate them.
`development-practice.md` should link to the authoritative sections rather than
maintaining parallel lists. The principle of "facts are authoritative in one
document" (from ADR-117) should be applied to the documentation itself.

**W2. The boundary between directives, governance docs, and rules is fuzzy.**

- `principles.md` (directive) contains testing rules that overlap with
  `testing-strategy.md` (also a directive)
- `development-practice.md` (governance) restates principles from
  `principles.md` (directive)
- Some rules in `.agent/rules/` are essentially extracts from `principles.md`
  (e.g., `no-type-shortcuts.md` restates §Compiler Time Types)

The three-layer model (directives → rules → platform adapters) is clear in
theory but the content boundaries leak in practice.

*Recommendation*: Define a clear content contract:

- **Directives**: the "what and why" (principles, strategy, vision)
- **Rules**: the "when to enforce" (triggering conditions for specific checks)
- **Governance docs**: the "how in depth" (elaborated patterns, examples, and
  tooling guidance that would bloat directives)

Any content that appears in two layers should exist in exactly one and be
referenced by the other.

**W3. Navigation scales poorly at 157 ADRs.**

The ADR index provides a flat list. Finding "all ADRs related to search
architecture" or "all ADRs about type safety" requires reading the list
sequentially. The research (ISO 42010) recommends organising architecture
descriptions by stakeholder concerns and viewpoints.

*Recommendation*: Add a categorised ADR index (by domain: search, auth, SDK,
tooling, testing, UI, agents) alongside the chronological list. This already
exists informally in the earlier session's inventory — it should be formalised.

**W4. No explicit quality attribute taxonomy.**

The research (FOSA, ISO 25010, cloud well-architected frameworks) strongly
emphasises making quality attributes explicit, ranked, and measurable.
The principles are presented as absolutes ("NEVER", "ALWAYS", "MUST") — which
provides clarity — but there is no document that answers: "What are the top
quality attributes of this system, and how do we measure them?"

The implicit quality attributes (derivable from the principles) are:

1. **Type safety / correctness** — enforced via type-check, schema-first,
   no-type-shortcuts
2. **Evolvability** — enforced via modularity, TDD, no compatibility layers
3. **Testability** — enforced via TDD, DI, pure functions
4. **Maintainability** — enforced via documentation, DRY, KISS, no dead code
5. **Security** — enforced via PII scrubbing, secret scanning, input validation
6. **Accessibility** — enforced via WCAG 2.2 AA, Playwright + axe-core

But these are implicit. Making them explicit would connect the principles to
their purpose and help navigate trade-offs when they conflict.

*Recommendation*: Create a quality attribute register (see Part 3).

**W5. Trade-off guidance is limited.**

The principles are absolute: "NEVER use type assertions", "ALWAYS use TDD",
"NEVER create compatibility layers." The research's strongest theme is that
"architecture is trade-offs" — when two valid principles conflict, which wins?

The First Question ("could it be simpler?") is the closest thing to a trade-off
framework, but it doesn't address quality-attribute-vs-quality-attribute
tensions (e.g., "this makes it more testable but less simple" or "this improves
type safety but increases ceremony").

*Note*: The absolute stance is arguably correct for this repo's context — a
small team (one human + AI agents) where consistency matters more than
flexibility. But acknowledging the trade-off dimension would strengthen the
architectural reasoning. See the assumptions reviewer analysis below.

**W6. Operability guidance is fragmented.**

Operational concerns are spread across:

- `docs/operations/production-debugging-runbook.md`
- `docs/operations/environment-variables.md`
- `docs/governance/logging-guidance.md`
- The Sentry guidance (archived)
- The observability future plan
- ADR-051 (OpenTelemetry-compliant logging)

There is no unified "operability practice" document that frames reliability,
observability, and operational excellence as architectural qualities. The
research (SRE, cloud well-architected frameworks) treats operability as a
first-class architectural concern, not a post-deployment afterthought.

*Recommendation*: Create an operability practice document (see Part 3).
Reference and build on the existing observability future plan.

**W7. No visual architecture communication.**

The repo relies entirely on text for architecture communication. The research
(C4, ISO 42010) strongly recommends visual diagrams for system context,
container relationships, and component boundaries.

*Note*: The primary audience for this documentation is AI agents, who can parse
text efficiently. But C4 diagrams (especially Mermaid-based) are equally
parseable by both AI agents and human contributors, and they provide a
"one-glance" overview that text cannot match.

*Recommendation*: Add C4 context and container diagrams in Mermaid format to
`docs/architecture/README.md`.

---

## Part 2: External Research Analysis and Applicability

### The Research Corpus

Three reference documents at `.agent/research/notes/architecture/`
(relocated 2026-04-22 from `.agent/reference/architecture/` during
the reference-tier reformation per
[PDR-032](../../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md);
substance unchanged, awaiting per-file disposition under the
[rehoming plan](../../agentic-engineering-enhancements/future/reference-research-notes-rehoming.plan.md)):

1. **"Modern software architecture for long-term excellence"** — A portfolio
   synthesis across FOSA, Team Topologies, SRE, DORA, cloud well-architected
   frameworks, ISO 42010, C4, ADRs, OpenTelemetry, CloudEvents, AsyncAPI,
   NIST CSF, OWASP, and more. The most comprehensive source.

2. **"Fundamentals of Software Architecture (Richards & Ford)"** — Detailed
   extraction of FOSA's decision framework: characteristics → styles →
   decisions → governance → operations → iterate.

3. **"Boundary enforcement with ESLint"** — Practical patterns for enforcing
   bounded contexts with `eslint-plugin-import-x`.

### Key Research Themes and How They Map to This Repo

#### Theme 1: Quality attributes are first-class requirements

**Research says**: Cloud frameworks organise around non-functional "pillars."
ISO 25010 provides a quality model. FOSA treats "architectural characteristics"
as the primary architecture driver.

**This repo**: Quality attributes are implicit in the principles but not
explicitly named, ranked, or measured. The principles are rules ("NEVER",
"ALWAYS") rather than quality targets ("we value X because Y, measured by Z").

**Applicability**: HIGH. Creating an explicit quality attribute register would
connect the existing principles to their purpose without changing any rules.

#### Theme 2: Architecture is trade-offs

**Research says**: FOSA's core premise. "Least worst architecture" means
choosing the best trade-off set, then evolving. Cloud frameworks exist as
"trade-off prompts, not architecture templates."

**This repo**: Principles are absolutes. The ADR process (alternatives,
consequences) embeds some trade-off thinking, and the First Question provides a
simplicity check. But there's no explicit framework for navigating tensions
between quality attributes.

**Applicability**: MEDIUM. The absolute stance works well for this repo's
context (consistency for AI agents). But a "tension navigation" section in
`principles.md` would acknowledge that the First Question IS a trade-off
mechanism, and provide guidance for the rare cases where principles conflict.

#### Theme 3: Socio-technical alignment (Conway's Law, Team Topologies)

**Research says**: System boundaries and team boundaries co-determine each
other. Architecture should align to team cognitive load.

**This repo**: The "team" is one human + multiple AI agents. This is a novel
socio-technical arrangement. The specialist reviewer system (17 existing + 9
planned agents) is effectively a "team topology" — stream-aligned work by
the primary agent, with enabling/specialist capabilities provided by reviewers.

**Applicability**: LOW-MEDIUM for the Team Topologies framework directly, but
HIGH for acknowledging the novel socio-technical model. The repo's agentic
engineering practice (ADR-119) IS the socio-technical architecture, but it's
not framed in those terms.

#### Theme 4: Operability and reliability as architectural qualities

**Research says**: SRE makes reliability governable via SLOs and error budgets.
"You cannot have long-term excellence without measurable reliability." Google
SRE turns reliability into governance rather than aspiration.

**This repo**: The MCP servers are deployed services, so operability matters.
But there are no SLOs, no error budgets, no explicit reliability targets.
Operability guidance is fragmented (see W6 above).

**Applicability**: MEDIUM. Full SRE adoption would be disproportionate for the
current scale, but codifying the operability intent — what we consider
acceptable, what we monitor, what triggers investigation — would strengthen the
architecture as the system approaches public beta.

#### Theme 5: Fitness functions and evolutionary architecture

**Research says**: Automated, repeatable checks that evaluate whether the system
remains within desired architectural bounds. "One of the clearest bridges from
architecture ideals to everyday engineering practice."

**This repo**: ALREADY DOING THIS — comprehensively. The 9-layer quality gate
taxonomy, custom ESLint rules encoding ADRs, specialist sub-agent reviews, and
the fitness model for documentation (ADR-144) are all fitness functions. But
they're not framed in that vocabulary.

**Applicability**: HIGH for framing (not tooling). Re-labelling the quality
gates as "architectural fitness functions" would:

- Connect the existing practice to the research vocabulary
- Make it easier to explain to external contributors what the gates protect
- Provide a framework for evaluating new gates ("which quality attribute does
  this fitness function protect?")

#### Theme 6: Architecture is communication (ISO 42010, C4, ADRs)

**Research says**: Adopt ISO 42010 as the conceptual framework (stakeholders +
concerns + viewpoints), then implement with C4 diagrams + ADRs.

**This repo**: ADRs are exceptional. C4 diagrams are absent. The governance
README provides a reading path. The architecture README provides a start-here
guide. But there's no visual system context diagram.

**Applicability**: MEDIUM. C4 context and container diagrams in Mermaid format
would add significant value for onboarding and architecture reviews, with
minimal maintenance cost.

#### Theme 7: Security as risk management across a supply chain

**Research says**: NIST CSF 2.0 frames security as outcome-oriented risk
management. SSDF provides secure SDLC practices. SLSA focuses on supply chain
integrity.

**This repo**: Safety and security doc covers PII, API keys, and core
principles. Secret scanning is a blocking quality gate (ADR-111). But
security is framed as policy, not as an architectural quality with continuous
governance.

**Applicability**: LOW-MEDIUM. The current security posture is proportionate for
the system's risk profile (read-only MCP servers, no PII storage). But framing
security as an architectural quality attribute in the register would ensure it's
considered in all architectural decisions.

#### Theme 8: Boundary enforcement with ESLint

**Research says**: Use `eslint-plugin-import-x` for bounded context isolation,
upward import prevention, public-API-only exposure, and cycle detection.

**This repo**: Already has custom ESLint rules in `@oaknational/eslint-plugin-standards`
enforcing workspace boundaries and layer direction. The reference doc provides
specific `import-x` patterns that may complement or replace some custom rules.

**Applicability**: MEDIUM. Worth evaluating whether `import-x` patterns could
strengthen or simplify the existing boundary enforcement. This connects to the
quality-gate-hardening future plan.

### What the Research Doesn't Cover (Our Innovations)

The research has blind spots where this repo is ahead:

1. **Agentic engineering as architectural practice** — The Practice Core, the
   specialist reviewer system, the three-layer rule model, and the plasmid
   exchange mechanism have no direct analogues in the research literature.

2. **Schema-first as absolute principle** — The Cardinal Rule is more rigorous
   than any "contract-first" approach in the research.

3. **Type destruction as a named anti-pattern** — "unknown is type destruction"
   goes beyond the research's treatment of type safety.

4. **Self-reinforcing governance** — The feedback loop between principles, rules,
   reviewers, and quality gates is more tightly integrated than anything
   described in the research.

5. **Documentation as foundational infrastructure** — ADR-127 treats
   documentation with the same rigour as code. The research recommends this
   but doesn't show implementations this thorough.

These innovations should be preserved and, where appropriate, propagated
through the Practice Core.

---

## Part 3: Synthesis and Improvement Plan

### Design Principle

The goal is not to adopt the research wholesale — it's to take the best of our
existing practice and the best of the research, and synthesise them into
something better. Where we're already ahead of the research, we preserve that.
Where the research reveals genuine gaps, we fill them.

Architectural excellence is a primary goal of this repository. All genuine
improvements to architecture, documentation, and governance are worth pursuing
— not because they are proportionate to current scale, but because this repo
aims to demonstrate what architectural excellence looks like. All documentation
serves both humans and AI agents equally.

### Improvement Items

All items are in `current/` — ready for execution when capacity allows.
Sequencing reflects dependencies, not priority: architectural excellence
demands all of these.

#### I1. Quality Attribute Register

**What**: Create `docs/architecture/quality-attribute-register.md` that
explicitly names, ranks, and connects quality attributes to their enforcement
mechanisms.

**Why**: The research's strongest convergence point. Makes implicit principles
explicit. Connects "what we enforce" to "why we enforce it." Provides a
framework for evaluating new quality gates and architectural decisions.

**Sketch**:

```markdown
| Quality Attribute | Rank | Enforcement Mechanisms | Measured By |
|-------------------|------|------------------------|-------------|
| Type safety / correctness | 1 | type-check, schema-first, no-type-shortcuts | Zero type errors, zero `as` assertions |
| Evolvability | 2 | TDD, modularity, no compat layers, ADRs | Change lead time, gate pass rate |
| Testability | 3 | TDD, DI, pure functions, test taxonomy | Test coverage, mutation score |
| Maintainability | 4 | Documentation, KISS, no dead code, knip | Doc coverage, unused export count |
| Accessibility | 5 | WCAG 2.2 AA, Playwright + axe-core | Zero a11y violations (both themes) |
| Security | 6 | PII scrubbing, secret scanning, input validation | Zero secret leaks, zero PII exposure |
| Operability | 7 | Structured logging, Sentry, error cause chains | (pending: SLO targets) |
```

**Sequencing**: Immediate — no dependencies. Foundation for I3, I7, I8.

#### I2. Fitness Function Framing

**What**: Write an ADR that re-frames the existing quality gates as
"architectural fitness functions" using the vocabulary from evolutionary
architecture (Thoughtworks, FOSA).

**Why**: Connects our existing (excellent) practice to the research vocabulary.
Makes it easier to explain what the gates protect and to evaluate new gates.

**Content**: Map each quality gate layer to the quality attribute it protects.
Reference the quality attribute register. Explain the principle: "every
architectural characteristic we value must have at least one automated fitness
function that prevents drift."

**Sequencing**: Immediate — no dependencies. Parallel with I1.

#### I3. Documentation Deduplication

**What**: Apply ADR-117's "facts authoritative in one document" principle to
the documentation itself. Remove restated content from `AGENT.md` and
`development-practice.md`, replacing with references to `principles.md`.

**Why**: Reduces maintenance surface and eliminates drift risk.

**Scope**:

- `AGENT.md` §Cardinal Rule → reference to `principles.md`
- `AGENT.md` §Development Commands → already correct (single source)
- `development-practice.md` §Design Principles → reference to `principles.md`
- `development-practice.md` §Error Handling → reference to `principles.md`

**Sequencing**: After I1 (quality attribute register provides the "why" context
that makes references meaningful).

#### I4. ADR Index Categorisation

**What**: Add a categorised view to the ADR index, grouping ADRs by domain
concern (search, SDK/codegen, auth, tooling/build, testing, UI/design, agents,
operations). Also add a one-line note explaining intentionally skipped ADR
numbers (039, 090 were never assigned; 020, 021, 023 are archived).

**Why**: Navigation at 152 ADRs requires structure beyond chronological listing.
ISO 42010 recommends organising by stakeholder concerns. The docs-adr-reviewer
confirmed the skipped-number note would prevent contributors from assuming a
file was lost.

**Sequencing**: Immediate — no dependencies. Parallel with I1, I2.

#### I5. C4 Architecture Diagrams

**What**: Add Mermaid-format C4 context and container diagrams to
`docs/architecture/README.md`.

**Why**: Visual architecture communication serves both human developers and AI
agents. The research (ISO 42010, C4 model, FOSA) consistently identifies visual
diagrams as essential for architecture communication. The Onboarding principle
explicitly requires clear paths for both developers and agents. C4 diagrams
provide the "one-glance" system overview that text alone cannot match.

**Scope**:

- C4 Level 1 (Context): Oak MCP ecosystem, external systems (Oak API,
  Elasticsearch, Clerk, AI hosts)
- C4 Level 2 (Container): Apps, SDKs, core packages, design tokens, with
  dependency direction arrows

**Sequencing**: Immediate — no dependencies. Can execute in parallel with I1/I2.

#### I6. Operability Practice

**What**: Create `docs/governance/operability-practice.md` consolidating
operational reliability guidance. Reference the existing observability future
plan and production debugging runbook.

**Why**: Operability guidance is currently fragmented across 5+ documents.
The research (SRE, cloud well-architected frameworks) treats operability as a
first-class architectural quality. Architectural excellence requires making
operability explicit — what we monitor, what triggers investigation, what
constitutes acceptable operation — even before full SLO/error budget adoption.

**Content**: Define operability for this system. Connect to the quality
attribute register. Consolidate the fragmented guidance into a single
governance document.

**Sequencing**: After I1 (needs quality attribute register to reference).
Can begin independently of the Sentry/OTel foundation work — the practice
document defines the intent; the tooling delivers the mechanisms.

#### I7. Trade-off Navigation Guidance

**What**: Add a short "Navigating Tensions" section to `principles.md` that
acknowledges the First Question as a trade-off mechanism and provides guidance
for when principles appear to conflict.

**Context**: Trade-off thinking is already embedded — 149/152 ADRs contain
Alternatives/Consequences sections, and the First Question is itself a
trade-off prompt. This item makes the implicit explicit: connecting the
existing trade-off practice to the quality attribute register so agents and
developers have a clear resolution path.

**Content**: "The principles are intentionally absolute. When two principles
appear to conflict, apply the First Question — the simpler solution that
preserves both is usually correct. When genuine tension exists, the quality
attribute register provides the priority ordering. Document the trade-off in
an ADR."

**Sequencing**: After I1 (needs the quality attribute register to reference).

#### I8. Practice Core Integration

**What**: Identify which synthesis concepts should propagate to other repos
through the Practice Core.

**Candidates for propagation**:

- Quality attribute register template
- Fitness function framing (quality gates as fitness functions)
- Document layer content contract (directives vs rules vs governance)
- The explicit acknowledgment of agentic socio-technical architecture

**Sequencing**: After I1, I2, I7, and I9a are complete and validated.

#### I9a. Document Layer Content Contract

**What**: Add a short statement to `docs/governance/README.md` or
`.agent/practice-index.md` that defines the content contract between layers:

- **Directives**: prescriptive — what agents must do
- **Rules**: enforcement triggers — when to check
- **Governance docs**: descriptive-elaborative — how to do it well, with
  examples, edge cases, and tooling guidance

**Why**: Barney identified that this distinction is real and useful but never
stated. Stating it prevents future authors from putting prescriptive rules
into governance docs (which causes the drift problem identified in W1).

**Sequencing**: Immediate — no dependencies.

#### I9b. Boundary Enforcement Evaluation

**What**: Evaluate `eslint-plugin-import-x` patterns from the reference doc
against existing `@oaknational/eslint-plugin-standards` rules. Determine
whether `import-x` could strengthen or simplify boundary enforcement.

**Why**: The reference doc provides specific patterns (zone-based context
isolation, upward import prevention, public-API-only exposure) that may
complement the existing custom rules.

**Sequencing**: Coordinates with the quality-gate-hardening plan's ESLint config
standardisation phase.

---

## Specialist Reviewer Findings

### Architecture Reviewer (Barney) — Simplification Analysis

**Status**: ISSUES FOUND

Key findings:

1. **Dependency direction is clean.** Rules → principles, governance → directives,
   platform adapters → rules. The arrow never reverses. This is correct
   architecture.
2. **Controlled duplication between principles.md and governance docs (WARNING).**
   `development-practice.md` restates principles in diluted form — different words
   for the same concepts — which is worse than copy-paste because drift is silent.
   `typescript-practice.md` handles this correctly: delegates to rules, adds only
   unique elaboration. The recommendation: refactor `development-practice.md` to
   follow the `typescript-practice.md` pattern.
3. **Navigation is adequate.** From AGENT.md, agents reach principles in 1 hop,
   governance in 1 hop. The practice-core chain is 4 hops to reach propagation,
   which is acceptable for a rare operation.
4. **Rules layer is appropriately thin.** The 25 rules are mostly 2-3 line
   pointers — correct single-responsibility enforcement files.

*Verdict*: The structure is sound. The primary action item is deduplication of
`development-practice.md` following the `typescript-practice.md` model. This
validates improvement item I3.

### Assumptions Reviewer — Gap Validation

**Status**: CONCERNS IDENTIFIED — several gap claims were challenged

| Assumption | Reviewer rating | Owner correction |
|-----------|--------|--------|
| Lacks quality attribute taxonomy | Partially valid | **Confirmed genuine.** A lightweight priority ordering is the right form. |
| Trade-off thinking is missing | Refuted | **Accepted as context.** Substance is present (149/152 ADRs); adding explicit framing still valuable. |
| Operability is weak | Overstated | **Overruled.** Architectural excellence requires explicit operability regardless of current scale. |
| C4 diagrams are needed | Refuted | **Overruled.** All documentation serves humans AND agents. Human onboarding is an explicit principle. Visual architecture communication is essential. |
| 247+ docs is too many | Refuted | **Accepted.** Documentation volume is justified and appropriate. |

*Owner verdict*: The assumptions reviewer applied proportionality reasoning
that conflicts with the foundational principle "Architectural Excellence Over
Expediency — ALWAYS." Proportionality arguments are noted as context but do
not override the principle. All items proceed at full priority.

### Docs/ADR Reviewer — Documentation Health

**Status**: COMPLIANT (minor improvements noted)

Key findings:

1. **No critical documentation gaps.** Cross-references verified across
   ADRs 153-156, all resolve correctly.
2. **ADR structural consistency is strong.** Recent ADRs follow the template
   precisely (Status, Date, Related, Context, Decision, Consequences). ADR-156
   adds "Alternatives Considered" — consider adding to template as optional.
3. **ADR index count note.** Numbers 039, 090 are absent from the index.
   A one-line note explaining intentionally skipped numbers would prevent
   confusion.
4. **Principles-to-governance alignment is healthy.** No content drift detected
   between `principles.md` and `typescript-practice.md`. The `development-practice.md`
   drift flagged by Barney is confirmed as the primary concern.
5. **Suggested future ADRs** are decisions not yet taken, not missing records
   of decisions already made. This is a correct distinction.

*Verdict*: Documentation health is good. The primary action items are the ADR
index note about skipped numbers and the development-practice deduplication.

---

## Dependencies and Sequencing

```text
IMMEDIATE (no dependencies — can start in parallel):
  I1 (Quality Attribute Register)
  I2 (Fitness Function ADR)
  I4 (ADR Index Categorisation)
  I5 (C4 Architecture Diagrams)
  I9a (Document Layer Content Contract)

AFTER I1:
  I3 (Documentation Deduplication)
  I6 (Operability Practice)
  I7 (Trade-off Navigation Guidance)

AFTER I1 + I2 + I7 + I9a:
  I8 (Practice Core Integration)

COORDINATES WITH EXTERNAL PLAN:
  I9b (Boundary Enforcement) ←── Quality gate hardening ESLint phase
```

## Success Signals (justifying promotion)

- The quality attribute register is referenced in at least 3 ADRs and 2
  reviewer assessments
- Documentation deduplication reduces the maintenance surface by removing
  5+ instances of restated content
- New contributors (human or AI) can navigate from entry point to specific
  ADR in ≤3 hops
- The fitness function ADR is cited when evaluating new quality gates

## Risks and Unknowns

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Quality attribute ranking provokes debate | Medium | Start with the implicit ranking from principles; iterate based on actual trade-off encounters |
| Documentation deduplication breaks cross-references | Low | Run `markdownlint` and link-check after each deduplication pass |
| C4 diagrams become stale | Medium | Mermaid source in version control; add to `pnpm practice:fitness:informational` checks |
| Trade-off guidance weakens the absolute stance | Low | Frame as "navigation" not "exceptions"; the quality attribute register provides the ordering |

## Connections to Existing Plans

- **Observability and quality metrics** (`future/observability-and-quality-metrics.plan.md`)
  — I6 (operability practice) builds on this plan's outputs
- **Quality gate hardening** (`current/quality-gate-hardening.plan.md`)
  — I9b (boundary enforcement) connects to ESLint config standardisation
  — I2 (fitness function framing) provides the conceptual framework for gate evaluation
- **Oak surface isolation** (`future/oak-surface-isolation-and-generic-foundation-programme.plan.md`)
  — C4 diagrams must reflect the planned Oak/generic separation
  — fitness function boundary rules must account for the new structure
- **Workspace topology exploration** (`sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`)
  — C4 container diagram must annotate the four-tier model
  — boundary enforcement evaluation must work in context of tier rules
- **SDK codegen workspace decomposition** (`codegen/future/sdk-codegen-workspace-decomposition.md`)
  — C4 container boundaries for SDK packages may shift

## Non-Goals

- Importing ISO 25010 taxonomy wholesale (a lightweight register is the right form)
- Adopting SRE error budgets as a governance mechanism (define operability intent first)
- Rewriting principles as non-absolute trade-offs (the absolute stance works; add navigation, not exceptions)
- Adding measurement/metrics infrastructure beyond what exists (covered by observability plan)
- Adopting C4 tooling beyond Mermaid (YAGNI — Mermaid in version control is sufficient)
