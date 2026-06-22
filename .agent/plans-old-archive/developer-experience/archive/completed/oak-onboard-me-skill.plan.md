---
name: "oak-onboard-me Interactive Onboarding Skill"
overview: "Build the onboard-me repo-working skill (published /oak-onboard-me): an interactive onboarding walker that branches by audience and need, detects machine state with read-only probes first, guides one go-ahead-gated step at a time, and reads ALL content from the live docs at walkthrough time (router-not-copy). Structural cure for the onboarding register's junior-friction items D1-D3 and the 5.5/10 contributor-approachability finding."
status: "COMPLETE — executed and proven 2026-06-12 (Vanilla lifts Chlorophyll, 8dca0d); archived same day with post-completion amendments recorded below"
todos:
  - id: c1-canonical
    content: "Write .agent/skills/onboard-me/SKILL-CANONICAL.md: frontmatter (name onboard-me, classification active, delegation-trigger description), buddy interaction contract, router principle + source-doc table, read-only detection table, journey graph (D0 audience fork; D1 access fork; branches A engineer trunk / B impact-strategy / C planning corpus / D prerequisites / E repo setup), re-entry-by-redetection, completion contract, failure handling, adapters pointer. Before writing the graph, re-verify every doc anchor it names (first-principles landing-path check). Zero embedded doc-content copies."
    status: completed
  - id: c2-adapters-settings
    content: "Build agent-tools; run the adapter generator (--prefix=oak-) emitting .claude/skills/oak-onboard-me/SKILL.md and .agents/skills/oak-onboard-me/SKILL.md. Owner-keyed step: add Skill(oak-onboard-me) + Skill(oak-onboard-me:*) to .claude/settings.json permissions.allow (owner pre-offered authorisation; request at the moment of edit). Gates: pnpm skills:check, pnpm portability:check, markdownlint --dot."
    status: completed
    depends_on: [c1-canonical]
  - id: c3-crossrefs
    content: "Discoverability wiring: the README 'Developers and AI agents' audience-routing block and docs/README Getting Started each gain a one-line /oak-onboard-me pointer; onboarding-expert template mandatory-reading table gains the canonical path (its executable-surfaces audit target); the onboarding register's Interactive Onboarding Inputs section gains a landed-status line. pnpm subagents:check after the template edit."
    status: completed
    depends_on: [c2-adapters-settings]
  - id: c4-verify-review-commit
    content: "Smoke-exercise the walker in-session (D0 renders; detection checklist true for this machine; one branch end-to-end with go-ahead gating). Paired reviewers: onboarding-expert (executable-surface vs static-docs consistency) + docs-adr-expert (router-not-copy, no moving targets); verify findings first-hand before acting. Commit per the commit skill: validated message, explicit pathspec, fresh git status (parallel consolidation session live)."
    status: completed
    depends_on: [c3-crossrefs]
isProject: false
---

# oak-onboard-me Interactive Onboarding Skill

**Created**: 2026-06-12 (owner-approved execution plan; design ratified in-session).
Design inputs and interaction contract are authoritative in the onboarding
status register —
[onboarding-simulations-public-alpha-readiness.md §Interactive Onboarding Inputs](../../active/onboarding-simulations-public-alpha-readiness.md#interactive-onboarding-inputs-12-june-2026)
— this plan holds execution only (ADR-117 single-authority layering).

## End goal

A newcomer of any audience — hands-on engineer, impact/strategy reader,
planning-corpus explorer, or someone needing prerequisites or repo setup —
reaches first success through one guided, resumable conversation, invoked as
`/oak-onboard-me`.

## Mechanism

An `active`-classified repo-working skill (ADR-189 category) whose canonical
body encodes a numbered decision-tree journey in the house style of
`undo-change`: detect state first with read-only probes, render an
`[x]`/`[ ]` checklist leading with what already works, then guide one
go-ahead-gated step at a time. **Router-not-copy is absolute**: the skill
carries the journey graph and the manners; every command, prerequisite, and
description is read from the live docs at walkthrough time, so the walker
cannot drift from them. Re-running the skill is the resume mechanism (designed
state-free; the owner reversed this after completion — see the amended
non-goal — and the shipped contract adds untracked, individual-scoped,
schema-versioned state under `.agent/state/onboarding/`).

## Acceptance criteria and proof contract

| Id | Acceptance | Proof level | Proof |
| --- | --- | --- | --- |
| c1 | Canonical ≤ ~200 lines (met at completion; owner scope additions afterwards — the Practice branch, headline invariants, and the persisted-state contract — grew the shipped canonical to ~300 lines); zero embedded doc-content copies; every named doc path resolves | non-code | first-hand read + `ls` per path |
| c2 | Both adapters generator-fresh; `pnpm skills:check` + `pnpm portability:check` exit 0; settings entries present (owner-authorised) | non-code | gate output |
| c3 | Pointers resolve both ways; `pnpm subagents:check` green | non-code | gate output + link check |
| c4 | One branch walked live with correct detection and gating; both reviewers report no blocking findings; commits green | value-proxy | session transcript + reviewer reports + commit SHAs |

True value (a real newcomer onboarding faster) is observable only post-release;
the register's pre-public-alpha rerun is the named measurement point.

## Prerequisites

- **Blocking**: owner authorisation for the `.claude/settings.json` edit at c2
  (pre-offered 2026-06-12; requested at the moment of edit).
- **Beneficial**: none — minimum shippable shape is the full plan.

## Non-goals

- No content embedding; no telemetry machinery. (*Amended 2026-06-12 after
  completion: the owner reversed the no-persisted-state non-goal — walkthrough
  state now persists in the untracked individual-scoped
  `.agent/state/onboarding/` path; see the register's Interactive Onboarding
  Inputs section for the decided shape.*)
- No workflow prescription beyond the two session bookends (owner-ratified).
- No platform-specific walkthrough variants beyond the generated adapters.
- No auto-run of slow verify gates or state-changing commands without explicit
  per-item go-ahead.
- No TDD cycles: the skill is prose instruction with no product code; proof is
  gates + live exercise + reviewer audit (testing-strategy adaptation for
  non-code artefacts, stated per plan-requirement 2).

## Risks

- **Anchor drift**: file-level pointers + "find the section about X" wording;
  the onboarding-expert reading table gains the canonical (c3) so audits cover
  the walker.
- **Probe/mutation confusion**: the detection table is marked read-only-only;
  the c4 reviewer brief checks it.
- **Reviewer false positives**: findings verified first-hand before acting.
- **Parallel consolidation session**: pathspec-scoped commits from fresh
  `git status`; no shared-registry files in bundles.

## Foundation alignment

`principles.md` simplicity-first (one canonical file, two generated adapters,
no state); `user-collaboration.md` §Onboarding (discovery-based simulation
stays the measurement instrument; the walker is a convenience layer);
no-moving-targets + replace-don't-bridge (router-not-copy);
ADR-125 (canonical + generated adapters); ADR-189 (repo-working skill);
PDR-018 / ADR-117 (plan form and single-authority layering). The plan-body
first-principles check fires at c1 (anchor re-verification before the graph is
written) and c4 (does the live walkthrough match the designed graph?).
Lifecycle per `../../../templates/components/lifecycle-triggers.md`; completion
archives this plan and mines the journey-graph notes into the register.
