---
name: "Build-vs-Buy Attestation PDR + ADR-163 §6 Amendment"
overview: >
  Graduate the build-vs-buy doctrine and six metacognition guardrails
  from sentry-observability-maximisation-mcp.plan.md L-7/L-8 into
  durable Practice governance: a new PDR ("Build-vs-Buy Attestation
  as Plan Authoring Discipline") and an ADR-163 §6 amendment from
  CLI-prescription to outcome-statement form.
parent: 2026-04-29-deferred-items-coordination.md
todos:
  - id: pdr-number-assignment
    content: "Confirm next PDR number and rename the file accordingly. Latest PDR is PDR-035; this becomes PDR-036."
    status: pending
  - id: pdr-author-draft
    content: "Author the Build-vs-Buy Attestation PDR body (Decision, Rationale, Consequences, Notes). Include the six guardrails verbatim from L-8 §Self-Test."
    status: pending
  - id: pdr-reviewer-pass
    content: "Dispatch assumptions-reviewer to challenge whether the doctrine is over-fitted to the L-8 context, and docs-adr-reviewer to check coherence with sibling PDRs (PDR-007, PDR-018, PDR-026)."
    status: pending
  - id: adr-163-section-6-rewrite
    content: "Rewrite ADR-163 §6 from the six-step sentry-cli prescription to the outcome statement (\"the Sentry UI MUST reflect (a) a release keyed by the per-environment release identifier, (b) the build commit attached to that release, (c) a deploy event recorded under the appropriate environment\"). Existing prescription stays in §History as historical block."
    status: pending
  - id: adr-163-history-entry
    content: "Add ADR-163 §History 2026-04-XX entry recording the WHAT-not-HOW reframing rationale."
    status: pending
  - id: source-plan-cite-back
    content: "Update sentry-observability-maximisation-mcp.plan.md L-7 frontmatter note + L-8 §Design Principles + L-8 §Self-Test to cite the new PDR and ADR amendment instead of restating the doctrine."
    status: pending
  - id: pending-graduations-flip
    content: "Flip the Pending-Graduations Register entry from `pending` to `graduated 2026-04-XX to PDR-036 + ADR-163 amendment`."
    status: pending
isProject: false
---

# Build-vs-Buy Attestation PDR + ADR-163 §6 Amendment

**Parent**:
[`2026-04-29-deferred-items-coordination.md`](2026-04-29-deferred-items-coordination.md).
**Created**: 2026-04-29 (deferred from 2026-04-29 deeper convergence
pass).
**Status**: QUEUED — owner direction required to execute (PDR creation
in Practice Core needs explicit approval per PDR-003).

## Context

The 2026-04-29 displaced-doctrine sub-agent report identified that
`sentry-observability-maximisation-mcp.plan.md` carries durable
plan-authoring doctrine inside L-7 / L-8 frontmatter and body that
has graduated beyond the plan's specific scope:

- **Build-vs-Buy Attestation rule**: every plan that proposes a
  bespoke implementation of a vendor-supplied capability MUST
  contain a Build-vs-Buy Attestation section before ExitPlanMode,
  surveying first-party vendor integrations with non-sunk-cost
  rationales.
- **Six metacognition guardrails** (per the L-8 self-test): build-vs-
  buy attestation; reviewer scheduling phase-aligned (assumptions-
  reviewer pre-ExitPlanMode); friction-ratchet counter (3+ friction
  signals = solution-class re-review); sunk-cost phrase detector
  ("already working", "we own the script"); ADRs state WHAT not HOW;
  solution-class challenge at dispatch frame.
- **WHAT-not-HOW principle for ADRs**: the case in point is ADR-163
  §6, which currently prescribes a six-step `sentry-cli` invocation
  sequence (HOW). The doctrine says the ADR should state the outcome
  the vendor must reach (WHAT) and let the vendor's first-party
  bundler plugin live in code.

Owner-flagged supporting context: the user-memory feedback entry
`feedback_build_vs_buy_first.md` already names this as a recurring
lesson; this plan codifies it as portable Practice governance.

## Decision shape

This plan creates **PDR-036** (next available number; verify before
authoring) and **amends ADR-163 §6**. Both lands in one session;
the source plan cites the new homes and stops restating the doctrine.

## Phases

### Phase 0 — PDR number + reviewer briefing

1. Verify next available PDR number (latest is PDR-035 per the index
   at `.agent/practice-core/decision-records/README.md`). Reserve
   `PDR-036` as the working number.
2. Read sibling PDRs that this one extends or sits beside: PDR-007
   (PDR / pattern Core contract), PDR-018 (planning discipline),
   PDR-019 (ADR scope by reusability), PDR-026 (per-session landing
   commitment), PDR-029 (perturbation mechanism bundle).
3. Brief assumptions-reviewer with the proposed PDR scope: "is the
   build-vs-buy doctrine over-fitted to the Sentry-plugin context,
   or genuinely portable across vendors?"

### Phase 1 — Author PDR-036

Required sections (per the PDR template at
`.agent/practice-core/practice-bootstrap.md` §PDR Template):

- **Status**: Proposed → Accepted (after reviewer pass).
- **Date**: 2026-04-XX.
- **Related**: PDR-007, PDR-018, PDR-019, PDR-026.
- **Context**: the "we already have one" instinct that produces
  bespoke duplication of vendor first-party integrations; the
  Sentry-plugin migration as the canonical case (commits 4bccba71
  - the L-8 self-test); user-memory feedback corroboration.
- **Decision**: every plan proposing bespoke implementation of a
  vendor-supplied capability MUST contain a Build-vs-Buy Attestation
  section before ExitPlanMode. Six guardrails enumerated.
- **Rationale**: cost of bespoke (maintenance + vendor-evolution
  drift + reviewer prosthetic) vs cost of vendor adoption (config
  - version pinning + adapter thinness). Empirical evidence from
  L-8 self-test.
- **Consequences**: Required (the six guardrails); Forbidden (sunk-
  cost framings; HOW-prescriptive ADRs); Accepted cost (one extra
  ExitPlanMode section per qualifying plan).
- **Notes**: Self-reference (this PDR is itself an example of
  graduating doctrine from a plan body); host-local context
  (Sentry as the canonical vendor case in this repo).

### Phase 2 — Amend ADR-163 §6

Current §6 lists six `sentry-cli` invocations as the canonical
release-and-deploy outcome. Rewrite to:

> For each successful production or preview build, the Sentry UI
> MUST reflect (a) a release keyed by the per-environment release
> identifier, (b) the build commit attached to that release, (c) a
> deploy event recorded under the appropriate environment. The
> mechanism is the vendor's first-party bundler plugin
> (`@sentry/esbuild-plugin`) registered in the MCP app's
> `esbuild.config.ts`.

Move the previous six-step prescription verbatim into a new
§History block titled "Pre-2026-04-XX prescription (HOW-form)" with
a one-paragraph rationale for the WHAT-form reframing (cite PDR-036
guardrail #5).

Add §History entry:

> 2026-04-XX — §6 amended from CLI-invocation prescription (HOW) to
> outcome statement (WHAT). Rationale: the L-8 lane existed to
> resolve exactly this calcification; ADR prescriptions of mechanism
> ossify when the vendor's first-party tooling evolves. Codified in
> PDR-036 §"ADRs state WHAT, not HOW" guardrail.

### Phase 3 — Source plan cite-back

Update `sentry-observability-maximisation-mcp.plan.md`:

- L-7 frontmatter `note` field: replace the doctrine paragraph with
  "Bespoke orchestrator superseded by L-8 (@sentry/esbuild-plugin
  migration). Doctrine homed at PDR-036 (Build-vs-Buy Attestation)
  and ADR-163 §6 (amended 2026-04-XX). Bespoke commits remain in
  git history as the lesson signal."
- L-8 §Design Principles: replace the five-principle prose with a
  two-paragraph cite-back (canonical doctrine at PDR-036 + ADR-163;
  lane-scoped specifics retained: raw esbuild for this app only;
  retained policy modules; bespoke orchestrator deletion is total).
- L-8 §Self-Test: replace with one-paragraph cross-reference to
  PDR-036 (the self-test substance is now the PDR's six guardrails).

### Phase 4 — Pending-Graduations Register flip

Update `repo-continuity § Pending-Graduations Register` entry dated
2026-04-29 ("sentry-observability-maximisation-mcp.plan.md displaced
doctrine"): change `status: pending` to
`status: graduated 2026-04-XX to PDR-036 + ADR-163 §6 amendment`.

## Acceptance Criteria

- [ ] PDR-036 file exists at
      `.agent/practice-core/decision-records/PDR-036-build-vs-buy-attestation-as-plan-authoring-discipline.md`.
- [ ] PDR-036 has Status: Accepted (after reviewer pass).
- [ ] ADR-163 §6 prose is outcome-statement form; previous
      prescription preserved in §History block.
- [ ] ADR-163 §History carries the WHAT-not-HOW reframing entry.
- [ ] Source plan L-7 / L-8 cite the new homes; doctrine prose
      removed from those sections.
- [ ] Pending-Graduations Register entry flipped.
- [ ] All gates green (markdownlint, format, type-check, lint).

## Reviewers

- `assumptions-reviewer` — challenge whether the build-vs-buy
  doctrine is portable or over-fitted (PRE-execution in this plan;
  matches PDR-015 reviewer-phasing amendment 2026-04-29).
- `docs-adr-reviewer` — verify PDR-036 + ADR-163 amendment coherence
  with sibling PDRs and existing ADR.
- `code-reviewer` — final pass on any documentation file edits.

## Risk

Moderate. PDR creation in Practice Core requires owner direction per
PDR-003. Sub-agent risk-assessment from 2026-04-29 displaced-doctrine
report:

> The user's memory entry "Memory-feedback thread archived" notes the
> memory thread completed 2026-04-22; "Register triggers on substance
> not instance count" warns against owner-direction-gated work waiting
> indefinitely. A new PDR may need owner direction before it lands.

Mitigation: this plan is itself surfaced in the parent coordination
surface for owner scheduling.

## Cross-References

- Parent:
  [`2026-04-29-deferred-items-coordination.md`](2026-04-29-deferred-items-coordination.md).
- Source plan:
  [`sentry-observability-maximisation-mcp.plan.md`](../../observability/active/sentry-observability-maximisation-mcp.plan.md).
- Existing ADR-163:
  [`docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`](../../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).
- User-memory feedback: `feedback_build_vs_buy_first.md`.
