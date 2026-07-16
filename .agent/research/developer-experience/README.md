# Developer Experience Research

Date: 3 April 2026

## Purpose

This directory collects developer-experience research that informs Oak's
agentic engineering system, documentation posture, and onboarding quality.

It currently has three layers:

- stable local research and playbooks
- onboarding review material
- a local ignored `novel/` lane for source-faithful report recovery and
  semantic-atlas work

The `novel/` directory remains a local repair lane. Raw imports and sibling
clean copies can coexist there while later promotion into tracked, semantically
meaningful homes is deferred.

## Local research

- [architectural-enforcement-playbook.md](./architectural-enforcement-playbook.md)
  Repo-facing enforcement patterns, guardrails, and architectural pressure
  points.

- [2026-02-20-onboarding-review.md](./2026-02-20-onboarding-review.md)
  Onboarding friction, quality observations, and improvement opportunities.

- [codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md](./codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md)
  Concept exploration, official Claude/Codex mechanics, the Gitleaks privacy compromise,
  the implemented standalone and benchmark-embedded six-call Spark/Luna feasibility gate with its
  later tournament blocked pending independent corpus-label agreement, and the explicitly non-MVP
  `ReviewSubject`/three-adapter seam for reciprocal vendor review. Includes the owner-directed,
  fixture-locked Codex `PostToolUse` experiment, its fixed process-session ledger, and its
  synchronous-latency decision boundary.

## Local external research lane

- [novel/README.md] (`./novel/README.md`)
  Local guide to raw imports, sibling clean copies, and semantic-atlas
  material in the ignored repair lane.

## Suggested use

- Start with local research when the question is about Oak's current doctrine
  or onboarding.
- Use `novel/README.md` locally when the question is about source-faithful
  external report recovery or inspection. Promotion into tracked canon is a
  later session.
