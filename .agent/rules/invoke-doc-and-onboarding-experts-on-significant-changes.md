# Invoke Doc-ADR and Onboarding Experts on Significant Documentation or Practice Changes

Operationalises owner-stated standing doctrine: *"for all significant
documentation or Practice changes — and this is always true — we need
reviews from the documentation reviewer and the onboarding reviewer."*
Layered onto
[ADR-114 (Layered Sub-agent Prompt Composition)](../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)
and
[ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
that govern the broader expert dispatch matrix.

## The Rule

For any change set that is **significant documentation work** or any
change set that **mutates Practice surfaces**, dispatch *both* the
documentation expert (`docs-adr-expert`) **and** the onboarding expert
(`onboarding-expert`) before the work is considered complete.

The two reviewers are paired by design: doc-ADR audits permanence,
correctness, and ADR/PDR/TSDoc alignment; onboarding audits
discoverability, freshness, and entry-path correctness. Either alone
misses a class of failure the other catches.

## What Counts as "Significant"

A change is significant under this rule when any of the following hold:

- Adds, removes, renames, or substantially rewrites any file under
  `.agent/directives/`, `.agent/practice-core/`, `.agent/rules/`,
  `docs/architecture/architectural-decisions/`, `docs/governance/`,
  `docs/operations/`, or any host-equivalent permanent doctrine
  surface.
- Modifies any onboarding entry point: top-level `README.md`,
  `CONTRIBUTING.md`, platform memory files (`CLAUDE.md`, `AGENTS.md`,
  `GEMINI.md`, etc.), the `.agent/practice-index.md`, or
  `docs/engineering/` material that contributors hit on first arrival.
- Lands a new ADR, PDR, governance doc, or rule (every new permanent
  doctrine artefact).
- Renames a public command, skill, slash-command, agent name, or
  reviewer surface across multiple files (cross-reference sweeps are
  the canonical onboarding-fragility shape).
- Restructures a section of permanent doctrine such that the
  authoritative shape of a concept changes (the substance, not just
  the wording).

A change is *not* significant under this rule when it is:

- A typo fix or single-word clarification.
- Frontmatter-only edits (`fitness_*` tuning, `last_updated:`).
- Citation insertion that adds a link without changing the cited
  doctrine's substance.
- Source-code-only changes whose docs surface is auto-generated.

When in doubt, treat the change as significant.

## Dispatch Discipline

Run both reviewers in parallel after the change set is staged or
committed (whichever cycle the broader work follows). The two
reviewers receive briefs scoped to their respective lenses:

- **`docs-adr-expert`** brief: "audit the documentation drift,
  ADR/PDR/TSDoc alignment, and permanent-vs-ephemeral homing for the
  staged change set."
- **`onboarding-expert`** brief: "audit the human and AI-agent
  onboarding paths for freshness, discoverability, and first-success
  speed against the staged change set."

Capture findings explicitly. Findings that surface a missing or stale
permanent doc are blocking; findings that surface friction or freshness
risk are routed to the prioritised remediation list.

## Composition with the Broader Reviewer Matrix

This rule does not replace `code-expert` (the gateway reviewer per
[`invoke-code-experts`](invoke-code-experts.md)). Code-expert remains
the gateway for source-code changes; this rule fires *additionally*
for documentation and Practice changes.

For change sets that mix code and significant documentation, the
`code-expert` gateway dispatch and this rule's pair both fire.

## Doctrinal Anchors

- Owner-stated standing direction 2026-05-02:
  *"for all significant documentation or Practice changes — and this
  is always true — we need reviews from the documentation reviewer and
  the onboarding reviewer."*
- [`invoke-code-experts`](invoke-code-experts.md) — broader reviewer
  matrix that this rule extends with two named, always-paired
  specialists for documentation and onboarding lanes.
- [`.agent/memory/executive/invoke-code-experts.md`](../memory/executive/invoke-code-experts.md)
  — the full reviewer catalogue.
- ADR-114 (Layered Sub-agent Prompt Composition).
- ADR-129 (Domain Specialist Capability Pattern).
